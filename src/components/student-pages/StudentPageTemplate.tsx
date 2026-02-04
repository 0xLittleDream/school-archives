import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GraduationCap, Sparkles, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StudentPageTemplateProps {
  name: string;
  traits: string[];
  classYear?: string;
}

export const StudentPageTemplate = ({ 
  name, 
  traits,
  classYear = "2025"
}: StudentPageTemplateProps) => {
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
            <span className="text-sm font-medium text-primary">Class of {classYear}</span>
          </div>

          {/* Name */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6">
            {name}
          </h1>

          {/* Traits */}
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

          {/* Decorative quote section */}
          <div className="max-w-2xl mx-auto mt-16 p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
            <Quote className="h-8 w-8 text-primary/40 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground italic">
              "Every ending is a new beginning. Wishing you all the success in your future endeavors!"
            </p>
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
