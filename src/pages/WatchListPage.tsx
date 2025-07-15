
import { DashboardLayout } from "@/components/DashboardLayout";
import { WatchList } from "@/components/WatchList";

const WatchListPage = () => {
  return (
    <DashboardLayout activeTab="watchlist">
      <WatchList />
    </DashboardLayout>
  );
};

export default WatchListPage;
