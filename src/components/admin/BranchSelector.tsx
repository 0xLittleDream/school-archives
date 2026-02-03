import { useBranches } from '@/hooks/useDatabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface BranchSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function BranchSelector({
  value,
  onValueChange,
  placeholder = 'Select a branch',
  className,
}: BranchSelectorProps) {
  const { data: branches, isLoading } = useBranches();

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {branches?.map((branch) => (
          <SelectItem key={branch.id} value={branch.id}>
            {branch.name} ({branch.code})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
