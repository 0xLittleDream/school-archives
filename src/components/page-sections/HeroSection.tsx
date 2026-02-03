import { Calendar, MapPin } from 'lucide-react';
import type { PageSection, HeroMetadata } from '@/types/pageBuilder';

interface HeroSectionProps {
  section: PageSection;
  branchName?: string;
}

export function HeroSection({ section }: HeroSectionProps) {
  const metadata = (section.metadata || {}) as HeroMetadata;

  return (
    <section className="relative py-16 md:py-28 overflow-hidden">
      {/* Background Image */}
      {section.image_url && (
        <div className="absolute inset-0">
          <img 
            src={section.image_url} 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        </div>
      )}
      
      {/* Animated Background (when no image) */}
      {!section.image_url && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/5 to-accent/10" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </>
      )}
      
      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          {metadata.badge_text && (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 mb-8 animate-fade-in">
              <span className="text-sm font-semibold tracking-wide text-accent">
                {metadata.badge_text}
              </span>
            </div>
          )}

          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            {section.title}
            {metadata.title_line2 && (
              <>
                <br />
                <span className="text-gradient italic">{metadata.title_line2}</span>
              </>
            )}
          </h1>
          
          {section.subtitle && (
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
              {section.subtitle}
            </p>
          )}

          {/* Event Details */}
          {(metadata.event_date || metadata.event_location) && (
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '300ms' }}>
              {metadata.event_date && (
                <span className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border shadow-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  {metadata.event_date}
                </span>
              )}
              {metadata.event_location && (
                <span className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border shadow-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  {metadata.event_location}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
