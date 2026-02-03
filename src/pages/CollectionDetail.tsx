import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCollection, usePhotos } from '@/hooks/useDatabase';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: collection, isLoading: collectionLoading } = useCollection(id || '');
  const { data: photos, isLoading: photosLoading } = usePhotos(id || '');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const nextPhoto = () => {
    if (photos && currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  if (collectionLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-2/3 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!collection) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Collection Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The collection you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/memories">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Memories
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-6 -ml-4">
          <Link to="/memories">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Memories
          </Link>
        </Button>

        {/* Collection header */}
        <div className="mb-10">
          {collection.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {collection.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-block px-3 py-1 text-sm font-medium rounded-full text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {collection.title}
          </h1>
          
          {collection.description && (
            <p className="text-muted-foreground text-lg mb-4 max-w-3xl">
              {collection.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {collection.event_date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(collection.event_date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric' 
                })}
              </span>
            )}
            {collection.branch && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {collection.branch.name}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Camera className="h-4 w-4" />
              {collection.photo_count} photos
            </span>
          </div>
        </div>

        {/* Photos grid */}
        {photosLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : photos && photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => openLightbox(index)}
                className="group relative aspect-square rounded-lg overflow-hidden bg-secondary shadow-elegant hover:shadow-elegant-lg transition-all"
              >
                <img
                  src={photo.image_url}
                  alt={photo.caption || `Photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {photo.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="absolute bottom-3 left-3 right-3 text-white text-sm truncate">
                      {photo.caption}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-secondary/30 rounded-xl">
            <Camera className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-lg text-muted-foreground">No photos in this collection yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {/* Navigation */}
            {photos && photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  disabled={currentPhotoIndex === 0}
                  className="absolute left-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                <button
                  onClick={nextPhoto}
                  disabled={currentPhotoIndex === photos.length - 1}
                  className="absolute right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              </>
            )}

            {/* Image */}
            {photos && photos[currentPhotoIndex] && (
              <div className="p-8">
                <img
                  src={photos[currentPhotoIndex].image_url}
                  alt={photos[currentPhotoIndex].caption || `Photo ${currentPhotoIndex + 1}`}
                  className="max-w-full max-h-[80vh] object-contain mx-auto"
                />
                {photos[currentPhotoIndex].caption && (
                  <p className="text-white text-center mt-4">
                    {photos[currentPhotoIndex].caption}
                  </p>
                )}
                <p className="text-white/50 text-center text-sm mt-2">
                  {currentPhotoIndex + 1} / {photos.length}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CollectionDetail;
