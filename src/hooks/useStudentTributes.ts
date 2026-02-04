import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { StudentTribute, StudentTributeFormData } from '@/types/studentTribute';

// Fetch all student tributes for a farewell page
export function useStudentTributes(pageId?: string) {
  return useQuery({
    queryKey: ['student_tributes', pageId],
    queryFn: async () => {
      if (!pageId) return [];
      
      const { data, error } = await supabase
        .from('student_tributes')
        .select('*')
        .eq('page_id', pageId)
        .order('sort_order');
      
      if (error) throw error;
      return data as StudentTribute[];
    },
    enabled: !!pageId,
  });
}

// Create a new student tribute
export function useCreateStudentTribute() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pageId, data }: { pageId: string; data: StudentTributeFormData }) => {
      // Get current max sort_order
      const { data: existing } = await supabase
        .from('student_tributes')
        .select('sort_order')
        .eq('page_id', pageId)
        .order('sort_order', { ascending: false })
        .limit(1);
      
      const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;
      
      const { data: result, error } = await supabase
        .from('student_tributes')
        .insert({
          page_id: pageId,
          student_name: data.student_name,
          photo_url: data.photo_url || null,
          quote: data.quote || null,
          future_dreams: data.future_dreams || null,
          class_section: data.class_section || null,
          sort_order: nextOrder,
        })
        .select()
        .single();
      
      if (error) throw error;
      return result as StudentTribute;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['student_tributes', variables.pageId] });
    },
  });
}

// Update a student tribute
export function useUpdateStudentTribute() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, pageId, data }: { id: string; pageId: string; data: Partial<StudentTributeFormData> }) => {
      const { data: result, error } = await supabase
        .from('student_tributes')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result as StudentTribute;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['student_tributes', variables.pageId] });
    },
  });
}

// Delete a student tribute
export function useDeleteStudentTribute() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, pageId }: { id: string; pageId: string }) => {
      const { error } = await supabase
        .from('student_tributes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { id, pageId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['student_tributes', variables.pageId] });
    },
  });
}

// Reorder student tributes
export function useReorderStudentTributes() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pageId, tributeIds }: { pageId: string; tributeIds: string[] }) => {
      const updates = tributeIds.map((id, index) =>
        supabase
          .from('student_tributes')
          .update({ sort_order: index })
          .eq('id', id)
      );
      
      await Promise.all(updates);
      return { pageId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['student_tributes', variables.pageId] });
    },
  });
}
