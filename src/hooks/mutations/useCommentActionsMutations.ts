
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCommentVoteMutation } from "./useCommentVoteMutation";
import { useCommentReactionMutation } from "./useCommentReactionMutation";

export const useCommentActionsMutations = (onCommentsChange: () => void, issueId?: string) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<Record<string, boolean>>({});

  const voteMutation = useCommentVoteMutation(issueId);
  const reactionMutation = useCommentReactionMutation(issueId);

  const handleSubmit = async (content: string) => {
    if (!user || !content.trim() || submitting) return false;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('platform_comments')
        .insert({
          issue_id: issueId,
          user_id: user.id,
          content: content.trim()
        });

      if (!error) {
        onCommentsChange();
        return true;
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
    return false;
  };

  const handleSubmitReply = async (parentId: string, content: string) => {
    if (!user || !content.trim() || submitting) return false;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('platform_comments')
        .insert({
          issue_id: issueId,
          user_id: user.id,
          content: content.trim(),
          parent_id: parentId
        });

      if (!error) {
        setReplyTo(null);
        onCommentsChange();
        return true;
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setSubmitting(false);
    }
    return false;
  };

  const handleVote = async (commentId: string, voteType: 'up' | 'down') => {
    if (!user) return;
    
    const actionKey = `vote-${commentId}`;
    if (actionInProgress[actionKey]) return; // Prevent duplicate requests
    
    setActionInProgress(prev => ({ ...prev, [actionKey]: true }));
    
    try {
      await voteMutation.mutateAsync({ commentId, voteType });
    } catch (error) {
      console.error('Vote error:', error);
    } finally {
      setActionInProgress(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  const handleReaction = async (commentId: string, reactionType: string) => {
    if (!user) return;
    
    const actionKey = `reaction-${commentId}-${reactionType}`;
    if (actionInProgress[actionKey]) return; // Prevent duplicate requests
    
    setActionInProgress(prev => ({ ...prev, [actionKey]: true }));
    
    try {
      await reactionMutation.mutateAsync({ commentId, reactionType });
    } catch (error) {
      console.error('Reaction error:', error);
    } finally {
      setActionInProgress(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  return {
    submitting,
    replyTo,
    setReplyTo,
    handleSubmit,
    handleSubmitReply,
    handleReaction,
    handleVote,
    actionInProgress
  };
};
