
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { IssueComments } from "./issue-detail/IssueComments";
import { IssueReactions } from "./issue-detail/IssueReactions";
import { IssueDetailLoading } from "./issue-detail/IssueDetailLoading";
import { IssueNotFound } from "./issue-detail/IssueNotFound";
import { IssueHeader } from "./issue-detail/IssueHeader";
import { IssueBody } from "./issue-detail/IssueBody";
import { IssueSidebarStats } from "./issue-detail/IssueSidebarStats";
import { useIssueQuery } from "@/hooks/queries/useIssueQuery";
import { useIssueVotesQuery } from "@/hooks/queries/useIssueVotesQuery";
import { useGitHubIssue } from "@/hooks/useGitHubIssue";
import { useIssueSync } from "@/hooks/useIssueSync";

interface IssueDetailProps {
  issueId: string;
  repositoryOwner?: string;
  repositoryName?: string;
  onBack: () => void;
}

export const IssueDetail = ({ issueId, repositoryOwner, repositoryName, onBack }: IssueDetailProps) => {
  // Debug logging
  console.log('IssueDetail props:', { issueId, repositoryOwner, repositoryName });
  
  // Always try GitHub API first if we have repository info
  const { issue: githubIssue, loading: githubLoading, error: githubError } = useGitHubIssue(
    issueId, 
    repositoryOwner, 
    repositoryName
  );
    // Fallback to database query if no repository info
  const { data: dbIssue, isLoading: dbLoading } = useIssueQuery(
    issueId, 
    repositoryOwner, 
    repositoryName
  );
  
  // Prioritize GitHub issue over database issue
  const issue = githubIssue || dbIssue;
  
  // Sync GitHub issue to database to get proper UUID for reactions/votes
  const { databaseIssueId, loading: syncLoading } = useIssueSync(
    githubIssue,
    repositoryOwner,
    repositoryName
  );
  
  const isLoading = (repositoryOwner && repositoryName) ? (githubLoading || syncLoading) : dbLoading;
    // Use database UUID for reactions/votes, fallback to synthetic ID if needed
  const voteIssueId = databaseIssueId || issue?.id || `github-${repositoryOwner}-${repositoryName}-${issueId}`;
  const { data: voteData } = useIssueVotesQuery(databaseIssueId); // Only query if we have database ID
  const [platformCommentsCount] = useState(0);

  const voteCount = voteData?.voteCount || 0;
  // Ensure userVote is properly typed as 'up' | 'down' | null
  const userVote: 'up' | 'down' | null = voteData?.userVote === 'up' || voteData?.userVote === 'down' 
    ? voteData.userVote 
    : null;

  const updateVote = (newCount: number, newUserVote: 'up' | 'down' | null) => {
    // This will be handled by React Query cache updates
    console.log('Vote updated:', { newCount, newUserVote });
  };

  if (isLoading) {
    return <IssueDetailLoading />;
  }
  if (!issue) {
    return <IssueNotFound 
      issueId={issueId} 
      onBack={onBack} 
      repositoryOwner={repositoryOwner}
      repositoryName={repositoryName}
      error={githubError}
    />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <IssueHeader issue={issue} onBack={onBack} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6 min-w-0">
            <IssueBody
              issue={issue}
              voteCount={voteCount}
              userVote={userVote}
              onVoteUpdate={updateVote}
              databaseIssueId={databaseIssueId || undefined}
            />

            <IssueReactions issueId={databaseIssueId || undefined} />

            <Separator className="my-6 sm:my-8" />
            
            <IssueComments 
              issueId={databaseIssueId || undefined}
              githubCommentsCount={issue.comments_count || 0}
              platformCommentsCount={platformCommentsCount}
              owner={issue.repositories?.full_name?.split('/')[0] || repositoryOwner || ''}
              repo={issue.repositories?.full_name?.split('/')[1] || repositoryName || ''}
              issueNumber={issue.number}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <IssueSidebarStats issue={issue} voteCount={voteCount} />
          </div>
        </div>
      </div>
    </div>
  );
};
