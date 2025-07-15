
-- Create user_repository_watches table
CREATE TABLE IF NOT EXISTS user_repository_watches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, repository_id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_repository_watches_user_id ON user_repository_watches(user_id);
CREATE INDEX IF NOT EXISTS idx_user_repository_watches_repo_id ON user_repository_watches(repository_id);

-- Enable RLS
ALTER TABLE user_repository_watches ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own watches" ON user_repository_watches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own watches" ON user_repository_watches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watches" ON user_repository_watches
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_user_repository_watches_updated_at
  BEFORE UPDATE ON user_repository_watches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
