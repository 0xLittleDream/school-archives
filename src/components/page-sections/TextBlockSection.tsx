import type { PageSection, TextBlockMetadata } from '@/types/pageBuilder';

interface TextBlockSectionProps {
  section: PageSection;
  index: number;
}

export function TextBlockSection({ section, index }: TextBlockSectionProps) {
  const metadata = (section.metadata || {}) as TextBlockMetadata;
  const layout = metadata.layout || 'center';

  // Center layout - text only
  if (layout === 'center' || !section.image_url) {
    return (
      <section className="py-12 md:py-16">
        <div className="container max-w-4xl">
          <div 
            className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 md:p-12 border border-border animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {section.title && (
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
                {section.title}
              </h2>
            )}
            {section.content && (
              <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap text-center">
                {section.content}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Image + text layout
  const imageOnLeft = layout === 'left';

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div 
          className={`grid md:grid-cols-2 gap-8 items-center animate-fade-in`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={`rounded-2xl overflow-hidden shadow-elegant-lg ${imageOnLeft ? '' : 'md:order-2'}`}>
            <img 
              src={section.image_url!} 
              alt={section.title || ''} 
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
          <div className={imageOnLeft ? '' : 'md:order-1'}>
            {section.title && (
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                {section.title}
              </h2>
            )}
            {section.content && (
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg">
                {section.content}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
