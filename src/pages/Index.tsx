import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import InitiativeBubble from "@/components/InitiativeBubble";
import StepList, { StepItem } from "@/components/StepList";
import ApprovalChecklist, { ApprovalItem, ItemStatus } from "@/components/ApprovalChecklist";
import DirectionInput from "@/components/DirectionInput";
import SelectableOptions from "@/components/SelectableOptions";
import {
  WorkflowCard,
  BulletList,
  ApprovalButtons,
  ConfirmButtons,
} from "@/components/WorkflowCard";

type FlowPhase = "ambient" | "processing" | "approval" | "overnight";

const initialSteps: StepItem[] = [
  { id: "intent", label: "Intent captured: Prepare Pricing v2 Launch for Tokyo", status: "pending" },
  { id: "scan", label: "Readiness scan: identify blockers", status: "pending" },
  { id: "plan", label: "Readiness plan: propose minimal actions", status: "pending" },
  { id: "approval", label: "Approval required", status: "pending" },
];

const initialApprovalItems: ApprovalItem[] = [
  { id: "deploy", label: "Deploy pricing update to staging-v2", confidence: 94, status: "pending" },
  { id: "review", label: "Review Kenji's schema changes", confidence: 87, status: "pending" },
  { id: "preanswer", label: "Pre-answer: Why Stripe?", confidence: 91, status: "pending" },
];

