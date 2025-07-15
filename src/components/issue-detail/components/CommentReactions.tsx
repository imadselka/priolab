
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, Laugh, Angry } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CommentReactions as CommentReactionsType } from "@/types/common";

interface CommentReactionsProps {
  commentId: string;
  reactions?: CommentReactionsType;
  onReaction?: (reactionType: string) => void;
}

export const CommentReactions = ({ commentId, reactions: externalReactions, onReaction: externalOnReaction }: CommentReactionsProps) => {
  const { user } = useAuth();  const [reactions, setReactions] = useState<Omit<CommentReactionsType, 'userReaction'>>({
    heart: 0,
    like: 0,
    laugh: 0,
    angry: 0
  });
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reactionTypes = [
    { type: 'heart', icon: Heart, emoji: '❤️' },
    { type: 'like', icon: ThumbsUp, emoji: '👍' },
    { type: 'laugh', icon: Laugh, emoji: '😂' },
    { type: 'angry', icon: Angry, emoji: '😠' }  ];

  const loadReactions = useCallback(async () => {
    try {
      // Load reactions from comment_reactions table
      const { data: reactionsData } = await supabase
        .from('comment_reactions')
        .select('reaction_type, user_id')
        .eq('comment_id', commentId);

      if (reactionsData) {
        const reactionCounts = {
          heart: 0,
          like: 0,
          laugh: 0,
          angry: 0
        };

        reactionsData.forEach(reaction => {
          // Use reaction type directly since we now match database schema
          const frontendType = reaction.reaction_type;
          if (frontendType in reactionCounts) {
            reactionCounts[frontendType as keyof typeof reactionCounts]++;
          }
          
          if (user && reaction.user_id === user.id) {
            setUserReaction(frontendType);
          }
        });

        setReactions(reactionCounts);
      }
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  }, [commentId, user]);

  useEffect(() => {
    if (externalReactions) {
      // Use external reactions if provided
      setReactions({
        heart: externalReactions.heart || 0,
        like: externalReactions.like || 0,
        laugh: externalReactions.laugh || 0,
        angry: externalReactions.angry || 0
      });
      
      // Set user reaction directly since we're using the same names
      setUserReaction(externalReactions.userReaction || null);
    } else {
      // Load reactions from database
      loadReactions();
    }  }, [commentId, user, externalReactions, loadReactions]);

  const handleReaction = async (reactionType: string) => {
    if (externalOnReaction) {
      // Use external handler if provided
      externalOnReaction(reactionType);
      return;
    }

    if (!user || loading) return;    setLoading(true);
    try {
      if (userReaction === reactionType) {
        // Remove reaction
        await supabase
          .from('comment_reactions')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);
        
        setUserReaction(null);
        setReactions(prev => ({
          ...prev,
          [reactionType]: Math.max(0, prev[reactionType] - 1)
        }));
      } else {
        // Remove old reaction if exists
        if (userReaction) {
          await supabase
            .from('comment_reactions')
            .delete()
            .eq('comment_id', commentId)
            .eq('user_id', user.id);
          
          setReactions(prev => ({
            ...prev,
            [userReaction]: Math.max(0, prev[userReaction] - 1)
          }));
        }

        // Add new reaction
        await supabase
          .from('comment_reactions')
          .insert({
            comment_id: commentId,
            user_id: user.id,
            reaction_type: reactionType
          });

        setUserReaction(reactionType);
        setReactions(prev => ({
          ...prev,
          [reactionType]: prev[reactionType] + 1
        }));
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center space-x-1">
      {reactionTypes.map(({ type, emoji }) => {
        const count = reactions[type] || 0;
        const isActive = userReaction === type;
        
        return (
          <Button
            key={type}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleReaction(type)}
            disabled={loading}
            className="h-8 px-2 hover:scale-105 transition-transform"
          >
            <span className="text-sm">{emoji}</span>
            {count > 0 && (
              <span className="ml-1 text-xs font-medium">{count}</span>
            )}
          </Button>
        );
      })}
    </div>
  );
};
