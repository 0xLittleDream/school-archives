import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Save, Calendar, Clock, MapPin, Plane, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEventSettings, useUpdateEventSettings, type EventSettings } from '@/hooks/useEventSettings';

export function EventSettingsManager() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useEventSettings();
  const updateSettings = useUpdateEventSettings();
  
  const [formData, setFormData] = useState<EventSettings>({
    event_date: '',
    event_time: '',
    event_venue: '',
    batch_year: '',
    airline_name: '',
    ceremony_title: '',
  });
  
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  useEffect(() => {
    if (settings) {
      const changed = JSON.stringify(formData) !== JSON.stringify(settings);
      setHasChanges(changed);
    }
  }, [formData, settings]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(formData);
      toast({ 
        title: '✓ Event settings saved!',
        description: 'Changes will appear on student boarding passes.'
      });
    } catch (error: any) {
      toast({
        title: 'Error saving settings',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Plane className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Event Settings</CardTitle>
              <CardDescription>
                Configure date, time, and venue for boarding passes
              </CardDescription>
            </div>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || updateSettings.isPending}
            className="gap-2"
          >
            {updateSettings.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : hasChanges ? (
              <Save className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            {hasChanges ? 'Save Changes' : 'Saved'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Event Details Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Event Date
            </Label>
            <Input
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              placeholder="e.g., 07 FEBRUARY"
            />
            <p className="text-xs text-muted-foreground">Format: 07 FEBRUARY</p>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Event Time
            </Label>
            <Input
              value={formData.event_time}
              onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
              placeholder="e.g., 2:00 PM ONWARDS"
            />
            <p className="text-xs text-muted-foreground">Format: 2:00 PM ONWARDS</p>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Venue
            </Label>
            <Input
              value={formData.event_venue}
              onChange={(e) => setFormData({ ...formData, event_venue: e.target.value })}
              placeholder="e.g., NCS(SVN), ASSEMBLY AREA"
            />
          </div>
        </div>

        {/* Branding Row */}
        <div className="pt-4 border-t">
          <h3 className="font-medium text-foreground mb-4">Branding Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Batch Year</Label>
              <Input
                value={formData.batch_year}
                onChange={(e) => setFormData({ ...formData, batch_year: e.target.value })}
                placeholder="e.g., 2025-26"
              />
            </div>
            <div className="space-y-2">
              <Label>Airline Name</Label>
              <Input
                value={formData.airline_name}
                onChange={(e) => setFormData({ ...formData, airline_name: e.target.value })}
                placeholder="e.g., NCS Airlines"
              />
            </div>
            <div className="space-y-2">
              <Label>Ceremony Title</Label>
              <Input
                value={formData.ceremony_title}
                onChange={(e) => setFormData({ ...formData, ceremony_title: e.target.value })}
                placeholder="e.g., INVITATION TO THE VALEDICTORY CEREMONY"
              />
            </div>
          </div>
        </div>

        {/* Preview Box */}
        <div className="pt-4 border-t">
          <h3 className="font-medium text-foreground mb-3">Preview</h3>
          <div className="p-4 rounded-xl bg-secondary/50 border border-border">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Plane className="h-4 w-4" />
              <span className="text-sm font-bold tracking-widest uppercase">{formData.airline_name}</span>
            </div>
            <p className="text-muted-foreground text-sm mb-3">{formData.ceremony_title}</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Date</p>
                <p className="font-semibold">{formData.event_date}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Time</p>
                <p className="font-semibold">{formData.event_time}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Venue</p>
                <p className="font-semibold">{formData.event_venue}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
