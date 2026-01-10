import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronRight } from "lucide-react";

interface CompletedItem {
  id: string;
  label: string;
  details?: {
    title: string;
    items: { label: string; value: string }[];
  };
}

const completedItems: CompletedItem[] = [
  {
    id: "intent",
    label: "Intent captured: Prepare Pricing v2 for Tokyo",
    details: {
      title: "Intent Details",
      items: [
        { label: "Detected", value: "Automatically from context" },
        { label: "Confidence", value: "High" },
      ],
    },
  },
  {
    id: "deploy",
    label: "Pricing update deployed to staging-v2",
    details: {
      title: "Deploy",
      items: [
        { label: "Environment", value: "staging-v2" },
        { label: "Tests", value: "12 / 12 passing" },
        { label: "Confidence", value: "High" },
      ],
    },
  },
  {
    id: "review",
    label: "Schema changes reviewed (0 issues)",
    details: {
      title: "Review",
      items: [
        { label: "Checklist applied", value: "Yes" },
        { label: "Issues found", value: "0" },
        { label: "Confidence", value: "High" },
      ],
    },
  },
  {
    id: "context",
    label: "Decision context prepared: Why Stripe",
    details: {
      title: "Decision Context",
      items: [
        { label: "Summary", value: "Stripe was chosen for PCI compliance and webhook reliability." },
        { label: "Sources", value: "3 prior entries" },
        { label: "Confidence", value: "94%" },
      ],
    },
  },
];

const MorningView = () => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col px-6 py-12"
    >
      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-lg font-medium text-white">Pricing v2 Launch</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-white/10 text-white/80 border border-white/10">
              Ready
            </span>
          </div>
          <p className="text-xs text-white/40">
            Prepared overnight while your team was offline
          </p>
        </motion.div>

        {/* What's Ready Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-[11px] uppercase tracking-wider text-white/40 mb-4">
            What's Ready
          </h2>

          <div className="glass rounded-2xl overflow-hidden">
            {completedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                className="border-b border-white/5 last:border-b-0"
              >
                {/* Completed Row */}
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-full flex items-center gap-3 py-3.5 px-4 hover:bg-white/[0.02] transition-colors"
                >
                  <Check className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
                  
                  <span className="flex-1 text-left text-xs text-white/50 relative">
                    <span className="line-through decoration-white/30">
                      {item.label}
                    </span>
                  </span>

                  <span className="text-[10px] text-white/30 mr-2">✓</span>

                  {item.details && (
                    <motion.div
                      animate={{ rotate: expandedItem === item.id ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-3 h-3 text-white/20" />
                    </motion.div>
                  )}
                </button>

                {/* Expandable Details */}
                <AnimatePresence>
                  {expandedItem === item.id && item.details && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 ml-6">
                        <div className="bg-white/[0.03] rounded-lg p-3 space-y-2">
                          {item.details.items.map((detail, i) => (
                            <div key={i} className="flex justify-between text-[11px]">
                              <span className="text-white/30">{detail.label}</span>
                              <span className="text-white/50">{detail.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Callout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="glass rounded-2xl p-5 mb-8"
        >
          <div className="space-y-3">
            <div>
              <p className="text-sm text-white/90 font-medium">You're unblocked.</p>
              <p className="text-xs text-white/50 mt-1">
                You can start work immediately.
              </p>
            </div>
            <button className="w-full py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/15 transition-colors text-xs text-white/80">
              Continue work
            </button>
          </div>
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="text-center py-6"
        >
          <p className="text-[11px] text-white/30">
            14 hours of coordination time eliminated
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MorningView;
