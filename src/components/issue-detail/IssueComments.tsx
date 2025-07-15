
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitHubComments } from "./GitHubComments";
import { PlatformComments } from "./PlatformComments";

interface IssueCommentsProps {
  issueId?: string; // Make optional since it might be undefined during sync
  githubCommentsCount: number;
  platformCommentsCount: number;
  owner: string;
  repo: string;
  issueNumber: number;
}

export const IssueComments = ({ 
  issueId, 
  githubCommentsCount, 
  platformCommentsCount,
  owner,
  repo,
  issueNumber
}: IssueCommentsProps) => {
  return (
    <Card className="border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <Tabs defaultValue="platform" className="w-full">
        <div className="p-3 sm:p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100">
            <TabsTrigger 
              value="platform"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all text-xs sm:text-sm"
            >
              <span className="hidden xs:inline">Platform Discussion ({platformCommentsCount})</span>
              <span className="xs:hidden">Platform ({platformCommentsCount})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="github"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all text-xs sm:text-sm"
            >
              <span className="hidden xs:inline">GitHub Comments ({githubCommentsCount})</span>
              <span className="xs:hidden">GitHub ({githubCommentsCount})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-0">
          <TabsContent value="platform" className="m-0 p-3 sm:p-4">
            <PlatformComments issueId={issueId} />
          </TabsContent>

          <TabsContent value="github" className="m-0 p-3 sm:p-4">
            <GitHubComments 
              issueId={issueId}
              owner={owner}
              repo={repo}
              issueNumber={issueNumber}
            />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};
