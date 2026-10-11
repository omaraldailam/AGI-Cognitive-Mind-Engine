/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CognitiveNode,
  ConnectomeEdge,
  BrainRegion,
  GlobalNetworkState,
} from '../types';
import { Activity, Zap, ShieldAlert, Cpu } from 'lucide-react';

interface ConnectomeCanvasProps {
  nodes: CognitiveNode[];
  edges: ConnectomeEdge[];
  networkState: GlobalNetworkState;
  lang: 'ar' | 'en';
  onSelectNode: (node: CognitiveNode) => void;
}

const REGION_CONFIG: Record<
  BrainRegion,
  {
    nameEn: string;
    nameAr: string;
    color: string;
    borderColor: string;
    bgBadge: string;
    textColor: string;
    x: number; // column index 0..4
  }
> = {
  sensory: {
    nameEn: 'Sensory Input',
    nameAr: 'المدخلات الحسية',
    color: '#06b6d4', // cyan-500
    borderColor: 'border-cyan-500/40',
    bgBadge: 'bg-cyan-950/60',
    textColor: 'text-cyan-400',
    x: 100,
  },
  limbic: {
    nameEn: 'Limbic Emotion',
    nameAr: 'الجهاز الحوفي والعاطفة',
    color: '#f59e0b', // amber-500
    borderColor: 'border-amber-500/40',
    bgBadge: 'bg-amber-950/60',
    textColor: 'text-amber-400',
    x: 320,
  },
  hippocampus: {
    nameEn: 'Hippocampus Memory',
    nameAr: 'الحصين والذاكرة',
    color: '#a855f7', // purple-500
    borderColor: 'border-purple-500/40',
    bgBadge: 'bg-purple-950/60',
    textColor: 'text-purple-400',
    x: 540,
  },
  prefrontal: {
    nameEn: 'Prefrontal Logic',
    nameAr: 'القشرة الجبهية والمنطق',
    color: '#10b981', // emerald-500
    borderColor: 'border-emerald-500/40',
    bgBadge: 'bg-emerald-950/60',
    textColor: 'text-emerald-400',
    x: 760,
  },
  motor: {
    nameEn: 'Motor Output',
    nameAr: 'المخرجات الحركية والتعبير',
    color: '#38bdf8', // sky-400
    borderColor: 'border-sky-500/40',
    bgBadge: 'bg-sky-950/60',
    textColor: 'text-sky-400',
    x: 980,
  },
};

