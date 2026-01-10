import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import SelectableOptions from "./SelectableOptions";

interface WorkflowCardProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
  status?: string;
}

export const WorkflowCard = ({ title, children, delay = 0, status }: WorkflowCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="glass-strong rounded-2xl p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-white/90">{title}</h4>
        {status && (
          <span className="flex items-center gap-1 text-[10px] text-white/50">
            <Check className="w-3 h-3" />
            {status}
          </span>
        )}
      </div>
      {children}
    </motion.div>
  );
};

interface BulletListProps {
  items: string[];
}

export const BulletList = ({ items }: BulletListProps) => (
  <ul className="space-y-2">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2 text-xs text-white/60">
        <span className="w-1 h-1 rounded-full bg-white/40 mt-1.5 flex-shrink-0" />
        {item}
      </li>
    ))}
  </ul>
);

interface ChecklistItem {
  label: string;
  checked?: boolean;
}

interface ChecklistProps {
  items: ChecklistItem[];
  eta?: string;
}

export const Checklist = ({ items, eta }: ChecklistProps) => (
  <div className="space-y-3">
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2 text-xs">
          <div className={`
            w-4 h-4 rounded border flex items-center justify-center transition-all
            ${item.checked 
              ? 'bg-white/10 border-white/30' 
              : 'border-white/20'
            }
          `}>
            {item.checked && <Check className="w-2.5 h-2.5 text-white/80" />}
          </div>
          <span className={item.checked ? 'text-white/70' : 'text-white/50'}>
            {item.label}
          </span>
        </li>
      ))}
    </ul>
    
    {eta && (
      <div className="flex items-center gap-1.5 text-[10px] text-white/40">
        <Clock className="w-3 h-3" />
        {eta}
      </div>
    )}
  </div>
);

interface ApprovalButtonsProps {
  onApprove?: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
}

export const ApprovalButtons = ({ onApprove, onEdit, onCancel }: ApprovalButtonsProps) => (
  <div className="flex gap-2">
    <button
      onClick={onApprove}
      className="flex-1 py-2 px-4 rounded-xl bg-white/10 text-white/90 text-xs font-medium
        hover:bg-white/20 transition-all duration-200"
    >
      Approve all
    </button>
    <button
      onClick={onEdit}
      className="flex-1 py-2 px-4 rounded-xl bg-white/5 text-white/60 text-xs font-medium
        hover:bg-white/10 transition-all duration-200"
    >
      Edit selection
    </button>
    <button
      onClick={onCancel}
      className="flex-1 py-2 px-4 rounded-xl bg-white/5 text-white/40 text-xs font-medium
        hover:bg-white/10 transition-all duration-200"
    >
      Cancel
    </button>
  </div>
);

interface ConfirmButtonsProps {
  onConfirm?: () => void;
  label?: string;
}

export const ConfirmButtons = ({ onConfirm, label = "Confirm and execute overnight" }: ConfirmButtonsProps) => (
  <button
    onClick={onConfirm}
    className="w-full py-3 px-4 rounded-xl bg-white text-black text-xs font-medium
      hover:bg-white/90 transition-all duration-200"
  >
    {label}
  </button>
);

// Re-export for convenience
export { SelectableOptions };
