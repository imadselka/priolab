
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, User, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Discussion {
  id: number;
  number: number;
  title: string;
  body: string;
  state: string;
  category: {
    name: string;
    emoji: string;
  };
  user: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  created_at: string;
  comments: number;
  repository: {
    name: string;
    full_name: string;
    owner: {
      login: string;
    };
  };
}

export const DiscussionsList = () => {
  const { user, session } = useAuth();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [watchedRepos, setWatchedRepos] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadWatchedRepositories();
    }
  }, [user]);

  useEffect(() => {
    if (watchedRepos.length > 0 && session?.provider_token) {
      loadDiscussions();
    }
  }, [watchedRepos, session?.provider_token]);

  const loadWatchedRepositories = async () => {
    if (!user) return;

    try {
      const { data: watches } = await supabase
        .from('user_repository_watches')
        .select(`
          repositories (
            full_name
          )
        `)
        .eq('user_id', user.id);

      const repoNames = watches
        ?.map(watch => watch.repositories?.full_name)
        .filter(Boolean) as string[];

      setWatchedRepos(repoNames || []);
    } catch (error) {
      console.error('Error loading watched repositories:', error);
    }
  };

  const loadDiscussions = async () => {
    if (!session?.provider_token || watchedRepos.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const allDiscussions: Discussion[] = [];

      // Fetch discussions for each watched repository
      for (const repoFullName of watchedRepos.slice(0, 5)) { // Limit to 5 repos to avoid rate limits
        const [owner, repo] = repoFullName.split('/');
        
        try {
          const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/discussions?per_page=10`,
            {
              headers: {
                'Authorization': `token ${session.provider_token}`,
                'Accept': 'application/vnd.github.v3+json',
              },
            }
          );

          if (response.ok) {
            const repoDiscussions = await response.json();
            const discussionsWithRepo = repoDiscussions.map((discussion: Discussion) => ({
              ...discussion,
              repository: {
                name: repo,
                full_name: repoFullName,
                owner: { login: owner }
              }
            }));
            allDiscussions.push(...discussionsWithRepo);
          }
        } catch (error) {
          console.error(`Error fetching discussions for ${repoFullName}:`, error);
        }
      }

      // Sort by creation date
      allDiscussions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setDiscussions(allDiscussions.slice(0, 20)); // Show latest 20 discussions
    } catch (error) {
      console.error('Error loading discussions:', error);
    } finally {
      setLoading(false);
    }
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
        <p className="text-gray-600">Please sign in to view discussions from your watched repositories.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Discussions</h1>
        <div className="grid gap-4">
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discussions</h1>
          <p className="text-gray-600 mt-1">Latest discussions from your watched repositories</p>
        </div>
        <Button onClick={loadDiscussions} variant="outline">
          Refresh
        </Button>
      </div>

      {discussions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions found</h3>
          <p className="text-gray-500">
            No recent discussions from your watched repositories.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {discussions.map((discussion) => (
            <Card key={`${discussion.repository.full_name}-${discussion.id}`} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {discussion.repository.full_name}
                      </Badge>
                      {discussion.category && (
                        <Badge variant="secondary" className="text-xs">
                          {discussion.category.emoji} {discussion.category.name}
                        </Badge>
                      )}
                      <span className="text-sm text-gray-500">#{discussion.number}</span>
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      <a
                        href={discussion.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-700 transition-colors"
                      >
                        {discussion.title}
                      </a>
                    </CardTitle>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="flex items-center gap-2"
                  >
                    <a
                      href={discussion.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {discussion.body && (
                    <div className="text-gray-700 text-sm line-clamp-3">
                      {discussion.body.substring(0, 200)}
                      {discussion.body.length > 200 && '...'}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <img 
                          src={discussion.user.avatar_url} 
                          alt={discussion.user.login}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="font-medium">{discussion.user.login}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(discussion.created_at)}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{discussion.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
