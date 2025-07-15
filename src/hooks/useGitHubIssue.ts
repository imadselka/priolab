
import { useState, useEffect } from 'react';

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

export const useGitHubIssue = (issueNumber: string, owner?: string, repo?: string) => {
  const [issue, setIssue] = useState<GitHubIssueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIssue = async () => {
      if (!owner || !repo || !issueNumber) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Issue-Priority-Forge'
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError(`Issue #${issueNumber} not found in ${owner}/${repo}`);
          } else if (response.status === 403) {
            setError('GitHub API rate limit exceeded. Please try again later.');
          } else {
            setError(`GitHub API error: ${response.status}`);
          }
          setIssue(null);
          return;
        }

        const githubIssue = await response.json();
        
        // Transform GitHub API response to match our interface
        const transformedIssue: GitHubIssueData = {
          id: githubIssue.id.toString(),
          number: githubIssue.number,
          title: githubIssue.title,
          body: githubIssue.body,
          state: githubIssue.state,
          labels: githubIssue.labels.map((label: { name: string }) => label.name),
          html_url: githubIssue.html_url,
          author_login: githubIssue.user.login,
          author_avatar_url: githubIssue.user.avatar_url,
          github_created_at: githubIssue.created_at,
          comments_count: githubIssue.comments,
          repositories: {
            full_name: `${owner}/${repo}`
          }
        };
        
        setIssue(transformedIssue);
      } catch (error) {
        console.error('Error loading GitHub issue:', error);
        setError(error instanceof Error ? error.message : 'Failed to load issue');
        setIssue(null);
      } finally {
        setLoading(false);
      }
    };

    loadIssue();
  }, [issueNumber, owner, repo]);

  return { issue, loading, error };
};
