
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  github_id INTEGER,
  github_username TEXT,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  company TEXT,
  blog TEXT,
  twitter_username TEXT,
  public_repos INTEGER DEFAULT 0,
  public_gists INTEGER DEFAULT 0,
  followers INTEGER DEFAULT 0,
  following INTEGER DEFAULT 0,
  github_created_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create repositories table
CREATE TABLE public.repositories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  github_id INTEGER NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  name TEXT NOT NULL,
  owner_login TEXT NOT NULL,
  description TEXT,
  html_url TEXT NOT NULL,
  clone_url TEXT,
  ssh_url TEXT,
  language TEXT,
  stargazers_count INTEGER DEFAULT 0,
  watchers_count INTEGER DEFAULT 0,
  forks_count INTEGER DEFAULT 0,
  open_issues_count INTEGER DEFAULT 0,
  is_private BOOLEAN DEFAULT false,
  is_fork BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  default_branch TEXT DEFAULT 'main',
  topics TEXT[],
  license_name TEXT,
  github_created_at TIMESTAMP WITH TIME ZONE,
  github_updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create issues table
CREATE TABLE public.issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  github_id INTEGER NOT NULL UNIQUE,
  repository_id UUID REFERENCES public.repositories NOT NULL,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  state TEXT NOT NULL CHECK (state IN ('open', 'closed')),
  labels TEXT[],
  assignees TEXT[],
  milestone TEXT,
  author_login TEXT NOT NULL,
  author_avatar_url TEXT,
  html_url TEXT NOT NULL,
  comments_count INTEGER DEFAULT 0,
  github_created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  github_updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  github_closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(repository_id, number)
);

-- Create votes table for issue voting
CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  issue_id UUID REFERENCES public.issues NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, issue_id)
);

-- Create github_comments table for GitHub issue comments
CREATE TABLE public.github_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  github_id INTEGER NOT NULL UNIQUE,
  issue_id UUID REFERENCES public.issues NOT NULL,
  author_login TEXT NOT NULL,
  author_avatar_url TEXT,
  body TEXT NOT NULL,
  html_url TEXT NOT NULL,
  github_created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  github_updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create platform_comments table for in-platform comments
CREATE TABLE public.platform_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id UUID REFERENCES public.issues NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  parent_id UUID REFERENCES public.platform_comments,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_repositories table for tracking followed repos
CREATE TABLE public.user_repositories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  repository_id UUID REFERENCES public.repositories NOT NULL,
  is_following BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, repository_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('issue_comment', 'vote', 'mention', 'new_issue')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_issue_id UUID REFERENCES public.issues,
  related_comment_id UUID REFERENCES public.platform_comments,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for repositories
CREATE POLICY "Anyone can view repositories" ON public.repositories FOR SELECT USING (true);

-- Create RLS policies for issues
CREATE POLICY "Anyone can view issues" ON public.issues FOR SELECT USING (true);

-- Create RLS policies for votes
CREATE POLICY "Users can view all votes" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Users can insert own votes" ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own votes" ON public.votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own votes" ON public.votes FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for github_comments
CREATE POLICY "Anyone can view github comments" ON public.github_comments FOR SELECT USING (true);

-- Create RLS policies for platform_comments
CREATE POLICY "Anyone can view platform comments" ON public.platform_comments FOR SELECT USING (true);
CREATE POLICY "Users can insert own comments" ON public.platform_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.platform_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.platform_comments FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_repositories
CREATE POLICY "Users can view own followed repos" ON public.user_repositories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own followed repos" ON public.user_repositories FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, github_id, github_username, name, email, avatar_url)
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data->>'provider_id')::INTEGER,
    NEW.raw_user_meta_data->>'user_name',
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_repositories_updated_at BEFORE UPDATE ON public.repositories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON public.issues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_votes_updated_at BEFORE UPDATE ON public.votes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_github_comments_updated_at BEFORE UPDATE ON public.github_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_platform_comments_updated_at BEFORE UPDATE ON public.platform_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_issues_repository_id ON public.issues(repository_id);
CREATE INDEX idx_issues_state ON public.issues(state);
CREATE INDEX idx_issues_github_created_at ON public.issues(github_created_at DESC);
CREATE INDEX idx_votes_issue_id ON public.votes(issue_id);
CREATE INDEX idx_votes_user_id ON public.votes(user_id);
CREATE INDEX idx_github_comments_issue_id ON public.github_comments(issue_id);
CREATE INDEX idx_platform_comments_issue_id ON public.platform_comments(issue_id);
CREATE INDEX idx_platform_comments_parent_id ON public.platform_comments(parent_id);
CREATE INDEX idx_user_repositories_user_id ON public.user_repositories(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
