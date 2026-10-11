/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QATrainingPair, BrainRegion } from '../types';
import {
  GraduationCap,
  Play,
  Plus,
  CheckCircle2,
  TrendingDown,
  Target,
} from 'lucide-react';

interface KnowledgeTrainerViewProps {
  qaPairs: QATrainingPair[];
  onTrainPair: (pair: QATrainingPair) => void;
  onAddPair: (pair: QATrainingPair) => void;
  trainingLogs: string[];
  lang: 'ar' | 'en';
}

export const KnowledgeTrainerView: React.FC<KnowledgeTrainerViewProps> = ({
  qaPairs,
  onTrainPair,
  onAddPair,
  trainingLogs,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [showAddModal, setShowAddModal] = useState(false);

  // New pair form
  const [questionEn, setQuestionEn] = useState('');
  const [questionAr, setQuestionAr] = useState('');
  const [concept, setConcept] = useState('');
  const [region, setRegion] = useState<BrainRegion>('prefrontal');

  const handleCreatePair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionEn.trim() || !concept.trim()) return;

    const newPair: QATrainingPair = {
      id: `qa_${Date.now()}`,
      question: questionEn.trim(),
      questionAr: questionAr.trim() || questionEn.trim(),
      expectedConcept: concept.trim(),
      targetRegion: region,
      reinforcedCount: 0,
      accuracy: 0.75,
    };

    onAddPair(newPair);
    setShowAddModal(false);
    setQuestionEn('');
    setQuestionAr('');
    setConcept('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <span>{isAr ? 'مدرب المعرفة والتأهيل الإدراكي' : 'Neural Knowledge Trainer'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isAr
              ? 'تدريب وتثبيت أزواج الأسئلة والمفاهيم لترقية دقة استجابة القشرة الجبهية ومراكز الذاكرة.'
              : 'Train question-concept schemas to calibrate prefrontal and hippocampal synaptic convergence.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة زوج تدريبي جديد' : 'Add Q&A Pair'}</span>
        </button>
      </div>

      {/* Grid of QA Pairs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {qaPairs.map((pair) => (
          <div
            key={pair.id}
            className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-emerald-700/50 transition"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-800 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {pair.targetRegion}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {Math.round(pair.accuracy * 100)}% Acc
                </span>
              </div>

              <h4 className="text-sm font-semibold text-slate-200">
                {isAr ? pair.questionAr : pair.question}
              </h4>
              <p className="text-xs text-slate-400 font-mono">
                {isAr ? pair.question : pair.questionAr}
              </p>

              <div className="pt-2">
                <span className="text-[11px] text-slate-500 block">
                  {isAr ? 'المفهوم المستهدف:' : 'Target Concept Schema:'}
                </span>
                <span className="text-xs font-bold text-cyan-300">
                  {pair.expectedConcept}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                {pair.reinforcedCount} {isAr ? 'دورات تدريب' : 'trained epochs'}
              </span>

              <button
                onClick={() => onTrainPair(pair)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-xs font-semibold transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isAr ? 'تشغيل دورة تدريب' : 'Train 3 Epochs'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Training Logs Console */}
      {trainingLogs.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <TrendingDown className="w-4 h-4" />
              <span>{isAr ? 'سجل تقارب الأوزان ودوال الخسارة (Loss Curve)' : 'Convergence & Loss Log'}</span>
            </span>
            <span>{trainingLogs.length} updates</span>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-3 max-h-36 overflow-y-auto font-mono text-xs text-slate-300 space-y-1">
            {trainingLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-slate-600">›</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Q&A Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              <span>{isAr ? 'إنشاء زوج تدريبي جديد' : 'Create New Q&A Training Pair'}</span>
            </h3>

            <form onSubmit={handleCreatePair} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isAr ? 'السؤال بالإنجليزية:' : 'Question (English):'}
                </label>
                <input
                  type="text"
                  required
                  value={questionEn}
                  onChange={(e) => setQuestionEn(e.target.value)}
                  placeholder="e.g. How does acetylcholine modulate synaptic learning?"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isAr ? 'السؤال بالعربية:' : 'Question (Arabic):'}
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={questionAr}
                  onChange={(e) => setQuestionAr(e.target.value)}
                  placeholder="مثال: كيف يضبط الأستيل كولين التعلم المشبكي؟"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isAr ? 'المفهوم المتوقع تعزيزه:' : 'Expected Concept Target:'}
                </label>
                <input
                  type="text"
                  required
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder="e.g. Acetylcholine Attention Modulation"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isAr ? 'المنطقة الدماغية المستهدفة:' : 'Target Brain Region:'}
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as BrainRegion)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="prefrontal">Prefrontal Logic</option>
                  <option value="hippocampus">Hippocampus Memory</option>
                  <option value="limbic">Limbic Emotion</option>
                  <option value="motor">Motor Output</option>
                  <option value="sensory">Sensory Input</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-400 transition cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer"
                >
                  {isAr ? 'حفظ وإضافة' : 'Save & Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
