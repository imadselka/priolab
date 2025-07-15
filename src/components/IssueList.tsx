
import { useState } from "react";
import { IssueCard } from "@/components/IssueCard";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIssuesQuery } from "@/hooks/queries/useIssuesQuery";
import { IssueListHeader } from "./IssueListHeader";
import { IssueListControls } from "./IssueListControls";

export const IssueList = () => {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState("votes");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: issues = [], isLoading } = useIssuesQuery(sortBy, filter, searchQuery);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] px-4">
        <p className="text-gray-500 text-sm sm:text-base">Please sign in to view issues</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/2 sm:w-1/3 mb-4"></div>
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 sm:h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <IssueListHeader
        searchQuery={searchQuery}
        filter={filter}
        onSearchChange={setSearchQuery}
        onFilterChange={setFilter}
      />

      <IssueListControls
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {issues.length === 0 ? (
        <div className="text-center py-8 sm:py-12 px-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No issues found</h3>
          <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
            {searchQuery ? 'Try adjusting your search terms' : 'Connect some repositories to see issues here'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} voteCount={issue.votes_count || 0} />
          ))}
        </div>
      )}

      {issues.length > 0 && (
        <div className="text-center">
          <Button variant="outline" className="mt-4 text-sm sm:text-base">
            Load More Issues
          </Button>
        </div>
      )}
    </div>
  );
};