const Index = () => {
  const [phase, setPhase] = useState<FlowPhase>("ambient");
  const [showBubble, setShowBubble] = useState(false);
  const [steps, setSteps] = useState<StepItem[]>(initialSteps);
  const [approvalItems, setApprovalItems] = useState<ApprovalItem[]>(initialApprovalItems);
  const [visibleCards, setVisibleCards] = useState<string[]>([]);
  const [missingSelections, setMissingSelections] = useState<Record<string, string>>({});
  const [showFinalCard, setShowFinalCard] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Show bubble after brief delay
  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const addTimeout = (fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  const handleBubbleClick = () => {
    if (phase !== "ambient") return;
    
    setPhase("processing");
    runAutomaticFlow();
  };

  const runAutomaticFlow = () => {
    clearAllTimeouts();
    
    // Step timings (ms) - each step: running → complete
    const stepDurations = [800, 900, 1000, 700];
    let cumulative = 0;

    // Animate each step through running → complete
    steps.forEach((step, index) => {
      // Set to running
      addTimeout(() => {
        setSteps(prev => prev.map((s, i) => ({
          ...s,
          status: i === index ? "running" : i < index ? "complete" : "pending"
        })));
      }, cumulative);

      // Set to complete and show corresponding card
      addTimeout(() => {
        setSteps(prev => prev.map((s, i) => ({
          ...s,
          status: i <= index ? "complete" : "pending"
        })));

        // Show card based on step
        if (index === 0) setVisibleCards(prev => [...prev, "intent"]);
        if (index === 1) setVisibleCards(prev => [...prev, "scan"]);
        if (index === 2) setVisibleCards(prev => [...prev, "plan"]);
        if (index === 3) {
          setVisibleCards(prev => [...prev, "approval"]);
          setPhase("approval");
        }
      }, cumulative + stepDurations[index]);

      cumulative += stepDurations[index] + 100;
    });
  };

  const handleApproveAll = () => {
    // Animate each approval item: running → complete with cross-out
    approvalItems.forEach((_, index) => {
      // Set to running
      addTimeout(() => {
        setApprovalItems(prev => prev.map((item, i) => ({
          ...item,
          status: i === index ? "running" : i < index ? "complete" : "pending"
        })));
      }, index * 500);

      // Set to complete
      addTimeout(() => {
        setApprovalItems(prev => prev.map((item, i) => ({
          ...item,
          status: i <= index ? "complete" : "pending"
        })));
      }, index * 500 + 400);
    });

    // Show final card after all items complete
    addTimeout(() => {
      setShowFinalCard(true);
    }, approvalItems.length * 500 + 600);
  };

  const handleConfirm = () => {
    setPhase("overnight");
  };

  const showDirectionInput = phase === "approval" && !showFinalCard;

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          {phase === "ambient" ? (
            /* Ambient Start */
            <motion.div
              key="ambient"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen flex flex-col items-center justify-center px-6"
            >
              {showBubble && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                  className="flex flex-col items-center gap-8"
                >
                  <InitiativeBubble
                    initiative="Pricing v2 Launch"
                    status="Idle"
                    onClick={handleBubbleClick}
                    clickable
                  />

                  <div className="text-center space-y-2">
                    <h1 className="text-lg font-medium text-white/90">Deputy</h1>
                    <p className="text-xs text-white/40">
                      Click to prepare this initiative.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : phase === "overnight" ? (
            /* Overnight State */
            <motion.div
              key="overnight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="min-h-screen flex flex-col items-center justify-center px-6"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center gap-8"
              >
                <InitiativeBubble
                  initiative="Pricing v2 Launch"
                  status="Running overnight"
                  settled
                />

                <div className="text-center space-y-2">
                  <h1 className="text-sm font-medium text-white/70">In progress</h1>
                  <p className="text-xs text-white/40">
                    Tokyo will wake up unblocked.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* Processing / Approval State */
            <motion.div
              key="workflow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen flex"
            >
              {/* Left column - Bubble */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="w-2/5 flex flex-col items-center justify-center p-8 border-r border-white/5"
              >
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 0.85 }}
                  transition={{ duration: 0.4 }}
                >
                  <InitiativeBubble
                    initiative="Pricing v2 Launch"
                    status={phase === "processing" ? "Processing" : "Ready"}
                    size="medium"
                  />
                </motion.div>
              </motion.div>

              {/* Right column - Workflow */}
              <motion.div
                initial={{ opacity: 0, x: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex-1 p-8 overflow-auto pb-32">
                  <div className="max-w-xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-sm font-medium text-white/90">
                          Initiative Readiness
                        </h2>
                        <p className="text-xs text-white/40 mt-1">
                          Preparing Tokyo deployment
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider bg-white/10 text-white/70">
                        {phase === "processing" ? "Scanning" : "Awaiting approval"}
                      </span>
                    </div>

                    {/* Step List - Primary progress UI */}
                    <div className="glass rounded-2xl p-4">
                      <StepList steps={steps} />
                    </div>

                    {/* Dynamic Cards */}
                    <AnimatePresence mode="popLayout">
                      {visibleCards.includes("intent") && (
                        <WorkflowCard 
                          title="Detected intent" 
                          delay={0}
                          status="Confirmed automatically"
                        >
                          <p className="text-xs text-white/60">
                            Prepare Pricing v2 Launch for the Tokyo team's morning.
                          </p>
                        </WorkflowCard>
                      )}

                      {visibleCards.includes("scan") && (
                        <WorkflowCard title="Readiness Scan" delay={0}>
                          <BulletList
                            items={[
                              "Tokyo team needs deployment state",
                              "Tokyo team needs review validation",
                              "Tokyo team needs decision context",
                            ]}
                          />
                        </WorkflowCard>
                      )}

                      {visibleCards.includes("plan") && (
                        <WorkflowCard title="Minimal Readiness Plan" delay={0.1}>
                          <ApprovalChecklist items={approvalItems} />
                          <div className="flex items-center gap-1.5 text-[10px] text-white/40 mt-3">
                            <span>ETA before Tokyo wakes: 2h 10m</span>
                          </div>
                        </WorkflowCard>
                      )}

                      {visibleCards.includes("approval") && !showFinalCard && (
                        <WorkflowCard title="Approve overnight actions?" delay={0.2}>
                          <ApprovalButtons onApprove={handleApproveAll} />
                        </WorkflowCard>
                      )}

                      {showFinalCard && (
                        <WorkflowCard title="Initiative ready" delay={0.1}>
                          <div className="space-y-3">
                            <div className="space-y-1.5">
                              <p className="text-xs text-white/70">
                                3 actions completed
                              </p>
                              <p className="text-xs text-white/50">
                                Tokyo will wake up unblocked
                              </p>
                              <p className="text-xs text-white/40">
                                Estimated latency eliminated: <span className="text-white/60">14h</span>
                              </p>
                            </div>
                            <ConfirmButtons onConfirm={handleConfirm} />
                          </div>
                        </WorkflowCard>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Direction Input - Fixed at bottom */}
                {showDirectionInput && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-0 right-0 w-[60%] p-6 bg-gradient-to-t from-background via-background to-transparent"
                  >
                    <div className="max-w-xl mx-auto">
                      <DirectionInput />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
