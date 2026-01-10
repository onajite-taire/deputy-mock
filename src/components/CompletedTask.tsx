import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface CompletedTaskProps {
  label: string;
  completed?: boolean;
  confidence?: number; // 0-100
  delay?: number;
}

const CompletedTask = ({ 
  label, 
  completed = false, 
  confidence,
  delay = 0 
}: CompletedTaskProps) => {
  return (
    <motion.div 
      className="flex items-center gap-2 text-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.div 
        className={`
          w-4 h-4 rounded border flex items-center justify-center transition-all
          ${completed 
            ? 'bg-white/10 border-white/30' 
            : 'bg-white/5 border-white/20'
          }
        `}
        animate={completed ? { scale: [1, 1.1, 1] } : {}}
        transition={{ delay: delay + 0.2, duration: 0.2 }}
      >
        {completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring", stiffness: 500 }}
          >
            <Check className="w-2.5 h-2.5 text-white/80" />
          </motion.div>
        )}
      </motion.div>
      
      <div className="flex-1 flex items-center gap-2">
        <span className={`relative ${completed ? 'text-white/40' : 'text-white/70'}`}>
          {label}
          {completed && (
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: delay + 0.3, duration: 0.3, ease: "easeOut" }}
              className="absolute left-0 top-1/2 w-full h-[1px] bg-white/40 origin-left"
            />
          )}
        </span>
        
        {completed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.4 }}
            className="text-white/50"
          >
            ✓
          </motion.span>
        )}
      </div>
      
      {confidence !== undefined && !completed && (
        <span className="text-[9px] text-white/30">
          {confidence}%
        </span>
      )}
    </motion.div>
  );
};

export default CompletedTask;
