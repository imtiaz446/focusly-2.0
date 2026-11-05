import React, { useState } from 'react';
import {
  Plus,
  Play,
  Edit2,
  Trash2,
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
  Palette,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Workspace } from '../../types';
import { WorkspaceModal } from './WorkspaceModal';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
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
  Palette,
};

export const WorkspaceList: React.FC = () => {
  const {
    workspaces,
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
    startTimer,
    setActivePage,
    tasks,
    sessions,
    requestConfirmation,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);

  const handleOpenCreate = () => {
    setEditingWorkspace(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ws: Workspace) => {
    setEditingWorkspace(ws);
    setIsModalOpen(true);
  };

  const handleDelete = (ws: Workspace) => {
    requestConfirmation({
      title: `Delete Workspace "${ws.name}"?`,
      message: 'This will remove the workspace configuration. Associated tasks and history will be preserved.',
      isDestructive: true,
      confirmLabel: 'Delete Workspace',
      onConfirm: () => {
        deleteWorkspace(ws.id);
      },
    });
  };

  const handleSave = (data: { name: string; icon: string; color: string; dailyGoalMinutes: number }) => {
    if (editingWorkspace) {
      updateWorkspace(editingWorkspace.id, data);
    } else {
      addWorkspace(data);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Creative Workspaces</h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {workspaces.length} ACTIVE
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Dedicated creative zones with custom goals, tracking, and velocity analytics
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>New Workspace</span>
        </button>
      </div>

      {/* Grid of Workspaces */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {workspaces.map(ws => {
          const IconComp = ICON_MAP[ws.icon] || Layers;
          const wsTasks = tasks.filter(t => t.workspaceId === ws.id);
          const pendingTasks = wsTasks.filter(t => t.status !== 'completed');

          // Compute today's focus minutes for this workspace
          const todayWsMinutes = sessions
            .filter(s => s.workspaceId === ws.id && s.completedAt.startsWith(todayStr))
            .reduce((sum, s) => sum + s.durationMinutes, 0);

          const goalPct = Math.min(100, Math.round((todayWsMinutes / (ws.dailyGoalMinutes || 60)) * 100));

          return (
            <div
              key={ws.id}
              className="relative rounded-3xl glass-panel-interactive border border-white/5 p-6 flex flex-col justify-between group overflow-hidden"
            >
              {/* Subtle top color glow line */}
              <div
                className="absolute top-0 left-0 right-0 h-1 transition-opacity opacity-75 group-hover:opacity-100"
                style={{ backgroundColor: ws.color }}
              />

              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg"
                      style={{
                        backgroundColor: `${ws.color}20`,
                        color: ws.color,
                        boxShadow: `0 4px 20px ${ws.color}25`,
                      }}
                    >
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">
                        {ws.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 font-mono">
                        {Math.floor(ws.totalFocusMinutes / 60)}h {ws.totalFocusMinutes % 60}m logged
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(ws)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(ws)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Daily Goal Bar */}
                <div className="my-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-gray-300">
                    <span className="font-medium">Today's Focus Goal</span>
                    <span className="font-mono text-gray-400">
                      {todayWsMinutes}/{ws.dailyGoalMinutes}m ({goalPct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${goalPct}%`, backgroundColor: ws.color }}
                    />
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <span>{wsTasks.length} tasks</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{pendingTasks.length} pending</span>
                  </div>
                </div>
              </div>

              {/* Start Session Button */}
              <button
                onClick={() => {
                  startTimer(25, ws.id, undefined, `${ws.name} Deep Sprint`);
                  setActivePage('timer');
                }}
                className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-gray-200 hover:text-white transition-all group/btn border border-white/5"
              >
                <Play className="w-3.5 h-3.5 fill-current text-purple-400 group-hover/btn:scale-110 transition-transform" />
                <span>Start Session</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <WorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingWorkspace}
      />
    </div>
  );
};
