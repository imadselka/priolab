
import { supabase } from '@/integrations/supabase/client';
import { TablesInsert } from '@/integrations/supabase/types';

interface GitHubRepo {
  id: number;
  full_name: string;
  name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  private: boolean;
  fork: boolean;
  archived: boolean;
  default_branch: string;
  topics: string[];
  license: {
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export const syncRepository = async (repo: any, userId: string) => {
  try {
    const repoData: TablesInsert<'repositories'> = {
      github_id: repo.id,
      full_name: repo.full_name,
      name: repo.name,
      owner_login: repo.owner.login,
      description: repo.description,
      html_url: repo.html_url,
      clone_url: repo.html_url + '.git', // Fallback for clone_url
      ssh_url: `git@github.com:${repo.full_name}.git`, // Generate ssh_url
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      watchers_count: repo.watchers_count || repo.stargazers_count, // Fallback
      forks_count: repo.forks_count,
      open_issues_count: repo.open_issues_count,
      is_private: repo.private || false,
      is_fork: repo.fork || false,
      is_archived: repo.archived || false,
      default_branch: repo.default_branch || 'main',
      topics: repo.topics || [],
      license_name: repo.license?.name,
      github_created_at: repo.created_at,
      github_updated_at: repo.updated_at,
      user_id: userId,
    };

    // Check if repository already exists for this user
    const { data: existingRepo, error: fetchError } = await supabase
      .from('repositories')
      .select('id')
      .eq('github_id', repo.id)
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing repository:', fetchError);
      throw fetchError;
    }

    if (existingRepo) {
      // Update existing repository
      const { data: updatedRepo, error } = await supabase
        .from('repositories')
        .update(repoData)
        .eq('id', existingRepo.id)
        .select('id')
        .single();

      if (error) {
        console.error('Error updating repository:', error);
        throw error;
      }

      return updatedRepo;
    } else {
      // Insert new repository
      const { data: newRepo, error } = await supabase
        .from('repositories')
        .insert(repoData)
        .select('id')
        .single();

      if (error) {
        console.error('Error inserting repository:', error);
        throw error;
      }

      return newRepo;
    }
  } catch (error) {
    console.error('Error syncing repository:', error);
    throw error;
  }
};

export const syncUserRepositories = async (githubToken: string, userId: string) => {
  try {
    // Fetch both public and private repositories from GitHub
    const publicResponse = await fetch('https://api.github.com/user/repos?type=public&sort=updated&per_page=100', {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const privateResponse = await fetch('https://api.github.com/user/repos?type=private&sort=updated&per_page=100', {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!publicResponse.ok || !privateResponse.ok) {
      throw new Error(`GitHub API error: ${publicResponse.statusText || privateResponse.statusText}`);
    }

    const publicRepos: GitHubRepo[] = await publicResponse.json();
    const privateRepos: GitHubRepo[] = await privateResponse.json();
    const allRepos = [...publicRepos, ...privateRepos];

    // Sync repositories to our database
    for (const repo of allRepos) {
      const repoData: TablesInsert<'repositories'> = {
        github_id: repo.id,
        full_name: repo.full_name,
        name: repo.name,
        owner_login: repo.owner.login,
        description: repo.description,
        html_url: repo.html_url,
        clone_url: repo.clone_url,
        ssh_url: repo.ssh_url,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        watchers_count: repo.watchers_count,
        forks_count: repo.forks_count,
        open_issues_count: repo.open_issues_count,
        is_private: repo.private,
        is_fork: repo.fork,
        is_archived: repo.archived,
        default_branch: repo.default_branch,
        topics: repo.topics,
        license_name: repo.license?.name,
        github_created_at: repo.created_at,
        github_updated_at: repo.updated_at,
        user_id: userId,
      };

      // Upsert repository for this user
      const { data: existingRepo, error: fetchError } = await supabase
        .from('repositories')
        .select('id')
        .eq('github_id', repo.id)
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking existing repository:', fetchError);
        continue;
      }

      if (existingRepo) {
        // Update existing repository
        const { error } = await supabase
          .from('repositories')
          .update(repoData)
          .eq('id', existingRepo.id);

        if (error) {
          console.error('Error updating repository:', error);
        }
      } else {
        // Insert new repository
        const { data: newRepo, error } = await supabase
          .from('repositories')
          .insert(repoData)
          .select('id')
          .single();

        if (error) {
          console.error('Error inserting repository:', error);
          continue;
        }

        // Add user_repository relationship
        if (newRepo) {
          const { error: relationError } = await supabase
            .from('user_repositories')
            .insert({
              user_id: userId,
              repository_id: newRepo.id,
              is_following: true,
            });

          if (relationError) {
            console.error('Error creating user_repository relationship:', relationError);
          }
        }
      }
    }

    console.log(`Synced ${allRepos.length} repositories for user ${userId}`);
    return allRepos.length;
  } catch (error) {
    console.error('Error syncing repositories:', error);
    throw error;
  }
};
