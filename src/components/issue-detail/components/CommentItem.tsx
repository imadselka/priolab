
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Reply } from "lucide-react";
import { PlatformComment } from "../types/platformComments";
import { CommentReactions } from "./CommentReactions";
import { CommentVoting } from "./CommentVoting";
import { CommentForm } from "./CommentForm";
import { CommentReactions as CommentReactionsType, CommentVotes, User } from "@/types/common";

interface CommentItemProps {
  comment: PlatformComment;
  isReply?: boolean;
  reactions: CommentReactionsType;
  votes: CommentVotes;
  replyTo: string | null;
  onReplyToggle: (commentId: string) => void;
  onReaction: (commentId: string, reactionType: string) => void;
  onVote: (commentId: string, voteType: 'up' | 'down') => void;
  onSubmitReply: (parentId: string, content: string) => Promise<boolean>;
  showReplyForm: boolean;
  user: User;
}

export const CommentItem = ({
  comment,
  isReply = false,
  reactions,
  votes,
  replyTo,
  onReplyToggle,
  onReaction,
  onVote,
  onSubmitReply,
  showReplyForm,
  user
}: CommentItemProps) => {
  const commentReactions = reactions[comment.id] || {};
  const commentVotes = votes[comment.id] || { up: 0, down: 0 };
  const displayName = comment.profiles?.name || comment.profiles?.github_username || 'Anonymous';

  return (
    <div className={`${isReply ? 'ml-8 mt-4' : ''} border rounded-lg p-4 space-y-3`}>
      <div className="flex items-start space-x-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment.profiles?.avatar_url || undefined} />
          <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold text-sm">{displayName}</span>
            <span className="text-xs text-gray-500">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-gray-700">{comment.content}</p>
          </div>
        </div>
      </div>

      {user && (
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <CommentVoting
              votes={commentVotes}
              onVote={(voteType) => onVote(comment.id, voteType)}
            />
            
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReplyToggle(comment.id)}
              >
                <Reply className="w-4 h-4 mr-1" />
                Reply
              </Button>
            )}
          </div>

          <CommentReactions
            commentId={comment.id}
            reactions={commentReactions}
            onReaction={(reactionType) => onReaction(comment.id, reactionType)}
          />
        </div>
      )}

      {showReplyForm && (
        <div className="mt-4">
          <CommentForm
            onSubmit={(content) => onSubmitReply(comment.id, content)}
            placeholder="Write a reply..."
            submitText="Reply"
            onCancel={() => onReplyToggle(comment.id)}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              isReply={true}
              reactions={reactions}
              votes={votes}
              replyTo={replyTo}
              onReplyToggle={onReplyToggle}
              onReaction={onReaction}
              onVote={onVote}
              onSubmitReply={onSubmitReply}
              showReplyForm={false}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
};
