
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, Star, MessageSquare } from "lucide-react";

interface SortOption {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface IssueListControlsProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const sortOptions: SortOption[] = [
  { value: "votes", label: "Most Voted", icon: TrendingUp },
  { value: "recent", label: "Recent", icon: Clock },
  { value: "comments", label: "Most Discussed", icon: MessageSquare },
  { value: "starred", label: "Starred", icon: Star },
];

export const IssueListControls = ({ sortBy, onSortChange }: IssueListControlsProps) => {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
      {sortOptions.map((option) => {
        const Icon = option.icon;
        return (
          <Button
            key={option.value}
            variant={sortBy === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onSortChange(option.value)}
            className="flex items-center space-x-2 whitespace-nowrap"
          >
            <Icon className="w-4 h-4" />
            <span>{option.label}</span>
          </Button>
        );
      })}
    </div>
  );
};
