
import { TrendingPage as TrendingComponent } from "@/components/TrendingPage";
import { DashboardLayout } from "@/components/DashboardLayout";

const TrendingPage = () => {
  return (
    <DashboardLayout activeTab="trending">
      <TrendingComponent />
    </DashboardLayout>
  );
};

export default TrendingPage;
