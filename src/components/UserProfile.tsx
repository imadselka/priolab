
import { useState, useEffect } from "react";
import { User, GitBranch, MessageSquare, TrendingUp, Calendar, Mail, MapPin, Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<'profiles'>;

export const UserProfile = () => {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({ votes: 0, repositories: 0 });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserStats = async () => {
      if (!user) return { votes: 0, repositories: 0 };

      try {
        // Get vote count
        const { count: voteCount } = await supabase
          .from('votes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Get repository count
        const { count: repoCount } = await supabase
          .from('user_repositories')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_following', true);

        return {
          votes: voteCount || 0,
          repositories: repoCount || 0,
        };
      } catch (error) {
        console.error('Error fetching user stats:', error);
        return { votes: 0, repositories: 0 };
      }
    };

    const loadData = async () => {
      if (user) {
        await fetchProfile();
        const userStats = await fetchUserStats();
        setStats(userStats);
      }
    };
    
    loadData();
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Please sign in to view your profile</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">User Profile</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">View your profile and activity</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Information */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                )}
                <div className="text-center sm:text-left min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold truncate">
                    {profile?.name || profile?.github_username || 'Unknown User'}
                  </h2>
                  {profile?.github_username && (
                    <p className="text-sm sm:text-base text-gray-600 truncate">@{profile.github_username}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {profile?.email && (
                  <div className="flex items-center space-x-2 text-gray-600 min-w-0">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm sm:text-base truncate">{profile.email}</span>
                  </div>
                )}
                {profile?.location && (
                  <div className="flex items-center space-x-2 text-gray-600 min-w-0">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm sm:text-base truncate">{profile.location}</span>
                  </div>
                )}
                {profile?.github_created_at && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm sm:text-base">GitHub since {new Date(profile.github_created_at).getFullYear()}</span>
                  </div>
                )}
                {profile?.github_username && (
                  <div className="flex items-center space-x-2 text-gray-600 min-w-0">
                    <Github className="w-4 h-4 flex-shrink-0" />
                    <a 
                      href={`https://github.com/${profile.github_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 hover:text-blue-600 min-w-0"
                    >
                      <span className="text-sm sm:text-base truncate">GitHub Profile</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                )}
              </div>

              {profile?.bio && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <p className="text-sm sm:text-base text-gray-600 break-words">{profile.bio}</p>
                </div>
              )}

              {profile?.company && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Company</label>
                  <p className="text-sm sm:text-base text-gray-600 break-words">{profile.company}</p>
                </div>
              )}

              {profile?.blog && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Website</label>
                  <a 
                    href={profile.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center space-x-1 min-w-0"
                  >
                    <span className="text-sm sm:text-base break-all">{profile.blog}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* GitHub Stats */}
          {profile && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">GitHub Statistics</CardTitle>
                <CardDescription className="text-sm">Your GitHub activity and contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-base sm:text-lg font-semibold text-gray-900">{profile.public_repos || 0}</div>
                    <div className="text-xs text-gray-600">Public Repos</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-base sm:text-lg font-semibold text-gray-900">{profile.followers || 0}</div>
                    <div className="text-xs text-gray-600">Followers</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-base sm:text-lg font-semibold text-gray-900">{profile.following || 0}</div>
                    <div className="text-xs text-gray-600">Following</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-base sm:text-lg font-semibold text-gray-900">{profile.public_gists || 0}</div>
                    <div className="text-xs text-gray-600">Public Gists</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Platform Statistics */}
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Platform Activity</CardTitle>
              <CardDescription className="text-sm">Your engagement on our platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {Math.floor((stats.votes * 10) + (stats.repositories * 5))}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Reputation Points</div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-base sm:text-lg font-semibold text-gray-900">{stats.votes}</div>
                  <div className="text-xs text-gray-600">Votes Cast</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-base sm:text-lg font-semibold text-gray-900">{stats.repositories}</div>
                  <div className="text-xs text-gray-600">Repositories Following</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {!session?.provider_token && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Connect GitHub</CardTitle>
                <CardDescription className="text-sm">Link your GitHub account for full functionality</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-sm sm:text-base">
                  <Github className="w-4 h-4 mr-2" />
                  Connect GitHub Account
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
