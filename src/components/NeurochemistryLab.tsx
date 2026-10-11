/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NeurotransmitterLevels } from '../types';
import { FlaskConical, Sparkles, Shield, Zap, AlertTriangle, Compass } from 'lucide-react';

interface NeurochemistryLabProps {
  neurotransmitters: NeurotransmitterLevels;
  onUpdateTransmitter: (name: keyof NeurotransmitterLevels, value: number) => void;
  onApplyPreset: (preset: NeurotransmitterLevels) => void;
  lang: 'ar' | 'en';
}

interface TransmitterInfo {
  nameEn: string;
  nameAr: string;
  abbreviation: string;
  color: string;
  bgLight: string;
  borderLight: string;
  descEn: string;
  descAr: string;
  functionalRoleEn: string;
  functionalRoleAr: string;
}

const TRANSMITTER_CONFIG: Record<keyof NeurotransmitterLevels, TransmitterInfo> = {
  dopamine: {
    nameEn: 'Dopamine',
    nameAr: 'الدوبامين',
    abbreviation: 'DA',
    color: '#f59e0b', // amber-500
    bgLight: 'bg-amber-950/40',
    borderLight: 'border-amber-700/50',
    descEn: 'Drives curiosity, reward expectation, and accelerates Hebbian Long-Term Potentiation (LTP).',
    descAr: 'يحفز الفضول وتوقع المكافأة ويسرع التقوية المشبكية طويلة المدى (LTP).',
    functionalRoleEn: 'High DA accelerates learning rate and encourages cognitive exploration.',
    functionalRoleAr: 'ارتفاع الدوبامين يسرع التعلم ويشجع الاستكشاف المعرفي الواسع.',
  },
  serotonin: {
    nameEn: 'Serotonin',
    nameAr: 'السيروتونين',
    abbreviation: '5-HT',
    color: '#06b6d4', // cyan-500
    bgLight: 'bg-cyan-950/40',
    borderLight: 'border-cyan-700/50',
    descEn: 'Regulates affective stability, patience, impulse control, and subjective well-being.',
    descAr: 'ينظم الاستقرار العاطفي، والصبر، وضبط الاندفاع، والتوازن الداخلي.',
    functionalRoleEn: 'High 5-HT stabilizes decision thresholds and prevents emotional over-reaction.',
    functionalRoleAr: 'ارتفاع السيروتونين يثبت عتبات اتخاذ القرار ويمنع التذبذب الانفعالي.',
  },
  acetylcholine: {
    nameEn: 'Acetylcholine',
    nameAr: 'الأستيل كولين',
    abbreviation: 'ACh',
    color: '#a855f7', // purple-500
    bgLight: 'bg-purple-950/40',
    borderLight: 'border-purple-700/50',
    descEn: 'Governs focused attention, signal signal-to-noise ratio, and memory consolidation speed.',
    descAr: 'يدير تركيز الانتباه الانتقائي، ونقاء الإشارة، وسرعة تثبيت الذكريات.',
    functionalRoleEn: 'High ACh sharpens working memory representations and prevents memory leakage.',
    functionalRoleAr: 'ارتفاع الأستيل كولين يصقل تمثيلات الذاكرة العاملة ويمنع تشتت الأفكار.',
  },
  norepinephrine: {
    nameEn: 'Norepinephrine',
    nameAr: 'النورإبينفرين (النورأدرينالين)',
    abbreviation: 'NE',
    color: '#ef4444', // red-500
    bgLight: 'bg-red-950/40',
    borderLight: 'border-red-700/50',
    descEn: 'Increases vigilance, sensory receptor gain, and acute response urgency.',
    descAr: 'يرفع اليقظة وحساسية المستقبلات الحسية وسرعة التعامل مع التهديدات والفرص.',
    functionalRoleEn: 'High NE amplifies sensory sensitivity while narrowing working memory bandwidth.',
    functionalRoleAr: 'ارتفاع النورإبينفرين يضخم الحساسية الحسية مع تضييق نافذة التركيز للطوارئ.',
  },
  gaba: {
    nameEn: 'GABA',
    nameAr: 'حمض الغاما-أمينوبيوتيريك (جابا)',
    abbreviation: 'GABA',
    color: '#ec4899', // pink-500
    bgLight: 'bg-pink-950/40',
    borderLight: 'border-pink-700/50',
    descEn: 'The primary inhibitory neurotransmitter acting as an essential braking filter against noise.',
    descAr: 'الناقل العصبي التثبيطي الرئيسي الذي يعمل كمكابح حيوية لفلترة الضجيج والهلوسة.',
    functionalRoleEn: 'High GABA suppresses hallucination and clamps runaway positive feedback loops.',
    functionalRoleAr: 'ارتفاع جابا يمنع الشطط والهلوسة المعرفية ويكبح حلقات الإثارة المفرطة.',
  },
  glutamate: {
    nameEn: 'Glutamate',
    nameAr: 'الغلوتامات',
    abbreviation: 'Glu',
    color: '#10b981', // emerald-500
    bgLight: 'bg-emerald-950/40',
    borderLight: 'border-emerald-700/50',
    descEn: 'The primary excitatory neurotransmitter facilitating synaptic firing and action potentials.',
    descAr: 'الناقل العصبي الاستثاري الرئيسي المسهل لجهد الفعل والتوصيل المشبكي السريع.',
    functionalRoleEn: 'High Glu facilitates rapid signal propagation across the connectome.',
    functionalRoleAr: 'ارتفاع الغلوتامات يسهل انتشار الإشارات الكهربائية بسرعة عبر المشابك.',
  },
};

