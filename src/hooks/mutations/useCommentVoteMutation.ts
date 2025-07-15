
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PlatformComment, QueryError } from '@/types/common';

export const useCommentVoteMutation = (issueId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, voteType }: { commentId: string; voteType: 'up' | 'down' }) => {
      if (!user) throw new Error('User not authenticated');

      try {
        // Get current vote with proper error handling
        const { data, error } = await supabase
          .from('comment_votes')
          .select('vote_type')
          .eq('comment_id', commentId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        const currentVote = data?.vote_type || null;

        if (currentVote === voteType) {
          // Remove vote
          const { error: deleteError } = await supabase
            .from('comment_votes')
            .delete()
            .eq('comment_id', commentId)
            .eq('user_id', user.id);

          if (deleteError) throw deleteError;
          return { commentId, voteType, removed: true };
        } else {
          // Add or update vote using upsert with proper conflict resolution
          const { error: upsertError } = await supabase
            .from('comment_votes')
            .upsert(
              {
                comment_id: commentId,
                user_id: user.id,
                vote_type: voteType
              },
              {
                onConflict: 'comment_id,user_id',
                ignoreDuplicates: false
              }
            );

          if (upsertError) throw upsertError;
          return { commentId, voteType, removed: false };
        }
      } catch (error) {
        console.error('Comment vote mutation error:', error);
        throw error;
      }
    },
    onMutate: async ({ commentId, voteType }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['platform-comments', issueId] });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData(['platform-comments', issueId]);      // Optimistically update the cache
      queryClient.setQueryData(['platform-comments', issueId], (old: PlatformComment[] | undefined) => {
        if (!old) return old;
        
        // Update the specific comment's votes
        const updateCommentVotes = (comments: PlatformComment[]): PlatformComment[] => {
          return comments.map(comment => {
            if (comment.id === commentId) {
              const votes = comment.votes || { up: 0, down: 0, userVote: null };
              
              if (votes.userVote === voteType) {
                // Remove vote
                return {
                  ...comment,
                  votes: {
                    ...votes,
                    [voteType]: Math.max(0, votes[voteType] - 1),
                    userVote: null
                  }
                };
              } else {
                // Add/change vote
                const newVotes = { ...votes };
                
                // Remove previous vote count
                if (votes.userVote) {
                  newVotes[votes.userVote] = Math.max(0, newVotes[votes.userVote] - 1);
                }
                
                // Add new vote count
                newVotes[voteType] = newVotes[voteType] + 1;
                newVotes.userVote = voteType;
                
                return {
                  ...comment,
                  votes: newVotes
                };
              }
            }
            
            // Also update replies
            if (comment.replies) {
              return {
                ...comment,
                replies: updateCommentVotes(comment.replies)
              };
            }
            
            return comment;
          });
        };

        return updateCommentVotes(old);
      });

      return { previousComments };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousComments) {
        queryClient.setQueryData(['platform-comments', issueId], context.previousComments);
      }
    },
    onSuccess: () => {
      // Invalidate and refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['platform-comments', issueId] });
    },
    retry: (failureCount: number, error: QueryError) => {
      if (error?.code === '409' || error?.code === 'PGRST116') {
        return failureCount < 2;
      }
      return false;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
