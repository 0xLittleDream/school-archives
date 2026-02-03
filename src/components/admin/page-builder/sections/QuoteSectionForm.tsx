import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { PageSection, QuoteMetadata } from '@/types/pageBuilder';

interface QuoteSectionFormProps {
  section: PageSection;
  onChange: (updates: Partial<PageSection>) => void;
}

export function QuoteSectionForm({ section, onChange }: QuoteSectionFormProps) {
  const metadata = (section.metadata || {}) as QuoteMetadata;

  const updateMetadata = (updates: Partial<QuoteMetadata>) => {
    onChange({ 
      metadata: { ...metadata, ...updates } 
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Section Heading (Optional)</Label>
        <Input
          value={section.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., A Message for the Graduating Class"
        />
      </div>

      <div className="space-y-2">
        <Label>Quote Text</Label>
        <Textarea
          value={section.content || ''}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="As you step into a new chapter of your lives..."
          rows={5}
          className="italic"
        />
        <p className="text-xs text-muted-foreground">
          The quote will be displayed in italic style
        </p>
      </div>

      <div className="space-y-2">
        <Label>Attribution</Label>
        <Input
          value={metadata.attribution || ''}
          onChange={(e) => updateMetadata({ attribution: e.target.value })}
          placeholder="e.g., The NCS Memories Team"
        />
        <p className="text-xs text-muted-foreground">
          Who said this quote or where it's from
        </p>
      </div>
    </div>
  );
}
