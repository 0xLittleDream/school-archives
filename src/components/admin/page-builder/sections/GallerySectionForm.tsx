import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCollections } from '@/hooks/useDatabase';
import { useBranch } from '@/contexts/BranchContext';
import { Camera } from 'lucide-react';
import type { PageSection, GalleryMetadata } from '@/types/pageBuilder';

interface GallerySectionFormProps {
  section: PageSection;
  onChange: (updates: Partial<PageSection>) => void;
}

export function GallerySectionForm({ section, onChange }: GallerySectionFormProps) {
  const metadata = (section.metadata || {}) as GalleryMetadata;
  const { selectedBranchId } = useBranch();
  const { data: collections } = useCollections(selectedBranchId || undefined);

  const updateMetadata = (updates: Partial<GalleryMetadata>) => {
    onChange({ 
      metadata: { ...metadata, ...updates } 
    });
  };

  const selectedCollection = collections?.find(c => c.id === metadata.collection_id);

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Section Title</Label>
        <Input
          value={section.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Photo Gallery"
        />
      </div>

      <div className="space-y-2">
        <Label>Subtitle (Optional)</Label>
        <Input
          value={section.subtitle || ''}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          placeholder="e.g., Memories from our celebration"
        />
      </div>

      <div className="space-y-2">
        <Label>Link to Collection</Label>
        <Select 
          value={metadata.collection_id || 'none'} 
          onValueChange={(value) => updateMetadata({ collection_id: value === 'none' ? undefined : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a collection..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No collection linked</SelectItem>
            {collections?.map((collection) => (
              <SelectItem key={collection.id} value={collection.id}>
                {collection.title} ({collection.photo_count} photos)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Photos from the linked collection will be displayed in this gallery
        </p>
      </div>

      {selectedCollection && (
        <div className="bg-secondary/50 rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            {selectedCollection.cover_image_url ? (
              <img 
                src={selectedCollection.cover_image_url} 
                alt={selectedCollection.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center">
                <Camera className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div>
              <p className="font-medium text-foreground">{selectedCollection.title}</p>
              <p className="text-sm text-muted-foreground">
                {selectedCollection.photo_count} photos will be shown
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
