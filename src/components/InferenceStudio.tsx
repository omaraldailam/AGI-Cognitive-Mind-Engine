/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CognitiveCycleTrace,
  NeurotransmitterLevels,
} from '../types';
import {
  Send,
  Sparkles,
  Heart,
  BookOpen,
  Cpu,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Clock,
  Layers,
  HelpCircle,
  Brain,
  MessageSquare,
  Trash2,
  Compass,
} from 'lucide-react';

interface InferenceStudioProps {
  currentTrace: CognitiveCycleTrace | null;
  neurotransmitters: NeurotransmitterLevels;
  lang: 'ar' | 'en';
  onExecuteCycle: (query: string) => void;
  onApplyFeedback: (signal: 'reward' | 'inhibit') => void;
  feedbackNotification: string | null;
}

interface DialogueTurn {
  id: string;
  query: string;
  response: string;
  responseAr: string;
  confidence: number;
  timestamp: number;
}

export const InferenceStudio: React.FC<InferenceStudioProps> = ({
  currentTrace,
  neurotransmitters,
  lang,
  onExecuteCycle,
  onApplyFeedback,
  feedbackNotification,
}) => {
  const isAr = lang === 'ar';
  const [queryInput, setQueryInput] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [reasoningMode, setReasoningMode] = useState<'deep' | 'fast' | 'socratic' | 'logic'>('deep');
  const [dialogueHistory, setDialogueHistory] = useState<DialogueTurn[]>([]);

  const PRESETS = [
    {
      en: 'What is cognitive consciousness and how does it emerge from neural connectomes?',
      ar: 'ما هو الوعي الإدراكي وكيف ينبثق من شبكات الكونيكتوم العصبية؟',
    },
    {
      en: 'Analyze the impact of dopamine surges on Hebbian synaptic learning rates.',
      ar: 'حلل أثر تدفق الدوبامين على تسريع معدلات التعلم اللدائني المشبكي الهيبي.',
    },
    {
      en: 'How does GABA prevent runaway excitation and filter cognitive hallucinations?',
      ar: 'كيف يمنع ناقل جابا GABA الاستثارة المفرطة ويرشح الهلوسة والضجيج الذهني؟',
    },
    {
      en: 'Evaluate a multi-criteria decision under high uncertainty and risk.',
      ar: 'اتخذ قراراً متعدد المعايير في ظل درجة ارتياب ومخاطرة عالية.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;

    let modifiedQuery = queryInput.trim();
    if (reasoningMode === 'socratic') {
      modifiedQuery = `${queryInput.trim()} (Examine with Socratic inquiry and metacognitive questioning)`;
    } else if (reasoningMode === 'logic') {
      modifiedQuery = `${queryInput.trim()} (Formal logical syllogism and deductive verification)`;
    }

    onExecuteCycle(modifiedQuery);
  };

  const handleSelectPreset = (presetText: string) => {
    setQueryInput(presetText);
    onExecuteCycle(presetText);
  };

  // Sync latest trace into dialogue history
  React.useEffect(() => {
    if (currentTrace && (!dialogueHistory.length || dialogueHistory[0].id !== currentTrace.id)) {
      setDialogueHistory((prev) => [
        {
          id: currentTrace.id,
          query: currentTrace.query,
          response: currentTrace.motorSynthesis.response,
          responseAr: currentTrace.motorSynthesis.responseAr,
          confidence: currentTrace.motorSynthesis.confidence,
          timestamp: currentTrace.timestamp,
        },
        ...prev.slice(0, 9), // keep last 10 turns
      ]);
    }
  }, [currentTrace]);

  // Voice speech synthesis (TTS)
  const handleToggleVoice = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if (!currentTrace) return;
    const textToSpeak = isAr
      ? currentTrace.motorSynthesis.responseAr
      : currentTrace.motorSynthesis.response;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = isAr ? 'ar-SA' : 'en-US';
    utterance.rate = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      {/* Search & Prompt Dispatcher Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        {/* Reasoning Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase text-slate-300 font-bold">
              {isAr ? 'نمط الاستدلال القشري:' : 'Cognitive Inference Mode:'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setReasoningMode('deep')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                reasoningMode === 'deep'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950'
              }`}
            >
              🧠 {isAr ? 'توليف عميق (Gemini 3.8)' : 'Deep Synthesis (Gemini 3.8)'}
            </button>
            <button
              type="button"
              onClick={() => setReasoningMode('fast')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                reasoningMode === 'fast'
                  ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950'
              }`}
            >
              ⚡ {isAr ? 'موجة سريعة محلية' : 'Fast Neural Wave'}
            </button>
            <button
              type="button"
              onClick={() => setReasoningMode('socratic')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                reasoningMode === 'socratic'
                  ? 'bg-purple-950 text-purple-300 border border-purple-700/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950'
              }`}
            >
              🏛️ {isAr ? 'سقراطي وفلسفي' : 'Socratic Inquiry'}
            </button>
            <button
              type="button"
              onClick={() => setReasoningMode('logic')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                reasoningMode === 'logic'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950'
              }`}
            >
              📐 {isAr ? 'منطق استنباطي' : 'Formal Logic'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>
                {isAr
                  ? 'بث إشارة حسية جديدة (تحفيز الدورة الإدراكية)'
                  : 'Transmit Sensory Query (Trigger Cognitive Cycle)'}
              </span>
            </label>
            <span className="text-xs font-mono text-cyan-400/80 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-full">
              {isAr ? '5 فصوص متزامنة' : '5 Lobes Synchronized'}
            </span>
          </div>

          <div className="relative">
            <textarea
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder={
                isAr
                  ? 'اكتب استفسارك المعرفي بالعربية أو الإنجليزية، أو اختر من النماذج الجاهزة أدناه...'
                  : 'Type a query in English or Arabic, or pick a preset prompt below...'
              }
              rows={3}
              dir={isAr ? 'rtl' : 'ltr'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/40 transition resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{isAr ? 'نماذج جاهزة:' : 'Presets:'}</span>
              </span>
              {PRESETS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectPreset(isAr ? p.ar : p.en)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-800/60 text-slate-300 hover:text-cyan-300 transition whitespace-nowrap cursor-pointer shrink-0"
                >
                  {isAr ? p.ar.slice(0, 24) + '...' : p.en.slice(0, 24) + '...'}
                </button>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!queryInput.trim()}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-cyan-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>{isAr ? 'إطلاق الدورة الذهنية' : 'Fire Cognitive Cycle'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Feedback Alert if applied */}
      {feedbackNotification && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-600/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackNotification}</span>
        </div>
      )}

      {/* Step-by-Step Cognitive Processing Waterfall */}
      {currentTrace && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>
                {isAr
                  ? 'سجل التتبع الإدراكي المتسلسل عبر الطبقات (Cognitive Trace)'
                  : 'Step-by-Step Multi-Layer Cognitive Trace'}
              </span>
            </h3>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentTrace.latencyMs} ms</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Step 1: Sensory Ingestion */}
            <div className="bg-slate-950/80 border border-cyan-800/40 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                    1. {isAr ? 'المدخل الحسي' : 'Sensory Cortex'}
                  </span>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800/50">
                    Wernicke
                  </span>
                </div>
                <div className="text-xs text-slate-400 mb-2 font-mono">
                  {isAr ? 'الرموز المستخلصة:' : 'Tokens Parsed:'}
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentTrace.sensoryTokens.map((t, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/40 text-cyan-200 font-mono"
                    >
                      {t.token} ({Math.round(t.activation * 100)}%)
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-900">
                {isAr ? 'تحويل الإشارة لمتجه دلالي 16-D' : 'Projected to 16-D manifold'}
              </div>
            </div>

            {/* Step 2: Limbic Affect */}
            <div className="bg-slate-950/80 border border-amber-800/40 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                    2. {isAr ? 'الجهاز الحوفي' : 'Limbic Core'}
                  </span>
                  <Heart className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-400 text-[11px] mb-0.5">
                      <span>{isAr ? 'التكافؤ العاطفي (Valence):' : 'Valence:'}</span>
                      <span className="font-mono text-amber-300">
                        {currentTrace.limbicAffect.valence > 0 ? '+' : ''}
                        {currentTrace.limbicAffect.valence}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400"
                        style={{
                          width: `${((currentTrace.limbicAffect.valence + 1) / 2) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 text-[11px] mb-0.5">
                      <span>{isAr ? 'مستوى الاستثارة (Arousal):' : 'Arousal:'}</span>
                      <span className="font-mono text-amber-300">
                        {Math.round(currentTrace.limbicAffect.arousal * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400"
                        style={{
                          width: `${currentTrace.limbicAffect.arousal * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800/50 text-amber-300 font-medium">
                      {isAr
                        ? currentTrace.limbicAffect.dominantEmotionAr
                        : currentTrace.limbicAffect.dominantEmotion}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-900">
                {isAr ? 'تعديل تدفق الدوبامين والنورإبينفرين' : 'Modulates Dopamine / NE'}
              </div>
            </div>

            {/* Step 3: Hippocampal Recall */}
            <div className="bg-slate-950/80 border border-purple-800/40 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono">
                    3. {isAr ? 'الحصين والذاكرة' : 'Hippocampus'}
                  </span>
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-xs text-slate-400 mb-1.5">
                  {isAr ? 'أقرب المفاهيم المستدعاة:' : 'Top Recalled Concepts:'}
                </div>
                <div className="space-y-1.5">
                  {currentTrace.hippocampalRecall.matchedConcepts.map((m, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between text-slate-300 text-[11px]">
                        <span className="truncate max-w-[130px]">
                          {isAr ? m.conceptAr : m.concept}
                        </span>
                        <span className="font-mono text-purple-400 shrink-0">
                          {Math.round(m.similarity * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mt-0.5">
                        <div
                          className="h-full bg-purple-500"
                          style={{ width: `${m.similarity * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-900">
                {isAr ? 'استدعاء ترابطي عبر CA3/DG' : 'CA3 Auto-Associative Recall'}
              </div>
            </div>

            {/* Step 4: Prefrontal Logic */}
            <div className="bg-slate-950/80 border border-emerald-800/40 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                    4. {isAr ? 'القشرة الجبهية' : 'Prefrontal'}
                  </span>
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-xs text-slate-400 mb-1 font-mono">
                  {isAr ? 'مسار الاستدلال المعتمد:' : 'Verified Logic Path:'}
                </div>
                <div className="text-xs text-emerald-300 bg-emerald-950/50 border border-emerald-800/40 rounded p-1.5 mb-2 leading-relaxed">
                  {isAr
                    ? currentTrace.prefrontalReasoning.selectedLogicPathAr
                    : currentTrace.prefrontalReasoning.selectedLogicPath}
                </div>
                <div className="text-[10px] text-rose-400/80 flex items-center gap-1">
                  <span>{isAr ? 'تثبيط GABA:' : 'GABA Filtered:'}</span>
                  <span className="truncate">
                    {currentTrace.prefrontalReasoning.inhibitedCandidates[0]}
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-900">
                {isAr ? 'ضبط الذاكرة العاملة وكبح الخطأ' : 'Executive Working Memory'}
              </div>
            </div>

            {/* Step 5: Motor Synthesis */}
            <div className="bg-slate-950/80 border border-sky-800/40 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">
                    5. {isAr ? 'المخرج الحركي' : 'Motor Cortex'}
                  </span>
                  <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-xs text-slate-400 mb-1">
                  {isAr ? 'اليقين الإدراكي (Confidence):' : 'Calibrated Confidence:'}
                </div>
                <div className="text-lg font-bold font-mono text-sky-400 mb-2">
                  {Math.round(currentTrace.motorSynthesis.confidence * 100)}%
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-cyan-400"
                    style={{
                      width: `${currentTrace.motorSynthesis.confidence * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-900">
                {isAr ? 'صياغة بروكا اللغوية وبث الإشارة' : 'Broca Syntactic Articulation'}
              </div>
            </div>
          </div>

          {/* Synthesized Output Banner & Voice Playback */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <span className="text-xs uppercase font-mono tracking-wider text-cyan-400">
                  {isAr ? 'الاستجابة الإدراكية المصاغة' : 'Synthesized Cognitive Articulation'}
                </span>
                <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed">
                  {isAr
                    ? currentTrace.motorSynthesis.responseAr
                    : currentTrace.motorSynthesis.response}
                </p>
              </div>

              {/* Voice Speech Synthesis Button */}
              <button
                onClick={handleToggleVoice}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer shrink-0 ${
                  isPlayingAudio
                    ? 'bg-rose-950 text-rose-300 border border-rose-700 animate-pulse'
                    : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800'
                }`}
                title={isAr ? 'قراءة صوتية للاستجابة' : 'Voice Speech Playback'}
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isPlayingAudio ? (isAr ? 'إيقاف الصوت' : 'Stop') : (isAr ? 'استماع' : 'Listen')}</span>
              </button>
            </div>

            {/* Action Plan */}
            <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-start gap-3">
              <div className="p-1 rounded bg-indigo-950 text-indigo-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-300 block mb-0.5">
                  {isAr ? 'الخطة التنفيذية المقترحة (Action Plan):' : 'Executive Action Plan:'}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {isAr
                    ? currentTrace.motorSynthesis.actionPlanAr
                    : currentTrace.motorSynthesis.actionPlan}
                </p>
              </div>
            </div>

            {/* Reinforcement Action Bar */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>
                  {isAr
                    ? 'هل كانت الاستجابة دقيقة ومنطقية؟'
                    : 'Was this reasoning accurate and grounded?'}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  (Reinforces Hebbian Synaptic Weights)
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onApplyFeedback('reward')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-xs font-semibold transition cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تعزيز ومكافأة (+دوبامين)' : 'Reward (+Dopamine)'}</span>
                </button>

                <button
                  onClick={() => onApplyFeedback('inhibit')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-300 text-xs font-semibold transition cursor-pointer"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تثبيط وتصحيح (+جابا)' : 'Inhibit (+GABA)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Multi-turn Contextual Conversation History */}
      {dialogueHistory.length > 0 && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <h4 className="text-sm font-bold text-slate-200">
                {isAr
                  ? 'سجل الحوار الإدراكي المتسلسل (Working Memory Thread)'
                  : 'Contextual Working Memory Dialogue Thread'}
              </h4>
            </div>

            <button
              onClick={() => setDialogueHistory([])}
              className="p-1 rounded text-slate-500 hover:text-rose-400 transition cursor-pointer"
              title={isAr ? 'مسح سجل الحوار' : 'Clear dialogue'}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {dialogueHistory.map((turn, i) => (
              <div
                key={turn.id || i}
                className="bg-slate-900/50 border border-slate-850 rounded-xl p-3 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between text-[11px] text-cyan-400 font-semibold">
                  <span>Q: "{turn.query}"</span>
                  <span className="font-mono text-slate-500">
                    {Math.round(turn.confidence * 100)}% Conf
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {isAr ? turn.responseAr : turn.response}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
