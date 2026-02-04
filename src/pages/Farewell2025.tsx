import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileX, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCustomPage, useCreatePageWithTemplate } from '@/hooks/usePageBuilder';
import { useBranch } from '@/contexts/BranchContext';
import { PAGE_TEMPLATES } from '@/types/pageBuilder';
import { useToast } from '@/hooks/use-toast';
import { useStudentTributes } from '@/hooks/useStudentTributes';

import { HeroSection } from '@/components/page-sections/HeroSection';
import { TextBlockSection } from '@/components/page-sections/TextBlockSection';
import { GallerySection } from '@/components/page-sections/GallerySection';
import { StatsSection } from '@/components/page-sections/StatsSection';
import { QuoteSection } from '@/components/page-sections/QuoteSection';
import { CTASection } from '@/components/page-sections/CTASection';
import { StudentTributeCarousel } from '@/components/student-tributes/StudentTributeCarousel';
import { StudentDirectory } from '@/components/student-pages/StudentDirectory';
import type { PageSection } from '@/types/pageBuilder';

// This page renders from custom_pages table with slug "farewell-2025"
// Admins can edit it via Admin → Page Editor → Edit button
const Farewell2025 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedBranchId, selectedBranch } = useBranch();
  const { data: page, isLoading, refetch } = useCustomPage('farewell-2025', selectedBranchId || undefined);
  const createPageWithTemplate = useCreatePageWithTemplate();
  
  // Move hook to top level - hooks must not be called conditionally
  const { data: studentTributes = [] } = useStudentTributes(page?.id);

  // If no farewell page exists for this branch, show option to create one
  const handleCreateFarewellPage = async () => {
    if (!selectedBranchId) {
      toast({
        title: 'Select a branch first',
        description: 'Please select a branch to create the Farewell 2025 page.',
        variant: 'destructive',
      });
      return;
    }

    const farewellTemplate = PAGE_TEMPLATES.find(t => t.id === 'farewell');
    if (!farewellTemplate) return;

    try {
      const newPage = await createPageWithTemplate.mutateAsync({
        pageData: {
          title: 'Farewell 2025',
          slug: 'farewell-2025',
          page_type: 'farewell',
          branch_id: selectedBranchId,
        },
        template: farewellTemplate,
      });

      toast({ title: '✓ Farewell page created!', description: 'You can now customize it.' });
      refetch();
      
      // Navigate to the page builder to edit
      navigate(`/admin/page-builder/${newPage.id}`);
    } catch (error: any) {
      toast({
        title: 'Error creating page',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // If no branch selected yet, the BranchSelectionModal will show
  // Just render Layout with loading state so modal can overlay properly
  if (!selectedBranchId) {
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
            Farewell 2025 Page Not Created Yet
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The Farewell 2025 page for {selectedBranch?.name || 'your branch'} hasn't been created yet. 
            Would you like to create it now?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleCreateFarewellPage}
              disabled={createPageWithTemplate.isPending}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Farewell 2025 Page
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // If not published and not in preview mode, show not found
  if (!page.is_published) {
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
              This page is still a draft. Ask an admin to publish it or preview it directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to={`/admin/page-builder/${page.id}`}>
                  Edit & Publish
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
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
        
        const shouldInsertTributes = studentTributes.length > 0 && (insertAfterQuote || (insertAfterHero && !hasQuoteSection));
        
        return (
          <div key={section.id}>
            {sectionElement}
            {shouldInsertTributes && (
              <StudentTributeCarousel tributes={studentTributes} />
            )}
          </div>
        );
      })}

      {/* Fallback if no hero/quote - show tributes at the end */}
      {studentTributes.length > 0 && heroIndex < 0 && (
        <StudentTributeCarousel tributes={studentTributes} />
      )}

      {/* Student Directory - Always show on Farewell page */}
      <StudentDirectory />
      
      {sections.length === 0 && studentTributes.length === 0 && (
        <div className="container py-20 text-center">
          <p className="text-muted-foreground mb-4">
            This page has no content yet. Add sections in the Page Builder.
          </p>
          <Button asChild>
            <Link to={`/admin/page-builder/${page.id}`}>
              Edit Page
            </Link>
          </Button>
        </div>
      )}
    </Layout>
  );
};

export default Farewell2025;
