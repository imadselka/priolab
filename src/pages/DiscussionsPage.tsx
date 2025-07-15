
import { DashboardLayout } from "@/components/DashboardLayout";
import { DiscussionsList } from "@/components/DiscussionsList";

const DiscussionsPage = () => {
  return (
    <DashboardLayout activeTab="discussions">
      <DiscussionsList />
    </DashboardLayout>
  );
};

export default DiscussionsPage;
