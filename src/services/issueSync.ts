
import { supabase } from '@/integrations/supabase/client';

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: string;
  labels: Array<{ name: string; color: string }>;
  user: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  comments: number;
}

export const syncRepositoryToDatabase = async (owner: string, repoName: string, userId: string, githubRepo?: any) => {
  try {
    console.log(`Syncing repository ${owner}/${repoName} to database for user ${userId}`);
    
    // Check if repository already exists for this user
    const { data: existingRepo, error: checkError } = await supabase
      .from('repositories')
      .select('id, github_id')
      .eq('full_name', `${owner}/${repoName}`)
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing repository:', checkError);
      throw new Error(`Database error: ${checkError.message}`);
    }

    if (existingRepo) {
      console.log('Repository already exists in database for this user');
      return existingRepo;
    }

    // If we don't have github repo data, we need to fetch it
    if (!githubRepo) {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch repository data: ${response.statusText}`);
      }
      githubRepo = await response.json();
    }

    // Insert new repository with user_id
    const { data: newRepo, error } = await supabase
      .from('repositories')
      .insert({
        github_id: githubRepo.id,
        full_name: githubRepo.full_name,
        name: githubRepo.name,
        owner_login: githubRepo.owner.login,
        description: githubRepo.description,
        html_url: githubRepo.html_url,
        clone_url: githubRepo.clone_url,
        ssh_url: githubRepo.ssh_url,
        language: githubRepo.language,
        stargazers_count: githubRepo.stargazers_count || 0,
        watchers_count: githubRepo.watchers_count || 0,
        forks_count: githubRepo.forks_count || 0,
        open_issues_count: githubRepo.open_issues_count || 0,
        is_private: githubRepo.private || false,
        is_fork: githubRepo.fork || false,
        is_archived: githubRepo.archived || false,
        default_branch: githubRepo.default_branch || 'main',
        topics: githubRepo.topics || [],
        license_name: githubRepo.license?.name,
        github_created_at: githubRepo.created_at,
        github_updated_at: githubRepo.updated_at,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error syncing repository to database:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('Repository synced successfully');
    return newRepo;
  } catch (error) {
    console.error('Error syncing repository to database:', error);
    throw error;
  }
};

export const syncIssueToDatabase = async (owner: string, repoName: string, githubIssue: GitHubIssue, userId: string) => {
  try {
    console.log(`Syncing issue #${githubIssue.number} to database for user ${userId}`);
    
    // First ensure the repository exists for this user
    let repository = await syncRepositoryToDatabase(owner, repoName, userId);

    // Check if issue already exists by github_id and user_id
    const { data: existingIssue, error: checkError } = await supabase
      .from('issues')
      .select('id')
      .eq('github_id', githubIssue.id)
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing issue:', checkError);
      throw new Error(`Database error: ${checkError.message}`);
    }

    const issueData = {
      github_id: githubIssue.id,
      repository_id: repository.id,
      number: githubIssue.number,
      title: githubIssue.title,
      body: githubIssue.body,
      state: githubIssue.state,
      labels: githubIssue.labels?.map(label => label.name) || [],
      assignees: [],
      author_login: githubIssue.user.login,
      author_avatar_url: githubIssue.user.avatar_url,
      html_url: githubIssue.html_url,
      comments_count: githubIssue.comments || 0,
      github_created_at: githubIssue.created_at,
      github_updated_at: githubIssue.updated_at,
      github_closed_at: githubIssue.closed_at,
      user_id: userId,
    };

    let result;
    if (existingIssue) {
      // Update existing issue
      result = await supabase
        .from('issues')
        .update(issueData)
        .eq('id', existingIssue.id)
        .select()
        .single();
    } else {
      // Insert new issue
      result = await supabase
        .from('issues')
        .insert(issueData)
        .select()
        .single();
    }

    if (result.error) {
      console.error('Error syncing issue to database:', result.error);
      throw new Error(`Database error: ${result.error.message}`);
    }

    console.log(`Issue #${githubIssue.number} synced successfully`);
    return result.data;
  } catch (error) {
    console.error('Error syncing issue to database:', error);
    throw error;
  }
};

export const syncMultipleIssues = async (owner: string, repoName: string, githubIssues: GitHubIssue[], userId: string) => {
  try {
    console.log(`Syncing ${githubIssues.length} issues for ${owner}/${repoName} for user ${userId}`);
    
    // First ensure the repository exists for this user
    await syncRepositoryToDatabase(owner, repoName, userId);
    
    // Track sync results
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };
    
    // Sync issues in smaller batches to avoid overwhelming the database
    const batchSize = 5;
    for (let i = 0; i < githubIssues.length; i += batchSize) {
      const batch = githubIssues.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (issue) => {
          try {
            await syncIssueToDatabase(owner, repoName, issue, userId);
            results.success++;
          } catch (error) {
            console.error(`Failed to sync issue #${issue.number}:`, error);
            results.failed++;
            results.errors.push(`Issue #${issue.number}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        })
      );
      
      // Small delay between batches to avoid rate limiting
      if (i + batchSize < githubIssues.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`Sync completed: ${results.success} successful, ${results.failed} failed`);
    
    // Return results even if some failed - partial success is still useful
    return results;
  } catch (error) {
    console.error('Error syncing multiple issues:', error);
    throw error;
  }
};
