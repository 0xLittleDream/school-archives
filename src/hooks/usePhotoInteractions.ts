import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { PhotoReaction, PhotoComment, ReactionType, ReactionCount } from '@/types/reactions';

// Fetch reactions for a photo
export function usePhotoReactions(photoId: string) {
  return useQuery({
    queryKey: ['photo_reactions', photoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photo_reactions')
        .select('*')
        .eq('photo_id', photoId);
      
      if (error) throw error;
      return data as PhotoReaction[];
    },
    enabled: !!photoId,
  });
}

// Get reaction counts for a photo
export function useReactionCounts(photoId: string) {
  const { data: reactions } = usePhotoReactions(photoId);
  
  const counts: ReactionCount = {
    heart: 0,
    laugh: 0,
    cry: 0,
  };
  
  reactions?.forEach(r => {
    if (r.reaction_type in counts) {
      counts[r.reaction_type as ReactionType]++;
    }
  });
  
  return counts;
}

// Check if user has reacted
export function useUserReaction(photoId: string, reactionType: ReactionType) {
  const { user } = useAuth();
  const { data: reactions } = usePhotoReactions(photoId);
  
  return reactions?.find(r => r.user_id === user?.id && r.reaction_type === reactionType);
}

// Toggle reaction mutation
export function useToggleReaction() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ photoId, reactionType }: { photoId: string; reactionType: ReactionType }) => {
      if (!user) throw new Error('Must be logged in to react');
      
      // Check if reaction exists
      const { data: existing } = await supabase
        .from('photo_reactions')
        .select('id')
        .eq('photo_id', photoId)
        .eq('user_id', user.id)
        .eq('reaction_type', reactionType)
        .maybeSingle();
      
      if (existing) {
        // Remove reaction
        const { error } = await supabase
          .from('photo_reactions')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
        return { action: 'removed' };
      } else {
        // Add reaction
        const { error } = await supabase
          .from('photo_reactions')
          .insert({ photo_id: photoId, user_id: user.id, reaction_type: reactionType });
        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: (_, { photoId }) => {
      queryClient.invalidateQueries({ queryKey: ['photo_reactions', photoId] });
    },
  });
}

// Fetch comments for a photo
export function usePhotoComments(photoId: string) {
  return useQuery({
    queryKey: ['photo_comments', photoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photo_comments')
        .select('*')
        .eq('photo_id', photoId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as PhotoComment[];
    },
    enabled: !!photoId,
  });
}

// Add comment mutation
export function useAddComment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ photoId, content }: { photoId: string; content: string }) => {
      if (!user) throw new Error('Must be logged in to comment');
      if (!content.trim()) throw new Error('Comment cannot be empty');
      if (content.length > 500) throw new Error('Comment too long');
      
      const { data, error } = await supabase
        .from('photo_comments')
        .insert({ photo_id: photoId, user_id: user.id, content: content.trim() })
        .select()
        .single();
      
      if (error) throw error;
      return data as PhotoComment;
    },
    onSuccess: (_, { photoId }) => {
      queryClient.invalidateQueries({ queryKey: ['photo_comments', photoId] });
    },
  });
}

// Delete comment mutation
export function useDeleteComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ commentId, photoId }: { commentId: string; photoId: string }) => {
      const { error } = await supabase
        .from('photo_comments')
        .delete()
        .eq('id', commentId);
      
      if (error) throw error;
      return { photoId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['photo_comments', data.photoId] });
    },
  });
}
