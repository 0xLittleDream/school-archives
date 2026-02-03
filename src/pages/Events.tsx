import { Layout } from '@/components/layout/Layout';
import { Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const mockEvents = [
  {
    id: 1,
    title: 'Annual Day 2025',
    date: 'March 2025',
    location: 'School Auditorium',
    description: 'Celebrating talent and achievements of our students with performances and awards.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600',
    category: 'Cultural',
  },
  {
    id: 2,
    title: 'Sports Day 2025',
    date: 'February 2025',
    location: 'Sports Ground',
    description: 'A day of athletic excellence, team spirit, and friendly competition.',
    image: 'https://images.unsplash.com/photo-1461896836934- voices-of-passion?q=80&w=600',
    category: 'Sports',
  },
  {
    id: 3,
    title: 'Cultural Fest 2024',
    date: 'November 2024',
    location: 'School Campus',
    description: 'Showcasing diverse cultures through art, music, dance, and theatrical performances.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600',
    category: 'Cultural',
  },
  {
    id: 4,
    title: 'Science Exhibition 2024',
    date: 'October 2024',
    location: 'Science Labs',
    description: 'Students showcase innovative projects and experiments in science and technology.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600',
    category: 'Academic',
  },
];

const Events = () => {
  return (
    <Layout>
      {/* Hero Header */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
        <div className="container relative">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium tracking-wide mb-6">
              <Sparkles className="w-4 h-4 inline mr-1.5" />
              School Events
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-4">
              Memorable Events
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed">
              A chronicle of our school's most memorable celebrations, competitions, and gatherings.
            </p>
          </div>
        </div>
      </section>

      <div className="container pb-16">
        {/* Events grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {mockEvents.map((event, i) => (
            <article
              key={event.id}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all duration-300 border border-border animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                  {event.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {event.description}
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" />
                    {event.location}
                  </span>
                </div>

                <Button asChild variant="outline" className="gap-2">
                  <Link to="/memories">
                    View Photos
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-2xl p-12 border border-border">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Have Photos to Share?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Help us preserve more memories. Contribute your photos from school events.
          </p>
          <Button asChild size="lg" className="h-14 px-8">
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
