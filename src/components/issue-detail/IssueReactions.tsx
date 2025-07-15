
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface IssueReactionsProps {
  issueId?: string; // Make optional since it might be undefined during sync
}

export const IssueReactions = ({ issueId }: IssueReactionsProps) => {
  const { user } = useAuth();  const [reactions, setReactions] = useState<Record<string, number>>({
    heart: 0,
    like: 0,
    laugh: 0,
    angry: 0
  });
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReactions();
  }, [issueId, user]);
  const loadReactions = async () => {
    if (!issueId) return; // Don't query if no valid issue ID
    
    try {
      // Load reactions from issue_reactions table
      const { data: reactionsData } = await supabase
        .from('issue_reactions')
        .select('reaction_type, user_id')
        .eq('issue_id', issueId);

      if (reactionsData) {        const reactionCounts = {
          heart: 0,
          like: 0,
          laugh: 0,
          angry: 0
        };

        reactionsData.forEach(reaction => {
          reactionCounts[reaction.reaction_type as keyof typeof reactionCounts]++;
          if (user && reaction.user_id === user.id) {
            setUserReaction(reaction.reaction_type);
          }
        });

        setReactions(reactionCounts);
      }
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };
  const handleReaction = async (reactionType: string) => {
    if (!user || loading || !issueId) return; // Don't proceed if no valid issue ID

    setLoading(true);
    try {
      if (userReaction === reactionType) {
        // Remove reaction
        await supabase
          .from('issue_reactions')
          .delete()
          .eq('issue_id', issueId)
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
            .from('issue_reactions')
            .delete()
            .eq('issue_id', issueId)
            .eq('user_id', user.id);
          
          setReactions(prev => ({
            ...prev,
            [userReaction]: Math.max(0, prev[userReaction] - 1)
          }));
        }

        // Add new reaction
        await supabase
          .from('issue_reactions')
          .insert({
            issue_id: issueId,
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

  const getReactionEmoji = (type: string) => {
    switch (type) {
      case 'heart': return '❤️';
      case 'like': return '👍';
      case 'laugh': return '😂';
      case 'angry': return '😠';
      default: return '';
    }
  };

  if (!user) return null;

  if (!issueId) {
    return (
      <div className="flex items-center space-x-2 text-gray-400">
        <span className="text-sm">Loading reactions...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-700 mr-2">Reactions:</span>
        
        {Object.entries(reactions).map(([type, count]) => (
          <Button
            key={type}
            variant={userReaction === type ? "default" : "outline"}
            size="sm"
            onClick={() => handleReaction(type)}
            disabled={loading}
            className="h-8 px-3 space-x-1 hover:scale-105 transition-transform"
          >
            <span className="text-base">{getReactionEmoji(type)}</span>
            {count > 0 && <span className="text-xs font-medium">{count}</span>}
          </Button>
        ))}
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-gray-500 hover:text-gray-700"
          title="More reactions coming soon"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
