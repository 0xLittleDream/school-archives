
# Custom Page Builder for Teachers

## Overview

This plan implements a structured page builder that allows teachers to create beautiful, consistent event pages (Farewell, Annual Day, Assemblies) without any coding knowledge. The system uses predefined templates and section blocks to maintain design quality while giving teachers full content control.

---

## Architecture

```text
+----------------------------------+
|        Admin Dashboard           |
|    (Page Editor Tab)             |
+----------------------------------+
              |
              v
+----------------------------------+
|       Custom Pages Table         |
|  (new: custom_pages)             |
|  - page_type (template)          |
|  - slug (/farewell-2025)         |
|  - branch_id                     |
|  - is_published                  |
+----------------------------------+
              |
              v
+----------------------------------+
|       Page Sections Table        |
|  (new: page_sections)            |
|  - section_type (hero, info...)  |
|  - structured JSON content       |
|  - sort_order                    |
+----------------------------------+
              |
              v
+----------------------------------+
|    Dynamic Page Renderer         |
|  /page/:slug or dedicated routes |
+----------------------------------+
```

---

## Database Changes

### New Table: `custom_pages`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Page title (e.g., "Farewell 2025") |
| slug | TEXT | URL slug (e.g., "farewell-2025") |
| page_type | TEXT | Template type: 'farewell', 'event', 'assembly', 'generic' |
| branch_id | UUID | Associated branch (FK) |
| cover_image_url | TEXT | Hero background image |
| is_published | BOOLEAN | Whether page is live |
| meta_description | TEXT | SEO description |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update |

### New Table: `page_sections`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| page_id | UUID | Parent page (FK) |
| section_type | TEXT | 'hero', 'info_card', 'text_block', 'gallery', 'stats', 'quote', 'cta' |
| title | TEXT | Section heading |
| subtitle | TEXT | Section subheading |
| content | TEXT | Rich text content |
| image_url | TEXT | Section image |
| metadata | JSONB | Section-specific data (stats array, button text, etc.) |
| sort_order | INTEGER | Display order |
| created_at | TIMESTAMPTZ | Creation timestamp |

---

## Page Templates

### 1. Farewell Template
Pre-configured sections:
- Hero (with graduation cap badge, title, subtitle, date/location)
- Message/Quote block
- Photo Gallery (linked to collection)
- Stats row (years, memories, batch info)
- Call-to-action

### 2. Event/Annual Day Template
Pre-configured sections:
- Hero with event badge
- Event info cards (date, time, venue)
- Description blocks
- Photo Gallery
- Stats/highlights

### 3. Generic Template
Flexible blank slate with section picker

---

## Section Block Types

Each section is a structured component teachers fill in:

| Section Type | Editable Fields | Teacher Sees |
|-------------|-----------------|--------------|
| **Hero** | Title, Subtitle, Badge text, Background image, Date, Location | Simple form with image upload |
| **Info Card** | Icon selection, Title, Description | Card with icon picker dropdown |
| **Text Block** | Heading, Body text, Optional image, Layout (left/right) | WYSIWYG-lite textarea |
| **Gallery** | Link to collection OR upload images directly | Collection picker or upload |
| **Stats Row** | 4 stat items (value + label each) | 4 input pairs |
| **Quote** | Quote text, Attribution | Two text fields |
| **CTA Button** | Button text, Link URL | Two text fields |

---

## Implementation Steps

### Phase 1: Database & Types

1. **Create SQL migration** for `custom_pages` and `page_sections` tables with RLS policies
2. **Update TypeScript types** in `src/types/database.ts`:
   - Add `CustomPage` interface
   - Add `PageSection` interface  
   - Add `PageSectionType` union type

### Phase 2: Data Layer

3. **Create hooks** in `src/hooks/useDatabase.ts`:
   - `useCustomPages(branchId)` - Fetch all pages for branch
   - `useCustomPage(slug)` - Fetch single page with sections
   - `usePageSections(pageId)` - Fetch sections for a page

