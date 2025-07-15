
export interface PlatformComment {
  id: string;
  content: string;
  user_id: string;
  parent_id: string | null;
  created_at: string;
  profiles?: {
    name: string | null;
    github_username: string | null;
    avatar_url: string | null;
  } | null;
  replies?: PlatformComment[];
}

export interface PlatformCommentsProps {
  issueId?: string; // Make optional since it might be undefined during sync
}
