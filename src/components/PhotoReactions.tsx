import { useState, useEffect } from 'react';
import type { ReactionType } from '@/types/reactions';

interface PhotoReactionsProps {
  photoId: string;
  className?: string;
}

type AllowedReaction = 'heart' | 'cry' | 'party' | 'anchor';

const REACTIONS: { type: AllowedReaction; emoji: string; label: string }[] = [
  { type: 'heart', emoji: '❤️', label: 'Love' },
  { type: 'cry', emoji: '🥹', label: 'Touched' },
  { type: 'party', emoji: '🎉', label: 'Celebrate' },
  { type: 'anchor', emoji: '⚓', label: 'Navy Pride' },
];

const STORAGE_KEY = 'photo_reactions';
const COUNTS_KEY = 'photo_reaction_counts';

interface StoredReactions {
  [photoId: string]: AllowedReaction[];
}

interface StoredCounts {
  [photoId: string]: {
    heart: number;
    cry: number;
    party: number;
    anchor: number;
  };
}

function getStoredReactions(): StoredReactions {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function setStoredReactions(reactions: StoredReactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reactions));
  } catch {
    // Storage full or not available
  }
}

function getStoredCounts(): StoredCounts {
  try {
    const stored = localStorage.getItem(COUNTS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function setStoredCounts(counts: StoredCounts) {
  try {
    localStorage.setItem(COUNTS_KEY, JSON.stringify(counts));
  } catch {
    // Storage full or not available
  }
}

export function PhotoReactions({ photoId, className }: PhotoReactionsProps) {
  const [userReactions, setUserReactions] = useState<AllowedReaction[]>([]);
  const [counts, setCounts] = useState<{ heart: number; cry: number; party: number; anchor: number }>({ heart: 0, cry: 0, party: 0, anchor: 0 });

  useEffect(() => {
    const storedReactions = getStoredReactions();
    const storedCounts = getStoredCounts();
    setUserReactions(storedReactions[photoId] || []);
    setCounts(storedCounts[photoId] || { heart: 0, cry: 0, party: 0, anchor: 0 });
  }, [photoId]);

  const hasUserReacted = (type: AllowedReaction) => userReactions.includes(type);

  const handleReaction = (type: AllowedReaction) => {
    const storedReactions = getStoredReactions();
    const storedCounts = getStoredCounts();
    const currentReactions = storedReactions[photoId] || [];
    const currentCounts = storedCounts[photoId] || { heart: 0, cry: 0, party: 0, anchor: 0 };
    
    let newReactions: AllowedReaction[];
    let newCounts = { ...currentCounts };
    
    if (currentReactions.includes(type)) {
      // Remove reaction
      newReactions = currentReactions.filter(r => r !== type);
      newCounts[type] = Math.max(0, newCounts[type] - 1);
    } else {
      // Add reaction
      newReactions = [...currentReactions, type];
      newCounts[type] = newCounts[type] + 1;
    }
    
    storedReactions[photoId] = newReactions;
    storedCounts[photoId] = newCounts;
    setStoredReactions(storedReactions);
    setStoredCounts(storedCounts);
    setUserReactions(newReactions);
    setCounts(newCounts);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {REACTIONS.map(({ type, emoji, label }) => {
        const isActive = hasUserReacted(type);
        const count = counts[type];
        
        return (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200 ${
              isActive 
                ? 'bg-white text-foreground scale-110 shadow-lg ring-2 ring-primary/50' 
                : 'bg-white/10 hover:bg-white/20 text-white hover:scale-105'
            }`}
            title={label}
          >
            <span className="text-xl">{emoji}</span>
            {count > 0 && (
              <span className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-white'}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
