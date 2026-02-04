import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { StudentAchievement, StudentAchievementFormData } from '@/types/studentTribute';

// Fetch achievements for a student
export function useStudentAchievements(studentId?: string) {
  return useQuery({
    queryKey: ['student_achievements', studentId],
    queryFn: async () => {
      if (!studentId) return [];
      
      const { data, error } = await supabase
        .from('student_achievements')
        .select('*')
        .eq('student_id', studentId)
        .order('sort_order');
      
      if (error) throw error;
      return data as StudentAchievement[];
    },
    enabled: !!studentId,
  });
}

// Create a new achievement
export function useCreateAchievement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ studentId, data }: { studentId: string; data: StudentAchievementFormData }) => {
      // Get current max sort_order
      const { data: existing } = await supabase
        .from('student_achievements')
        .select('sort_order')
        .eq('student_id', studentId)
        .order('sort_order', { ascending: false })
        .limit(1);
      
      const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;
      
      const { data: result, error } = await supabase
        .from('student_achievements')
        .insert({
          student_id: studentId,
          title: data.title,
          description: data.description || null,
          icon: data.icon || 'trophy',
          year: data.year || null,
          sort_order: nextOrder,
        })
        .select()
        .single();
      
      if (error) throw error;
      return result as StudentAchievement;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['student_achievements', variables.studentId] });
    },
  });
}

// Update an achievement
export function useUpdateAchievement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, studentId, data }: { id: string; studentId: string; data: Partial<StudentAchievementFormData> }) => {
      const { data: result, error } = await supabase
        .from('student_achievements')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result as StudentAchievement;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['student_achievements', variables.studentId] });
    },
  });
}

// Delete an achievement
export function useDeleteAchievement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, studentId }: { id: string; studentId: string }) => {
      const { error } = await supabase
        .from('student_achievements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { id, studentId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['student_achievements', variables.studentId] });
    },
  });
}
