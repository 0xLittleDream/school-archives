import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Camera, ArrowRight, Heart, Users, Sparkles, GraduationCap, Star, Play } from 'lucide-react';
import { useFeaturedCollections, useStats } from '@/hooks/useDatabase';
import { useBranch } from '@/contexts/BranchContext';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageGallerySection } from '@/components/home/ImageGallerySection';
import schoolMemoriesHero from '@/assets/school-memories-hero.jpg';
import schoolEvent from '@/assets/school-event.jpg';
import navyChildrenSchool from '@/assets/navy-children-school.jpg';
import navyShipVisit from '@/assets/navy-ship-visit.jpg';
import navyDayArt1 from '@/assets/navy-day-art-1.jpg';
import navyDayArt2 from '@/assets/navy-day-art-2.jpg';
import schoolDancePerformances from '@/assets/school-dance-performances.jpg';
import independenceDayCelebrations from '@/assets/independence-day-celebrations.jpg';
const Index = () => {
  const {
    selectedBranch,
    selectedBranchId
  } = useBranch();
  const {
    data: featuredCollections,
    isLoading: collectionsLoading
  } = useFeaturedCollections(selectedBranchId || undefined);
  const {
    data: stats,
    isLoading: statsLoading
  } = useStats(selectedBranchId || undefined);
  return <Layout>
      {/* Hero Section - Premium Mobile-First Design */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-20 pb-12 md:pt-0 md:pb-0">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-background" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-accent/10 to-primary/5 blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-primary/10 to-transparent blur-3xl -translate-x-1/3 translate-y-1/3" />
        
        {/* Floating elements - hidden on mobile */}
        <div className="absolute top-1/4 left-[10%] w-20 h-20 rounded-2xl bg-accent/10 rotate-12 hidden lg:block animate-fade-in" style={{
        animationDelay: '600ms'
      }} />
        <div className="absolute bottom-1/4 right-[15%] w-16 h-16 rounded-full bg-primary/10 hidden lg:block animate-fade-in" style={{
        animationDelay: '800ms'
      }} />
        
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="animate-fade-in text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-6 md:mb-8">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span className="text-sm font-medium tracking-wide text-foreground">
                  {selectedBranch ? selectedBranch.name : 'Official School Archive'}
                </span>
              </div>

              {/* Title - Larger on mobile */}
              <h1 className="font-display text-[3.25rem] leading-[1.1] md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 md:mb-8">
                <span className="text-primary block">NCS</span>
                <span className="text-gradient italic">Memories</span>
              </h1>

              {/* Description - Mobile optimized */}
              <p className="text-base md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 md:mb-10 leading-relaxed px-2 md:px-0">
                Preserving precious moments. Celebrating extraordinary journeys. A digital archive 
                crafted with love for the {selectedBranch?.name || 'NCS'} community.
              </p>

              {/* CTA Buttons - Stacked on mobile */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="h-14 px-8 text-base font-semibold tracking-wide shadow-elegant-lg hover:shadow-elegant transition-shadow rounded-xl">
                  <Link to="/memories">
                    <Camera className="w-5 h-5 mr-2" />
                    Explore Collections
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base font-semibold tracking-wide rounded-xl">
                  <Link to="/farewell-2025">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Farewell 2025
                  </Link>
                </Button>
              </div>

              {/* Quick stats for mobile */}
              <div className="flex justify-center lg:justify-start gap-8 mt-10 pt-10 border-t border-border lg:hidden">
                {[{
                value: stats?.photos ?? '—',
                label: 'Photos'
              }, {
                value: stats?.collections ?? '—',
                label: 'Collections'
              }, {
                value: stats?.branches ?? '—',
                label: 'Branches'
              }].map((stat, i) => <div key={i} className="text-center">
                    <p className="font-display text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>)}
              </div>
            </div>

            {/* Right - Hero Image Grid - Desktop only */}
            <div className="relative animate-fade-in hidden lg:block" style={{
            animationDelay: '200ms'
          }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-elegant-lg bg-secondary aspect-[3/4] card-hover">
                    <img alt="Independence Day Celebrations" className="w-full h-full object-cover object-center" src={independenceDayCelebrations} />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-elegant-lg bg-secondary aspect-square card-hover">
                    <img src={schoolDancePerformances} alt="School Dance Performances" className="w-full h-full object-cover object-top" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-elegant-lg bg-secondary aspect-square card-hover">
                    <img src={schoolEvent} alt="School Event" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-elegant-lg bg-secondary aspect-[3/4] card-hover">
                    <img src={navyShipVisit} alt="Navy Ship Visit" className="w-full h-full object-cover object-bottom" />
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

        {/* Scroll indicator - mobile only */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:hidden animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* About Section - Enhanced Mobile */}
      <section className="py-16 md:py-28 bg-card">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Left - Image */}
            <div className="relative animate-fade-in order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-elegant-lg bg-secondary aspect-[4/5] flex flex-col">
                <img src={navyDayArt1} alt="Navy Day Student Art 1" className="w-full h-1/2 object-cover" />
                <img src={navyDayArt2} alt="Navy Day Student Art 2" className="w-full h-1/2 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none" />
              </div>
              
              {/* Quote Card */}
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:right-8 max-w-[280px] md:max-w-xs bg-background/95 backdrop-blur-sm rounded-2xl p-5 md:p-6 shadow-elegant-lg border border-border">
                <blockquote className="font-display text-base md:text-lg italic text-primary leading-relaxed">
                  "Every photo holds a story, every memory deserves to live forever."
                </blockquote>
              </div>
            </div>

            {/* Right - Content */}
            <div className="order-1 lg:order-2 animate-fade-in" style={{
            animationDelay: '200ms'
          }}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide mb-6">
                About {selectedBranch?.name || 'NCS Memories'}
              </span>
              
              <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-6">
                <span className="text-foreground">A Platform Built</span>
                <br />
                <span className="text-gradient italic">With Love & Care</span>
              </h2>

              <p className="text-muted-foreground text-base md:text-lg mb-8 md:mb-10 leading-relaxed">
                NCS Memories is more than a photo archive. It's a digital sanctuary preserving 
                the spirit, laughter, and milestones of our school community for generations to come.
              </p>

              {/* Features - Mobile optimized grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
                <div className="p-5 rounded-2xl bg-secondary/50 border border-border card-hover">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">For Every Batch</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A permanent home for memories from all years, ensuring no moment is forgotten.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-secondary/50 border border-border card-hover">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Community Driven</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Built by students, for students, with love from the entire NCS family.
                  </p>
                </div>
              </div>

              <Button asChild size="lg" className="h-14 px-8 font-semibold rounded-xl w-full sm:w-auto">
                <Link to="/about">
                  Learn More About Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections - Enhanced */}
      <section className="py-16 md:py-28 bg-gradient-to-b from-background via-secondary/20 to-background">
        <div className="container">
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium tracking-wide mb-6">
              <Sparkles className="h-4 w-4" />
              Featured Galleries
            </span>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold">
              <span className="text-primary">Relive Your</span>
              <br className="md:hidden" />
              <span className="md:ml-3 text-gradient italic">Precious Memories</span>
            </h2>
          </div>

          {/* Collections grid - Better mobile layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {collectionsLoading ? Array.from({
            length: 3
          }, (_, i) => <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />) : featuredCollections && featuredCollections.length > 0 ? featuredCollections.slice(0, 6).map((collection, i) => <Link key={collection.id} to={`/collection/${collection.id}`} className={`group relative rounded-2xl bg-secondary overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all duration-300 animate-fade-in stagger-${i + 1}`} style={{
            aspectRatio: i === 0 ? '4/5' : '4/3'
          }}>
                  {collection.cover_image_url ? <img src={collection.cover_image_url} alt={collection.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                      <Camera className="h-16 w-16 text-muted-foreground/30" />
                    </div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    {collection.tags.length > 0 && <div className="flex flex-wrap gap-2 mb-3">
                        {collection.tags.slice(0, 2).map(tag => <span key={tag.id} className="inline-block px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm" style={{
                  backgroundColor: `${tag.color}cc`,
                  color: '#fff'
                }}>
                            {tag.name}
                          </span>)}
                      </div>}
                    <h3 className="font-display text-lg md:text-2xl font-semibold text-white mb-1">
                      {collection.title}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {collection.photo_count} photos
                      {collection.event_date && ` • ${new Date(collection.event_date).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric'
                })}`}
                    </p>
                  </div>
                  
                  {/* Play/View indicator */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-5 w-5 text-white fill-white" />
                  </div>
                </Link>) : <div className="col-span-full text-center py-16 bg-card rounded-2xl border border-border">
                <Camera className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-lg text-muted-foreground">No featured collections yet.</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Add collections and mark them as featured in the admin dashboard.
                </p>
              </div>}
          </div>

          <div className="text-center mt-10 md:mt-12">
            <Button variant="outline" asChild size="lg" className="h-14 px-8 gap-2 font-semibold rounded-xl">
              <Link to="/memories">
                View All Collections
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <ImageGallerySection />

      {/* Stats Section - Enhanced Mobile */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            {[{
            value: stats?.photos ?? '—',
            label: 'Photos Preserved'
          }, {
            value: stats?.collections ?? '—',
            label: 'Collections'
          }, {
            value: stats?.events ?? '—',
            label: 'Event Types'
          }, {
            value: stats?.branches ?? '—',
            label: 'Branches'
          }].map((stat, i) => <div key={i} className="text-center">
                {statsLoading ? <Skeleton className="h-10 md:h-12 w-16 md:w-20 mx-auto mb-2 bg-primary-foreground/20" /> : <p className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    {stat.value}
                  </p>}
                <p className="text-primary-foreground/70 mt-1 md:mt-2 text-xs md:text-base">{stat.label}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-secondary via-background to-secondary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Ready to Explore?
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
              Dive into our collection of cherished memories and relive the beautiful moments 
              that make our school community special.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-14 px-8 font-semibold rounded-xl">
                <Link to="/memories">
                  <Camera className="w-5 h-5 mr-2" />
                  Browse Memories
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 font-semibold rounded-xl">
                <Link to="/events">
                  View Events
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>;
};
export default Index;