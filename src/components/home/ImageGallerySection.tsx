import { useAllPhotos } from '@/hooks/useDatabase';
import { useBranch } from '@/contexts/BranchContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Camera, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface PhotoItem {
  url: string;
  caption: string;
  collectionId: string;
}

function MarqueeRow({ 
  photos, 
  direction, 
  isLoading,
  size = 'normal' 
}: { 
  photos: PhotoItem[]; 
  direction: 'left' | 'right';
  isLoading: boolean;
  size?: 'normal' | 'small';
}) {
  // Double the photos for seamless loop
  const duplicatedPhotos = [...photos, ...photos];
  
  const sizeClasses = size === 'normal' 
    ? 'w-64 h-44 md:w-80 md:h-52' 
    : 'w-52 h-36 md:w-72 md:h-44';

  return (
    <div className={`marquee-container ${direction === 'left' ? 'marquee-left' : 'marquee-right'}`}>
      <div className="marquee-content">
        {duplicatedPhotos.map((photo, i) => (
          <Link
            key={`${direction}-${i}`}
            to={photo.collectionId ? `/collection/${photo.collectionId}` : '/memories'}
            className="flex-shrink-0 group"
          >
            <div className={`relative ${sizeClasses} rounded-2xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all duration-300`}>
              {isLoading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <>
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Gallery image'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {photo.caption && size === 'normal' && (
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
  );
}

export function ImageGallerySection() {
  const { selectedBranchId } = useBranch();
  const { data: photos, isLoading } = useAllPhotos(selectedBranchId || undefined, 24);

  // Transform photos for display
  const displayPhotos: PhotoItem[] = photos?.map(photo => ({
    url: photo.image_url,
    caption: photo.caption || photo.collection?.title || 'Photo',
    collectionId: photo.collection_id,
  })) || [];

  // Fallback placeholder gallery if no photos
  const placeholderPhotos: PhotoItem[] = [
    { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400', caption: 'Students', collectionId: '' },
    { url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=400', caption: 'Graduation', collectionId: '' },
    { url: 'https://images.unsplash.com/photo-1529390079861-591f6a8ed8d5?q=80&w=400', caption: 'Event', collectionId: '' },
    { url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=400', caption: 'Campus', collectionId: '' },
    { url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=400', caption: 'Memories', collectionId: '' },
    { url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400', caption: 'Cultural', collectionId: '' },
  ];

  const photosToShow = displayPhotos.length > 0 ? displayPhotos : placeholderPhotos;
  
  // Split photos for two rows
  const halfLength = Math.ceil(photosToShow.length / 2);
  const row1Photos = photosToShow.slice(0, halfLength);
  const row2Photos = photosToShow.slice(halfLength);

  // Ensure we have enough photos for each row (minimum 3)
  const ensureMinPhotos = (arr: PhotoItem[], min: number = 3): PhotoItem[] => {
    if (arr.length === 0) return placeholderPhotos.slice(0, min);
    while (arr.length < min) {
      arr = [...arr, ...arr];
    }
    return arr.slice(0, Math.max(arr.length, min));
  };

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

      {/* Scrolling Gallery Row 1 - Left */}
      <div className="mb-4">
        <MarqueeRow 
          photos={ensureMinPhotos(row1Photos)} 
          direction="left" 
          isLoading={isLoading}
          size="normal"
        />
      </div>

      {/* Scrolling Gallery Row 2 - Right */}
      <MarqueeRow 
        photos={ensureMinPhotos(row2Photos)} 
        direction="right" 
        isLoading={isLoading}
        size="small"
      />
    </section>
  );
}
