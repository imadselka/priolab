
import { User, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IssueVoting } from "./IssueVoting";

interface Issue {
  id: string;
  body: string | null;
  labels: string[];
  author_login: string;
  github_created_at: string;
  state: string;
}

interface IssueContentProps {
  issue: Issue;
  voteCount: number;
  userVote: 'up' | 'down' | null;
  onVoteUpdate: (newCount: number, newUserVote: 'up' | 'down' | null) => void;
}

export const IssueContent = ({ issue, voteCount, userVote, onVoteUpdate }: IssueContentProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 border-b">
        <div className="flex items-start space-x-4">
          <IssueVoting
            issueId={issue.id}
            initialVoteCount={voteCount}
            initialUserVote={userVote}
            onVoteUpdate={onVoteUpdate}
          />

          <div className="flex-1">
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{issue.author_login}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(issue.github_created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {issue.labels && issue.labels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {issue.labels.map((label) => (
                  <Badge key={label} variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {issue.body ? (
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
              {issue.body}
            </pre>
          </div>
        ) : (
          <p className="text-gray-500 italic">No description provided.</p>
        )}
      </CardContent>
    </Card>
  );
};
