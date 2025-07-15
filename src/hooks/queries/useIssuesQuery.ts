
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Tables } from '@/integrations/supabase/types';

type Issue = Tables<'issues'> & {
  repositories: Tables<'repositories'>;
  votes_count?: number;
  user_vote?: 'up' | 'down' | null;
};

export const useIssuesQuery = (sortBy: string, filter: string, searchQuery: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['issues', sortBy, filter, searchQuery, user?.id],
    queryFn: async (): Promise<Issue[]> => {
      if (!user) return [];

      let query = supabase
        .from('issues')
        .select(`
          *,
          repositories (*)
        `)
        .eq('user_id', user.id)
        .order('github_created_at', { ascending: false });

      if (filter === 'open') {
        query = query.eq('state', 'open');
      } else if (filter === 'closed') {
        query = query.eq('state', 'closed');
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,body.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;

      // Fetch votes for each issue
      const issuesWithVotes = await Promise.all(
        (data || []).map(async (issue) => {
          const { data: votes } = await supabase
            .from('votes')
            .select('vote_type, user_id')
            .eq('issue_id', issue.id);

          const upVotes = votes?.filter(v => v.vote_type === 'up').length || 0;
          const downVotes = votes?.filter(v => v.vote_type === 'down').length || 0;
          const votes_count = upVotes - downVotes;
          
          const userVote = user ? votes?.find(v => v.user_id === user.id)?.vote_type || null : null;

          return {
            ...issue,
            votes_count,
            user_vote: userVote as 'up' | 'down' | null
          };
        })
      );

      // Sort issues
      if (sortBy === 'votes') {
        issuesWithVotes.sort((a, b) => (b.votes_count || 0) - (a.votes_count || 0));
      } else if (sortBy === 'recent') {
        issuesWithVotes.sort((a, b) => new Date(b.github_created_at).getTime() - new Date(a.github_created_at).getTime());
      } else if (sortBy === 'comments') {
        issuesWithVotes.sort((a, b) => (b.comments_count || 0) - (a.comments_count || 0));
      }

      return issuesWithVotes;
    },
    enabled: !!user,
  });
};
