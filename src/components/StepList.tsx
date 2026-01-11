import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, X, Minus, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepStatus = "pending" | "running" | "complete" | "failed" | "skipped";

export interface StepItem {
  id: string;
  label: string;
  status: StepStatus;
  error?: string;
  output?: Record<string, unknown>;
  startedAt?: string;
  completedAt?: string;
}

interface StepListProps {
  steps: StepItem[];
  currentStepIndex?: number;
}

// Format timestamp for display
function formatTime(isoString?: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// Pretty print JSON output
function formatOutput(output: Record<string, unknown>): string {
  try {
    return JSON.stringify(output, null, 2);
  } catch {
    return String(output);
  }
}

const StepList = ({ steps, currentStepIndex }: StepListProps) => {
  // Track which steps are expanded
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-0.5">
      {steps.map((step, index) => {
        const isPending = step.status === "pending";
        const isRunning = step.status === "running";
        const isComplete = step.status === "complete";
        const isFailed = step.status === "failed";
        const isSkipped = step.status === "skipped";
        const isCurrent = currentStepIndex === index;
        const isExpanded = expandedSteps.has(step.id);

        // Determine if step has expandable content
        const hasOutput = step.output && Object.keys(step.output).length > 0;
        const hasError = !!step.error;
        const isExpandable = hasOutput || hasError;

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className="rounded-lg overflow-hidden"
          >
            {/* Step row - clickable if expandable */}
            <div
              onClick={() => isExpandable && toggleStep(step.id)}
              className={cn(
                "relative flex items-center gap-3 py-2.5 px-3 transition-all duration-300",
                isRunning && "bg-white/5",
                isFailed && "bg-red-500/10",
                isCurrent && !isRunning && !isFailed && "bg-blue-500/10",
                isExpandable && "cursor-pointer hover:bg-white/5"
              )}
            >
              {/* Expand/collapse indicator for expandable steps */}
              {isExpandable && (
                <div className="w-3 flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3 text-white/40" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-white/40" />
                  )}
                </div>
              )}
              {!isExpandable && <div className="w-3 flex-shrink-0" />}

              {/* Status indicator */}
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                {isRunning ? (
                  <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                ) : isComplete ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  </motion.div>
                ) : isFailed ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <X className="w-3.5 h-3.5 text-red-400" />
                  </motion.div>
                ) : isSkipped ? (
                  <Minus className="w-3.5 h-3.5 text-gray-500" />
                ) : isCurrent ? (
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                )}
              </div>

              {/* Label with cross-out animation */}
              <div className="flex-1 relative overflow-hidden">
                <span className={cn(
                  "text-xs transition-colors duration-300",
                  isComplete && "text-white/40",
                  isRunning && "text-blue-300",
                  isPending && "text-white/30",
                  isFailed && "text-red-400",
                  isSkipped && "text-gray-500",
                  isCurrent && !isRunning && !isFailed && "text-blue-300"
                )}>
                  {step.label}
                </span>

                {/* Strikethrough line animation for completed */}
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

              {/* Timestamp for completed steps */}
              {step.completedAt && (
                <span className="text-[9px] text-white/30 font-mono">
                  {formatTime(step.completedAt)}
                </span>
              )}

              {/* Status indicator on right */}
              {isComplete && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-[10px] text-green-400"
                >
                  ✓
                </motion.span>
              )}
              {isFailed && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-[10px] text-red-400"
                >
                  ✗
                </motion.span>
              )}
              {isSkipped && (
                <span className="text-[10px] text-gray-500">—</span>
              )}
            </div>

            {/* Expanded content - output/error details */}
            <AnimatePresence>
              {isExpanded && isExpandable && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="ml-11 mr-3 mb-3 space-y-2">
                    {/* Error message */}
                    {hasError && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <div className="text-[10px] uppercase tracking-wider text-red-400 mb-1">
                          Error
                        </div>
                        <p className="text-xs text-red-300 font-mono whitespace-pre-wrap">
                          {step.error}
                        </p>
                      </div>
                    )}

                    {/* Output JSON */}
                    {hasOutput && (
                      <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
                        <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">
                          Output
                        </div>
                        <pre className="text-[11px] text-gray-300 font-mono whitespace-pre-wrap overflow-x-auto max-h-48 overflow-y-auto">
                          {formatOutput(step.output!)}
                        </pre>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StepList;
