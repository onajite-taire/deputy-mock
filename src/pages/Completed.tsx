import { cn } from '@/lib/utils';
import { useHandoffs } from '@/hooks/useHandoffs';
import { HandoffCard } from '@/components/HandoffCard';
import { Loader2, CheckCircle2, Clock, Lightbulb, Zap } from 'lucide-react';

export default function Completed() {
  const { data, isLoading, error } = useHandoffs('kenji', 'completed');

  const handoffs = data?.handoffs ?? [];
  const totalLatency = data?.total_latency_eliminated_hours ?? 0;

  // Sort by completed_at descending (most recent first)
  const sortedHandoffs = [...handoffs].sort((a, b) => {
    if (!a.completed_at || !b.completed_at) return 0;
    return new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime();
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Handoffs from Sarah</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            {handoffs.length} completed overnight
          </p>
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
          <p className="text-red-400">Failed to load completed handoffs</p>
          <p className="text-sm text-gray-500 mt-2">
            Make sure the backend is running
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && handoffs.length === 0 && (
        <div className="text-center py-24">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-400">No completed handoffs yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Agents will show completed work here
          </p>
        </div>
      )}

      {/* Handoff cards */}
      {!isLoading && !error && handoffs.length > 0 && (
        <div className="space-y-4">
          {sortedHandoffs.map((handoff, index) => (
            <div
              key={handoff.handoff_id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <HandoffCard handoff={handoff} />
            </div>
          ))}
        </div>
      )}

      {/* Footer stats */}
      {!isLoading && !error && handoffs.length > 0 && (
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {/* Latency eliminated card */}
          <div
            className={cn(
              'p-6 rounded-xl',
              'bg-gradient-to-br from-green-500/10 to-emerald-500/10',
              'border border-green-500/20'
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Latency eliminated</p>
                <p className="text-2xl font-bold text-green-400">
                  {totalLatency.toFixed(1)} hours
                </p>
              </div>
            </div>
          </div>

          {/* Zero blockers card */}
          <div
            className={cn(
              'p-6 rounded-xl',
              'bg-gradient-to-br from-blue-500/10 to-purple-500/10',
              'border border-blue-500/20'
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  Zero blockers
                </p>
                <p className="text-lg font-medium text-white">
                  Start working immediately
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
