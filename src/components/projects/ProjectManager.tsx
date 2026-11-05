import React, { useState } from 'react';
import {
  Plus,
  FolderKanban,
  LayoutGrid,
  Columns,
  Calendar,
  Clock,
  CheckCircle2,
  Edit2,
  Trash2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectStatus } from '../../types';
import { ProjectModal } from './ProjectModal';

export const ProjectManager: React.FC = () => {
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    workspaces,
    tasks,
    sessions,
    requestConfirmation,
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'grid'>('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: Project) => {
    setEditingProject(proj);
    setIsModalOpen(true);
  };

  const handleDelete = (proj: Project) => {
    requestConfirmation({
      title: `Delete Project "${proj.name}"?`,
      message: 'This will remove the project board. Associated tasks will remain in their workspaces.',
      isDestructive: true,
      confirmLabel: 'Delete Project',
      onConfirm: () => {
        deleteProject(proj.id);
      },
    });
  };

  const handleSave = (data: Omit<Project, 'id' | 'createdAt' | 'totalMinutesSpent' | 'progressPct'>) => {
    if (editingProject) {
      updateProject(editingProject.id, data);
    } else {
      addProject(data);
    }
  };

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    updateProject(projectId, { status: newStatus });
  };

  // Helper to compute live project stats from attached tasks and sessions
  const getProjectStats = (projId: string) => {
    const projTasks = tasks.filter(t => t.projectId === projId);
    const completedTasks = projTasks.filter(t => t.status === 'completed');
    const computedProgress =
      projTasks.length > 0
        ? Math.round((completedTasks.length / projTasks.length) * 100)
        : 0;

    const projSessions = sessions.filter(s => s.projectId === projId);
    const minutesLogged = projSessions.reduce((sum, s) => sum + s.durationMinutes, 0);

    return {
      totalTasks: projTasks.length,
      completedTasks: completedTasks.length,
      progressPct: computedProgress,
      minutesLogged,
    };
  };

  const KANBAN_COLUMNS: Array<{ id: ProjectStatus; label: string; color: string }> = [
    { id: 'planning', label: 'Planning & Concept', color: '#3B82F6' },
    { id: 'in_progress', label: 'In Active Sprint', color: '#8B5CF6' },
    { id: 'on_hold', label: 'On Hold / Review', color: '#F59E0B' },
    { id: 'completed', label: 'Delivered & Complete', color: '#10B981' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Project Orchestrator</h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {projects.length} PROJECTS
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Kanban workflows, milestone health, and aggregated focus analytics
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/5 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Kanban Board"
            >
              <Columns className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Grid Cards"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {KANBAN_COLUMNS.map(col => {
            const colProjects = projects.filter(p => p.status === col.id);

            return (
              <div
                key={col.id}
                className="rounded-3xl glass-panel border border-white/5 p-4 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: col.color }}
                    />
                    <h3 className="text-xs font-bold text-gray-200 tracking-wide uppercase">
                      {col.label}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded-md">
                    {colProjects.length}
                  </span>
                </div>

                {/* Cards in this column */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colProjects.map(proj => {
                    const ws = workspaces.find(w => w.id === proj.workspaceId);
                    const stats = getProjectStats(proj.id);

                    return (
                      <div
                        key={proj.id}
                        className="rounded-2xl glass-panel-interactive border border-white/5 p-4 group relative"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                            {proj.name}
                          </h4>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEdit(proj)}
                              className="p-1 rounded text-gray-400 hover:text-white"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDelete(proj)}
                              className="p-1 rounded text-gray-400 hover:text-red-400"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {proj.description && (
                          <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                            {proj.description}
                          </p>
                        )}

                        {/* Progress */}
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center justify-between text-[11px] text-gray-400">
                            <span>Completion</span>
                            <span className="font-mono text-purple-300">{stats.progressPct}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${stats.progressPct}%`, backgroundColor: proj.color }}
                            />
                          </div>
                        </div>

                        {/* Meta footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-gray-400">
                          {ws && (
                            <span
                              className="px-2 py-0.5 rounded-md font-medium"
                              style={{ backgroundColor: `${ws.color}20`, color: ws.color }}
                            >
                              {ws.name}
                            </span>
                          )}
                          <span className="font-mono">{stats.completedTasks}/{stats.totalTasks} Tasks</span>
                        </div>

                        {/* Quick Status Shift Controls */}
                        <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                          <span className="text-gray-500">Move:</span>
                          <div className="flex items-center gap-1">
                            {KANBAN_COLUMNS.filter(c => c.id !== proj.status).map(c => (
                              <button
                                key={c.id}
                                onClick={() => handleStatusChange(proj.id, c.id)}
                                className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-[9px]"
                                title={`Move to ${c.label}`}
                              >
                                {c.id === 'planning' ? 'Plan' : c.id === 'in_progress' ? 'Sprint' : c.id === 'on_hold' ? 'Hold' : 'Done'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map(proj => {
            const ws = workspaces.find(w => w.id === proj.workspaceId);
            const stats = getProjectStats(proj.id);

            return (
              <div
                key={proj.id}
                className="rounded-3xl glass-panel-interactive border border-white/5 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className="px-2.5 py-1 rounded-xl text-xs font-semibold uppercase tracking-wider font-mono"
                      style={{ backgroundColor: `${proj.color}20`, color: proj.color }}
                    >
                      {proj.status.replace('_', ' ')}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(proj)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(proj)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{proj.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                    {proj.description || 'No description provided.'}
                  </p>

                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-300">
                      <span>Milestone Progress</span>
                      <span className="font-mono text-purple-300">{stats.progressPct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${stats.progressPct}%`, backgroundColor: proj.color }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs text-gray-400 font-mono">
                  <div>
                    <span className="text-[10px] text-gray-500 block">Workspace</span>
                    <span className="text-gray-200">{ws?.name || 'General'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Focus Tracked</span>
                    <span className="text-purple-300">{Math.round(stats.minutesLogged / 60)}h logged</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingProject}
      />
    </div>
  );
};
