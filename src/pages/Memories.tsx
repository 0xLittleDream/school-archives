import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCollections, useTags } from '@/hooks/useDatabase';
import { Skeleton } from '@/components/ui/skeleton';
import { Camera } from 'lucide-react';

const Memories = () => {
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const { data: tags, isLoading: tagsLoading } = useTags();
  const { data: collections, isLoading: collectionsLoading } = useCollections(undefined, selectedTagId || undefined);

  return (
    <Layout>
      <div className="container py-12">
        <div className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Memories
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Browse through our collection of cherished moments
          </p>
        </div>

        {/* Filter tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedTagId(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTagId === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            All
          </button>
          {tagsLoading ? (
            Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full" />
            ))
          ) : (
            tags?.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTagId(tag.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTagId === tag.id
                    ? 'text-white'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
                style={selectedTagId === tag.id ? { backgroundColor: tag.color } : undefined}
              >
                {tag.name}
              </button>
            ))
          )}
        </div>

        {/* Collections grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collectionsLoading ? (
            Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
            ))
          ) : collections && collections.length > 0 ? (
            collections.map((collection, i) => (
              <Link
                key={collection.id}
                to={`/collection/${collection.id}`}
                className="group relative aspect-[4/3] rounded-xl bg-secondary overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
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
                      {collection.tags.slice(0, 3).map((tag) => (
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
            <div className="col-span-full text-center py-16">
              <Camera className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-lg text-muted-foreground">No collections found.</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                {selectedTagId ? 'Try selecting a different tag.' : 'Collections will appear here once added.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Memories;
