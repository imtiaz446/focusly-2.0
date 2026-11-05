import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ConfirmationModal: React.FC = () => {
  const { confirmation, closeConfirmation } = useApp();

  if (!confirmation) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md p-6 glass-panel-glow rounded-2xl border border-red-500/30 text-white shadow-2xl"
        >
          <button
            onClick={closeConfirmation}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${confirmation.isDestructive ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white">{confirmation.title}</h3>
              <p className="mt-2 text-sm text-gray-300 leading-relaxed">{confirmation.message}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={() => {
                if (confirmation.onCancel) confirmation.onCancel();
                closeConfirmation();
              }}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {confirmation.cancelLabel || 'Cancel'}
            </button>
            <button
              onClick={() => {
                confirmation.onConfirm();
                closeConfirmation();
              }}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg ${
                confirmation.isDestructive
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
              }`}
            >
              {confirmation.confirmLabel || (confirmation.isDestructive ? 'Delete' : 'Confirm')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
