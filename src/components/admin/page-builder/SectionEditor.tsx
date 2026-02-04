import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { useUpdatePageSection } from '@/hooks/usePageBuilder';
import { useToast } from '@/hooks/use-toast';
import type { PageSection } from '@/types/pageBuilder';

import { HeroSectionForm } from './sections/HeroSectionForm';
import { TextBlockSectionForm } from './sections/TextBlockSectionForm';
import { GallerySectionForm } from './sections/GallerySectionForm';
import { StatsSectionForm } from './sections/StatsSectionForm';
import { QuoteSectionForm } from './sections/QuoteSectionForm';
import { CTASectionForm } from './sections/CTASectionForm';
import { StudentDirectorySectionForm } from './sections/StudentDirectorySectionForm';

interface SectionEditorProps {
  section: PageSection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

const SECTION_TITLES: Record<string, string> = {
  hero: 'Hero Section',
  text_block: 'Text Block',
  gallery: 'Photo Gallery',
  stats: 'Statistics Row',
  quote: 'Quote Block',
  cta: 'Call to Action',
  info_card: 'Info Cards',
  student_directory: 'Student Directory',
};

export function SectionEditor({ section, open, onOpenChange, onSaved }: SectionEditorProps) {
  const { toast } = useToast();
  const updateSection = useUpdatePageSection();
  const [editedSection, setEditedSection] = useState<PageSection | null>(null);

  useEffect(() => {
    if (section) {
      setEditedSection({ ...section });
    }
  }, [section]);

  const handleChange = (updates: Partial<PageSection>) => {
    if (editedSection) {
      setEditedSection({ ...editedSection, ...updates });
    }
  };

  const handleSave = async () => {
    if (!editedSection) return;

    try {
      await updateSection.mutateAsync({
        id: editedSection.id,
        title: editedSection.title,
        subtitle: editedSection.subtitle,
        content: editedSection.content,
        image_url: editedSection.image_url,
        metadata: editedSection.metadata,
      });
      
      toast({ title: '✓ Section saved!' });
      onSaved();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error saving section',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (!editedSection) return null;

  const renderForm = () => {
    switch (editedSection.section_type) {
      case 'hero':
        return <HeroSectionForm section={editedSection} onChange={handleChange} />;
      case 'text_block':
        return <TextBlockSectionForm section={editedSection} onChange={handleChange} />;
      case 'gallery':
        return <GallerySectionForm section={editedSection} onChange={handleChange} />;
      case 'stats':
        return <StatsSectionForm section={editedSection} onChange={handleChange} />;
      case 'quote':
        return <QuoteSectionForm section={editedSection} onChange={handleChange} />;
      case 'cta':
        return <CTASectionForm section={editedSection} onChange={handleChange} />;
      case 'student_directory':
        return <StudentDirectorySectionForm section={editedSection} onChange={handleChange} />;
      default:
        return <div className="text-muted-foreground">Unknown section type</div>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Edit {SECTION_TITLES[editedSection.section_type] || 'Section'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {renderForm()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updateSection.isPending} className="gap-2">
            {updateSection.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Section
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