export const NeurochemistryLab: React.FC<NeurochemistryLabProps> = ({
  neurotransmitters,
  onUpdateTransmitter,
  onApplyPreset,
  lang,
}) => {
  const isAr = lang === 'ar';

  const PRESETS: {
    id: string;
    titleEn: string;
    titleAr: string;
    descEn: string;
    descAr: string;
    values: NeurotransmitterLevels;
  }[] = [
    {
      id: 'focus',
      titleEn: 'Cognitive Flow & Focus',
      titleAr: 'حالة التدفق والتركيز الفائق',
      descEn: 'High ACh & DA, balanced Glu & GABA for deep analytical throughput.',
      descAr: 'تركيز عالٍ من الأستيل كولين والدوبامين لضمان استيعاب فكري عميق.',
      values: {
        dopamine: 0.85,
        serotonin: 0.65,
        acetylcholine: 0.90,
        norepinephrine: 0.45,
        gaba: 0.50,
        glutamate: 0.75,
      },
    },
    {
      id: 'dream',
      titleEn: 'REM Dream & Consolidation',
      titleAr: 'دورة الحلم ونوم حركة العين السريعة',
      descEn: 'High ACh, low NE to encourage associative cross-modal dreaming.',
      descAr: 'أستيل كولين مرتفع ونورإبينفرين منخفض لتسهيل الترابط الإبداعي الحر.',
      values: {
        dopamine: 0.70,
        serotonin: 0.40,
        acetylcholine: 0.95,
        norepinephrine: 0.15,
        gaba: 0.65,
        glutamate: 0.45,
      },
    },
    {
      id: 'calm',
      titleEn: 'Meditative Homeostasis',
      titleAr: 'السكينة والاتزان الاستقراري',
      descEn: 'Elevated Serotonin & GABA to minimize anxiety and cognitive noise.',
      descAr: 'سيروتونين وجابا مرتفعان لخفض الضجيج والقلق وتثبيت التفكير.',
      values: {
        dopamine: 0.45,
        serotonin: 0.88,
        acetylcholine: 0.60,
        norepinephrine: 0.25,
        gaba: 0.80,
        glutamate: 0.50,
      },
    },
    {
      id: 'stress',
      titleEn: 'Acute Arousal & Threat Alert',
      titleAr: 'اليقظة القصوى والتأهب للطوارئ',
      descEn: 'High NE & Glu for rapid sensory gain and urgent decision making.',
      descAr: 'نورإبينفرين وغلوتامات مرتفعان لسرعة اتخاذ القرارات المصيرية.',
      values: {
        dopamine: 0.60,
        serotonin: 0.30,
        acetylcholine: 0.70,
        norepinephrine: 0.95,
        gaba: 0.25,
        glutamate: 0.90,
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-amber-400" />
            <span>
              {isAr
                ? 'مختبر الكيمياء العصبية والتعديل الحركي'
                : 'Neurochemical Neuromodulation Lab'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {isAr
              ? 'تتحكم هذه النواقل العصبية الستة في سلوك العقل الإدراكي: تعديل عتبات إطلاق المشابك، وسرعة اللدونة الهيبية، وقوة كبح الهلوسة، ومستوى الحافز الداخلي.'
              : 'These 6 neuromodulators tune the global operating state of the mind engine: adjusting synaptic firing thresholds, Hebbian plasticity acceleration, and hallucination suppression.'}
          </p>
        </div>

        {/* Global Chemical State Badge */}
        <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 shrink-0">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span className="text-xs font-mono text-slate-300">
            {isAr ? 'حقل التعديل: نشط ومتزامن' : 'Modulatory Field: Synced'}
          </span>
        </div>
      </div>

      {/* Preset Equilibrium States */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 font-mono">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>{isAr ? 'حالات التوازن الكيميائي الجاهزة:' : 'Chemical Equilibrium Presets:'}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onApplyPreset(preset.values)}
              className="bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-700/60 rounded-xl p-3.5 text-left transition text-slate-200 cursor-pointer group"
            >
              <div className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200 mb-1 flex items-center justify-between">
                <span>{isAr ? preset.titleAr : preset.titleEn}</span>
                <span className="text-[10px] text-slate-500 font-mono">Apply</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isAr ? preset.descAr : preset.descEn}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 6 Neurotransmitter Controllers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(TRANSMITTER_CONFIG) as (keyof NeurotransmitterLevels)[]).map((key) => {
          const cfg = TRANSMITTER_CONFIG[key];
          const val = neurotransmitters[key];

          return (
            <div
              key={key}
              className={`bg-slate-950/80 border ${cfg.borderLight} rounded-2xl p-4 shadow-lg flex flex-col justify-between`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono"
                      style={{ backgroundColor: `${cfg.color}25`, color: cfg.color }}
                    >
                      {cfg.abbreviation}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">
                        {isAr ? cfg.nameAr : cfg.nameEn}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {key.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <span
                    className="text-base font-bold font-mono"
                    style={{ color: cfg.color }}
                  >
                    {(val * 100).toFixed(0)}%
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  {isAr ? cfg.descAr : cfg.descEn}
                </p>

                {/* Functional impact note */}
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 mb-4 text-[11px] text-slate-300 leading-relaxed">
                  <span className="font-semibold" style={{ color: cfg.color }}>
                    {isAr ? 'الأثر المباشر: ' : 'Direct Impact: '}
                  </span>
                  {isAr ? cfg.functionalRoleAr : cfg.functionalRoleEn}
                </div>
              </div>

              {/* Slider Control */}
              <div className="space-y-1.5 pt-2 border-t border-slate-900">
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0% (Suppressed)</span>
                  <span>100% (Saturated)</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.01"
                  value={val}
                  onChange={(e) => onUpdateTransmitter(key, parseFloat(e.target.value))}
                  className="w-full h-2 rounded-lg bg-slate-800 appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
