import { Layout } from '@/components/layout/Layout';

const Memories = () => {
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

        {/* Filter tags placeholder */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', 'Farewell', 'Annual Day', 'Cultural Events', 'Sports', 'Achievements'].map((tag) => (
            <button
              key={tag}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                tag === 'All'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Collections grid placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="group relative aspect-[4/3] rounded-xl bg-secondary overflow-hidden shadow-elegant cursor-pointer hover:shadow-elegant-lg transition-shadow"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex gap-2 mb-2">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-accent/90 text-accent-foreground rounded">
                    Tag
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-white">
                  Collection Title
                </h3>
                <p className="text-white/70 text-sm mt-1">
                  0 photos • Coming soon
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Memories;
