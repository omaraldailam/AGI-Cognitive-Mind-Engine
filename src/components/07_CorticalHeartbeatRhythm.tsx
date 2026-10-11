/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Play,
  Pause,
  Zap,
  Sliders,
  Shield,
  Clock,
  Radio,
} from 'lucide-react';
import { GlobalNetworkState, NeurotransmitterLevels } from '../types';

interface CorticalHeartbeatProps {
  networkState: GlobalNetworkState;
  neurotransmitters: NeurotransmitterLevels;
  onTickStep: () => void;
  lang: 'ar' | 'en';
}

interface BrainwaveBand {
  name: string;
  nameAr: string;
  rangeHz: string;
  color: string;
  amplitude: number;
  cognitiveFunction: string;
  cognitiveFunctionAr: string;
}

export const CorticalHeartbeatRhythm: React.FC<CorticalHeartbeatProps> = ({
  networkState,
  neurotransmitters,
  onTickStep,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [isRunning, setIsRunning] = useState(false);
  const [frequencyHz, setFrequencyHz] = useState<number>(2); // 1, 2, or 5 Hz
  const [wavePhase, setWavePhase] = useState<number>(0);

  // Biological Brainwave Bands
  const bands: BrainwaveBand[] = [
    {
      name: 'Gamma (γ)',
      nameAr: 'غاما (γ)',
      rangeHz: '30 - 80 Hz',
      color: '#ec4899', // pink-500
      amplitude: 0.85 * neurotransmitters.glutamate,
      cognitiveFunction: 'Cognitive binding, cross-modal insight, conscious perception',
      cognitiveFunctionAr: 'الربط المعرفي، الاستبصار العابر للوسائط، والوعي البؤري',
    },
    {
      name: 'Beta (β)',
      nameAr: 'بيتا (β)',
      rangeHz: '13 - 30 Hz',
      color: '#38bdf8', // sky-400
      amplitude: 0.75 * neurotransmitters.dopamine,
      cognitiveFunction: 'Active problem solving, prefrontal working memory, alertness',
      cognitiveFunctionAr: 'حل المشكلات النشط، الذاكرة العاملة الجبهية، واليقظة',
    },
    {
      name: 'Alpha (α)',
      nameAr: 'ألفا (α)',
      rangeHz: '8 - 12 Hz',
      color: '#10b981', // emerald-500
      amplitude: 0.65 * neurotransmitters.serotonin,
      cognitiveFunction: 'Relaxed focus, sensory gating, inhibitory circuit control',
      cognitiveFunctionAr: 'التركيز الهادئ، بوابات الترشيح الحسي، وكبح التشتت',
    },
    {
      name: 'Theta (θ)',
      nameAr: 'ثيتا (θ)',
      rangeHz: '4 - 8 Hz',
      color: '#a855f7', // purple-500
      amplitude: 0.80 * neurotransmitters.acetylcholine,
      cognitiveFunction: 'Hippocampal episodic retrieval, associative dreaming, plasticity',
      cognitiveFunctionAr: 'الاسترجاع العرضي في الحصين، الأحلام الترابطية، واللدونة',
    },
    {
      name: 'Delta (δ)',
      nameAr: 'دلتا (δ)',
      rangeHz: '0.5 - 4 Hz',
      color: '#f59e0b', // amber-500
      amplitude: 0.40 * neurotransmitters.gaba,
      cognitiveFunction: 'Deep schema consolidation, homeostatic metabolic repair',
      cognitiveFunctionAr: 'التثبيت العميق للمخططات، والترميم الاستقراري للأيض',
    },
  ];

  // Rhythmic continuous loop
  useEffect(() => {
    if (!isRunning) return;

    const intervalMs = Math.round(1000 / frequencyHz);
    const timer = setInterval(() => {
      onTickStep();
      setWavePhase((p) => (p + 0.25) % (Math.PI * 2));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isRunning, frequencyHz, onTickStep]);

  return (
    <div className="space-y-6">
      {/* Rhythm Controller Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h2 className="text-lg font-bold text-slate-100">
              {isAr
                ? 'نبض الساعة القشرية وموجات الرنين الدماغي (EEG Spectra)'
                : 'Cortical Oscillatory Clock & EEG Brainwave Rhythm'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {isAr
              ? 'محاكاة مستمرة لنبض الدماغ التلقائي وتدفق التيارات الكهربائية عبر نطاقات التردد الخمسة (غاما، بيتا، ألفا، ثيتا، دلتا) للحفاظ على اللدونة ومقاومة الخمول.'
              : 'Continuous simulation of background cortical rhythm and oscillatory spectral bands preserving synaptic readiness and homeostatic flux.'}
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          {/* Hz selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs">
            {[1, 2, 5].map((hz) => (
              <button
                key={hz}
                onClick={() => setFrequencyHz(hz)}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  frequencyHz === hz
                    ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {hz} Hz
              </button>
            ))}
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition cursor-pointer ${
              isRunning
                ? 'bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-300'
                : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-600/20'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>{isAr ? 'إيقاف النبض التلقائي' : 'Pause Clock'}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>{isAr ? 'تشغيل النبض التلقائي' : 'Start Heartbeat'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5 EEG Brainwave Bands Spectrogram */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {bands.map((b) => {
          const powerPercent = Math.min(100, Math.round(b.amplitude * 100));

          return (
            <div
              key={b.name}
              className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold font-mono text-slate-100">
                    {isAr ? b.nameAr : b.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{b.rangeHz}</span>
                </div>

                <div className="flex justify-between items-center text-xs font-mono my-2">
                  <span className="text-slate-500">{isAr ? 'الطاقة النسبية:' : 'Relative Power:'}</span>
                  <span className="font-bold" style={{ color: b.color }}>
                    {powerPercent}%
                  </span>
                </div>

                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${powerPercent}%`, backgroundColor: b.color }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isAr ? b.cognitiveFunctionAr : b.cognitiveFunction}
                </p>
              </div>

              {/* Synthetic Waveform Canvas */}
              <div className="pt-2 border-t border-slate-900 h-10 overflow-hidden relative">
                <svg viewBox="0 0 120 30" className="w-full h-full">
                  <path
                    d={`M 0 ${15 + Math.sin(wavePhase) * (powerPercent * 0.1)} 
                       Q 30 ${15 - Math.sin(wavePhase * 1.5) * (powerPercent * 0.12)}, 60 15 
                       T 120 ${15 + Math.sin(wavePhase * 2) * (powerPercent * 0.1)}`}
                    fill="none"
                    stroke={b.color}
                    strokeWidth="1.8"
                    strokeOpacity={isRunning ? 0.9 : 0.4}
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
