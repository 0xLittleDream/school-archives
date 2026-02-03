import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Upload, FolderOpen, FileEdit, Plus } from 'lucide-react';
import { useCollections } from '@/hooks/useDatabase';
import {
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
} from '@/hooks/useAdminMutations';
import { CollectionCard } from '@/components/admin/CollectionCard';
import { CollectionForm } from '@/components/admin/CollectionForm';
import { BranchSelector } from '@/components/admin/BranchSelector';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { CollectionWithTags } from '@/types/database';

const Admin = () => {
  const { toast } = useToast();
  const [selectedBranchId, setSelectedBranchId] = useState<string>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionWithTags | null>(null);
  const [deletingCollection, setDeletingCollection] = useState<CollectionWithTags | null>(null);

  const { data: collections, isLoading } = useCollections(selectedBranchId);
  const createMutation = useCreateCollection();
  const updateMutation = useUpdateCollection();
  const deleteMutation = useDeleteCollection();

  const handleCreateOrUpdate = (data: any) => {
    if (editingCollection) {
      updateMutation.mutate(
        { id: editingCollection.id, ...data },
        {
          onSuccess: () => {
            toast({ title: 'Collection updated successfully' });
            setIsFormOpen(false);
            setEditingCollection(null);
          },
          onError: (error: any) => {
            toast({
              title: 'Error updating collection',
              description: error.message,
              variant: 'destructive',
            });
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast({ title: 'Collection created successfully' });
          setIsFormOpen(false);
        },
        onError: (error: any) => {
          toast({
            title: 'Error creating collection',
            description: error.message,
            variant: 'destructive',
          });
        },
      });
    }
  };

  const handleEdit = (collection: CollectionWithTags) => {
    setEditingCollection(collection);
    setIsFormOpen(true);
  };

  const handleDelete = (collection: CollectionWithTags) => {
    setDeletingCollection(collection);
  };

  const confirmDelete = () => {
    if (!deletingCollection) return;
    
    deleteMutation.mutate(deletingCollection.id, {
      onSuccess: () => {
        toast({ title: 'Collection deleted successfully' });
        setDeletingCollection(null);
      },
      onError: (error: any) => {
        toast({
          title: 'Error deleting collection',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage photos, collections, and page content for NCS Memories
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="collections" className="space-y-6">
          <TabsList className="bg-secondary/50 p-1">
            <TabsTrigger value="photos" className="gap-2">
              <Upload className="h-4 w-4" />
              Photo Upload
            </TabsTrigger>
            <TabsTrigger value="collections" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              Collections
            </TabsTrigger>
            <TabsTrigger value="pages" className="gap-2">
              <FileEdit className="h-4 w-4" />
              Page Editor
            </TabsTrigger>
          </TabsList>

          {/* Photo Upload Tab */}
          <TabsContent value="photos">
            <div className="bg-card rounded-xl p-8 text-center border border-dashed border-border">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-display text-xl font-semibold mb-2">Photo Upload</h3>
              <p className="text-muted-foreground">
                Photo upload functionality coming soon. You'll be able to bulk upload photos to collections.
              </p>
            </div>
          </TabsContent>

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-6">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold">Memory Collections</h2>
                <p className="text-muted-foreground text-sm">Create and manage memory collections</p>
              </div>
              <div className="flex items-center gap-3">
                <BranchSelector
                  value={selectedBranchId}
                  onValueChange={setSelectedBranchId}
                  placeholder="All branches"
                  className="w-[200px]"
                />
                <Button
                  onClick={() => {
                    setEditingCollection(null);
                    setIsFormOpen(true);
                  }}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Collection
                </Button>
              </div>
            </div>

            {/* Collections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 6 }, (_, i) => (
                  <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
                ))
              ) : collections && collections.length > 0 ? (
                collections.map((collection) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">No collections found.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setEditingCollection(null);
                      setIsFormOpen(true);
                    }}
                  >
                    Create your first collection
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Page Editor Tab */}
          <TabsContent value="pages">
            <div className="bg-card rounded-xl p-8 text-center border border-dashed border-border">
              <FileEdit className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-display text-xl font-semibold mb-2">Page Editor</h3>
              <p className="text-muted-foreground">
                Page content editor coming soon. You'll be able to edit hero text, about sections, and more.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Collection Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editingCollection ? 'Edit Collection' : 'New Collection'}
            </DialogTitle>
          </DialogHeader>
          <CollectionForm
            collection={editingCollection}
            onSubmit={handleCreateOrUpdate}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingCollection(null);
            }}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingCollection}
        onOpenChange={() => setDeletingCollection(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingCollection?.title}"? This action cannot be undone.
              All photos in this collection will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Admin;
