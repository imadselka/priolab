
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { CommentForm } from "./components/CommentForm";
import { CommentItem } from "./components/CommentItem";
import { usePlatformComments } from "./hooks/usePlatformComments";
import { useCommentActions } from "./hooks/useCommentActions";
import { PlatformCommentsProps } from "./types/platformComments";
import { useAuth } from "@/hooks/useAuth";

export const PlatformComments = ({ issueId }: PlatformCommentsProps) => {
  const { user } = useAuth();
  const { comments, loading, refetch, commentReactions, commentVotes } = usePlatformComments(issueId);
  const { handleSubmit, handleVote, handleReaction, handleSubmitReply, replyTo, setReplyTo } = useCommentActions(refetch, issueId);

  const handleReplyToggle = (commentId: string) => {
    setReplyTo(replyTo === commentId ? null : commentId);
  };

  // Don't render if no valid issue ID
  if (!issueId) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Loading platform comments...</p>
      </div>
    );
  }

  // Show no comments message immediately if there are 0 comments and not loading
  if (!loading && comments.length === 0) {
    return (
      <div className="space-y-6">
        <CommentForm 
          onSubmit={handleSubmit}
          placeholder="Write your comment..."
          submitText="Comment"
        />
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No comments yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Be the first to start the discussion! Share your thoughts, ask questions, or provide feedback.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <CommentForm 
          onSubmit={handleSubmit}
          placeholder="Write your comment..."
          submitText="Comment"
        />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CommentForm 
        onSubmit={handleSubmit}
        placeholder="Write your comment..."
        submitText="Comment"
      />
      
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            reactions={commentReactions}
            votes={commentVotes}
            replyTo={replyTo}
            onReplyToggle={handleReplyToggle}
            onVote={handleVote}
            onReaction={handleReaction}
            onSubmitReply={handleSubmitReply}
            showReplyForm={replyTo === comment.id}
            user={user}
          />
        ))}
      </div>
    </div>
  );
};
