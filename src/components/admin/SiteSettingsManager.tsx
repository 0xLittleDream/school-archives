import { useState, useEffect } from 'react';
import { Settings2, GripVertical, Lock, Plus, Trash2, Eye, EyeOff, Save, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface NavItem {
  id: string;
  label: string;
  href: string;
  isLocked: boolean;
  isVisible: boolean;
  order: number;
}

// Core pages that cannot be removed
const CORE_PAGES: NavItem[] = [
  { id: 'home', label: 'Home', href: '/', isLocked: true, isVisible: true, order: 0 },
  { id: 'memories', label: 'Memories', href: '/memories', isLocked: true, isVisible: true, order: 1 },
  { id: 'about', label: 'About', href: '/about', isLocked: true, isVisible: true, order: 2 },
];

const SETTINGS_KEY = 'site_navigation';

export function SiteSettingsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [navItems, setNavItems] = useState<NavItem[]>(CORE_PAGES);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch custom pages that can be added to navigation
  const { data: customPages = [] } = useQuery({
    queryKey: ['custom_pages_for_nav'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_pages')
        .select('id, title, slug, is_published')
        .eq('is_published', true)
        .order('title');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch saved navigation settings
  const { data: savedSettings } = useQuery({
    queryKey: ['site_settings', SETTINGS_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content_value')
        .eq('content_key', SETTINGS_KEY)
        .maybeSingle();
      
      if (error) throw error;
      return data?.content_value ? JSON.parse(data.content_value) : null;
    },
  });

  // Load saved settings
  useEffect(() => {
    if (savedSettings?.navItems) {
      // Merge with core pages to ensure they're always present
      const savedNav = savedSettings.navItems as NavItem[];
      const mergedNav = CORE_PAGES.map(core => {
        const saved = savedNav.find(s => s.id === core.id);
        return saved ? { ...core, isVisible: saved.isVisible, order: saved.order } : core;
      });
      
      // Add custom pages from saved settings
      const customNavItems = savedNav.filter(s => !CORE_PAGES.some(c => c.id === s.id));
      setNavItems([...mergedNav, ...customNavItems].sort((a, b) => a.order - b.order));
    }
  }, [savedSettings]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (items: NavItem[]) => {
      const { data: existing } = await supabase
        .from('site_content')
        .select('id')
        .eq('content_key', SETTINGS_KEY)
        .maybeSingle();

      const payload = {
        content_key: SETTINGS_KEY,
        content_type: 'json',
        content_value: JSON.stringify({ navItems: items }),
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        const { error } = await supabase
          .from('site_content')
          .update(payload)
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_content')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_settings'] });
      setHasChanges(false);
      toast({ title: '✓ Navigation settings saved!' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const handleToggleVisibility = (id: string) => {
    const item = navItems.find(n => n.id === id);
    if (item?.isLocked) return; // Cannot hide locked items
    
    setNavItems(prev => prev.map(n => 
      n.id === id ? { ...n, isVisible: !n.isVisible } : n
    ));
    setHasChanges(true);
  };

  const handleAddCustomPage = (pageId: string) => {
    const page = customPages.find(p => p.id === pageId);
    if (!page) return;
    
    // Check if already added
    if (navItems.some(n => n.href === `/page/${page.slug}`)) {
      toast({ title: 'Page already in navigation', variant: 'destructive' });
      return;
    }

    const newItem: NavItem = {
      id: `custom-${page.id}`,
      label: page.title,
      href: `/page/${page.slug}`,
      isLocked: false,
      isVisible: true,
      order: navItems.length,
    };

    setNavItems(prev => [...prev, newItem]);
    setHasChanges(true);
  };

  const handleRemoveItem = (id: string) => {
    const item = navItems.find(n => n.id === id);
    if (item?.isLocked) return;
    
    setNavItems(prev => prev.filter(n => n.id !== id));
    setHasChanges(true);
  };

  const handleLabelChange = (id: string, newLabel: string) => {
    setNavItems(prev => prev.map(n => 
      n.id === id ? { ...n, label: newLabel } : n
    ));
    setHasChanges(true);
  };

  const handleSave = () => {
    saveMutation.mutate(navItems);
  };

  // Available pages to add (not already in nav)
  const availablePages = customPages.filter(
    p => !navItems.some(n => n.href === `/page/${p.slug}`)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" />
                Site Settings
              </CardTitle>
              <CardDescription>
                Manage navigation menu and site-wide settings
              </CardDescription>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={!hasChanges || saveMutation.isPending}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Navigation Items */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Navigation Menu</Label>
            <p className="text-sm text-muted-foreground">
              Configure which pages appear in the site navigation. Core pages (marked with 🔒) cannot be removed.
            </p>
            
            <div className="space-y-2">
              {navItems.map((item, index) => (
                <div 
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    item.isVisible ? 'bg-background' : 'bg-muted/50 opacity-60'
                  }`}
                >
                  {/* Drag handle (future: implement drag-to-reorder) */}
                  <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-move" />
                  
                  {/* Order number */}
                  <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  
                  {/* Label input */}
                  <Input
                    value={item.label}
                    onChange={(e) => handleLabelChange(item.id, e.target.value)}
                    className="flex-1 max-w-[200px]"
                    disabled={item.isLocked}
                  />
                  
                  {/* URL display */}
                  <span className="text-sm text-muted-foreground font-mono flex-1">
                    {item.href}
                  </span>
                  
                  {/* Locked badge */}
                  {item.isLocked && (
                    <Badge variant="secondary" className="gap-1">
                      <Lock className="h-3 w-3" />
                      Core
                    </Badge>
                  )}
                  
                  {/* Visibility toggle */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleVisibility(item.id)}
                    disabled={item.isLocked}
                    className={item.isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {item.isVisible ? (
                      <Eye className="h-4 w-4 text-primary" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  
                  {/* Remove button (only for non-locked) */}
                  {!item.isLocked && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add Custom Page */}
          {availablePages.length > 0 && (
            <div className="space-y-3 pt-4 border-t">
              <Label>Add Page to Navigation</Label>
              <div className="flex gap-2">
                <Select onValueChange={handleAddCustomPage}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a published page..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePages.map((page) => (
                      <SelectItem key={page.id} value={page.id}>
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-3 w-3" />
                          {page.title}
                          <span className="text-muted-foreground text-xs">
                            /page/{page.slug}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">
                Only published custom pages can be added to the navigation
              </p>
            </div>
          )}

          {/* Preview */}
          <div className="pt-4 border-t">
            <Label className="mb-3 block">Navigation Preview</Label>
            <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg">
              {navItems.filter(n => n.isVisible).map((item) => (
                <span 
                  key={item.id}
                  className="px-3 py-1.5 bg-background rounded-md text-sm font-medium border"
                >
                  {item.label}
                </span>
              ))}
              <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm font-medium border border-primary/20">
                Admin
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Admin link only appears for authenticated administrators
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
