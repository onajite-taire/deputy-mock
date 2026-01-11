import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { HandoffType } from '@/types/handoff';
import { useHandoffs } from '@/hooks/useHandoffs';
import { useCreateHandoff } from '@/hooks/useCreateHandoff';
import { TypeSelector } from '@/components/TypeSelector';
import { StatusBadge } from '@/components/StatusBadge';
import InitiativeBubble from '@/components/InitiativeBubble';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Rocket, FileSearch, HelpCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const placeholders: Record<HandoffType, string> = {
  deploy: 'Deploy pricing update to staging...',
  review: "Review Kenji's API schema changes...",
  answer: 'Answer: Why did we choose Stripe?',
};

const typeConfig: Record<HandoffType, { icon: typeof Rocket; label: string }> = {
  deploy: { icon: Rocket, label: 'Deploy' },
  review: { icon: FileSearch, label: 'Review' },
  answer: { icon: HelpCircle, label: 'Answer' },
};

export default function Create() {
  const [type, setType] = useState<HandoffType>('deploy');
  const [instruction, setInstruction] = useState('');

  const { data, isLoading: isLoadingHandoffs } = useHandoffs('kenji');
  const createHandoff = useCreateHandoff();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) return;

    try {
      await createHandoff.mutateAsync({
        type,
        instruction: instruction.trim(),
        created_by: 'sarah',
        assigned_to: 'kenji',
      });
      setInstruction('');
      toast.success('Handoff created successfully');
    } catch {
      toast.error('Failed to create handoff');
    }
  };

  // Filter to show pending and in_progress handoffs
  const activeHandoffs = data?.handoffs.filter(
    (h) => h.status === 'pending' || h.status === 'in_progress'
  ) ?? [];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero section with animated bubble */}
      <div className="relative mb-8 flex flex-col items-center">
        <InitiativeBubble
          initiative="New Handoff"
          status="Ready to delegate"
          size="medium"
          settled
        />
        <div className="mt-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Create Handoff</h1>
          <p className="text-gray-400 text-sm">
            Delegate tasks to AI agents that work while you sleep
          </p>
        </div>
      </div>

      {/* Create form */}
      <form onSubmit={handleSubmit} className="space-y-6 mb-12">
        {/* Type selector */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-3">
            Handoff Type
          </label>
          <TypeSelector value={type} onChange={setType} />
        </div>

        {/* Instruction textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-3">
            Instruction
          </label>
          <Textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder={placeholders[type]}
            className={cn(
              'min-h-[120px] bg-gray-900 border-gray-800 text-white',
              'placeholder:text-gray-600 focus:border-blue-500 focus:ring-blue-500/20',
              'resize-none'
            )}
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={!instruction.trim() || createHandoff.isPending}
          className={cn(
            'w-full py-6 text-lg font-medium',
            'bg-blue-600 hover:bg-blue-700',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {createHandoff.isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              {(() => {
                const Icon = typeConfig[type].icon;
                return <Icon className="w-5 h-5 mr-2" />;
              })()}
              Create {typeConfig[type].label} Handoff
            </>
          )}
        </Button>
      </form>

      {/* Pending handoffs list */}
      <div className="border-t border-gray-800 pt-8">
        <h2 className="text-lg font-semibold text-white mb-4">
          Active Handoffs
          {activeHandoffs.length > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({activeHandoffs.length})
            </span>
          )}
        </h2>

        {isLoadingHandoffs ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : activeHandoffs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No active handoffs</p>
            <p className="text-sm mt-1">Create one to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeHandoffs.map((handoff) => {
              const Icon = typeConfig[handoff.type].icon;
              return (
                <div
                  key={handoff.handoff_id}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl',
                    'bg-gray-900/80 border border-gray-800',
                    'backdrop-blur-sm'
                  )}
                >
                  <StatusBadge status={handoff.status} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{handoff.instruction}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <Icon className="w-3 h-3" />
                      <span className="capitalize">{handoff.type}</span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'text-xs px-2 py-1 rounded-full capitalize',
                      handoff.status === 'pending' && 'bg-gray-800 text-gray-400',
                      handoff.status === 'in_progress' && 'bg-blue-500/20 text-blue-400'
                    )}
                  >
                    {handoff.status.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-800 text-center">
        <p className="text-gray-500 flex items-center justify-center gap-2">
          <Clock className="w-4 h-4" />
          Kenji wakes up in 14 hours
        </p>
      </div>
    </div>
  );
}
