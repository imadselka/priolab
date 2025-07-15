
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<boolean>;
  placeholder: string;
  submitText: string;
  onCancel?: () => void;
  disabled?: boolean;
}

export const CommentForm = ({ 
  onSubmit, 
  placeholder, 
  submitText, 
  onCancel, 
  disabled 
}: CommentFormProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    const success = await onSubmit(content);
    if (success) {
      setContent("");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-2">
      <Textarea
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[80px]"
        disabled={disabled}
      />
      <div className="flex space-x-2">
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting || disabled}
          size="sm"
        >
          {isSubmitting ? "Posting..." : submitText}
        </Button>
        {onCancel && (
          <Button
            variant="ghost"
            onClick={onCancel}
            size="sm"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};
