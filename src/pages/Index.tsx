import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "@/components/AnimatedBackground";
import InitiativeBubble from "@/components/InitiativeBubble";
import MicrophoneButton from "@/components/MicrophoneButton";
import LiveTranscript from "@/components/LiveTranscript";
import WorkflowStepper, { WorkflowStep } from "@/components/WorkflowStepper";
import DemoControls, { AppState } from "@/components/DemoControls";
import {
  WorkflowCard,
  BulletList,
  Checklist,
  ApprovalButtons,
  ConfirmButtons,
  VoiceResponse,
  QuestionList,
} from "@/components/WorkflowCard";

const initialSteps: WorkflowStep[] = [
  { id: "intent", label: "Intent", description: "Capture voice command", status: "pending" },
  { id: "scan", label: "Readiness Scan", description: "Check team preparedness", status: "pending" },
  { id: "plan", label: "Readiness Plan", description: "Generate action items", status: "pending" },
  { id: "approval", label: "Approval", description: "Confirm overnight actions", status: "pending" },
  { id: "missing", label: "Missing Info", description: "Fill knowledge gaps", status: "pending" },
  { id: "final", label: "Final Check", description: "Verify completion", status: "pending" },
  { id: "execute", label: "Execute Overnight", description: "Run automated tasks", status: "pending" },
];

const Index = () => {
  const [appState, setAppState] = useState<AppState>("ambient");
  const [showBubble, setShowBubble] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);
  const [activeStep, setActiveStep] = useState(0);
  const [showCards, setShowCards] = useState<string[]>([]);

  // Show bubble immediately (no need to wait for gradient animation)
  useEffect(() => {
    // Small delay for smooth mount
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
      setIsListening(false);
    } else if (appState === "intent") {
      setIsListening(true);
      // Animate through first few steps
      animateSteps(0, 2);
    } else if (appState === "approval") {
      setIsListening(true);
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
        if (showAllCards) {
          const cardOrder = ["scan", "plan", "approval", "missing", "final"];
          if (current >= 1 && current <= 5) {
            setShowCards(prev => [...new Set([...prev, cardOrder[current - 1]])]);
          }
        }

        current++;
      } else {
        clearInterval(interval);
        // Mark last running step as complete
        setSteps(prev => prev.map((step, i) => ({
          ...step,
          status: i <= end ? "complete" : "pending"
        })));
      }
    }, 600);

    return () => clearInterval(interval);
  };

  const handleMicClick = () => {
    if (appState === "ambient") {
      setAppState("intent");
    }
  };

  const transcriptEntries = appState !== "ambient" 
    ? [{ speaker: "Sarah", text: "Prepare Pricing v2 for Tokyo." }]
    : [];

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
                  />

                  <MicrophoneButton 
                    isListening={isListening}
                    onClick={handleMicClick}
                  />

                  <div className="text-center space-y-2">
                    <h1 className="text-lg font-medium text-white/90">Deputy</h1>
                    <p className="text-xs text-white/40">
                      Say: "Prepare Pricing v2 for Tokyo."
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* State 1 & 2: Voice Intent / Approval */
            <motion.div
              key="workflow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen flex"
            >
              {/* Left column - Bubble + Transcript */}
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

                <div className="mt-8 w-full max-w-xs">
                  <MicrophoneButton 
                    isListening={isListening}
                    onClick={() => setIsListening(!isListening)}
                  />
                </div>

                {transcriptEntries.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 w-full max-w-xs"
                  >
                    <LiveTranscript entries={transcriptEntries} />
                  </motion.div>
                )}
              </motion.div>

              {/* Right column - Workflow Dashboard */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex-1 p-8 overflow-auto"
              >
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
                        <Checklist
                          items={[
                            { label: "Deploy pricing update to staging", checked: true },
                            { label: "Review Kenji's schema changes", checked: true },
                            { label: "Pre-answer: Why Stripe?", checked: false },
                          ]}
                          eta="ETA before Tokyo wakes: 2h 10m"
                        />
                      </WorkflowCard>
                    )}

                    {showCards.includes("approval") && (
                      <WorkflowCard title="Approve overnight actions?" delay={0.2}>
                        <ApprovalButtons />
                        <VoiceResponse speaker="Sarah" text="Approve all." />
                      </WorkflowCard>
                    )}

                    {showCards.includes("missing") && (
                      <WorkflowCard title="Missing info" delay={0.3}>
                        <QuestionList
                          questions={[
                            "Which staging environment? (staging-v2 or staging-main)",
                            "Any deploy restrictions? (no prod tonight?)",
                          ]}
                        />
                        <VoiceResponse speaker="Sarah" text="staging-v2, no prod." />
                      </WorkflowCard>
                    )}

                    {showCards.includes("final") && (
                      <WorkflowCard title="All set" delay={0.4}>
                        <div className="space-y-3">
                          <p className="text-xs text-white/60">
                            Initiative will be ready by morning.
                          </p>
                          <p className="text-xs text-white/40">
                            Estimated latency eliminated: <span className="text-white/70">14 hours</span>
                          </p>
                          <ConfirmButtons />
                          <VoiceResponse speaker="Sarah" text="Confirm." />
                        </div>
                      </WorkflowCard>
                    )}
                  </AnimatePresence>
                </div>
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
