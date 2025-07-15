
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { QueryError } from '@/types/common';

export const useVoteMutation = (issueId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ voteType }: { voteType: 'up' | 'down' }) => {
      if (!user) throw new Error('User not authenticated');

      try {
        // Use a more robust upsert with proper conflict resolution
        const { data, error } = await supabase
          .from('votes')
          .select('vote_type')
          .eq('issue_id', issueId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        const currentVote = data?.vote_type || null;

        if (currentVote === voteType) {
          // Remove vote
          const { error: deleteError } = await supabase
            .from('votes')
            .delete()
            .eq('issue_id', issueId)
            .eq('user_id', user.id);

          if (deleteError) throw deleteError;
          return { voteType, removed: true };
        } else {
          // Add or update vote using upsert with conflict resolution
          const { error: upsertError } = await supabase
            .from('votes')
            .upsert(
              {
                issue_id: issueId,
                user_id: user.id,
                vote_type: voteType
              },
              {
                onConflict: 'issue_id,user_id',
                ignoreDuplicates: false
              }
            );

          if (upsertError) throw upsertError;
          return { voteType, removed: false };
        }
      } catch (error) {
        console.error('Vote mutation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issue-votes', issueId] });
    },
    // Add retry logic for transient errors
    retry: (failureCount: number, error: QueryError) => {
      if (error?.code === '409' || error?.code === 'PGRST116') {
        return failureCount < 2;
      }
      return false;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
