import { Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface YearFilterProps {
  selectedYear: string | null;
  onYearChange: (year: string | null) => void;
  availableYears: number[];
  className?: string;
}

export function YearFilter({ selectedYear, onYearChange, availableYears, className }: YearFilterProps) {
  return (
    <Select
      value={selectedYear || "all"}
      onValueChange={(value) => onYearChange(value === "all" ? null : value)}
    >
      <SelectTrigger className={`w-[160px] ${className}`}>
        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
        <SelectValue placeholder="All Years" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Years</SelectItem>
        {availableYears.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year} - {year + 1}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
