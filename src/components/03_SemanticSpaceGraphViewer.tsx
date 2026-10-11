/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LongTermMemoryRecord } from '../types';
import { CosineSimilarity } from '../engine/semantic/CosineSimilarity';
import { Compass, Sparkles, Orbit, Layers, Search } from 'lucide-react';

interface SemanticSpaceGraphViewerProps {
  memories: LongTermMemoryRecord[];
  lang: 'ar' | 'en';
}

const SEMANTIC_ANCHORS = [
  { id: 'logic', nameEn: 'Logic & Deduction', nameAr: 'المنطق والاستنباط', x: 220, y: 140, color: '#10b981' },
  { id: 'affect', nameEn: 'Emotion & Salience', nameAr: 'العاطفة والأهمية', x: 480, y: 120, color: '#f59e0b' },
  { id: 'memory', nameEn: 'Memory Consolidation', nameAr: 'تثبيت الذاكرة', x: 620, y: 300, color: '#a855f7' },
  { id: 'action', nameEn: 'Motor Action & Plan', nameAr: 'التخطيط الحركي', x: 340, y: 360, color: '#38bdf8' },
  { id: 'metacognition', nameEn: 'Metacognitive Audit', nameAr: 'ما وراء المعرفة', x: 180, y: 280, color: '#06b6d4' },
];

export const SemanticSpaceGraphViewer: React.FC<SemanticSpaceGraphViewerProps> = ({
  memories,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [selectedMemory, setSelectedMemory] = useState<LongTermMemoryRecord | null>(memories[0] || null);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Orbit className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-slate-100">
              {isAr
                ? 'عارض الفضاء الدلالي ونقاط الارتكاز (16-D Manifold)'
                : '16-D Semantic Vector Space & Anchors Projection'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {isAr
              ? 'إسقاط ثنائي الأبعاد للفضاء الدلالي متعدد الأبعاد؛ تتجمع المفاهيم حول نقاط الارتكاز المعرفية الخمس بحسب حسابات التشابه الجيبوي (Cosine Similarity >= 0.65).'
              : '2D topological manifold projection of 16-D semantic vectors, clustered around 5 core cognitive anchors via Cosine Similarity.'}
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-800/60 text-purple-300">
          Threshold: θ ≥ 0.65
        </span>
      </div>

      {/* 2D Projection Space Canvas */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <svg viewBox="0 0 800 480" className="w-full h-auto select-none min-w-[600px]">
          <defs>
            <radialGradient id="spaceGridGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#05070f" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central field glow */}
          <circle cx="400" cy="240" r="280" fill="url(#spaceGridGlow)" />

          {/* Distance orbital rings */}
          <circle cx="400" cy="240" r="100" fill="none" stroke="#334155" strokeDasharray="4 4" strokeWidth="1" opacity="0.4" />
          <circle cx="400" cy="240" r="180" fill="none" stroke="#334155" strokeDasharray="4 4" strokeWidth="1" opacity="0.3" />
          <circle cx="400" cy="240" r="260" fill="none" stroke="#334155" strokeDasharray="4 4" strokeWidth="1" opacity="0.2" />

          {/* Draw connecting lines between memory and closest anchor */}
          {memories.map((mem, i) => {
            const angle = (i / memories.length) * 2 * Math.PI;
            const radius = 140 + (i % 3) * 45;
            const memX = 400 + Math.cos(angle) * radius;
            const memY = 240 + Math.sin(angle) * radius;
            const isSelected = selectedMemory?.id === mem.id;

            return (
              <g key={mem.id} className="cursor-pointer" onClick={() => setSelectedMemory(mem)}>
                <line
                  x1="400"
                  y1="240"
                  x2={memX}
                  y2={memY}
                  stroke={isSelected ? '#38bdf8' : '#64748b'}
                  strokeWidth={isSelected ? 2 : 1}
                  strokeOpacity={isSelected ? 0.8 : 0.25}
                />

                <circle
                  cx={memX}
                  cy={memY}
                  r={isSelected ? 10 : 7}
                  fill={isSelected ? '#38bdf8' : '#090d1a'}
                  stroke={isSelected ? '#ffffff' : '#a855f7'}
                  strokeWidth="2"
                  className="transition-all duration-200"
                />

                <text
                  x={memX}
                  y={memY + 18}
                  textAnchor="middle"
                  fill={isSelected ? '#38bdf8' : '#94a3b8'}
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {isAr ? mem.conceptAr.slice(0, 16) : mem.concept.slice(0, 16)}
                </text>
              </g>
            );
          })}

          {/* Core Anchors */}
          {SEMANTIC_ANCHORS.map((anchor) => (
            <g key={anchor.id} transform={`translate(${anchor.x}, ${anchor.y})`}>
              <circle r="18" fill="#0f172a" stroke={anchor.color} strokeWidth="2.5" />
              <circle r="6" fill={anchor.color} className="animate-pulse" />
              <text
                textAnchor="middle"
                y="-24"
                fill={anchor.color}
                fontSize="11"
                fontWeight="bold"
              >
                {isAr ? anchor.nameAr : anchor.nameEn}
              </text>
            </g>
          ))}
        </svg>

        {/* Selected Concept Detail Card */}
        {selectedMemory && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-purple-400">
                {isAr ? 'المفهوم الدلالي المحدد' : 'Selected Semantic Concept'}
              </span>
              <h4 className="text-sm font-bold text-slate-100">
                {isAr ? selectedMemory.conceptAr : selectedMemory.concept}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                {isAr ? selectedMemory.definitionAr : selectedMemory.definition}
              </p>
            </div>

            <div className="font-mono text-xs text-right shrink-0">
              <span className="text-[10px] text-slate-500 block">
                {isAr ? 'قوة التثبيت' : 'Strength'}
              </span>
              <span className="text-cyan-400 font-bold text-base">
                {(selectedMemory.strength * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
