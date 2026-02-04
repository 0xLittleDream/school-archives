import { GraduationCap, Sparkles, Star, Trophy, PartyPopper } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { StudentTribute } from '@/types/studentTribute';

interface PlayfulStudentCardProps {
  tribute: StudentTribute;
  isActive?: boolean;
}

export function PlayfulStudentCard({ tribute, isActive = false }: PlayfulStudentCardProps) {
  const displayName = tribute.full_name || tribute.student_name;
  const traits = tribute.traits || [];

  return (
    <Card 
      className={`
        relative overflow-hidden transition-all duration-500 h-full
        ${isActive 
          ? 'scale-100 opacity-100 shadow-2xl' 
          : 'scale-95 opacity-70 shadow-lg'
        }
        bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-3xl border-2 border-transparent
        ${isActive ? 'border-pink-300' : ''}
      `}
    >
      {/* Decorative confetti elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-4 animate-bounce">
          <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
        </div>
        <div className="absolute top-8 right-8 animate-pulse">
          <Sparkles className="h-5 w-5 text-pink-400" />
        </div>
        <div className="absolute bottom-12 left-8 animate-bounce delay-100">
          <PartyPopper className="h-5 w-5 text-purple-400" />
        </div>
        <div className="absolute top-1/3 right-4 animate-pulse delay-200">
          <Star className="h-4 w-4 text-indigo-400 fill-indigo-400" />
        </div>
        
        {/* Gradient overlay circles */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-indigo-300/30 to-blue-300/30 rounded-full blur-2xl" />
      </div>

      <CardContent className="relative z-10 p-6 flex flex-col h-full">
        {/* Header with emoji badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎉</span>
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
            Celebrating You!
          </span>
        </div>

        {/* Photo + Name */}
        <div className="flex items-start gap-4 mb-4">
          {/* Photo with playful border */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-28 rounded-2xl overflow-hidden shadow-lg ring-4 ring-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 ring-offset-2">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-2xl" />
              <div className="absolute inset-[3px] rounded-xl overflow-hidden bg-white">
                {tribute.photo_url ? (
                  <img 
                    src={tribute.photo_url} 
                    alt={tribute.student_name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    <GraduationCap className="w-10 h-10 text-purple-400" />
                  </div>
                )}
              </div>
            </div>
            {/* Star badge */}
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg animate-bounce">
              <Star className="h-4 w-4 text-yellow-800 fill-current" />
            </div>
          </div>

          {/* Name & Class */}
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight mb-1">
              {displayName}
            </h3>
            {tribute.class_section && (
              <p className="text-sm text-purple-500 font-medium">
                {tribute.class_section}
              </p>
            )}
            
            {/* Fun batch badge */}
            <div className="inline-flex items-center gap-1 mt-2 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-md">
              <Sparkles className="h-3 w-3" />
              Class of 2025-26
            </div>
          </div>
        </div>

        {/* Traits as colorful pills */}
        {traits.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {traits.map((trait, index) => {
              const colors = [
                'bg-pink-100 text-pink-700 border-pink-200',
                'bg-purple-100 text-purple-700 border-purple-200',
                'bg-indigo-100 text-indigo-700 border-indigo-200',
              ];
              return (
                <span 
                  key={index}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-full border ${colors[index % colors.length]}`}
                >
                  ✨ {trait}
                </span>
              );
            })}
          </div>
        )}

        {/* Quote in a fun speech bubble style */}
        {tribute.future_dreams && (
          <div className="flex-1 relative p-4 bg-white rounded-2xl shadow-inner border border-purple-100 mb-4">
            <div className="absolute -top-2 left-6 w-4 h-4 bg-white border-l border-t border-purple-100 rotate-45" />
            <p className="text-muted-foreground text-sm leading-relaxed italic">
              "{tribute.future_dreams}"
            </p>
          </div>
        )}

        {/* Footer with achievements hint */}
        <div className="mt-auto pt-4 border-t border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-400">
            <Trophy className="h-4 w-4" />
            <span className="text-xs font-medium">Future Superstar!</span>
          </div>
          <div className="flex gap-1">
            {['🌟', '💫', '✨'].map((emoji, i) => (
              <span key={i} className="text-lg animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                {emoji}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
