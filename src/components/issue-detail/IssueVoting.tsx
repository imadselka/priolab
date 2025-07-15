
import { ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useVoteMutation } from "@/hooks/mutations/useVoteMutation";

interface IssueVotingProps {
  issueId: string;
  initialVoteCount: number;
  initialUserVote: 'up' | 'down' | null;
  onVoteUpdate: (newCount: number, newUserVote: 'up' | 'down' | null) => void;
}

export const IssueVoting = ({ 
  issueId, 
  initialVoteCount, 
  initialUserVote, 
  onVoteUpdate 
}: IssueVotingProps) => {
  const { user } = useAuth();
  const voteMutation = useVoteMutation(issueId);

  const handleVote = async (type: "up" | "down") => {
    if (!user || voteMutation.isPending) return;
    
    try {
      const result = await voteMutation.mutateAsync({ voteType: type });
      
      // Optimistically update the UI
      const isCurrentVote = initialUserVote === type;
      
      if (result.removed) {
        const adjustment = type === "up" ? -1 : 1;
        onVoteUpdate(initialVoteCount + adjustment, null);
      } else {
        const adjustment = initialUserVote === null ? 
          (type === "up" ? 1 : -1) : 
          (type === "up" ? 2 : -2);
        
        onVoteUpdate(initialVoteCount + adjustment, type);
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center space-y-1 bg-white rounded-lg p-2 border">
      <Button
        variant={initialUserVote === "up" ? "default" : "outline"}
        size="sm"
        onClick={() => handleVote("up")}
        disabled={voteMutation.isPending}
        className="h-8 w-8 p-0"
      >
        {voteMutation.isPending && initialUserVote === "up" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ChevronUp className="w-4 h-4" />
        )}
      </Button>
      
      <span className="font-bold text-lg text-gray-900">
        {initialVoteCount}
      </span>
      
      <Button
        variant={initialUserVote === "down" ? "default" : "outline"}
        size="sm"
        onClick={() => handleVote("down")}
        disabled={voteMutation.isPending}
        className="h-8 w-8 p-0"
      >
        {voteMutation.isPending && initialUserVote === "down" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};
