import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, MessageSquare, User, ArrowUp, ArrowLeft } from "lucide-react";
import { useGitHubAPI } from "@/hooks/useGitHubAPI";

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

interface RepositoryIssuesProps {
  owner: string;
  name: string;
  onBack?: () => void;
}

export const RepositoryIssues = ({ owner, name, onBack }: RepositoryIssuesProps) => {
  const navigate = useNavigate();
  const { fetchRepoIssues, loading, error } = useGitHubAPI();
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);

  useEffect(() => {
    if (owner && name) {
      loadIssues();
    }
  }, [owner, name, currentPage]);

  const loadIssues = async () => {
    if (!owner || !name) return;
    
    try {
      const fetchedIssues = await fetchRepoIssues(owner, name, currentPage, 30);
      setIssues(fetchedIssues);
      setHasMorePages(fetchedIssues.length === 30); // GitHub returns 30 per page by default
    } catch (error) {
      console.error('Error loading issues:', error);
      setIssues([]);
    }
  };

  const handleIssueClick = (issue: GitHubIssue) => {
    // Navigate to the repository-specific issue detail route
    navigate(`/repositories/${owner}/${name}/issues/${issue.number}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/2 sm:w-1/3 mb-4"></div>
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 sm:h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Error loading issues</h3>
        <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
        <Button onClick={loadIssues} variant="outline" size="sm" className="sm:size-default">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div className="bg-white rounded-lg border p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {onBack && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="flex items-center space-x-2 w-fit"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-sm sm:text-base">Back</span>
              </Button>
            )}
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                {owner}/{name}
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Repository Issues from GitHub</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-xs sm:text-sm text-gray-500">
            {issues.length} issue{issues.length !== 1 ? 's' : ''} on page {currentPage}
          </span>
        </div>
      </div>

      {issues.length === 0 ? (
        <div className="text-center py-8 sm:py-12 px-4">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No issues found</h3>
          <p className="text-gray-500 text-sm sm:text-base">This repository doesn't have any open issues.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:gap-4">
            {issues.map((issue) => (
              <Card 
                key={issue.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.01] border-l-4 border-l-blue-500"
                onClick={() => handleIssueClick(issue)}
              >
                <CardHeader className="pb-2 sm:pb-3 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant={issue.state === 'open' ? 'default' : 'secondary'} className="text-xs">
                          {issue.state}
                        </Badge>
                        <span className="text-xs sm:text-sm text-gray-500">#{issue.number}</span>
                      </div>
                      <h3 className="font-semibold text-base sm:text-lg leading-tight text-gray-900 hover:text-blue-700 transition-colors break-words">
                        {issue.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:ml-4 self-start">
                      <div className="flex items-center gap-1 text-gray-600">
                        <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-medium">0</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 p-4 sm:p-6 sm:pt-0">
                  <div className="space-y-3">
                    {issue.body && (
                      <div className="text-gray-700 text-xs sm:text-sm line-clamp-3 break-words">
                        {issue.body.substring(0, 200)}
                        {issue.body.length > 200 && '...'}
                      </div>
                    )}

                    {issue.labels && issue.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {issue.labels.slice(0, 3).map((label) => (
                          <Badge 
                            key={label.name} 
                            variant="outline" 
                            className="text-xs px-2 py-0.5"
                            style={{ backgroundColor: `#${label.color}20`, borderColor: `#${label.color}` }}
                          >
                            {label.name}
                          </Badge>
                        ))}
                        {issue.labels.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            +{issue.labels.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 gap-2 sm:gap-4">
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-1">
                          <img 
                            src={issue.user.avatar_url} 
                            alt={issue.user.login}
                            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
                          />
                          <span className="font-medium truncate max-w-[100px] sm:max-w-none">
                            {issue.user.login}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="whitespace-nowrap">{formatDate(issue.created_at)}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{issue.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
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
              Page {currentPage}
            </span>
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasMorePages}
              size="sm"
              className="w-full sm:w-auto"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};