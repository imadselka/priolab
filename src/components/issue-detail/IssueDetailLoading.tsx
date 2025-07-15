
export const IssueDetailLoading = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
      </div>
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};
