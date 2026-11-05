import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  Play,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, Priority } from '../../types';
import { TaskModal } from './TaskModal';

export const TaskManager: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    toggleTaskCompleted,
    deleteTask,
    workspaces,
    projects,
    startTimer,
    setActivePage,
    requestConfirmation,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [workspaceFilter, setWorkspaceFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (task: Task) => {
    requestConfirmation({
      title: `Delete Task "${task.title}"?`,
      message: 'Are you sure you want to remove this task? This action cannot be undone.',
      isDestructive: true,
      confirmLabel: 'Delete Task',
      onConfirm: () => {
        deleteTask(task.id);
      },
    });
  };

  const handleSave = (taskData: Omit<Task, 'id' | 'createdAt' | 'actualMinutesSpent'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchNotes = t.notes?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchNotes) return false;
    }
    // Status filter
    if (statusFilter === 'pending' && t.status === 'completed') return false;
    if (statusFilter === 'completed' && t.status !== 'completed') return false;
    // Priority filter
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    // Workspace filter
    if (workspaceFilter !== 'all' && t.workspaceId !== workspaceFilter) return false;

    return true;
  });

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-purple-500/20 text-purple-400 border border-purple-500/30">Medium</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">Low</span>;
    }
  };

  const pendingCount = tasks.filter(t => t.status !== 'completed').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Task Command Matrix</h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {pendingCount} PENDING
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Organize high-priority deliverables, subtasks, and track actual time logged
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/5 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tasks, notes, or tags..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/5 text-xs font-medium">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'all' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'pending' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'completed' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Done ({completedCount})
            </button>
          </div>
        </div>

        {/* Priority & Workspace Filter Selects */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={workspaceFilter}
            onChange={e => setWorkspaceFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl glass-input text-[11px] text-gray-200"
          >
            <option value="all" className="bg-[#0f0f1c]">All Workspaces</option>
            {workspaces.map(ws => (
              <option key={ws.id} value={ws.id} className="bg-[#0f0f1c]">
                {ws.name}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl glass-input text-[11px] text-gray-200"
          >
            <option value="all" className="bg-[#0f0f1c]">All Priorities</option>
            <option value="urgent" className="bg-[#0f0f1c]">Urgent</option>
            <option value="high" className="bg-[#0f0f1c]">High</option>
            <option value="medium" className="bg-[#0f0f1c]">Medium</option>
            <option value="low" className="bg-[#0f0f1c]">Low</option>
          </select>

          {(searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || workspaceFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPriorityFilter('all');
                setWorkspaceFilter('all');
              }}
              className="text-[11px] text-purple-400 hover:text-purple-300 ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-panel border border-white/5 space-y-3">
            <AlertCircle className="w-8 h-8 text-gray-500 mx-auto" />
            <h3 className="text-base font-bold text-gray-300">No tasks match your criteria</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Create a new task, adjust your search filter, or ask FOCUS AI to generate a task schedule.
            </p>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/30 text-purple-200 hover:bg-purple-600/50 text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>
        ) : (
          filteredTasks.map(task => {
            const ws = workspaces.find(w => w.id === task.workspaceId);
            const proj = projects.find(p => p.id === task.projectId);
            const isDone = task.status === 'completed';
            const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
            const totalSubtasks = task.subtasks?.length || 0;

            return (
              <div
                key={task.id}
                className={`relative rounded-2xl glass-panel-interactive border p-4 sm:p-5 transition-all ${
                  isDone
                    ? 'border-white/5 opacity-65 bg-white/[0.01]'
                    : 'border-white/10 hover:border-purple-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Completion Toggle & Title */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <button
                      onClick={() => toggleTaskCompleted(task.id)}
                      className="mt-0.5 shrink-0 text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-500 hover:text-purple-400" />
                      )}
                    </button>

                    <div className="min-w-0 space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`text-sm font-semibold truncate ${isDone ? 'line-through text-gray-400' : 'text-white'}`}>
                          {task.title}
                        </h3>
                        {getPriorityBadge(task.priority)}
                        {ws && (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                            style={{ backgroundColor: `${ws.color}20`, color: ws.color }}
                          >
                            {ws.name}
                          </span>
                        )}
                        {proj && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-gray-300 font-mono">
                            {proj.name}
                          </span>
                        )}
                      </div>

                      {task.notes && (
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                          {task.notes}
                        </p>
                      )}

                      {/* Subtasks Progress */}
                      {totalSubtasks > 0 && (
                        <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                          <span>
                            {completedSubtasks} of {totalSubtasks} subtasks complete
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions & Timing info */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
                    <div className="text-right text-xs text-gray-400 font-mono">
                      <div className="flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3 text-purple-400" />
                        <span>~{task.estimatedMinutes}m</span>
                      </div>
                      {task.deadline && (
                        <div className="flex items-center gap-1 justify-end text-[10px] text-gray-500 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{task.deadline}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!isDone && (
                        <button
                          onClick={() => {
                            startTimer(task.estimatedMinutes || 25, task.workspaceId, task.id, task.title);
                            setActivePage('timer');
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold transition-colors"
                          title="Focus on this task now"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span className="hidden sm:inline">Focus</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenEdit(task)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Edit Task"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(task)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingTask}
      />
    </div>
  );
};
