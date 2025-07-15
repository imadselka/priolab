
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FilterOption {
  value: string;
  label: string;
}

interface IssueListHeaderProps {
  searchQuery: string;
  filter: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: string) => void;
}

const filterOptions: FilterOption[] = [
  { value: "all", label: "All Issues" },
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
  { value: "following", label: "Following" },
];

export const IssueListHeader = ({ 
  searchQuery, 
  filter, 
  onSearchChange, 
  onFilterChange 
}: IssueListHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Community Issues</h1>
        <p className="text-gray-600 mt-1">Discover and prioritize issues that matter most</p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
        
        <select 
          value={filter} 
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
        >
          {filterOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
