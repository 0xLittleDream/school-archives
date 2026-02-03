import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PageSection, StatsMetadata } from '@/types/pageBuilder';

interface StatsSectionFormProps {
  section: PageSection;
  onChange: (updates: Partial<PageSection>) => void;
}

const DEFAULT_STATS = [
  { value: '', label: '' },
  { value: '', label: '' },
  { value: '', label: '' },
  { value: '', label: '' },
];

export function StatsSectionForm({ section, onChange }: StatsSectionFormProps) {
  const metadata = (section.metadata || {}) as StatsMetadata;
  const stats = metadata.stats || DEFAULT_STATS;

  const updateStat = (index: number, field: 'value' | 'label', value: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    onChange({ 
      metadata: { ...metadata, stats: newStats } 
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Section Title (Optional)</Label>
        <Input
          value={section.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., By the Numbers"
        />
      </div>

      <div className="space-y-4">
        <Label>Statistics (4 items)</Label>
        <div className="grid grid-cols-2 gap-4">
          {stats.slice(0, 4).map((stat, index) => (
            <div key={index} className="bg-secondary/50 rounded-xl p-4 border border-border space-y-3">
              <div className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Stat {index + 1}
              </div>
              <div className="space-y-2">
                <Input
                  value={stat.value}
                  onChange={(e) => updateStat(index, 'value', e.target.value)}
                  placeholder="Value (e.g., 12)"
                  className="text-center font-bold text-lg"
                />
                <Input
                  value={stat.label}
                  onChange={(e) => updateStat(index, 'label', e.target.value)}
                  placeholder="Label"
                  className="text-center text-sm"
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Use numbers, symbols (♥, ∞), or short words for values
        </p>
      </div>
    </div>
  );
}
