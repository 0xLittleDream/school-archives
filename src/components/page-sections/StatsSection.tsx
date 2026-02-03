import type { PageSection, StatsMetadata } from '@/types/pageBuilder';

interface StatsSectionProps {
  section: PageSection;
}

export function StatsSection({ section }: StatsSectionProps) {
  const metadata = (section.metadata || {}) as StatsMetadata;
  const stats = metadata.stats || [];

  if (stats.length === 0) return null;

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container">
        {section.title && (
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">
            {section.title}
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.slice(0, 4).map((stat, i) => (
            <div 
              key={i} 
              className="text-center animate-fade-in" 
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <p className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {stat.value}
              </p>
              <p className="text-primary-foreground/70 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
