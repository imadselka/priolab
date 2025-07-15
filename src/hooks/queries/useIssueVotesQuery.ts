
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useIssueVotesQuery = (issueId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['issue-votes', issueId, user?.id],
    queryFn: async () => {
      if (!issueId) {
        return { voteCount: 0, userVote: null };
      }

      const { data: votes } = await supabase
        .from('votes')
        .select('vote_type, user_id')
        .eq('issue_id', issueId);

      const upVotes = votes?.filter(v => v.vote_type === 'up').length || 0;
      const downVotes = votes?.filter(v => v.vote_type === 'down').length || 0;
      const voteCount = upVotes - downVotes;
      
      const userVoteData = user ? votes?.find(v => v.user_id === user.id) : null;
      const userVote = userVoteData?.vote_type === 'up' || userVoteData?.vote_type === 'down' 
        ? userVoteData.vote_type 
        : null;

      return { voteCount, userVote };
    },
    enabled: !!issueId && !!user,
  });
};
