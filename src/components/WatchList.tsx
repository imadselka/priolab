import { useState, useEffect } from "react";
import { Star, GitBranch, Users, ExternalLink, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface WatchedRepository {
  id: string;
  github_id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner_login: string;
  created_at: string;
  updated_at: string;
}

export const WatchList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [watchedRepos, setWatchedRepos] = useState<WatchedRepository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingRepos, setRemovingRepos] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const REPOS_PER_PAGE = 10;

  useEffect(() => {
    if (user) {
      loadWatchedRepositories();
    }
  }, [user, currentPage]);

  const loadWatchedRepositories = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Get total count first for pagination
      const { count } = await supabase
        .from('user_repository_watches')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setTotalPages(Math.ceil((count || 0) / REPOS_PER_PAGE));

      // Get watched repositories with pagination
      const { data: watches, error: watchError } = await supabase
        .from('user_repository_watches')
        .select(`
          id,
          created_at,
          repositories (
            id,
            github_id,
            name,
            full_name,
            description,
            html_url,
            language,
            stargazers_count,
            forks_count,
            open_issues_count,
            owner_login,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * REPOS_PER_PAGE, currentPage * REPOS_PER_PAGE - 1);

      if (watchError) {
        throw watchError;
      }

      const repositories = watches
        ?.map(watch => watch.repositories)
        .filter(Boolean) as WatchedRepository[];

      setWatchedRepos(repositories || []);
    } catch (err) {
      console.error('Error loading watched repositories:', err);
      setError('Failed to load watched repositories');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (repoId: string) => {
    if (!user || removingRepos.has(repoId)) return;

    setRemovingRepos(prev => new Set([...prev, repoId]));

    try {
      const { error } = await supabase
        .from('user_repository_watches')
        .delete()
        .eq('user_id', user.id)
        .eq('repository_id', repoId);

      if (error) {
        throw error;
      }

      // Remove from local state
      setWatchedRepos(prev => prev.filter(repo => repo.id !== repoId));
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      setError('Failed to remove repository from watchlist');
    } finally {
      setRemovingRepos(prev => {
        const newSet = new Set(prev);
        newSet.delete(repoId);
        return newSet;
      });
    }
  };

  const handleViewIssues = (repo: WatchedRepository) => {
    navigate(`/repositories/${repo.owner_login}/${repo.name}/issues`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!user) {
    return (
      <div className="text-center py-8 px-4 sm:py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
        <p className="text-gray-600 text-sm sm:text-base">Please sign in to view your watch list.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Watch List</h1>
        </div>
        
        <div className="grid gap-4 sm:gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 space-y-3 sm:space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-5 sm:h-6 bg-gray-200 rounded w-32 sm:w-48"></div>
                    </div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Watch List</h1>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="text-center py-8 sm:py-12">
          <Button onClick={loadWatchedRepositories} variant="outline" size="sm" className="sm:size-default">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Watch List</h1>
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{watchedRepos.length} repositories watched</span>
        </div>
      </div>

      {watchedRepos.length === 0 ? (
        <div className="text-center py-8 sm:py-12 px-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No repositories in your watch list</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4 max-w-md mx-auto">
            Start watching repositories from the trending page to keep track of their issues and updates.
          </p>
          <Button onClick={() => navigate('/trending')} size="sm" className="sm:size-default">
            Browse Trending Repositories
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:gap-6">
            {watchedRepos.map((repo) => {
              const isRemoving = removingRepos.has(repo.id);
              
              return (
                <Card key={repo.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1 space-y-3 sm:space-y-4">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                              <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600"
                              >
                                {repo.name}
                              </a>
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600">{repo.owner_login}</p>
                          </div>
                        </div>

                        {repo.description && (
                          <p className="text-sm sm:text-base text-gray-700 break-words">{repo.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm">
                          <div className="flex items-center gap-1 text-yellow-600">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{repo.stargazers_count?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-blue-600">
                            <GitBranch className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{repo.forks_count?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-green-600">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{repo.open_issues_count} issues</span>
                          </div>
                        </div>

                        {repo.language && (
                          <Badge variant="secondary" className="w-fit text-xs sm:text-sm">
                            {repo.language}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-row lg:flex-col gap-2 lg:ml-6">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewIssues(repo)}
                          className="flex items-center gap-1 sm:gap-2 flex-1 lg:flex-none text-xs sm:text-sm"
                        >
                          <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">View Issues</span>
                          <span className="sm:hidden">Issues</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFromWatchlist(repo.id)}
                          disabled={isRemoving}
                          className="flex items-center gap-1 sm:gap-2 text-red-600 hover:text-red-700 flex-1 lg:flex-none text-xs sm:text-sm"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">{isRemoving ? "Removing..." : "Remove"}</span>
                          <span className="sm:hidden">{isRemoving ? "..." : "Remove"}</span>
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="flex items-center gap-1 sm:gap-2 flex-1 lg:flex-none text-xs sm:text-sm"
                        >
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                            GitHub
                          </a>
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
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                size="sm"
                className="w-full sm:w-auto"
              >
                Previous
              </Button>
              
              <span className="flex items-center px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                size="sm"
                className="w-full sm:w-auto"
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