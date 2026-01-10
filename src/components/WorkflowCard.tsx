import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";

interface WorkflowCardProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
}

export const WorkflowCard = ({ title, children, delay = 0 }: WorkflowCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="glass-strong rounded-2xl p-5 space-y-4"
    >
      <h4 className="text-sm font-medium text-white/90">{title}</h4>
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
  onChoose?: () => void;
  onDeny?: () => void;
}

export const ApprovalButtons = ({ onApprove, onChoose, onDeny }: ApprovalButtonsProps) => (
  <div className="flex gap-2">
    <button
      onClick={onApprove}
      className="flex-1 py-2 px-4 rounded-xl bg-white/10 text-white/90 text-xs font-medium
        hover:bg-white/20 transition-all duration-200"
    >
      Approve all
    </button>
    <button
      onClick={onChoose}
      className="flex-1 py-2 px-4 rounded-xl bg-white/5 text-white/60 text-xs font-medium
        hover:bg-white/10 transition-all duration-200"
    >
      Choose
    </button>
    <button
      onClick={onDeny}
      className="flex-1 py-2 px-4 rounded-xl bg-white/5 text-white/40 text-xs font-medium
        hover:bg-white/10 transition-all duration-200"
    >
      Deny
    </button>
  </div>
);

interface ConfirmButtonsProps {
  onConfirm?: () => void;
  onNotYet?: () => void;
}

export const ConfirmButtons = ({ onConfirm, onNotYet }: ConfirmButtonsProps) => (
  <div className="flex gap-2">
    <button
      onClick={onConfirm}
      className="flex-1 py-2.5 px-4 rounded-xl bg-white text-black text-xs font-medium
        hover:bg-white/90 transition-all duration-200"
    >
      Confirm
    </button>
    <button
      onClick={onNotYet}
      className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 text-white/60 text-xs font-medium
        hover:bg-white/10 transition-all duration-200"
    >
      Not yet
    </button>
  </div>
);

interface VoiceResponseProps {
  speaker: string;
  text: string;
}

export const VoiceResponse = ({ speaker, text }: VoiceResponseProps) => (
  <div className="text-xs text-white/50 pt-2 border-t border-white/5">
    <span className="text-white/30">{speaker}:</span>{" "}
    <span className="text-white/60 italic">"{text}"</span>
  </div>
);

interface QuestionListProps {
  questions: string[];
}

export const QuestionList = ({ questions }: QuestionListProps) => (
  <ul className="space-y-2">
    {questions.map((q, i) => (
      <li key={i} className="text-xs text-white/60 pl-3 border-l-2 border-white/10">
        {q}
      </li>
    ))}
  </ul>
);
