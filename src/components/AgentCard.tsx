import { cn } from '@/lib/utils';
import type { Handoff, HandoffType, StepStatus as ApiStepStatus } from '@/types/handoff';
import { useHandoffStatus } from '@/hooks/useHandoffStatus';
import { StatusBadge } from './StatusBadge';
import StepList, { StepItem, StepStatus } from './StepList';
import { Progress } from '@/components/ui/progress';
import { Rocket, FileSearch, HelpCircle, Clock } from 'lucide-react';

/**
 * Maps API step status to StepList display status
 * API: pending | in_progress | completed | failed | skipped
 * StepList: pending | running | complete | failed | skipped
 */
function mapStepStatus(apiStatus: ApiStepStatus): StepStatus {
  switch (apiStatus) {
    case 'in_progress':
      return 'running';
    case 'completed':
      return 'complete';
    case 'failed':
      return 'failed';
    case 'skipped':
      return 'skipped';
    default:
      return 'pending';
  }
}

interface AgentCardProps {
  handoff: Handoff;
}

const agentConfig: Record<HandoffType, { icon: typeof Rocket; name: string; gradient: string }> = {
  deploy: {
    icon: Rocket,
    name: 'Deploy Agent',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  review: {
    icon: FileSearch,
    name: 'Review Agent',
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  answer: {
    icon: HelpCircle,
    name: 'Answer Agent',
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
};

function formatTime(isoString?: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function AgentCard({ handoff }: AgentCardProps) {
  const { data: status, isLoading } = useHandoffStatus(handoff.handoff_id, handoff.status);
  const config = agentConfig[handoff.type];
  const Icon = config.icon;

  // Extract status data, falling back to handoff data if status not yet loaded
  const currentStatus = status?.status ?? handoff.status;
  const progress = status?.progress ?? handoff.progress ?? 0;
  const currentStep = status?.current_step ?? 'Waiting...';
  const currentStepIndex = status?.current_step_index;
  const steps = status?.steps;
  const result = status?.result ?? handoff.result;

  // Determine terminal states
  const isTerminal = currentStatus === 'completed' || currentStatus === 'failed';
  const isFailed = currentStatus === 'failed';
  const isCompleted = currentStatus === 'completed';

  // Convert API steps to StepList format with full data for expandable display
  const stepItems: StepItem[] = steps?.map((step, index): StepItem => ({
    id: `step-${index}`,
    label: step.name,
    status: mapStepStatus(step.status),
    error: step.error,
    output: step.output,
    startedAt: step.started_at,
    completedAt: step.completed_at,
  })) ?? [];

  return (
    <div
      className={cn(
        'relative rounded-xl border p-5 transition-all duration-300',
        'bg-gray-900/80 backdrop-blur-sm',
        isFailed && 'border-red-500/50 bg-red-950/20',
        isCompleted && 'border-green-500/50 bg-green-950/20',
        !isTerminal && 'border-gray-800'
      )}
    >
      {/* Header: Agent type icon + name + status badge + instruction */}
      <div className="flex items-start gap-4 mb-4">
        {/* Mini gradient orb showing agent type */}
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            'bg-gradient-to-br',
            config.gradient,
            'border border-white/10'
          )}
        >
          <Icon className="w-5 h-5 text-white/80" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white">{config.name}</h3>
            <StatusBadge status={currentStatus} size="sm" />
          </div>
          <p className="text-sm text-gray-400 truncate">{handoff.instruction}</p>
        </div>
      </div>

      {/* Progress bar - shows overall completion percentage */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">Progress</span>
          <span className="text-xs text-gray-400">{progress}%</span>
        </div>
        <Progress
          value={progress}
          className={cn(
            'h-2 transition-all duration-700 ease-out',
            isFailed && '[&>div]:bg-red-500',
            isCompleted && '[&>div]:bg-green-500'
          )}
        />
      </div>

      {/* Current step indicator - only show when not in terminal state */}
      {!isTerminal && currentStep && (
        <div className="flex items-center gap-2 mb-4 text-sm">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-gray-300">{currentStep}</span>
        </div>
      )}

      {/* Step checklist - expandable with output/error details
          Only render if steps array exists and has items.
          Falls back gracefully for agents that don't report steps. */}
      {stepItems.length > 0 && (
        <div className="mb-4 border-t border-gray-800 pt-4">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            Steps
            <span className="ml-2 text-gray-600 normal-case">
              (click to expand)
            </span>
          </h4>
          <StepList
            steps={stepItems}
            currentStepIndex={currentStepIndex}
          />
        </div>
      )}

      {/* Completed result summary - only show when workflow succeeded */}
      {isCompleted && result && (
        <div className="border-t border-green-500/20 pt-4 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-400 text-sm font-medium">Completed</span>
            {status?.completed_at && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(status.completed_at)}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-300 mb-3">{result.summary}</p>

          {/* Result details key-value display */}
          {result.details && Object.keys(result.details).length > 0 && (
            <div className="bg-gray-800/50 rounded-lg p-3 text-xs">
              {Object.entries(result.details).map(([key, value]) => (
                <div key={key} className="flex justify-between py-1">
                  <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="text-gray-300">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Confidence score */}
          {result.confidence !== undefined && (
            <div className="mt-3 text-xs text-gray-500">
              Confidence: <span className="text-green-400">{Math.round(result.confidence * 100)}%</span>
            </div>
          )}
        </div>
      )}

      {/* Failed state - show which step failed and error message */}
      {isFailed && (
        <div className="border-t border-red-500/20 pt-4 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-400 text-sm font-medium">Failed</span>
            {status?.completed_at && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(status.completed_at)}
              </span>
            )}
          </div>
          <p className="text-sm text-red-400">
            {/* Find the failed step and show its error, or fallback message */}
            {steps?.find((s) => s.status === 'failed')?.error || 'Handoff failed'}
          </p>
          {/* Show how many steps completed before failure */}
          {steps && (
            <p className="text-xs text-gray-500 mt-2">
              {steps.filter(s => s.status === 'completed').length} of {steps.length} steps completed before failure
            </p>
          )}
        </div>
      )}

      {/* Loading overlay - show while initial status is being fetched */}
      {isLoading && !status && (
        <div className="absolute inset-0 bg-gray-900/50 rounded-xl flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
