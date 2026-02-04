import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

  // Load from localStorage on mount and validate it still exists
  useEffect(() => {
    const validateAndLoad = async () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const branch = JSON.parse(stored) as Branch;
          
          // Validate the stored branch still exists in the database
          const { data, error } = await supabase
            .from('branches')
            .select('id, name, code, location')
            .eq('id', branch.id)
            .maybeSingle();
          
          if (error || !data) {
            // Branch no longer exists, clear it so modal shows again
            console.log('Stored branch no longer exists, clearing...');
            localStorage.removeItem(STORAGE_KEY);
          } else {
            // Update with fresh data from database
            setSelectedBranchState(data as Branch);
          }
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      setIsLoading(false);
    };
    
    validateAndLoad();
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
