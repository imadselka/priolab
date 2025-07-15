
import { DashboardHome } from "@/components/DashboardHome";
import { DashboardLayout } from "@/components/DashboardLayout";

const Dashboard = () => {
  return (
    <DashboardLayout activeTab="dashboard">
      <DashboardHome />
    </DashboardLayout>
  );
};

export default Dashboard;
