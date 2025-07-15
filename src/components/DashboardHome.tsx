
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  GitBranch, 
  Eye,
  Star,
  Activity,
  Calendar,
  Target
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface UserStats {
  issuesCommented: number;
  issuesUpvoted: number;
  issuesDownvoted: number;
  issuesReacted: number;
  repositoriesWatched: number;
  totalVotes: number;
  totalComments: number;
  totalReactions: number;
}

export const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    issuesCommented: 0,
    issuesUpvoted: 0,
    issuesDownvoted: 0,
    issuesReacted: 0,
    repositoriesWatched: 0,
    totalVotes: 0,
    totalComments: 0,
    totalReactions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserStats = async () => {
      if (!user) return;

      try {
        // Get user's votes
        const { data: votes } = await supabase
          .from('votes')
          .select('vote_type')
          .eq('user_id', user.id);

        // Get user's comments
        const { data: comments } = await supabase
          .from('platform_comments')
          .select('id')
          .eq('user_id', user.id);

        // Get user's reactions
        const { data: reactions } = await supabase
          .from('comment_reactions')
          .select('id')
          .eq('user_id', user.id);

        // Get watched repositories
        const { data: watchedRepos } = await supabase
          .from('user_repository_watches')
          .select('id')
          .eq('user_id', user.id);

        const upvotes = votes?.filter(v => v.vote_type === 'up').length || 0;
        const downvotes = votes?.filter(v => v.vote_type === 'down').length || 0;

        setStats({
          issuesCommented: comments?.length || 0,
          issuesUpvoted: upvotes,
          issuesDownvoted: downvotes,
          issuesReacted: reactions?.length || 0,
          repositoriesWatched: watchedRepos?.length || 0,
          totalVotes: votes?.length || 0,
          totalComments: comments?.length || 0,
          totalReactions: reactions?.length || 0
        });
      } catch (error) {
        console.error('Error loading user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadUserStats();
    }
  }, [user]);

  const statCards = [
    {
      title: "Issues Upvoted",
      value: stats.issuesUpvoted,
      icon: ThumbsUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+12%"
    },
    {
      title: "Issues Downvoted", 
      value: stats.issuesDownvoted,
      icon: ThumbsDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
      change: "-5%"
    },
    {
      title: "Comments Made",
      value: stats.issuesCommented,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+23%"
    },
    {
      title: "Reactions Given",
      value: stats.issuesReacted,
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+8%"
    },
    {
      title: "Repositories Watched",
      value: stats.repositoriesWatched,
      icon: Eye,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+15%"
    },
    {
      title: "Total Engagement",
      value: stats.totalVotes + stats.totalComments + stats.totalReactions,
      icon: Target,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      change: "+18%"
    }
  ];

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 sm:p-6 lg:p-8 text-white">
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Star className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold break-words">
              Welcome back, {user?.user_metadata?.full_name || 'Developer'}!
            </h1>
            <p className="text-blue-100 mt-1 text-sm sm:text-base">Here's your activity summary and platform insights</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  {stat.title}
                </CardTitle>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity Overview */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate">Upvoted an issue</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate">Added a comment</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate">Started watching a repository</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
              <span>Quick Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                <span className="text-xs sm:text-sm font-medium">Voting Ratio</span>
                <span className="text-xs sm:text-sm font-bold text-green-600">
                  {stats.issuesUpvoted > 0 ? ((stats.issuesUpvoted / Math.max(stats.totalVotes, 1)) * 100).toFixed(1) : 0}% Positive
                </span>
              </div>
              <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                <span className="text-xs sm:text-sm font-medium">Engagement Score</span>
                <span className="text-xs sm:text-sm font-bold text-blue-600">
                  {stats.totalVotes + stats.totalComments + stats.totalReactions}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                <span className="text-xs sm:text-sm font-medium">Active Since</span>
                <span className="text-xs sm:text-sm font-bold text-gray-600">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
