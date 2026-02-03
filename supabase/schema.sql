-- NcsMemories Database Schema
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- ===========================================
-- 1. CUSTOM TYPES
-- ===========================================

-- Role enum for admin management
CREATE TYPE public.app_role AS ENUM ('admin', 'super_admin');

-- ===========================================
-- 2. TABLES
-- ===========================================

-- Branches table (school branches)
CREATE TABLE public.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    location TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Tags table (for categorizing collections)
CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#3b82f6',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Collections table (memory collections)
CREATE TABLE public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    event_date DATE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE NOT NULL,
    photo_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Photos table (individual photos in collections)
CREATE TABLE public.photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    caption TEXT,
    collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Collection-Tags junction table (many-to-many)
CREATE TABLE public.collection_tags (
    collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (collection_id, tag_id)
);

-- User Roles table (admin management)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Site Content table (editable page content)
CREATE TABLE public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_name TEXT NOT NULL,
    section_key TEXT NOT NULL,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE (page_name, section_key)
);

-- ===========================================
-- 3. ROW LEVEL SECURITY
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin role (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Check if user is any admin type
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role IN ('admin', 'super_admin')
    )
$$;

-- ===========================================
-- 4. RLS POLICIES
-- ===========================================

-- BRANCHES: Public read, admin write
CREATE POLICY "Anyone can view branches" ON public.branches FOR SELECT USING (true);
CREATE POLICY "Admins can insert branches" ON public.branches FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update branches" ON public.branches FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete branches" ON public.branches FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- TAGS: Public read, admin write
CREATE POLICY "Anyone can view tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Admins can insert tags" ON public.tags FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update tags" ON public.tags FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete tags" ON public.tags FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- COLLECTIONS: Public read, admin write
CREATE POLICY "Anyone can view collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Admins can insert collections" ON public.collections FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update collections" ON public.collections FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete collections" ON public.collections FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- PHOTOS: Public read, admin write
CREATE POLICY "Anyone can view photos" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Admins can insert photos" ON public.photos FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update photos" ON public.photos FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete photos" ON public.photos FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- COLLECTION_TAGS: Public read, admin write
CREATE POLICY "Anyone can view collection_tags" ON public.collection_tags FOR SELECT USING (true);
CREATE POLICY "Admins can insert collection_tags" ON public.collection_tags FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete collection_tags" ON public.collection_tags FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- USER_ROLES: Only super_admin can manage, admins can view
CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Super admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

-- SITE_CONTENT: Public read, admin write
CREATE POLICY "Anyone can view site_content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins can insert site_content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update site_content" ON public.site_content FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));

-- ===========================================
-- 5. INDEXES FOR PERFORMANCE
-- ===========================================

CREATE INDEX idx_collections_branch ON public.collections(branch_id);
CREATE INDEX idx_collections_featured ON public.collections(is_featured) WHERE is_featured = true;
CREATE INDEX idx_photos_collection ON public.photos(collection_id);
CREATE INDEX idx_collection_tags_collection ON public.collection_tags(collection_id);
CREATE INDEX idx_collection_tags_tag ON public.collection_tags(tag_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);

-- ===========================================
-- 6. TRIGGERS FOR UPDATED_AT
-- ===========================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON public.branches
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON public.collections
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===========================================
-- 7. SAMPLE DATA (Optional - run separately if needed)
-- ===========================================

-- Insert sample branches
INSERT INTO public.branches (name, code, location) VALUES
    ('NCS Vizag', '104', 'Visakhapatnam, Andhra Pradesh'),
    ('NCS Hyderabad', '201', 'Hyderabad, Telangana'),
    ('NCS Bangalore', '302', 'Bangalore, Karnataka');

-- Insert sample tags
INSERT INTO public.tags (name, color) VALUES
    ('Farewell', '#ef4444'),
    ('Annual Day', '#f59e0b'),
    ('Cultural Events', '#8b5cf6'),
    ('Sports', '#22c55e'),
    ('Achievements', '#3b82f6');

-- Insert sample site content
INSERT INTO public.site_content (page_name, section_key, content) VALUES
    ('home', 'hero_title', 'NCS Memories'),
    ('home', 'hero_subtitle', 'Preserving moments. Celebrating journeys.'),
    ('about', 'main_content', 'NcsMemories is a digital archive dedicated to preserving the cherished moments of our school community.');
