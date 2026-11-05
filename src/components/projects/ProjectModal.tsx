import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectStatus } from '../../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Project, 'id' | 'createdAt' | 'totalMinutesSpent' | 'progressPct'>) => void;
  initialData?: Project | null;
}

const PRESET_COLORS = [
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#3B82F6', // Blue
  '#A855F7', // Violet
];

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const { workspaces } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [workspaceId, setWorkspaceId] = useState(workspaces[0]?.id || 'ws-photoshop');
  const [color, setColor] = useState('#8B5CF6');
  const [status, setStatus] = useState<ProjectStatus>('in_progress');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setWorkspaceId(initialData.workspaceId);
      setColor(initialData.color);
      setStatus(initialData.status);
      setDeadline(initialData.deadline || '');
    } else {
      setName('');
      setDescription('');
      setWorkspaceId(workspaces[0]?.id || 'ws-photoshop');
      setColor('#8B5CF6');
      setStatus('in_progress');
      setDeadline(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
    }
  }, [initialData, isOpen, workspaces]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      description: description.trim(),
      workspaceId,
      color,
      status,
      deadline: deadline || undefined,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg rounded-3xl glass-panel-glow border border-purple-500/30 p-6 sm:p-8 text-white shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold tracking-tight text-white mb-1">
            {initialData ? 'Edit Project' : 'Create New Project'}
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            Track multi-phase milestones, deadlines, and cumulative deep work hours
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Project Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. NeoCyber Brand Identity 2026"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Description / Objectives
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Core deliverables, client requirements, milestones..."
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Primary Workspace
                </label>
                <select
                  value={workspaceId}
                  onChange={e => setWorkspaceId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-white"
                >
                  {workspaces.map(ws => (
                    <option key={ws.id} value={ws.id} className="bg-[#0f0f1c] text-white">
                      {ws.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as ProjectStatus)}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-white"
                >
                  <option value="planning" className="bg-[#0f0f1c]">Planning</option>
                  <option value="in_progress" className="bg-[#0f0f1c]">In Progress</option>
                  <option value="on_hold" className="bg-[#0f0f1c]">On Hold</option>
                  <option value="completed" className="bg-[#0f0f1c]">Completed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  {PRESET_COLORS.map(c => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                        color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-lg shadow-purple-600/30 transition-all"
              >
                {initialData ? 'Save Changes' : 'Create Project'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
