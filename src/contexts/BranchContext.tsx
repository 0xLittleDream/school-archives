import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Branch } from '@/types/database';

interface BranchContextType {
  selectedBranch: Branch | null;
  selectedBranchId: string | null;
  setSelectedBranch: (branch: Branch) => void;
  clearBranch: () => void;
  isLoading: boolean;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

const STORAGE_KEY = 'ncs-selected-branch';

export function BranchProvider({ children }: { children: ReactNode }) {
  const [selectedBranch, setSelectedBranchState] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const branch = JSON.parse(stored) as Branch;
        setSelectedBranchState(branch);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const setSelectedBranch = (branch: Branch) => {
    setSelectedBranchState(branch);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(branch));
  };

  const clearBranch = () => {
    setSelectedBranchState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <BranchContext.Provider
      value={{
        selectedBranch,
        selectedBranchId: selectedBranch?.id || null,
        setSelectedBranch,
        clearBranch,
        isLoading,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
}
