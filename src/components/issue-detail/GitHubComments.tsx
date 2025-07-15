
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronUp, ChevronDown, MessageSquare, Heart, ThumbsUp, Laugh, Angry } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CommentReactions, CommentVotes } from "@/types/common";
import ReactMarkdown from "react-markdown";

interface GitHubComment {
  id: string;
  github_id: number;
  body: string;
  author_login: string;
  author_avatar_url: string | null;
  html_url: string;
  github_created_at: string;
  github_updated_at: string;
}

// Define the GitHub API comment structure
interface GitHubApiComment {
  id: number;
  body: string;
  user: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  created_at: string;
  updated_at: string;
}

interface GitHubCommentsProps {
  issueId: string;
  owner: string;
  repo: string;
  issueNumber: number;
}

export const GitHubComments = ({ issueId, owner, repo, issueNumber }: GitHubCommentsProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<GitHubComment[]>([]);
  const [loading, setLoading] = useState(true);  
  const [commentReactions, setCommentReactions] = useState<Record<string, CommentReactions>>({});
  const [commentVotes, setCommentVotes] = useState<Record<string, CommentVotes>>({});

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      
      // First try to fetch from GitHub API if we have owner, repo and issue number
      if (owner && repo && issueNumber) {
        try {
          const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`);
          if (response.ok) {
            const githubComments = await response.json() as GitHubApiComment[];
            
            // Transform GitHub API response to our format
            const formattedComments = githubComments.map((comment: GitHubApiComment) => ({
              id: `github-${comment.id}`,
              github_id: comment.id,
              body: comment.body,
              author_login: comment.user.login,
              author_avatar_url: comment.user.avatar_url,
              html_url: comment.html_url,
              github_created_at: comment.created_at,
              github_updated_at: comment.updated_at
            }));
            
            setComments(formattedComments);
            return;
          }
        } catch (error) {
          console.error('Error fetching from GitHub API:', error);
          // Fall back to database if GitHub API fails
        }
      }
      
      // Fallback to database
      const { data: comments } = await supabase
        .from('github_comments')
        .select('*')
        .eq('issue_id', issueId)
        .order('github_created_at', { ascending: true });

      if (comments) {
        setComments(comments);
        await loadReactionsAndVotes(comments);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  }, [issueId, owner, repo, issueNumber]);

  const loadReactionsAndVotes = async (comments: GitHubComment[]) => {
    if (!user) return;

    const commentIds = comments.map(c => c.id);
    
    // Load reactions
    const { data: reactions } = await supabase
      .from('comment_reactions')
      .select('*')
      .in('comment_id', commentIds);

    // Load votes
    const { data: votes } = await supabase
      .from('comment_votes')
      .select('*')
      .in('comment_id', commentIds);

    // Process reactions by comment
    const reactionsByComment: Record<string, CommentReactions> = {};
    reactions?.forEach(reaction => {
      if (!reactionsByComment[reaction.comment_id]) {        
        reactionsByComment[reaction.comment_id] = {
          heart: 0, like: 0, laugh: 0, angry: 0,
          userReaction: null
        };
      }
      reactionsByComment[reaction.comment_id][reaction.reaction_type]++;
      if (reaction.user_id === user.id) {
        reactionsByComment[reaction.comment_id].userReaction = reaction.reaction_type;
      }
    });

    // Process votes by comment
    const votesByComment: Record<string, CommentVotes> = {};
    votes?.forEach(vote => {
      if (!votesByComment[vote.comment_id]) {
        votesByComment[vote.comment_id] = { up: 0, down: 0, userVote: null };
      }
      votesByComment[vote.comment_id][vote.vote_type === 'up' ? 'up' : 'down']++;
      if (vote.user_id === user.id) {
        votesByComment[vote.comment_id].userVote = vote.vote_type as 'up' | 'down';
      }
    });

    setCommentReactions(reactionsByComment);
    setCommentVotes(votesByComment);
  };

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleReaction = async (commentId: string, reactionType: string) => {
    if (!user) return;

    const currentReaction = commentReactions[commentId]?.userReaction;
    
    if (currentReaction === reactionType) {
      // Remove reaction
      await supabase
        .from('comment_reactions')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user.id);
    } else {
      // Add or update reaction
      await supabase
        .from('comment_reactions')
        .upsert({
          comment_id: commentId,
          user_id: user.id,
          reaction_type: reactionType
        });
    }

    loadReactionsAndVotes(comments);
  };

  const handleVote = async (commentId: string, voteType: 'up' | 'down') => {
    if (!user) return;

    const currentVote = commentVotes[commentId]?.userVote;
    
    if (currentVote === voteType) {
      // Remove vote
      await supabase
        .from('comment_votes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user.id);
    } else {
      // Add or update vote
      await supabase
        .from('comment_votes')
        .upsert({
          comment_id: commentId,
          user_id: user.id,
          vote_type: voteType
        });
    }

    loadReactionsAndVotes(comments);
  };
  
  const getReactionIcon = (type: string) => {
    switch (type) {
      case 'heart': return <Heart className="w-4 h-4" />;
      case 'like': return <ThumbsUp className="w-4 h-4" />;
      case 'laugh': return <Laugh className="w-4 h-4" />;
      case 'angry': return <Angry className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>GitHub Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-lg font-medium">GitHub Comments ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No GitHub comments yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10 border border-gray-200">
                    <AvatarImage src={comment.author_avatar_url || undefined} />
                    <AvatarFallback>{comment.author_login.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-md border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{comment.author_login}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(comment.github_created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{comment.body}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
