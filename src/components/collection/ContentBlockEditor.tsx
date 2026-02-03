import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Image, Type, LayoutPanelLeft, Grid3X3, Trash2 } from 'lucide-react';
import type { ContentBlock, ContentBlockType } from '@/types/database';

interface ContentBlockEditorProps {
  block?: ContentBlock | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ContentBlock>) => void;
  onDelete?: () => void;
}

const blockTypeOptions: { value: ContentBlockType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'image', label: 'Image', icon: <Image className="h-5 w-5" />, description: 'A single prominent image' },
  { value: 'image_text', label: 'Image + Text', icon: <LayoutPanelLeft className="h-5 w-5" />, description: 'Image alongside descriptive text' },
  { value: 'text', label: 'Text Only', icon: <Type className="h-5 w-5" />, description: 'Title and paragraph text' },
  { value: 'gallery', label: 'Photo Gallery', icon: <Grid3X3 className="h-5 w-5" />, description: 'Grid of multiple images' },
];

export function ContentBlockEditor({ block, isOpen, onClose, onSave, onDelete }: ContentBlockEditorProps) {
  const [blockType, setBlockType] = useState<ContentBlockType>(block?.block_type || 'image');
  const [title, setTitle] = useState(block?.title || '');
  const [content, setContent] = useState(block?.content || '');
  const [imageUrl, setImageUrl] = useState(block?.image_url || '');
  const [imagePosition, setImagePosition] = useState<'left' | 'right'>(block?.image_position || 'left');
  const [galleryImages, setGalleryImages] = useState<string[]>(block?.gallery_images || []);
  const [newGalleryImage, setNewGalleryImage] = useState('');

  const handleSave = () => {
    onSave({
      block_type: blockType,
      title: title || null,
      content: content || null,
      image_url: imageUrl || null,
      image_position: imagePosition,
      gallery_images: galleryImages.length > 0 ? galleryImages : null,
    });
    onClose();
  };

  const addGalleryImage = () => {
    if (newGalleryImage) {
      setGalleryImages([...galleryImages, newGalleryImage]);
      setNewGalleryImage('');
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {block ? 'Edit Content Block' : 'Add Content Block'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Block Type Selection */}
          {!block && (
            <div className="space-y-3">
              <Label>Block Type</Label>
              <div className="grid grid-cols-2 gap-3">
                {blockTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setBlockType(option.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      blockType === option.value 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${blockType === option.value ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                        {option.icon}
                      </div>
                      <span className="font-semibold">{option.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title - for all types */}
          <div className="space-y-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this block..."
            />
          </div>

          {/* Content - for text and image_text */}
          {(blockType === 'text' || blockType === 'image_text') && (
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your content here..."
                rows={6}
              />
            </div>
          )}

          {/* Single Image - for image and image_text */}
          {(blockType === 'image' || blockType === 'image_text') && (
            <div className="space-y-2">
              <Label>Image</Label>
              <ImageUploader
                value={imageUrl}
                onChange={setImageUrl}
              />
            </div>
          )}

          {/* Image Position - for image_text */}
          {blockType === 'image_text' && (
            <div className="space-y-2">
              <Label>Image Position</Label>
              <Select value={imagePosition} onValueChange={(v) => setImagePosition(v as 'left' | 'right')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Gallery Images - for gallery */}
          {blockType === 'gallery' && (
            <div className="space-y-4">
              <Label>Gallery Images</Label>
              
              {/* Current images */}
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {galleryImages.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeGalleryImage(i)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <Trash2 className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new image */}
              <div className="space-y-2">
                <ImageUploader
                  value={newGalleryImage}
                  onChange={(url) => {
                    if (url) {
                      setGalleryImages([...galleryImages, url]);
                    }
                    setNewGalleryImage('');
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-3 pt-4 border-t">
          <div>
            {block && onDelete && (
              <Button variant="destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Block
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>
              {block ? 'Save Changes' : 'Add Block'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
