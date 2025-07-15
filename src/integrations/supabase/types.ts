export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comment_reactions: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          reaction_type: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "platform_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_votes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
          vote_type: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          vote_type: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "platform_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      github_comments: {
        Row: {
          author_avatar_url: string | null
          author_login: string
          body: string
          created_at: string
          github_created_at: string
          github_id: number
          github_updated_at: string
          html_url: string
          id: string
          issue_id: string
          updated_at: string
        }
        Insert: {
          author_avatar_url?: string | null
          author_login: string
          body: string
          created_at?: string
          github_created_at: string
          github_id: number
          github_updated_at: string
          html_url: string
          id?: string
          issue_id: string
          updated_at?: string
        }
        Update: {
          author_avatar_url?: string | null
          author_login?: string
          body?: string
          created_at?: string
          github_created_at?: string
          github_id?: number
          github_updated_at?: string
          html_url?: string
          id?: string
          issue_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "github_comments_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_reactions: {
        Row: {
          created_at: string
          id: string
          issue_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          issue_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          issue_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_reactions_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          assignees: string[] | null
          author_avatar_url: string | null
          author_login: string
          body: string | null
          comments_count: number | null
          created_at: string
          github_closed_at: string | null
          github_created_at: string
          github_id: number
          github_updated_at: string
          html_url: string
          id: string
          labels: string[] | null
          milestone: string | null
          number: number
          repository_id: string
          state: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assignees?: string[] | null
          author_avatar_url?: string | null
          author_login: string
          body?: string | null
          comments_count?: number | null
          created_at?: string
          github_closed_at?: string | null
          github_created_at: string
          github_id: number
          github_updated_at: string
          html_url: string
          id?: string
          labels?: string[] | null
          milestone?: string | null
          number: number
          repository_id: string
          state: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assignees?: string[] | null
          author_avatar_url?: string | null
          author_login?: string
          body?: string | null
          comments_count?: number | null
          created_at?: string
          github_closed_at?: string | null
          github_created_at?: string
          github_id?: number
          github_updated_at?: string
          html_url?: string
          id?: string
          labels?: string[] | null
          milestone?: string | null
          number?: number
          repository_id?: string
          state?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issues_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          related_comment_id: string | null
          related_issue_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          related_comment_id?: string | null
          related_issue_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          related_comment_id?: string | null
          related_issue_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_comment_id_fkey"
            columns: ["related_comment_id"]
            isOneToOne: false
            referencedRelation: "platform_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_issue_id_fkey"
            columns: ["related_issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          issue_id: string
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          issue_id: string
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          issue_id?: string
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_comments_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "platform_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          blog: string | null
          company: string | null
          created_at: string
          email: string | null
          followers: number | null
          following: number | null
          github_created_at: string | null
          github_id: number | null
          github_username: string | null
          id: string
          location: string | null
          name: string | null
          public_gists: number | null
          public_repos: number | null
          twitter_username: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          blog?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          followers?: number | null
          following?: number | null
          github_created_at?: string | null
          github_id?: number | null
          github_username?: string | null
          id?: string
          location?: string | null
          name?: string | null
          public_gists?: number | null
          public_repos?: number | null
          twitter_username?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          blog?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          followers?: number | null
          following?: number | null
          github_created_at?: string | null
          github_id?: number | null
          github_username?: string | null
          id?: string
          location?: string | null
          name?: string | null
          public_gists?: number | null
          public_repos?: number | null
          twitter_username?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      repositories: {
        Row: {
          clone_url: string | null
          created_at: string
          default_branch: string | null
          description: string | null
          forks_count: number | null
          full_name: string
          github_created_at: string | null
          github_id: number
          github_updated_at: string | null
          html_url: string
          id: string
          is_archived: boolean | null
          is_fork: boolean | null
          is_private: boolean | null
          language: string | null
          license_name: string | null
          name: string
          open_issues_count: number | null
          owner_login: string
          ssh_url: string | null
          stargazers_count: number | null
          topics: string[] | null
          trending_score: number | null
          updated_at: string
          user_id: string | null
          watchers_count: number | null
        }
        Insert: {
          clone_url?: string | null
          created_at?: string
          default_branch?: string | null
          description?: string | null
          forks_count?: number | null
          full_name: string
          github_created_at?: string | null
          github_id: number
          github_updated_at?: string | null
          html_url: string
          id?: string
          is_archived?: boolean | null
          is_fork?: boolean | null
          is_private?: boolean | null
          language?: string | null
          license_name?: string | null
          name: string
          open_issues_count?: number | null
          owner_login: string
          ssh_url?: string | null
          stargazers_count?: number | null
          topics?: string[] | null
          trending_score?: number | null
          updated_at?: string
          user_id?: string | null
          watchers_count?: number | null
        }
        Update: {
          clone_url?: string | null
          created_at?: string
          default_branch?: string | null
          description?: string | null
          forks_count?: number | null
          full_name?: string
          github_created_at?: string | null
          github_id?: number
          github_updated_at?: string | null
          html_url?: string
          id?: string
          is_archived?: boolean | null
          is_fork?: boolean | null
          is_private?: boolean | null
          language?: string | null
          license_name?: string | null
          name?: string
          open_issues_count?: number | null
          owner_login?: string
          ssh_url?: string | null
          stargazers_count?: number | null
          topics?: string[] | null
          trending_score?: number | null
          updated_at?: string
          user_id?: string | null
          watchers_count?: number | null
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string
          id: string
          repository_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          repository_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          repository_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follows_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_repositories: {
        Row: {
          created_at: string
          id: string
          is_following: boolean | null
          repository_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_following?: boolean | null
          repository_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_following?: boolean | null
          repository_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_repositories_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_repository_watches: {
        Row: {
          created_at: string | null
          id: string
          repository_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          repository_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          repository_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_repository_watches_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      votes: {
        Row: {
          created_at: string
          id: string
          issue_id: string
          updated_at: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          issue_id: string
          updated_at?: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          issue_id?: string
          updated_at?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
