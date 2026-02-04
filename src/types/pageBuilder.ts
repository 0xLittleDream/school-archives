// Page Builder Types

export type PageType = 'farewell' | 'event' | 'assembly' | 'generic';

export type PageSectionType = 
  | 'hero' 
  | 'info_card' 
  | 'text_block' 
  | 'gallery' 
  | 'stats' 
  | 'quote' 
  | 'cta'
  | 'student_directory';

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
  quote_text?: string;
  attribution?: string;
}

export interface CTAMetadata {
  button_text?: string;
  button_url?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface StudentDirectoryMetadata {
  show_photos?: boolean;
  columns?: number;
}

export type SectionMetadata = 
  | HeroMetadata 
  | InfoCardMetadata 
  | TextBlockMetadata 
  | GalleryMetadata 
  | StatsMetadata 
  | QuoteMetadata 
  | CTAMetadata
  | StudentDirectoryMetadata
  | Record<string, unknown>;

// Template definitions
export interface PageTemplate {
  id: PageType;
  name: string;
  description: string;
  icon: string;
  defaultSections: Array<{
    section_type: PageSectionType;
    title?: string;
    subtitle?: string;
    content?: string;
    metadata?: SectionMetadata;
  }>;
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: 'farewell',
    name: 'Farewell / Graduation',
    description: 'Perfect for farewell ceremonies and graduation celebrations',
    icon: 'GraduationCap',
    defaultSections: [
      { 
        section_type: 'hero', 
        title: 'Farewell',
        subtitle: 'Celebrating the journey of our graduating class. Memories that will last a lifetime, friendships that will never fade.',
        metadata: { 
          badge_text: 'Class of 2025', 
          title_line2: '2025',
          event_date: 'March 2025',
          event_location: 'School Campus'
        } as HeroMetadata
      },
      { 
        section_type: 'quote', 
        title: 'A Message for the Graduating Class',
        metadata: { 
          quote_text: 'As you step into a new chapter of your lives, carry with you the memories, lessons, and bonds you\'ve formed here. You are not just leaving school; you are carrying a piece of it with you forever.',
          attribution: 'The NCS Memories Team' 
        } as QuoteMetadata
      },
      { 
        section_type: 'gallery', 
        title: 'Captured Moments',
        subtitle: 'Photos from our farewell celebration',
        metadata: {} as GalleryMetadata
      },
      { 
        section_type: 'stats', 
        title: 'Our Journey',
        metadata: { 
          stats: [
            { value: '12', label: 'Years of Journey' },
            { value: '∞', label: 'Memories Made' },
            { value: '1', label: 'Amazing Batch' },
            { value: '♥', label: 'Endless Love' },
          ]
        } as StatsMetadata
      },
      { 
        section_type: 'cta', 
        title: 'Continue the Journey',
        subtitle: 'Explore more memories from your school years',
        metadata: { button_text: 'View All Memories', button_url: '/memories' } as CTAMetadata
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
  {
    type: 'student_directory',
    name: 'Student Directory',
    description: 'Grid of graduating students with links to their pages',
    icon: 'GraduationCap',
  },
];
