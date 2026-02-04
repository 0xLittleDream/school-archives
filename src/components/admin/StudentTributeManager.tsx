import { useState } from 'react';
import { Plus, Trash2, Edit2, GraduationCap, Users, X, Save, Trophy, Palette } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
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
import type { StudentTribute, StudentTributeFormData, StudentTheme, THEME_OPTIONS, ACHIEVEMENT_ICONS } from '@/types/studentTribute';

// Import theme options
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

interface StudentTributeManagerProps {
  pageId: string;
}

interface AchievementFormState {
  title: string;
  description: string;
  icon: string;
  year: string;
}

export function StudentTributeManager({ pageId }: StudentTributeManagerProps) {
  const { toast } = useToast();
  const { data: tributes = [], isLoading } = useStudentTributes(pageId);
  const createTribute = useCreateStudentTribute();
  const updateTribute = useUpdateStudentTribute();
  const deleteTribute = useDeleteStudentTribute();
  const createAchievement = useCreateAchievement();
  const deleteAchievement = useDeleteAchievement();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTribute, setEditingTribute] = useState<StudentTribute | null>(null);
  const [formData, setFormData] = useState<StudentTributeFormData & { theme: StudentTheme }>({
    student_name: '',
    full_name: '',
    photo_url: '',
    quote: '',
    future_dreams: '',
    class_section: '',
    traits: ['', '', ''],
    route_slug: '',
    theme: 'playful',
  });

  // Achievement management for editing student
  const { data: achievements = [] } = useStudentAchievements(editingTribute?.id);
  const [newAchievement, setNewAchievement] = useState<AchievementFormState>({
    title: '',
    description: '',
    icon: 'trophy',
    year: '',
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
      theme: 'playful',
    });
    setEditingTribute(null);
    setNewAchievement({ title: '', description: '', icon: 'trophy', year: '' });
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
        theme: tribute.theme || 'playful',
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

  const handleAddAchievement = async () => {
    if (!editingTribute || !newAchievement.title.trim()) return;
    
    try {
      await createAchievement.mutateAsync({
        studentId: editingTribute.id,
        data: newAchievement,
      });
      setNewAchievement({ title: '', description: '', icon: 'trophy', year: '' });
      toast({ title: '✓ Achievement added!' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteAchievement = async (achievementId: string) => {
    if (!editingTribute) return;
    
    try {
      await deleteAchievement.mutateAsync({
        id: achievementId,
        studentId: editingTribute.id,
      });
      toast({ title: '✓ Achievement removed' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
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

  const getThemeBadgeClass = (theme: StudentTheme) => {
    switch (theme) {
      case 'playful': return 'bg-pink-100 text-pink-700';
      case 'navy': return 'bg-blue-100 text-blue-700';
      case 'army': return 'bg-green-100 text-green-700';
      case 'classic': return 'bg-amber-100 text-amber-700';
      default: return 'bg-muted text-muted-foreground';
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

                {/* Theme Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Page Theme
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {themeOptions.map((theme) => (
                      <button
                        key={theme.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, theme: theme.value })}
                        className={`
                          p-3 rounded-lg border-2 text-left transition-all
                          ${formData.theme === theme.value 
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                            : 'border-border hover:border-primary/50'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{theme.label.split(' ')[0]}</span>
                          <span className="font-semibold text-sm">{theme.label.split(' ').slice(1).join(' ')}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{theme.description}</p>
                      </button>
                    ))}
                  </div>
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

                {/* Achievements Section - Only when editing */}
                {editingTribute && (
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
              Add student tributes to showcase on event pages
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
                    <Badge className={`mt-1 text-xs ${getThemeBadgeClass(tribute.theme || 'playful')}`}>
                      {themeOptions.find(t => t.value === (tribute.theme || 'playful'))?.label || 'Playful'}
                    </Badge>
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
