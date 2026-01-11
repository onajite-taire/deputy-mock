import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Handoff, HandoffType } from '@/types/handoff';
import { useHandoffStatus } from '@/hooks/useHandoffStatus';
import { StatusBadge } from './StatusBadge';
import { ChevronDown, ChevronUp, Rocket, FileSearch, HelpCircle, Clock, Lightbulb, Loader2 } from 'lucide-react';

interface HandoffCardProps {
  handoff: Handoff;
}

const typeConfig: Record<HandoffType, { icon: typeof Rocket; label: string }> = {
  deploy: { icon: Rocket, label: 'Deploy' },
  review: { icon: FileSearch, label: 'Review' },
  answer: { icon: HelpCircle, label: 'Answer' },
};

function formatDateTime(isoString?: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function HandoffCard({ handoff }: HandoffCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: status, isLoading } = useHandoffStatus(handoff.handoff_id, handoff.status);
  const config = typeConfig[handoff.type];
  const Icon = config.icon;

  // Use status data for result and completed_at
  const result = status?.result ?? handoff.result;
  const completedAt = status?.completed_at ?? handoff.completed_at;

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/80 backdrop-blur-sm overflow-hidden">
      {/* Collapsed header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center gap-4 hover:bg-gray-800/50 transition-colors text-left"
      >
        {/* Status icon */}
        <StatusBadge status={handoff.status} size="lg" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium truncate">{handoff.instruction}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Icon className="w-3 h-3" />
              {config.label}
            </span>
            {completedAt && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDateTime(completedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Summary preview or loading */}
        {isLoading && !result ? (
          <Loader2 className="w-4 h-4 animate-spin text-gray-500 hidden md:block" />
        ) : result?.summary && !isExpanded ? (
          <p className="hidden md:block text-sm text-gray-400 max-w-xs truncate">
            {result.summary}
          </p>
        ) : null}

        {/* Expand icon */}
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && result && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-800">
          {/* Summary */}
          <div className="py-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Summary
            </h4>
            <p className="text-sm text-gray-300">{result.summary}</p>
          </div>

          {/* Details */}
          {result.details && Object.keys(result.details).length > 0 && (
            <div className="py-4 border-t border-gray-800">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Details
              </h4>
              <div className="bg-gray-800/50 rounded-lg divide-y divide-gray-700/50">
                {Object.entries(result.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-3 text-sm">
                    <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="text-gray-300">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Applied */}
          {result.learning_applied && result.learning_applied.length > 0 && (
            <div className="py-4 border-t border-gray-800">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Lightbulb className="w-3 h-3 text-yellow-500" />
                Learning Applied
              </h4>
              <ul className="space-y-2">
                {result.learning_applied.map((learning, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-400"
                  >
                    <span className="text-green-500 mt-1">•</span>
                    {learning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Confidence */}
          {result.confidence !== undefined && (
            <div className="pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Confidence Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        result.confidence >= 0.8 ? 'bg-green-500' :
                        result.confidence >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                      )}
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-white">
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
