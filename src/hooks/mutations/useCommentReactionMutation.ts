
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { PlatformComment, QueryError } from '@/types/common';

const VALID_REACTION_TYPES = ['heart', 'like', 'laugh', 'angry'] as const;

export const useCommentReactionMutation = (issueId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, reactionType }: { commentId: string; reactionType: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      // Map frontend reaction types to database types
      const reactionTypeMap: Record<string, string> = {
        'heart': 'heart',
        'like': 'like',
        'laugh': 'laugh',
        'angry': 'angry'
      };
      
      const dbReactionType = reactionTypeMap[reactionType] || reactionType;
        // Validate reaction type to prevent 400 errors
      if (!VALID_REACTION_TYPES.includes(dbReactionType as typeof VALID_REACTION_TYPES[number])) {
        throw new Error(`Invalid reaction type: ${reactionType}`);
      }

      try {
        // Get current reaction with proper error handling
        const { data, error } = await supabase
          .from('comment_reactions')
          .select('reaction_type')
          .eq('comment_id', commentId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        const currentReaction = data?.reaction_type || null;

        if (currentReaction === dbReactionType) {
          // Remove reaction
          const { error: deleteError } = await supabase
            .from('comment_reactions')
            .delete()
            .eq('comment_id', commentId)
            .eq('user_id', user.id);

          if (deleteError) throw deleteError;
          return { commentId, reactionType: dbReactionType, removed: true };
        } else {
          // Remove old reaction if exists, then add new one
          if (currentReaction) {
            const { error: deleteError } = await supabase
              .from('comment_reactions')
              .delete()
              .eq('comment_id', commentId)
              .eq('user_id', user.id);

            if (deleteError) throw deleteError;
          }

          // Add new reaction
          const { error: insertError } = await supabase
            .from('comment_reactions')
            .insert({
              comment_id: commentId,
              user_id: user.id,
              reaction_type: dbReactionType
            });

          if (insertError) throw insertError;
          return { commentId, reactionType: dbReactionType, removed: false, previousReaction: currentReaction };
        }
      } catch (error) {
        console.error('Comment reaction mutation error:', error);
        throw error;
      }
    },
    onMutate: async ({ commentId, reactionType }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['platform-comments', issueId] });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData(['platform-comments', issueId]);      // Optimistically update the cache
      queryClient.setQueryData(['platform-comments', issueId], (old: PlatformComment[] | undefined) => {
        if (!old) return old;
        
        // Update the specific comment's reactions
        const updateCommentReactions = (comments: PlatformComment[]): PlatformComment[] => {
          return comments.map(comment => {if (comment.id === commentId) {
              const reactions = comment.reactions || { heart: 0, like: 0, laugh: 0, angry: 0, userReaction: null };
              
              if (reactions.userReaction === reactionType) {
                // Remove reaction
                return {
                  ...comment,
                  reactions: {
                    ...reactions,
                    [reactionType]: Math.max(0, (reactions[reactionType] || 0) - 1),
                    userReaction: null
                  }
                };
              } else {
                // Add/change reaction
                const newReactions = { ...reactions };
                
                // Remove previous reaction count
                if (reactions.userReaction) {
                  newReactions[reactions.userReaction] = Math.max(0, (newReactions[reactions.userReaction] || 0) - 1);
                }
                
                // Add new reaction count
                newReactions[reactionType] = (newReactions[reactionType] || 0) + 1;
                newReactions.userReaction = reactionType;
                
                return {
                  ...comment,
                  reactions: newReactions
                };
              }
            }
            
            // Also update replies
            if (comment.replies) {
              return {
                ...comment,
                replies: updateCommentReactions(comment.replies)
              };
            }
            
            return comment;
          });
        };

        return updateCommentReactions(old);
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
