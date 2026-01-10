import { motion } from "framer-motion";
import { Loader2, Check } from "lucide-react";

export type StepStatus = "pending" | "running" | "complete";

export interface StepItem {
  id: string;
  label: string;
  status: StepStatus;
}

interface StepListProps {
  steps: StepItem[];
}

const StepList = ({ steps }: StepListProps) => {
  return (
    <div className="space-y-0.5">
      {steps.map((step, index) => {
        const isPending = step.status === "pending";
        const isRunning = step.status === "running";
        const isComplete = step.status === "complete";

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className={`
              relative flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-300
              ${isRunning ? 'bg-white/5' : ''}
            `}
          >
            {/* Status indicator */}
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              {isRunning ? (
                <Loader2 className="w-3.5 h-3.5 text-white/70 animate-spin" />
              ) : isComplete ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Check className="w-3.5 h-3.5 text-white/50" />
                </motion.div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              )}
            </div>

            {/* Label with cross-out animation */}
            <div className="flex-1 relative overflow-hidden">
              <span className={`
                text-xs transition-colors duration-300
                ${isComplete ? 'text-white/40' : ''}
                ${isRunning ? 'text-white/80' : ''}
                ${isPending ? 'text-white/30' : ''}
              `}>
                {step.label}
              </span>
              
              {/* Strikethrough line animation */}
              {isComplete && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute left-0 top-1/2 w-full h-[1px] bg-white/30 origin-left"
                />
              )}

              {/* Running shimmer effect */}
              {isRunning && (
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
              )}
            </div>

            {/* Complete checkmark on right */}
            {isComplete && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
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

export default StepList;
