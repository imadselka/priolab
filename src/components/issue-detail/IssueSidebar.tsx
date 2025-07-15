
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Issue {
  state: string;
  comments_count: number;
  repositories?: {
    full_name: string;
  };
}

interface IssueSidebarProps {
  issue: Issue;
  voteCount: number;
  platformCommentsCount: number;
}

export const IssueSidebar = ({ issue, voteCount, platformCommentsCount }: IssueSidebarProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Issue Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 text-sm mb-1">Repository</h4>
          <p className="text-sm text-gray-600">{issue.repositories?.full_name}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 text-sm mb-1">Status</h4>
          <Badge variant={issue.state === 'open' ? 'default' : 'secondary'}>
            {issue.state}
          </Badge>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 text-sm mb-1">Community Votes</h4>
          <p className="text-xl font-bold text-gray-900">{voteCount}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 text-sm mb-1">GitHub Comments</h4>
          <p className="text-sm text-gray-600">{issue.comments_count || 0}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 text-sm mb-1">Platform Discussion</h4>
          <p className="text-sm text-gray-600">{platformCommentsCount} comments</p>
        </div>
      </CardContent>
    </Card>
  );
};
