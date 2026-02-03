import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUploader } from '@/components/admin/ImageUploader';
import type { PageSection, TextBlockMetadata } from '@/types/pageBuilder';

interface TextBlockSectionFormProps {
  section: PageSection;
  onChange: (updates: Partial<PageSection>) => void;
}

export function TextBlockSectionForm({ section, onChange }: TextBlockSectionFormProps) {
  const metadata = (section.metadata || {}) as TextBlockMetadata;

  const updateMetadata = (updates: Partial<TextBlockMetadata>) => {
    onChange({ 
      metadata: { ...metadata, ...updates } 
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Section Heading</Label>
        <Input
          value={section.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., About the Event"
        />
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <Textarea
          value={section.content || ''}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="Write your content here..."
          rows={6}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          You can use line breaks to create paragraphs
        </p>
      </div>

      <div className="space-y-2">
        <Label>Layout</Label>
        <Select 
          value={metadata.layout || 'center'} 
          onValueChange={(value) => updateMetadata({ layout: value as TextBlockMetadata['layout'] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select layout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="center">Text Only (Centered)</SelectItem>
            <SelectItem value="left">Image Left, Text Right</SelectItem>
            <SelectItem value="right">Text Left, Image Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(metadata.layout === 'left' || metadata.layout === 'right') && (
        <div className="space-y-2">
          <Label>Image</Label>
          <ImageUploader
            value={section.image_url || ''}
            onChange={(url) => onChange({ image_url: url || null })}
          />
        </div>
      )}
    </div>
  );
}
