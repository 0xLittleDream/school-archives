import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Camera, ArrowRight, Heart, Users, Sparkles, GraduationCap } from 'lucide-react';
import { useFeaturedCollections, useStats } from '@/hooks/useDatabase';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { data: featuredCollections, isLoading: collectionsLoading } = useFeaturedCollections();
  const { data: stats, isLoading: statsLoading } = useStats();

  return (
    <Layout>
      {/* Hero Section - Premium Elegant Design */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary via-background to-background" />
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-8">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium tracking-wide text-foreground">
                  Official School Archive
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8">
                <span className="text-primary">NCS</span>
                <br />
                <span className="text-gradient italic">Memories</span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed">
                Preserving precious moments. Celebrating extraordinary journeys. A digital archive 
                crafted with love for the NCS community.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="h-14 px-8 text-base font-semibold tracking-wide shadow-elegant-lg hover:shadow-elegant transition-shadow">
                  <Link to="/memories">
                    <Camera className="w-5 h-5 mr-2" />
                    Explore Collections
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base font-semibold tracking-wide">
                  <Link to="/farewell-2025">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Farewell 2025
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right - Hero Image Grid */}
            <div className="relative animate-fade-in hidden lg:block" style={{ animationDelay: '200ms' }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-elegant-lg bg-secondary aspect-[3/4] transform hover:scale-[1.02] transition-transform duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600"
                      alt="Students celebrating"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-elegant-lg bg-secondary aspect-square transform hover:scale-[1.02] transition-transform duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=400"
                      alt="Graduation"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-elegant-lg bg-secondary aspect-square transform hover:scale-[1.02] transition-transform duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1529390079861-591f6a8ed8d5?q=80&w=400"
                      alt="School Event"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-elegant-lg bg-secondary aspect-[3/4] transform hover:scale-[1.02] transition-transform duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600"
                      alt="Campus Life"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -left-8 bottom-1/3 bg-card/95 backdrop-blur-sm rounded-xl p-5 shadow-elegant-lg border border-border">
                <div className="text-4xl font-display font-bold text-primary">
                  {statsLoading ? <Skeleton className="h-10 w-16" /> : stats?.collections || 0}
                </div>
                <div className="text-sm text-muted-foreground">Memory Collections</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Refined */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left - Image */}
            <div className="relative animate-fade-in order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-elegant-lg bg-secondary aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800"
                  alt="School Memories"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
              </div>
              
              {/* Quote Card */}
              <div className="absolute -bottom-6 -right-6 md:right-8 max-w-xs bg-background/95 backdrop-blur-sm rounded-2xl p-6 shadow-elegant-lg border border-border">
                <blockquote className="font-display text-lg italic text-primary leading-relaxed">
                  "Every photo holds a story, every memory deserves to live forever."
                </blockquote>
              </div>
            </div>

            {/* Right - Content */}
            <div className="order-1 lg:order-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide mb-6">
                About NCS Memories
              </span>
              
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6">
                <span className="text-foreground">A Platform Built</span>
                <br />
                <span className="text-gradient italic">With Love & Care</span>
              </h2>

              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                NCS Memories is more than a photo archive. It's a digital sanctuary preserving 
                the spirit, laughter, and milestones of our school community for generations to come.
              </p>

              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                <div className="p-5 rounded-xl bg-secondary/50 border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">For Every Batch</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A permanent home for memories from all years, ensuring no moment is forgotten.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-secondary/50 border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Community Driven</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Built by students, for students, with love from the entire NCS family.
                  </p>
                </div>
              </div>

              <Button asChild size="lg" className="h-14 px-8 font-semibold">
                <Link to="/about">
                  Learn More About Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background via-secondary/20 to-background">
        <div className="container">
          {/* Section Header */}
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium tracking-wide mb-6">
              Featured Galleries
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="text-primary">Relive Your</span>
              <br />
              <span className="text-gradient italic">Precious Memories</span>
            </h2>
          </div>

          {/* Collections grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collectionsLoading ? (
              Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
              ))
            ) : featuredCollections && featuredCollections.length > 0 ? (
              featuredCollections.slice(0, 6).map((collection, i) => (
                <Link
                  key={collection.id}
                  to={`/collection/${collection.id}`}
                  className="group relative aspect-[4/3] rounded-2xl bg-secondary overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {collection.cover_image_url ? (
                    <img
                      src={collection.cover_image_url}
                      alt={collection.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                      <Camera className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    {collection.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {collection.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-block px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm"
                            style={{ backgroundColor: `${tag.color}cc`, color: '#fff' }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="font-display text-xl md:text-2xl font-semibold text-white mb-1">
                      {collection.title}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {collection.photo_count} photos
                      {collection.event_date && ` • ${new Date(collection.event_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-16 bg-card rounded-2xl border border-border">
                <Camera className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-lg text-muted-foreground">No featured collections yet.</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Add collections and mark them as featured in the admin dashboard.
                </p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" asChild size="lg" className="h-14 px-8 gap-2 font-semibold">
              <Link to="/memories">
                View All Collections
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: stats?.photos ?? '—', label: 'Photos Preserved' },
              { value: stats?.collections ?? '—', label: 'Collections' },
              { value: stats?.events ?? '—', label: 'Event Types' },
              { value: stats?.branches ?? '—', label: 'Branches' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                {statsLoading ? (
                  <Skeleton className="h-12 w-20 mx-auto mb-2 bg-primary-foreground/20" />
                ) : (
                  <p className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                )}
                <p className="text-primary-foreground/70 mt-2 text-sm md:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
