-- =============================================
-- NCS Memories Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- BRANCHES TABLE
-- =============================================
CREATE TABLE public.branches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Branches are viewable by everyone"
  ON public.branches FOR SELECT
  USING (true);

CREATE POLICY "Branches can be managed by authenticated users"
  ON public.branches FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- USER ROLES TABLE
-- =============================================
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  branch_id UUID REFERENCES public.branches(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- TAGS TABLE
-- =============================================
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tags are viewable by everyone"
  ON public.tags FOR SELECT
  USING (true);

CREATE POLICY "Tags can be managed by authenticated users"
  ON public.tags FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- COLLECTIONS TABLE
-- =============================================
CREATE TABLE public.collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  event_date DATE,
  branch_id UUID REFERENCES public.branches(id),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Collections are viewable by everyone"
  ON public.collections FOR SELECT
  USING (true);

CREATE POLICY "Collections can be managed by authenticated users"
  ON public.collections FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- COLLECTION TAGS (Junction Table)
-- =============================================
CREATE TABLE public.collection_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  UNIQUE(collection_id, tag_id)
);

ALTER TABLE public.collection_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Collection tags are viewable by everyone"
  ON public.collection_tags FOR SELECT
  USING (true);

CREATE POLICY "Collection tags can be managed by authenticated users"
  ON public.collection_tags FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- PHOTOS TABLE
-- =============================================
CREATE TABLE public.photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Photos are viewable by everyone"
  ON public.photos FOR SELECT
  USING (true);

CREATE POLICY "Photos can be managed by authenticated users"
  ON public.photos FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- CONTENT BLOCKS TABLE
-- =============================================
CREATE TABLE public.content_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL,
  block_key TEXT NOT NULL,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(page_key, block_key)
);

ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Content blocks are viewable by everyone"
  ON public.content_blocks FOR SELECT
  USING (true);

CREATE POLICY "Content blocks can be managed by authenticated users"
  ON public.content_blocks FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- SITE CONTENT TABLE
-- =============================================
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_key TEXT NOT NULL UNIQUE,
  content_value TEXT,
  content_type TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site content is viewable by everyone"
  ON public.site_content FOR SELECT
  USING (true);

CREATE POLICY "Site content can be managed by authenticated users"
  ON public.site_content FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- CUSTOM PAGES TABLE
-- =============================================
CREATE TABLE public.custom_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  page_type TEXT NOT NULL DEFAULT 'generic',
  branch_id UUID REFERENCES public.branches(id),
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Custom pages are viewable by everyone"
  ON public.custom_pages FOR SELECT
  USING (true);

CREATE POLICY "Custom pages can be managed by authenticated users"
  ON public.custom_pages FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- PAGE SECTIONS TABLE
-- =============================================
CREATE TABLE public.page_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES public.custom_pages(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  image_url TEXT,
  metadata JSONB DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Page sections are viewable by everyone"
  ON public.page_sections FOR SELECT
  USING (true);

CREATE POLICY "Page sections can be managed by authenticated users"
  ON public.page_sections FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- STUDENT TRIBUTES TABLE
-- =============================================
CREATE TABLE public.student_tributes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES public.custom_pages(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  full_name TEXT,
  photo_url TEXT,
  quote TEXT,
  future_dreams TEXT,
  class_section TEXT,
  traits TEXT[] DEFAULT '{}',
  route_slug TEXT UNIQUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.student_tributes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Student tributes are viewable by everyone"
  ON public.student_tributes FOR SELECT
  USING (true);

CREATE POLICY "Student tributes can be managed by authenticated users"
  ON public.student_tributes FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- PHOTO REACTIONS TABLE
-- =============================================
CREATE TABLE public.photo_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_id UUID NOT NULL REFERENCES public.photos(id) ON DELETE CASCADE,
  user_id UUID,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(photo_id, user_id, reaction_type)
);

ALTER TABLE public.photo_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Photo reactions are viewable by everyone"
  ON public.photo_reactions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can add reactions"
  ON public.photo_reactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can manage their own reactions"
  ON public.photo_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- PHOTO COMMENTS TABLE
-- =============================================
CREATE TABLE public.photo_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_id UUID NOT NULL REFERENCES public.photos(id) ON DELETE CASCADE,
  user_id UUID,
  author_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.photo_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Photo comments are viewable by everyone"
  ON public.photo_comments FOR SELECT
  USING (true);

CREATE POLICY "Anyone can add comments"
  ON public.photo_comments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can manage their own comments"
  ON public.photo_comments FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- STORAGE BUCKET FOR UPLOADS
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true);

CREATE POLICY "Anyone can view uploads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'uploads');

CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update uploads"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete uploads"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'uploads' AND auth.role() = 'authenticated');

-- =============================================
-- INSERT DEFAULT BRANCH
-- =============================================
INSERT INTO public.branches (name, code, location)
VALUES ('Navy Children School', 'NCS-VIZ', 'Visakhapatnam');

-- =============================================
-- INSERT FAREWELL 2025-26 PAGE
-- =============================================
INSERT INTO public.custom_pages (title, slug, page_type, is_published, meta_description)
VALUES (
  'Farewell 2025-26',
  'farewell-2025',
  'farewell',
  true,
  'Celebrating the graduating class of 2025-26 from Navy Children School'
);