4. **Create mutations** in `src/hooks/useAdminMutations.ts`:
   - `useCreateCustomPage()`
   - `useUpdateCustomPage()`
   - `useDeleteCustomPage()`
   - `useCreatePageSection()`
   - `useUpdatePageSection()`
   - `useDeletePageSection()`
   - `useReorderPageSections()`

### Phase 3: Admin UI Components

5. **Create `src/components/admin/page-builder/` directory** with:
   - `PageBuilderEditor.tsx` - Main page editing interface
   - `SectionEditor.tsx` - Individual section edit forms
   - `SectionPicker.tsx` - Add new section modal
   - `SectionPreview.tsx` - Live preview of section
   - `TemplatePicker.tsx` - Choose page template on creation

6. **Section Editor Forms** (one per type):
   - `HeroSectionForm.tsx`
   - `TextBlockForm.tsx`
   - `GallerySectionForm.tsx`
   - `StatsSectionForm.tsx`
   - `QuoteSectionForm.tsx`
   - `CTASectionForm.tsx`

### Phase 4: Update PageEditor Component

7. **Refactor `src/components/admin/PageEditor.tsx`**:
   - Add "Create New Page" button with template picker
   - List existing custom pages with edit/delete/preview
   - Navigate to PageBuilderEditor for editing

### Phase 5: Public Rendering

8. **Create `src/pages/CustomPage.tsx`**:
   - Dynamic page renderer
   - Fetches page by slug
   - Renders sections using appropriate components

9. **Create `src/components/page-sections/` directory** with render components:
   - `HeroSection.tsx`
   - `TextBlockSection.tsx`
   - `GallerySection.tsx`
   - `StatsSection.tsx`
   - `QuoteSection.tsx`
   - `CTASection.tsx`

### Phase 6: Routing

10. **Update `src/App.tsx`**:
    - Add route: `/page/:slug` for custom pages
    - Keep existing `/farewell-2025` route but make it load from custom pages

---

## UI/UX Design for Teachers

### Page List View (Admin → Page Editor)
```text
+------------------------------------------+
|  Your Event Pages                         |
+------------------------------------------+
| [+ Create New Page]                       |
|                                           |
| ┌─────────────────────────────────────┐  |
| │ 🎓 Farewell 2025                    │  |
| │ NCS Vizag • Published               │  |
| │ [Edit] [Preview] [Unpublish]        │  |
| └─────────────────────────────────────┘  |
|                                           |
| ┌─────────────────────────────────────┐  |
| │ 🎭 Annual Day 2025                  │  |
| │ NCS Vizag • Draft                   │  |
| │ [Edit] [Preview] [Publish]          │  |
| └─────────────────────────────────────┘  |
+------------------------------------------+
```

### Page Builder View
```text
+------------------------------------------+
| ← Back    Farewell 2025    [Preview] [Save]|
+------------------------------------------+
| Page Settings                             |
| Title: [Farewell 2025        ]           |
| URL: /page/[farewell-2025    ]           |
| Branch: [NCS Vizag ▼]                    |
+------------------------------------------+
| Sections                    [+ Add Section]|
+------------------------------------------+
| ≡ 1. Hero Section           [Edit] [×]   |
|   "Farewell 2025 - Class of..."          |
+------------------------------------------+
| ≡ 2. Quote Section          [Edit] [×]   |
|   "As you step into a new chapter..."    |
+------------------------------------------+
| ≡ 3. Gallery Section        [Edit] [×]   |
|   12 photos from "Farewell Photos"       |
+------------------------------------------+
| ≡ 4. Stats Section          [Edit] [×]   |
|   12 Years • 100 Memories • 1 Batch      |
+------------------------------------------+
```

### Section Editor Modal (Example: Hero)
```text
+------------------------------------------+
|  Edit Hero Section                    [×] |
+------------------------------------------+
| Badge Text:                               |
| [Class of 2025            ]              |
|                                           |
| Main Title:                               |
| [Farewell                 ]              |
| [2025                     ]              |
|                                           |
| Subtitle:                                 |
| [Celebrating the journey of our...]      |
|                                           |
| Background Image:                         |
| [📷 Choose Image] or [🖼️ Upload]         |
|                                           |
| Event Date:     Event Location:           |
| [March 2025 ▼]  [NCS Campus      ]       |
|                                           |
|           [Cancel]  [Save Section]        |
+------------------------------------------+
```

