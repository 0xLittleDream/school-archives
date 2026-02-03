export interface Branch {
  id: string;
  name: string;
  code: string;
  location: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
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
  branch_id: string;
  photo_count: number;
  is_featured: boolean;
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

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'super_admin';
  created_at: string;
}

export interface SiteContent {
  id: string;
  page_name: string;
  section_key: string;
  content: string | null;
  created_at: string;
  updated_at: string;
}
