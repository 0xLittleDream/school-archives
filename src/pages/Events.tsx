import { Layout } from '@/components/layout/Layout';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockEvents = [
  {
    id: 1,
    title: 'Annual Day 2025',
    date: 'March 2025',
    location: 'School Auditorium',
    description: 'Celebrating talent and achievements of our students.',
  },
  {
    id: 2,
    title: 'Sports Day 2025',
    date: 'February 2025',
    location: 'Sports Ground',
    description: 'A day of athletic excellence and team spirit.',
  },
  {
    id: 3,
    title: 'Cultural Fest 2024',
    date: 'November 2024',
    location: 'School Campus',
    description: 'Showcasing diverse cultures through art and performance.',
  },
];

const Events = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Events
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            A chronicle of our school's memorable events
          </p>
        </div>

        {/* Events list */}
        <div className="space-y-6">
          {mockEvents.map((event) => (
            <div
              key={event.id}
              className="group p-6 rounded-xl bg-card border border-border shadow-elegant hover:shadow-elegant-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-semibold text-foreground group-hover:text-accent transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground mt-2">{event.description}</p>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/memories`}
                  className="flex items-center gap-1 text-accent hover:underline font-medium"
                >
                  View Photos <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Events;
