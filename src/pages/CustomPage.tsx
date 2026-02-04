import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCustomPage } from '@/hooks/usePageBuilder';
import { useBranch } from '@/contexts/BranchContext';
import { useStudentTributes } from '@/hooks/useStudentTributes';

import { HeroSection } from '@/components/page-sections/HeroSection';
import { TextBlockSection } from '@/components/page-sections/TextBlockSection';
import { GallerySection } from '@/components/page-sections/GallerySection';
import { StatsSection } from '@/components/page-sections/StatsSection';
import { QuoteSection } from '@/components/page-sections/QuoteSection';
import { CTASection } from '@/components/page-sections/CTASection';
import { StudentTributeCarousel } from '@/components/student-tributes/StudentTributeCarousel';
import type { PageSection } from '@/types/pageBuilder';

const CustomPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { selectedBranchId, selectedBranch } = useBranch();
  const { data: page, isLoading } = useCustomPage(slug || '', selectedBranchId || undefined);

  // Fetch student tributes for farewell pages - must be called unconditionally
  const isFarewell = page?.page_type === 'farewell';
  const { data: studentTributes = [] } = useStudentTributes(
    isFarewell ? page?.id : undefined
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <Skeleton className="h-64 w-full rounded-2xl mb-8" />
          <Skeleton className="h-32 w-full rounded-2xl mb-8" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </Layout>
    );
  }

  if (!page) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <FileX className="h-20 w-20 mx-auto text-muted-foreground/30 mb-6" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Page Not Found
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or hasn't been published yet.
          </p>
          <Button asChild size="lg">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // If not published and not in preview mode, show not found
  if (!page.is_published) {
    // Check if we're in admin preview (could add a query param check here)
    const isPreview = window.location.search.includes('preview=true');
    if (!isPreview) {
      return (
        <Layout>
          <div className="container py-20 text-center">
            <FileX className="h-20 w-20 mx-auto text-muted-foreground/30 mb-6" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Page Not Published
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              This page is still a draft. Ask an admin to publish it.
            </p>
            <Button asChild size="lg">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </Layout>
      );
    }
  }

  const sections = page.sections || [];

  const renderSection = (section: PageSection, index: number) => {
    switch (section.section_type) {
      case 'hero':
        return <HeroSection key={section.id} section={section} branchName={selectedBranch?.name} />;
      case 'text_block':
        return <TextBlockSection key={section.id} section={section} index={index} />;
      case 'gallery':
        return <GallerySection key={section.id} section={section} />;
      case 'stats':
        return <StatsSection key={section.id} section={section} />;
      case 'quote':
        return <QuoteSection key={section.id} section={section} />;
      case 'cta':
        return <CTASection key={section.id} section={section} />;
      default:
        return null;
    }
  };

  // Find hero section index to insert student tributes after it
  const heroIndex = sections.findIndex(s => s.section_type === 'hero');
  const hasQuoteSection = sections.some(s => s.section_type === 'quote');

  return (
    <Layout>
      {sections.map((section, index) => {
        const sectionElement = renderSection(section, index);
        
        // Insert student tributes carousel after hero (or after quote if exists right after hero)
        const insertAfterHero = heroIndex >= 0 && index === heroIndex;
        const insertAfterQuote = hasQuoteSection && section.section_type === 'quote' && index === heroIndex + 1;
        
        const shouldInsertTributes = page.page_type === 'farewell' && studentTributes.length > 0 && 
          (insertAfterQuote || (insertAfterHero && !hasQuoteSection));
        
        return (
          <div key={section.id}>
            {sectionElement}
            {shouldInsertTributes && (
              <StudentTributeCarousel tributes={studentTributes} />
            )}
          </div>
        );
      })}

      {/* Fallback for farewell pages - show tributes at the end */}
      {page.page_type === 'farewell' && studentTributes.length > 0 && heroIndex < 0 && (
        <StudentTributeCarousel tributes={studentTributes} />
      )}
      
      {sections.length === 0 && (
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">
            This page has no content yet. 
            {page.is_published && ' An admin needs to add sections.'}
          </p>
        </div>
      )}
    </Layout>
  );
};

export default CustomPage;
