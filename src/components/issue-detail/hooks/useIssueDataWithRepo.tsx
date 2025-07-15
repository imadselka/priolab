
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Issue {
  id: string;
  number: number;
  title: string;
  body: string | null;
  state: string;
  labels: string[];
  html_url: string;
  author_login: string;
  author_avatar_url: string | null;
  github_created_at: string;
  comments_count: number;
  repository_id: string;
  repositories?: {
    full_name: string;
  };
}

export const useIssueDataWithRepo = (issueId: string, owner?: string, repo?: string) => {
  const { user } = useAuth();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [voteCount, setVoteCount] = useState(0);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const loadIssue = useCallback(async () => {
    setLoading(true);
    try {
      // Check if issueId is a UUID or a GitHub issue number
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(issueId);
      
      let query = supabase
        .from('issues')
        .select(`
          *,
          repositories (full_name)
        `);

      if (isUUID) {
        // Search by UUID
        query = query.eq('id', issueId);
      } else if (owner && repo) {
        // Search by GitHub issue number and repository
        const fullName = `${owner}/${repo}`;
        const { data: repoData } = await supabase
          .from('repositories')
          .select('id')
          .eq('full_name', fullName)
          .maybeSingle();

        if (repoData) {
          query = query
            .eq('number', parseInt(issueId))
            .eq('repository_id', repoData.id);
        } else {
          console.error('Repository not found:', fullName);
          setIssue(null);
          return;
        }
      } else {
        // Search by GitHub issue number without repository info
        query = query.eq('number', parseInt(issueId));
      }

      const { data: issueData, error: issueError } = await query.maybeSingle();

      if (issueError || !issueData) {
        console.error('Issue not found:', issueError);
        setIssue(null);
        return;
      }

      setIssue(issueData);

      // Load votes if user is authenticated
      if (user && issueData.id) {
        const { data: votes } = await supabase
          .from('votes')
          .select('vote_type, user_id')
          .eq('issue_id', issueData.id);

        const upVotes = votes?.filter(v => v.vote_type === 'up').length || 0;
        const downVotes = votes?.filter(v => v.vote_type === 'down').length || 0;
        const calculatedVoteCount = upVotes - downVotes;
        
        const userVoteData = votes?.find(v => v.user_id === user.id);
        const userVoteType = userVoteData?.vote_type === 'up' || userVoteData?.vote_type === 'down' 
          ? userVoteData.vote_type 
          : null;

        setVoteCount(calculatedVoteCount);
        setUserVote(userVoteType);
      }
    } catch (error) {
      console.error('Error loading issue:', error);
      setIssue(null);
    } finally {
      setLoading(false);
    }
  }, [issueId, owner, repo, user?.id]);

  useEffect(() => {
    loadIssue();
  }, [loadIssue]);

  const updateVote = useCallback((newCount: number, newUserVote: 'up' | 'down' | null) => {
    setVoteCount(newCount);
    setUserVote(newUserVote);
  }, []);

  return {
    issue,
    loading,
    voteCount,
    userVote,
    updateVote,
    refetch: loadIssue
  };
};
