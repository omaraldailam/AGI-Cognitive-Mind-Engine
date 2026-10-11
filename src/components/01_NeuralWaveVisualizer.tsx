/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CognitiveCycleTrace, BrainRegion } from '../types';
import { Activity, ShieldCheck, ArrowRight, Zap, CheckCircle2, Clock } from 'lucide-react';

interface NeuralWaveVisualizerProps {
  currentTrace: CognitiveCycleTrace | null;
  activeLobe: string | null;
  lang: 'ar' | 'en';
}

const LOBE_STEPS: { id: BrainRegion; nameEn: string; nameAr: string; color: string; descEn: string; descAr: string }[] = [
  { id: 'sensory', nameEn: 'Sensory Cortex', nameAr: 'القشرة الحسية', color: '#06b6d4', descEn: 'Symbol decomposition & acoustic normalization', descAr: 'تطبيع المدخلات وتفكيك الرموز' },
  { id: 'limbic', nameEn: 'Limbic Core', nameAr: 'الجهاز الحوفي', color: '#f59e0b', descEn: 'Contextual valence & salience appraisal', descAr: 'تقييم السياق، الأهمية، والنغمة الدلالية' },
  { id: 'hippocampus', nameEn: 'Hippocampus', nameAr: 'تشكيل الحصين', color: '#a855f7', descEn: 'Semantic memory scan & Cosine matching', descAr: 'مسح الفضاء الدلالي واسترجاع الذكريات' },
  { id: 'prefrontal', nameEn: 'Prefrontal Logic', nameAr: 'القشرة الجبهية', color: '#10b981', descEn: 'Evidence balancing & decision threshold', descAr: 'موازنة الأدلة، فحص التناقضات، والقرار' },
  { id: 'motor', nameEn: 'Motor Cortex', nameAr: 'القشرة الحركية', color: '#38bdf8', descEn: 'Syntactic articulation & audit trail emission', descAr: 'صياغة المخرج النهائي وإصدار سجل التدقيق' },
];

export const NeuralWaveVisualizer: React.FC<NeuralWaveVisualizerProps> = ({
  currentTrace,
  activeLobe,
  lang,
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="space-y-6">
      {/* Wave Propagation Pipeline Card */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              <h3 className="text-base font-bold text-slate-100">
                {isAr
                  ? 'موجة انتشار السيال العصبي عبر الفصوص الخمسة'
                  : 'Neural Propagation Wave Across The 5 Cortical Lobes'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Sensory → Limbic → Hippocampus → Prefrontal → Motor
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              {activeLobe ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>{isAr ? `إطلاق نشط: ${activeLobe}` : `Active Wave: ${activeLobe}`}</span>
                </span>
              ) : (
                <span className="text-emerald-400">● {isAr ? 'حالة التوازن المستقر' : 'Homeostasis Steady'}</span>
              )}
            </span>
          </div>
        </div>

        {/* 5-Lobe Visual Wave Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
          {LOBE_STEPS.map((step, idx) => {
            const isFired = activeLobe === step.id;
            const hasTrace = currentTrace !== null;

            return (
              <div
                key={step.id}
                className={`p-4 rounded-xl border transition-all duration-300 relative flex flex-col justify-between ${
                  isFired
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20 scale-105'
                    : 'border-slate-800 bg-slate-900/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">0{idx + 1}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: step.color }}
                    />
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 mb-1">
                    {isAr ? step.nameAr : step.nameEn}
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    {isAr ? step.descAr : step.descEn}
                  </p>
                </div>

                {/* Status indicator */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">{step.id}</span>
                  {isFired ? (
                    <span className="text-cyan-400 animate-pulse font-bold">FIRING</span>
                  ) : hasTrace ? (
                    <span className="text-emerald-400">SYNCED</span>
                  ) : (
                    <span className="text-slate-600">IDLE</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inference Audit Trail (سجل تدقيق وتفسير القرار) */}
      {currentTrace && (
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-slate-100">
                {isAr
                  ? 'سجل تدقيق وتفسير القرار العصبي (Inference Audit Trail)'
                  : 'Inference Audit Trail & Interpretability Log'}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentTrace.latencyMs} ms latency</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            {/* Lobe Participation */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-cyan-300 block">
                {isAr ? '1. الفصوص المشاركة بالنبضة:' : '1. Activated Cortical Lobes:'}
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li className="flex items-center gap-1.5 text-cyan-400">✓ Sensory (Wernicke Gateway)</li>
                <li className="flex items-center gap-1.5 text-amber-400">✓ Limbic (Amygdala & Accumbens)</li>
                <li className="flex items-center gap-1.5 text-purple-400">✓ Hippocampus (DG / CA3 / CA1)</li>
                <li className="flex items-center gap-1.5 text-emerald-400">✓ Prefrontal (dlPFC & BA10)</li>
                <li className="flex items-center gap-1.5 text-sky-400">✓ Motor (Broca Articulator)</li>
              </ul>
            </div>

            {/* Semantic Evidence & Cosine Scores */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-purple-300 block">
                {isAr ? '2. نسب التقارب الجيبوي (Cosine):' : '2. Cosine Similarity Evidence:'}
              </span>
              <div className="space-y-1.5 text-[11px]">
                {currentTrace.hippocampalRecall.matchedConcepts.map((m, i) => (
                  <div key={i} className="flex justify-between items-center text-slate-300">
                    <span className="truncate max-w-[140px]">{isAr ? m.conceptAr : m.concept}</span>
                    <span className="text-purple-400 font-bold">{(m.similarity * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Discarded / Inhibited Evidence via GABA */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-rose-300 block">
                {isAr ? '3. الأدلة المستبعدة والمثبطة (GABA):' : '3. Filtered Hallucination Paths:'}
              </span>
              <div className="space-y-1 text-[11px] text-rose-400/90">
                {currentTrace.prefrontalReasoning.inhibitedCandidates.map((c, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span>✕</span>
                    <span className="truncate">{c}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 text-[10px] text-slate-500">
                {isAr ? 'تم كبح المسار لتفادي التشتت الذهني' : 'Clamped by lateral OFC brake'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
