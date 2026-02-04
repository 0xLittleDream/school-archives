import { 
  Image, 
  FileText, 
  Images, 
  BarChart3, 
  Quote, 
  MousePointerClick,
  GraduationCap
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { SECTION_TYPES, PageSectionType } from '@/types/pageBuilder';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Image,
  FileText,
  Images,
  BarChart3,
  Quote,
  MousePointerClick,
  GraduationCap,
};

interface SectionPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (sectionType: PageSectionType) => void;
}

export function SectionPicker({ open, onOpenChange, onSelect }: SectionPickerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Add Section</DialogTitle>
          <DialogDescription>
            Choose a section type to add to your page.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          {SECTION_TYPES.map((section) => {
            const IconComponent = iconMap[section.icon] || FileText;
            
            return (
              <Card 
                key={section.type}
                className="cursor-pointer hover:border-primary hover:shadow-elegant transition-all group"
                onClick={() => {
                  onSelect(section.type);
                  onOpenChange(false);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <IconComponent className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                        {section.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
