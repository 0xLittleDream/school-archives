import { useState, useEffect } from 'react';
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
} from '@/components/ui/dialog';
import { GraduationCap, Pencil, ExternalLink, Plus, Trash2, Loader2, Palette, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCustomPage } from '@/hooks/usePageBuilder';
import { useBranch } from '@/contexts/BranchContext';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { 
  useStudentTributes, 
  useCreateStudentTribute, 
  useUpdateStudentTribute, 
  useDeleteStudentTribute 
} from '@/hooks/useStudentTributes';
import { 
  useStudentAchievements, 
  useCreateAchievement, 
  useDeleteAchievement 
} from '@/hooks/useStudentAchievements';
import type { StudentTribute, StudentTributeFormData, StudentTheme, THEME_OPTIONS } from '@/types/studentTribute';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Theme options with visual styling
const themeOptions: typeof THEME_OPTIONS = [
  { value: 'playful', label: '🎉 Playful', description: 'Bright colors, confetti, fun animations', colors: 'from-pink-500 via-purple-500 to-indigo-500' },
  { value: 'navy', label: '⚓ Navy', description: 'NCS Airways flight theme', colors: 'from-blue-600 via-blue-700 to-blue-800' },
  { value: 'army', label: '🎖️ Army', description: 'Camouflage accents, medal-style badges', colors: 'from-green-700 via-green-800 to-green-900' },
  { value: 'classic', label: '🎓 Classic', description: 'Formal graduation style with gold accents', colors: 'from-amber-600 via-yellow-600 to-amber-700' },
];

const achievementIcons = [
  { value: 'trophy', label: '🏆 Trophy' },
  { value: 'medal', label: '🏅 Medal' },
  { value: 'star', label: '⭐ Star' },
  { value: 'certificate', label: '📜 Certificate' },
  { value: 'book', label: '📚 Academic' },
  { value: 'sports', label: '⚽ Sports' },
  { value: 'music', label: '🎵 Music' },
  { value: 'art', label: '🎨 Art' },
];

