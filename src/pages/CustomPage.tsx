import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCustomPage } from '@/hooks/usePageBuilder';
import { useBranch } from '@/contexts/BranchContext';

import { HeroSection } from '@/components/page-sections/HeroSection';
import { TextBlockSection } from '@/components/page-sections/TextBlockSection';
import { GallerySection } from '@/components/page-sections/GallerySection';
import { StatsSection } from '@/components/page-sections/StatsSection';
import { QuoteSection } from '@/components/page-sections/QuoteSection';
import { CTASection } from '@/components/page-sections/CTASection';
import type { PageSection } from '@/types/pageBuilder';

const CustomPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { selectedBranchId, selectedBranch } = useBranch();
  const { data: page, isLoading } = useCustomPage(slug || '', selectedBranchId || undefined);

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

  return (
    <Layout>
      {/* SEO Meta (would need helmet for full implementation) */}
      {sections.map((section, index) => renderSection(section, index))}
      
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
