
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Loader2 } from "lucide-react";

interface CommentVotingProps {
  votes: { up: number; down: number; userVote: string | null };
  onVote: (voteType: 'up' | 'down') => void;
  isLoading?: boolean;
}

export const CommentVoting = ({ votes, onVote, isLoading = false }: CommentVotingProps) => {
  const voteScore = votes.up - votes.down;

  return (
    <div className="flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
      <Button
        variant={votes.userVote === 'up' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onVote('up')}
        disabled={isLoading}
        className="h-8 w-8 p-0 hover:scale-110 transition-transform disabled:hover:scale-100"
      >
        {isLoading && votes.userVote === 'up' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ChevronUp className="w-4 h-4" />
        )}
      </Button>
      <span className="text-sm font-bold min-w-[2rem] text-center px-1">
        {voteScore > 0 ? `+${voteScore}` : voteScore}
      </span>
      <Button
        variant={votes.userVote === 'down' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onVote('down')}
        disabled={isLoading}
        className="h-8 w-8 p-0 hover:scale-110 transition-transform disabled:hover:scale-100"
      >
        {isLoading && votes.userVote === 'down' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};
