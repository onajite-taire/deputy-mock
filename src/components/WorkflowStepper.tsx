import { motion } from "framer-motion";
import { 
  Sparkles,
  Search, 
  ClipboardList, 
  CheckCircle2, 
  HelpCircle, 
  Shield, 
  Zap,
  Loader2
} from "lucide-react";

export type StepStatus = "pending" | "running" | "complete";

export interface WorkflowStep {
  id: string;
  label: string;
  description: string;
  status: StepStatus;
}

interface WorkflowStepperProps {
  steps: WorkflowStep[];
  activeStep: number;
}

const stepIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  intent: Sparkles,
  scan: Search,
  plan: ClipboardList,
  approval: CheckCircle2,
  missing: HelpCircle,
  final: Shield,
  execute: Zap,
};

const WorkflowStepper = ({ steps, activeStep }: WorkflowStepperProps) => {
  return (
    <div className="space-y-1">
      {steps.map((step, index) => {
        const Icon = stepIcons[step.id] || CheckCircle2;
        const isActive = index === activeStep;
        const isComplete = step.status === "complete";
        const isRunning = step.status === "running";

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              flex items-center gap-3 p-3 rounded-xl transition-all duration-300
              ${isActive ? 'bg-white/5' : ''}
            `}
          >
            {/* Icon */}
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
              ${isComplete ? 'bg-white/10 text-white' : ''}
              ${isRunning ? 'bg-white/10 text-white' : ''}
              ${!isComplete && !isRunning ? 'bg-white/5 text-white/30' : ''}
            `}>
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isComplete || isRunning ? 'text-white' : 'text-white/40'
                }`}>
                  {step.label}
                </span>
                
                {/* Status badge */}
                <span className={`
                  text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full
                  ${isComplete ? 'bg-white/10 text-white/70' : ''}
                  ${isRunning ? 'bg-white/20 text-white' : ''}
                  ${!isComplete && !isRunning ? 'text-white/20' : ''}
                `}>
                  {step.status}
                </span>
              </div>
              
              <p className={`text-xs mt-0.5 transition-colors duration-300 ${
                isComplete || isRunning ? 'text-white/50' : 'text-white/20'
              }`}>
                {step.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default WorkflowStepper;
