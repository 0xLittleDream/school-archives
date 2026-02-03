import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageUploader } from '@/components/admin/ImageUploader';
import type { PageSection, HeroMetadata } from '@/types/pageBuilder';

interface HeroSectionFormProps {
  section: PageSection;
  onChange: (updates: Partial<PageSection>) => void;
}

export function HeroSectionForm({ section, onChange }: HeroSectionFormProps) {
  const metadata = (section.metadata || {}) as HeroMetadata;

  const updateMetadata = (updates: Partial<HeroMetadata>) => {
    onChange({ 
      metadata: { ...metadata, ...updates } 
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Badge Text</Label>
        <Input
          value={metadata.badge_text || ''}
          onChange={(e) => updateMetadata({ badge_text: e.target.value })}
          placeholder="e.g., Class of 2025"
        />
        <p className="text-xs text-muted-foreground">Small text that appears above the title</p>
      </div>

      <div className="space-y-2">
        <Label>Main Title (Line 1)</Label>
        <Input
          value={section.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Farewell"
          className="text-lg font-semibold"
        />
      </div>

      <div className="space-y-2">
        <Label>Title (Line 2) - Optional</Label>
        <Input
          value={metadata.title_line2 || ''}
          onChange={(e) => updateMetadata({ title_line2: e.target.value })}
          placeholder="e.g., 2025"
          className="text-lg font-semibold"
        />
        <p className="text-xs text-muted-foreground">For two-line titles like "Farewell" + "2025"</p>
      </div>

      <div className="space-y-2">
        <Label>Subtitle / Description</Label>
        <Textarea
          value={section.subtitle || ''}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          placeholder="Celebrating the journey of our graduating class..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Event Date</Label>
          <Input
            value={metadata.event_date || ''}
            onChange={(e) => updateMetadata({ event_date: e.target.value })}
            placeholder="e.g., March 2025"
          />
        </div>
        <div className="space-y-2">
          <Label>Event Location</Label>
          <Input
            value={metadata.event_location || ''}
            onChange={(e) => updateMetadata({ event_location: e.target.value })}
            placeholder="e.g., NCS Campus"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Background Image</Label>
        <ImageUploader
          value={section.image_url || ''}
          onChange={(url) => onChange({ image_url: url || null })}
        />
      </div>
    </div>
  );
}
