// Page Builder Types

export type PageType = 'farewell' | 'event' | 'assembly' | 'generic';

export type PageSectionType = 
  | 'hero' 
  | 'info_card' 
  | 'text_block' 
  | 'gallery' 
  | 'stats' 
  | 'quote' 
  | 'cta';

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  page_type: PageType;
  branch_id: string;
  cover_image_url: string | null;
  is_published: boolean;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomPageWithBranch extends CustomPage {
  branch?: {
    id: string;
    name: string;
    code: string;
  };
  sections?: PageSection[];
}

export interface PageSection {
  id: string;
  page_id: string;
  section_type: PageSectionType;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  metadata: SectionMetadata;
  sort_order: number;
  created_at: string;
}

// Section-specific metadata types
export interface HeroMetadata {
  badge_text?: string;
  event_date?: string;
  event_location?: string;
  title_line2?: string;
}

export interface InfoCardMetadata {
  icon?: string;
  cards?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface TextBlockMetadata {
  layout?: 'left' | 'right' | 'center';
}

export interface GalleryMetadata {
  collection_id?: string;
  images?: string[];
}

export interface StatsMetadata {
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

export interface QuoteMetadata {
  attribution?: string;
}

export interface CTAMetadata {
  button_text?: string;
  button_url?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export type SectionMetadata = 
  | HeroMetadata 
  | InfoCardMetadata 
  | TextBlockMetadata 
  | GalleryMetadata 
  | StatsMetadata 
  | QuoteMetadata 
  | CTAMetadata
  | Record<string, unknown>;

// Template definitions
export interface PageTemplate {
  id: PageType;
  name: string;
  description: string;
  icon: string;
  defaultSections: Array<{
    section_type: PageSectionType;
    title: string;
    metadata: SectionMetadata;
  }>;
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: 'farewell',
    name: 'Farewell',
    description: 'Perfect for graduation and farewell celebrations',
    icon: 'GraduationCap',
    defaultSections: [
      { 
        section_type: 'hero', 
        title: 'Farewell 2025',
        metadata: { badge_text: 'Class of 2025' } as HeroMetadata
      },
      { 
        section_type: 'quote', 
        title: 'A Message',
        metadata: { attribution: 'The NCS Memories Team' } as QuoteMetadata
      },
      { 
        section_type: 'gallery', 
        title: 'Captured Moments',
        metadata: {} as GalleryMetadata
      },
      { 
        section_type: 'stats', 
        title: 'By the Numbers',
        metadata: { 
          stats: [
            { value: '12', label: 'Years of Journey' },
            { value: '∞', label: 'Memories Made' },
            { value: '1', label: 'Amazing Batch' },
            { value: '♥', label: 'Endless Love' },
          ]
        } as StatsMetadata
      },
    ],
  },
  {
    id: 'event',
    name: 'Event / Annual Day',
    description: 'For annual days, cultural events, and celebrations',
    icon: 'Calendar',
    defaultSections: [
      { 
        section_type: 'hero', 
        title: 'Annual Day 2025',
        metadata: { badge_text: 'Special Event' } as HeroMetadata
      },
      { 
        section_type: 'text_block', 
        title: 'About the Event',
        metadata: { layout: 'center' } as TextBlockMetadata
      },
      { 
        section_type: 'gallery', 
        title: 'Event Highlights',
        metadata: {} as GalleryMetadata
      },
      { 
        section_type: 'cta', 
        title: '',
        metadata: { button_text: 'View All Photos', button_url: '/memories' } as CTAMetadata
      },
    ],
  },
  {
    id: 'assembly',
    name: 'Special Assembly',
    description: 'For morning assemblies, award ceremonies, and special programs',
    icon: 'Award',
    defaultSections: [
      { 
        section_type: 'hero', 
        title: 'Special Assembly',
        metadata: { badge_text: 'School Event' } as HeroMetadata
      },
      { 
        section_type: 'text_block', 
        title: 'Program Highlights',
        metadata: { layout: 'left' } as TextBlockMetadata
      },
      { 
        section_type: 'gallery', 
        title: 'Gallery',
        metadata: {} as GalleryMetadata
      },
    ],
  },
  {
    id: 'generic',
    name: 'Blank Page',
    description: 'Start from scratch with a flexible layout',
    icon: 'FileText',
    defaultSections: [],
  },
];

// Section type definitions for the picker
export interface SectionTypeDefinition {
  type: PageSectionType;
  name: string;
  description: string;
  icon: string;
}

export const SECTION_TYPES: SectionTypeDefinition[] = [
  {
    type: 'hero',
    name: 'Hero Section',
    description: 'Large banner with title, subtitle, and optional background image',
    icon: 'Image',
  },
  {
    type: 'text_block',
    name: 'Text Block',
    description: 'Heading with paragraph text, optional image on left or right',
    icon: 'FileText',
  },
  {
    type: 'gallery',
    name: 'Photo Gallery',
    description: 'Display photos from a collection or upload directly',
    icon: 'Images',
  },
  {
    type: 'stats',
    name: 'Stats Row',
    description: 'Display 4 statistics with values and labels',
    icon: 'BarChart3',
  },
  {
    type: 'quote',
    name: 'Quote Block',
    description: 'Featured quote with attribution',
    icon: 'Quote',
  },
  {
    type: 'cta',
    name: 'Call to Action',
    description: 'Button that links to another page',
    icon: 'MousePointerClick',
  },
];
