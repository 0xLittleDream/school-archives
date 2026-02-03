import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Plus,
  ImageIcon,
  Type,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const CollectionEditor = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: collection, isLoading } = useCollection(id || '');
  const { data: photos, isLoading: photosLoading, refetch: refetchPhotos } = usePhotos(id || '');
  const updateMutation = useUpdateCollection();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Initialize form when collection loads
  useEffect(() => {
    if (collection && !isInitialized) {
      setTitle(collection.title || '');
      setDescription(collection.description || '');
      setCoverImage(collection.cover_image_url || '');
      setIsFeatured(collection.is_featured || false);
      setIsInitialized(true);
    }
  }, [collection, isInitialized]);

  // Handle cover image upload
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please use an image under 5MB',
          variant: 'destructive',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save collection details
  const handleSave = async () => {
    if (!id || !title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for the collection',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        id,
        title: title.trim(),
        description: description.trim() || undefined,
        cover_image_url: coverImage || undefined,
        is_featured: isFeatured,
      });
      
      toast({
        title: '✓ Saved!',
        description: 'Collection updated successfully.',
      });
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: 'Error Saving',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Add photos to collection - FIXED with proper error handling
  const handleAddPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !id) return;

    setUploadProgress('Uploading...');
    const currentPhotoCount = photos?.length || 0;
    let successCount = 0;
    let errorCount = 0;
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check file size (max 5MB per image)
        if (file.size > 5 * 1024 * 1024) {
          errorCount++;
          continue;
        }

        setUploadProgress(`Uploading ${i + 1} of ${files.length}...`);
        
        // Read file as data URL
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
        
        // Insert into database
        const { error } = await supabase.from('photos').insert({
          collection_id: id,
          image_url: dataUrl,
          sort_order: currentPhotoCount + successCount,
        });
        
        if (error) {
          console.error('Photo insert error:', error);
          errorCount++;
        } else {
          successCount++;
        }
      }

      // Update photo count on collection
      if (successCount > 0) {
        await supabase
          .from('collections')
          .update({ photo_count: currentPhotoCount + successCount })
          .eq('id', id);
      }

      // Refresh data
      await refetchPhotos();
      queryClient.invalidateQueries({ queryKey: ['collection', id] });
      
      if (successCount > 0) {
        toast({
          title: `✓ ${successCount} photo(s) added!`,
          description: errorCount > 0 ? `${errorCount} failed (too large)` : undefined,
        });
      } else {
        toast({
          title: 'Upload failed',
          description: 'Could not add photos. Check file sizes (max 5MB each).',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Error',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploadProgress(null);
      // Reset input
      e.target.value = '';
    }
  };

  // Delete a photo
  const handleDeletePhoto = async (photoId: string) => {
    if (!id) return;
    
    try {
      const { error } = await supabase.from('photos').delete().eq('id', photoId);
      
      if (error) throw error;
      
      // Update photo count
      const newCount = Math.max(0, (photos?.length || 1) - 1);
      await supabase
        .from('collections')
        .update({ photo_count: newCount })
        .eq('id', id);

      // Refresh data
      await refetchPhotos();
      queryClient.invalidateQueries({ queryKey: ['collection', id] });
      
      toast({ title: '✓ Photo removed' });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: 'Could not delete photo.',
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
          <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-display text-2xl font-bold mb-4">Collection Not Found</h1>
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
        <div className="container py-3 md:py-4">
          <div className="flex items-center justify-between gap-2">
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link to="/admin">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/collection/${collection.id}`}>
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Preview</span>
                </Link>
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave} 
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 md:py-8 max-w-3xl">
        {/* Section 1: Basic Details */}
        <div className="bg-card rounded-2xl border border-border p-5 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold mb-5 flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
            Collection Details
          </h2>

          <div className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">
                Title *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Class XII Farewell 2025"
                className="h-12 text-base rounded-xl"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write about this collection..."
                rows={3}
                className="text-base rounded-xl resize-none"
              />
            </div>

            {/* Featured Toggle */}
            <label className="flex items-center gap-4 p-4 rounded-xl border border-border bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors">
              <Checkbox
                checked={isFeatured}
                onCheckedChange={(checked) => setIsFeatured(!!checked)}
                className="h-5 w-5"
              />
              <div>
                <p className="font-medium">⭐ Show on Homepage</p>
                <p className="text-sm text-muted-foreground">
                  Feature this collection on the home page
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Section 2: Cover Image */}
        <div className="bg-card rounded-2xl border border-border p-5 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold mb-5 flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
            Cover Image
          </h2>

          {coverImage ? (
            <div className="relative rounded-xl overflow-hidden bg-secondary aspect-video">
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setCoverImage('')}
                className="absolute top-3 right-3 p-2 rounded-full bg-destructive text-destructive-foreground shadow-lg"
              >
                <X className="h-4 w-4" />
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
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-all">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="h-7 w-7 text-primary" />
                </div>
                <p className="font-medium mb-1">Tap to upload cover image</p>
                <p className="text-sm text-muted-foreground">JPG, PNG (max 5MB)</p>
              </div>
            </label>
          )}
        </div>

        {/* Section 3: Photos */}
        <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
              Photos ({photos?.length || 0})
            </h2>
            
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddPhotos}
                className="hidden"
                disabled={!!uploadProgress}
              />
              <Button asChild size="default" disabled={!!uploadProgress} className="gap-2 pointer-events-none">
                <span>
                  {uploadProgress ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {uploadProgress || 'Add Photos'}
                </span>
              </Button>
            </label>
          </div>

          {photosLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          ) : photos && photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                    className="absolute top-2 right-2 p-2 rounded-full bg-destructive text-destructive-foreground shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 text-white text-xs font-medium">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-secondary/30 rounded-xl">
              <Camera className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground font-medium">No photos yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Tap "Add Photos" to upload
              </p>
            </div>
          )}
        </div>

        {/* Bottom Save Button */}
        <div className="mt-6 flex justify-center">
          <Button 
            size="lg" 
            onClick={handleSave} 
            disabled={isSaving}
            className="gap-2 h-12 px-8 text-base rounded-xl w-full sm:w-auto"
          >
            {isSaving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Check className="h-5 w-5" />
            )}
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CollectionEditor;
