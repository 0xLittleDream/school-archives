import { Heart } from 'lucide-react';
import type { PageSection, QuoteMetadata } from '@/types/pageBuilder';

interface QuoteSectionProps {
  section: PageSection;
}

export function QuoteSection({ section }: QuoteSectionProps) {
  const metadata = (section.metadata || {}) as QuoteMetadata;

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <Heart className="h-12 w-12 text-accent mx-auto mb-6 animate-pulse" />
          
          {section.title && (
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              {section.title}
            </h2>
          )}
          
          {section.content && (
            <blockquote className="text-xl md:text-2xl text-muted-foreground italic leading-relaxed mb-8">
              "{section.content}"
            </blockquote>
          )}
          
          {metadata.attribution && (
            <p className="text-muted-foreground">
              — {metadata.attribution}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
