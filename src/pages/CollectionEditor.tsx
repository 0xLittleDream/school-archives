import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCollection, usePhotos } from '@/hooks/useDatabase';
import { useUpdateCollection } from '@/hooks/useAdminMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  Save,
  Eye,
  Camera,
  Upload,
  X,
  Check,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const CollectionEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: collection, isLoading } = useCollection(id || '');
  const { data: photos, isLoading: photosLoading } = usePhotos(id || '');
  const updateMutation = useUpdateCollection();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize form when collection loads
  if (collection && !isInitialized) {
    setTitle(collection.title || '');
    setDescription(collection.description || '');
    setCoverImage(collection.cover_image_url || '');
    setIsFeatured(collection.is_featured || false);
    setIsInitialized(true);
  }

  // Handle cover image upload
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save collection details
  const handleSave = async () => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        id,
        title,
        description: description || undefined,
        cover_image_url: coverImage || undefined,
        is_featured: isFeatured,
      });
      
      toast({
        title: '✓ Saved Successfully',
        description: 'Collection details have been updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Error Saving',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Add photos to collection
  const handleAddPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !id) return;

    setIsSaving(true);
    const currentPhotoCount = photos?.length || 0;
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        await new Promise<void>((resolve, reject) => {
          reader.onloadend = async () => {
            try {
              await supabase.from('photos').insert({
                collection_id: id,
                image_url: reader.result as string,
                sort_order: currentPhotoCount + i,
              });
              resolve();
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      // Update photo count
      await supabase
        .from('collections')
        .update({ photo_count: currentPhotoCount + files.length })
        .eq('id', id);

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['photos', id] });
      queryClient.invalidateQueries({ queryKey: ['collection', id] });
      
      toast({
        title: '✓ Photos Added',
        description: `${files.length} photo(s) added to the collection.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error Adding Photos',
        description: error.message || 'Failed to add photos.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a photo
  const handleDeletePhoto = async (photoId: string) => {
    if (!id) return;
    
    try {
      await supabase.from('photos').delete().eq('id', photoId);
      
      // Update photo count
      const newCount = Math.max(0, (photos?.length || 1) - 1);
      await supabase
        .from('collections')
        .update({ photo_count: newCount })
        .eq('id', id);

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['photos', id] });
      queryClient.invalidateQueries({ queryKey: ['collection', id] });
      
      toast({ title: '✓ Photo Removed' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete photo.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </Layout>
    );
  }

  if (!collection) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Collection Not Found</h1>
          <Button asChild size="lg">
            <Link to="/admin">← Back to Admin</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Simple Header */}
      <div className="sticky top-0 z-30 bg-background border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="lg" asChild className="gap-2 text-base">
                <Link to="/admin">
                  <ArrowLeft className="h-5 w-5" />
                  Back
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="lg" asChild className="gap-2">
                <Link to={`/collection/${collection.id}`}>
                  <Eye className="h-5 w-5" />
                  View Page
                </Link>
              </Button>
              <Button 
                size="lg" 
                onClick={handleSave} 
                disabled={isSaving}
                className="gap-2 min-w-[120px]"
              >
                {isSaving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        {/* Section 1: Basic Details */}
        <div className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-8">
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
            Collection Details
          </h2>

          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-semibold">
                Title *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Class XII Farewell 2025"
                className="h-14 text-lg rounded-xl"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a short description about this collection..."
                rows={4}
                className="text-base rounded-xl resize-none"
              />
            </div>

            {/* Featured Toggle */}
            <div 
              onClick={() => setIsFeatured(!isFeatured)}
              className="flex items-center gap-4 p-5 rounded-xl border border-border bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors"
            >
              <Checkbox
                checked={isFeatured}
                onCheckedChange={(checked) => setIsFeatured(!!checked)}
                className="h-6 w-6"
              />
              <div>
                <p className="font-semibold text-base">⭐ Show on Homepage</p>
                <p className="text-sm text-muted-foreground">
                  Display this collection in the featured section
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Cover Image */}
        <div className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-8">
          <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
            Cover Image
          </h2>

          {coverImage ? (
            <div className="relative rounded-xl overflow-hidden bg-secondary aspect-video max-w-lg">
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setCoverImage('')}
                className="absolute top-3 right-3 p-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary hover:bg-primary/5 transition-all">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <p className="text-lg font-semibold mb-1">Click to upload cover image</p>
                <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
              </div>
            </label>
          )}
        </div>

        {/* Section 3: Photos */}
        <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
              Photos ({photos?.length || 0})
            </h2>
            
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddPhotos}
                className="hidden"
                disabled={isSaving}
              />
              <Button asChild size="lg" className="gap-2 pointer-events-none">
                <span>
                  <Camera className="h-5 w-5" />
                  Add Photos
                </span>
              </Button>
            </label>
          </div>

          {photosLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          ) : photos && photos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative aspect-square rounded-xl overflow-hidden bg-secondary group"
                >
                  <img
                    src={photo.image_url}
                    alt={photo.caption || `Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/60 text-white text-xs">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-secondary/30 rounded-xl">
              <Camera className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No photos yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Click "Add Photos" to upload images
              </p>
            </div>
          )}
        </div>

        {/* Bottom Save Button */}
        <div className="mt-8 flex justify-center">
          <Button 
            size="lg" 
            onClick={handleSave} 
            disabled={isSaving}
            className="gap-2 h-14 px-10 text-lg rounded-xl"
          >
            {isSaving ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Check className="h-6 w-6" />
            )}
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CollectionEditor;
