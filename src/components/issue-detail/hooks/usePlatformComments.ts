
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PlatformComment } from "../types/platformComments";
import { CommentReactions, CommentVotes } from "@/types/common";

export const usePlatformComments = (issueId?: string) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<PlatformComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentReactions, setCommentReactions] = useState<Record<string, CommentReactions>>({});
  const [commentVotes, setCommentVotes] = useState<Record<string, CommentVotes>>({});
  
  // Define loadReactionsAndVotes first
  const loadReactionsAndVotes = useCallback(async (allComments: PlatformComment[]) => {
    if (!user) return;

    const commentIds = allComments.map(c => c.id);
    
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
      
    // Process reactions and votes
    const reactionsByComment: Record<string, CommentReactions> = {};
    reactions?.forEach(reaction => {
      if (!reactionsByComment[reaction.comment_id]) {
        reactionsByComment[reaction.comment_id] = {
          heart: 0, like: 0, laugh: 0, angry: 0,
          userReaction: null
        };
      }
      
      // Use reaction type directly since we now match database schema
      const frontendType = reaction.reaction_type;
      if (frontendType in reactionsByComment[reaction.comment_id]) {
        reactionsByComment[reaction.comment_id][frontendType]++;
      }
      
      if (reaction.user_id === user.id) {
        reactionsByComment[reaction.comment_id].userReaction = reaction.reaction_type;
      }
    });

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
  }, [user]);

  // Then define loadComments which uses loadReactionsAndVotes
  const loadComments = useCallback(async () => {
    if (!issueId) {
      setComments([]);
      return;
    }
    
    try {
      // First get the comments
      const { data: commentsData, error } = await supabase
        .from('platform_comments')
        .select('*')
        .eq('issue_id', issueId)
        .is('parent_id', null)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading comments:', error);
        setComments([]);
        return;
      }

      if (commentsData) {
        // Get all user IDs from comments and replies
        const allUserIds = new Set(commentsData.map(c => c.user_id));
        
        // Get replies for each comment
        const allReplies = await Promise.all(
          commentsData.map(async (comment) => {
            const { data: replies, error: repliesError } = await supabase
              .from('platform_comments')
              .select('*')
              .eq('parent_id', comment.id)
              .order('created_at', { ascending: true });

            if (repliesError) {
              console.error('Error loading replies:', repliesError);
              return [];
            }

            // Add reply user IDs to the set
            replies?.forEach(reply => allUserIds.add(reply.user_id));
            return replies || [];
          })
        );

        // Get all profiles for the user IDs
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, name, github_username, avatar_url')
          .in('user_id', Array.from(allUserIds));

        // Create a map of user_id to profile
        const profileMap = new Map();
        profiles?.forEach(profile => {
          profileMap.set(profile.user_id, profile);
        });

        // Combine comments with their profiles and replies
        const commentsWithReplies = commentsData.map((comment, index) => {
          const repliesWithProfiles = allReplies[index].map(reply => ({
            ...reply,
            profiles: profileMap.get(reply.user_id) || null
          }));

          return {
            ...comment,
            profiles: profileMap.get(comment.user_id) || null,
            replies: repliesWithProfiles
          };
        });

        setComments(commentsWithReplies);
        await loadReactionsAndVotes([...commentsWithReplies, ...commentsWithReplies.flatMap(c => c.replies || [])]);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);    
    } finally {
      setLoading(false);
    }
  }, [issueId, loadReactionsAndVotes]);

  const refetch = loadComments;

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return {
    comments,
    loading,
    commentReactions,
    commentVotes,
    loadComments,
    refetch
  };
};
