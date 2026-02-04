import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { useStudentTributes } from '@/hooks/useStudentTributes';
import { useCustomPage } from '@/hooks/usePageBuilder';
import { useBranch } from '@/contexts/BranchContext';

export const StudentDirectory = () => {
  const { selectedBranchId } = useBranch();
  const { data: page } = useCustomPage('farewell-2025', selectedBranchId || undefined);
  const { data: students = [], isLoading } = useStudentTributes(page?.id);

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20">
        <div className="container flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (students.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Class of 2025</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Our Graduating Stars
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Student profiles are being prepared. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Class of 2025</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our Graduating Stars
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Click on any name to view their personalized farewell tribute page
          </p>
        </div>

        {/* Student Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {students.map((student) => (
            <Link
              key={student.id}
              to={student.route_slug || '#'}
              className="group relative p-5 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Name */}
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                {student.full_name || student.student_name}
              </h3>
              
              {/* Traits */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {(student.traits || []).map((trait, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground"
                  >
                    {trait}
                  </span>
                ))}
              </div>

              {/* Arrow indicator */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
