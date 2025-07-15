
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Issue {
  id: string;
  number: number;
  title: string;
  state: string;
  html_url: string;
  repositories?: {
    full_name: string;
  };
}

interface IssueDetailHeaderProps {
  issue: Issue;
  onBack: () => void;
}

export const IssueDetailHeader = ({ issue, onBack }: IssueDetailHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
      <Button variant="outline" onClick={onBack} className="w-fit text-sm sm:text-base">
        <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
        Back
      </Button>
      <div className="flex-1 min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 line-clamp-2">{issue.title}</h1>
        <div className="flex flex-col xs:flex-row xs:items-center space-y-1 xs:space-y-0 xs:space-x-2 mt-1">
          <p className="text-gray-600 text-sm sm:text-base">#{issue.number} in {issue.repositories?.full_name}</p>
          <Badge variant={issue.state === 'open' ? 'default' : 'secondary'} className="w-fit">
            {issue.state}
          </Badge>
        </div>
      </div>
      <a 
        href={issue.html_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 w-fit text-sm sm:text-base"
      >
        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden xs:inline">View on GitHub</span>
        <span className="xs:hidden">GitHub</span>
      </a>
    </div>
  );
};
