import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudentTributeCard } from './StudentTributeCard';
import { PlayfulStudentCard } from './PlayfulStudentCard';
import type { StudentTribute } from '@/types/studentTribute';

interface StudentTributeCarouselProps {
  tributes: StudentTribute[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function StudentTributeCarousel({ 
  tributes, 
  autoPlay = true, 
  autoPlayInterval = 5000 
}: StudentTributeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % tributes.length);
  }, [tributes.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + tributes.length) % tributes.length);
  }, [tributes.length]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered || tributes.length <= 1) return;
    
    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, goToNext, isHovered, tributes.length]);

  if (tributes.length === 0) {
    return (
      <div className="text-center py-16">
        <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground">No student tributes yet</p>
      </div>
    );
  }

  return (
    <section 
      className="relative py-12 md:py-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      
      <div className="container relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-sm font-semibold text-primary">🎓 Our Students</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Meet the <span className="text-gradient">Stars</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Celebrating the journeys, dreams, and bright futures of our students
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-2xl mx-auto">
          {/* Navigation Buttons */}
          {tributes.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 z-10 h-12 w-12 rounded-full bg-card/80 backdrop-blur-sm shadow-lg border border-border hover:bg-card"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 z-10 h-12 w-12 rounded-full bg-card/80 backdrop-blur-sm shadow-lg border border-border hover:bg-card"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Cards */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {tributes.map((tribute, index) => {
                // Render the correct theme card
                const CardComponent = tribute.theme === 'navy' ? StudentTributeCard : PlayfulStudentCard;
                
                return (
                  <div 
                    key={tribute.id} 
                    className="w-full flex-shrink-0 px-4"
                  >
                    <CardComponent 
                      tribute={tribute} 
                      isActive={index === currentIndex}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots Navigation */}
          {tributes.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {tributes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={`
                    h-2 rounded-full transition-all duration-300
                    ${index === currentIndex 
                      ? 'w-8 bg-primary' 
                      : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }
                  `}
                  aria-label={`Go to student ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Counter */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            {currentIndex + 1} of {tributes.length} students
          </p>
        </div>
      </div>
    </section>
  );
}
