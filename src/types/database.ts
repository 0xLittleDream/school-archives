export interface Branch {
  id: string;
  name: string;
  code: string;
  location: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Collection {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  event_date: string | null;
  branch_id: string | null;
  is_featured: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface CollectionWithTags extends Collection {
  tags: Tag[];
  branch?: Branch;
}

export interface Photo {
  id: string;
  image_url: string;
  caption: string | null;
  collection_id: string;
  sort_order: number;
  created_at: string;
}

// Content Block Types - for collection content
// Note: The actual database table has different columns (page_key, block_key)
// This interface is for the expected structure used in the UI
export type ContentBlockType = 'text' | 'image_text';

export interface ContentBlock {
  id: string;
  collection_id?: string;
  block_type?: ContentBlockType;
  title: string | null;
  content: string | null;
  image_url?: string | null;
  sort_order?: number;
  created_at: string;
  // Database fields
  page_key?: string;
  block_key?: string;
  metadata?: Record<string, unknown> | null;
  updated_at?: string;
}

// Event Types (for dynamic events)
export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  location: string | null;
  image_url: string | null;
  category: string | null;
  branch_id: string;
  collection_id: string | null; // Link to a collection for photos
  is_upcoming: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventWithBranch extends Event {
  branch?: Branch;
  collection?: Collection;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'super_admin';
  created_at: string;
}

export interface SiteContent {
  id: string;
  content_key: string;
  content_type: string | null;
  content_value: string | null;
  created_at: string;
  updated_at: string;
}

// Re-export page builder types for convenience
export type { 
  CustomPage, 
  CustomPageWithBranch, 
  PageSection, 
  PageType, 
  PageSectionType 
} from './pageBuilder';
