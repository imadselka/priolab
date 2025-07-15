
import { Settings } from "@/components/Settings";
import { DashboardLayout } from "@/components/DashboardLayout";

const SettingsPage = () => {
  return (
    <DashboardLayout activeTab="settings">
      <Settings />
    </DashboardLayout>
  );
};

export default SettingsPage;
