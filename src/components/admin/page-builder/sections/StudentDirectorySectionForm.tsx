import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PageSection, StudentDirectoryMetadata } from '@/types/pageBuilder';

interface StudentDirectorySectionFormProps {
  section: PageSection;
  onChange: (updates: Partial<PageSection>) => void;
}

export function StudentDirectorySectionForm({ section, onChange }: StudentDirectorySectionFormProps) {
  const metadata = (section.metadata || {}) as StudentDirectoryMetadata;

  const updateMetadata = (updates: Partial<StudentDirectoryMetadata>) => {
    onChange({
      metadata: { ...metadata, ...updates },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Section Title</Label>
        <Input
          value={section.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Our Graduating Stars"
        />
      </div>

      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Input
          value={section.subtitle || ''}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          placeholder="Click on any name to view their personalized farewell tribute page"
        />
      </div>

      <div className="space-y-2">
        <Label>Number of Columns</Label>
        <Select
          value={String(metadata.columns || 4)}
          onValueChange={(value) => updateMetadata({ columns: parseInt(value) })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2 Columns</SelectItem>
            <SelectItem value="3">3 Columns</SelectItem>
            <SelectItem value="4">4 Columns</SelectItem>
            <SelectItem value="5">5 Columns</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
        <div>
          <Label>Show Student Photos</Label>
          <p className="text-sm text-muted-foreground">Display profile photos on the cards</p>
        </div>
        <Switch
          checked={metadata.show_photos || false}
          onCheckedChange={(checked) => updateMetadata({ show_photos: checked })}
        />
      </div>

      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> Students are managed in the "Student Tributes" section below. 
          This section automatically displays all students added to this farewell page.
        </p>
      </div>
    </div>
  );
}
