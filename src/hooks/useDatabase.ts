import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Branch, Tag, Collection, CollectionWithTags, Photo, SiteContent } from '@/types/database';

// Fetch all branches
export function useBranches() {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Branch[];
    },
  });
}

// Fetch all tags
export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Tag[];
    },
  });
}

// Fetch collections with optional branch filter
export function useCollections(branchId?: string, tagId?: string) {
  return useQuery({
    queryKey: ['collections', branchId, tagId],
    queryFn: async () => {
      let query = supabase
        .from('collections')
        .select(`
          *,
          branch:branches(*),
          collection_tags(
            tag:tags(*)
          )
        `)
        .order('event_date', { ascending: false });
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform to include tags array
      const collections: CollectionWithTags[] = (data || []).map((item: any) => ({
        ...item,
        branch: item.branch,
        tags: item.collection_tags?.map((ct: any) => ct.tag).filter(Boolean) || [],
      }));
      
      // Filter by tag if specified
      if (tagId) {
        return collections.filter(c => c.tags.some(t => t.id === tagId));
      }
      
      return collections;
    },
  });
}

// Fetch featured collections
export function useFeaturedCollections(branchId?: string) {
  return useQuery({
    queryKey: ['collections', 'featured', branchId],
    queryFn: async () => {
      let query = supabase
        .from('collections')
        .select(`
          *,
          branch:branches(*),
          collection_tags(
            tag:tags(*)
          )
        `)
        .eq('is_featured', true)
        .order('event_date', { ascending: false })
        .limit(6);
      
      if (branchId) {
        query = query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return (data || []).map((item: any) => ({
        ...item,
        branch: item.branch,
        tags: item.collection_tags?.map((ct: any) => ct.tag).filter(Boolean) || [],
      })) as CollectionWithTags[];
    },
  });
}

// Fetch single collection with photos
export function useCollection(id: string) {
  return useQuery({
    queryKey: ['collection', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          branch:branches(*),
          collection_tags(
            tag:tags(*)
          )
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      return {
        ...data,
        branch: data.branch,
        tags: data.collection_tags?.map((ct: any) => ct.tag).filter(Boolean) || [],
      } as CollectionWithTags;
    },
    enabled: !!id,
  });
}

// Fetch photos for a collection
export function usePhotos(collectionId: string) {
  return useQuery({
    queryKey: ['photos', collectionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('collection_id', collectionId)
        .order('sort_order');
      
      if (error) throw error;
      return data as Photo[];
    },
    enabled: !!collectionId,
  });
}

// Fetch site content
export function useSiteContent(pageName: string, sectionKey: string) {
  return useQuery({
    queryKey: ['site_content', pageName, sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('page_name', pageName)
        .eq('section_key', sectionKey)
        .maybeSingle();
      
      if (error) throw error;
      return data as SiteContent | null;
    },
  });
}

// Fetch stats
export function useStats(branchId?: string) {
  return useQuery({
    queryKey: ['stats', branchId],
    queryFn: async () => {
      // Get collection count
      let collectionsQuery = supabase.from('collections').select('id', { count: 'exact', head: true });
      if (branchId) collectionsQuery = collectionsQuery.eq('branch_id', branchId);
      const { count: collectionsCount } = await collectionsQuery;
      
      // Get photo count (sum of photo_count from collections)
      let photosQuery = supabase.from('collections').select('photo_count');
      if (branchId) photosQuery = photosQuery.eq('branch_id', branchId);
      const { data: photosData } = await photosQuery;
      const photosCount = photosData?.reduce((sum, c) => sum + (c.photo_count || 0), 0) || 0;
      
      // Get branches count
      const { count: branchesCount } = await supabase.from('branches').select('id', { count: 'exact', head: true });
      
      // Get tags count (as events proxy)
      const { count: tagsCount } = await supabase.from('tags').select('id', { count: 'exact', head: true });
      
      return {
        photos: photosCount,
        collections: collectionsCount || 0,
        events: tagsCount || 0,
        branches: branchesCount || 0,
      };
    },
  });
}
