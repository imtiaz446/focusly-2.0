import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Key, Database, Sparkles, Check, Copy } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateSupabaseMigrationSQL } from '../../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, setIsAuthenticated, userSettings, updateUserSettings } = useApp();
  const [mode, setMode] = useState<'login' | 'signup' | 'schema'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(userSettings.supabaseUrl || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(userSettings.supabaseAnonKey || '');

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Supabase client connection / local authentication
    setIsAuthenticated(true);
    updateUserSettings({
      supabaseUrl,
      supabaseAnonKey,
      cloudSyncEnabled: Boolean(supabaseUrl && supabaseAnonKey),
      email: email || userSettings.email,
    });
    onClose();
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(generateSupabaseMigrationSQL());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto glass-panel-glow rounded-3xl p-6 sm:p-8 border border-purple-500/30 text-white shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Supabase Cloud Sync & Auth</h2>
              <p className="text-xs text-gray-400">Full persistence, multi-device backup, and Row-Level Security</p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded-xl border border-white/5 mb-6 text-xs font-semibold">
            <button
              onClick={() => setMode('login')}
              className={`py-2 rounded-lg transition-all ${mode === 'login' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              Log In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`py-2 rounded-lg transition-all ${mode === 'signup' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setMode('schema')}
              className={`py-2 rounded-lg transition-all ${mode === 'schema' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              SQL Schema
            </button>
          </div>

          {mode === 'schema' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-300 font-mono">supabase_schema_focusly.sql</span>
                <button
                  onClick={handleCopySQL}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied SQL' : 'Copy Full Migration'}
                </button>
              </div>
              <pre className="p-4 bg-black/80 rounded-2xl border border-purple-500/20 text-[11px] font-mono text-gray-300 overflow-x-auto max-h-60 leading-relaxed">
                {generateSupabaseMigrationSQL()}
              </pre>
              <p className="text-xs text-gray-400 leading-relaxed">
                Execute this SQL in your Supabase SQL Editor to enable Row-Level Security, profiles, workspaces, tasks, projects, sessions, and achievements tables with user isolation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isAuthenticated ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Cloud Sync is Active ({userSettings.email})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthenticated(false);
                      updateUserSettings({ cloudSyncEnabled: false });
                    }}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Disconnect
                  </button>
                </div>
              ) : null}

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="creator@focusly.ai"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                  required
                />
              </div>

              <div className="pt-2 border-t border-white/5 space-y-3">
                <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" /> Optional Supabase Project Connection
                </span>
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Project URL</label>
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={e => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzproject.supabase.co"
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Anon Public Key</label>
                  <input
                    type="text"
                    value={supabaseAnonKey}
                    onChange={e => setSupabaseAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthenticated(false);
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Continue in Guest Mode
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {mode === 'signup' ? 'Create Account' : 'Connect / Sign In'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
