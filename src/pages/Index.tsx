import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import InitiativeBubble from "@/components/InitiativeBubble";
import WorkflowStepper, { WorkflowStep } from "@/components/WorkflowStepper";
import DemoControls, { AppState } from "@/components/DemoControls";
import DirectionInput from "@/components/DirectionInput";
import CompletedTask from "@/components/CompletedTask";
import SelectableOptions from "@/components/SelectableOptions";
import {
  WorkflowCard,
  BulletList,
  ApprovalButtons,
  ConfirmButtons,
} from "@/components/WorkflowCard";

const initialSteps: WorkflowStep[] = [
  { id: "intent", label: "Intent", description: "Detect user intent", status: "pending" },
  { id: "scan", label: "Readiness Scan", description: "Check team preparedness", status: "pending" },
  { id: "plan", label: "Readiness Plan", description: "Generate action items", status: "pending" },
  { id: "approval", label: "Approval", description: "Confirm overnight actions", status: "pending" },
  { id: "missing", label: "Missing Info", description: "Fill knowledge gaps", status: "pending" },
  { id: "final", label: "Final Check", description: "Verify completion", status: "pending" },
  { id: "execute", label: "Execute Overnight", description: "Run automated tasks", status: "pending" },
];

interface ApprovalItem {
  label: string;
  checked: boolean;
  confidence: number;
  completed: boolean;
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>("ambient");
  const [showBubble, setShowBubble] = useState(false);
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);
  const [activeStep, setActiveStep] = useState(0);
  const [showCards, setShowCards] = useState<string[]>([]);
  const [approvalItems, setApprovalItems] = useState<ApprovalItem[]>([
    { label: "Deploy pricing update to staging-v2", checked: true, confidence: 94, completed: false },
    { label: "Review Kenji's schema changes", checked: true, confidence: 87, completed: false },
    { label: "Pre-answer: Why Stripe?", checked: true, confidence: 91, completed: false },
  ]);
  const [isOvernight, setIsOvernight] = useState(false);
  const [missingSelections, setMissingSelections] = useState<Record<string, string>>({});

  // Show bubble immediately
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Handle state changes and animate workflow
  useEffect(() => {
    if (appState === "ambient") {
      setSteps(initialSteps);
      setActiveStep(0);
      setShowCards([]);
      setIsOvernight(false);
      setApprovalItems(prev => prev.map(item => ({ ...item, completed: false })));
      setMissingSelections({});
    } else if (appState === "intent") {
      // Animate through scan and plan steps automatically
      animateSteps(0, 2);
    } else if (appState === "approval") {
      // Complete all steps and show all cards
      animateSteps(0, 6, true);
    }
  }, [appState]);

  const animateSteps = (start: number, end: number, showAllCards = false) => {
    let current = start;
    
    const interval = setInterval(() => {
      if (current <= end) {
        setSteps(prev => prev.map((step, i) => ({
          ...step,
          status: i < current ? "complete" : i === current ? "running" : "pending"
        })));
        setActiveStep(current);

        // Show cards based on step
        const cardOrder = ["intent", "scan", "plan", "approval", "missing", "final"];
        if (showAllCards || current <= 2) {
          if (current >= 0 && current <= 5) {
            setShowCards(prev => [...new Set([...prev, cardOrder[current]])]);
          }
        }

        current++;
      } else {
        clearInterval(interval);
        setSteps(prev => prev.map((step, i) => ({
          ...step,
          status: i <= end ? "complete" : "pending"
        })));
      }
    }, 500);

    return () => clearInterval(interval);
  };

  const handleBubbleClick = () => {
    if (appState === "ambient") {
      setAppState("intent");
    }
  };

  const handleApproveAll = () => {
    // Animate completion of approval items
    approvalItems.forEach((_, index) => {
      setTimeout(() => {
        setApprovalItems(prev => prev.map((item, i) => 
          i === index ? { ...item, completed: true } : item
        ));
      }, index * 400);
    });
  };

  const handleConfirm = () => {
    setIsOvernight(true);
  };

  const showDirectionInput = showCards.includes("approval") || showCards.includes("missing");

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <AnimatedBackground />

      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          {appState === "ambient" ? (
            /* State 0: Ambient Start */
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
                  transition={{ 
                    duration: 0.6, 
                    ease: [0.34, 1.56, 0.64, 1] 
                  }}
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
          ) : isOvernight ? (
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
            /* State 1 & 2: Intent / Approval */
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
                initial={{ x: 0 }}
                animate={{ x: 0 }}
                className="w-2/5 flex flex-col items-center justify-center p-8 border-r border-white/5"
              >
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 0.85 }}
                  transition={{ duration: 0.4 }}
                >
                  <InitiativeBubble
                    initiative="Pricing v2 Launch"
                    status={appState === "intent" ? "Processing" : "Ready"}
                    size="medium"
                  />
                </motion.div>
              </motion.div>

              {/* Right column - Workflow Dashboard */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex-1 p-8 overflow-auto pb-32">
                  <div className="max-w-xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-sm font-medium text-white/90">
                          Initiative Readiness
                        </h2>
                        <p className="text-xs text-white/40 mt-1">
                          Preparing Tokyo deployment
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider bg-white/10 text-white/70">
                        In progress
                      </span>
                    </div>

                    {/* Stepper */}
                    <div className="glass rounded-2xl p-4">
                      <WorkflowStepper steps={steps} activeStep={activeStep} />
                    </div>

                    {/* Dynamic Cards */}
                    <AnimatePresence mode="popLayout">
                      {/* Intent Card - Agent detected */}
                      {showCards.includes("intent") && (
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

                      {showCards.includes("scan") && (
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

                      {showCards.includes("plan") && (
                        <WorkflowCard title="Minimal Readiness Plan" delay={0.1}>
                          <div className="space-y-2">
                            {approvalItems.map((item, i) => (
                              <CompletedTask
                                key={i}
                                label={item.label}
                                completed={item.completed}
                                confidence={item.confidence}
                                delay={i * 0.05}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-white/40 mt-3">
                            <span>ETA before Tokyo wakes: 2h 10m</span>
                          </div>
                        </WorkflowCard>
                      )}

                      {showCards.includes("approval") && (
                        <WorkflowCard title="Approve overnight actions?" delay={0.2}>
                          <ApprovalButtons 
                            onApprove={handleApproveAll}
                          />
                        </WorkflowCard>
                      )}

                      {showCards.includes("missing") && (
                        <WorkflowCard title="Missing info" delay={0.3}>
                          <div className="space-y-4">
                            <SelectableOptions
                              question="Which staging environment?"
                              options={[
                                { value: "staging-v2", label: "staging-v2", recommended: true },
                                { value: "staging-main", label: "staging-main" },
                              ]}
                              selectedValue={missingSelections.staging}
                              onSelect={(v) => setMissingSelections(prev => ({ ...prev, staging: v }))}
                            />
                            <SelectableOptions
                              question="Any restrictions tonight?"
                              options={[
                                { value: "no-prod", label: "No production deploy", recommended: true },
                                { value: "none", label: "No restrictions" },
                              ]}
                              selectedValue={missingSelections.restrictions}
                              onSelect={(v) => setMissingSelections(prev => ({ ...prev, restrictions: v }))}
                            />
                          </div>
                        </WorkflowCard>
                      )}

                      {showCards.includes("final") && (
                        <WorkflowCard title="Initiative ready" delay={0.4}>
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

      {/* Demo Controls */}
      <DemoControls currentState={appState} onStateChange={setAppState} />
    </div>
  );
};

export default Index;
