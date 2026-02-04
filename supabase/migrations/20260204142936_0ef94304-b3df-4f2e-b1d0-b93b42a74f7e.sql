-- Add theme field to student_tributes for per-student theming
ALTER TABLE public.student_tributes 
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'playful';

-- Create student_achievements table for achievements/awards
CREATE TABLE public.student_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.student_tributes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'trophy',
  year TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;

-- RLS policies for student_achievements
CREATE POLICY "Student achievements are viewable by everyone"
  ON public.student_achievements FOR SELECT
  USING (true);

CREATE POLICY "Student achievements can be managed by authenticated users"
  ON public.student_achievements FOR ALL
  USING (auth.role() = 'authenticated');

-- Create student_event_assignments for linking students to multiple events
CREATE TABLE public.student_event_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.student_tributes(id) ON DELETE CASCADE,
  page_id UUID NOT NULL REFERENCES public.custom_pages(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, page_id)
);

-- Enable RLS
ALTER TABLE public.student_event_assignments ENABLE ROW LEVEL SECURITY;

-- RLS policies for student_event_assignments
CREATE POLICY "Student event assignments are viewable by everyone"
  ON public.student_event_assignments FOR SELECT
  USING (true);

CREATE POLICY "Student event assignments can be managed by authenticated users"
  ON public.student_event_assignments FOR ALL
  USING (auth.role() = 'authenticated');

-- Add index for efficient lookups
CREATE INDEX idx_student_achievements_student ON public.student_achievements(student_id);
CREATE INDEX idx_student_event_assignments_page ON public.student_event_assignments(page_id);
CREATE INDEX idx_student_event_assignments_student ON public.student_event_assignments(student_id);