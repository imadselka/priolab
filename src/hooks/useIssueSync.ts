import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { syncIssueToDatabase } from '@/services/issueSync';

interface GitHubIssueData {
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
  repositories?: {
    full_name: string;
  };
}

export const useIssueSync = (
  githubIssue: GitHubIssueData | null,
  repositoryOwner?: string,
  repositoryName?: string
) => {
  const { user } = useAuth();
  const [databaseIssueId, setDatabaseIssueId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncIssue = async () => {
      if (!githubIssue || !repositoryOwner || !repositoryName || !user) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Convert simplified interface to full GitHub API format
        const fullGitHubIssue = {
          id: parseInt(githubIssue.id),
          number: githubIssue.number,
          title: githubIssue.title,
          body: githubIssue.body || '',
          state: githubIssue.state,
          labels: githubIssue.labels.map(name => ({ name, color: '' })),
          user: {
            login: githubIssue.author_login,
            avatar_url: githubIssue.author_avatar_url || ''
          },
          html_url: githubIssue.html_url,
          created_at: githubIssue.github_created_at,
          updated_at: githubIssue.github_created_at, // Fallback to created_at
          closed_at: githubIssue.state === 'closed' ? githubIssue.github_created_at : null,
          comments: githubIssue.comments_count || 0
        };

        const syncedIssue = await syncIssueToDatabase(
          repositoryOwner,
          repositoryName,
          fullGitHubIssue,
          user.id
        );

        setDatabaseIssueId(syncedIssue.id);
      } catch (err) {
        console.error('Error syncing issue:', err);
        setError(err instanceof Error ? err.message : 'Failed to sync issue');
      } finally {
        setLoading(false);
      }
    };

    syncIssue();
  }, [githubIssue, repositoryOwner, repositoryName, user]);

  return {
    databaseIssueId,
    loading,
    error
  };
};
