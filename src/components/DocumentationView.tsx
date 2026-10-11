/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SYSTEM_DOCUMENTS, SystemDocItem } from '../engine/docsData';
import { FileCode2, Copy, Check, BookOpen, Layers } from 'lucide-react';

interface DocumentationViewProps {
  lang: 'ar' | 'en';
}

export const DocumentationView: React.FC<DocumentationViewProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [selectedDocId, setSelectedDocId] = useState<string>(SYSTEM_DOCUMENTS[0].id);
  const [copied, setCopied] = useState(false);

  const currentDoc =
    SYSTEM_DOCUMENTS.find((d) => d.id === selectedDocId) || SYSTEM_DOCUMENTS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDoc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Left Sidebar: Document List */}
      <div className="md:col-span-4 lg:col-span-3 space-y-2">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 px-2 py-1 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isAr ? 'فهرس وثائق المعمارية (10)' : 'Master Architecture Specs (10)'}</span>
        </div>

        <div className="space-y-1">
          {SYSTEM_DOCUMENTS.map((doc) => {
            const isSelected = doc.id === selectedDocId;
            return (
              <button
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`w-full text-left p-3 rounded-xl transition text-xs flex flex-col gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/80 border border-cyan-700/60 text-cyan-200'
                    : 'bg-slate-950/60 border border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold truncate">{isAr ? doc.titleAr : doc.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                    {doc.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {isAr ? doc.summaryAr : doc.summary}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Content Viewer */}
      <div className="md:col-span-8 lg:col-span-9 bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                {currentDoc.category}
              </span>
              <span className="text-xs text-slate-500 font-mono">{currentDoc.title}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100">
              {isAr ? currentDoc.titleAr : currentDoc.title}
            </h2>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-300 transition cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>{isAr ? 'نسخ الوثيقة' : 'Copy Spec'}</span>
              </>
            )}
          </button>
        </div>

        {/* Summary Callout */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
          <Layers className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-cyan-300 block mb-0.5">
              {isAr ? 'خلاصة المواصفة:' : 'Executive Specification Summary:'}
            </span>
            <p>{isAr ? currentDoc.summaryAr : currentDoc.summary}</p>
          </div>
        </div>

        {/* Raw Markdown / Technical Content Display */}
        <div className="bg-slate-900/50 border border-slate-800/90 rounded-xl p-5 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed whitespace-pre-wrap max-h-[550px] overflow-y-auto">
          {currentDoc.content}
        </div>
      </div>
    </div>
  );
};
