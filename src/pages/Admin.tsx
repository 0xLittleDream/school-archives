import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Upload, FolderOpen, FileEdit, Plus, Settings, Shield, GraduationCap, Plane } from 'lucide-react';
import { useCollections } from '@/hooks/useDatabase';
import {
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
} from '@/hooks/useAdminMutations';
import { CollectionCard } from '@/components/admin/CollectionCard';
import { CollectionForm } from '@/components/admin/CollectionForm';
import { BranchSelector } from '@/components/admin/BranchSelector';
import { PhotoUploader } from '@/components/admin/PhotoUploader';
import { PageEditor } from '@/components/admin/PageEditor';
import { StudentPagesManager } from '@/components/admin/StudentPagesManager';
import { EventSettingsManager } from '@/components/admin/EventSettingsManager';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { CollectionWithTags } from '@/types/database';

const Admin = () => {
  const navigate = useNavigate();
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
        onSuccess: (newCollection) => {
          toast({ 
            title: 'Collection created!',
            description: 'Now add content to your collection.'
          });
          setIsFormOpen(false);
          // Navigate to collection editor after creation
          if (newCollection?.id) {
            navigate(`/admin/collection/${newCollection.id}`);
          }
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
    // Navigate to collection editor instead of opening form
    navigate(`/admin/collection/${collection.id}`);
  };

  const handleEditMetadata = (collection: CollectionWithTags) => {
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
      <div className="container py-8 md:py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage photos, collections, and page content
              </p>
            </div>
          </div>

          {/* RLS Notice */}
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-200">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Note: Row Level Security</p>
                <p className="opacity-80">
                  To create/edit/delete collections, you need to be authenticated as an admin. 
                  Run the SQL in the Supabase dashboard to add temporary public access or set up proper authentication.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="collections" className="space-y-8">
          <TabsList className="bg-secondary/50 p-1.5 h-auto">
            <TabsTrigger value="collections" className="gap-2 px-4 py-2.5">
              <FolderOpen className="h-4 w-4" />
              Collections
            </TabsTrigger>
            <TabsTrigger value="photos" className="gap-2 px-4 py-2.5">
              <Upload className="h-4 w-4" />
              Photo Upload
            </TabsTrigger>
            <TabsTrigger value="pages" className="gap-2 px-4 py-2.5">
              <FileEdit className="h-4 w-4" />
              Page Editor
            </TabsTrigger>
            <TabsTrigger value="students" className="gap-2 px-4 py-2.5">
              <GraduationCap className="h-4 w-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="event-settings" className="gap-2 px-4 py-2.5">
              <Plane className="h-4 w-4" />
              Event Settings
            </TabsTrigger>
          </TabsList>

          {/* Collections Tab */}
          <TabsContent value="collections" className="space-y-6">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card rounded-xl border border-border">
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground">Memory Collections</h2>
                <p className="text-muted-foreground text-sm">Create and manage memory collections</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <BranchSelector
                  value={selectedBranchId}
                  onValueChange={setSelectedBranchId}
                  placeholder="All branches"
                  className="w-[180px]"
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
                    onEditMetadata={handleEditMetadata}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16 bg-card rounded-2xl border border-dashed border-border">
                  <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">No collections yet</h3>
                  <p className="text-muted-foreground mb-6">Get started by creating your first collection.</p>
                  <Button
                    onClick={() => {
                      setEditingCollection(null);
                      setIsFormOpen(true);
                    }}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Collection
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Photo Upload Tab */}
          <TabsContent value="photos">
            <PhotoUploader />
          </TabsContent>

          {/* Page Editor Tab */}
          <TabsContent value="pages">
            <PageEditor />
          </TabsContent>

          {/* Student Pages Tab */}
          <TabsContent value="students">
            <StudentPagesManager />
          </TabsContent>

          {/* Event Settings Tab */}
          <TabsContent value="event-settings">
            <EventSettingsManager />
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
