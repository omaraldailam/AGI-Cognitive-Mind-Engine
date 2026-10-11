/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GenesisCandidate } from '../types';
import { Lightbulb, CheckCircle2, Clock, ShieldAlert, Sparkles } from 'lucide-react';

interface AutonomousGenesisFeedProps {
  candidates: GenesisCandidate[];
  onApproveCandidate: (candidateId: string) => void;
  lang: 'ar' | 'en';
}

export const AutonomousGenesisFeed: React.FC<AutonomousGenesisFeedProps> = ({
  candidates,
  onApproveCandidate,
  lang,
}) => {
  const isAr = lang === 'ar';

  const pendingList = candidates.filter((c) => c.status === 'pending');
  const approvedList = candidates.filter((c) => c.status === 'accepted');

  return (
    <div className="space-y-6">
      {/* Feed Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">
              {isAr
                ? 'سجل التوليد الذاتي ومراجعة المعرفة (Autonomous Genesis Pipeline)'
                : 'Autonomous Genesis & Human-in-the-Loop Review Feed'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {isAr
              ? 'تخزن المفاهيم المتولدة ذاتياً بحالة معلقة (PENDING_REVIEW) لمنع الهلوسة، ولا تنتقل إلى الذاكرة الحية (RAM) والدائمة إلا بعد المراجعة والاعتماد الصريح.'
              : 'Autonomously discovered knowledge candidates remain staged in PENDING_REVIEW state, preventing hallucinations until explicitly approved into RAM and permanent memory.'}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-800/60 text-amber-300">
            {pendingList.length} {isAr ? 'قيد المراجعة' : 'Pending'}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-300">
            {approvedList.length} {isAr ? 'معتمد' : 'Approved'}
          </span>
        </div>
      </div>

      {/* Pending Review Candidates */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold font-mono uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{isAr ? 'مرشحات تنتظر المراجعة والاعتماد (PENDING_REVIEW):' : 'Staged Candidates Awaiting Review:'}</span>
        </h3>

        {pendingList.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-900 text-center text-xs text-slate-500 font-mono">
            {isAr
              ? 'لا توجد مرشحات معلقة حالياً. عند مواجهة استعلام جديد بضعف تطابق دلالي (< 0.65)، يتم إنشاء مرشح هنا تلقائياً.'
              : 'No pending candidates. Queries with low semantic match (< 0.65) autonomously generate candidates here.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingList.map((cand) => (
              <div
                key={cand.id}
                className="bg-slate-950/90 border border-amber-800/50 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/60">
                      PENDING_REVIEW
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {new Date(cand.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100">
                    {isAr ? cand.proposedConceptAr : cand.proposedConcept}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isAr ? cand.hypothesisAr : cand.hypothesis}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                    <span>{isAr ? 'المصادر المشتق منها:' : 'Derivation Hubs:'}</span>
                    {cand.sourceNodes.map((s, i) => (
                      <span key={i} className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                    <span className="text-amber-400">
                      Confidence: {(cand.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Approve Button */}
                <button
                  onClick={() => onApproveCandidate(cand.id)}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-700/20 transition cursor-pointer shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isAr ? 'اعتماد الخلية في الذاكرة (Approve Node)' : 'Approve Node'}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Candidates Archive */}
      {approvedList.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-900">
          <h3 className="text-xs font-bold font-mono uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isAr ? 'سجل المعارف المعتمدة حديثاً (APPROVED):' : 'Approved & Crystallized Knowledge Nodes:'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {approvedList.map((cand) => (
              <div
                key={cand.id}
                className="bg-slate-950/70 border border-emerald-900/40 rounded-xl p-4 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-200">
                    {isAr ? cand.proposedConceptAr : cand.proposedConcept}
                  </h5>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800/40">
                    APPROVED
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {isAr ? cand.hypothesisAr : cand.hypothesis}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
