import { useState } from 'react';
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
import { GraduationCap, Pencil, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Student {
  name: string;
  fullName: string;
  traits: string[];
  route: string;
}

// This is the central student data - in production this would come from Supabase
const initialStudents: Student[] = [
  { name: "Sanchit", fullName: "Sanchit Dhauchak", traits: ["Responsible", "Decisive", "Adaptable"], route: "/Sanchit2025" },
  { name: "Ayush", fullName: "Ayush Yadav", traits: ["Strong", "Steady", "Respectable"], route: "/Ayush2025" },
  { name: "Aditi", fullName: "Aditi Kumari", traits: ["Dramatic", "Expressive", "Self-assured"], route: "/Aditi2025" },
  { name: "Joseph", fullName: "Joseph Anthony Sudhakar", traits: ["Charismatic", "Intense", "Loyal"], route: "/Joseph2025" },
  { name: "Reyansh", fullName: "N. Reyansh Kumar", traits: ["Energetic", "Competitive", "Sociable"], route: "/Reyansh2025" },
  { name: "Pratyush", fullName: "Pratyush Singh", traits: ["Bold", "Blunt", "Carefree"], route: "/Pratyush2025" },
  { name: "Rudrakash", fullName: "Rudrakash Upadhyay", traits: ["Quiet", "Observant", "Explosive"], route: "/Rudrakash2025" },
  { name: "Nikhil", fullName: "Nikhil Singh", traits: ["Witty", "Focused", "Athletic"], route: "/Nikhil2025" },
  { name: "Harsh", fullName: "Harsh Kumar", traits: ["Reserved", "Dependable", "Affectionate"], route: "/Harsh2025" },
  { name: "Precious", fullName: "Precious Semwal", traits: ["Intelligent", "Quirky", "Expressive"], route: "/Precious2025" },
  { name: "Avani", fullName: "Avani Tiwari", traits: ["Confident", "Driven", "Headstrong"], route: "/Avani2025" },
  { name: "Keshu", fullName: "Keshu Rai", traits: ["Calm", "Patient", "Resilient"], route: "/Keshu2025" },
  { name: "Aparna", fullName: "S. S. V. Aparna", traits: ["Elegant", "Spontaneous", "Vibrant"], route: "/Aparna2025" },
  { name: "Deveshi", fullName: "Deveshi Giri", traits: ["Sweet", "Warm", "Impactful"], route: "/Deveshi2025" },
  { name: "Madhuri", fullName: "A. Madhuri", traits: ["Eccentric", "Fearless", "Memorable"], route: "/Madhuri2025" },
  { name: "Sahithi", fullName: "K. Sahithi", traits: ["Reliable", "Composed", "Sincere"], route: "/Sahithi2025" },
  { name: "Deepika", fullName: "Deepika Srivastava", traits: ["Gentle", "Nostalgic", "Graceful"], route: "/Deepika2025" },
  { name: "Abhinay", fullName: "Abhinay Chaudhary", traits: ["Polished", "Confident", "Courteous"], route: "/Abhinay2025" },
];

export function StudentPagesManager() {
  const { toast } = useToast();
  const [students] = useState<Student[]>(initialStudents);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState({ fullName: '', traits: ['', '', ''] });

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setEditForm({
      fullName: student.fullName,
      traits: [...student.traits, '', '', ''].slice(0, 3),
    });
  };

  const handleSaveEdit = () => {
    // In production, this would save to Supabase
    toast({
      title: 'Note: Static Pages',
      description: 'Student pages are currently static. Enable Supabase to save changes dynamically.',
    });
    setEditingStudent(null);
  };

  const handleTraitChange = (index: number, value: string) => {
    const newTraits = [...editForm.traits];
    newTraits[index] = value;
    setEditForm({ ...editForm, traits: newTraits });
  };

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
        <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-200 text-sm">
          <p><strong>Note:</strong> Student pages are currently static files. To enable dynamic editing, connect Supabase and migrate student data to the database.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {students.map((student) => (
            <div 
              key={student.route}
              className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-colors group"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-foreground truncate">{student.fullName}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {student.traits.map((trait, idx) => (
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(student.route, '_blank')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student: {editingStudent?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <Label>Personality Traits (3)</Label>
              <div className="space-y-2">
                {editForm.traits.map((trait, index) => (
                  <Input
                    key={index}
                    value={trait}
                    onChange={(e) => handleTraitChange(index, e.target.value)}
                    placeholder={`Trait ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingStudent(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
