import type { ContentBlock } from '@/types/database';
import { cn } from '@/lib/utils';

interface ContentBlockRendererProps {
  block: ContentBlock;
  isEditing?: boolean;
  onEdit?: () => void;
  className?: string;
}

export function ContentBlockRenderer({ block, isEditing, onEdit, className }: ContentBlockRendererProps) {
  const baseClasses = cn(
    'group relative rounded-2xl overflow-hidden transition-all duration-300',
    isEditing && 'cursor-pointer hover:ring-2 hover:ring-accent',
    className
  );

  // Render based on block type
  switch (block.block_type) {
    case 'image':
      return (
        <div 
          className={cn(baseClasses, 'aspect-[16/10] bg-secondary')}
          onClick={onEdit}
        >
          {block.image_url ? (
            <img
              src={block.image_url}
              alt={block.title || 'Image'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No image
            </div>
          )}
          {block.title && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white text-sm font-medium">{block.title}</p>
            </div>
          )}
          {isEditing && (
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="px-4 py-2 bg-background/90 rounded-lg text-sm font-medium">Click to edit</span>
            </div>
          )}
        </div>
      );

    case 'image_text':
      return (
        <div 
          className={cn(baseClasses, 'grid md:grid-cols-2 gap-0 bg-card border border-border')}
          onClick={onEdit}
        >
          <div className={cn(
            'aspect-square md:aspect-auto overflow-hidden',
            block.image_position === 'right' && 'md:order-2'
          )}>
            {block.image_url ? (
              <img
                src={block.image_url}
                alt={block.title || 'Image'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-secondary text-muted-foreground">
                No image
              </div>
            )}
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center">
            {block.title && (
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3">
                {block.title}
              </h3>
            )}
            {block.content && (
              <p className="text-muted-foreground leading-relaxed">
                {block.content}
              </p>
            )}
          </div>
          {isEditing && (
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="px-4 py-2 bg-background/90 rounded-lg text-sm font-medium">Click to edit</span>
            </div>
          )}
        </div>
      );

    case 'text':
      return (
        <div 
          className={cn(baseClasses, 'p-6 md:p-10 bg-card border border-border')}
          onClick={onEdit}
        >
          {block.title && (
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              {block.title}
            </h3>
          )}
          {block.content && (
            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
              {block.content.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
              ))}
            </div>
          )}
          {isEditing && (
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="px-4 py-2 bg-background/90 rounded-lg text-sm font-medium">Click to edit</span>
            </div>
          )}
        </div>
      );

    case 'gallery':
      const images = block.gallery_images || [];
      return (
        <div 
          className={cn(baseClasses, 'bg-card border border-border p-4 md:p-6')}
          onClick={onEdit}
        >
          {block.title && (
            <h3 className="font-display text-xl font-bold text-foreground mb-4">
              {block.title}
            </h3>
          )}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-secondary">
                  <img
                    src={img}
                    alt={`Gallery image ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="aspect-[4/1] flex items-center justify-center text-muted-foreground bg-secondary/30 rounded-xl">
              No images in gallery
            </div>
          )}
          {isEditing && (
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="px-4 py-2 bg-background/90 rounded-lg text-sm font-medium">Click to edit</span>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}
