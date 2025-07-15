
import { useState, useEffect } from "react";
import { Star, GitBranch, Users, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useGitHubAPI } from "@/hooks/useGitHubAPI";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { syncRepository } from "@/services/repositorySync";

interface TrendingReposProps {
  searchQuery: string;
  timeFilter: string;
  languageFilter: string;
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  owner: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  open_issues_count: number;
  forks_count: number;
}

export const TrendingRepos = ({ searchQuery, timeFilter, languageFilter }: TrendingReposProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { searchRepositories, fetchTrendingRepositories } = useGitHubAPI();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [watchingRepos, setWatchingRepos] = useState<Set<number>>(new Set());
  const [watchedRepoIds, setWatchedRepoIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  const REPOS_PER_PAGE = 10;

  useEffect(() => {
    loadRepos();
  }, [searchQuery, timeFilter, languageFilter, currentPage]);

  useEffect(() => {
    if (user) {
      loadWatchedRepos();
    }
  }, [user]);

  const loadRepos = async () => {
    setLoading(true);
    try {
      let fetchedRepos: Repository[] = [];
      
      if (searchQuery.trim()) {
        // Search GitHub repositories
        const searchResults = await searchRepositories(
          searchQuery,
          languageFilter === 'all' ? undefined : languageFilter,
          currentPage,
          REPOS_PER_PAGE
        );
        fetchedRepos = searchResults.items || [];
        setTotalPages(Math.min(Math.ceil(searchResults.total_count / REPOS_PER_PAGE), 100)); // GitHub API limit
      } else {
        // Fetch trending repositories (most starred)
        const trendingRepos = await fetchTrendingRepositories(
          timeFilter,
          languageFilter === 'all' ? undefined : languageFilter,
          currentPage,
          REPOS_PER_PAGE
        );
        fetchedRepos = trendingRepos.items || [];
        setTotalPages(Math.min(Math.ceil(trendingRepos.total_count / REPOS_PER_PAGE), 100));
      }

      setRepos(fetchedRepos);
    } catch (error) {
      console.error('Error loading repositories:', error);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  const loadWatchedRepos = async () => {
    if (!user) return;

    try {
      const { data: watches } = await supabase
        .from('user_repository_watches')
        .select('repository_id, repositories(github_id)')
        .eq('user_id', user.id);

      if (watches) {
        const watchedIds = new Set(
          watches
            .map(w => w.repositories?.github_id?.toString())
            .filter(Boolean) as string[]
        );
        setWatchedRepoIds(watchedIds);
      }
    } catch (error) {
      console.error('Error loading watched repos:', error);
    }
  };

  const handleWatch = async (repo: Repository) => {
    if (!user || watchingRepos.has(repo.id)) return;

    setWatchingRepos(prev => new Set([...prev, repo.id]));

    try {
      // Sync repository to database first
      const syncedRepo = await syncRepository(repo, user.id);
      
      if (syncedRepo) {
        // Add to watch list
        await supabase
          .from('user_repository_watches')
          .insert({
            user_id: user.id,
            repository_id: syncedRepo.id
          });

        setWatchedRepoIds(prev => new Set([...prev, repo.id.toString()]));
      }
    } catch (error) {
      console.error('Error watching repository:', error);
    } finally {
      setWatchingRepos(prev => {
        const newSet = new Set(prev);
        newSet.delete(repo.id);
        return newSet;
      });
    }
  };

  const handleUnwatch = async (repo: Repository) => {
    if (!user || watchingRepos.has(repo.id)) return;

    setWatchingRepos(prev => new Set([...prev, repo.id]));

    try {
      const { data: dbRepo } = await supabase
        .from('repositories')
        .select('id')
        .eq('github_id', repo.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (dbRepo) {
        await supabase
          .from('user_repository_watches')
          .delete()
          .eq('user_id', user.id)
          .eq('repository_id', dbRepo.id);

        setWatchedRepoIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(repo.id.toString());
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error unwatching repository:', error);
    } finally {
      setWatchingRepos(prev => {
        const newSet = new Set(prev);
        newSet.delete(repo.id);
        return newSet;
      });
    }
  };

  const handleViewIssues = (repo: Repository) => {
    navigate(`/repositories/${repo.owner.login}/${repo.name}/issues`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    // The parent component will handle the search query update
    if (searchInput.trim()) {
      window.location.hash = `#search=${encodeURIComponent(searchInput)}`;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6">
          {Array.from({ length: REPOS_PER_PAGE }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-6 bg-gray-200 rounded w-48"></div>
                        <div className="h-4 bg-gray-200 rounded w-32 mt-1"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
      {/* Search within results */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search all GitHub repositories..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {repos.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No repositories found</h3>
          <p className="text-gray-500">
            {searchQuery ? 'Try adjusting your search query or filters.' : 'No trending repositories available.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {repos.map((repo) => {
              const isWatched = watchedRepoIds.has(repo.id.toString());
              const isProcessing = watchingRepos.has(repo.id);
              
              return (
                <Card key={repo.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={repo.owner.avatar_url} 
                            alt={repo.owner.login}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600"
                              >
                                {repo.name}
                              </a>
                            </h3>
                            <p className="text-sm text-gray-600">{repo.owner.login}</p>
                          </div>
                        </div>

                        {repo.description && (
                          <p className="text-gray-700">{repo.description}</p>
                        )}

                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1 text-yellow-600">
                            <Star className="w-4 h-4" />
                            <span>{repo.stargazers_count?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-blue-600">
                            <GitBranch className="w-4 h-4" />
                            <span>{repo.forks_count?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-green-600">
                            <Users className="w-4 h-4" />
                            <span>{repo.open_issues_count} issues</span>
                          </div>
                        </div>

                        {repo.language && (
                          <Badge variant="secondary" className="w-fit">
                            {repo.language}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-6">
                        {user && (
                          <Button
                            variant={isWatched ? "outline" : "default"}
                            size="sm"
                            onClick={() => isWatched ? handleUnwatch(repo) : handleWatch(repo)}
                            disabled={isProcessing}
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            {isProcessing ? "Processing..." : isWatched ? "Unwatch" : "Watch"}
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewIssues(repo)}
                          className="flex items-center gap-2"
                        >
                          <Users className="w-4 h-4" />
                          View Issues
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <span className="flex items-center px-4 py-2 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
