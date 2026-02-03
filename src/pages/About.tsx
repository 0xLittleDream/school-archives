import { Layout } from '@/components/layout/Layout';
import { Heart, Users, Camera, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide mb-6">
              About Us
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-6">
              Preserving Memories,
              <br />
              <span className="text-gradient italic">Celebrating Journeys</span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed">
              NcsMemories is a digital sanctuary dedicated to preserving the cherished moments 
              of our school community. Every photo tells a story worth remembering.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To create a lasting digital legacy that connects past, present, and future 
                generations of our school community. We believe every moment deserves to be 
                preserved, every smile captured, and every milestone celebrated.
              </p>
            </div>
            
            <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-accent/5 to-primary/5 border border-border">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <Camera className="h-7 w-7 text-accent" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Our Vision
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To become the definitive digital archive for our school network, a place 
                where alumni can revisit their golden years and current students can see 
                the rich legacy they're part of.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              What Makes Us Special
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built with love by the community, for the community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Multi-Branch Support',
                description: 'Serving multiple school campuses across the country, each with their unique collection of memories.',
              },
              {
                icon: Camera,
                title: 'Curated Collections',
                description: 'Organized photo galleries by event, year, and category for easy browsing and discovery.',
              },
              {
                icon: Award,
                title: 'Premium Quality',
                description: 'High-resolution photos preserved with care, ensuring memories stay vivid for generations.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-card border border-border text-center hover:shadow-elegant-lg transition-shadow animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Made with ♥ by the NCS Community
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              This project was created to preserve the beautiful memories of our school. 
              Special thanks to everyone who contributed their photos and stories.
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm">
              <span className="text-sm">Crafted by</span>
              <span className="font-semibold">@dr3am8r</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Explore?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Dive into our collection of memories and relive the moments that made our school special.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-14 px-8">
                <Link to="/memories">
                  Browse Collections
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8">
                <Link to="/events">
                  View Events
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
