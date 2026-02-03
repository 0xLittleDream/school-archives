import { Camera, Pencil, Trash2, Settings, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { CollectionWithTags } from '@/types/database';
import { format } from 'date-fns';

interface CollectionCardProps {
  collection: CollectionWithTags;
  onEdit: (collection: CollectionWithTags) => void;
  onDelete: (collection: CollectionWithTags) => void;
  onEditMetadata?: (collection: CollectionWithTags) => void;
}

export function CollectionCard({ collection, onEdit, onDelete, onEditMetadata }: CollectionCardProps) {
  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all border border-border">
      {/* Cover Image */}
      <div className="relative aspect-[4/3] bg-secondary">
        {collection.cover_image_url ? (
          <img
            src={collection.cover_image_url}
            alt={collection.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
            <Camera className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        
        {/* Featured Badge */}
        {collection.is_featured && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-accent text-accent-foreground">
              Featured
            </span>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Action Buttons */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg"
            onClick={() => onEdit(collection)}
          >
            <Pencil className="h-5 w-5" />
          </Button>
          {onEditMetadata && (
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full shadow-lg"
              onClick={() => onEditMetadata(collection)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="icon"
            variant="destructive"
            className="h-10 w-10 rounded-full shadow-lg"
            onClick={() => onDelete(collection)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
              {collection.title}
            </h3>
            
            {collection.event_date && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {format(new Date(collection.event_date), 'MMMM yyyy')}
              </p>
            )}
          </div>
          
          <Link 
            to={`/collection/${collection.id}`}
            className="flex-shrink-0 p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            title="View public page"
          >
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
        
        {collection.description && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
            {collection.description}
          </p>
        )}
        
        {/* Tags */}
        {collection.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {collection.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-0.5 text-xs font-medium rounded-full text-white"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <span className="text-sm text-muted-foreground">
            📸 {collection.photo_count} photos
          </span>
          {collection.branch && (
            <span className="text-xs text-primary font-semibold bg-primary/10 px-2 py-1 rounded-full">
              {collection.branch.code}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