export const ConnectomeCanvas: React.FC<ConnectomeCanvasProps> = ({
  nodes,
  edges,
  networkState,
  lang,
  onSelectNode,
}) => {
  const isAr = lang === 'ar';
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Layout node coordinates inside SVG
  // Compute positions dynamically per column
  const regionNodes: Record<BrainRegion, CognitiveNode[]> = {
    sensory: [],
    limbic: [],
    hippocampus: [],
    prefrontal: [],
    motor: [],
  };

  nodes.forEach((n) => {
    if (regionNodes[n.region]) {
      regionNodes[n.region].push(n);
    }
  });

  const nodePositions: Record<string, { x: number; y: number }> = {};
  const svgHeight = 540;
  const svgWidth = 1080;

  Object.entries(regionNodes).forEach(([regKey, regNodeList]) => {
    const reg = regKey as BrainRegion;
    const colX = REGION_CONFIG[reg].x;
    const count = regNodeList.length;
    const spacing = (svgHeight - 120) / (count + 1);

    regNodeList.forEach((n, idx) => {
      nodePositions[n.id] = {
        x: colX,
        y: 80 + spacing * (idx + 1),
      };
    });
  });

  const activeFiringCount = nodes.filter((n) => n.activation > 0.35).length;

  return (
    <div className="space-y-4">
      {/* Top Topology Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
              {isAr ? 'مؤشر العالم الصغير (S)' : 'Small-World Index'}
            </div>
            <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
              {networkState.smallWorldIndex.toFixed(2)}
            </div>
          </div>
          <Activity className="w-5 h-5 text-cyan-400/60" />
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
              {isAr ? 'كثافة الكونيكتوم' : 'Connectome Density'}
            </div>
            <div className="text-lg font-bold text-indigo-400 font-mono mt-0.5">
              {(networkState.networkDensity * 100).toFixed(1)}%
            </div>
          </div>
          <Cpu className="w-5 h-5 text-indigo-400/60" />
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
              {isAr ? 'معامل العنقودية' : 'Clustering Coeff.'}
            </div>
            <div className="text-lg font-bold text-purple-400 font-mono mt-0.5">
              {networkState.clusteringCoefficient.toFixed(2)}
            </div>
          </div>
          <Zap className="w-5 h-5 text-purple-400/60" />
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
              {isAr ? 'مؤشر الوعي المتزامن' : 'Consciousness Metric'}
            </div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
              {(networkState.consciousnessIndex * 100).toFixed(0)}%
            </div>
          </div>
          <ShieldAlert className="w-5 h-5 text-emerald-400/60" />
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 col-span-2 sm:col-span-4 lg:col-span-1 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
              {isAr ? 'عقد في حالة إثارة نشطة' : 'Active Firing Nodes'}
            </div>
            <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">
              {activeFiringCount} / {nodes.length}
            </div>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
        </div>
      </div>

      {/* Main Connectome Canvas Card */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
        {/* Subtle background neural grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Region Labels Bar above canvas */}
        <div className="grid grid-cols-5 gap-2 mb-3 text-center z-10 relative">
          {(Object.keys(REGION_CONFIG) as BrainRegion[]).map((regionKey) => {
            const cfg = REGION_CONFIG[regionKey];
            return (
              <div
                key={regionKey}
                className={`py-1 px-2 rounded-lg border ${cfg.borderColor} ${cfg.bgBadge} backdrop-blur-sm`}
              >
                <span className={`text-xs font-semibold ${cfg.textColor}`}>
                  {isAr ? cfg.nameAr : cfg.nameEn}
                </span>
              </div>
            );
          })}
        </div>

        {/* SVG Connectome Graph */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[800px] select-none"
          >
            <defs>
              {/* Radial gradient for glowing fired nodes */}
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="limbicGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="prefrontalGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Region Column Guides */}
            {(Object.keys(REGION_CONFIG) as BrainRegion[]).map((regionKey) => {
              const cfg = REGION_CONFIG[regionKey];
              return (
                <line
                  key={`col_${regionKey}`}
                  x1={cfg.x}
                  y1={40}
                  x2={cfg.x}
                  y2={svgHeight - 30}
                  stroke={cfg.color}
                  strokeOpacity="0.12"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                />
              );
            })}

            {/* Render Edges */}
            {edges.map((edge) => {
              const srcPos = nodePositions[edge.source];
              const tgtPos = nodePositions[edge.target];
              if (!srcPos || !tgtPos) return null;

              const isHighlighted =
                hoveredNodeId === edge.source || hoveredNodeId === edge.target;
              const isExcitatory = edge.weight >= 0;
              const absWeight = Math.abs(edge.weight);
              const strokeWidth = Math.max(1.2, absWeight * 3.5);

              // Colors based on transmitter and polarity
              let strokeColor = isExcitatory ? '#38bdf8' : '#f43f5e';
              if (edge.neurotransmitterModulation === 'dopamine') strokeColor = '#f59e0b';
              if (edge.neurotransmitterModulation === 'acetylcholine') strokeColor = '#a855f7';
              if (edge.neurotransmitterModulation === 'gaba') strokeColor = '#ec4899';

              // Curve path control point
              const dx = tgtPos.x - srcPos.x;
              const dy = tgtPos.y - srcPos.y;
              const cx = srcPos.x + dx * 0.5;
              const cy = srcPos.y + dy * 0.5 - (dx === 0 ? 40 : 15);

              return (
                <g key={edge.id} className="transition-opacity duration-300">
                  <path
                    d={`M ${srcPos.x} ${srcPos.y} Q ${cx} ${cy} ${tgtPos.x} ${tgtPos.y}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isHighlighted ? strokeWidth + 1.5 : strokeWidth}
                    strokeOpacity={
                      hoveredNodeId
                        ? isHighlighted
                          ? 0.95
                          : 0.12
                        : 0.35 + absWeight * 0.4
                    }
                  />

                  {/* Firing Particle Animation on active pulse */}
                  {edge.activePulse && (
                    <circle r="3.5" fill="#ffffff" filter="drop-shadow(0 0 5px #38bdf8)">
                      <animateMotion
                        path={`M ${srcPos.x} ${srcPos.y} Q ${cx} ${cy} ${tgtPos.x} ${tgtPos.y}`}
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Render Nodes */}
            {nodes.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;

              const cfg = REGION_CONFIG[node.region];
              const isHovered = hoveredNodeId === node.id;
              const isFiring = node.activation > 0.4;
              const nodeRadius = 24 + node.activation * 12;

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => onSelectNode(node)}
                >
                  {/* Firing halo glow */}
                  {isFiring && (
                    <circle
                      r={nodeRadius + 14}
                      fill={cfg.color}
                      opacity={0.25}
                      className="animate-pulse"
                    />
                  )}

                  {/* Outer membrane potential meter ring */}
                  <circle
                    r={nodeRadius + 4}
                    fill="none"
                    stroke={cfg.color}
                    strokeOpacity={0.3}
                    strokeWidth="2"
                  />
                  <circle
                    r={nodeRadius + 4}
                    fill="none"
                    stroke={cfg.color}
                    strokeWidth="3"
                    strokeDasharray={`${2 * Math.PI * (nodeRadius + 4)}`}
                    strokeDashoffset={`${
                      2 * Math.PI * (nodeRadius + 4) * (1 - node.activation)
                    }`}
                    strokeLinecap="round"
                    transform="rotate(-90)"
                  />

                  {/* Node Core */}
                  <circle
                    r={nodeRadius}
                    fill="#090d1a"
                    stroke={isHovered ? '#ffffff' : cfg.color}
                    strokeWidth={isHovered ? 2.5 : 1.8}
                    className="transition-all duration-200"
                  />

                  {/* Inner activation fill */}
                  <circle
                    r={nodeRadius * 0.75}
                    fill={cfg.color}
                    fillOpacity={0.15 + node.activation * 0.75}
                  />

                  {/* Node label code */}
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="monospace"
                    className="pointer-events-none"
                  >
                    {(node.activation * 100).toFixed(0)}%
                  </text>

                  {/* Subtext description below node */}
                  <text
                    textAnchor="middle"
                    y={nodeRadius + 18}
                    fill="#cbd5e1"
                    fontSize="11"
                    fontWeight="500"
                    className="pointer-events-none"
                  >
                    {isAr ? node.nameAr.slice(0, 20) : node.name.slice(0, 22)}
                  </text>
                  <text
                    textAnchor="middle"
                    y={nodeRadius + 30}
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                    className="pointer-events-none"
                  >
                    {node.subRegion.slice(0, 18)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-semibold text-slate-300">
              {isAr ? 'دلالات الإشارات المشبكية:' : 'Synaptic Markers:'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-cyan-400 rounded-full" />
              <span>{isAr ? 'غلوتامات (إثارة)' : 'Glutamate (Excitatory)'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-400 rounded-full" />
              <span>{isAr ? 'دوبامين (مكافأة ولدونة)' : 'Dopamine (Reward/Plasticity)'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-purple-400 rounded-full" />
              <span>{isAr ? 'أستيل كولين (انتباه)' : 'Acetylcholine (Attention)'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-rose-500 rounded-full" />
              <span>{isAr ? 'جابا (تثبيط وكبح)' : 'GABA (Inhibitory Brake)'}</span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            {isAr ? 'انقر على أي عقدة لفحص كمون الغشاء ومصفوفة المستقبلات' : 'Click any node to inspect membrane potential and receptive fields'}
          </div>
        </div>
      </div>
    </div>
  );
};
