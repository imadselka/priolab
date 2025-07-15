
import { Card, CardContent } from "@/components/ui/card";
import { IssueVoting } from "./IssueVoting";
import ReactMarkdown from 'react-markdown';

interface Issue {
  id: string;
  body: string | null;
}

interface IssueBodyProps {
  issue: Issue;
  voteCount: number;
  userVote: 'up' | 'down' | null;
  onVoteUpdate: (newCount: number, newUserVote: 'up' | 'down' | null) => void;
  databaseIssueId?: string;
}

export const IssueBody = ({ issue, voteCount, userVote, onVoteUpdate, databaseIssueId }: IssueBodyProps) => {
  return (
    <Card className="border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row sm:items-start">
          {databaseIssueId && (
            <div className="p-3 sm:p-4 border-b sm:border-b-0 sm:border-r bg-gray-50 sm:min-w-0">
              <IssueVoting
                issueId={databaseIssueId}
                initialVoteCount={voteCount}
                initialUserVote={userVote}
                onVoteUpdate={onVoteUpdate}
              />
            </div>
          )}
          
          <div className="flex-1 p-4 sm:p-6 prose prose-github max-w-none min-w-0 text-sm sm:text-base">
            {issue.body ? (
              <ReactMarkdown>
                {issue.body}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-500 italic">No description provided.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
