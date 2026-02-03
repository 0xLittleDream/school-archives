import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCollection, usePhotos, useContentBlocks } from '@/hooks/useDatabase';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, X, ChevronLeft, ChevronRight, Camera, Star } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ShareButtons } from '@/components/ShareButtons';

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: collection, isLoading: collectionLoading } = useCollection(id || '');
  const { data: photos, isLoading: photosLoading } = usePhotos(id || '');
  const { data: contentBlocks } = useContentBlocks(id || '');
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

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
    if (e.key === 'Escape') setLightboxOpen(false);
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
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!collection) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Camera className="h-16 w-16 mx-auto text-muted-foreground/30 mb-6" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Collection Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            The collection you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild size="lg">
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
      {/* Hero Section with Cover Image */}
      <section className="relative">
        {collection.cover_image_url ? (
          <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
            <img 
              src={collection.cover_image_url} 
              alt={collection.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-br from-primary/10 to-accent/10" />
        )}
        
        {/* Content overlaid on cover */}
        <div className="container relative">
          <div className={collection.cover_image_url ? '-mt-32 md:-mt-40' : 'pt-8'}>
            {/* Back button */}
            <Button 
              variant="ghost" 
              asChild 
              className={`mb-4 ${collection.cover_image_url ? 'text-white hover:bg-white/20' : ''}`}
            >
              <Link to="/memories">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Memories
              </Link>
            </Button>

            {/* Collection header card */}
            <div className={`${collection.cover_image_url ? 'bg-card rounded-2xl p-6 md:p-8 shadow-elegant-lg border border-border' : ''}`}>
              {/* Tags */}
              {collection.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {collection.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      className="px-3 py-1 text-white"
                      style={{ backgroundColor: tag.color }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                  {collection.is_featured && (
                    <Badge variant="outline" className="gap-1 border-accent text-accent">
                      <Star className="h-3 w-3 fill-current" />
                      Featured
                    </Badge>
                  )}
                </div>
              )}
              
              <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
                {collection.title}
              </h1>
              
              {collection.description && (
                <p className="text-muted-foreground text-base md:text-lg mb-6 max-w-3xl leading-relaxed">
                  {collection.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                  {collection.event_date && (
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
                      <Calendar className="h-4 w-4 text-primary" />
                      {new Date(collection.event_date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric' 
                      })}
                    </span>
                  )}
                  {collection.branch && (
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
                      <MapPin className="h-4 w-4 text-primary" />
                      {collection.branch.name}
                    </span>
                  )}
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
                    <Camera className="h-4 w-4 text-primary" />
                    {collection.photo_count} photos
                  </span>
                </div>
                <ShareButtons title={collection.title} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8 md:py-12">
        {/* Content Blocks - Text sections added by teachers */}
        {contentBlocks && contentBlocks.length > 0 && (
          <div className="space-y-10 mb-16">
            {contentBlocks.map((block, index) => (
              <div 
                key={block.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {block.block_type === 'image_text' && block.image_url ? (
                  <div className={`grid md:grid-cols-2 gap-8 items-center ${
                    index % 2 === 1 ? '' : ''
                  }`}>
                    <div className={`rounded-2xl overflow-hidden shadow-elegant-lg ${
                      index % 2 === 1 ? 'md:order-2' : ''
                    }`}>
                      <img 
                        src={block.image_url} 
                        alt={block.title || ''} 
                        className="w-full h-64 md:h-80 object-cover"
                      />
                    </div>
                    <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                      {block.title && (
                        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                          {block.title}
                        </h2>
                      )}
                      {block.content && (
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg">
                          {block.content}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 border border-border">
                    {block.title && (
                      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                        {block.title}
                      </h2>
                    )}
                    {block.content && (
                      <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                        {block.content}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Photo Gallery Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Photo Gallery
          </h2>
          {photos && photos.length > 0 && (
            <p className="text-muted-foreground text-sm">
              {photos.length} photos
            </p>
          )}
        </div>

        {/* Photos grid - Masonry-style */}
        {photosLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : photos && photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => openLightbox(index)}
                className={`group relative rounded-xl overflow-hidden bg-secondary shadow-elegant hover:shadow-elegant-lg transition-all duration-300 animate-fade-in ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                style={{ 
                  aspectRatio: index === 0 ? '1' : '1',
                  animationDelay: `${index * 30}ms`
                }}
              >
                <img
                  src={photo.image_url}
                  alt={photo.caption || `Photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium line-clamp-2">
                      {photo.caption}
                    </p>
                  </div>
                )}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    {index + 1}/{photos.length}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-secondary/30 rounded-2xl border border-dashed border-border">
            <Camera className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">No photos yet</h3>
            <p className="text-muted-foreground">Photos will appear here once they're uploaded.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent 
          className="max-w-[100vw] h-[100vh] p-0 bg-black/95 border-none rounded-none"
          onKeyDown={handleKeyDown}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {/* Navigation */}
            {photos && photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  disabled={currentPhotoIndex === 0}
                  className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-8 w-8 text-white" />
                </button>
                <button
                  onClick={nextPhoto}
                  disabled={currentPhotoIndex === photos.length - 1}
                  className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-8 w-8 text-white" />
                </button>
              </>
            )}

            {/* Image */}
            {photos && photos[currentPhotoIndex] && (
              <div className="p-4 md:p-12 w-full h-full flex flex-col items-center justify-center">
                <img
                  src={photos[currentPhotoIndex].image_url}
                  alt={photos[currentPhotoIndex].caption || `Photo ${currentPhotoIndex + 1}`}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                />
                <div className="mt-6 text-center">
                  {photos[currentPhotoIndex].caption && (
                    <p className="text-white text-lg mb-2 max-w-2xl">
                      {photos[currentPhotoIndex].caption}
                    </p>
                  )}
                  <p className="text-white/50 text-sm">
                    {currentPhotoIndex + 1} of {photos.length}
                  </p>
                </div>
              </div>
            )}

            {/* Thumbnail strip */}
            {photos && photos.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 px-4">
                <div className="flex justify-center gap-2 overflow-x-auto pb-2">
                  {photos.slice(0, 10).map((photo, index) => (
                    <button
                      key={photo.id}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentPhotoIndex 
                          ? 'border-white scale-110' 
                          : 'border-white/30 hover:border-white/60'
                      }`}
                    >
                      <img 
                        src={photo.image_url} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  {photos.length > 10 && (
                    <span className="flex items-center text-white/50 text-sm px-2">
                      +{photos.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CollectionDetail;
