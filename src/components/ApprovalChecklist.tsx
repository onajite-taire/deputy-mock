import { motion } from "framer-motion";
import { Loader2, Check } from "lucide-react";

export type ItemStatus = "pending" | "running" | "complete";

export interface ApprovalItem {
  id: string;
  label: string;
  confidence: number;
  status: ItemStatus;
}

interface ApprovalChecklistProps {
  items: ApprovalItem[];
}

const ApprovalChecklist = ({ items }: ApprovalChecklistProps) => {
  return (
    <div className="space-y-1">
      {items.map((item, index) => {
        const isPending = item.status === "pending";
        const isRunning = item.status === "running";
        const isComplete = item.status === "complete";

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`
              relative flex items-center gap-3 py-2 px-2 rounded-lg transition-all duration-300
              ${isRunning ? 'bg-white/5' : ''}
            `}
          >
            {/* Checkbox / Spinner */}
            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
              {isRunning ? (
                <Loader2 className="w-3 h-3 text-white/60 animate-spin" />
              ) : isComplete ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-4 h-4 rounded border border-white/30 bg-white/10 flex items-center justify-center"
                >
                  <Check className="w-2.5 h-2.5 text-white/70" />
                </motion.div>
              ) : (
                <div className="w-4 h-4 rounded border border-white/20 bg-white/5" />
              )}
            </div>

            {/* Label with cross-out */}
            <div className="flex-1 relative overflow-hidden">
              <span className={`
                text-xs transition-colors duration-300
                ${isComplete ? 'text-white/40' : ''}
                ${isRunning ? 'text-white/70' : ''}
                ${isPending ? 'text-white/60' : ''}
              `}>
                {item.label}
              </span>
              
              {/* Strikethrough animation */}
              {isComplete && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute left-0 top-1/2 w-full h-[1px] bg-white/30 origin-left"
                />
              )}

              {/* Running shimmer */}
              {isRunning && (
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
              )}
            </div>

            {/* Confidence badge (only when pending) */}
            {isPending && (
              <span className="text-[9px] text-white/30">
                {item.confidence}%
              </span>
            )}

            {/* Complete checkmark */}
            {isComplete && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="text-[10px] text-white/40"
              >
                ✓
              </motion.span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default ApprovalChecklist;
