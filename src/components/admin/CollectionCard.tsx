import { Camera, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CollectionWithTags } from '@/types/database';
import { format } from 'date-fns';

interface CollectionCardProps {
  collection: CollectionWithTags;
  onEdit: (collection: CollectionWithTags) => void;
  onDelete: (collection: CollectionWithTags) => void;
}

export function CollectionCard({ collection, onEdit, onDelete }: CollectionCardProps) {
  return (
    <div className="group relative bg-card rounded-xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all">
      {/* Cover Image */}
      <div className="relative aspect-[4/3] bg-secondary">
        {collection.cover_image_url ? (
          <img
            src={collection.cover_image_url}
            alt={collection.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full shadow-md"
            onClick={() => onEdit(collection)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="h-9 w-9 rounded-full shadow-md"
            onClick={() => onDelete(collection)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
          {collection.title}
        </h3>
        
        {collection.event_date && (
          <p className="text-sm text-muted-foreground mt-1">
            {format(new Date(collection.event_date), 'MMMM yyyy')}
          </p>
        )}
        
        {collection.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {collection.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <span className="text-sm text-muted-foreground">
            {collection.photo_count} photos
          </span>
          {collection.branch && (
            <span className="text-xs text-primary font-medium">
              /{collection.branch.code.toLowerCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
