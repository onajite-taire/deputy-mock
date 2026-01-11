import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import type {
  InitiativeScanResponse,
  InitiativeApproveResponse,
  HandoffType,
  ProposedHandoff,
} from '@/types/handoff';
import InitiativeBubble from '@/components/InitiativeBubble';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Loader2,
  Search,
  CheckCircle2,
  Rocket,
  FileSearch,
  HelpCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const typeIcons: Record<HandoffType, typeof Rocket> = {
  deploy: Rocket,
  review: FileSearch,
  answer: HelpCircle,
};

const typeLabels: Record<HandoffType, string> = {
  deploy: 'Deploy',
  review: 'Review',
  answer: 'Answer',
};

function ProposedHandoffCard({
  handoff,
  checked,
  onCheckedChange,
}: {
  handoff: ProposedHandoff;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  const Icon = typeIcons[handoff.type];
  const confidencePercent = Math.round(handoff.confidence * 100);

  return (
    <div
      className={cn(
        'p-4 rounded-xl border transition-all',
        checked
          ? 'bg-gray-900/80 border-blue-500/50'
          : 'bg-gray-900/40 border-gray-800 opacity-60'
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                'flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium',
                handoff.type === 'deploy' && 'bg-green-500/20 text-green-400',
                handoff.type === 'review' && 'bg-blue-500/20 text-blue-400',
                handoff.type === 'answer' && 'bg-purple-500/20 text-purple-400'
              )}
            >
              <Icon className="w-3 h-3" />
              {typeLabels[handoff.type]}
            </span>
            <span className="text-xs text-gray-500">
              {confidencePercent}% confidence
            </span>
          </div>
          <p className="text-sm text-white mb-2">{handoff.instruction}</p>
          <div className="text-xs text-gray-500">
            {handoff.patterns_found} pattern{handoff.patterns_found !== 1 ? 's' : ''} found
          </div>
          {handoff.based_on.length > 0 && (
            <div className="mt-2 space-y-1">
              {handoff.based_on.slice(0, 2).map((snippet, i) => (
                <div
                  key={i}
                  className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded"
                >
                  {snippet.length > 80 ? snippet.slice(0, 80) + '...' : snippet}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReadinessSummary({ scanResult }: { scanResult: InitiativeScanResponse }) {
  const hasType = (type: HandoffType) =>
    scanResult.proposed_handoffs.some((h) => h.type === type);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-white">{scanResult.total_patterns_scanned}</div>
        <div className="text-xs text-gray-500">Patterns Scanned</div>
      </div>
      <div
        className={cn(
          'border rounded-lg p-3 text-center',
          hasType('deploy')
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-gray-900/80 border-gray-800'
        )}
      >
        <div className="text-2xl font-bold text-white">
          {hasType('deploy') ? '✓' : '—'}
        </div>
        <div className="text-xs text-gray-500">Deploy Needed</div>
      </div>
      <div
        className={cn(
          'border rounded-lg p-3 text-center',
          hasType('review')
            ? 'bg-blue-500/10 border-blue-500/30'
            : 'bg-gray-900/80 border-gray-800'
        )}
      >
        <div className="text-2xl font-bold text-white">
          {hasType('review') ? '✓' : '—'}
        </div>
        <div className="text-xs text-gray-500">Review Needed</div>
      </div>
      <div
        className={cn(
          'border rounded-lg p-3 text-center',
          hasType('answer')
            ? 'bg-purple-500/10 border-purple-500/30'
            : 'bg-gray-900/80 border-gray-800'
        )}
      >
        <div className="text-2xl font-bold text-white">
          {hasType('answer') ? '✓' : '—'}
        </div>
        <div className="text-xs text-gray-500">Decisions Needed</div>
      </div>
    </div>
  );
}

function SuccessState({
  response,
  onGoToDashboard,
}: {
  response: InitiativeApproveResponse;
  onGoToDashboard: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative mb-8 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-12 h-12 text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Handoffs Created</h1>
        <p className="text-gray-400 text-sm text-center">
          Your initiative is now running overnight. Kenji's agents are on it.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {response.handoffs_created.map((handoff) => {
          const Icon = typeIcons[handoff.type];
          return (
            <div
              key={handoff.handoff_id}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl',
                'bg-gray-900/80 border border-green-500/30'
              )}
            >
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{handoff.instruction}</p>
                <span className="text-xs text-gray-500 capitalize">{handoff.type}</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                {handoff.status === 'pending' ? 'Pending' : 'Running'}
              </span>
            </div>
          );
        })}
      </div>

      <Button
        onClick={onGoToDashboard}
        className={cn(
          'w-full py-6 text-lg font-medium',
          'bg-blue-600 hover:bg-blue-700'
        )}
      >
        Go to Dashboard
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}

export default function Initiative() {
  const navigate = useNavigate();
  const [initiative, setInitiative] = useState('');
  const [scanResult, setScanResult] = useState<InitiativeScanResponse | null>(null);
  const [approveResult, setApproveResult] = useState<InitiativeApproveResponse | null>(null);
  const [checkedTypes, setCheckedTypes] = useState<Set<HandoffType>>(new Set());
  const [additionalDirection, setAdditionalDirection] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    if (!initiative.trim()) return;
    setError(null);
    setIsScanning(true);
    setScanResult(null);

    try {
      const result = await api.scanInitiative(initiative.trim());
      setScanResult(result);
      // Default all proposed handoffs to checked
      const types = new Set(result.proposed_handoffs.map((h) => h.type));
      setCheckedTypes(types);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan initiative');
    } finally {
      setIsScanning(false);
    }
  };

  const handleApprove = async () => {
    if (!scanResult || checkedTypes.size === 0) return;
    setError(null);
    setIsApproving(true);

    try {
      const result = await api.approveInitiative({
        initiative_id: scanResult.initiative_id,
        approved_types: Array.from(checkedTypes),
        additional_direction: additionalDirection.trim() || undefined,
      });
      setApproveResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve initiative');
    } finally {
      setIsApproving(false);
    }
  };

  const toggleType = (type: HandoffType) => {
    const newChecked = new Set(checkedTypes);
    if (newChecked.has(type)) {
      newChecked.delete(type);
    } else {
      newChecked.add(type);
    }
    setCheckedTypes(newChecked);
  };

  // Success state after approval
  if (approveResult) {
    return <SuccessState response={approveResult} onGoToDashboard={() => navigate('/dashboard')} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero section */}
      <div className="relative mb-8 flex flex-col items-center">
        <InitiativeBubble
          initiative="Initiative"
          status="Pattern-based delegation"
          size="medium"
          settled
        />
        <div className="mt-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Initiative</h1>
          <p className="text-gray-400 text-sm">
            Describe your goal and let AI scan for relevant patterns
          </p>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Initiative input */}
      {!scanResult && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">
              What do you want to accomplish?
            </label>
            <Textarea
              value={initiative}
              onChange={(e) => setInitiative(e.target.value)}
              placeholder="Prepare Pricing v2 for Tokyo"
              className={cn(
                'min-h-[120px] bg-gray-900 border-gray-800 text-white',
                'placeholder:text-gray-600 focus:border-blue-500 focus:ring-blue-500/20',
                'resize-none'
              )}
            />
          </div>

          <Button
            onClick={handleScan}
            disabled={!initiative.trim() || isScanning}
            className={cn(
              'w-full py-6 text-lg font-medium',
              'bg-blue-600 hover:bg-blue-700',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isScanning ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Scanning Patterns...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Scan Patterns
              </>
            )}
          </Button>
        </div>
      )}

      {/* Scan results */}
      {scanResult && (
        <div className="space-y-6">
          {/* Readiness summary */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Readiness Scan
            </h2>
            <ReadinessSummary scanResult={scanResult} />
          </div>

          {/* Proposed handoffs */}
          {scanResult.proposed_handoffs.length === 0 ? (
            <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800">
              <p className="text-gray-400 mb-2">No matching patterns found</p>
              <p className="text-sm text-gray-500">
                Try rephrasing your initiative or being more specific
              </p>
              <Button
                onClick={() => setScanResult(null)}
                variant="outline"
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">
                  Proposed Handoffs
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({scanResult.proposed_handoffs.length})
                  </span>
                </h2>
                <div className="space-y-3">
                  {scanResult.proposed_handoffs.map((handoff, index) => (
                    <ProposedHandoffCard
                      key={`${handoff.type}-${index}`}
                      handoff={handoff}
                      checked={checkedTypes.has(handoff.type)}
                      onCheckedChange={() => toggleType(handoff.type)}
                    />
                  ))}
                </div>
              </div>

              {/* Additional direction */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Additional direction (optional)
                </label>
                <Input
                  value={additionalDirection}
                  onChange={(e) => setAdditionalDirection(e.target.value)}
                  placeholder="Any extra context or instructions..."
                  className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-600"
                />
              </div>

              {/* Approve button */}
              <Button
                onClick={handleApprove}
                disabled={checkedTypes.size === 0 || isApproving}
                className={cn(
                  'w-full py-6 text-lg font-medium',
                  'bg-green-600 hover:bg-green-700',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isApproving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Approve and Run Overnight
                  </>
                )}
              </Button>

              {/* Back button */}
              <Button
                onClick={() => {
                  setScanResult(null);
                  setCheckedTypes(new Set());
                  setAdditionalDirection('');
                }}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
              >
                ← Start Over
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
