import { Layout } from '@/components/layout/Layout';
import { Heart, Users, Camera, Award, Sparkles, BookOpen, Globe, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
const About = () => {
  return <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide mb-8">
              <BookOpen className="h-4 w-4" />
              About NcsMemories
            </span>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Preserving Memories.
              <br />
              <span className="text-gradient italic">Celebrating Journeys.</span>
            </h1>
            
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              NcsMemories is a digital sanctuary dedicated to preserving the cherished moments, 
              shared experiences, and timeless stories of our school community. Every photograph 
              holds a memory; every collection tells a story worth remembering.
            </p>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Our Purpose Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-[1fr,2fr] gap-8 md:gap-16 items-start">
              <div>
                <span className="inline-block text-primary font-medium tracking-wide text-sm uppercase mb-2">
                  Our Purpose
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Why We Exist
                </h2>
              </div>
              <div>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Schools are more than buildings — they are the birthplaces of friendships, 
                  dreams, and defining moments. Yet, as years pass, memories fade, photographs 
                  scatter, and stories are forgotten.
                </p>
                <p className="text-foreground text-lg leading-relaxed font-medium">
                  NcsMemories exists to safeguard these precious moments. We believe that every 
                  annual day performance, every sports victory, every farewell tear, and every 
                  classroom laughter deserves a permanent home — a place where they remain 
                  accessible, appreciated, and alive for generations to come.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* Mission Card */}
            <div className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Heart className="h-7 w-7 text-primary" />
                </div>
                
                <span className="text-primary font-medium tracking-wide text-sm uppercase">
                  Our Mission
                </span>
                
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-2 mb-4">
                  Building a Digital Legacy
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  To create a lasting digital legacy that bridges generations — connecting 
                  the alumni who walked these halls before, the students who walk them today, 
                  and those who will walk them tomorrow. We preserve not just photographs, 
                  but the spirit, joy, and essence of our shared school experience.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-accent/5 via-background to-primary/5 border border-border overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <Sparkles className="h-7 w-7 text-accent" />
                </div>
                
                <span className="text-accent font-medium tracking-wide text-sm uppercase">
                  Our Vision
                </span>
                
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-2 mb-4">
                  The Official Archive
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  To become the definitive digital archive for our entire school network — 
                  a trusted repository where alumni revisit their golden years with nostalgia, 
                  and current students witness the rich legacy they are now part of. An archive 
                  that grows with every passing year, every graduating batch, every new memory made.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Special */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-primary font-medium tracking-wide text-sm uppercase mb-3">
              What Sets Us Apart
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              What Makes NcsMemories Special
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[{
            icon: Users,
            title: 'Community-Driven',
            description: 'Built with care by students, for the entire school community.',
            gradient: 'from-blue-500/10 to-indigo-500/10'
          }, {
            icon: Globe,
            title: 'Multi-Branch Support',
            description: 'Dedicated spaces for each school campus, preserving their unique stories.',
            gradient: 'from-purple-500/10 to-pink-500/10'
          }, {
            icon: Camera,
            title: 'Curated Collections',
            description: 'Memories organized by events, years, and categories for effortless discovery.',
            gradient: 'from-amber-500/10 to-orange-500/10'
          }, {
            icon: Award,
            title: 'Preserved with Quality',
            description: 'High-quality visuals maintained to keep moments vivid for years to come.',
            gradient: 'from-emerald-500/10 to-teal-500/10'
          }].map((feature, i) => <div key={i} className="group relative p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-elegant-lg transition-all duration-300">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Gratitude Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-card to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-8">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              With Gratitude
            </h2>
            
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              NcsMemories would not exist without the countless contributions from our community. 
              To every student who shared a photograph, every teacher who encouraged this endeavor, 
              and every alumni who trusted us with their memories — we extend our heartfelt gratitude.
            </p>
            
            <p className="text-foreground font-medium text-lg italic">
              "Together, we are not just preserving photos — we are preserving the soul of our school."
            </p>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="container">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Creator Credit */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-md mx-auto text-center">
            <p className="text-muted-foreground text-sm mb-3 tracking-wide">
              Crafted with dedication by
            </p>
            <a href="https://www.instagram.com/dr3am8r" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 transition-all duration-300 group">
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                @dr3am8r
              </span>
            </a>
            <p className="text-muted-foreground text-sm mt-3 tracking-wide">from Class 11th (as of 2025) NCSV</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Ready to Explore Our Archive?
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Discover the memories that define our community.
            </p>
            <Button asChild size="lg" variant="secondary" className="h-14 px-8 font-semibold rounded-xl">
              <Link to="/memories">
                <Camera className="w-5 h-5 mr-2" />
                Browse Collections
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>;
};
export default About;