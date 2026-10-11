/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Brain,
  Network,
  Activity,
  Layers,
  Orbit,
  FlaskConical,
  Database,
  Lightbulb,
  GraduationCap,
  FileCode2,
  RotateCcw,
  Download,
  Languages,
  Sparkles,
  ShieldCheck,
  Radio,
  FolderTree,
} from 'lucide-react';
import { GlobalNetworkState } from '../types';

export type ActiveTab =
  | 'connectome'
  | 'wave'
  | 'lobes_dashboard'
  | 'semantic_space'
  | 'inference'
  | 'heartbeat'
  | 'json_explorer'
  | 'genesis_feed'
  | 'tests'
  | 'neurochemistry'
  | 'memory'
  | 'trainer'
  | 'docs';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  networkState: GlobalNetworkState;
  onReset: () => void;
  onExport: () => void;
  onQuickDream: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  networkState,
  onReset,
  onExport,
  onQuickDream,
}) => {
  const isAr = lang === 'ar';

  const navItems: { id: ActiveTab; labelEn: string; labelAr: string; icon: React.ReactNode }[] = [
    { id: 'connectome', labelEn: 'Connectome', labelAr: 'الكونيكتوم العصبي', icon: <Network className="w-4 h-4" /> },
    { id: 'wave', labelEn: 'Neural Wave', labelAr: 'موجة السيال الفصية', icon: <Activity className="w-4 h-4" /> },
    { id: 'lobes_dashboard', labelEn: 'Lobes Telemetry', labelAr: 'مراقبة الفصوص', icon: <Layers className="w-4 h-4" /> },
    { id: 'semantic_space', labelEn: 'Semantic Space', labelAr: 'الفضاء الدلالي', icon: <Orbit className="w-4 h-4" /> },
    { id: 'inference', labelEn: 'Inference Studio', labelAr: 'استوديو الاستدلال', icon: <Brain className="w-4 h-4" /> },
    { id: 'heartbeat', labelEn: 'Cortical Clock (EEG)', labelAr: 'ساعة النبض و EEG', icon: <Radio className="w-4 h-4" /> },
    { id: 'json_explorer', labelEn: '30 JSON Files Explorer', labelAr: 'مستكشف الـ 30 ملف JSON', icon: <FolderTree className="w-4 h-4" /> },
    { id: 'genesis_feed', labelEn: 'Genesis Feed', labelAr: 'مرشحات التوليد (Review)', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'tests', labelEn: 'Test & Verification', labelAr: 'اختبارات الجودة', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'neurochemistry', labelEn: 'Neurochemistry', labelAr: 'مختبر النواقل', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'memory', labelEn: 'Memory & Weights', labelAr: 'الذاكرة ومصفوفة الأوزان', icon: <Database className="w-4 h-4" /> },
    { id: 'trainer', labelEn: 'Neural Trainer', labelAr: 'مدرب المعرفة', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'docs', labelEn: 'Master Blueprint', labelAr: 'المعمارية والتوثيق', icon: <FileCode2 className="w-4 h-4" /> },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-fuchsia-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 tracking-tight text-base sm:text-lg">
                  {isAr ? 'محرك العقل الرقمي الموزع للذكاء الاصطناعي العام' : 'AGI Cognitive Mind Engine'}
                </span>
                <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                  Production Grade
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 font-mono">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{isAr ? '30 ملف JSON متزامن بالذاكرة والقرص' : '30 JSON Files Synced in RAM & Disk'}</span>
                <span className="text-slate-600">|</span>
                <span>{isAr ? `الدورة: ${networkState.cyclesCount}` : `Tick #${networkState.cyclesCount}`}</span>
              </p>
            </div>
          </div>

          {/* Quick controls on mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300"
            >
              <Languages className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end overflow-x-auto py-1">
          {/* Quick Dream Trigger */}
          <button
            onClick={onQuickDream}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-300 text-xs font-medium transition cursor-pointer"
            title={isAr ? 'بدء دورة الحلم وتثبيت الذاكرة' : 'Trigger Dream Cycle'}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isAr ? 'دورة الحلم' : 'Dream Cycle'}</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-medium transition cursor-pointer"
            title={isAr ? 'تصدير الحالة الكاملة كـ JSON' : 'Export System JSON'}
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{isAr ? 'تصدير' : 'Export'}</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 border border-slate-700/60 hover:border-rose-800/60 text-slate-400 hover:text-rose-300 text-xs font-medium transition cursor-pointer"
            title={isAr ? 'إعادة ضبط المنظومة للأصل' : 'Reset Network'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(isAr ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-cyan-400 text-xs font-medium transition cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{isAr ? 'English' : 'عربي'}</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto border-t border-slate-900/90 py-1.5 scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-purple-500/15 border border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              {item.icon}
              <span>{isAr ? item.labelAr : item.labelEn}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
