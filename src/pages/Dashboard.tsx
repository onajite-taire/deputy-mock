import { cn } from '@/lib/utils';
import { useHandoffs } from '@/hooks/useHandoffs';
import { useMetrics } from '@/hooks/useMetrics';
import { AgentCard } from '@/components/AgentCard';
import { Loader2, Moon, Clock } from 'lucide-react';
import type { Handoff, HandoffStatus } from '@/types/handoff';

// Sort priority: in_progress first, then pending, then completed, then failed
const statusOrder: Record<HandoffStatus, number> = {
  in_progress: 0,
  pending: 1,
  completed: 2,
  failed: 3,
};

function sortHandoffs(handoffs: Handoff[]): Handoff[] {
  return [...handoffs].sort((a, b) => {
    const orderDiff = statusOrder[a.status] - statusOrder[b.status];
    if (orderDiff !== 0) return orderDiff;
    // Within same status, sort by created_at descending (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export default function Dashboard() {
  const { data, isLoading, error } = useHandoffs('kenji');
  const { data: metrics } = useMetrics();

  const handoffs = data?.handoffs ?? [];
  const sortedHandoffs = sortHandoffs(handoffs);

  const activeCount = handoffs.filter(
    (h) => h.status === 'in_progress' || h.status === 'pending'
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Agent Dashboard</h1>
          <p className="text-gray-500 mt-1">
            {activeCount > 0
              ? `${activeCount} agent${activeCount > 1 ? 's' : ''} working`
              : 'All agents idle'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-gray-400 bg-gray-900 px-4 py-2 rounded-lg border border-gray-800">
          <Moon className="w-4 h-4" />
          <span className="text-sm">Both teammates are asleep</span>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-24">
          <p className="text-red-400">Failed to load handoffs</p>
          <p className="text-sm text-gray-500 mt-2">
            Make sure the backend is running at {import.meta.env.VITE_API_URL || 'http://localhost:8000'}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && handoffs.length === 0 && (
        <div className="text-center py-24">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center">
            <Moon className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-400">No handoffs yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Create a handoff to see agents work
          </p>
        </div>
      )}

      {/* Agent cards grid */}
      {!isLoading && !error && handoffs.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedHandoffs.map((handoff, index) => (
            <div
              key={handoff.handoff_id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <AgentCard handoff={handoff} />
            </div>
          ))}
        </div>
      )}

      {/* Metrics card */}
      {metrics && (
        <div
          className={cn(
            'mt-12 p-6 rounded-xl',
            'bg-gradient-to-br from-blue-500/10 to-purple-500/10',
            'border border-gray-800'
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Latency Eliminated
              </h3>
              <p className="text-sm text-gray-400">
                Time saved by async handoffs
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-3xl font-bold text-blue-400">
                <Clock className="w-8 h-8" />
                {metrics.total_latency_eliminated_hours.toFixed(1)}
                <span className="text-lg font-normal text-gray-500">hours</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {metrics.total_handoffs} handoffs ({Math.round(metrics.completion_rate * 100)}% completion)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
