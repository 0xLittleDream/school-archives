import { useParams, Link, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Clock,
  Heart,
  Star,
  Sparkles,
  Cloud,
  ArrowRight,
  FileX,
  Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { StudentTribute } from '@/types/studentTribute';

export const DynamicStudentPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // First check if this slug matches a custom page
  const { data: customPage, isLoading: isLoadingPage } = useQuery({
    queryKey: ['custom_page_check', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_pages')
        .select('id, slug')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
  
  // Then check for student tribute
  const { data: student, isLoading: isLoadingStudent, error } = useQuery({
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
    enabled: !!slug && !customPage,
  });

  // If it's a custom page, redirect to the proper route
  if (customPage) {
    return <Navigate to={`/page/${slug}`} replace />;
  }

  const isLoading = isLoadingPage || isLoadingStudent;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !student) {
    return (
      <Layout>
        <div className="min-h-[70vh] bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
          <div className="container py-20 text-center">
            <FileX className="h-20 w-20 mx-auto text-muted-foreground/30 mb-6" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Page Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              This page doesn't exist or may have been removed.
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link to="/">
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const traits = student.traits || [];
  const displayName = student.full_name || student.student_name;
  const firstName = student.student_name;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-white relative overflow-hidden">
        
        {/* Animated Sky Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Clouds */}
          <div className="absolute top-10 left-[5%] animate-cloud-drift opacity-40">
            <Cloud className="h-24 w-24 text-white fill-white" />
          </div>
          <div className="absolute top-32 right-[10%] animate-cloud-drift-slow opacity-30">
            <Cloud className="h-32 w-32 text-white fill-white" />
          </div>
          <div className="absolute top-48 left-[60%] animate-cloud-drift opacity-25">
            <Cloud className="h-20 w-20 text-white fill-white" />
          </div>
          <div className="absolute top-16 left-[40%] animate-cloud-drift-slow opacity-35">
            <Cloud className="h-16 w-16 text-white fill-white" />
          </div>
          
          {/* Flying Plane Trail */}
          <div className="absolute top-20 animate-plane-fly">
            <Plane className="h-8 w-8 text-primary/40 rotate-45" />
          </div>
          
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80" />
        </div>

        <div className="container relative z-10 py-8 md:py-12 px-4">
          
          {/* Airline Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-primary/10">
              <Plane className="h-5 w-5 text-primary" />
              <span className="font-display text-lg font-bold text-primary tracking-wide">NCS AIRWAYS</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground font-medium">Class of 2025-26</span>
            </div>
          </div>

          {/* Main Boarding Pass */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              
              {/* Ticket Perforations - Top */}
              <div className="flex justify-center mb-[-1px] relative z-20">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-sky-100 mx-0.5" />
                ))}
              </div>
              
              {/* Main Ticket Body */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-border/30">
                
                {/* Top Section - Navy Header with Photo */}
                <div className="relative bg-gradient-to-r from-primary via-primary to-primary/90 p-6 md:p-8">
                  
                  {/* Decorative Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-2 right-2 flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current text-white" />
                      ))}
                    </div>
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current text-white" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                    
                    {/* Photo with Frame */}
                    {student.photo_url && (
                      <div className="relative flex-shrink-0">
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
                          <img 
                            src={student.photo_url} 
                            alt={displayName}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg animate-pulse">
                          <Star className="h-4 w-4 text-yellow-800 fill-current" />
                        </div>
                      </div>
                    )}
                    
                    {/* Name & Title */}
                    <div className="text-center md:text-left flex-1">
                      <p className="text-primary-foreground/70 text-sm font-medium uppercase tracking-widest mb-2">
                        ✈ Passenger Name
                      </p>
                      <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                        {displayName}
                      </h1>
                      <div className="flex items-center justify-center md:justify-start gap-2 text-primary-foreground/90">
                        <Sparkles className="h-4 w-4" />
                        <span className="font-medium">Graduating Star of NCS</span>
                      </div>
                    </div>
                    
                    {/* Class Badge */}
                    <div className="flex-shrink-0 text-center">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="text-primary-foreground/70 text-xs uppercase tracking-wider">Class</p>
                        <p className="font-display text-3xl font-bold text-white">XII</p>
                        <p className="text-primary-foreground/70 text-xs">2025-26</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Traits Strip */}
                {traits.length > 0 && (
                  <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 px-6 py-4 border-b border-dashed border-border">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Known for:</span>
                      {traits.map((trait, index) => (
                        <span 
                          key={index}
                          className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm border border-primary/20"
                        >
                          ✨ {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Flight Route Visualization */}
                <div className="px-6 py-8 md:px-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">From</p>
                      <p className="font-display text-2xl md:text-3xl font-bold text-foreground">NCS</p>
                      <p className="text-sm text-muted-foreground">Navy Children School</p>
                    </div>
                    
                    {/* Flight Path */}
                    <div className="flex-1 mx-4 md:mx-8 relative">
                      <div className="h-0.5 bg-gradient-to-r from-primary via-primary/50 to-primary w-full" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg border border-primary/20">
                        <Plane className="h-5 w-5 text-primary rotate-90" />
                      </div>
                      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 rounded-full bg-primary" />
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 rounded-full bg-primary" />
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">To</p>
                      <p className="font-display text-2xl md:text-3xl font-bold text-foreground">∞</p>
                      <p className="text-sm text-muted-foreground">Bright Future</p>
                    </div>
                  </div>

                  {/* Flight Details Grid */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/30 rounded-2xl mb-8">
                    <div className="text-center p-3">
                      <Calendar className="h-5 w-5 text-primary mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Date</p>
                      <p className="font-semibold text-foreground">07 FEB 2025</p>
                    </div>
                    <div className="text-center p-3 border-x border-border/50">
                      <Clock className="h-5 w-5 text-primary mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Boarding</p>
                      <p className="font-semibold text-foreground">2:00 PM</p>
                    </div>
                    <div className="text-center p-3">
                      <MapPin className="h-5 w-5 text-primary mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Gate</p>
                      <p className="font-semibold text-foreground">ASSEMBLY HALL</p>
                    </div>
                  </div>

                  {/* Quote Section - Window View Style */}
                  {student.quote && (
                    <div className="relative mb-8 p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200/50 overflow-hidden">
                      {/* Window frame effect */}
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-200 via-sky-100 to-sky-200" />
                      <div className="relative">
                        <div className="text-6xl text-sky-200 font-serif absolute -top-2 -left-2">"</div>
                        <p className="text-lg md:text-xl text-foreground/80 italic leading-relaxed pl-8 pr-4">
                          {student.quote}
                        </p>
                        <div className="text-6xl text-sky-200 font-serif absolute -bottom-6 right-2">"</div>
                      </div>
                    </div>
                  )}

                  {/* School's Message */}
                  {student.future_dreams && (
                    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200/50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-full bg-yellow-400/30">
                          <Heart className="h-5 w-5 text-yellow-600 fill-current" />
                        </div>
                        <h3 className="font-display text-lg font-bold text-foreground">
                          A Special Message for {firstName}
                        </h3>
                      </div>
                      <p className="text-foreground/80 text-lg leading-relaxed pl-12">
                        {student.future_dreams}
                      </p>
                    </div>
                  )}

                  {/* Farewell Stamp */}
                  <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <div className="w-40 h-40 rounded-full border-8 border-primary flex items-center justify-center rotate-[-15deg]">
                        <div className="text-center">
                          <p className="font-display text-xl font-bold text-primary">CLEARED</p>
                          <p className="text-xs text-primary">FOR TAKEOFF</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center py-8 relative z-10">
                      <div className="inline-flex items-center gap-2 mb-4">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <h3 className="font-display text-2xl font-bold text-foreground">Best Wishes & Bon Voyage!</h3>
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                        As you take off to new destinations, remember that the NCS family will always be your home base. 
                        May your journey be filled with success, joy, and endless adventures! ✈️
                      </p>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <Heart className="h-4 w-4 text-red-400 fill-current" />
                        <span className="text-sm text-primary font-medium">With love from the NCS Family</span>
                        <Heart className="h-4 w-4 text-red-400 fill-current" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ticket Tear Line */}
                <div className="relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-sky-100 rounded-r-full" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-sky-100 rounded-l-full" />
                  <div className="border-t-2 border-dashed border-border mx-8" />
                </div>

                {/* Bottom Section - Barcode & CTA */}
                <div className="p-6 md:p-8 bg-secondary/20">
                  {/* Barcode */}
                  <div className="flex items-center justify-center gap-[2px] mb-6">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="bg-foreground/80"
                        style={{ 
                          width: Math.random() > 0.5 ? '2px' : '3px',
                          height: `${30 + Math.random() * 15}px`
                        }} 
                      />
                    ))}
                  </div>
                  <p className="text-center text-xs text-muted-foreground mb-6 font-mono tracking-widest">
                    NCS-2025-{firstName?.toUpperCase().slice(0, 4) || 'STAR'}-{Math.random().toString().slice(2, 6)}
                  </p>
                  
                  {/* Big CTA Button */}
                  <Button 
                    asChild 
                    size="lg" 
                    className="w-full py-8 text-xl font-bold rounded-2xl bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-300 group"
                  >
                    <Link to="/farewell-2025" className="flex items-center justify-center gap-3">
                      <Plane className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                      <span>Return to Farewell Terminal</span>
                      <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Ticket Perforations - Bottom */}
              <div className="flex justify-center mt-[-1px] relative z-20">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-sky-100 mx-0.5" />
                ))}
              </div>
            </div>
          </div>
          
          {/* Bottom Runway Decoration */}
          <div className="mt-12 flex items-center justify-center gap-4 opacity-30">
            <div className="h-1 w-16 bg-primary rounded-full" />
            <div className="h-1 w-8 bg-primary rounded-full" />
            <Plane className="h-6 w-6 text-primary" />
            <div className="h-1 w-8 bg-primary rounded-full" />
            <div className="h-1 w-16 bg-primary rounded-full" />
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes cloud-drift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(30px); }
        }
        @keyframes cloud-drift-slow {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-20px); }
        }
        @keyframes plane-fly {
          0% { transform: translateX(-100px) translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(calc(100vw + 100px)) translateY(-50px); opacity: 0; }
        }
        .animate-cloud-drift {
          animation: cloud-drift 8s ease-in-out infinite;
        }
        .animate-cloud-drift-slow {
          animation: cloud-drift-slow 12s ease-in-out infinite;
        }
        .animate-plane-fly {
          animation: plane-fly 15s linear infinite;
        }
      `}</style>
    </Layout>
  );
};
