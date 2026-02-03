import { usePhotos, useCollections } from '@/hooks/useDatabase';
import { useBranch } from '@/contexts/BranchContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Camera, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export function ImageGallerySection() {
  const { selectedBranchId } = useBranch();
  const { data: collections } = useCollections(selectedBranchId || undefined);
  const [allPhotos, setAllPhotos] = useState<Array<{ url: string; caption?: string; collectionId: string }>>([]);
  const [loading, setLoading] = useState(true);

  // Collect photos from collections with cover images
  useEffect(() => {
    if (collections && collections.length > 0) {
      const photos = collections
        .filter(c => c.cover_image_url)
        .map(c => ({
          url: c.cover_image_url!,
          caption: c.title,
          collectionId: c.id,
        }))
        .slice(0, 12);
      
      setAllPhotos(photos);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [collections]);

  // If no photos, show placeholder gallery
  const displayPhotos = allPhotos.length > 0 ? allPhotos : [
    { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400', caption: 'Students', collectionId: '' },
    { url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=400', caption: 'Graduation', collectionId: '' },
    { url: 'https://images.unsplash.com/photo-1529390079861-591f6a8ed8d5?q=80&w=400', caption: 'Event', collectionId: '' },
    { url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=400', caption: 'Campus', collectionId: '' },
    { url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=400', caption: 'Memories', collectionId: '' },
    { url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400', caption: 'Cultural', collectionId: '' },
  ];

  return (
    <section className="py-16 md:py-24 bg-card overflow-hidden">
      <div className="container mb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <Camera className="h-4 w-4" />
              Photo Gallery
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Recent Captures
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              A glimpse into our most cherished moments captured on camera.
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2 self-start md:self-auto">
            <Link to="/memories">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Scrolling Gallery Row 1 */}
      <div className="relative mb-4">
        <div className="flex gap-4 animate-scroll-left">
          {[...displayPhotos, ...displayPhotos].map((photo, i) => (
            <Link
              key={i}
              to={photo.collectionId ? `/collection/${photo.collectionId}` : '/memories'}
              className="flex-shrink-0 group"
            >
              <div className="relative w-64 h-44 md:w-80 md:h-52 rounded-2xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all duration-300">
                {loading ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <>
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Gallery image'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                        <p className="text-white text-sm font-medium truncate">{photo.caption}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Scrolling Gallery Row 2 - Reverse direction */}
      <div className="relative">
        <div className="flex gap-4 animate-scroll-right">
          {[...displayPhotos.slice().reverse(), ...displayPhotos.slice().reverse()].map((photo, i) => (
            <Link
              key={i}
              to={photo.collectionId ? `/collection/${photo.collectionId}` : '/memories'}
              className="flex-shrink-0 group"
            >
              <div className="relative w-52 h-36 md:w-72 md:h-44 rounded-2xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all duration-300">
                {loading ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <>
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Gallery image'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
