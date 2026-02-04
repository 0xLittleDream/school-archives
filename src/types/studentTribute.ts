// Student Tribute Types for Farewell/Event Pages

export type StudentTheme = 'playful' | 'navy' | 'army' | 'classic';

export interface StudentAchievement {
  id: string;
  student_id: string;
  title: string;
  description: string | null;
  icon: string;
  year: string | null;
  sort_order: number;
  created_at: string;
}

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
  theme: StudentTheme;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Joined data
  achievements?: StudentAchievement[];
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
  theme?: StudentTheme;
}

export interface StudentAchievementFormData {
  title: string;
  description?: string;
  icon?: string;
  year?: string;
}

export const THEME_OPTIONS: { value: StudentTheme; label: string; description: string; colors: string }[] = [
  { 
    value: 'playful', 
    label: '🎉 Playful', 
    description: 'Bright colors, confetti, fun animations',
    colors: 'from-pink-500 via-purple-500 to-indigo-500'
  },
  { 
    value: 'navy', 
    label: '⚓ Navy', 
    description: 'NCS Airways flight theme with sky backgrounds',
    colors: 'from-blue-600 via-blue-700 to-blue-800'
  },
  { 
    value: 'army', 
    label: '🎖️ Army', 
    description: 'Camouflage accents, medal-style badges',
    colors: 'from-green-700 via-green-800 to-green-900'
  },
  { 
    value: 'classic', 
    label: '🎓 Classic', 
    description: 'Formal graduation style with gold accents',
    colors: 'from-amber-600 via-yellow-600 to-amber-700'
  },
];

export const ACHIEVEMENT_ICONS = [
  { value: 'trophy', label: '🏆 Trophy' },
  { value: 'medal', label: '🏅 Medal' },
  { value: 'star', label: '⭐ Star' },
  { value: 'award', label: '🏆 Award' },
  { value: 'certificate', label: '📜 Certificate' },
  { value: 'book', label: '📚 Academic' },
  { value: 'sports', label: '⚽ Sports' },
  { value: 'music', label: '🎵 Music' },
  { value: 'art', label: '🎨 Art' },
  { value: 'science', label: '🔬 Science' },
];
