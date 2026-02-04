import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GraduationCap, Pencil, ExternalLink, Plus, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCustomPage } from '@/hooks/usePageBuilder';
import { useBranch } from '@/contexts/BranchContext';
import { 
  useStudentTributes, 
  useCreateStudentTribute, 
  useUpdateStudentTribute, 
  useDeleteStudentTribute 
} from '@/hooks/useStudentTributes';
import type { StudentTribute, StudentTributeFormData } from '@/types/studentTribute';
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

export function StudentPagesManager() {
  const { toast } = useToast();
  const { selectedBranchId } = useBranch();
  const { data: page } = useCustomPage('farewell-2025', selectedBranchId || undefined);
  const { data: students = [], isLoading } = useStudentTributes(page?.id);
  
  const createMutation = useCreateStudentTribute();
  const updateMutation = useUpdateStudentTribute();
  const deleteMutation = useDeleteStudentTribute();

  const [editingStudent, setEditingStudent] = useState<StudentTribute | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState<StudentTribute | null>(null);
  const [editForm, setEditForm] = useState<StudentTributeFormData>({ 
    student_name: '',
    full_name: '', 
    traits: ['', '', ''],
    route_slug: ''
  });

  useEffect(() => {
    if (editingStudent) {
      const traits = editingStudent.traits || [];
      setEditForm({
        student_name: editingStudent.student_name,
        full_name: editingStudent.full_name || '',
        traits: [...traits, '', '', ''].slice(0, 3),
        route_slug: editingStudent.route_slug || '',
        photo_url: editingStudent.photo_url || '',
        quote: editingStudent.quote || '',
        future_dreams: editingStudent.future_dreams || '',
        class_section: editingStudent.class_section || '',
      });
    } else {
      setEditForm({ 
        student_name: '',
        full_name: '', 
        traits: ['', '', ''],
        route_slug: ''
      });
    }
  }, [editingStudent]);

  const handleEditClick = (student: StudentTribute) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!page?.id) {
      toast({
        title: 'No Farewell Page',
        description: 'Please create a Farewell 2025 page first.',
        variant: 'destructive',
      });
      return;
    }

    const filteredTraits = (editForm.traits || []).filter(t => t.trim() !== '');
    const data: StudentTributeFormData = {
      ...editForm,
      traits: filteredTraits,
    };

    try {
      if (editingStudent) {
        await updateMutation.mutateAsync({ 
          id: editingStudent.id, 
          pageId: page.id, 
          data 
        });
        toast({ title: 'Student updated successfully' });
      } else {
        await createMutation.mutateAsync({ 
          pageId: page.id, 
          data 
        });
        toast({ title: 'Student added successfully' });
      }
      setIsFormOpen(false);
      setEditingStudent(null);
    } catch (error: any) {
      toast({
        title: 'Error saving student',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingStudent || !page?.id) return;
    
    try {
      await deleteMutation.mutateAsync({ 
        id: deletingStudent.id, 
        pageId: page.id 
      });
      toast({ title: 'Student deleted successfully' });
      setDeletingStudent(null);
    } catch (error: any) {
      toast({
        title: 'Error deleting student',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleTraitChange = (index: number, value: string) => {
    const newTraits = [...(editForm.traits || ['', '', ''])];
    newTraits[index] = value;
    setEditForm({ ...editForm, traits: newTraits });
  };

  if (!page) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Student Tribute Pages</CardTitle>
              <p className="text-sm text-muted-foreground">Manage Class of 2025 student pages</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center text-muted-foreground">
            <p>Please create a Farewell 2025 page first to manage students.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Student Tribute Pages</CardTitle>
            <p className="text-sm text-muted-foreground">Manage Class of 2025 student pages</p>
          </div>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No students added yet. Click "Add Student" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {students.map((student) => (
              <div 
                key={student.id}
                className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-foreground truncate">
                    {student.full_name || student.student_name}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(student.traits || []).map((trait, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(student)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {student.route_slug && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(student.route_slug!, '_blank')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingStudent(student)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Edit/Add Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => {
        setIsFormOpen(open);
        if (!open) setEditingStudent(null);
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingStudent ? `Edit: ${editingStudent.student_name}` : 'Add New Student'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={editForm.student_name}
                  onChange={(e) => setEditForm({ ...editForm, student_name: e.target.value })}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  placeholder="Full name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Route Slug (e.g., /Sanchit2025)</Label>
              <Input
                value={editForm.route_slug}
                onChange={(e) => setEditForm({ ...editForm, route_slug: e.target.value })}
                placeholder="/FirstName2025"
              />
            </div>
            <div className="space-y-2">
              <Label>Personality Traits (3)</Label>
              <div className="grid grid-cols-3 gap-2">
                {(editForm.traits || ['', '', '']).map((trait, index) => (
                  <Input
                    key={index}
                    value={trait}
                    onChange={(e) => handleTraitChange(index, e.target.value)}
                    placeholder={`Trait ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Photo URL (optional)</Label>
              <Input
                value={editForm.photo_url || ''}
                onChange={(e) => setEditForm({ ...editForm, photo_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Quote (optional)</Label>
              <Input
                value={editForm.quote || ''}
                onChange={(e) => setEditForm({ ...editForm, quote: e.target.value })}
                placeholder="A memorable quote..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => {
                setIsFormOpen(false);
                setEditingStudent(null);
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingStudent ? 'Save Changes' : 'Add Student'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingStudent} onOpenChange={() => setDeletingStudent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingStudent?.full_name || deletingStudent?.student_name}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
