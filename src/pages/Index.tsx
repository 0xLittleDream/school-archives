import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Camera, Calendar, ArrowRight, Heart, Users } from 'lucide-react';
import { useFeaturedCollections, useStats } from '@/hooks/useDatabase';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { data: featuredCollections, isLoading: collectionsLoading } = useFeaturedCollections();
  const { data: stats, isLoading: statsLoading } = useStats();

  return (
    <Layout>
      {/* Hero Section - Matching Reference Design */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-border mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                  Official School Archive
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                <span className="text-primary">NCS</span>{' '}
                <span className="text-gradient italic">Memories</span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8 leading-relaxed">
                Preserving moments. Celebrating journeys. A digital archive built with love for the NCS Vizag community.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="h-14 px-8 text-base tracking-wide uppercase">
                  <Link to="/memories">
                    Explore Our Collections
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base tracking-wide uppercase">
                  <Link to="/farewell-2025">
                    View Farewell 2025
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="relative animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="relative rounded-2xl overflow-hidden shadow-elegant-lg bg-secondary aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200"
                  alt="Students at NCS"
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-accent/20 blur-2xl" />
              <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Matching Reference Style */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Image with Mission Card */}
            <div className="relative animate-fade-in order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-elegant-lg bg-secondary aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800"
                  alt="School Campus"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Mission Card Overlay */}
              <div className="absolute -bottom-6 -right-6 md:right-6 max-w-xs bg-background/95 backdrop-blur-sm rounded-xl p-6 shadow-elegant-lg border border-border">
                <h3 className="font-display text-xl italic text-primary mb-2">Our Mission</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "To preserve the essence of every moment, celebrating the journey of every student."
                </p>
              </div>
            </div>

            {/* Right - Content */}
            <div className="order-1 lg:order-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                About NCS Memories
              </span>
              
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-2">
                <span className="text-primary">A Platform Built</span>
                <br />
                <span className="text-accent italic">With Love.</span>
              </h2>

              <p className="text-muted-foreground mt-6 mb-8 leading-relaxed">
                NCS Memories is more than just a photo archive. It's a living testament to the vibrant spirit of our school community, preserving moments that define our collective journey.
              </p>

              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">For Every Batch</h4>
                  <p className="text-sm text-muted-foreground">
                    A permanent home for memories from all years, ensuring no moment is forgotten.
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">Community Driven</h4>
                  <p className="text-sm text-muted-foreground">
                    Built by students, for students, with contributions from the entire NCS family.
                  </p>
                </div>
              </div>

              <Button asChild size="lg" className="h-14 px-8 uppercase tracking-wide">
                <Link to="/about">
                  Learn More About Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections - Elegant Title */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gradient uppercase tracking-wider">
              Relive Your
            </h2>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary uppercase tracking-wider">
              Memories
            </h2>
          </div>

          {/* Collections grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectionsLoading ? (
              Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
              ))
            ) : featuredCollections && featuredCollections.length > 0 ? (
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
              <div className="col-span-full text-center py-12">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No featured collections yet.</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Add collections and mark them as featured in the admin dashboard.
                </p>
              </div>
            )}
          </div>

          <div className="text-center mt-10">
            <Button variant="outline" asChild size="lg" className="gap-2">
              <Link to="/memories">
                View all collections <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
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
                  <Skeleton className="h-10 w-16 mx-auto mb-2 bg-primary-foreground/20" />
                ) : (
                  <p className="font-display text-4xl md:text-5xl font-bold">
                    {stat.value}
                  </p>
                )}
                <p className="text-primary-foreground/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
