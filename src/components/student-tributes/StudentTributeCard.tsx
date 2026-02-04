import { GraduationCap, Quote, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { StudentTribute } from '@/types/studentTribute';

interface StudentTributeCardProps {
  tribute: StudentTribute;
  isActive?: boolean;
}

export function StudentTributeCard({ tribute, isActive = false }: StudentTributeCardProps) {
  return (
    <Card 
      className={`
        relative overflow-hidden transition-all duration-500 h-full
        ${isActive 
          ? 'scale-100 opacity-100 shadow-2xl ring-2 ring-primary/20' 
          : 'scale-95 opacity-70 shadow-lg'
        }
        bg-gradient-to-br from-card via-card to-accent/5
        hover:shadow-2xl
      `}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/10 to-transparent rounded-tr-full" />
      
      <CardContent className="p-6 md:p-8 relative">
        <div className="flex flex-col items-center text-center">
          {/* Photo */}
          <div className="relative mb-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-xl">
              {tribute.photo_url ? (
                <img 
                  src={tribute.photo_url} 
                  alt={tribute.student_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <GraduationCap className="w-16 h-16 text-primary/40" />
                </div>
              )}
            </div>
            {/* Decorative badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full shadow-lg">
              Class of 2025
            </div>
          </div>

          {/* Name */}
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
            {tribute.student_name}
          </h3>
          
          {/* Class/Section */}
          {tribute.class_section && (
            <p className="text-sm text-muted-foreground mb-4">
              {tribute.class_section}
            </p>
          )}

          {/* Quote */}
          {tribute.quote && (
            <div className="relative my-6 px-4">
              <Quote className="absolute -top-2 -left-2 w-6 h-6 text-primary/30" />
              <p className="text-muted-foreground italic text-base md:text-lg leading-relaxed">
                "{tribute.quote}"
              </p>
            </div>
          )}

          {/* Future Dreams */}
          {tribute.future_dreams && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/10">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Future Dreams</span>
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-foreground font-medium text-sm md:text-base">
                {tribute.future_dreams}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
