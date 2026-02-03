import { GraduationCap, Calendar, Award, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { PAGE_TEMPLATES, PageTemplate } from '@/types/pageBuilder';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Calendar,
  Award,
  FileText,
};

interface TemplatePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (template: PageTemplate) => void;
}

export function TemplatePicker({ open, onOpenChange, onSelect }: TemplatePickerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Choose a Template</DialogTitle>
          <DialogDescription>
            Select a starting point for your page. You can customize everything later.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          {PAGE_TEMPLATES.map((template) => {
            const IconComponent = iconMap[template.icon] || FileText;
            
            return (
              <Card 
                key={template.id}
                className="cursor-pointer hover:border-primary hover:shadow-elegant transition-all group"
                onClick={() => {
                  onSelect(template);
                  onOpenChange(false);
                }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                      {template.defaultSections.length > 0 && (
                        <p className="text-xs text-primary mt-2">
                          {template.defaultSections.length} pre-configured sections
                        </p>
                      )}
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
