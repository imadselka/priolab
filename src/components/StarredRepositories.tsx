
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, GitBranch, Users, ExternalLink, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface StarredRepo {
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
  open_issues_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
}

export const StarredRepositories = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [starredRepos, setStarredRepos] = useState<StarredRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);

  useEffect(() => {
    const loadStarredRepositories = async () => {
      if (!session?.provider_token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://api.github.com/user/starred?per_page=30&page=${currentPage}&sort=updated`,
          {
            headers: {
              'Authorization': `token ${session.provider_token}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch starred repositories');
        }

        const repos: StarredRepo[] = await response.json();
        setStarredRepos(repos);
        setHasMorePages(repos.length === 30); // GitHub returns 30 per page
      } catch (error) {
        console.error('Error loading starred repositories:', error);
        setStarredRepos([]);
      } finally {
        setLoading(false);
      }
    };

    if (user && session?.provider_token) {
      loadStarredRepositories();
    }
  }, [user, session?.provider_token, currentPage]);

  const handleViewIssues = (owner: string, name: string) => {
    navigate(`/repositories/${owner}/${name}/issues`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
        <p className="text-gray-600">Please sign in to view your starred repositories.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Starred Repositories</h1>
        <div className="grid gap-4 sm:gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3 sm:space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-6 bg-gray-200 rounded w-32 sm:w-48"></div>
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Starred Repositories</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Repositories you've starred on GitHub</p>
        </div>
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
          <Star className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{starredRepos.length} repositories on page {currentPage}</span>
        </div>
      </div>

      {starredRepos.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No starred repositories</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4 px-4 sm:px-0">
            You haven't starred any repositories yet. Go to GitHub and star some repositories to see them here.
          </p>
          <Button onClick={() => window.open('https://github.com', '_blank')} variant="outline" className="text-sm sm:text-base">
            Browse GitHub
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:gap-6">
            {starredRepos.map((repo) => (
              <Card key={repo.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={repo.owner.avatar_url} 
                          alt={repo.owner.login}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-base sm:text-lg">
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 truncate block"
                            >
                              {repo.name}
                            </a>
                          </CardTitle>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">{repo.owner.login}</p>
                        </div>
                      </div>

                      {repo.description && (
                        <p className="text-sm sm:text-base text-gray-700 line-clamp-2">{repo.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
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
                        <div className="text-gray-500 hidden sm:block">
                          Updated {formatDate(repo.updated_at)}
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
                        onClick={() => handleViewIssues(repo.owner.login, repo.name)}
                        className="flex items-center gap-1 sm:gap-2 flex-1 lg:flex-none text-xs sm:text-sm"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">View Issues</span>
                        <span className="xs:hidden">Issues</span>
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
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-sm sm:text-base"
            >
              Previous
            </Button>
            
            <span className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm">
              Page {currentPage}
            </span>
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasMorePages}
              className="text-sm sm:text-base"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
