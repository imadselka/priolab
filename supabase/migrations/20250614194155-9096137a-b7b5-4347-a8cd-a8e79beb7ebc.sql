
-- Add user following system for repositories
CREATE TABLE IF NOT EXISTS public.user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  repository_id UUID REFERENCES public.repositories(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, repository_id)
);

-- Enable RLS for user follows
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- Create policies for user follows
CREATE POLICY "Users can view all follows" ON public.user_follows FOR SELECT USING (true);
CREATE POLICY "Users can manage their own follows" ON public.user_follows FOR ALL USING (auth.uid() = user_id);

-- Add reactions table for platform comments
CREATE TABLE IF NOT EXISTS public.comment_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  comment_id UUID REFERENCES public.platform_comments(id) ON DELETE CASCADE NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'heart', 'laugh', 'angry', 'sad')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, comment_id, reaction_type)
);

-- Enable RLS for comment reactions
ALTER TABLE public.comment_reactions ENABLE ROW LEVEL SECURITY;

-- Create policies for comment reactions
CREATE POLICY "Users can view all reactions" ON public.comment_reactions FOR SELECT USING (true);
CREATE POLICY "Users can manage their own reactions" ON public.comment_reactions FOR ALL USING (auth.uid() = user_id);

-- Add votes for platform comments
CREATE TABLE IF NOT EXISTS public.comment_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  comment_id UUID REFERENCES public.platform_comments(id) ON DELETE CASCADE NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, comment_id)
);

-- Enable RLS for comment votes
ALTER TABLE public.comment_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for comment votes
CREATE POLICY "Users can view all comment votes" ON public.comment_votes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own comment votes" ON public.comment_votes FOR ALL USING (auth.uid() = user_id);

-- Add trending score to repositories
ALTER TABLE public.repositories ADD COLUMN IF NOT EXISTS trending_score INTEGER DEFAULT 0;

-- Create index for trending repositories
CREATE INDEX IF NOT EXISTS idx_repositories_trending ON public.repositories(trending_score DESC, stargazers_count DESC);

-- Create index for user follows
CREATE INDEX IF NOT EXISTS idx_user_follows_user_id ON public.user_follows(user_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_repo_id ON public.user_follows(repository_id);
