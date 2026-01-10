import { motion } from "framer-motion";

interface TranscriptEntry {
  speaker: string;
  text: string;
}

interface LiveTranscriptProps {
  entries: TranscriptEntry[];
}

const LiveTranscript = ({ entries }: LiveTranscriptProps) => {
  return (
    <div className="space-y-3">
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
        Live Transcript
      </span>
      
      <div className="space-y-2">
        {entries.map((entry, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-sm text-white/80"
          >
            <span className="text-white/50">{entry.speaker}:</span>{" "}
            <span className="text-white/90">{entry.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LiveTranscript;
