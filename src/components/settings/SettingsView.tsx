import React, { useState } from 'react';
import {
  Settings,
  Volume2,
  Bell,
  Database,
  Download,
  Upload,
  User,
  Shield,
  Palette,
  Sparkles,
  Check,
  Copy,
  RotateCcw,
  Languages,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportAllData, importAllData, generateSupabaseMigrationSQL } from '../../utils/storage';

export const SettingsView: React.FC = () => {
  const {
    userSettings,
    updateUserSettings,
    requestConfirmation,
    isAuthenticated,
    setIsAuthenticated,
    bengaliExplanationMode,
    setBengaliExplanationMode,
  } = useApp();

  const [copiedSQL, setCopiedSQL] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExportData = () => {
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `focusly_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const success = importAllData(content);
        if (success) {
          setImportStatus('Backup data imported successfully. Reloading...');
          setTimeout(() => window.location.reload(), 1200);
        } else {
          setImportStatus('Invalid JSON backup format. Please check file.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(generateSupabaseMigrationSQL());
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2000);
  };

  const handleResetDefaults = () => {
    requestConfirmation({
      title: 'Reset All Local Settings & Storage?',
      message: 'This will reset your workspaces, tasks, and history to fresh initial defaults. Make sure you export a backup first if you have active data.',
      isDestructive: true,
      confirmLabel: 'Reset Everything',
      onConfirm: () => {
        localStorage.clear();
        window.location.reload();
      },
    });
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">System Settings & Cloud Sync</h1>
          <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
            CONFIG
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Customize audio synthesizer, timer parameters, profile info, and Supabase database connection
        </p>
      </div>

      {/* Profile Settings */}
      <div className="p-6 rounded-3xl glass-panel border border-white/5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-purple-400" />
          <span>Profile Configuration</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">User Display Name</label>
            <input
              type="text"
              value={userSettings.userName}
              onChange={e => updateUserSettings({ userName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
            <input
              type="email"
              value={userSettings.email}
              onChange={e => updateUserSettings({ email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* AI Assistant & Bengali Explanation Mode */}
      <div className="p-6 rounded-3xl glass-panel border border-purple-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Languages className="w-4 h-4 text-purple-400" />
            <span>AI Voice Assistant & Bengali Language Mode</span>
          </h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${bengaliExplanationMode ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/10 text-gray-400'}`}>
            {bengaliExplanationMode ? 'BENGALI ACTIVE' : 'STANDARD'}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="max-w-xl">
            <span className="text-xs font-semibold text-white block">
              Bengali Explanation Mode (বাংলা ব্যাখ্যা মোড)
            </span>
            <span className="text-[11px] text-gray-400 leading-relaxed block mt-0.5">
              FOCUS AI will explain all workflows, time management techniques, and system controls in clear Bengali (বাংলা) and respond to Banglish queries fluently.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setBengaliExplanationMode(!bengaliExplanationMode)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              bengaliExplanationMode
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {bengaliExplanationMode ? 'চালু (Enabled)' : 'বন্ধ (Disabled)'}
          </button>
        </div>
      </div>

      {/* Focus & Timer Parameters */}
      <div className="p-6 rounded-3xl glass-panel border border-white/5 space-y-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Palette className="w-4 h-4 text-purple-400" />
          <span>Focus Goals & Audio Synthesizer</span>
        </h3>

        {/* Daily Goal Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
            <span>Daily Focus Goal</span>
            <span className="font-mono text-purple-300">{userSettings.dailyGoalMinutes} Minutes ({Math.floor(userSettings.dailyGoalMinutes / 60)}h {userSettings.dailyGoalMinutes % 60}m)</span>
          </div>
          <input
            type="range"
            min="30"
            max="480"
            step="15"
            value={userSettings.dailyGoalMinutes}
            onChange={e => updateUserSettings({ dailyGoalMinutes: parseInt(e.target.value, 10) })}
            className="w-full accent-purple-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-500 font-mono">
            <span>30m</span>
            <span>120m (2h)</span>
            <span>240m (4h)</span>
            <span>480m (8h)</span>
          </div>
        </div>

        {/* Sound Effects Volume */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Chime & UI Sounds Volume</span>
            </span>
            <span className="font-mono text-purple-300">{Math.round(userSettings.soundVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={userSettings.soundVolume}
            onChange={e => updateUserSettings({ soundVolume: parseFloat(e.target.value) })}
            className="w-full accent-purple-500 cursor-pointer"
          />
        </div>

        {/* Procedural Ambient Volume */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Ambient Generator Volume</span>
            </span>
            <span className="font-mono text-purple-300">{Math.round(userSettings.ambientVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={userSettings.ambientVolume}
            onChange={e => updateUserSettings({ ambientVolume: parseFloat(e.target.value) })}
            className="w-full accent-purple-500 cursor-pointer"
          />
        </div>

        {/* Browser Notifications Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div>
            <span className="text-xs font-semibold text-white block">Desktop Browser Notifications</span>
            <span className="text-[11px] text-gray-400">Receive alert chimes when a session concludes</span>
          </div>
          <input
            type="checkbox"
            checked={userSettings.notificationsEnabled}
            onChange={e => updateUserSettings({ notificationsEnabled: e.target.checked })}
            className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Supabase Cloud Sync Section */}
      <div className="p-6 rounded-3xl glass-panel border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            <span>Supabase Cloud Sync & Security</span>
          </h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${isAuthenticated ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-gray-400'}`}>
            {isAuthenticated ? 'CONNECTED' : 'GUEST MODE'}
          </span>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed">
          FOCUSLY operates seamlessly with zero config using local storage and IndexedDB. You can connect your own Supabase project for cross-device cloud sync and Row Level Security.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleCopySQL}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold transition-colors"
          >
            {copiedSQL ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSQL ? 'Copied SQL Migration' : 'Copy Supabase Migration Script'}</span>
          </button>
        </div>
      </div>

      {/* Data Backup & Export / Import */}
      <div className="p-6 rounded-3xl glass-panel border border-white/5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-400" />
          <span>Data Backup, Export & Restore</span>
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 hover:text-white transition-colors"
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span>Export Complete JSON Backup</span>
          </button>

          <label className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 hover:text-white cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>Restore Backup JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        {importStatus && (
          <p className="text-xs font-mono text-purple-300">{importStatus}</p>
        )}

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs text-red-400 font-semibold block">Reset Local Data</span>
            <span className="text-[11px] text-gray-500">Restore default seed workspaces and clean logs</span>
          </div>

          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/20 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        </div>
      </div>
    </div>
  );
};
