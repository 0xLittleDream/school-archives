import { useState, useEffect } from 'react';
import { Heart, Laugh, Frown } from 'lucide-react';
import type { ReactionType } from '@/types/reactions';

interface PhotoReactionsProps {
  photoId: string;
  className?: string;
}

const REACTIONS: { type: ReactionType; emoji: string; icon: typeof Heart; label: string }[] = [
  { type: 'heart', emoji: '❤️', icon: Heart, label: 'Love' },
  { type: 'laugh', emoji: '😂', icon: Laugh, label: 'Haha' },
  { type: 'cry', emoji: '🥹', icon: Frown, label: 'Touched' },
];

const STORAGE_KEY = 'photo_reactions';

interface StoredReactions {
  [photoId: string]: ReactionType[];
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

export function PhotoReactions({ photoId, className }: PhotoReactionsProps) {
  const [userReactions, setUserReactions] = useState<ReactionType[]>([]);

  useEffect(() => {
    const stored = getStoredReactions();
    setUserReactions(stored[photoId] || []);
  }, [photoId]);

  const hasUserReacted = (type: ReactionType) => userReactions.includes(type);

  const handleReaction = (type: ReactionType) => {
    const stored = getStoredReactions();
    const currentReactions = stored[photoId] || [];
    
    let newReactions: ReactionType[];
    if (currentReactions.includes(type)) {
      // Remove reaction
      newReactions = currentReactions.filter(r => r !== type);
    } else {
      // Add reaction
      newReactions = [...currentReactions, type];
    }
    
    stored[photoId] = newReactions;
    setStoredReactions(stored);
    setUserReactions(newReactions);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {REACTIONS.map(({ type, emoji, label }) => {
        const isActive = hasUserReacted(type);
        
        return (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all ${
              isActive 
                ? 'bg-primary/20 text-primary scale-105' 
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={label}
          >
            <span className="text-lg">{emoji}</span>
          </button>
        );
      })}
    </div>
  );
}
