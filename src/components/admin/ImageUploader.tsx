import { useState, useRef, useCallback } from 'react';
import { Upload, X, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUploader({ value, onChange, className }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const [previewUrl, setPreviewUrl] = useState(value || '');
  // Prioritize upload tab - only show URL tab if explicitly using a URL
  const [activeTab, setActiveTab] = useState<string>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      onChange(result);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

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
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput) {
      setPreviewUrl(urlInput);
      onChange(urlInput);
    }
  };

  const clearImage = () => {
    setPreviewUrl('');
    setUrlInput('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="url" className="gap-2">
            <LinkIcon className="h-4 w-4" />
            URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200',
              isDragging
                ? 'border-primary bg-primary/5 scale-[1.02]'
                : 'border-border hover:border-primary/50 hover:bg-secondary/50'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, WEBP up to 10MB
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="url" className="mt-3">
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
            />
            <Button type="button" onClick={handleUrlSubmit} variant="secondary">
              Load
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview */}
      {previewUrl && (
        <div className="relative rounded-xl overflow-hidden bg-secondary aspect-video group">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={() => {
              setPreviewUrl('');
            }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={clearImage}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
