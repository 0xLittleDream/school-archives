import { useState } from 'react';
import { useBranches } from '@/hooks/useDatabase';
import { useBranch } from '@/contexts/BranchContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, School, ChevronRight, Sparkles } from 'lucide-react';
import type { Branch } from '@/types/database';
import { cn } from '@/lib/utils';

export function BranchSelectionModal() {
  const { selectedBranch, setSelectedBranch, isLoading: contextLoading } = useBranch();
  const { data: branches, isLoading: branchesLoading } = useBranches();
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);
  const [selectedForConfirm, setSelectedForConfirm] = useState<Branch | null>(null);

  // Don't show if already selected or still loading
  if (contextLoading || selectedBranch) {
    return null;
  }

  const handleConfirm = () => {
    if (selectedForConfirm) {
      setSelectedBranch(selectedForConfirm);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/95 backdrop-blur-md" />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg animate-fade-in">
        <div className="bg-card rounded-3xl shadow-elegant-lg border border-border overflow-hidden">
          {/* Header */}
          <div className="relative p-8 pb-6 text-center bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <School className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Welcome to NCS Memories
            </h2>
            <p className="text-muted-foreground">
              Select your school branch to continue
            </p>
          </div>

          {/* Branch List */}
          <div className="p-6 space-y-3">
            {branchesLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }, (_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            ) : branches && branches.length > 0 ? (
              branches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => setSelectedForConfirm(branch)}
                  onMouseEnter={() => setHoveredBranch(branch.id)}
                  onMouseLeave={() => setHoveredBranch(null)}
                  className={cn(
                    'w-full p-4 rounded-xl border-2 text-left transition-all duration-200 group',
                    selectedForConfirm?.id === branch.id
                      ? 'border-primary bg-primary/5 shadow-elegant'
                      : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                        selectedForConfirm?.id === branch.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                      )}>
                        <span className="font-bold text-lg">{branch.code}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">
                          {branch.name}
                        </h3>
                        {branch.location && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {branch.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={cn(
                      'h-5 w-5 transition-all',
                      selectedForConfirm?.id === branch.id || hoveredBranch === branch.id
                        ? 'text-primary translate-x-0 opacity-100'
                        : 'text-muted-foreground -translate-x-2 opacity-0'
                    )} />
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8">
                <School className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">No branches available.</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Please add branches in the admin dashboard.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {selectedForConfirm && (
            <div className="p-6 pt-0">
              <Button
                onClick={handleConfirm}
                className="w-full h-14 text-base font-semibold gap-2"
              >
                <Sparkles className="h-5 w-5" />
                Enter {selectedForConfirm.name}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
