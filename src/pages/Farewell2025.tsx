import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Camera, Heart, GraduationCap, Calendar, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useBranch } from '@/contexts/BranchContext';
import { useCollections, usePhotos, useContentBlocks } from '@/hooks/useDatabase';

const Farewell2025 = () => {
  const { selectedBranch, selectedBranchId } = useBranch();
  const { data: collections, isLoading } = useCollections(selectedBranchId || undefined);
  
  // Find the farewell collection for this branch
  const farewellCollection = collections?.find(c => 
    c.tags.some(t => t.name.toLowerCase().includes('farewell'))
  );

  const { data: photos } = usePhotos(farewellCollection?.id || '');
  const { data: contentBlocks } = useContentBlocks(farewellCollection?.id || '');

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-16 md:py-28 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/5 to-accent/10" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 mb-8 animate-fade-in">
              <GraduationCap className="w-5 h-5 text-accent" />
              <span className="text-sm font-semibold tracking-wide text-accent">
                Class of 2025
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
              Farewell
              <br />
              <span className="text-gradient italic">2025</span>
            </h1>
            
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
              {farewellCollection?.description || 
                `Celebrating the journey of our graduating class at ${selectedBranch?.name || 'NCS'}. 
                Memories that will last a lifetime, friendships that will never fade.`}
            </p>

            {/* Event Details */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mb-10 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <span className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border shadow-sm">
                <Calendar className="h-4 w-4 text-primary" />
                {farewellCollection?.event_date 
                  ? new Date(farewellCollection.event_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  : 'Coming Soon'}
              </span>
              <span className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border shadow-sm">
                <MapPin className="h-4 w-4 text-primary" />
                {selectedBranch?.name || 'NCS Campus'}
              </span>
            </div>

            {farewellCollection ? (
              <Button asChild size="lg" className="h-14 px-8 gap-2 animate-fade-in" style={{ animationDelay: '400ms' }}>
                <Link to={`/collection/${farewellCollection.id}`}>
                  <Camera className="w-5 h-5" />
                  View Full Gallery
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="h-14 px-8 gap-2 animate-fade-in" style={{ animationDelay: '400ms' }}>
                <Link to="/memories">
                  <Camera className="w-5 h-5" />
                  Explore All Memories
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Content Blocks */}
      {contentBlocks && contentBlocks.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container max-w-4xl">
            <div className="space-y-12">
              {contentBlocks.map((block, index) => (
                <div 
                  key={block.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {block.block_type === 'image_text' && block.image_url ? (
                    <div className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                      <div className="rounded-2xl overflow-hidden shadow-elegant-lg">
                        <img 
                          src={block.image_url} 
                          alt={block.title || ''} 
                          className="w-full h-64 md:h-80 object-cover"
                        />
                      </div>
                      <div>
                        {block.title && (
                          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                            {block.title}
                          </h3>
                        )}
                        {block.content && (
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {block.content}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-card rounded-2xl p-8 border border-border">
                      {block.title && (
                        <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                          {block.title}
                        </h3>
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
          </div>
        </section>
      )}

      {/* Photo Gallery Preview */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Photo Gallery
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Captured Moments
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {photos && photos.length > 0 
                ? `${photos.length} photos from our farewell celebration`
                : 'Photos will be uploaded after the farewell event'}
            </p>
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
                    aspectRatio: i === 0 ? '1' : '1',
                    animationDelay: `${i * 50}ms`
                  }}
                >
                  <img 
                    src={photo.image_url} 
                    alt={photo.caption || `Farewell photo ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
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
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className={`relative rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 overflow-hidden shadow-elegant group cursor-pointer hover:shadow-elegant-lg transition-all duration-300 animate-fade-in ${
                    i === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                  style={{ 
                    aspectRatio: i === 0 ? '1' : '1',
                    animationDelay: `${i * 50}ms`
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <Camera className="h-8 w-8 text-muted-foreground/30 mb-2" />
                    <span className="text-xs text-muted-foreground/50 text-center">
                      Coming Soon
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {photos && photos.length > 12 && farewellCollection && (
            <div className="text-center mt-10">
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to={`/collection/${farewellCollection.id}`}>
                  View All {photos.length} Photos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Message Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="h-12 w-12 text-accent mx-auto mb-6 animate-pulse" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              A Message for the Graduating Class
            </h2>
            <blockquote className="text-xl md:text-2xl text-muted-foreground italic leading-relaxed mb-8">
              "As you step into a new chapter of your lives, carry with you the memories, 
              lessons, and bonds you've formed here. You are not just leaving school; 
              you are carrying a piece of it with you forever."
            </blockquote>
            <p className="text-muted-foreground">
              — The NCS Memories Team
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '12', label: 'Years of Journey' },
              { value: photos?.length || '∞', label: 'Memories Made' },
              { value: '1', label: 'Amazing Batch' },
              { value: '♥', label: 'Endless Love' },
            ].map((stat, i) => (
              <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <p className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  {stat.value}
                </p>
                <p className="text-primary-foreground/70 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for Admin */}
      {!farewellCollection && (
        <section className="py-12 bg-accent/5 border-t border-border">
          <div className="container text-center">
            <p className="text-muted-foreground mb-4">
              Admin? Create a Farewell collection with the "Farewell" tag to customize this page.
            </p>
            <Button asChild variant="outline">
              <Link to="/admin">
                Go to Admin Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Farewell2025;
