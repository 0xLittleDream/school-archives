import { useBranch } from '@/contexts/BranchContext';
import { Button } from '@/components/ui/button';
import { MapPin, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBranches } from '@/hooks/useDatabase';
import type { Branch } from '@/types/database';

export function BranchIndicator() {
  const { selectedBranch, setSelectedBranch, clearBranch } = useBranch();
  const { data: branches } = useBranches();

  if (!selectedBranch) return null;

  const handleBranchChange = (branch: Branch) => {
    setSelectedBranch(branch);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 h-9 px-3 bg-secondary/50 hover:bg-secondary"
        >
          <MapPin className="h-4 w-4 text-primary" />
          <span className="font-medium">{selectedBranch.name}</span>
          <span className="text-muted-foreground">({selectedBranch.code})</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card border-border z-50">
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          Switch Branch
        </div>
        {branches?.map((branch) => (
          <DropdownMenuItem
            key={branch.id}
            onClick={() => handleBranchChange(branch)}
            className={branch.id === selectedBranch.id ? 'bg-primary/10' : ''}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-sm font-bold">
                {branch.code}
              </div>
              <div className="flex-1">
                <p className="font-medium">{branch.name}</p>
                {branch.location && (
                  <p className="text-xs text-muted-foreground">{branch.location}</p>
                )}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={clearBranch} className="text-muted-foreground">
          Change branch selection
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
