import { useParams } from "react-router-dom";
import { IssueDetail } from "@/components/IssueDetail";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";

const IssueDetailPage = () => {
  const { issueId, owner, name } = useParams<{ 
    issueId: string; 
    owner?: string; 
    name?: string; 
  }>();
  const navigate = useNavigate();

  // Debug logging
  console.log('IssueDetailPage params:', { issueId, owner, name });

  if (!issueId) {
    return (
      <DashboardLayout activeTab="trending">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Issue not found</h1>
          <p className="text-gray-600 mt-2">The issue you're looking for doesn't exist.</p>
        </div>
      </DashboardLayout>
    );
  }
  const handleBack = () => {
    if (owner && name) {
      // If we have owner and name, go back to repository issues
      navigate(`/repositories/${owner}/${name}/issues`);
    } else {
      // Otherwise go back in history (for trending pages)
      navigate(-1);
    }
  };

  const activeTab = owner && name ? "repositories" : "trending";

  return (
    <DashboardLayout activeTab={activeTab}>
      <IssueDetail 
        issueId={issueId}
        repositoryOwner={owner}
        repositoryName={name}
        onBack={handleBack}
      />
    </DashboardLayout>
  );
};

export default IssueDetailPage;
