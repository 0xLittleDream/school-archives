import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, FileX, Heart, Plane, MapPin, Calendar, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { StudentTribute } from '@/types/studentTribute';
import { useEventSettings } from '@/hooks/useEventSettings';
export const BoardingPassStudentPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: eventSettings } = useEventSettings();
  
  const {
    data: student,
    isLoading,
    error
  } = useQuery({
    queryKey: ['student_tribute_by_slug', slug],
    queryFn: async () => {
      const routeSlug = `/${slug}`;
      const {
        data,
        error
      } = await supabase.from('student_tributes').select('*').eq('route_slug', routeSlug).maybeSingle();
      if (error) throw error;
      return data as StudentTribute | null;
    },
    enabled: !!slug
  });
  if (isLoading) {
    return <Layout>
        <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>;
  }
  if (error || !student) {
    return <Layout>
        <div className="container py-20 text-center">
          <FileX className="h-20 w-20 mx-auto text-muted-foreground/30 mb-6" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Passenger Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            This boarding pass doesn't exist or has been cancelled.
          </p>
          <Button asChild variant="outline" size="lg">
            <Link to="/farewell-2025">
              Back to Terminal
            </Link>
          </Button>
        </div>
      </Layout>;
  }
  const traits = student.traits || [];
  const displayName = student.full_name || student.student_name;
  const firstName = student.student_name;
  return <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 py-8 md:py-16">
        <div className="container max-w-5xl">
          
          {/* Boarding Pass Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-border/50">
            
            {/* Decorative corner cuts */}
            <div className="absolute top-0 left-1/3 w-8 h-4 bg-slate-100 rounded-b-full" />
            <div className="absolute bottom-0 left-1/3 w-8 h-4 bg-slate-100 rounded-t-full" />
            
            <div className="flex flex-col lg:flex-row">
              
              {/* Left Navy Strip */}
              <div className="lg:w-16 bg-primary text-primary-foreground flex lg:flex-col items-center justify-center py-4 lg:py-8 gap-2">
                <Heart className="h-5 w-5 fill-current" />
                <span className="lg:writing-mode-vertical lg:rotate-180 text-xs font-bold tracking-[0.2em] uppercase whitespace-nowrap" style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)'
              }}>
                  Pass to Farewell {eventSettings?.batch_year || '2025-26'}
                </span>
                <Heart className="h-5 w-5 fill-current" />
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6 md:p-8 lg:p-10">
                
                {/* Header */}
                <div className="text-center border-b-2 border-dashed border-border pb-4 mb-6">
                  <div className="flex items-center justify-center gap-2 text-primary mb-2">
                    <Plane className="h-5 w-5" />
                    <span className="text-sm font-bold tracking-widest uppercase">{eventSettings?.airline_name || 'NCS Airlines'}</span>
                    <Plane className="h-5 w-5 scale-x-[-1]" />
                  </div>
                  <h1 className="font-display text-lg md:text-xl text-muted-foreground tracking-wider">
                    {eventSettings?.ceremony_title || 'INVITATION TO THE VALEDICTORY CEREMONY'}
                  </h1>
                </div>

                {/* Passenger Info Grid */}
                <div className="grid md:grid-cols-3 gap-4 mb-8 pb-6 border-b border-border">
                  <div className="md:col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Passenger Name</p>
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                      {displayName.toUpperCase()}
                    </h2>
                  </div>
                  <div className="flex gap-4 md:justify-end">
                    <div className="text-center px-4 py-2 border-2 border-foreground rounded-lg">
                      <p className="text-xs text-muted-foreground uppercase">Class</p>
                      <p className="font-bold text-xl">XII</p>
                    </div>
                    <div className="text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                      <p className="text-xs uppercase opacity-80">Batch</p>
                      <p className="font-bold text-xl">{eventSettings?.batch_year || '2025-26'}</p>
                    </div>
                  </div>
                </div>

                {/* Flight Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-xs uppercase">Date</span>
                    </div>
                    <p className="font-semibold text-foreground">{eventSettings?.event_date || '07 FEBRUARY'}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs uppercase">Time</span>
                    </div>
                    <p className="font-semibold text-foreground">{eventSettings?.event_time || '2:00 PM ONWARDS'}</p>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <MapPin className="h-3 w-3" />
                      <span className="text-xs uppercase">Venue</span>
                    </div>
                    <p className="font-semibold text-foreground">{eventSettings?.event_venue || 'NCS(SVN), ASSEMBLY AREA'}</p>
                  </div>
                </div>

                {/* Traits Section */}
                {traits.length > 0 && <div className="mb-8 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/10">
                    <div className="flex flex-wrap justify-center gap-2">
                      {traits.map((trait, index) => <span key={index} className="px-4 py-2 bg-primary/10 text-primary font-bold text-lg uppercase tracking-wider rounded-full">
                          {trait}
                        </span>)}
                    </div>
                  </div>}

                {/* School's Description */}
                {student.future_dreams && <div className="mb-8 p-6 bg-secondary/30 rounded-xl border-l-4 border-primary">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                      About {firstName}
                    </h3>
                    <p className="text-foreground/80 text-lg leading-relaxed italic">
                      "{student.future_dreams}"
                    </p>
                  </div>}

                {/* Quote */}
                {student.quote && <div className="mb-8 text-center">
                    <p className="text-muted-foreground text-lg italic">
                      "{student.quote}"
                    </p>
                  </div>}

                {/* Barcode & CTA */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t-2 border-dashed border-border">
                  {/* Fake Barcode */}
                  <div className="flex items-center gap-1">
                    {Array.from({
                    length: 30
                  }).map((_, i) => <div key={i} className="bg-foreground" style={{
                    width: Math.random() > 0.5 ? '2px' : '3px',
                    height: '40px'
                  }} />)}
                  </div>
                  
                  <Button asChild size="lg" className="gap-2 rounded-full px-8">
                    <Link to="/memories">
                      View Batch Memories
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Navy Strip */}
              <div className="lg:w-20 bg-primary text-primary-foreground flex lg:flex-col items-center justify-center py-4 lg:py-8 gap-3">
                <Heart className="h-5 w-5 fill-red-400 text-red-400" />
                <span className="lg:writing-mode-vertical text-sm font-bold tracking-[0.15em] uppercase whitespace-nowrap text-center" style={{
                writingMode: 'vertical-rl'
              }}>
                  Have a Great Journey Ahead
                </span>
                <Heart className="h-5 w-5 fill-red-400 text-red-400" />
              </div>
            </div>

            {/* Photo Overlay (if available) */}
            {student.photo_url && <div className="absolute -right-4 -bottom-4 lg:right-24 lg:top-1/2 lg:-translate-y-1/2 w-32 h-40 md:w-40 md:h-52 lg:w-48 lg:h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white rotate-3 hidden md:block">
                <img src={student.photo_url} alt={displayName} className="w-full h-full object-cover object-top" />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary to-transparent p-3 text-center">
                  <p className="text-primary-foreground text-xs font-semibold">
                    <Heart className="h-3 w-3 inline fill-red-400 text-red-400 mr-1" />
                    WITH LOVE
                  </p>
                  <p className="text-primary-foreground/80 text-[10px]">FROM CLASS 11TH</p>
                </div>
              </div>}
          </div>

          {/* Mobile Photo */}
          {student.photo_url && <div className="mt-8 flex justify-center md:hidden">
              <div className="w-48 h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img src={student.photo_url} alt={displayName} className="w-full h-full object-cover object-top" />
              </div>
            </div>}

          {/* Back to Farewell Button */}
          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/farewell-2025">
                ← Back to Farewell {eventSettings?.batch_year || '2025-26'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>;
};