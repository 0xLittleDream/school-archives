import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Camera, Calendar, ArrowRight } from 'lucide-react';
import { useFeaturedCollections, useStats } from '@/hooks/useDatabase';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { data: featuredCollections, isLoading: collectionsLoading } = useFeaturedCollections();
  const { data: stats, isLoading: statsLoading } = useStats();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary mb-6">
              NCS <span className="text-gradient">Memories</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Preserving moments. Celebrating journeys. A digital archive of our school's most cherished memories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/memories">
                  <Camera className="h-5 w-5" />
                  Explore Our Collections
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/farewell-2025">
                  <Calendar className="h-5 w-5" />
                  View Farewell 2025
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 h-[600px] w-[600px] rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Featured Collections
              </h2>
              <p className="text-muted-foreground mt-2">
                Explore our most memorable moments
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex gap-1">
              <Link to="/memories">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Collections grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectionsLoading ? (
              // Loading skeletons
              Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
              ))
            ) : featuredCollections && featuredCollections.length > 0 ? (
              // Real collections
              featuredCollections.slice(0, 6).map((collection, i) => (
                <Link
                  key={collection.id}
                  to={`/collection/${collection.id}`}
                  className="group relative aspect-[4/3] rounded-xl bg-secondary overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {collection.cover_image_url ? (
                    <img
                      src={collection.cover_image_url}
                      alt={collection.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    {collection.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {collection.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-block px-2 py-0.5 text-xs font-medium rounded"
                            style={{ backgroundColor: tag.color, color: '#fff' }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="font-display text-xl font-semibold text-white">
                      {collection.title}
                    </h3>
                    <p className="text-white/70 text-sm mt-1">
                      {collection.photo_count} photos
                      {collection.event_date && ` • ${new Date(collection.event_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              // Empty state
              <div className="col-span-full text-center py-12">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No featured collections yet.</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Add collections and mark them as featured in the admin dashboard.
                </p>
              </div>
            )}
          </div>

          <Button variant="ghost" asChild className="mt-6 md:hidden w-full gap-1">
            <Link to="/memories">
              View all collections <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: stats?.photos ?? '—', label: 'Photos' },
              { value: stats?.collections ?? '—', label: 'Collections' },
              { value: stats?.events ?? '—', label: 'Event Types' },
              { value: stats?.branches ?? '—', label: 'Branches' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                {statsLoading ? (
                  <Skeleton className="h-10 w-16 mx-auto mb-2" />
                ) : (
                  <p className="font-display text-3xl md:text-4xl font-bold text-primary">
                    {stat.value}
                  </p>
                )}
                <p className="text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
