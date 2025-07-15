
-- Add user_id to repositories table
ALTER TABLE public.repositories 
ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Add user_id to issues table  
ALTER TABLE public.issues
ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Create index for better performance on user queries
CREATE INDEX idx_repositories_user_id ON public.repositories(user_id);
CREATE INDEX idx_issues_user_id ON public.issues(user_id);

-- Add RLS policies for repositories
ALTER TABLE public.repositories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own repositories" 
  ON public.repositories 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own repositories" 
  ON public.repositories 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own repositories" 
  ON public.repositories 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add RLS policies for issues
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own issues" 
  ON public.issues 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own issues" 
  ON public.issues 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own issues" 
  ON public.issues 
  FOR UPDATE 
  USING (auth.uid() = user_id);
