import { motion } from "framer-motion";

export type AppState = "ambient" | "intent" | "approval";

interface DemoControlsProps {
  currentState: AppState;
  onStateChange: (state: AppState) => void;
}

const DemoControls = ({ currentState, onStateChange }: DemoControlsProps) => {
  const states: { id: AppState; label: string }[] = [
    { id: "ambient", label: "Ambient" },
    { id: "intent", label: "Intent" },
    { id: "approval", label: "Approval" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="glass rounded-2xl p-1.5 flex gap-1">
        <span className="text-[9px] uppercase tracking-wider text-white/30 px-2 py-1.5 self-center">
          Demo
        </span>
        
        {states.map((state) => (
          <button
            key={state.id}
            onClick={() => onStateChange(state.id)}
            className={`
              px-3 py-1.5 rounded-xl text-[10px] font-medium uppercase tracking-wider
              transition-all duration-200
              ${currentState === state.id 
                ? 'bg-white/10 text-white' 
                : 'text-white/40 hover:text-white/60 hover:bg-white/5'
              }
            `}
          >
            {state.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default DemoControls;
