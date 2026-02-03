import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  FileEdit, 
  Save, 
  Loader2, 
  GraduationCap, 
  Calendar, 
  Sparkles,
  Plus,
  ExternalLink,
  Camera
} from 'lucide-react';
import { useCollections } from '@/hooks/useDatabase';
import { useBranch } from '@/contexts/BranchContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

// Special page types that can be created
const SPECIAL_PAGE_TYPES = [
  { 
    id: 'farewell_2025', 
    name: 'Farewell 2025', 
    description: 'The graduating class of 2025 celebration page',
    icon: GraduationCap,
    route: '/farewell-2025'
  },
  { 
    id: 'annual_day', 
    name: 'Annual Day', 
    description: 'Annual day celebration and performances',
    icon: Calendar,
    route: '/annual-day'
  },
];

export function PageEditor() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { selectedBranchId } = useBranch();
  const { data: collections, isLoading } = useCollections(selectedBranchId || undefined);

  // Find special page collections (those with page_type set)
  // For now, we'll use tags as a proxy for page types
  const specialPageCollections = collections?.filter(c => 
    c.tags.some(t => t.name.toLowerCase().includes('farewell'))
  );

  const handleCreateSpecialPage = async (pageType: typeof SPECIAL_PAGE_TYPES[0]) => {
    if (!selectedBranchId) {
      toast({
        title: 'Select a branch first',
        description: 'Please select a branch from the header to create a special page.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create a new collection with the page type tag
      const { data, error } = await supabase.from('collections').insert({
        title: pageType.name,
        description: `${pageType.description} for your branch`,
        branch_id: selectedBranchId,
        is_featured: true,
      }).select().single();

      if (error) throw error;

      // Try to find the farewell tag and link it
      const { data: farewellTag } = await supabase
        .from('tags')
        .select('id')
        .eq('name', 'Farewell')
        .maybeSingle();

      if (farewellTag && data) {
        await supabase.from('collection_tags').insert({
          collection_id: data.id,
          tag_id: farewellTag.id,
        });
      }

      queryClient.invalidateQueries({ queryKey: ['collections'] });
      
      toast({
        title: '✓ Special page created!',
        description: 'Now customize it in the editor.',
      });

      // Navigate to collection editor
      navigate(`/admin/collection/${data.id}`);
    } catch (error: any) {
      console.error('Error creating special page:', error);
      toast({
        title: 'Error creating page',
        description: error.message,
        variant: 'destructive',
      });
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
            Special Event Pages
          </CardTitle>
          <CardDescription className="text-base">
            Create dedicated pages for major school events like farewells, annual days, and more. 
            These pages get their own route and can be customized with photos and content.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Existing Special Pages */}
      {specialPageCollections && specialPageCollections.length > 0 && (
        <div>
          <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Your Special Pages
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {specialPageCollections.map((collection) => (
              <Card key={collection.id} className="group hover:shadow-elegant transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {collection.cover_image_url ? (
                        <img 
                          src={collection.cover_image_url} 
                          alt={collection.title}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center">
                          <Camera className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{collection.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {collection.description || 'No description'}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {collection.tags.map(tag => (
                            <Badge 
                              key={tag.id} 
                              variant="secondary"
                              style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/admin/collection/${collection.id}`)}
                    >
                      <FileEdit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/collection/${collection.id}`)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create New Special Pages */}
      <div>
        <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Create New Event Page
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {SPECIAL_PAGE_TYPES.map((pageType) => {
            const IconComponent = pageType.icon;
            return (
              <Card 
                key={pageType.id} 
                className="cursor-pointer hover:shadow-elegant hover:border-primary/50 transition-all group"
                onClick={() => handleCreateSpecialPage(pageType)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {pageType.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {pageType.description}
                      </p>
                      <p className="text-xs text-primary mt-2 font-medium">
                        Route: {pageType.route}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Site Content Editor */}
      <div className="pt-8 border-t border-border">
        <SiteContentEditor />
      </div>
    </div>
  );
}

// Site Content Editor for editing text across pages
function SiteContentEditor() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({
    hero_title: 'NCS Memories',
    hero_subtitle: 'Preserving moments. Celebrating journeys.',
    about_quote: 'Every photo holds a story, every memory deserves to live forever.',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // Upsert all content items
      for (const [key, value] of Object.entries(content)) {
        await supabase.from('site_content').upsert({
          page_name: 'home',
          section_key: key,
          content: value,
        }, { onConflict: 'page_name,section_key' });
      }
      
      toast({ title: '✓ Content saved!' });
    } catch (error: any) {
      toast({
        title: 'Error saving',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <FileEdit className="h-5 w-5 text-accent" />
          </div>
          Site Content
        </CardTitle>
        <CardDescription>
          Edit text that appears across the website
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label>Homepage Title</Label>
          <Input 
            value={content.hero_title}
            onChange={(e) => setContent(prev => ({ ...prev, hero_title: e.target.value }))}
            placeholder="NCS Memories"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Homepage Subtitle</Label>
          <Textarea 
            value={content.hero_subtitle}
            onChange={(e) => setContent(prev => ({ ...prev, hero_subtitle: e.target.value }))}
            placeholder="Preserving moments. Celebrating journeys."
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>About Section Quote</Label>
          <Textarea 
            value={content.about_quote}
            onChange={(e) => setContent(prev => ({ ...prev, about_quote: e.target.value }))}
            placeholder="Every photo holds a story..."
            rows={2}
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Content
        </Button>
      </CardContent>
    </Card>
  );
}

