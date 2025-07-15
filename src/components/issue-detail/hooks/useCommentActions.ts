
import { useCommentActionsMutations } from "@/hooks/mutations/useCommentActionsMutations";

export const useCommentActions = (onCommentsChange: () => void, issueId?: string) => {
  return useCommentActionsMutations(onCommentsChange, issueId);
};
