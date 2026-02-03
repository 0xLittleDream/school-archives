import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PageSection, CTAMetadata } from '@/types/pageBuilder';

interface CTASectionProps {
  section: PageSection;
}

export function CTASection({ section }: CTASectionProps) {
  const metadata = (section.metadata || {}) as CTAMetadata;

  if (!metadata.button_text || !metadata.button_url) return null;

  const buttonVariant = metadata.variant === 'outline' 
    ? 'outline' 
    : metadata.variant === 'secondary' 
    ? 'secondary' 
    : 'default';

  const isExternal = metadata.button_url.startsWith('http');

  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          {section.title && (
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              {section.title}
            </h2>
          )}
          
          {section.content && (
            <p className="text-muted-foreground mb-8">
              {section.content}
            </p>
          )}
          
          {isExternal ? (
            <Button 
              asChild 
              variant={buttonVariant} 
              size="lg" 
              className="gap-2"
            >
              <a href={metadata.button_url} target="_blank" rel="noopener noreferrer">
                {metadata.button_text}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          ) : (
            <Button 
              asChild 
              variant={buttonVariant} 
              size="lg" 
              className="gap-2"
            >
              <Link to={metadata.button_url}>
                {metadata.button_text}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
