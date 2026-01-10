import { motion } from "framer-motion";

interface InitiativeBubbleProps {
  initiative: string;
  status: string;
  size?: "large" | "medium";
  className?: string;
}

const InitiativeBubble = ({ 
  initiative, 
  status, 
  size = "large",
  className = "" 
}: InitiativeBubbleProps) => {
  const sizeClasses = {
    large: "w-64 h-64",
    medium: "w-48 h-48",
  };

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${className}`}
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bubble-gradient blur-2xl opacity-50" />
      
      {/* Main bubble */}
      <div className="relative w-full h-full rounded-full bubble-gradient glass-strong glow-bubble overflow-hidden">
        {/* Inner highlight */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1/2 h-8 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-sm" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <span className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
            Initiative
          </span>
          <h3 className="text-sm font-medium text-white/90 mb-1">
            {initiative}
          </h3>
          <span className="text-[10px] uppercase tracking-wider text-white/40">
            {status}
          </span>
        </div>
        
        {/* Moving gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-purple-500/10"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </motion.div>
  );
};

export default InitiativeBubble;
