
import { useParams } from "react-router-dom";
import { RepositoryIssues } from "@/components/RepositoryIssues";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";

const RepositoryIssuesPage = () => {
  const { owner, name } = useParams<{ owner: string; name: string }>();
  const navigate = useNavigate();

  if (!owner || !name) {
    return (
      <DashboardLayout activeTab="repositories">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Repository not found</h1>
          <p className="text-gray-600 mt-2">The repository you're looking for doesn't exist.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="repositories">
      <RepositoryIssues 
        owner={owner}
        name={name}
        onBack={() => navigate("/repositories")}
      />
    </DashboardLayout>
  );
};

export default RepositoryIssuesPage;
