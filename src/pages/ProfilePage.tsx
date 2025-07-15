
import { UserProfile } from "@/components/UserProfile";
import { DashboardLayout } from "@/components/DashboardLayout";

const ProfilePage = () => {
  return (
    <DashboardLayout activeTab="profile">
      <UserProfile />
    </DashboardLayout>
  );
};

export default ProfilePage;
