
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

export const useIssueQuery = (issueId: string, owner?: string, repo?: string) => {
  return useQuery({
    queryKey: ['issue', issueId, owner, repo],
    queryFn: async (): Promise<Issue | null> => {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(issueId);
      
      let query = supabase
        .from('issues')
        .select(`
          *,
          repositories (full_name)
        `);

      if (isUUID) {
        query = query.eq('id', issueId);
      } else if (owner && repo) {
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
          throw new Error(`Repository not found: ${fullName}`);
        }
      } else {
        query = query.eq('number', parseInt(issueId));
      }

      const { data, error } = await query.maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!issueId,
  });
};
