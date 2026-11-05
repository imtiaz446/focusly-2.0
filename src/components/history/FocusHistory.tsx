import React, { useState } from 'react';
import {
  History,
  Calendar,
  Clock,
  Filter,
  Trash2,
  Download,
  Star,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FocusSession } from '../../types';

export const FocusHistory: React.FC = () => {
  const { sessions, deleteSession, workspaces, requestConfirmation } = useApp();

  const [workspaceFilter, setWorkspaceFilter] = useState('all');
  const [searchDate, setSearchDate] = useState('');

  const filteredSessions = sessions.filter(s => {
    if (workspaceFilter !== 'all' && s.workspaceId !== workspaceFilter) return false;
    if (searchDate && !s.completedAt.startsWith(searchDate)) return false;
    return true;
  });

  const handleDelete = (sess: FocusSession) => {
    requestConfirmation({
      title: 'Delete Focus Session Log?',
      message: `Are you sure you want to delete this ${sess.durationMinutes}-minute session log?`,
      isDestructive: true,
      confirmLabel: 'Delete Log',
      onConfirm: () => deleteSession(sess.id),
    });
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Workspace', 'Task', 'Duration_Mins', 'Started_At', 'Completed_At', 'XP_Earned', 'Rating', 'Notes'];
    const rows = filteredSessions.map(s => [
      s.id,
      s.workspaceName || '',
      s.taskTitle || '',
      s.durationMinutes,
      s.startedAt,
      s.completedAt,
      s.xpEarned,
      s.rating || 5,
      `"${(s.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `focusly_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalFilteredMinutes = filteredSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Focus Session Logs</h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {filteredSessions.length} LOGS
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Historical audit trail of completed deep work sprints, ratings, and XP gain
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 hover:text-white transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter by:</span>
          </div>

          <select
            value={workspaceFilter}
            onChange={e => setWorkspaceFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl glass-input text-gray-200"
          >
            <option value="all" className="bg-[#0f0f1c]">All Workspaces</option>
            {workspaces.map(ws => (
              <option key={ws.id} value={ws.id} className="bg-[#0f0f1c]">
                {ws.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={searchDate}
            onChange={e => setSearchDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl glass-input text-gray-200"
          />

          {(workspaceFilter !== 'all' || searchDate) && (
            <button
              onClick={() => {
                setWorkspaceFilter('all');
                setSearchDate('');
              }}
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Clear
            </button>
          )}
        </div>

        <div className="text-gray-400 font-mono">
          Total Filtered Focus: <span className="text-white font-bold">{Math.floor(totalFilteredMinutes / 60)}h {totalFilteredMinutes % 60}m</span>
        </div>
      </div>

      {/* Sessions Feed */}
      <div className="space-y-3">
        {filteredSessions.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-panel border border-white/5 text-gray-400 text-xs">
            No focus session logs found for selected filters.
          </div>
        ) : (
          filteredSessions.map(sess => {
            const ws = workspaces.find(w => w.id === sess.workspaceId);
            const dateObj = new Date(sess.completedAt);
            const formattedDate = dateObj.toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });
            const formattedTime = dateObj.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={sess.id}
                className="rounded-2xl glass-panel-interactive border border-white/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className="p-2.5 rounded-xl shrink-0"
                    style={{ backgroundColor: `${ws?.color || '#8B5CF6'}20`, color: ws?.color || '#8B5CF6' }}
                  >
                    <Clock className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-white">
                        {sess.taskTitle || sess.workspaceName || 'Deep Work Session'}
                      </h3>
                      {ws && (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                          style={{ backgroundColor: `${ws.color}20`, color: ws.color }}
                        >
                          {ws.name}
                        </span>
                      )}
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/25">
                        +{sess.xpEarned} XP
                      </span>
                    </div>

                    <p className="text-xs text-gray-400">
                      {formattedDate} at {formattedTime} • Duration: <span className="text-purple-300 font-mono font-bold">{sess.durationMinutes} mins</span>
                    </p>

                    {sess.notes && (
                      <p className="text-xs text-gray-300 italic pt-1">
                        "{sess.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Rating & Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= (sess.rating || 5)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => handleDelete(sess)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Session Log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
