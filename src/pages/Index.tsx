import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Camera, Calendar, ArrowRight } from 'lucide-react';

const Index = () => {
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

      {/* Featured Collections Placeholder */}
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

          {/* Placeholder grid for collections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="group relative aspect-[4/3] rounded-xl bg-secondary overflow-hidden shadow-elegant animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-accent text-accent-foreground rounded mb-2">
                    Coming Soon
                  </span>
                  <h3 className="font-display text-xl font-semibold text-white">
                    Collection {i}
                  </h3>
                  <p className="text-white/70 text-sm mt-1">
                    Connect your Supabase database to see real collections
                  </p>
                </div>
              </div>
            ))}
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
              { value: '—', label: 'Photos' },
              { value: '—', label: 'Collections' },
              { value: '—', label: 'Events' },
              { value: '—', label: 'Branches' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-display text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </p>
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