export function StudentPagesManager() {
  const { toast } = useToast();
  const { selectedBranchId } = useBranch();
  const { data: page } = useCustomPage('farewell-2025', selectedBranchId || undefined);
  const { data: students = [], isLoading } = useStudentTributes(page?.id);
  
  const createMutation = useCreateStudentTribute();
  const updateMutation = useUpdateStudentTribute();
  const deleteMutation = useDeleteStudentTribute();
  const createAchievement = useCreateAchievement();
  const deleteAchievement = useDeleteAchievement();

  const [editingStudent, setEditingStudent] = useState<StudentTribute | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState<StudentTribute | null>(null);
  const [editForm, setEditForm] = useState<StudentTributeFormData & { theme: StudentTheme }>({ 
    student_name: '',
    full_name: '', 
    traits: ['', '', ''],
    route_slug: '',
    theme: 'playful',
  });

  // Achievement management
  const { data: achievements = [] } = useStudentAchievements(editingStudent?.id);
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    icon: 'trophy',
    year: '',
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
        theme: editingStudent.theme || 'playful',
      });
    } else {
      setEditForm({ 
        student_name: '',
        full_name: '', 
        traits: ['', '', ''],
        route_slug: '',
        theme: 'playful',
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
        title: 'No Event Page',
        description: 'Please create an event page first to add students.',
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

  const handleAddAchievement = async () => {
    if (!editingStudent || !newAchievement.title.trim()) return;
    
    try {
      await createAchievement.mutateAsync({
        studentId: editingStudent.id,
        data: newAchievement,
      });
      setNewAchievement({ title: '', description: '', icon: 'trophy', year: '' });
      toast({ title: '✓ Achievement added!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteAchievement = async (achievementId: string) => {
    if (!editingStudent) return;
    
    try {
      await deleteAchievement.mutateAsync({
        id: achievementId,
        studentId: editingStudent.id,
      });
      toast({ title: '✓ Achievement removed' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const getThemeBadgeClass = (theme: StudentTheme) => {
    switch (theme) {
      case 'playful': return 'bg-pink-100 text-pink-700';
      case 'navy': return 'bg-blue-100 text-blue-700';
      case 'army': return 'bg-green-100 text-green-700';
      case 'classic': return 'bg-amber-100 text-amber-700';
      default: return 'bg-muted text-muted-foreground';
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
              <CardTitle className="text-xl">Student Pages</CardTitle>
              <p className="text-sm text-muted-foreground">Manage student tribute pages</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center text-muted-foreground">
            <p>Please create an event page first to manage students.</p>
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
            <CardTitle className="text-xl">Student Pages</CardTitle>
            <p className="text-sm text-muted-foreground">Manage student tribute pages</p>
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
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Photo thumbnail */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0 ring-2 ring-primary/20">
                    {student.photo_url ? (
                      <img 
                        src={student.photo_url} 
                        alt={student.student_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                        <GraduationCap className="h-5 w-5 text-primary/50" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {student.full_name || student.student_name}
                    </h3>
                    <Badge className={`mt-1 text-xs ${getThemeBadgeClass(student.theme || 'playful')}`}>
                      {themeOptions.find(t => t.value === (student.theme || 'playful'))?.label || 'Playful'}
                    </Badge>
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
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Theme Selection - Prominent at top */}
            <div className="space-y-3 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/20">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Palette className="h-4 w-4 text-primary" />
                Choose Page Theme
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {themeOptions.map((theme) => (
                  <button
                    key={theme.value}
                    type="button"
                    onClick={() => setEditForm({ ...editForm, theme: theme.value })}
                    className={`
                      p-3 rounded-lg border-2 text-left transition-all
                      ${editForm.theme === theme.value 
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50 bg-background'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{theme.label.split(' ')[0]}</span>
                      <span className="font-semibold text-sm">{theme.label.split(' ').slice(1).join(' ')}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{theme.description}</p>
                    <div className={`h-1.5 mt-2 rounded-full bg-gradient-to-r ${theme.colors}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Student Photo</Label>
              <ImageUploader
                value={editForm.photo_url}
                onChange={(url) => setEditForm({ ...editForm, photo_url: url })}
              />
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input
                  value={editForm.student_name}
                  onChange={(e) => setEditForm({ ...editForm, student_name: e.target.value })}
                  placeholder="e.g., Sanchit"
                />
              </div>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  placeholder="e.g., Sanchit Dhauchak"
                />
              </div>
            </div>

            {/* Route Slug */}
            <div className="space-y-2">
              <Label>Page URL Slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">/</span>
                <Input
                  value={editForm.route_slug?.replace(/^\//, '') || ''}
                  onChange={(e) => setEditForm({ ...editForm, route_slug: `/${e.target.value}` })}
                  placeholder="e.g., Sanchit2025"
                />
              </div>
            </div>

            {/* Class Section */}
            <div className="space-y-2">
              <Label>Class / Section</Label>
              <Input
                value={editForm.class_section || ''}
                onChange={(e) => setEditForm({ ...editForm, class_section: e.target.value })}
                placeholder="e.g., XII-A, 12th Science"
              />
            </div>

            {/* Traits */}
            <div className="space-y-2">
              <Label>Personality Traits (up to 3)</Label>
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

            {/* Quote */}
            <div className="space-y-2">
              <Label>Personal Quote</Label>
              <Input
                value={editForm.quote || ''}
                onChange={(e) => setEditForm({ ...editForm, quote: e.target.value })}
                placeholder="A memorable quote..."
              />
            </div>

            {/* About / Future Dreams */}
            <div className="space-y-2">
              <Label>About This Student</Label>
              <Textarea
                value={editForm.future_dreams || ''}
                onChange={(e) => setEditForm({ ...editForm, future_dreams: e.target.value })}
                placeholder="Write a short description about this student..."
                rows={3}
              />
            </div>

            {/* Achievements Section - Only when editing */}
            {editingStudent && (
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                <Label className="flex items-center gap-2 text-base font-semibold">
                  <Trophy className="h-4 w-4" />
                  Achievements & Awards
                </Label>
                
                {/* Existing achievements */}
                {achievements.length > 0 && (
                  <div className="space-y-2">
                    {achievements.map((ach) => (
                      <div key={ach.id} className="flex items-center gap-2 p-2 bg-background rounded-lg border">
                        <span className="text-lg">
                          {achievementIcons.find(i => i.value === ach.icon)?.label.split(' ')[0] || '🏆'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{ach.title}</p>
                          {ach.year && <p className="text-xs text-muted-foreground">{ach.year}</p>}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAchievement(ach.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add new achievement */}
                <div className="grid grid-cols-[auto_1fr_auto_auto] gap-2 items-end">
                  <div className="space-y-1">
                    <Label className="text-xs">Icon</Label>
                    <Select
                      value={newAchievement.icon}
                      onValueChange={(v) => setNewAchievement({ ...newAchievement, icon: v })}
                    >
                      <SelectTrigger className="w-[80px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {achievementIcons.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            {icon.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Title</Label>
                    <Input
                      value={newAchievement.title}
                      onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                      placeholder="e.g., Science Fair Winner"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Year</Label>
                    <Input
                      value={newAchievement.year}
                      onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value })}
                      placeholder="2024"
                      className="w-[80px]"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddAchievement}
                    disabled={!newAchievement.title.trim() || createAchievement.isPending}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-background py-4">
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
