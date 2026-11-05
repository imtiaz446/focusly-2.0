import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent } from '../../types';

export const CalendarView: React.FC = () => {
  const {
    calendarEvents,
    addCalendarEvent,
    deleteCalendarEvent,
    workspaces,
    tasks,
    sessions,
    sendAIMessage,
    setActivePage,
  } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventWorkspaceId, setNewEventWorkspaceId] = useState(workspaces[0]?.id || 'ws-photoshop');
  const [newEventStartHour, setNewEventStartHour] = useState('09:00');
  const [newEventEndHour, setNewEventEndHour] = useState('10:30');
  const [newEventDescription, setNewEventDescription] = useState('');

  // Daily hours from 08:00 to 22:00
  const hours = Array.from({ length: 15 }, (_, i) => i + 8);

  const dateStr = currentDate.toISOString().split('T')[0];

  const handlePrevDay = () => {
    setCurrentDate(new Date(currentDate.getTime() - 86400000));
  };

  const handleNextDay = () => {
    setCurrentDate(new Date(currentDate.getTime() + 86400000));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const [startH, startM] = newEventStartHour.split(':').map(Number);
    const [endH, endM] = newEventEndHour.split(':').map(Number);

    const start = new Date(currentDate);
    start.setHours(startH, startM, 0, 0);

    const end = new Date(currentDate);
    end.setHours(endH, endM, 0, 0);

    const ws = workspaces.find(w => w.id === newEventWorkspaceId);

    addCalendarEvent({
      title: newEventTitle.trim(),
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      type: 'scheduled_block',
      workspaceId: newEventWorkspaceId,
      workspaceColor: ws?.color || '#8B5CF6',
      description: newEventDescription.trim() || undefined,
    });

    setIsAddModalOpen(false);
    setNewEventTitle('');
    setNewEventDescription('');
  };

  const handleAIPlanSchedule = () => {
    sendAIMessage('Plan my deep work schedule for today with 3 focused blocks');
    setActivePage('voice');
  };

  // Events on current date
  const dayEvents = calendarEvents.filter(e => e.startTime.startsWith(dateStr));
  const daySessions = sessions.filter(s => s.completedAt.startsWith(dateStr));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Daily Focus Calendar</h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              TIMELINE VIEW
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Time-blocking schedule, deep work reservations, and deadline synchronization
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleAIPlanSchedule}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-semibold text-xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Auto-Plan Day</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Focus Block</span>
          </button>
        </div>
      </div>

      {/* Date Navigation Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDay}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-white px-2">
            {currentDate.toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <button
            onClick={handleNextDay}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleToday}
          className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300"
        >
          Today
        </button>
      </div>

      {/* Timeline Day View (08:00 to 22:00) */}
      <div className="rounded-3xl glass-panel border border-white/5 p-6 space-y-3">
        {hours.map(hour => {
          const hourLabel = `${String(hour).padStart(2, '0')}:00`;

          // Match events that fall in this hour
          const eventsInHour = dayEvents.filter(e => {
            const startH = new Date(e.startTime).getHours();
            return startH === hour;
          });

          // Match completed sessions in this hour
          const sessionsInHour = daySessions.filter(s => {
            const h = new Date(s.completedAt).getHours();
            return h === hour;
          });

          return (
            <div
              key={hour}
              className="flex items-start gap-4 min-h-[64px] border-b border-white/5 pb-2 group"
            >
              <div className="w-16 shrink-0 font-mono text-xs text-gray-500 pt-1">
                {hourLabel}
              </div>

              <div className="flex-1 flex flex-wrap gap-3">
                {/* Scheduled Blocks */}
                {eventsInHour.map(ev => {
                  const ws = workspaces.find(w => w.id === ev.workspaceId);
                  const color = ev.workspaceColor || ws?.color || '#8B5CF6';

                  return (
                    <div
                      key={ev.id}
                      className="p-3 rounded-2xl flex items-center justify-between gap-3 text-xs border transition-all"
                      style={{
                        backgroundColor: `${color}15`,
                        borderColor: `${color}40`,
                        color: '#fff',
                      }}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{ev.title}</span>
                          <span
                            className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded"
                            style={{ backgroundColor: `${color}30`, color: color }}
                          >
                            {ws?.name || 'Focus Block'}
                          </span>
                        </div>
                        {ev.description && (
                          <p className="text-[11px] text-gray-300">{ev.description}</p>
                        )}
                      </div>

                      <button
                        onClick={() => deleteCalendarEvent(ev.id)}
                        className="text-gray-400 hover:text-red-400 p-1"
                        title="Delete block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}

                {/* Completed Session Pills */}
                {sessionsInHour.map(sess => (
                  <div
                    key={sess.id}
                    className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold">
                      Completed {sess.durationMinutes}m Focus ({sess.workspaceName})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Focus Block Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl glass-panel-glow border border-purple-500/30 p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold mb-1">Add Scheduled Focus Block</h3>
            <p className="text-xs text-gray-400 mb-4">Reserve time on your calendar for deep creative flow</p>

            <form onSubmit={handleCreateBlock} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={e => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Photoshop Poster Composition"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Workspace</label>
                <select
                  value={newEventWorkspaceId}
                  onChange={e => setNewEventWorkspaceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                >
                  {workspaces.map(w => (
                    <option key={w.id} value={w.id} className="bg-[#0f0f1c]">
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newEventStartHour}
                    onChange={e => setNewEventStartHour(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newEventEndHour}
                    onChange={e => setNewEventEndHour(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={newEventDescription}
                  onChange={e => setNewEventDescription(e.target.value)}
                  placeholder="Key goals for this session..."
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30"
                >
                  Schedule Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
