
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface IssueCardProps {
  issue: {
    id: string;
    number: number;
    title: string;
    body?: string | null;
    state: string;
    labels?: string[];
    github_created_at: string;
    comments_count?: number;
    author_login: string;
    author_avatar_url?: string | null;
    repositories?: {
      full_name: string;
    };
  };
  voteCount?: number;
  showRepository?: boolean;
}

export const IssueCard = ({ issue, voteCount = 0, showRepository = true }: IssueCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (issue.repositories?.full_name) {
      const [owner, repo] = issue.repositories.full_name.split('/');
      navigate(`/repositories/${owner}/${repo}/issues/${issue.number}`);
    } else {
      // Fallback to trending route if no repository info
      navigate(`/trending/issues/${issue.id}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Handle image display in issue body
  const renderBodyWithImages = (body: string | null) => {
    if (!body) return "No description provided.";
    
    // Simple regex to detect image URLs and render them
    const imageRegex = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/gi;
    const parts = body.split(imageRegex);
    
    return parts.map((part, index) => {
      if (imageRegex.test(part)) {
        return (
          <img 
            key={index} 
            src={part} 
            alt="Issue content" 
            className="max-w-full h-auto rounded-lg my-2"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.01] sm:hover:scale-[1.02] border-l-4 border-l-blue-500"
      onClick={handleClick}
    >
      <CardHeader className="pb-3 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant={issue.state === 'open' ? 'default' : 'secondary'} className="text-xs">
                {issue.state}
              </Badge>
              <span className="text-xs sm:text-sm text-gray-500">#{issue.number}</span>
              {showRepository && issue.repositories?.full_name && (
                <span className="text-xs sm:text-sm text-blue-600 font-medium truncate max-w-32 sm:max-w-none">
                  {issue.repositories.full_name}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-base sm:text-lg leading-tight text-gray-900 hover:text-blue-700 transition-colors line-clamp-2">
              {issue.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:ml-4">
            <div className="flex items-center gap-1 text-gray-600">
              <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">{voteCount}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 p-4 sm:p-6 sm:pt-0">
        <div className="space-y-2 sm:space-y-3">
          {issue.body && (
            <div className="text-gray-700 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 prose prose-sm max-w-none">
              {renderBodyWithImages(issue.body)}
            </div>
          )}

          {issue.labels && issue.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {issue.labels.slice(0, 3).map((label) => (
                <Badge key={label} variant="outline" className="text-xs px-2 py-0.5">
                  {label}
                </Badge>
              ))}
              {issue.labels.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{issue.labels.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 text-xs sm:text-sm text-gray-500">
            <div className="flex flex-wrap items-center gap-2 xs:gap-4">
              <div className="flex items-center gap-1">
                <img 
                  src={issue.author_avatar_url || `https://github.com/${issue.author_login}.png`} 
                  alt={issue.author_login}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${issue.author_login}&background=e5e7eb&color=374151`;
                  }}
                />
                <span className="font-medium truncate max-w-24 xs:max-w-none">{issue.author_login}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">{formatDate(issue.github_created_at)}</span>
                <span className="xs:hidden">{new Date(issue.github_created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>

              {typeof issue.comments_count === 'number' && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{issue.comments_count}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
