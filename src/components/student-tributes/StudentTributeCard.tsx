import { GraduationCap, Heart, Plane } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { StudentTribute } from '@/types/studentTribute';

interface StudentTributeCardProps {
  tribute: StudentTribute;
  isActive?: boolean;
}

export function StudentTributeCard({ tribute, isActive = false }: StudentTributeCardProps) {
  const displayName = tribute.full_name || tribute.student_name;
  const traits = tribute.traits || [];

  return (
    <Card 
      className={`
        relative overflow-hidden transition-all duration-500 h-full
        ${isActive 
          ? 'scale-100 opacity-100 shadow-2xl ring-2 ring-primary/30' 
          : 'scale-95 opacity-70 shadow-lg'
        }
        bg-white rounded-2xl
      `}
    >
      {/* Decorative perforations */}
      <div className="absolute top-0 left-1/4 w-6 h-3 bg-secondary rounded-b-full" />
      <div className="absolute bottom-0 left-1/4 w-6 h-3 bg-secondary rounded-t-full" />
      
      <div className="flex h-full">
        {/* Left Navy Strip */}
        <div className="w-10 md:w-12 bg-primary text-primary-foreground flex flex-col items-center justify-center py-4 flex-shrink-0">
          <Heart className="h-4 w-4 fill-current mb-2" />
          <span 
            className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
          >
            NCS Airways
          </span>
          <Heart className="h-4 w-4 fill-current mt-2" />
        </div>

        {/* Main Content */}
        <CardContent className="flex-1 p-4 md:p-6 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-1 text-primary mb-3 text-xs">
            <Plane className="h-3 w-3" />
            <span className="font-bold tracking-wider uppercase">NCS Airlines</span>
          </div>

          {/* Photo + Name */}
          <div className="flex items-start gap-4 mb-4">
            {/* Photo */}
            <div className="w-20 h-24 md:w-24 md:h-28 rounded-lg overflow-hidden bg-muted flex-shrink-0 shadow-md border-2 border-primary/10">
              {tribute.photo_url ? (
                <img 
                  src={tribute.photo_url} 
                  alt={tribute.student_name}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <GraduationCap className="w-10 h-10 text-primary/40" />
                </div>
              )}
            </div>

            {/* Name & Class */}
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground leading-tight mb-1">
                {displayName}
              </h3>
              {tribute.class_section && (
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {tribute.class_section}
                </p>
              )}
              
              {/* Batch Badge */}
              {tribute.class_section && (
                <div className="inline-block mt-2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded">
                  {tribute.class_section}
                </div>
              )}
            </div>
          </div>

          {/* Traits */}
          {traits.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {traits.map((trait, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide rounded"
                >
                  {trait}
                </span>
              ))}
            </div>
          )}

          {/* School Description */}
          {tribute.future_dreams && (
            <div className="flex-1 p-3 bg-secondary/50 rounded-lg border-l-2 border-primary mb-3">
              <p className="text-muted-foreground text-sm leading-relaxed italic line-clamp-3">
                "{tribute.future_dreams}"
              </p>
            </div>
          )}

          {/* Footer with barcode effect */}
          <div className="mt-auto pt-3 border-t border-dashed border-border flex items-center justify-between">
            <div className="flex items-center gap-[2px]">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-foreground/70" 
                  style={{ 
                    width: Math.random() > 0.5 ? '1px' : '2px', 
                    height: '20px' 
                  }} 
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              ✈ Bon Voyage!
            </span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
