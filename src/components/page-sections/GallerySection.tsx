import { Link } from 'react-router-dom';
import { Camera, Sparkles, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePhotos } from '@/hooks/useDatabase';
import type { PageSection, GalleryMetadata } from '@/types/pageBuilder';

interface GallerySectionProps {
  section: PageSection;
}

export function GallerySection({ section }: GallerySectionProps) {
  const metadata = (section.metadata || {}) as GalleryMetadata;
  const { data: photos, isLoading } = usePhotos(metadata.collection_id || '');

  const handleDownload = async (imageUrl: string, caption?: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = caption ? `${caption.replace(/[^a-z0-9]/gi, '_')}.jpg` : 'photo.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            {section.title || 'Photo Gallery'}
          </span>
          {section.subtitle && (
            <p className="text-muted-foreground max-w-lg mx-auto">
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        ) : photos && photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.slice(0, 12).map((photo, i) => (
              <div
                key={photo.id}
                className={`relative rounded-2xl overflow-hidden shadow-elegant group cursor-pointer hover:shadow-elegant-lg transition-all duration-300 animate-fade-in ${
                  i === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                style={{ 
                  aspectRatio: '1',
                  animationDelay: `${i * 50}ms`
                }}
              >
                <img 
                  src={photo.image_url} 
                  alt={photo.caption || `Photo ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
                
                {/* Download Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(photo.image_url, photo.caption);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-background/90 text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground shadow-lg"
                  title="Download photo"
                >
                  <Download className="h-4 w-4" />
                </button>

                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm line-clamp-2">{photo.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className={`relative rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 overflow-hidden shadow-elegant ${
                  i === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                style={{ aspectRatio: '1' }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <Camera className="h-8 w-8 text-muted-foreground/30 mb-2" />
                  <span className="text-xs text-muted-foreground/50 text-center">
                    No photos yet
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {photos && photos.length > 12 && metadata.collection_id && (
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to={`/collection/${metadata.collection_id}`}>
                View All {photos.length} Photos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
