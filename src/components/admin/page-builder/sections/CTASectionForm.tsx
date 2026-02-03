import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PageSection, CTAMetadata } from '@/types/pageBuilder';

interface CTASectionFormProps {
  section: PageSection;
  onChange: (updates: Partial<PageSection>) => void;
}

export function CTASectionForm({ section, onChange }: CTASectionFormProps) {
  const metadata = (section.metadata || {}) as CTAMetadata;

  const updateMetadata = (updates: Partial<CTAMetadata>) => {
    onChange({ 
      metadata: { ...metadata, ...updates } 
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Section Title (Optional)</Label>
        <Input
          value={section.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Want to see more?"
        />
      </div>

      <div className="space-y-2">
        <Label>Description Text (Optional)</Label>
        <Input
          value={section.content || ''}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="e.g., Explore our complete photo archive"
        />
      </div>

      <div className="space-y-2">
        <Label>Button Text</Label>
        <Input
          value={metadata.button_text || ''}
          onChange={(e) => updateMetadata({ button_text: e.target.value })}
          placeholder="e.g., View All Photos"
        />
      </div>

      <div className="space-y-2">
        <Label>Button Link</Label>
        <Input
          value={metadata.button_url || ''}
          onChange={(e) => updateMetadata({ button_url: e.target.value })}
          placeholder="e.g., /memories"
        />
        <p className="text-xs text-muted-foreground">
          Use a relative path like /memories or a full URL
        </p>
      </div>

      <div className="space-y-2">
        <Label>Button Style</Label>
        <Select 
          value={metadata.variant || 'primary'} 
          onValueChange={(value) => updateMetadata({ variant: value as CTAMetadata['variant'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primary (Filled)</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Preview */}
      <div className="bg-secondary/50 rounded-xl p-6 border border-border text-center">
        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Preview</p>
        <button 
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            metadata.variant === 'outline' 
              ? 'border-2 border-primary text-primary hover:bg-primary/10'
              : metadata.variant === 'secondary'
              ? 'bg-secondary text-foreground hover:bg-secondary/80'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {metadata.button_text || 'Button Text'}
        </button>
      </div>
    </div>
  );
}
