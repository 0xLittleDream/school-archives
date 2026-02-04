import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface EventSettings {
  event_date: string;
  event_time: string;
  event_venue: string;
  batch_year: string;
  airline_name: string;
  ceremony_title: string;
}

const DEFAULT_SETTINGS: EventSettings = {
  event_date: '07 FEBRUARY',
  event_time: '2:00 PM ONWARDS',
  event_venue: 'NCS(SVN), ASSEMBLY AREA',
  batch_year: '2025-26',
  airline_name: 'NCS Airlines',
  ceremony_title: 'INVITATION TO THE VALEDICTORY CEREMONY',
};

export function useEventSettings() {
  return useQuery({
    queryKey: ['event_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('content_key', 'event_settings')
        .maybeSingle();
      
      if (error) throw error;
      
      if (data?.content_value) {
        try {
          const parsed = JSON.parse(data.content_value);
          return { ...DEFAULT_SETTINGS, ...parsed } as EventSettings;
        } catch {
          return DEFAULT_SETTINGS;
        }
      }
      
      return DEFAULT_SETTINGS;
    },
  });
}

export function useUpdateEventSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: EventSettings) => {
      // Check if record exists
      const { data: existing } = await supabase
        .from('site_content')
        .select('id')
        .eq('content_key', 'event_settings')
        .maybeSingle();
      
      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('site_content')
          .update({
            content_value: JSON.stringify(settings),
            content_type: 'json',
            updated_at: new Date().toISOString(),
          })
          .eq('content_key', 'event_settings');
        
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('site_content')
          .insert({
            content_key: 'event_settings',
            content_type: 'json',
            content_value: JSON.stringify(settings),
          });
        
        if (error) throw error;
      }
      
      return settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event_settings'] });
    },
  });
}
