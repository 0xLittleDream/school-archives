import { Heart, Laugh, Frown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePhotoReactions, useToggleReaction } from '@/hooks/usePhotoInteractions';
import { toast } from '@/hooks/use-toast';
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

export function PhotoReactions({ photoId, className }: PhotoReactionsProps) {
  const { user } = useAuth();
  const { data: reactions } = usePhotoReactions(photoId);
  const toggleReaction = useToggleReaction();

  const getCount = (type: ReactionType) => 
    reactions?.filter(r => r.reaction_type === type).length || 0;

  const hasUserReacted = (type: ReactionType) =>
    reactions?.some(r => r.user_id === user?.id && r.reaction_type === type);

  const handleReaction = async (type: ReactionType) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to react to photos.",
        variant: "destructive",
      });
      return;
    }

    try {
      await toggleReaction.mutateAsync({ photoId, reactionType: type });
    } catch {
      toast({
        title: "Error",
        description: "Failed to save reaction. Try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {REACTIONS.map(({ type, emoji, label }) => {
        const count = getCount(type);
        const isActive = hasUserReacted(type);
        
        return (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            disabled={toggleReaction.isPending}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all ${
              isActive 
                ? 'bg-primary/20 text-primary scale-105' 
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={`${label}${!user ? ' (login required)' : ''}`}
          >
            <span className="text-lg">{emoji}</span>
            {count > 0 && (
              <span className="text-sm font-medium">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
