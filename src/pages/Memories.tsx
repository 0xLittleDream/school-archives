import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCollections, useTags } from '@/hooks/useDatabase';
import { useBranch } from '@/contexts/BranchContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Camera, Filter, Search, Grid3X3, LayoutGrid, Sparkles, Play, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { YearFilter } from '@/components/YearFilter';

const Memories = () => {
  const { selectedBranch, selectedBranchId } = useBranch();
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const { data: tags, isLoading: tagsLoading } = useTags();
  const { data: collections, isLoading: collectionsLoading } = useCollections(
    selectedBranchId || undefined, 
    selectedTagId || undefined
  );

  // Extract available years from collections
  const availableYears = useMemo(() => {
    if (!collections) return [];
    const years = new Set<number>();
    collections.forEach(collection => {
      if (collection.event_date) {
        const year = new Date(collection.event_date).getFullYear();
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [collections]);

  // Filter by search query and year
  const filteredCollections = useMemo(() => {
    let filtered = collections?.filter(collection => 
      collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (selectedYear && filtered) {
      filtered = filtered.filter(collection => {
        if (!collection.event_date) return false;
        const eventYear = new Date(collection.event_date).getFullYear();
        return eventYear.toString() === selectedYear;
      });
    }
    
    return filtered;
  }, [collections, searchQuery, selectedYear]);

  return (
    <Layout>
      {/* Hero Header - Mobile Optimized */}
      <section className="relative py-12 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide mb-6">
              <Sparkles className="h-4 w-4" />
              {selectedBranch?.name || 'All Branches'} • Photo Gallery
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Memory Collections
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Explore our curated galleries of cherished moments, celebrations, and milestones 
              from {selectedBranch?.name || 'across the NCS community'}.
            </p>
          </div>
        </div>
      </section>

      <div className="container pb-16">
        {/* Filters Bar - Sticky and Mobile Friendly */}
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm py-4 mb-6 -mx-4 px-4 md:mx-0 md:px-0 border-b border-border">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 rounded-xl"
              />
            </div>

            {/* Year Filter + View Toggle */}
            <div className="flex items-center gap-3 justify-end">
              <YearFilter 
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
                availableYears={availableYears}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground mr-2 hidden sm:inline">View:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-colors ${
                    viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`p-3 rounded-xl transition-colors ${
                    viewMode === 'masonry' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter tags - Horizontally scrollable on mobile */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <button
            onClick={() => setSelectedTagId(null)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              selectedTagId === null
                ? 'bg-primary text-primary-foreground shadow-elegant'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            All Collections
          </button>
          {tagsLoading ? (
            Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-xl flex-shrink-0" />
            ))
          ) : (
            tags?.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTagId(tag.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  selectedTagId === tag.id
                    ? 'text-white shadow-elegant'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
                style={selectedTagId === tag.id ? { backgroundColor: tag.color } : undefined}
              >
                {tag.name}
              </button>
            ))
          )}
        </div>

        {/* Results count */}
        {!collectionsLoading && filteredCollections && (
          <p className="text-sm text-muted-foreground mb-6">
            {filteredCollections.length} collection{filteredCollections.length !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Collections grid - Enhanced mobile layout */}
        <div className={`grid gap-5 md:gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`}>
          {collectionsLoading ? (
            Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className={`rounded-2xl ${viewMode === 'masonry' ? 'aspect-[3/4]' : 'aspect-[4/3]'}`} />
            ))
          ) : filteredCollections && filteredCollections.length > 0 ? (
            filteredCollections.map((collection, i) => (
              <Link
                key={collection.id}
                to={`/collection/${collection.id}`}
                className={`group relative rounded-2xl bg-card overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all duration-300 animate-fade-in border border-border ${
                  viewMode === 'masonry' && i % 3 === 0 ? 'row-span-2' : ''
                }`}
                style={{ 
                  animationDelay: `${i * 50}ms`,
                  aspectRatio: viewMode === 'masonry' 
                    ? (i % 3 === 0 ? '3/4' : '1/1') 
                    : '4/3'
                }}
              >
                {collection.cover_image_url ? (
                  <img
                    src={collection.cover_image_url}
                    alt={collection.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary to-secondary/50">
                    <Camera className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                
                {/* Play indicator */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-4 w-4 text-white fill-white" />
                </div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  {collection.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2 md:mb-3">
                      {collection.tags.slice(0, viewMode === 'masonry' ? 2 : 3).map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-block px-2 py-0.5 md:px-2.5 md:py-1 text-[10px] md:text-xs font-semibold rounded-full backdrop-blur-sm"
                          style={{ backgroundColor: `${tag.color}dd`, color: '#fff' }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <h3 className="font-display text-base md:text-xl font-semibold text-white mb-1 line-clamp-2">
                    {collection.title}
                  </h3>
                  <p className="text-white/70 text-xs md:text-sm flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Camera className="h-3 w-3" />
                      Photos
                    </span>
                    {collection.event_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(collection.event_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-card rounded-2xl border border-border">
              <Camera className="h-20 w-20 mx-auto text-muted-foreground/20 mb-6" />
              <h3 className="font-display text-2xl font-semibold text-foreground mb-2">No collections found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchQuery 
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : selectedTagId 
                    ? 'No collections with this tag yet.'
                    : `No collections for ${selectedBranch?.name || 'this branch'} yet.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Memories;
