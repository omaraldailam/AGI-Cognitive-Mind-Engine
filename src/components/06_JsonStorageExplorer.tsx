/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  FileCode,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Download,
  Copy,
  RefreshCw,
  Database,
  Layers,
} from 'lucide-react';

interface JsonFileInfo {
  sector: string;
  fileName: string;
  filePath: string;
  sizeBytes: number;
  lastModified: string;
  hasBackup: boolean;
}

export const JsonStorageExplorer: React.FC<{ lang: 'ar' | 'en' }> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [files, setFiles] = useState<JsonFileInfo[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('01_config/01_hyperparameters.json');
  const [fileContent, setFileContent] = useState<string>('');
  const [isBackupView, setIsBackupView] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Fetch file list
  const loadFileList = async () => {
    try {
      const res = await fetch('/api/storage/files');
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
      }
    } catch (err) {
      console.error('Failed to load file list:', err);
    }
  };

  // Fetch selected file content
  const loadFileContent = async (path: string, backup: boolean = false) => {
    setIsLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/storage/file-content?path=${encodeURIComponent(path)}&backup=${backup}`);
      if (res.ok) {
        const data = await res.json();
        setFileContent(data.content || '');
      } else {
        setStatusMsg({ type: 'error', text: isAr ? 'فشل تحميل محتوى الملف' : 'Failed to load file content' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: isAr ? 'خطأ في الاتصال بالخادم' : 'Connection error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFileList();
  }, []);

  useEffect(() => {
    if (selectedFile) {
      loadFileContent(selectedFile, isBackupView);
    }
  }, [selectedFile, isBackupView]);

  // Save changes to disk
  const handleSaveToDisk = async () => {
    setIsSaving(true);
    setStatusMsg(null);
    try {
      // Validate JSON syntax first
      let parsed;
      try {
        parsed = JSON.parse(fileContent);
      } catch (e: any) {
        setStatusMsg({
          type: 'error',
          text: isAr ? `خطأ في بنية JSON: ${e.message}` : `Invalid JSON syntax: ${e.message}`,
        });
        setIsSaving(false);
        return;
      }

      const res = await fetch('/api/storage/persist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: selectedFile, data: parsed }),
      });

      if (res.ok) {
        setStatusMsg({
          type: 'success',
          text: isAr
            ? 'تم الحفظ الذري على القرص بنجاح وتحديث النسخة الاحتياطية .bak!'
            : 'Atomic write to disk succeeded and .bak backup created!',
        });
        loadFileList();
      } else {
        setStatusMsg({ type: 'error', text: isAr ? 'فشل الحفظ على القرص' : 'Failed to save to disk' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: isAr ? 'خطأ أثناء الحفظ' : 'Error saving file' });
    } finally {
      setIsSaving(false);
    }
  };

  // Restore from backup
  const handleRestoreBackup = async () => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من استعادة النسخة الاحتياطية .bak لهذا الملف؟' : 'Restore from .bak backup?')) return;

    try {
      const res = await fetch('/api/storage/restore-backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: selectedFile }),
      });

      if (res.ok) {
        const data = await res.json();
        setFileContent(data.content);
        setIsBackupView(false);
        setStatusMsg({
          type: 'success',
          text: isAr ? 'تمت استعادة الملف من النسخة الاحتياطية بنجاح!' : 'File restored from backup successfully!',
        });
      } else {
        setStatusMsg({ type: 'error', text: isAr ? 'فشلت الاستعادة' : 'Restore failed' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: isAr ? 'خطأ في عملية الاستعادة' : 'Error restoring' });
    }
  };

  // Download current file
  const handleDownload = () => {
    const blob = new Blob([fileContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.split('/').pop() || 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Group files by sector
  const groupedFiles: Record<string, JsonFileInfo[]> = {};
  files.forEach((f) => {
    if (!groupedFiles[f.sector]) groupedFiles[f.sector] = [];
    groupedFiles[f.sector].push(f);
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100">
              {isAr
                ? 'مستكشف ومحرر ملفات الـ JSON الـ 30 الحية على القرص'
                : '30 JSON Files Live Disk Explorer & Schema Editor'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {isAr
              ? 'فحص وتعديل مباشر لملفات الذاكرة والكونيكتوم الـ 30 على القرص مع حماية الكتابة الذرية (.tmp) والنسخ الاحتياطي التلقائي (.bak).'
              : 'Direct inspection and editing of the 30 JSON state files on disk with atomic write protection and automatic .bak rollbacks.'}
          </p>
        </div>

        <button
          onClick={loadFileList}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{isAr ? 'تحديث الفهرس' : 'Refresh'}</span>
        </button>
      </div>

      {/* Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Sector Tree */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono uppercase text-slate-400 flex items-center justify-between px-1">
            <span className="flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? 'قطاعات العقل الستة (30 ملف):' : '6 Cortical Sectors (30 Files):'}</span>
            </span>
            <span className="text-cyan-400">{files.length} / 30</span>
          </div>

          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {Object.entries(groupedFiles).map(([sector, sectorFiles]) => (
              <div key={sector} className="bg-slate-950/80 border border-slate-800/80 rounded-xl overflow-hidden">
                <div className="bg-slate-900/60 px-3 py-1.5 text-[11px] font-mono font-bold text-slate-300 flex items-center justify-between border-b border-slate-850">
                  <span className="truncate">{sector}</span>
                  <span className="text-slate-500">{sectorFiles.length} files</span>
                </div>
                <div className="p-1 space-y-0.5">
                  {sectorFiles.map((f) => {
                    const isSelected = selectedFile === f.filePath;
                    return (
                      <button
                        key={f.filePath}
                        onClick={() => {
                          setSelectedFile(f.filePath);
                          setIsBackupView(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/60'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                        }`}
                      >
                        <span className="truncate flex items-center gap-1.5">
                          <FileCode className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{f.fileName}</span>
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0 text-[10px]">
                          {f.hasBackup && (
                            <span className="text-purple-400 font-bold" title=".bak backup exists">
                              .bak
                            </span>
                          )}
                          <span className="text-slate-500">{f.sizeBytes} B</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Editor */}
        <div className="lg:col-span-8 bg-slate-950/90 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            {/* Editor Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 block">
                  {isBackupView ? 'BACKUP VIEW (.bak)' : 'PRIMARY DISK VIEW'}
                </span>
                <h3 className="text-sm font-bold font-mono text-slate-200">{selectedFile}</h3>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Toggle between primary and backup */}
                <button
                  onClick={() => setIsBackupView(!isBackupView)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                    isBackupView
                      ? 'bg-purple-950 text-purple-300 border-purple-700'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {isBackupView ? (isAr ? 'عرض الملف الأصلي' : 'View Primary') : (isAr ? 'عرض النسخة .bak' : 'View .bak')}
                </button>

                {/* Restore button */}
                <button
                  onClick={handleRestoreBackup}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1 transition cursor-pointer"
                  title={isAr ? 'استعادة من .bak' : 'Restore from .bak'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isAr ? 'استعادة' : 'Restore'}</span>
                </button>

                {/* Download */}
                <button
                  onClick={handleDownload}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition cursor-pointer"
                  title={isAr ? 'تحميل الملف' : 'Download'}
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                {/* Save & Persist */}
                <button
                  onClick={handleSaveToDisk}
                  disabled={isSaving || isBackupView}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition cursor-pointer disabled:opacity-50"
                >
                  <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
                  <span>{isAr ? 'حفظ وتثبيت على القرص' : 'Atomic Save'}</span>
                </button>
              </div>
            </div>

            {/* Notification Alert */}
            {statusMsg && (
              <div
                className={`mt-3 p-3 rounded-xl border text-xs flex items-center gap-2 font-mono ${
                  statusMsg.type === 'success'
                    ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-700/60 text-rose-300'
                }`}
              >
                {statusMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{statusMsg.text}</span>
              </div>
            )}

            {/* Code Textarea */}
            <div className="mt-3 relative">
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                readOnly={isBackupView}
                rows={18}
                className={`w-full bg-[#030611] border rounded-xl p-4 font-mono text-xs text-slate-200 leading-relaxed focus:outline-none transition resize-y select-text ${
                  isBackupView ? 'border-purple-800/60 opacity-80' : 'border-slate-800 focus:border-cyan-500'
                }`}
                placeholder={isLoading ? 'Loading content...' : 'JSON content...'}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Encoding: UTF-8 (Strict JSON)</span>
            <span>Safety: Atomic Rename + .bak Rollback Protection</span>
          </div>
        </div>
      </div>
    </div>
  );
};
