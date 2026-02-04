// Student Tribute Types for Farewell Pages

export interface StudentTribute {
  id: string;
  page_id: string;
  student_name: string;
  full_name: string | null;
  photo_url: string | null;
  quote: string | null;
  future_dreams: string | null;
  class_section: string | null;
  traits: string[];
  route_slug: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface StudentTributeFormData {
  student_name: string;
  full_name?: string;
  photo_url?: string;
  quote?: string;
  future_dreams?: string;
  class_section?: string;
  traits?: string[];
  route_slug?: string;
}
