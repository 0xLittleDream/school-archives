import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Collection } from '@/types/database';

interface CreateCollectionData {
  title: string;
  description?: string;
  cover_image_url?: string;
  event_date?: string;
  branch_id: string;
  is_featured?: boolean;
}

interface UpdateCollectionData extends Partial<CreateCollectionData> {
  id: string;
}

// Create a new collection
export function useCreateCollection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateCollectionData) => {
      const { data: result, error } = await supabase
        .from('collections')
        .insert({
          title: data.title,
          description: data.description || null,
          cover_image_url: data.cover_image_url || null,
          event_date: data.event_date || null,
          branch_id: data.branch_id,
          is_featured: data.is_featured || false,
          photo_count: 0,
        })
        .select()
        .single();
      
      if (error) throw error;
      return result as Collection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

// Update an existing collection
export function useUpdateCollection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateCollectionData) => {
      const { data: result, error } = await supabase
        .from('collections')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result as Collection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

// Delete a collection
export function useDeleteCollection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

// Create a new branch
export function useCreateBranch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string; code: string; location?: string }) => {
      const { data: result, error } = await supabase
        .from('branches')
        .insert({
          name: data.name,
          code: data.code,
          location: data.location || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
  });
}

// Create a new tag
export function useCreateTag() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string; color: string }) => {
      const { data: result, error } = await supabase
        .from('tags')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}
