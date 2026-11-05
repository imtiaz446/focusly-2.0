import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Palette,
  Image,
  PenTool,
  Film,
  Sparkles,
  Zap,
  Layers,
  Video,
  BookOpen,
  Briefcase,
  User,
  Code,
  Music,
  Camera,
} from 'lucide-react';
import { Workspace } from '../../types';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; icon: string; color: string; dailyGoalMinutes: number }) => void;
  initialData?: Workspace | null;
}

const AVAILABLE_ICONS = [
  { id: 'Image', label: 'Photoshop / Image', icon: Image },
  { id: 'PenTool', label: 'Vector / Pen', icon: PenTool },
  { id: 'Film', label: 'Video Timeline', icon: Film },
  { id: 'Sparkles', label: 'VFX / After Effects', icon: Sparkles },
  { id: 'Zap', label: 'Motion / Fast', icon: Zap },
  { id: 'Layers', label: 'Design Layers', icon: Layers },
  { id: 'Video', label: 'Camera / Video', icon: Video },
  { id: 'BookOpen', label: 'Learning / Study', icon: BookOpen },
  { id: 'Briefcase', label: 'Business / Strategy', icon: Briefcase },
  { id: 'User', label: 'Personal / Life', icon: User },
  { id: 'Code', label: 'Code / Dev', icon: Code },
  { id: 'Music', label: 'Audio / Beats', icon: Music },
  { id: 'Palette', label: 'Art / Canvas', icon: Palette },
];

const PRESET_COLORS = [
  '#8B5CF6', // Purple
  '#31A8FF', // Photoshop Blue
  '#FF9A00', // Illustrator Orange
  '#EA77FF', // Premiere Pink
  '#9999FF', // AE Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#6366F1', // Indigo
  '#14B8A6', // Teal
];

export const WorkspaceModal: React.FC<WorkspaceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Layers');
  const [color, setColor] = useState('#8B5CF6');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(60);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setIcon(initialData.icon);
      setColor(initialData.color);
      setDailyGoalMinutes(initialData.dailyGoalMinutes);
    } else {
      setName('');
      setIcon('Layers');
      setColor('#8B5CF6');
      setDailyGoalMinutes(60);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      icon,
      color,
      dailyGoalMinutes,
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
            {initialData ? 'Edit Workspace' : 'Create New Workspace'}
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            Configure focused environments tailored for specific creative software or workflows
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Workspace Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Cinema 4D, Figma, Coding, Blender"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                required
              />
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Select Icon
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {AVAILABLE_ICONS.map(ic => {
                  const IconComp = ic.icon;
                  const isSelected = icon === ic.id;
                  return (
                    <button
                      type="button"
                      key={ic.id}
                      onClick={() => setIcon(ic.id)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-purple-600/30 border-purple-400 text-white shadow-md'
                          : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Palette */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Workspace Theme Color
              </label>
              <div className="flex flex-wrap items-center gap-2.5">
                {PRESET_COLORS.map(c => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                      color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Daily Goal Minutes */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                <span>Daily Focus Goal</span>
                <span className="font-mono text-purple-300">{dailyGoalMinutes} minutes</span>
              </div>
              <input
                type="range"
                min="15"
                max="240"
                step="15"
                value={dailyGoalMinutes}
                onChange={e => setDailyGoalMinutes(parseInt(e.target.value, 10))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                <span>15m</span>
                <span>60m</span>
                <span>120m</span>
                <span>240m</span>
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
                {initialData ? 'Save Changes' : 'Create Workspace'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
