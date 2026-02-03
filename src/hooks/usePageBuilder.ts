import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { 
  CustomPage, 
  CustomPageWithBranch, 
  PageSection, 
  PageType,
  PageSectionType,
  SectionMetadata,
  PAGE_TEMPLATES 
} from '@/types/pageBuilder';

// ============ QUERIES ============

// Fetch all custom pages for a branch
export function useCustomPages(branchId?: string) {
  return useQuery({
    queryKey: ['custom_pages', branchId],
    queryFn: async () => {
      let query = supabase
        .from('custom_pages')
        .select(`
          *,
          branch:branches(id, name, code)
        `)
        .order('updated_at', { ascending: false });
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as CustomPageWithBranch[];
    },
  });
}

// Fetch a single custom page by slug with its sections
export function useCustomPage(slug: string, branchId?: string) {
  return useQuery({
    queryKey: ['custom_page', slug, branchId],
    queryFn: async () => {
      let query = supabase
        .from('custom_pages')
        .select(`
          *,
          branch:branches(id, name, code),
          sections:page_sections(*)
        `)
        .eq('slug', slug);
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      
      if (data) {
        // Sort sections by sort_order
        data.sections = (data.sections || []).sort((a: PageSection, b: PageSection) => 
          a.sort_order - b.sort_order
        );
      }
      
      return data as CustomPageWithBranch | null;
    },
    enabled: !!slug,
  });
}

// Fetch a custom page by ID
export function useCustomPageById(id: string) {
  return useQuery({
    queryKey: ['custom_page_by_id', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_pages')
        .select(`
          *,
          branch:branches(id, name, code),
          sections:page_sections(*)
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        data.sections = (data.sections || []).sort((a: PageSection, b: PageSection) => 
          a.sort_order - b.sort_order
        );
      }
      
      return data as CustomPageWithBranch | null;
    },
    enabled: !!id,
  });
}

// Fetch sections for a page
export function usePageSections(pageId: string) {
  return useQuery({
    queryKey: ['page_sections', pageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', pageId)
        .order('sort_order');
      
      if (error) throw error;
      return data as PageSection[];
    },
    enabled: !!pageId,
  });
}

// ============ MUTATIONS ============

interface CreatePageData {
  title: string;
  slug: string;
  page_type: PageType;
  branch_id: string;
  cover_image_url?: string;
  meta_description?: string;
}

interface UpdatePageData extends Partial<CreatePageData> {
  id: string;
  is_published?: boolean;
}

interface CreateSectionData {
  page_id: string;
  section_type: PageSectionType;
  title?: string;
  subtitle?: string;
  content?: string;
  image_url?: string;
  metadata?: SectionMetadata;
  sort_order?: number;
}

interface UpdateSectionData extends Partial<Omit<CreateSectionData, 'page_id'>> {
  id: string;
}

// Create a new custom page
export function useCreateCustomPage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreatePageData) => {
      // Build insert object dynamically to avoid schema cache issues with null fields
      const insertData: Record<string, unknown> = {
        title: data.title,
        slug: data.slug,
        page_type: data.page_type,
        branch_id: data.branch_id,
        is_published: false,
      };
      
      // Only include optional fields if they have values
      if (data.cover_image_url) {
        insertData.cover_image_url = data.cover_image_url;
      }
      if (data.meta_description) {
        insertData.meta_description = data.meta_description;
      }
      
      const { data: result, error } = await supabase
        .from('custom_pages')
        .insert(insertData)
        .select()
        .single();
      
      if (error) throw error;
      return result as CustomPage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom_pages'] });
    },
  });
}

// Update a custom page
export function useUpdateCustomPage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdatePageData) => {
      const { data: result, error } = await supabase
        .from('custom_pages')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result as CustomPage;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['custom_pages'] });
      queryClient.invalidateQueries({ queryKey: ['custom_page', data.slug] });
      queryClient.invalidateQueries({ queryKey: ['custom_page_by_id', data.id] });
    },
  });
}

// Delete a custom page
export function useDeleteCustomPage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('custom_pages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom_pages'] });
    },
  });
}

// Create a page section
export function useCreatePageSection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateSectionData) => {
      const { data: result, error } = await supabase
        .from('page_sections')
        .insert({
          page_id: data.page_id,
          section_type: data.section_type,
          title: data.title || null,
          subtitle: data.subtitle || null,
          content: data.content || null,
          image_url: data.image_url || null,
          metadata: data.metadata || {},
          sort_order: data.sort_order ?? 0,
        })
        .select()
        .single();
      
      if (error) throw error;
      return result as PageSection;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['page_sections', variables.page_id] });
      queryClient.invalidateQueries({ queryKey: ['custom_page_by_id'] });
    },
  });
}

// Update a page section
export function useUpdatePageSection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateSectionData) => {
      const { data: result, error } = await supabase
        .from('page_sections')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result as PageSection;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['page_sections', data.page_id] });
      queryClient.invalidateQueries({ queryKey: ['custom_page_by_id'] });
    },
  });
}

// Delete a page section
export function useDeletePageSection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, pageId }: { id: string; pageId: string }) => {
      const { error } = await supabase
        .from('page_sections')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { id, pageId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['page_sections', data.pageId] });
      queryClient.invalidateQueries({ queryKey: ['custom_page_by_id'] });
    },
  });
}

// Reorder sections
export function useReorderPageSections() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pageId, sectionIds }: { pageId: string; sectionIds: string[] }) => {
      // Update each section's sort_order
      const updates = sectionIds.map((id, index) => 
        supabase
          .from('page_sections')
          .update({ sort_order: index })
          .eq('id', id)
      );
      
      await Promise.all(updates);
      return { pageId, sectionIds };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['page_sections', data.pageId] });
      queryClient.invalidateQueries({ queryKey: ['custom_page_by_id'] });
    },
  });
}

// Create page with template sections
export function useCreatePageWithTemplate() {
  const createPage = useCreateCustomPage();
  const createSection = useCreatePageSection();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      pageData, 
      template 
    }: { 
      pageData: CreatePageData; 
      template: typeof PAGE_TEMPLATES[number];
    }) => {
      // Create the page first
      const page = await createPage.mutateAsync(pageData);
      
      // Create default sections from template
      for (let i = 0; i < template.defaultSections.length; i++) {
        const section = template.defaultSections[i];
        
        // For quote sections, extract quote_text from metadata and put in content
        let content = section.content;
        if (section.section_type === 'quote' && section.metadata) {
          const quoteMetadata = section.metadata as { quote_text?: string };
          if (quoteMetadata.quote_text) {
            content = quoteMetadata.quote_text;
          }
        }
        
        await createSection.mutateAsync({
          page_id: page.id,
          section_type: section.section_type,
          title: section.title,
          subtitle: section.subtitle,
          content: content,
          metadata: section.metadata,
          sort_order: i,
        });
      }
      
      return page;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom_pages'] });
    },
  });
}
