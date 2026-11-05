import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, Priority, Subtask } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'actualMinutesSpent'>) => void;
  initialData?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const { workspaces, projects } = useApp();

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [workspaceId, setWorkspaceId] = useState(workspaces[0]?.id || 'ws-photoshop');
  const [projectId, setProjectId] = useState<string>('');
  const [deadline, setDeadline] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setNotes(initialData.notes || '');
      setPriority(initialData.priority);
      setEstimatedMinutes(initialData.estimatedMinutes);
      setWorkspaceId(initialData.workspaceId);
      setProjectId(initialData.projectId || '');
      setDeadline(initialData.deadline || '');
      setSubtasks(initialData.subtasks || []);
    } else {
      setTitle('');
      setNotes('');
      setPriority('medium');
      setEstimatedMinutes(30);
      setWorkspaceId(workspaces[0]?.id || 'ws-photoshop');
      setProjectId('');
      setDeadline(new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]);
      setSubtasks([]);
    }
  }, [initialData, isOpen, workspaces]);

  if (!isOpen) return null;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setSubtasks(prev => [
      ...prev,
      {
        id: 'sub-' + Date.now(),
        title: newSubtaskTitle.trim(),
        completed: false,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(prev =>
      prev.map(s => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(prev => prev.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      notes: notes.trim(),
      priority,
      status: initialData ? initialData.status : 'todo',
      estimatedMinutes,
      workspaceId,
      projectId: projectId || undefined,
      deadline: deadline || undefined,
      subtasks,
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
          className="relative w-full max-w-xl rounded-3xl glass-panel-glow border border-purple-500/30 p-6 sm:p-8 text-white shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold tracking-tight text-white mb-1">
            {initialData ? 'Edit Task' : 'Create New Focus Task'}
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            Assign to workspaces, define subtasks, and track your focus velocity
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Task Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Design 3D packaging mockups in Photoshop"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                required
              />
            </div>

            {/* Workspace & Project Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Workspace
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
                  Project (Optional)
                </label>
                <select
                  value={projectId}
                  onChange={e => setProjectId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-white"
                >
                  <option value="" className="bg-[#0f0f1c] text-gray-400">
                    No Project Assigned
                  </option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id} className="bg-[#0f0f1c] text-white">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Priority & Duration & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as Priority)}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-white"
                >
                  <option value="low" className="bg-[#0f0f1c]">Low</option>
                  <option value="medium" className="bg-[#0f0f1c]">Medium</option>
                  <option value="high" className="bg-[#0f0f1c]">High</option>
                  <option value="urgent" className="bg-[#0f0f1c]">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Estimated Minutes
                </label>
                <input
                  type="number"
                  min="5"
                  max="480"
                  value={estimatedMinutes}
                  onChange={e => setEstimatedMinutes(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                  Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Notes & Instructions
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Key parameters, export specs, references..."
                className="w-full px-4 py-2 rounded-xl glass-input text-xs text-white resize-none"
              />
            </div>

            {/* Subtasks Section */}
            <div className="pt-2 border-t border-white/5 space-y-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Subtasks Checklist ({subtasks.filter(s => s.completed).length}/{subtasks.length})
              </label>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {subtasks.map(s => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleSubtask(s.id)}
                      className="flex items-center gap-2 text-left"
                    >
                      <CheckCircle2
                        className={`w-4 h-4 ${s.completed ? 'text-emerald-400 fill-emerald-400/20' : 'text-gray-500'}`}
                      />
                      <span className={s.completed ? 'line-through text-gray-400' : 'text-gray-200'}>
                        {s.title}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSubtask(s.id)}
                      className="text-gray-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={e => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask(e);
                    }
                  }}
                  placeholder="Add a step (press enter)..."
                  className="flex-1 px-3 py-1.5 rounded-xl glass-input text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Actions */}
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
                {initialData ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
