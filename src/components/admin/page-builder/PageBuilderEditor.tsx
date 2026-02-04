import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  GripVertical,
  Loader2,
  Image,
  FileText,
  Images,
  BarChart3,
  Quote,
  MousePointerClick,
  Pencil
} from 'lucide-react';
import { 
  useCustomPageById, 
  useUpdateCustomPage,
  useCreatePageSection,
  useDeletePageSection,
  useReorderPageSections
} from '@/hooks/usePageBuilder';
import { useToast } from '@/hooks/use-toast';
import { SectionPicker } from './SectionPicker';
import { SectionEditor } from './SectionEditor';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { StudentTributeManager } from '@/components/admin/StudentTributeManager';
import type { PageSection, PageSectionType } from '@/types/pageBuilder';

const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  hero: Image,
  text_block: FileText,
  gallery: Images,
  stats: BarChart3,
  quote: Quote,
  cta: MousePointerClick,
};

const sectionLabels: Record<string, string> = {
  hero: 'Hero Section',
  text_block: 'Text Block',
  gallery: 'Photo Gallery',
  stats: 'Statistics',
  quote: 'Quote',
  cta: 'Call to Action',
};

export function PageBuilderEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: page, isLoading, refetch } = useCustomPageById(id || '');
  const updatePage = useUpdateCustomPage();
  const createSection = useCreatePageSection();
  const deleteSection = useDeletePageSection();
  const reorderSections = useReorderPageSections();

  const [sectionPickerOpen, setSectionPickerOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [localTitle, setLocalTitle] = useState('');
  const [localSlug, setLocalSlug] = useState('');
  const [localDescription, setLocalDescription] = useState('');
  const [localCoverImage, setLocalCoverImage] = useState('');
  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  // Initialize local state when page loads
  useState(() => {
    if (page) {
      setLocalTitle(page.title);
      setLocalSlug(page.slug);
      setLocalDescription(page.meta_description || '');
      setLocalCoverImage(page.cover_image_url || '');
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Page not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/admin')}>
          Back to Admin
        </Button>
      </div>
    );
  }

  const handleSaveSettings = async () => {
    try {
      await updatePage.mutateAsync({
        id: page.id,
        title: localTitle || page.title,
        slug: localSlug || page.slug,
        meta_description: localDescription || null,
        cover_image_url: localCoverImage || null,
      });
      setHasLocalChanges(false);
      toast({ title: '✓ Page settings saved!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleTogglePublish = async () => {
    try {
      await updatePage.mutateAsync({
        id: page.id,
        is_published: !page.is_published,
      });
      refetch();
      toast({ 
        title: page.is_published ? 'Page unpublished' : '✓ Page published!',
        description: page.is_published ? undefined : 'Your page is now live.'
      });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleAddSection = async (sectionType: PageSectionType) => {
    try {
      const maxOrder = Math.max(0, ...(page.sections?.map(s => s.sort_order) || []));
      await createSection.mutateAsync({
        page_id: page.id,
        section_type: sectionType,
        title: sectionLabels[sectionType] || 'New Section',
        sort_order: maxOrder + 1,
      });
      refetch();
      toast({ title: '✓ Section added!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      await deleteSection.mutateAsync({ id: sectionId, pageId: page.id });
      refetch();
      toast({ title: 'Section deleted' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleMoveSection = async (fromIndex: number, toIndex: number) => {
    if (!page.sections) return;
    
    const newOrder = [...page.sections];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    
    try {
      await reorderSections.mutateAsync({
        pageId: page.id,
        sectionIds: newOrder.map(s => s.id),
      });
      refetch();
    } catch (error: any) {
      toast({ title: 'Error reordering', description: error.message, variant: 'destructive' });
    }
  };

  const sections = page.sections || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {page.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              /page/{page.slug}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => window.open(`/page/${page.slug}`, '_blank')}
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
            <span className="text-sm text-muted-foreground">Published</span>
            <Switch 
              checked={page.is_published} 
              onCheckedChange={handleTogglePublish}
            />
          </div>
        </div>
      </div>

      {/* Page Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Page Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input
                value={localTitle || page.title}
                onChange={(e) => {
                  setLocalTitle(e.target.value);
                  setHasLocalChanges(true);
                }}
                placeholder="Farewell 2025"
              />
            </div>
            <div className="space-y-2">
              <Label>URL Slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">/page/</span>
                <Input
                  value={localSlug || page.slug}
                  onChange={(e) => {
                    setLocalSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
                    setHasLocalChanges(true);
                  }}
                  placeholder="farewell-2025"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Description (for SEO)</Label>
            <Textarea
              value={localDescription || page.meta_description || ''}
              onChange={(e) => {
                setLocalDescription(e.target.value);
                setHasLocalChanges(true);
              }}
              placeholder="A brief description of this page..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Cover Image</Label>
            <ImageUploader
              value={localCoverImage || page.cover_image_url || ''}
              onChange={(url) => {
                setLocalCoverImage(url);
                setHasLocalChanges(true);
              }}
            />
          </div>

          {hasLocalChanges && (
            <Button onClick={handleSaveSettings} disabled={updatePage.isPending} className="gap-2">
              {updatePage.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Settings
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Sections */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Page Sections</CardTitle>
          <Button onClick={() => setSectionPickerOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Section
          </Button>
        </CardHeader>
        <CardContent>
          {sections.length === 0 ? (
            <div className="text-center py-12 bg-secondary/30 rounded-xl border border-dashed border-border">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-4">No sections yet</p>
              <Button variant="outline" onClick={() => setSectionPickerOpen(true)}>
                Add Your First Section
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sections.map((section, index) => {
                const IconComponent = sectionIcons[section.section_type] || FileText;
                return (
                  <div 
                    key={section.id}
                    className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl border border-border hover:border-primary/30 transition-colors group"
                  >
                    <div className="cursor-grab text-muted-foreground hover:text-foreground">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    
                    <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {section.title || sectionLabels[section.section_type]}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {sectionLabels[section.section_type]}
                        </Badge>
                      </div>
                      {section.subtitle && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {section.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {index > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleMoveSection(index, index - 1)}
                        >
                          ↑
                        </Button>
                      )}
                      {index < sections.length - 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleMoveSection(index, index + 1)}
                        >
                          ↓
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setEditingSection(section)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteSection(section.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Tributes Manager (only for farewell pages) */}
      {page.page_type === 'farewell' && (
        <StudentTributeManager pageId={page.id} />
      )}

      {/* Section Picker Modal */}
      <SectionPicker
        open={sectionPickerOpen}
        onOpenChange={setSectionPickerOpen}
        onSelect={handleAddSection}
      />

      {/* Section Editor Modal */}
      <SectionEditor
        section={editingSection}
        open={!!editingSection}
        onOpenChange={(open) => !open && setEditingSection(null)}
        onSaved={() => refetch()}
      />
    </div>
  );
}
