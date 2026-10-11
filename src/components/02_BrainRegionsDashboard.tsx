/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CognitiveNode, ConnectomeEdge, GlobalNetworkState, BrainRegion } from '../types';
import { Cpu, Activity, Zap, Shield, Sparkles } from 'lucide-react';

interface BrainRegionsDashboardProps {
  nodes: CognitiveNode[];
  edges: ConnectomeEdge[];
  networkState: GlobalNetworkState;
  lang: 'ar' | 'en';
}

const REGION_THEMES: Record<BrainRegion, { nameEn: string; nameAr: string; color: string; badge: string }> = {
  sensory: { nameEn: 'Sensory Cortex', nameAr: 'القشرة الحسية', color: '#06b6d4', badge: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60' },
  limbic: { nameEn: 'Limbic Core', nameAr: 'الجهاز الحوفي', color: '#f59e0b', badge: 'bg-amber-950/70 text-amber-300 border-amber-800/60' },
  hippocampus: { nameEn: 'Hippocampus Memory', nameAr: 'الحصين والذاكرة', color: '#a855f7', badge: 'bg-purple-950/70 text-purple-300 border-purple-800/60' },
  prefrontal: { nameEn: 'Prefrontal Logic', nameAr: 'القشرة الجبهية', color: '#10b981', badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60' },
  motor: { nameEn: 'Motor Output', nameAr: 'القشرة الحركية', color: '#38bdf8', badge: 'bg-sky-950/70 text-sky-300 border-sky-800/60' },
};

export const BrainRegionsDashboard: React.FC<BrainRegionsDashboardProps> = ({
  nodes,
  edges,
  networkState,
  lang,
}) => {
  const isAr = lang === 'ar';

  const regions: BrainRegion[] = ['sensory', 'limbic', 'hippocampus', 'prefrontal', 'motor'];

  return (
    <div className="space-y-6">
      {/* Top Telemetry Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[11px] text-slate-400 font-mono block">
            {isAr ? 'متوسط جهد الغشاء' : 'Mean Membrane Potential'}
          </span>
          <span className="text-lg font-bold font-mono text-cyan-400 mt-1 block">
            {((nodes.reduce((a, b) => a + b.activation, 0) / nodes.length) * 100).toFixed(1)}%
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[11px] text-slate-400 font-mono block">
            {isAr ? 'متوسط الأوزان التشابكية' : 'Mean Synaptic Weight'}
          </span>
          <span className="text-lg font-bold font-mono text-indigo-400 mt-1 block">
            {(edges.reduce((a, b) => a + b.weight, 0) / edges.length).toFixed(3)}
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[11px] text-slate-400 font-mono block">
            {isAr ? 'عامل استقرار الشبكة' : 'Network Stability Factor'}
          </span>
          <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">
            {(1.0 - networkState.entropy).toFixed(2)}
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[11px] text-slate-400 font-mono block">
            {isAr ? 'إجمالي الخلايا النشطة' : 'Active Cells Firing'}
          </span>
          <span className="text-lg font-bold font-mono text-amber-400 mt-1 block">
            {nodes.filter((n) => n.activation > 0.35).length} / {nodes.length}
          </span>
        </div>
      </div>

      {/* 5 Regions In-Depth Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions.map((reg) => {
          const regNodes = nodes.filter((n) => n.region === reg);
          const theme = REGION_THEMES[reg];
          const meanAct = regNodes.reduce((a, b) => a + b.activation, 0) / (regNodes.length || 1);

          return (
            <div
              key={reg}
              className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${theme.badge}`}>
                    {isAr ? theme.nameAr : theme.nameEn}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {regNodes.length} {isAr ? 'عقد' : 'nodes'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>{isAr ? 'جهد الغشاء المتوسط:' : 'Mean Potential:'}</span>
                    <span className="font-bold text-slate-200">{(meanAct * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${meanAct * 100}%`, backgroundColor: theme.color }}
                    />
                  </div>
                </div>

                {/* Nodes in this region */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-500 font-mono uppercase block">
                    {isAr ? 'الخلايا العصبية النشطة:' : 'Active Hubs:'}
                  </span>
                  {regNodes.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-center justify-between text-xs bg-slate-900/50 px-2.5 py-1 rounded-lg border border-slate-850"
                    >
                      <span className="truncate max-w-[150px] text-slate-300">
                        {isAr ? n.nameAr : n.name}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-cyan-400">
                        {(n.activation * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>{reg.toUpperCase()} LAYER</span>
                <span className="text-emerald-400">● LIVE IN RAM</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
