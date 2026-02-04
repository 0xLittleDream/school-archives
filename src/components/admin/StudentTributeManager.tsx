import { useState } from 'react';
import { Plus, Trash2, Edit2, GraduationCap, Users, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { ImageUploader } from '@/components/admin/ImageUploader';
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
    full_name: '',
    photo_url: '',
    quote: '',
    future_dreams: '',
    class_section: '',
    traits: ['', '', ''],
    route_slug: '',
  });

  const resetForm = () => {
    setFormData({
      student_name: '',
      full_name: '',
      photo_url: '',
      quote: '',
      future_dreams: '',
      class_section: '',
      traits: ['', '', ''],
      route_slug: '',
    });
    setEditingTribute(null);
  };

  const handleOpenDialog = (tribute?: StudentTribute) => {
    if (tribute) {
      setEditingTribute(tribute);
      const traits = tribute.traits || [];
      setFormData({
        student_name: tribute.student_name,
        full_name: tribute.full_name || '',
        photo_url: tribute.photo_url || '',
        quote: tribute.quote || '',
        future_dreams: tribute.future_dreams || '',
        class_section: tribute.class_section || '',
        traits: [...traits, '', '', ''].slice(0, 3),
        route_slug: tribute.route_slug || '',
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

  const handleTraitChange = (index: number, value: string) => {
    const newTraits = [...(formData.traits || ['', '', ''])];
    newTraits[index] = value;
    setFormData({ ...formData, traits: newTraits });
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

    // Filter empty traits
    const filteredTraits = (formData.traits || []).filter(t => t.trim() !== '');
    const dataToSubmit = {
      ...formData,
      traits: filteredTraits,
    };

    try {
      if (editingTribute) {
        await updateTribute.mutateAsync({
          id: editingTribute.id,
          pageId,
          data: dataToSubmit,
        });
        toast({ title: '✓ Student tribute updated!' });
      } else {
        await createTribute.mutateAsync({
          pageId,
          data: dataToSubmit,
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  {editingTribute ? 'Edit Student Tribute' : 'Add Student Tribute'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo Upload - Made prominent */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Student Photo</Label>
                  <ImageUploader
                    value={formData.photo_url}
                    onChange={(url) => setFormData({ ...formData, photo_url: url })}
                  />
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="student_name">First Name *</Label>
                    <Input
                      id="student_name"
                      value={formData.student_name}
                      onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                      placeholder="e.g., Sanchit"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="e.g., Sanchit Dhauchak"
                    />
                  </div>
                </div>

                {/* Route Slug */}
                <div className="space-y-2">
                  <Label htmlFor="route_slug">Page URL Slug</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">/</span>
                    <Input
                      id="route_slug"
                      value={formData.route_slug?.replace(/^\//, '') || ''}
                      onChange={(e) => setFormData({ ...formData, route_slug: `/${e.target.value}` })}
                      placeholder="e.g., Sanchit2025"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The student's personal page will be accessible at this URL
                  </p>
                </div>

                {/* Traits */}
                <div className="space-y-2">
                  <Label>Personality Traits (up to 3)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(formData.traits || ['', '', '']).map((trait, index) => (
                      <Input
                        key={index}
                        value={trait}
                        onChange={(e) => handleTraitChange(index, e.target.value)}
                        placeholder={`Trait ${index + 1}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    e.g., Responsible, Decisive, Adaptable
                  </p>
                </div>

                {/* Class Section */}
                <div className="space-y-2">
                  <Label htmlFor="class_section">Class / Section</Label>
                  <Input
                    id="class_section"
                    value={formData.class_section}
                    onChange={(e) => setFormData({ ...formData, class_section: e.target.value })}
                    placeholder="e.g., XII-A, 12th Science"
                  />
                </div>

                {/* Quote */}
                <div className="space-y-2">
                  <Label htmlFor="quote">Personal Quote / Message</Label>
                  <Textarea
                    id="quote"
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    placeholder="A memorable quote or message from/about the student"
                    rows={3}
                  />
                </div>

                {/* School Description */}
                <div className="space-y-2">
                  <Label htmlFor="future_dreams">About This Student</Label>
                  <Textarea
                    id="future_dreams"
                    value={formData.future_dreams}
                    onChange={(e) => setFormData({ ...formData, future_dreams: e.target.value })}
                    placeholder="Write a short description about this student from the school's perspective..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    A heartfelt message or description written by the school about this student
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tributes.map((tribute) => (
              <div 
                key={tribute.id}
                className="flex flex-col p-4 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  {/* Photo */}
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0 ring-2 ring-primary/20">
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
                      {tribute.full_name || tribute.student_name}
                    </h4>
                    {tribute.class_section && (
                      <p className="text-sm text-muted-foreground">{tribute.class_section}</p>
                    )}
                  </div>
                </div>

                {/* Traits */}
                {tribute.traits && tribute.traits.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {tribute.traits.map((trait, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                )}

                {tribute.quote && (
                  <p className="text-xs text-muted-foreground truncate mt-2 italic">
                    "{tribute.quote}"
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex-1"
                    onClick={() => handleOpenDialog(tribute)}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete student tribute?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove {tribute.full_name || tribute.student_name}'s tribute from the page.
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
