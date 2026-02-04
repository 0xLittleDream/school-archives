// Student Tribute Types for Farewell Pages

export interface StudentTribute {
  id: string;
  page_id: string;
  student_name: string;
  photo_url: string | null;
  quote: string | null;
  future_dreams: string | null;
  class_section: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface StudentTributeFormData {
  student_name: string;
  photo_url?: string;
  quote?: string;
  future_dreams?: string;
  class_section?: string;
}
