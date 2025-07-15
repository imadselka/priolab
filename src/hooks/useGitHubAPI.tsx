
import { useState } from 'react';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  owner: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  open_issues_count: number;
  forks_count: number;
}

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: string;
  labels: Array<{ name: string; color: string }>;
  user: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  comments: number;
}

interface SearchResponse<T> {
  total_count: number;
  items: T[];
}

export const useGitHubAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeGitHubRequest = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Issue-Priority-Forge'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
  };

  const fetchTrendingRepositories = async (
    timeFilter: string = 'weekly',
    language?: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<SearchResponse<GitHubRepo>> => {
    setLoading(true);
    setError(null);

    try {
      // For trending, we'll search for most starred repositories
      let query = 'stars:>1000'; // Only get repos with significant stars
      
      if (language && language !== 'all') {
        query += ` language:${language}`;
      }

      // Add time filter for recently updated repos
      if (timeFilter !== 'all') {
        const date = new Date();
        const days = timeFilter === 'daily' ? 1 : timeFilter === 'weekly' ? 7 : 30;
        date.setDate(date.getDate() - days);
        const dateString = date.toISOString().split('T')[0];
        query += ` pushed:>${dateString}`;
      }

      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&page=${page}&per_page=${perPage}`;
      const data = await makeGitHubRequest(url);

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch trending repositories';
      setError(errorMessage);
      return { total_count: 0, items: [] };
    } finally {
      setLoading(false);
    }
  };

  const searchRepositories = async (
    query: string,
    language?: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<SearchResponse<GitHubRepo>> => {
    setLoading(true);
    setError(null);

    try {
      let searchQuery = query;
      if (language && language !== 'all') {
        searchQuery += ` language:${language}`;
      }

      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&page=${page}&per_page=${perPage}`;
      const data = await makeGitHubRequest(url);

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search repositories';
      setError(errorMessage);
      return { total_count: 0, items: [] };
    } finally {
      setLoading(false);
    }
  };

  const fetchRepoIssues = async (
    owner: string,
    repo: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<GitHubIssue[]> => {
    setLoading(true);
    setError(null);

    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&page=${page}&per_page=${perPage}`;
      const data = await makeGitHubRequest(url);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch repository issues';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchIssueById = async (owner: string, repo: string, issueNumber: number): Promise<GitHubIssue | null> => {
    setLoading(true);
    setError(null);

    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`;
      const data = await makeGitHubRequest(url);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch issue';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchTrendingRepositories,
    searchRepositories,
    fetchRepoIssues,
    fetchIssueById
  };
};
