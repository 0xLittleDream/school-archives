import { Layout } from '@/components/layout/Layout';
import { Camera } from 'lucide-react';

const Farewell2025 = () => {
  return (
    <Layout>
      <div className="container py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Class of 2025
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
            Farewell 2025
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Celebrating the journey of our graduating class. Memories that will last a lifetime.
          </p>
        </div>

        {/* Gallery placeholder */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={`relative rounded-lg bg-secondary overflow-hidden shadow-elegant group cursor-pointer ${
                i === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              style={{ aspectRatio: i === 0 ? '1' : '1' }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Farewell2025;
