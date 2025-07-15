
import { useState, useEffect } from "react";
import { GitBranch, Building, User, Star, ExternalLink, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useGitHubAPI } from "@/hooks/useGitHubAPI";
import { useNavigate } from "react-router-dom";

interface Repository {
  id: number;
  full_name: string;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  owner: {
    login: string;
    avatar_url: string;
    type: string;
  };
  private: boolean;
  fork: boolean;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
}

interface UserReposProps {
  searchQuery: string;
}

export const UserRepos = ({ searchQuery }: UserReposProps) => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [personalRepos, setPersonalRepos] = useState<Repository[]>([]);
  const [orgRepos, setOrgRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserRepos();
  }, [session?.provider_token]);

  const loadUserRepos = async () => {
    if (!session?.provider_token || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
        headers: {
          'Authorization': `token ${session.provider_token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const repos: Repository[] = await response.json();
      
      // Separate personal and organization repos
      const personal = repos.filter(repo => repo.owner.login === user.user_metadata?.user_name);
      const organizations = repos.filter(repo => repo.owner.login !== user.user_metadata?.user_name);

      setPersonalRepos(personal);
      setOrgRepos(organizations);
    } catch (error) {
      console.error('Error loading user repos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewIssues = (owner: string, name: string) => {
    navigate(`/repositories/${owner}/${name}/issues`);
  };

  const filterRepos = (repos: Repository[]) => {
    if (!searchQuery) return repos;
    return repos.filter(repo => 
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const RepoCard = ({ repo }: { repo: Repository }) => (
    <Card className="hover:shadow-md transition-all duration-200 border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <img 
                src={repo.owner.avatar_url} 
                alt={repo.owner.login}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600"
                  >
                    {repo.name}
                  </a>
                  <ExternalLink className="w-4 h-4" />
                </CardTitle>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">{repo.owner.login}</p>
                  {repo.owner.type === 'Organization' && (
                    <Building className="w-4 h-4 text-gray-400" />
                  )}
                  {repo.private && (
                    <Badge variant="secondary" className="text-xs">Private</Badge>
                  )}
                  {repo.fork && (
                    <Badge variant="outline" className="text-xs">Fork</Badge>
                  )}
                </div>
              </div>
            </div>

            {repo.description && (
              <p className="text-gray-600 mb-4 line-clamp-2">
                {repo.description}
              </p>
            )}

            <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>{repo.stargazers_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitBranch className="w-4 h-4" />
                <span>{repo.open_issues_count} issues</span>
              </div>
              <div className="text-xs">
                Updated {new Date(repo.updated_at).toLocaleDateString()}
              </div>
            </div>

            {repo.language && (
              <Badge variant="secondary" className="text-xs">
                {repo.language}
              </Badge>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewIssues(repo.owner.login, repo.name)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Issues
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const filteredPersonalRepos = filterRepos(personalRepos);
  const filteredOrgRepos = filterRepos(orgRepos);

  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="personal" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Personal ({filteredPersonalRepos.length})
        </TabsTrigger>
        <TabsTrigger value="organizations" className="flex items-center gap-2">
          <Building className="w-4 h-4" />
          Organizations ({filteredOrgRepos.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="space-y-4">
        {filteredPersonalRepos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No personal repositories</h3>
            <p className="text-gray-500">
              {searchQuery ? 'No repositories match your search' : 'You haven\'t created any repositories yet'}
            </p>
          </div>
        ) : (
          filteredPersonalRepos.map(repo => (
            <RepoCard key={repo.id} repo={repo} />
          ))
        )}
      </TabsContent>

      <TabsContent value="organizations" className="space-y-4">
        {filteredOrgRepos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No organization repositories</h3>
            <p className="text-gray-500">
              {searchQuery ? 'No repositories match your search' : 'You\'re not part of any organizations with repositories'}
            </p>
          </div>
        ) : (
          filteredOrgRepos.map(repo => (
            <RepoCard key={repo.id} repo={repo} />
          ))
        )}
      </TabsContent>
    </Tabs>
  );
};