---

## Files to Create/Modify

### New Files
| File Path | Purpose |
|-----------|---------|
| `src/types/pageBuilder.ts` | TypeScript types for custom pages |
| `src/components/admin/page-builder/PageBuilderEditor.tsx` | Main page builder UI |
| `src/components/admin/page-builder/SectionEditor.tsx` | Section edit modal |
| `src/components/admin/page-builder/SectionPicker.tsx` | Add section picker |
| `src/components/admin/page-builder/TemplatePicker.tsx` | Template selection |
| `src/components/admin/page-builder/sections/*.tsx` | Section-specific forms (6 files) |
| `src/components/page-sections/*.tsx` | Public render components (6 files) |
| `src/pages/CustomPage.tsx` | Dynamic page renderer |
| `src/hooks/usePageBuilder.ts` | Page builder specific hooks |

### Modified Files
| File Path | Changes |
|-----------|---------|
| `supabase/schema.sql` | Add custom_pages and page_sections tables |
| `src/types/database.ts` | Add new interfaces |
| `src/hooks/useDatabase.ts` | Add page fetching hooks |
| `src/hooks/useAdminMutations.ts` | Add page mutation hooks |
| `src/components/admin/PageEditor.tsx` | Complete rewrite for page management |
| `src/App.tsx` | Add /page/:slug route |
| `src/pages/Farewell2025.tsx` | Optionally convert to load from custom pages |

---

## SQL Migration Script

```sql
-- Custom Pages table
CREATE TABLE public.custom_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    page_type TEXT NOT NULL DEFAULT 'generic',
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE NOT NULL,
    cover_image_url TEXT,
    is_published BOOLEAN DEFAULT false,
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE (slug, branch_id)
);

-- Page Sections table
CREATE TABLE public.page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.custom_pages(id) ON DELETE CASCADE NOT NULL,
    section_type TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    content TEXT,
    image_url TEXT,
    metadata JSONB DEFAULT '{}',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.custom_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies (open for development)
CREATE POLICY "Anyone can view custom_pages" ON public.custom_pages FOR SELECT USING (true);
CREATE POLICY "Anyone can insert custom_pages" ON public.custom_pages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update custom_pages" ON public.custom_pages FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete custom_pages" ON public.custom_pages FOR DELETE USING (true);

CREATE POLICY "Anyone can view page_sections" ON public.page_sections FOR SELECT USING (true);
CREATE POLICY "Anyone can insert page_sections" ON public.page_sections FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update page_sections" ON public.page_sections FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete page_sections" ON public.page_sections FOR DELETE USING (true);

-- Indexes
CREATE INDEX idx_custom_pages_branch ON public.custom_pages(branch_id);
CREATE INDEX idx_custom_pages_slug ON public.custom_pages(slug);
CREATE INDEX idx_page_sections_page ON public.page_sections(page_id);
```

---

## Key Constraints Addressed

| Requirement | Solution |
|-------------|----------|
| Teachers cannot edit global layout/styles | Section types have fixed layouts; only content is editable |
| Structured, safe formatting | Each section has predefined fields - no raw HTML/markdown |
| Design matches Farewell page quality | Render components reuse exact styles from Farewell2025.tsx |
| Branch-based association | Pages are linked to branch_id; filtered in admin |
| No coding required | Simple forms with labels, image uploaders, dropdowns |
| Templates for common pages | Predefined section arrangements for Farewell/Event/Assembly |

---

## Estimated Complexity

- **Database**: 2 new tables, straightforward schema
- **Components**: ~15 new files, mostly form components
- **Logic**: Moderate - section ordering, template application
- **Testing**: Recommend testing page creation → preview → publish flow

This implementation gives teachers a powerful yet controlled page builder that maintains the premium aesthetic of NCS Memories while requiring zero technical knowledge.
