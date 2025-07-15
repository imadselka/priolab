
import { useState } from "react";
import { Search, Code, Star, TrendingUp, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingRepos } from "@/components/TrendingRepos";
import { UserRepos } from "@/components/UserRepos";
import { cn } from "@/lib/utils";

export const TrendingPage = () => {
  const [activeTab, setActiveTab] = useState<"trending" | "user">("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("weekly");
  const [languageFilter, setLanguageFilter] = useState("all");

  const tabs = [
    { 
      id: "trending", 
      label: "Trending", 
      icon: TrendingUp,
      description: "Discover popular repositories"
    },
    { 
      id: "user", 
      label: "Your Repos", 
      icon: Code,
      description: "Manage your repositories"
    }
  ];

  const timeFilters = [
    { value: "daily", label: "Today" },
    { value: "weekly", label: "This Week" },
    { value: "monthly", label: "This Month" }
  ];

  const languageFilters = [
    { value: "all", label: "All Languages" },
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "cpp", label: "C++" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="flex justify-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Explore Repositories</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 px-4 sm:px-0">Discover trending projects and manage your repositories</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border shadow-sm p-4 sm:p-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:gap-3">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeFilters.map(filter => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageFilters.map(filter => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as "trending" | "user")}
                    className={cn(
                      "flex items-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0",
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 bg-blue-50"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "trending" && (
              <TrendingRepos 
                searchQuery={searchQuery}
                timeFilter={timeFilter}
                languageFilter={languageFilter}
              />
            )}
            {activeTab === "user" && (
              <UserRepos searchQuery={searchQuery} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
