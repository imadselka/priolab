// Common types used across the application

export interface CommentReactions {
  heart: number;
  like: number;
  laugh: number;
  angry: number;
  sad?: number;
  userReaction?: string | null;
}

export interface CommentVotes {
  up: number;
  down: number;
  userVote?: 'up' | 'down' | null;
}

export interface User {
  id: string;
  login: string;
  avatar_url: string;
  name?: string;
  email?: string;
}

export interface Repository {
  id: string;
  github_id: number;
  full_name: string;
  name: string;
  owner_login: string;
  description?: string;
  html_url: string;
  language?: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  private: boolean;
  fork: boolean;
  archived: boolean;
  default_branch: string;
  topics: string[];
  license?: {
    name: string;
  };
  owner: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
}

export interface PlatformComment {
  id: string;
  issue_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: User;
  replies?: PlatformComment[];
  reactions?: CommentReactions;
  votes?: CommentVotes;
}

export interface QueryError {
  code: string;
  details: string | null;
  hint: string | null;
  message: string;
}

export interface MutationContext {
  failureCount: number;
  error: QueryError;
}

export type ReactionType = 'heart' | 'like' | 'laugh' | 'angry' | 'sad';
export type VoteType = 'up' | 'down';

export interface FilterOption {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}
