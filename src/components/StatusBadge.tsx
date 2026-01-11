import { cn } from '@/lib/utils';
import type { HandoffStatus } from '@/types/handoff';

const config: Record<HandoffStatus, { icon: string; className: string; label: string }> = {
  pending: { icon: '○', className: 'text-gray-400', label: 'Pending' },
  in_progress: { icon: '◐', className: 'text-blue-400 animate-pulse', label: 'In Progress' },
  completed: { icon: '✓', className: 'text-green-500', label: 'Completed' },
  failed: { icon: '✗', className: 'text-red-500', label: 'Failed' },
};

interface StatusBadgeProps {
  status: HandoffStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, showLabel = false, size = 'md' }: StatusBadgeProps) {
  const { icon, className, label } = config[status];

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className={sizeClasses[size]}>{icon}</span>
      {showLabel && <span className="text-sm capitalize">{label}</span>}
    </span>
  );
}
