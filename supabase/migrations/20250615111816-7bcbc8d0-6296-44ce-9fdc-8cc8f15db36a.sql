
-- Create issue_reactions table for storing reactions to issues
CREATE TABLE public.issue_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for issue_reactions
ALTER TABLE public.issue_reactions ENABLE ROW LEVEL SECURITY;

-- Users can view all reactions
CREATE POLICY "Users can view all issue reactions" 
  ON public.issue_reactions 
  FOR SELECT 
  USING (true);

-- Users can create their own reactions
CREATE POLICY "Users can create their own issue reactions" 
  ON public.issue_reactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reactions
CREATE POLICY "Users can delete their own issue reactions" 
  ON public.issue_reactions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create unique constraint to prevent multiple reactions of same type from same user
ALTER TABLE public.issue_reactions 
ADD CONSTRAINT unique_user_issue_reaction 
UNIQUE (issue_id, user_id, reaction_type);
