import { useState, useRef, useCallback } from 'react';
import { Upload, X, Plus, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCollections } from '@/hooks/useDatabase';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  caption?: string;
}

export function PhotoUploader() {
  const { toast } = useToast();
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: collections, isLoading: collectionsLoading } = useCollections();

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: UploadedImage[] = Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      }));

    setUploadedImages(prev => [...prev, ...newImages]);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleUpload = async () => {
    if (!selectedCollectionId) {
      toast({
        title: 'Please select a collection',
        description: 'Choose which collection these photos belong to.',
        variant: 'destructive',
      });
      return;
    }

    if (uploadedImages.length === 0) {
      toast({
        title: 'No photos selected',
        description: 'Please add some photos to upload.',
        variant: 'destructive',
      });
      return;
    }

    // For now, show a message about storage setup
    toast({
      title: 'Storage Setup Required',
      description: 'To upload photos, you need to set up Supabase Storage. Create a "photos" bucket in your Supabase dashboard.',
    });
  };

  const clearAll = () => {
    uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    setUploadedImages([]);
  };

  return (
    <div className="space-y-6">
      {/* Collection Selector */}
      <div className="p-6 bg-card rounded-xl border border-border">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Select Collection
        </h3>
        {collectionsLoading ? (
          <Skeleton className="h-10 w-full max-w-sm" />
        ) : collections && collections.length > 0 ? (
          <Select value={selectedCollectionId} onValueChange={setSelectedCollectionId}>
            <SelectTrigger className="w-full max-w-sm">
              <SelectValue placeholder="Choose a collection..." />
            </SelectTrigger>
            <SelectContent>
              {collections.map((collection) => (
                <SelectItem key={collection.id} value={collection.id}>
                  {collection.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="flex items-center gap-3 text-muted-foreground">
            <FolderOpen className="h-5 w-5" />
            <span>No collections available. Create a collection first.</span>
          </div>
        )}
      </div>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200',
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-border hover:border-primary/50 hover:bg-secondary/50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              Click to upload or drag & drop
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              PNG, JPG, WEBP • Multiple files supported • Up to 10MB each
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Images Preview */}
      {uploadedImages.length > 0 && (
        <div className="p-6 bg-card rounded-xl border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Selected Photos ({uploadedImages.length})
            </h3>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear All
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {uploadedImages.map((image) => (
              <div
                key={image.id}
                className="relative group aspect-square rounded-xl overflow-hidden bg-secondary"
              >
                <img
                  src={image.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(image.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            {/* Add More Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-secondary/50 transition-colors flex flex-col items-center justify-center gap-2"
            >
              <Plus className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Add More</span>
            </button>
          </div>

          {/* Upload Button */}
          <div className="pt-4 border-t border-border flex justify-end">
            <Button onClick={handleUpload} className="gap-2">
              <Upload className="h-4 w-4" />
              Upload {uploadedImages.length} Photo{uploadedImages.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
