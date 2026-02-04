import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  GraduationCap, 
  Sparkles, 
  Heart, 
  Star, 
  MapPin, 
  Calendar, 
  Clock,
  Quote,
  Trophy,
  Rocket,
  Music,
  BookOpen,
  Camera,
  Loader2, 
  FileX 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { StudentTribute } from '@/types/studentTribute';

// Floating animated elements
const FloatingElement = ({ children, delay = 0, duration = 3 }: { children: React.ReactNode; delay?: number; duration?: number }) => (
  <div 
    className="absolute animate-float opacity-20"
    style={{ 
      animationDelay: `${delay}s`, 
      animationDuration: `${duration}s` 
    }}
  >
    {children}
  </div>
);

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
  const firstName = student.student_name;

  return (
    <Layout>
      {/* Hero Section with Celebration Theme */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/10">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingElement delay={0} duration={4}>
            <Star className="h-8 w-8 text-primary absolute top-20 left-[10%]" />
          </FloatingElement>
          <FloatingElement delay={1} duration={5}>
            <Heart className="h-6 w-6 text-red-400 absolute top-40 right-[15%]" />
          </FloatingElement>
          <FloatingElement delay={2} duration={4.5}>
            <Sparkles className="h-10 w-10 text-yellow-400 absolute top-60 left-[20%]" />
          </FloatingElement>
          <FloatingElement delay={0.5} duration={3.5}>
            <GraduationCap className="h-12 w-12 text-primary/30 absolute bottom-40 right-[25%]" />
          </FloatingElement>
          <FloatingElement delay={1.5} duration={5}>
            <Trophy className="h-8 w-8 text-yellow-500/40 absolute bottom-60 left-[30%]" />
          </FloatingElement>
          
          {/* Large decorative gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-accent/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 py-12 md:py-20">
          
          {/* Top Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="text-sm font-bold text-primary tracking-wider uppercase">Class of 2025-26</span>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
          </div>

          {/* Main Content Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-card/80 backdrop-blur-md rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
              
              {/* Header with Photo */}
              <div className="relative bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-8 md:p-12 text-primary-foreground">
                
                {/* Photo Circle */}
                {student.photo_url && (
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0">
                    <div className="relative">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background shadow-2xl overflow-hidden">
                        <img 
                          src={student.photo_url} 
                          alt={displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg">
                        <Star className="h-5 w-5 text-yellow-900 fill-current" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Name & Title */}
                <div className={`text-center ${student.photo_url ? 'md:text-left md:ml-48' : ''}`}>
                  <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-3 drop-shadow-lg">
                    {displayName}
                  </h1>
                  <p className="text-lg md:text-xl opacity-90 font-medium">
                    🎓 Graduating Star of NCS
                  </p>
                </div>

                {/* Decorative stars */}
                <div className="absolute top-4 right-4 flex gap-1">
                  <Star className="h-4 w-4 fill-current opacity-60" />
                  <Star className="h-5 w-5 fill-current opacity-80" />
                  <Star className="h-4 w-4 fill-current opacity-60" />
                </div>
              </div>

              {/* Main Content */}
              <div className={`p-6 md:p-10 ${student.photo_url ? 'pt-20 md:pt-10' : ''}`}>
                
                {/* Traits Pills */}
                {traits.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h3 className="font-display text-lg font-semibold text-foreground">Known For</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {traits.map((trait, index) => (
                        <span 
                          key={index}
                          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-foreground font-semibold text-base shadow-sm hover:shadow-md transition-shadow"
                        >
                          ✨ {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Event Details Card */}
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-secondary/50 to-muted/30 border border-border">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Valedictory Ceremony Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Date</p>
                        <p className="font-semibold text-foreground">07 February 2025</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Time</p>
                        <p className="font-semibold text-foreground">2:00 PM Onwards</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-background/60">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Venue</p>
                        <p className="font-semibold text-foreground">NCS(SVN), Assembly Hall</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quote Section */}
                {student.quote && (
                  <div className="mb-8 relative">
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                      <Quote className="h-10 w-10 text-primary/20 absolute top-4 left-4" />
                      <div className="relative z-10 text-center">
                        <p className="text-xl md:text-2xl text-foreground/90 italic font-medium leading-relaxed">
                          "{student.quote}"
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-2">
                          <span className="w-8 h-0.5 bg-primary/30"></span>
                          <Heart className="h-4 w-4 text-red-400 fill-current" />
                          <span className="w-8 h-0.5 bg-primary/30"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* School's Message / About Section */}
                {student.future_dreams && (
                  <div className="mb-8">
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border-2 border-yellow-200/50 dark:border-yellow-700/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-full bg-yellow-400/20">
                          <Heart className="h-5 w-5 text-yellow-600 fill-current" />
                        </div>
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          A Message for {firstName}
                        </h3>
                      </div>
                      <p className="text-foreground/80 text-lg leading-relaxed">
                        {student.future_dreams}
                      </p>
                    </div>
                  </div>
                )}

                {/* Fun Journey Stats */}
                <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200/50 dark:border-blue-700/30">
                    <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">12</p>
                    <p className="text-xs text-muted-foreground uppercase">Years of Learning</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200/50 dark:border-purple-700/30">
                    <Camera className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">∞</p>
                    <p className="text-xs text-muted-foreground uppercase">Memories Made</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border border-pink-200/50 dark:border-pink-700/30">
                    <Music className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">♥</p>
                    <p className="text-xs text-muted-foreground uppercase">Endless Joy</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200/50 dark:border-green-700/30">
                    <Rocket className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">1</p>
                    <p className="text-xs text-muted-foreground uppercase">Bright Future</p>
                  </div>
                </div>

                {/* Farewell Message */}
                <div className="text-center p-8 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/10">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="font-display text-xl font-bold text-foreground">Best Wishes!</h3>
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground max-w-xl mx-auto">
                    As you spread your wings and soar to new heights, remember that the NCS family will always be cheering for you. 
                    May success and happiness follow you wherever you go! 🌟
                  </p>
                  <div className="mt-6 text-sm text-primary font-medium">
                    — With love from the NCS Family 💙
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild size="lg" className="gap-2 rounded-full px-8">
                    <Link to="/memories">
                      <Camera className="h-4 w-4" />
                      View Memories
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2 rounded-full px-8">
                    <Link to="/farewell-2025">
                      <ArrowLeft className="h-4 w-4" />
                      Back to Farewell
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </Layout>
  );
};
