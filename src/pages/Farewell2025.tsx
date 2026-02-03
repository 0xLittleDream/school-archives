import { Layout } from '@/components/layout/Layout';
import { Camera, Heart, GraduationCap, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useBranch } from '@/contexts/BranchContext';

const Farewell2025 = () => {
  const { selectedBranch } = useBranch();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/5 to-accent/10" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/20 mb-8">
              <GraduationCap className="w-5 h-5 text-accent" />
              <span className="text-sm font-semibold tracking-wide text-accent">
                Class of 2025
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6">
              Farewell
              <br />
              <span className="text-gradient italic">2025</span>
            </h1>
            
            <p className="text-muted-foreground text-xl leading-relaxed mb-8 max-w-xl mx-auto">
              Celebrating the journey of our graduating class at {selectedBranch?.name || 'NCS'}. 
              Memories that will last a lifetime, friendships that will never fade.
            </p>

            {/* Event Details */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-10">
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
                <Calendar className="h-4 w-4 text-primary" />
                Coming Soon
              </span>
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
                <MapPin className="h-4 w-4 text-primary" />
                {selectedBranch?.name || 'NCS Campus'}
              </span>
            </div>

            <Button asChild size="lg" className="h-14 px-8 gap-2">
              <Link to="/memories">
                <Camera className="w-5 h-5" />
                View All Memories
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Photo Gallery
            </h2>
            <p className="text-muted-foreground">
              Photos will be uploaded after the farewell event
            </p>
          </div>

          {/* Placeholder Gallery Grid */}
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
                  <Camera className="h-10 w-10 text-muted-foreground/30 mb-2" />
                  <span className="text-xs text-muted-foreground/50 text-center">
                    Coming Soon
                  </span>
                </div>
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Message Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Heart className="h-12 w-12 text-accent mx-auto mb-6" />
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
              { value: '∞', label: 'Memories Made' },
              { value: '1', label: 'Amazing Batch' },
              { value: '♥', label: 'Endless Love' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-display text-5xl md:text-6xl font-bold tracking-tight">
                  {stat.value}
                </p>
                <p className="text-primary-foreground/70 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Farewell2025;
