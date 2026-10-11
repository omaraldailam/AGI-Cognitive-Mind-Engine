/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LongTermMemoryRecord,
  EpisodicMemoryTrace,
  ConnectomeEdge,
  CognitiveNode,
} from '../types';
import {
  Database,
  Search,
  Plus,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Sliders,
} from 'lucide-react';
import { EmbeddingProvider } from '../engine/semantic/EmbeddingProvider';

interface MemoryMatrixViewProps {
  longTermMemories: LongTermMemoryRecord[];
  episodicBuffer: EpisodicMemoryTrace[];
  edges: ConnectomeEdge[];
  nodes: CognitiveNode[];
  lang: 'ar' | 'en';
  onAddMemory: (record: LongTermMemoryRecord) => void;
  onUpdateEdgeWeight: (edgeId: string, newWeight: number) => void;
}

export const MemoryMatrixView: React.FC<MemoryMatrixViewProps> = ({
  longTermMemories,
  episodicBuffer,
  edges,
  nodes,
  lang,
  onAddMemory,
  onUpdateEdgeWeight,
}) => {
  const isAr = lang === 'ar';
  const [subTab, setSubTab] = useState<'semantic' | 'episodic' | 'matrix'>('semantic');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New concept form state
  const [newConceptEn, setNewConceptEn] = useState('');
  const [newConceptAr, setNewConceptAr] = useState('');
  const [newDefEn, setNewDefEn] = useState('');
  const [newDefAr, setNewDefAr] = useState('');

  const filteredSemantic = longTermMemories.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.concept.toLowerCase().includes(q) ||
      m.conceptAr.includes(q) ||
      m.definition.toLowerCase().includes(q) ||
      m.definitionAr.includes(q)
    );
  });

  const handleCreateConcept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConceptEn.trim() || !newDefEn.trim()) return;

    const newRecord: LongTermMemoryRecord = {
      id: `mem_user_${Date.now()}`,
      concept: newConceptEn.trim(),
      conceptAr: newConceptAr.trim() || newConceptEn.trim(),
      definition: newDefEn.trim(),
      definitionAr: newDefAr.trim() || newDefEn.trim(),
      embedding: EmbeddingProvider.embed(newConceptEn + ' ' + newDefEn),
      associations: ['pfc_dlpfc_executive', 'hippo_ca3_reentry'],
      strength: 0.9,
      accessCount: 1,
      lastRecalledAt: Date.now(),
    };

    onAddMemory(newRecord);
    setShowAddModal(false);
    setNewConceptEn('');
    setNewConceptAr('');
    setNewDefEn('');
    setNewDefAr('');
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-2 rounded-xl">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSubTab('semantic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              subTab === 'semantic'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isAr ? 'الذاكرة الدلالية طويلة المدى' : 'Long-Term Semantic'}
          </button>
          <button
            onClick={() => setSubTab('episodic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              subTab === 'episodic'
                ? 'bg-purple-950/80 text-purple-300 border border-purple-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isAr ? 'المخزن العرضي قصير المدى' : 'Short-Term Episodic'}
          </button>
          <button
            onClick={() => setSubTab('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              subTab === 'matrix'
                ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isAr ? 'مصفوفة الأوزان المشبكية' : 'Synaptic Weights Matrix'}
          </button>
        </div>

        {subTab === 'semantic' && (
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder={isAr ? 'بحث في المفاهيم...' : 'Search schemas...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? 'إضافة مفهوم' : 'New Concept'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 1. Long-Term Semantic Tab */}
      {subTab === 'semantic' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSemantic.map((mem) => (
            <div
              key={mem.id}
              className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-cyan-800/60 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-100">
                      {isAr ? mem.conceptAr : mem.concept}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      {isAr ? mem.concept : mem.conceptAr}
                    </span>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300">
                    {(mem.strength * 100).toFixed(0)}% Str
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {isAr ? mem.definitionAr : mem.definition}
                </p>

                {/* 16-D Embedding Vector Visual representation */}
                <div className="mb-3">
                  <div className="text-[10px] text-slate-500 font-mono mb-1">
                    {isAr ? 'بصمة المتجه الدلالي (16-D Manifold):' : '16-D Semantic Vector Fingerprint:'}
                  </div>
                  <div className="flex items-center gap-0.5 h-3 bg-slate-900 rounded p-0.5">
                    {mem.embedding.map((val, idx) => {
                      const heightPercent = Math.max(15, Math.min(100, Math.abs(val) * 100));
                      const isPos = val >= 0;
                      return (
                        <div
                          key={idx}
                          className="flex-1 rounded-sm"
                          style={{
                            height: `${heightPercent}%`,
                            backgroundColor: isPos ? '#38bdf8' : '#f43f5e',
                            opacity: 0.8,
                          }}
                          title={`Dim ${idx}: ${val.toFixed(3)}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-500">{isAr ? 'عقد مرتبطة:' : 'Anchored:'}</span>
                  {mem.associations.slice(0, 2).map((a, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 font-mono text-[10px]"
                    >
                      {a}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-slate-500">
                  {mem.accessCount} {isAr ? 'استدعاء' : 'recalls'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Short-Term Episodic Buffer Tab */}
      {subTab === 'episodic' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>
                {isAr
                  ? 'يتم تخزين التجارب والاستفسارات الأخيرة هنا مؤقتاً، وتتثبت في الذاكرة الدلالية عند تشغيل دورة الحلم.'
                  : 'Recent experiences are temporarily staged here, consolidating into crystallized semantic schemas during dream cycles.'}
              </span>
            </span>
            <span className="font-mono text-purple-300 font-semibold">
              {episodicBuffer.length} {isAr ? 'آثار' : 'traces'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {episodicBuffer.map((ep) => (
              <div
                key={ep.id}
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(ep.timestamp).toLocaleTimeString()}
                    </span>
                    {ep.consolidated ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {isAr ? 'متبلور ومثبت' : 'Consolidated'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800/50 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {isAr ? 'قيد الانتظار لدورة الحلم' : 'Pending Dream Replay'}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200">"{ep.inputPrompt}"</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{ep.response}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">
                      {isAr ? 'الأهمية (Salience)' : 'Salience'}
                    </span>
                    <span className="text-amber-400 font-bold">
                      {(ep.salience * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">
                      {isAr ? 'التكافؤ (Valence)' : 'Valence'}
                    </span>
                    <span className={ep.valence >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {ep.valence >= 0 ? `+${ep.valence}` : ep.valence}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Synaptic Weights Matrix Tab */}
      {subTab === 'matrix' && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>{isAr ? 'مصفوفة التوصيلية والروابط المشبكية' : 'Synaptic Connectome Conductance'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAr
                  ? 'يمكنك تعديل أوزان الروابط المشبكية يدوياً لمعاينة التأثير المباشر على التوصيل العصبي.'
                  : 'Manually fine-tune synaptic weights to observe direct impact on neural conductance.'}
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-950/80 px-2 py-1 rounded-lg border border-indigo-800/40">
              {edges.length} {isAr ? 'مشابك متصلة' : 'synaptic edges'}
            </span>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-900 sticky top-0 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-2.5">{isAr ? 'المصدر (Presynaptic)' : 'Presynaptic Node'}</th>
                  <th className="p-2.5">{isAr ? 'الهدف (Postsynaptic)' : 'Postsynaptic Node'}</th>
                  <th className="p-2.5">{isAr ? 'الناقل' : 'Modulator'}</th>
                  <th className="p-2.5 text-center">{isAr ? 'الوزن (w)' : 'Weight (w)'}</th>
                  <th className="p-2.5">{isAr ? 'ضبط الوزن' : 'Tuning Slider'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300 font-mono">
                {edges.map((edge) => {
                  const isPos = edge.weight >= 0;
                  return (
                    <tr key={edge.id} className="hover:bg-slate-900/40">
                      <td className="p-2.5 text-cyan-300 font-medium">{edge.source}</td>
                      <td className="p-2.5 text-purple-300 font-medium">{edge.target}</td>
                      <td className="p-2.5 text-slate-400 capitalize">{edge.neurotransmitterModulation}</td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            isPos
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                              : 'bg-rose-950 text-rose-400 border border-rose-800/40'
                          }`}
                        >
                          {isPos ? `+${edge.weight.toFixed(3)}` : edge.weight.toFixed(3)}
                        </span>
                      </td>
                      <td className="p-2.5 w-44">
                        <input
                          type="range"
                          min="-1.0"
                          max="1.0"
                          step="0.01"
                          value={edge.weight}
                          onChange={(e) => onUpdateEdgeWeight(edge.id, parseFloat(e.target.value))}
                          className="w-full h-1.5 rounded-lg bg-slate-800 appearance-none cursor-pointer accent-cyan-400"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Concept Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <span>{isAr ? 'حقن مفهوم معرفي جديد في الذاكرة' : 'Inject New Semantic Concept Schema'}</span>
            </h3>

            <form onSubmit={handleCreateConcept} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isAr ? 'اسم المفهوم (English):' : 'Concept Name (English):'}
                </label>
                <input
                  type="text"
                  required
                  value={newConceptEn}
                  onChange={(e) => setNewConceptEn(e.target.value)}
                  placeholder="e.g. Predictive Coding & Error Minimization"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isAr ? 'اسم المفهوم بالعربية:' : 'Concept Name (Arabic):'}
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={newConceptAr}
                  onChange={(e) => setNewConceptAr(e.target.value)}
                  placeholder="مثال: الترميز التنبؤي وتقليل خطأ التوقع"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isAr ? 'التعريف والشرح المعرفي (English):' : 'Definition (English):'}
                </label>
                <textarea
                  required
                  rows={2}
                  value={newDefEn}
                  onChange={(e) => setNewDefEn(e.target.value)}
                  placeholder="The brain constantly predicts sensory inputs and updates models on discrepancy."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isAr ? 'التعريف والشرح بالعربية:' : 'Definition (Arabic):'}
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={newDefAr}
                  onChange={(e) => setNewDefAr(e.target.value)}
                  placeholder="يتوقع الدماغ الإشارات الحسية باستمرار ويحدث نماذجه عند حدوث خطأ في التنبؤ."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
                />
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
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition cursor-pointer"
                >
                  {isAr ? 'حقن وتثبيت' : 'Inject & Crystallize'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
