import { useState } from 'react';
import { Plus, Trash2, Edit2, GraduationCap, Users, X, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  useStudentTributes, 
  useCreateStudentTribute, 
  useUpdateStudentTribute, 
  useDeleteStudentTribute 
} from '@/hooks/useStudentTributes';
import type { StudentTribute, StudentTributeFormData } from '@/types/studentTribute';

interface StudentTributeManagerProps {
  pageId: string;
}

export function StudentTributeManager({ pageId }: StudentTributeManagerProps) {
  const { toast } = useToast();
  const { data: tributes = [], isLoading } = useStudentTributes(pageId);
  const createTribute = useCreateStudentTribute();
  const updateTribute = useUpdateStudentTribute();
  const deleteTribute = useDeleteStudentTribute();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTribute, setEditingTribute] = useState<StudentTribute | null>(null);
  const [formData, setFormData] = useState<StudentTributeFormData>({
    student_name: '',
    photo_url: '',
    quote: '',
    future_dreams: '',
    class_section: '',
  });

  const resetForm = () => {
    setFormData({
      student_name: '',
      photo_url: '',
      quote: '',
      future_dreams: '',
      class_section: '',
    });
    setEditingTribute(null);
  };

  const handleOpenDialog = (tribute?: StudentTribute) => {
    if (tribute) {
      setEditingTribute(tribute);
      setFormData({
        student_name: tribute.student_name,
        photo_url: tribute.photo_url || '',
        quote: tribute.quote || '',
        future_dreams: tribute.future_dreams || '',
        class_section: tribute.class_section || '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.student_name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter the student\'s name.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingTribute) {
        await updateTribute.mutateAsync({
          id: editingTribute.id,
          pageId,
          data: formData,
        });
        toast({ title: '✓ Student tribute updated!' });
      } else {
        await createTribute.mutateAsync({
          pageId,
          data: formData,
        });
        toast({ title: '✓ Student tribute added!' });
      }
      handleCloseDialog();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (tribute: StudentTribute) => {
    try {
      await deleteTribute.mutateAsync({ id: tribute.id, pageId });
      toast({ title: '✓ Student tribute removed' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Tributes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-muted rounded-lg" />
            <div className="h-20 bg-muted rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Student Tributes ({tributes.length})
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  {editingTribute ? 'Edit Student Tribute' : 'Add Student Tribute'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student_name">Student Name *</Label>
                  <Input
                    id="student_name"
                    value={formData.student_name}
                    onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                    placeholder="Enter student's full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class_section">Class / Section</Label>
                  <Input
                    id="class_section"
                    value={formData.class_section}
                    onChange={(e) => setFormData({ ...formData, class_section: e.target.value })}
                    placeholder="e.g., XII-A, 12th Science"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo_url">Photo URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="photo_url"
                      value={formData.photo_url}
                      onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                      placeholder="https://... or upload to storage"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload photo to Supabase Storage and paste the public URL
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quote">Personal Quote / Message</Label>
                  <Textarea
                    id="quote"
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    placeholder="A memorable quote or message from the student"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="future_dreams">Future Dreams / Aspirations</Label>
                  <Textarea
                    id="future_dreams"
                    value={formData.future_dreams}
                    onChange={(e) => setFormData({ ...formData, future_dreams: e.target.value })}
                    placeholder="What does this student aspire to become?"
                    rows={2}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createTribute.isPending || updateTribute.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingTribute ? 'Update' : 'Add'} Student
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {tributes.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed border-muted">
            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No students added yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add student tributes to showcase on the Farewell page
            </p>
            <Button variant="outline" onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Student
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {tributes.map((tribute) => (
              <div 
                key={tribute.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 transition-colors"
              >
                {/* Photo */}
                <div className="w-14 h-14 rounded-full overflow-hidden bg-muted flex-shrink-0 ring-2 ring-primary/20">
                  {tribute.photo_url ? (
                    <img 
                      src={tribute.photo_url} 
                      alt={tribute.student_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                      <GraduationCap className="h-6 w-6 text-primary/50" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">
                    {tribute.student_name}
                  </h4>
                  {tribute.class_section && (
                    <p className="text-sm text-muted-foreground">{tribute.class_section}</p>
                  )}
                  {tribute.quote && (
                    <p className="text-xs text-muted-foreground truncate mt-1 italic">
                      "{tribute.quote}"
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleOpenDialog(tribute)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete student tribute?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove {tribute.student_name}'s tribute from the page.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(tribute)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
