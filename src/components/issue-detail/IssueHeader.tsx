
import { ArrowLeft, ExternalLink, Calendar, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Issue {
  id: string;
  number: number;
  title: string;
  state: string;
  html_url: string;
  author_login: string;
  github_created_at: string;
  comments_count: number;
  labels: string[];
  repositories?: {
    full_name: string;
  };
}

interface IssueHeaderProps {
  issue: Issue;
  onBack: () => void;
}

export const IssueHeader = ({ issue, onBack }: IssueHeaderProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-5 gap-3 sm:gap-0">
          <div className="flex flex-col xs:flex-row xs:items-center space-y-2 xs:space-y-0 xs:space-x-4">
            <Button variant="outline" onClick={onBack} className="hover:bg-gray-100 transition-colors w-fit text-sm sm:text-base">
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={issue.state === 'open' ? 'default' : 'secondary'}
                className={`${issue.state === 'open' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-purple-600 hover:bg-purple-700'} transition-colors px-3 py-1 text-xs sm:text-sm font-medium`}
              >
                {issue.state}
              </Badge>
              <span className="text-base sm:text-lg font-semibold text-gray-700">#{issue.number}</span>
            </div>
          </div>
          
          <Button variant="outline" asChild className="transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 w-fit text-sm sm:text-base">
            <a 
              href={issue.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2"
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">View on GitHub</span>
              <span className="xs:hidden">GitHub</span>
            </a>
          </Button>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight line-clamp-3">
          {issue.title}
        </h1>
        
        <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-6 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
          <div className="flex items-center space-x-2">
            <Avatar className="w-5 h-5 sm:w-6 sm:h-6 border border-gray-200">
              <AvatarFallback>{issue.author_login?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{issue.author_login}</span>
          </div>
          <span className="text-gray-500">
            <span className="hidden xs:inline">opened this issue on {formatDate(issue.github_created_at)}</span>
            <span className="xs:hidden">{formatDate(issue.github_created_at)}</span>
          </span>
        </div>

        {issue.labels && issue.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
            {issue.labels.map((label) => (
              <Badge key={label} variant="outline" className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors text-xs sm:text-sm">
                {label}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
