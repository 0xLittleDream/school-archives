import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  FileEdit, 
  Plus,
  ExternalLink,
  Trash2,
  Loader2,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  useCustomPages, 
  useCreatePageWithTemplate,
  useDeleteCustomPage,
  useUpdateCustomPage
} from '@/hooks/usePageBuilder';
import { useBranch } from '@/contexts/BranchContext';
import { useToast } from '@/hooks/use-toast';
import { TemplatePicker } from './page-builder/TemplatePicker';
import { PAGE_TEMPLATES, PageTemplate } from '@/types/pageBuilder';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function PageEditor() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedBranchId, selectedBranch } = useBranch();
  const { data: pages, isLoading, refetch } = useCustomPages(selectedBranchId || undefined);
  
  const createPageWithTemplate = useCreatePageWithTemplate();
  const deletePage = useDeleteCustomPage();
  const updatePage = useUpdateCustomPage();

  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);
  const [creatingPage, setCreatingPage] = useState(false);

  const handleSelectTemplate = (template: PageTemplate) => {
    setSelectedTemplate(template);
    setNewPageTitle(template.name);
  };

  const handleCreatePage = async () => {
    if (!selectedBranchId || !selectedTemplate || !newPageTitle.trim()) {
      toast({
        title: 'Please fill in all fields',
        description: 'Select a branch and enter a page title.',
        variant: 'destructive',
      });
      return;
    }

    setCreatingPage(true);
    try {
      const slug = newPageTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
      
      const page = await createPageWithTemplate.mutateAsync({
        pageData: {
          title: newPageTitle.trim(),
          slug,
          page_type: selectedTemplate.id,
          branch_id: selectedBranchId,
        },
        template: selectedTemplate,
      });

      toast({ title: '✓ Page created!', description: 'Now customize your sections.' });
      setSelectedTemplate(null);
      setNewPageTitle('');
      navigate(`/admin/page-builder/${page.id}`);
    } catch (error: any) {
      toast({
        title: 'Error creating page',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setCreatingPage(false);
    }
  };

  const handleDeletePage = async () => {
    if (!pageToDelete) return;
    
    try {
      await deletePage.mutateAsync(pageToDelete);
      refetch();
      toast({ title: 'Page deleted' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setDeleteDialogOpen(false);
      setPageToDelete(null);
    }
  };

  const handleTogglePublish = async (pageId: string, isPublished: boolean) => {
    try {
      await updatePage.mutateAsync({ id: pageId, is_published: !isPublished });
      refetch();
      toast({ title: isPublished ? 'Page unpublished' : '✓ Page published!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileEdit className="h-5 w-5 text-primary" />
            </div>
            Custom Page Builder
          </CardTitle>
          <CardDescription className="text-base">
            Create beautiful event pages for farewells, annual days, assemblies, and more. 
            Choose a template and customize the content - no coding required.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Create New Page Section */}
      {selectedTemplate ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create New Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
              <Badge variant="secondary">{selectedTemplate.name}</Badge>
              <span className="text-sm text-muted-foreground">
                {selectedTemplate.defaultSections.length} pre-configured sections
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto"
                onClick={() => setSelectedTemplate(null)}
              >
                Change
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                placeholder="e.g., Farewell 2025"
              />
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleCreatePage} 
                disabled={creatingPage || !newPageTitle.trim()}
                className="gap-2"
              >
                {creatingPage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Create Page
              </Button>
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setTemplatePickerOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Page
        </Button>
      )}

      {/* Existing Pages */}
      {pages && pages.length > 0 && (
        <div>
          <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Your Event Pages
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {pages.map((page) => (
              <Card key={page.id} className="group hover:shadow-elegant transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground truncate">
                          {page.title}
                        </h4>
                        <Badge variant={page.is_published ? 'default' : 'secondary'}>
                          {page.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        /page/{page.slug}
                      </p>
                      {page.branch && (
                        <p className="text-xs text-primary mt-1">
                          {page.branch.name} ({page.branch.code})
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-1"
                      onClick={() => navigate(`/admin/page-builder/${page.id}`)}
                    >
                      <FileEdit className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => window.open(`/page/${page.slug}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleTogglePublish(page.id, page.is_published)}
                    >
                      {page.is_published ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        setPageToDelete(page.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {pages && pages.length === 0 && !selectedTemplate && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <FileEdit className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No pages yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first event page using one of our templates. 
              Perfect for farewells, annual days, and special events.
            </p>
            <Button onClick={() => setTemplatePickerOpen(true)}>
              Create Your First Page
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Template Picker Dialog */}
      <TemplatePicker
        open={templatePickerOpen}
        onOpenChange={setTemplatePickerOpen}
        onSelect={handleSelectTemplate}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Page?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the page and all its sections. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
