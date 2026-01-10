import { motion } from "framer-motion";
import { useState } from "react";

interface Option {
  value: string;
  label: string;
  recommended?: boolean;
}

interface SelectableOptionsProps {
  question: string;
  options: Option[];
  selectedValue?: string;
  onSelect?: (value: string) => void;
}

export const SelectableOptions = ({ 
  question, 
  options, 
  selectedValue,
  onSelect 
}: SelectableOptionsProps) => {
  const [selected, setSelected] = useState(selectedValue);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect?.(value);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-white/60">{question}</p>
      <div className="space-y-1.5 pl-2">
        {options.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full flex items-center gap-2 text-left text-xs py-1.5 px-2 rounded-lg
              transition-all duration-200
              ${selected === option.value 
                ? 'bg-white/10 text-white/90' 
                : 'text-white/50 hover:bg-white/5 hover:text-white/70'
              }
            `}
          >
            <span className={`
              w-3 h-3 rounded-full border flex items-center justify-center flex-shrink-0
              transition-all duration-200
              ${selected === option.value 
                ? 'border-white/50 bg-white/20' 
                : 'border-white/20'
              }
            `}>
              {selected === option.value && (
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </span>
            <span>{option.label}</span>
            {option.recommended && (
              <span className="text-[9px] uppercase tracking-wider text-white/30 ml-auto">
                recommended
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SelectableOptions;
