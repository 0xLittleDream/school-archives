import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
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
    <section className="py-20 md:py-28 bg-gradient-to-b from-secondary/30 via-background to-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-accent/5 blur-3xl -translate-y-1/2" />
      </div>
      
      <div className="container relative">
        <div className="max-w-2xl mx-auto text-center">
          {/* Decorative icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          
          {section.title && (
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {section.title}
            </h2>
          )}
          
          {section.content && (
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              {section.content}
            </p>
          )}
          
          {isExternal ? (
            <Button 
              asChild 
              variant={buttonVariant} 
              size="lg" 
              className="h-14 px-8 text-base font-semibold gap-2 rounded-xl shadow-elegant hover:shadow-elegant-lg transition-shadow"
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
              className="h-14 px-8 text-base font-semibold gap-2 rounded-xl shadow-elegant hover:shadow-elegant-lg transition-shadow"
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
