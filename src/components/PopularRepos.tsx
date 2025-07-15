
import { useState, useEffect } from "react";
import { Star, GitBranch, Eye, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Repository {
  id: number;
  full_name: string;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface PopularReposProps {
  onRepoSelect: (owner: string, name: string) => void;
}

export const PopularRepos = ({ onRepoSelect }: PopularReposProps) => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularRepos();
  }, []);

  const fetchPopularRepos = async () => {
    setLoading(true);
    try {
      // Fetch popular repositories from GitHub's search API
      const response = await fetch('https://api.github.com/search/repositories?q=stars:>10000&sort=stars&order=desc&per_page=20');
      const data = await response.json();
      setRepos(data.items || []);
    } catch (error) {
      console.error('Error fetching popular repositories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <Card key={repo.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={repo.owner.avatar_url} 
                    alt={repo.owner.login}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <CardTitle className="text-lg">{repo.name}</CardTitle>
                    <p className="text-sm text-gray-500">{repo.owner.login}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-2">
                {repo.description || "No description available"}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{repo.stargazers_count.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitBranch className="w-4 h-4" />
                  <span>{repo.forks_count.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{repo.open_issues_count}</span>
                </div>
              </div>

              {repo.language && (
                <Badge variant="secondary" className="text-xs">
                  {repo.language}
                </Badge>
              )}

              {repo.topics && repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {repo.topics.slice(0, 3).map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {repo.topics.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{repo.topics.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <Button 
                className="w-full mt-4"
                onClick={() => onRepoSelect(repo.owner.login, repo.name)}
              >
                View Issues
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
