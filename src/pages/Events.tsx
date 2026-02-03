import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Calendar, MapPin, ArrowRight, Sparkles, Camera, Tag, Clock, ChevronDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTags, useCollections } from '@/hooks/useDatabase';
import { useBranch } from '@/contexts/BranchContext';
import { Skeleton } from '@/components/ui/skeleton';

const Events = () => {
  const { selectedBranch, selectedBranchId } = useBranch();
  const { data: tags, isLoading: tagsLoading } = useTags();
  const { data: collections, isLoading: collectionsLoading } = useCollections(selectedBranchId || undefined);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Group collections by tags to create "events"
  const eventsByTag = tags?.map(tag => {
    const tagCollections = collections?.filter(c => 
      c.tags.some(t => t.id === tag.id) &&
      (searchQuery === '' || c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];
    return {
      tag,
      collections: tagCollections,
    };
  }).filter(e => e.collections.length > 0) || [];

  const filteredEvents = selectedTag 
    ? eventsByTag.filter(e => e.tag.id === selectedTag)
    : eventsByTag;

  return (
    <Layout>
      {/* Hero Header - Mobile Optimized */}
      <section className="relative py-12 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
        <div className="container relative">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium tracking-wide mb-6">
              <Sparkles className="w-4 h-4" />
              {selectedBranch?.name || 'All Branches'} Events
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              School Events
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Explore our memorable celebrations, competitions, and gatherings organized throughout the year.
            </p>
          </div>
        </div>
      </section>

      <div className="container pb-16">
        {/* Search & Filter Bar */}
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm py-4 mb-8 -mx-4 px-4 md:mx-0 md:px-0 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Event Tags Filter */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              selectedTag === null
                ? 'bg-primary text-primary-foreground shadow-elegant'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            All Events
          </button>
          {tagsLoading ? (
            Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-xl flex-shrink-0" />
            ))
          ) : (
            tags?.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  selectedTag === tag.id
                    ? 'text-white shadow-elegant'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
                style={selectedTag === tag.id ? { backgroundColor: tag.color } : undefined}
              >
                {tag.name}
              </button>
            ))
          )}
        </div>

        {/* Events by Category */}
        {collectionsLoading ? (
          <div className="space-y-8">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Skeleton className="aspect-[4/3] rounded-2xl" />
                  <Skeleton className="aspect-[4/3] rounded-2xl" />
                  <Skeleton className="aspect-[4/3] rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="space-y-12">
            {filteredEvents.map((event, eventIndex) => (
              <div key={event.tag.id} className="animate-fade-in" style={{ animationDelay: `${eventIndex * 100}ms` }}>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: event.tag.color }}
                  />
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {event.tag.name}
                  </h2>
                  <span className="text-muted-foreground text-sm">
                    ({event.collections.length} collection{event.collections.length !== 1 ? 's' : ''})
                  </span>
                </div>

                {/* Collections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                  {event.collections.map((collection, i) => (
                    <Link
                      key={collection.id}
                      to={`/collection/${collection.id}`}
                      className="group relative bg-card rounded-2xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all duration-300 border border-border card-hover"
                    >
                      {/* Image */}
                      <div className="relative h-44 md:h-52 overflow-hidden">
                        {collection.cover_image_url ? (
                          <img
                            src={collection.cover_image_url}
                            alt={collection.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                            <Camera className="h-12 w-12 text-muted-foreground/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                        
                        {/* Photo count badge */}
                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1.5">
                          <Camera className="h-3.5 w-3.5" />
                          {collection.photo_count}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-display text-lg md:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                          {collection.title}
                        </h3>
                        
                        {collection.description && (
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {collection.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          {collection.event_date && (
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4 text-primary" />
                              {new Date(collection.event_date).toLocaleDateString('en-US', { 
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          )}
                          {collection.branch && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-primary" />
                              {collection.branch.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-2xl border border-border">
            <Calendar className="h-20 w-20 mx-auto text-muted-foreground/20 mb-6" />
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              {searchQuery 
                ? `No results for "${searchQuery}". Try a different search term.`
                : 'No events have been tagged yet. Add tags to collections in the admin dashboard.'}
            </p>
            <Button asChild variant="outline">
              <Link to="/memories">
                Browse All Memories
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-3xl p-8 md:p-12 border border-border">
          <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-4">
            Have Photos to Share?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-xl mx-auto">
            Help us preserve more memories. Contribute your photos from school events.
          </p>
          <Button asChild size="lg" className="h-14 px-8 rounded-xl">
            <Link to="/admin">
              Go to Admin Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Events;
