import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";

interface DirectionInputProps {
  onSubmit?: (direction: string) => void;
}

const DirectionInput = ({ onSubmit }: DirectionInputProps) => {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim() && onSubmit) {
      onSubmit(value);
      setValue("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-3"
    >
      <label className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-2 block">
        Add direction (optional)
      </label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. don't deploy to prod, use staging-v2, flag risk areas…"
          className="flex-1 bg-transparent text-xs text-white/80 placeholder:text-white/20
            focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleSubmit}
            className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center
              hover:bg-white/20 transition-all"
          >
            <Send className="w-3 h-3 text-white/70" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default DirectionInput;
