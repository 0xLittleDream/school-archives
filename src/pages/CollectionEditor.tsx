import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCollection } from '@/hooks/useDatabase';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Plus,
  Image,
  Type,
  LayoutPanelLeft,
  Grid3X3,
  Save,
  Eye,
  GripVertical,
  Settings,
} from 'lucide-react';
import { ContentBlockRenderer } from '@/components/collection/ContentBlockRenderer';
import { ContentBlockEditor } from '@/components/collection/ContentBlockEditor';
import type { ContentBlock, ContentBlockType } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

// Mock content blocks for demo (would come from database)
const mockBlocks: ContentBlock[] = [];

const blockTypeOptions = [
  { type: 'image' as ContentBlockType, label: 'Image', icon: Image, description: 'Single prominent image' },
  { type: 'image_text' as ContentBlockType, label: 'Image + Text', icon: LayoutPanelLeft, description: 'Image with description' },
  { type: 'text' as ContentBlockType, label: 'Text', icon: Type, description: 'Title and paragraphs' },
  { type: 'gallery' as ContentBlockType, label: 'Gallery', icon: Grid3X3, description: 'Multiple images grid' },
];

const CollectionEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: collection, isLoading } = useCollection(id || '');
  
  const [blocks, setBlocks] = useState<ContentBlock[]>(mockBlocks);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const handleAddBlock = (type: ContentBlockType) => {
    setEditingBlock({
      id: crypto.randomUUID(),
      collection_id: id || '',
      block_type: type,
      title: null,
      content: null,
      image_url: null,
      image_position: 'left',
      gallery_images: null,
      sort_order: blocks.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setIsEditorOpen(true);
    setShowAddMenu(false);
  };

  const handleEditBlock = (block: ContentBlock) => {
    setEditingBlock(block);
    setIsEditorOpen(true);
  };

  const handleSaveBlock = (data: Partial<ContentBlock>) => {
    if (editingBlock) {
      const existingIndex = blocks.findIndex(b => b.id === editingBlock.id);
      if (existingIndex >= 0) {
        // Update existing
        const updatedBlocks = [...blocks];
        updatedBlocks[existingIndex] = { ...editingBlock, ...data };
        setBlocks(updatedBlocks);
      } else {
        // Add new
        setBlocks([...blocks, { ...editingBlock, ...data }]);
      }
      toast({ title: 'Block saved' });
    }
    setIsEditorOpen(false);
    setEditingBlock(null);
  };

  const handleDeleteBlock = () => {
    if (editingBlock) {
      setBlocks(blocks.filter(b => b.id !== editingBlock.id));
      toast({ title: 'Block deleted' });
    }
    setIsEditorOpen(false);
    setEditingBlock(null);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <Skeleton className="h-8 w-48 mb-8" />
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
          <Button asChild>
            <Link to="/admin">Back to Admin</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Editor Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/admin">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="font-display text-xl md:text-2xl font-bold line-clamp-1">
                  {collection.title}
                </h1>
                <p className="text-sm text-muted-foreground">Editing collection content</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild className="gap-2">
                <Link to={`/collection/${collection.id}`}>
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Preview</span>
                </Link>
              </Button>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save Changes</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Collection Header Info */}
        <div className="mb-10 p-6 rounded-2xl bg-card border border-border">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Cover Image */}
            <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
              {collection.cover_image_url ? (
                <img
                  src={collection.cover_image_url}
                  alt={collection.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Image className="h-8 w-8" />
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold mb-2">{collection.title}</h2>
              {collection.description && (
                <p className="text-muted-foreground mb-4 line-clamp-2">{collection.description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm">
                {collection.event_date && (
                  <span className="text-muted-foreground">
                    📅 {new Date(collection.event_date).toLocaleDateString()}
                  </span>
                )}
                {collection.branch && (
                  <span className="text-muted-foreground">
                    📍 {collection.branch.name}
                  </span>
                )}
                <span className="text-muted-foreground">
                  📸 {collection.photo_count} photos
                </span>
              </div>
            </div>
            
            {/* Edit Settings Button */}
            <Button variant="outline" className="gap-2 self-start">
              <Settings className="h-4 w-4" />
              Edit Details
            </Button>
          </div>
        </div>

        {/* Content Blocks Area */}
        <div className="space-y-6 mb-10">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold">Content Blocks</h3>
            <p className="text-sm text-muted-foreground">
              {blocks.length} block{blocks.length !== 1 ? 's' : ''}
            </p>
          </div>

          {blocks.length > 0 ? (
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <div key={block.id} className="flex gap-3 items-start group">
                  <button className="p-2 rounded-lg bg-secondary opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                  </button>
                  <div className="flex-1">
                    <ContentBlockRenderer
                      block={block}
                      isEditing
                      onEdit={() => handleEditBlock(block)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-secondary/30 rounded-2xl border-2 border-dashed border-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-display text-xl font-semibold mb-2">Start Adding Content</h4>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Add images, text, and galleries to create a beautiful story for this collection.
              </p>
            </div>
          )}
        </div>

        {/* Add Block Section */}
        <div className="relative">
          {showAddMenu ? (
            <div className="p-6 rounded-2xl bg-card border border-border animate-fade-in">
              <h4 className="font-semibold mb-4">Choose a block type</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {blockTypeOptions.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => handleAddBlock(option.type)}
                    className="p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-secondary group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
                      <option.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h5 className="font-semibold mb-1">{option.label}</h5>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </button>
                ))}
              </div>
              <Button variant="ghost" className="mt-4" onClick={() => setShowAddMenu(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setShowAddMenu(true)}
              variant="outline"
              className="w-full h-14 gap-2 border-dashed hover:border-primary hover:bg-primary/5"
            >
              <Plus className="h-5 w-5" />
              Add Content Block
            </Button>
          )}
        </div>
      </div>

      {/* Block Editor Dialog */}
      <ContentBlockEditor
        block={editingBlock}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingBlock(null);
        }}
        onSave={handleSaveBlock}
        onDelete={editingBlock && blocks.find(b => b.id === editingBlock.id) ? handleDeleteBlock : undefined}
      />
    </Layout>
  );
};

export default CollectionEditor;
