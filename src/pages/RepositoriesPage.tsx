
import { RepositoryManager } from "@/components/RepositoryManager";
import { DashboardLayout } from "@/components/DashboardLayout";

const RepositoriesPage = () => {
  return (
    <DashboardLayout activeTab="repositories">
      <RepositoryManager />
    </DashboardLayout>
  );
};

export default RepositoriesPage;
