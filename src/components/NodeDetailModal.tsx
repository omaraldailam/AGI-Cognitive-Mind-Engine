/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CognitiveNode, ConnectomeEdge } from '../types';
import { X, Activity, Cpu, ArrowUpRight, ArrowDownLeft, Shield } from 'lucide-react';

interface NodeDetailModalProps {
  node: CognitiveNode | null;
  edges: ConnectomeEdge[];
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  node,
  edges,
  onClose,
  lang,
}) => {
  if (!node) return null;
  const isAr = lang === 'ar';

  const outgoingEdges = edges.filter((e) => e.source === node.id);
  const incomingEdges = edges.filter((e) => e.target === node.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-fadeIn">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                {node.region.toUpperCase()}
              </span>
              <span className="text-xs text-slate-500 font-mono">{node.id}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              {isAr ? node.nameAr : node.name}
            </h3>
            <p className="text-xs text-slate-400 font-mono">{node.subRegion}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Firing Potential & Membrane Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 font-mono block">
              {isAr ? 'كمون الغشاء الحالي' : 'Membrane Potential'}
            </span>
            <span className="text-lg font-bold font-mono text-cyan-400">
              {(node.activation * 100).toFixed(1)}%
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 font-mono block">
              {isAr ? 'عتبة الإثارة' : 'Threshold (θ)'}
            </span>
            <span className="text-lg font-bold font-mono text-amber-400">
              {node.threshold.toFixed(2)}
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 font-mono block">
              {isAr ? 'دالة التفعيل' : 'Activation Func'}
            </span>
            <span className="text-sm font-bold font-mono text-purple-400 uppercase mt-1 block">
              {node.activationFunction}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="p-3.5 bg-slate-900/40 border border-slate-800/70 rounded-xl text-xs text-slate-300 leading-relaxed">
          <span className="text-slate-400 font-semibold block mb-0.5">
            {isAr ? 'الدور الوظيفي في الدماغ:' : 'Functional Cognitive Role:'}
          </span>
          <p>{isAr ? node.descriptionAr : node.description}</p>
        </div>

        {/* Receptive Field Tags */}
        <div>
          <span className="text-xs text-slate-400 block mb-1.5 font-mono">
            {isAr ? 'الحقل المستقبِل (Receptive Field):' : 'Receptive Field Tokens:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {node.receptiveField.map((rf, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 font-mono"
              >
                {rf}
              </span>
            ))}
          </div>
        </div>

        {/* Synaptic Connectome Connections */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-900">
          <div>
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mb-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? 'مشابك صادرة' : 'Outgoing Axons'} ({outgoingEdges.length}):</span>
            </span>
            <div className="space-y-1 max-h-24 overflow-y-auto font-mono text-[11px]">
              {outgoingEdges.map((e) => (
                <div key={e.id} className="flex justify-between text-slate-400 bg-slate-900/40 px-2 py-0.5 rounded">
                  <span className="truncate max-w-[120px] text-purple-300">{e.target}</span>
                  <span className={e.weight >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {e.weight.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mb-1">
              <ArrowDownLeft className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isAr ? 'مشابك واردة' : 'Incoming Dendrites'} ({incomingEdges.length}):</span>
            </span>
            <div className="space-y-1 max-h-24 overflow-y-auto font-mono text-[11px]">
              {incomingEdges.map((e) => (
                <div key={e.id} className="flex justify-between text-slate-400 bg-slate-900/40 px-2 py-0.5 rounded">
                  <span className="truncate max-w-[120px] text-cyan-300">{e.source}</span>
                  <span className={e.weight >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {e.weight.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
