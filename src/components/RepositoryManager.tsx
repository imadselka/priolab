
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, User, Building } from "lucide-react";
import { WatchList } from "@/components/WatchList";
import { UserRepos } from "@/components/UserRepos";

export const RepositoryManager = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Repositories</h1>
      </div>

      <Tabs defaultValue="watched" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 h-auto">
          <TabsTrigger value="watched" className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Watched</span>
            <span className="xs:hidden">Watch</span>
          </TabsTrigger>
          <TabsTrigger value="yours" className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <User className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Your Repos</span>
            <span className="xs:hidden">Yours</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="watched" className="space-y-4">
          <WatchList />
        </TabsContent>

        <TabsContent value="yours" className="space-y-4">
          <UserRepos searchQuery={searchQuery} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
