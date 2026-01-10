import { motion } from "framer-motion";
import { Mic } from "lucide-react";

interface MicrophoneButtonProps {
  isListening?: boolean;
  onClick?: () => void;
}

const MicrophoneButton = ({ isListening = false, onClick }: MicrophoneButtonProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Waveform */}
      {isListening && (
        <div className="flex items-center gap-1 h-8">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-white/60 rounded-full waveform-bar"
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Button */}
      <motion.button
        onClick={onClick}
        className={`
          relative w-14 h-14 rounded-full glass-strong flex items-center justify-center
          transition-all duration-300
          ${isListening ? 'ring-2 ring-white/30 ring-offset-2 ring-offset-transparent' : ''}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulsing ring when listening */}
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full border border-white/20"
            animate={{
              scale: [1, 1.5, 1.5],
              opacity: [0.5, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}
        
        <Mic className={`w-5 h-5 ${isListening ? 'text-white' : 'text-white/60'}`} />
      </motion.button>
    </div>
  );
};

export default MicrophoneButton;
