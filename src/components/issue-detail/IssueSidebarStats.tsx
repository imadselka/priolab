
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, Circle, Eye, GitFork, MessageSquare } from "lucide-react";

interface Issue {
  id: string;
  state: string;
  comments_count: number;
  repositories?: {
    full_name: string;
  };
}

interface IssueSidebarStatsProps {
  issue: Issue;
  voteCount: number;
}

export const IssueSidebarStats = ({ issue, voteCount }: IssueSidebarStatsProps) => {
  return (
    <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-24">
      {/* Quick Stats */}
      <Card className="overflow-hidden border border-gray-200 shadow-sm transition-all hover:shadow-md">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4 border-b">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Quick Stats</h3>
          </div>
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600 flex items-center">
                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-400" />
                Votes
              </span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors text-xs sm:text-sm">
                {voteCount}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600 flex items-center">
                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-400" />
                Comments
              </span>
              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors text-xs sm:text-sm">
                {issue.comments_count || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600 flex items-center">
                <Circle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-400" />
                Status
              </span>
              <Badge 
                variant={issue.state === 'open' ? 'default' : 'secondary'}
                className={`text-xs sm:text-sm ${issue.state === 'open' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
              >
                {issue.state}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Repository Info */}
      {issue.repositories?.full_name && (
        <Card className="overflow-hidden border border-gray-200 shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 sm:p-4 border-b">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Repository</h3>
            </div>
            <div className="p-3 sm:p-4 space-y-3">
              <p className="text-xs sm:text-sm text-blue-600 font-medium flex items-center">
                <GitFork className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-500" />
                <span className="truncate">{issue.repositories.full_name}</span>
              </p>
              <Button variant="outline" size="sm" className="w-full transition-colors hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-xs sm:text-sm" asChild>
                <a 
                  href={`https://github.com/${issue.repositories.full_name}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  <span className="hidden xs:inline">View Repository</span>
                  <span className="xs:hidden">Repository</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
