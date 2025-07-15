
import { DashboardLayout } from "@/components/DashboardLayout";
import { StarredRepositories } from "@/components/StarredRepositories";

const StarredPage = () => {
  return (
    <DashboardLayout activeTab="starred">
      <StarredRepositories />
    </DashboardLayout>
  );
};

export default StarredPage;
