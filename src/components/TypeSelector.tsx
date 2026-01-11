import { cn } from '@/lib/utils';
import type { HandoffType } from '@/types/handoff';
import { Rocket, FileSearch, HelpCircle } from 'lucide-react';

interface TypeSelectorProps {
  value: HandoffType;
  onChange: (type: HandoffType) => void;
}

const typeConfig: Record<HandoffType, { icon: typeof Rocket; label: string }> = {
  deploy: { icon: Rocket, label: 'Deploy' },
  review: { icon: FileSearch, label: 'Review' },
  answer: { icon: HelpCircle, label: 'Answer' },
};

const types: HandoffType[] = ['deploy', 'review', 'answer'];

export function TypeSelector({ value, onChange }: TypeSelectorProps) {
  return (
    <div className="flex gap-2">
      {types.map((type) => {
        const { icon: Icon, label } = typeConfig[type];
        const isSelected = value === type;

        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200',
              isSelected
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
