
interface IssueNotFoundProps {
  issueId: string;
  onBack: () => void;
  repositoryOwner?: string;
  repositoryName?: string;
  error?: string | null;
}

export const IssueNotFound = ({ 
  issueId, 
  onBack, 
  repositoryOwner, 
  repositoryName, 
  error 
}: IssueNotFoundProps) => {
  const repositoryInfo = repositoryOwner && repositoryName 
    ? `${repositoryOwner}/${repositoryName}` 
    : '';

  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Issue not found</h3>
      
      {error ? (
        <p className="text-red-600 mb-2">{error}</p>
      ) : (
        <p className="text-gray-500 mb-2">
          Issue #{issueId} {repositoryInfo && `in ${repositoryInfo} `}
          might not be synced yet or doesn't exist
        </p>
      )}
      
      {repositoryInfo && (
        <p className="text-sm text-gray-400 mb-4">
          Repository: {repositoryInfo}
        </p>
      )}
      
      <div className="flex gap-4 justify-center">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go Back
        </button>
        
        {repositoryOwner && repositoryName && (
          <a
            href={`https://github.com/${repositoryOwner}/${repositoryName}/issues/${issueId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            View on GitHub
          </a>
        )}
      </div>
    </div>
  );
};
