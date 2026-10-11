/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  GenesisCandidate,
  SynapticPruningEvent,
  GlobalNetworkState,
} from '../types';
import {
  Moon,
  Sparkles,
  Scissors,
  CheckCircle2,
  Cpu,
  Brain,
  Lightbulb,
} from 'lucide-react';

interface AutonomousGenesisViewProps {
  genesisCandidates: GenesisCandidate[];
  pruningHistory: SynapticPruningEvent[];
  networkState: GlobalNetworkState;
  onTriggerDream: () => void;
  dreamSummary: string | null;
  lang: 'ar' | 'en';
}

export const AutonomousGenesisView: React.FC<AutonomousGenesisViewProps> = ({
  genesisCandidates,
  pruningHistory,
  networkState,
  onTriggerDream,
  dreamSummary,
  lang,
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="space-y-6">
      {/* Dream Action Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950/70 via-slate-950 to-purple-950/50 border border-indigo-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-900/60 text-indigo-400 border border-indigo-700/50">
                <Moon className="w-5 h-5 animate-pulse" />
              </span>
              <span className="text-xs uppercase font-mono tracking-wider text-indigo-300">
                {isAr ? 'محرك التوليد الذاتي ودورات الحلم' : 'Autonomous Genesis & REM Consolidation'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {isAr
                ? 'إعادة تشغيل الذكريات وتوليد الفرضيات الإدراكية'
                : 'Episodic Memory Replay & Neurogenesis'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isAr
                ? 'عند تفعيل دورة الحلم، يعيد المحرك استرجاع التجارب العرضية الحديثة، ويثبتها في الذاكرة طويلة المدى، ويقلم المشابك غير الفعالة، ويبتكر فرضيات معرفية جديدة دون تدخل بشري.'
                : 'During dream cycles, the mind engine replays recent episodic traces, crystallizes invariant schemas, prunes dormant synapses, and autonomously generates novel scientific hypotheses.'}
            </p>
          </div>

          <button
            onClick={onTriggerDream}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5 cursor-pointer shrink-0"
          >
            <Sparkles className="w-5 h-5 text-indigo-200" />
            <span>{isAr ? 'بدء دورة الحلم والتثبيت' : 'Initiate Dream Cycle'}</span>
          </button>
        </div>

        {/* Dream Summary Notification */}
        {dreamSummary && (
          <div className="mt-5 p-3.5 rounded-xl bg-indigo-900/40 border border-indigo-700/50 text-indigo-200 text-xs flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{dreamSummary}</span>
          </div>
        )}
      </div>

      {/* Two Columns: Hypotheses Genesis + Synaptic Pruning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Autonomous Genesis Candidates */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-slate-100">
                {isAr ? 'الفرضيات المعرفية المولدة ذاتياً' : 'Autonomously Generated Hypotheses'}
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800/50">
              {genesisCandidates.length} {isAr ? 'مرشح' : 'candidates'}
            </span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {genesisCandidates.map((cand) => (
              <div
                key={cand.id}
                className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-2 hover:border-amber-800/60 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-200">
                    {isAr ? cand.proposedConceptAr : cand.proposedConcept}
                  </h4>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/50 shrink-0">
                    {Math.round(cand.confidence * 100)}% Conf
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {isAr ? cand.hypothesisAr : cand.hypothesis}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800 font-mono">
                  <div className="flex items-center gap-1">
                    <span>{isAr ? 'العقد المصدرية:' : 'Source Hubs:'}</span>
                    {cand.sourceNodes.map((s, i) => (
                      <span key={i} className="text-cyan-400">
                        {s}
                      </span>
                    ))}
                  </div>
                  <span
                    className={
                      cand.status === 'accepted'
                        ? 'text-emerald-400 font-bold'
                        : 'text-amber-400 font-bold'
                    }
                  >
                    {cand.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Synaptic Pruning Activity Log */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-slate-100">
                {isAr ? 'سجل التقليم المشبكي الاستقراري' : 'Homeostatic Synaptic Pruning Log'}
              </h3>
            </div>
            <span className="text-xs font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-800/50">
              θ = {networkState.pruningThreshold}
            </span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {pruningHistory.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                <Brain className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                <p>
                  {isAr
                    ? 'لم يتم تقليم مشابك حتى الآن. شغّل دورة الحلم للبحث عن المشابك الخاملة وتقليمها.'
                    : 'No pruning events yet. Initiate a dream cycle to clean dormant synapses.'}
                </p>
              </div>
            ) : (
              pruningHistory.map((prune) => (
                <div
                  key={prune.id}
                  className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span className="text-cyan-400">{prune.source}</span>
                      <span className="text-slate-500">→</span>
                      <span className="text-purple-400">{prune.target}</span>
                    </span>
                    <span className="text-rose-400 font-bold">
                      Pruned ({prune.prunedWeight.toFixed(3)})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {isAr ? prune.reasonAr : prune.reason}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
