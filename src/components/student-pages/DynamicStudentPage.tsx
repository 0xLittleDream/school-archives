import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GraduationCap, Sparkles, Quote, Loader2, FileX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { StudentTribute } from '@/types/studentTribute';

export const DynamicStudentPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: student, isLoading, error } = useQuery({
    queryKey: ['student_tribute_by_slug', slug],
    queryFn: async () => {
      const routeSlug = `/${slug}`;
      const { data, error } = await supabase
        .from('student_tributes')
        .select('*')
        .eq('route_slug', routeSlug)
        .maybeSingle();
      
      if (error) throw error;
      return data as StudentTribute | null;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !student) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <FileX className="h-20 w-20 mx-auto text-muted-foreground/30 mb-6" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Student Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            This student page doesn't exist or has been removed.
          </p>
          <Button asChild variant="outline" size="lg">
            <Link to="/farewell-2025">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Farewell 2025
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const traits = student.traits || [];
  const displayName = student.full_name || student.student_name;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/20">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 text-center py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Class of 2025</span>
          </div>

          {/* Photo (if available) */}
          {student.photo_url && (
            <div className="mb-8">
              <img 
                src={student.photo_url} 
                alt={displayName}
                className="w-40 h-40 rounded-full mx-auto object-cover border-4 border-primary/20 shadow-xl"
              />
            </div>
          )}

          {/* Name */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6">
            {displayName}
          </h1>

          {/* Traits */}
          {traits.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {traits.map((trait, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 rounded-full bg-secondary/50 border border-border text-foreground/80 text-lg font-medium"
                >
                  {trait}
                </span>
              ))}
            </div>
          )}

          {/* Quote section */}
          <div className="max-w-2xl mx-auto mt-16 p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
            <Quote className="h-8 w-8 text-primary/40 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground italic">
              {student.quote || "Every ending is a new beginning. Wishing you all the success in your future endeavors!"}
            </p>
            {student.future_dreams && (
              <p className="mt-4 text-foreground">
                <strong>Future Dreams:</strong> {student.future_dreams}
              </p>
            )}
            <div className="mt-6 flex items-center justify-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Best wishes from NCS Family</span>
              <Sparkles className="h-4 w-4" />
            </div>
          </div>

          {/* Back button */}
          <div className="mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/farewell-2025">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Farewell 2025
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};
