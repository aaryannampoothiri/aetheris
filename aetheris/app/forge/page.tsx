"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { useAppStore, type TaskColumn } from "@/lib/app-store";
import { CalendarDays, Check, Clock3, Pencil, Trash2, X } from "lucide-react";
import { TimeDialPicker } from "@/components/time-dial-picker";

const columns: TaskColumn[] = ["To Do", "Working On", "Done"];

export default function ForgePage() {
  const tasks = useAppStore((state) => state.dailyTasks);
  const deadlines = useAppStore((state) => state.deadlines);
  const addDailyTask = useAppStore((state) => state.addDailyTask);
  const moveDailyTask = useAppStore((state) => state.moveDailyTask);
  const updateDailyTask = useAppStore((state) => state.updateDailyTask);
  const removeDailyTask = useAppStore((state) => state.removeDailyTask);
  const addDeadline = useAppStore((state) => state.addDeadline);
  const removeDeadline = useAppStore((state) => state.removeDeadline);
  const toggleDeadlineCompleted = useAppStore((state) => state.toggleDeadlineCompleted);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [taskColumn, setTaskColumn] = useState<TaskColumn>("To Do");
  const [dragId, setDragId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDetails, setEditingDetails] = useState("");
  const [editingColumn, setEditingColumn] = useState<TaskColumn>("To Do");
  const [deadlineTitle, setDeadlineTitle] = useState("");
  const [deadlineDescription, setDeadlineDescription] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const deadlineDateInputRef = useRef<HTMLInputElement>(null);
  const [showDeadlineTimePicker, setShowDeadlineTimePicker] = useState(false);

  const openNativePicker = (input: HTMLInputElement | null) => {
    if (!input) return;
    input.focus({ preventScroll: true });
    try {
      if (typeof input.showPicker === "function") {
        input.showPicker();
        return;
      }
    } catch {
      // Fallback below for browsers that block or don't support showPicker.
    }
    input.click();
  };

  const grouped = useMemo(() => {
    return columns.reduce<Record<TaskColumn, typeof tasks>>(
      (acc, col) => {
        acc[col] = tasks.filter((task) => task.column === col);
        return acc;
      },
      { "To Do": [], "Working On": [], "Done": [] }
    );
  }, [tasks]);

  const handleAddTask = () => {
    const title = taskTitle.trim();
    if (!title) return;
    addDailyTask(title, taskDetails.trim() || undefined, taskColumn);
    setTaskTitle("");
    setTaskDetails("");
    setTaskColumn("To Do");
  };

  const startEditingTask = (taskId: string, title: string, details: string | undefined, column: TaskColumn) => {
    setEditingTaskId(taskId);
    setEditingTitle(title);
    setEditingDetails(details ?? "");
    setEditingColumn(column);
  };

  const cancelEditingTask = () => {
    setEditingTaskId(null);
    setEditingTitle("");
    setEditingDetails("");
    setEditingColumn("To Do");
  };

  const saveEditingTask = () => {
    if (!editingTaskId) return;
    const title = editingTitle.trim();
    if (!title) return;
    updateDailyTask(editingTaskId, {
      title,
      details: editingDetails.trim() || undefined,
    });
    moveDailyTask(editingTaskId, editingColumn);
    cancelEditingTask();
  };

  const handleAddDeadline = () => {
    if (!deadlineTitle.trim() || !deadlineDate || !deadlineTime) return;
    addDeadline(deadlineTitle.trim(), deadlineDescription.trim(), deadlineDate, deadlineTime);
    setDeadlineTitle("");
    setDeadlineDescription("");
    setDeadlineDate("");
    setDeadlineTime("");
  };

  return (
    <div className="space-y-4">
      <header className="rounded-3xl border border-white/20 bg-black/30 p-6">
        <p className="text-xs tracking-[0.22em] text-cyan-200/90">MY TASKS</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-100 md:text-4xl">Manage Your Work</h1>
      </header>

      <GlassCard className="relative z-20 space-y-3 overflow-visible" glow="orange">
        <h2 className="text-base font-medium text-slate-100">Add a Deadline</h2>
        <div className="grid gap-2 md:grid-cols-2">
          <input
            value={deadlineTitle}
            onChange={(event) => setDeadlineTitle(event.target.value)}
            placeholder="Deadline title"
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-orange-300/40"
          />
          <input
            value={deadlineDescription}
            onChange={(event) => setDeadlineDescription(event.target.value)}
            placeholder="Description (optional)"
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-orange-300/40"
          />
          <div className="relative">
            <input
              ref={deadlineDateInputRef}
              type="date"
              value={deadlineDate}
              onChange={(event) => setDeadlineDate(event.target.value)}
              className="picker-input w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 pr-10 text-sm text-slate-200 outline-none focus:border-orange-300/40"
            />
            <button
              type="button"
              onClick={() => openNativePicker(deadlineDateInputRef.current)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-white/10"
              aria-label="Open deadline date picker"
            >
              <CalendarDays className="picker-icon h-4 w-4" />
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={deadlineTime}
              readOnly
              placeholder="Select time"
              className="picker-input w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 pr-10 text-sm text-slate-200 outline-none focus:border-orange-300/40"
            />
            <button
              type="button"
              onClick={() => setShowDeadlineTimePicker((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-white/10"
              aria-label="Open time picker"
            >
              <Clock3 className="picker-icon h-4 w-4" />
            </button>
            <TimeDialPicker
              value={deadlineTime}
              onChange={setDeadlineTime}
              isOpen={showDeadlineTimePicker}
              onClose={() => setShowDeadlineTimePicker(false)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleAddDeadline}
            className="rounded-lg border border-orange-300/40 bg-orange-300/10 px-4 py-2 text-sm text-orange-200 transition hover:bg-orange-300/20"
          >
            Add Deadline
          </button>
          <p className="text-xs text-slate-400">Active: {deadlines.filter((d) => !d.completed).length}</p>
        </div>

        {deadlines.length > 0 && (
          <div className="space-y-2 border-t border-white/10 pt-3">
            {deadlines.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className={`truncate text-sm ${item.completed ? "text-slate-500 line-through" : "text-slate-200"}`}>
                    {item.title}
                  </p>
                  <p className="truncate text-xs text-slate-400">{new Date(item.dueAt).toLocaleString()}</p>
                </div>
                <div className="ml-3 flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={(event) => toggleDeadlineCompleted(item.id, event.target.checked)}
                      className="h-3.5 w-3.5 accent-teal-400"
                    />
                    <span>Done</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeDeadline(item.id)}
                    className="rounded-md p-1 text-slate-500 transition hover:bg-white/10 hover:text-red-300"
                    aria-label="Remove deadline"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      <GlassCard className="space-y-3" glow="cyan">
        <h2 className="text-base font-medium text-slate-100">Add a Task</h2>
        <div className="grid gap-2 md:grid-cols-[1fr_1fr_160px_auto]">
          <input
            value={taskTitle}
            onChange={(event) => setTaskTitle(event.target.value)}
            placeholder="Task title"
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
          />
          <input
            value={taskDetails}
            onChange={(event) => setTaskDetails(event.target.value)}
            placeholder="Details (optional)"
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
          />
          <select
            value={taskColumn}
            onChange={(event) => setTaskColumn(event.target.value as TaskColumn)}
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-300/40"
          >
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddTask}
            className="rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-300/20"
          >
            Add
          </button>
        </div>
      </GlassCard>

      <section className="grid gap-4 lg:grid-cols-3">
        {columns.map((column) => (
          <GlassCard
            key={column}
            className="min-h-64"
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (dragId) {
                moveDailyTask(dragId, column);
                setDragId(null);
              }
            }}
          >
            <h2 className="mb-3 text-base font-medium text-slate-100">{column}</h2>
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
              className="space-y-2"
            >
              {grouped[column].length === 0 && (
                <p className="rounded-xl border border-dashed border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-500">
                  No tasks yet in this column.
                </p>
              )}
              {grouped[column].map((task) => {
                const isEditing = editingTaskId === task.id;
                const canEdit = true;

                return (
                  <motion.div
                    key={task.id}
                    draggable={!isEditing}
                    onDragStart={() => setDragId(task.id)}
                    variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                    className="cursor-grab rounded-xl border border-white/15 bg-black/25 px-3 py-2 text-sm text-slate-200 active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              value={editingTitle}
                              onChange={(event) => setEditingTitle(event.target.value)}
                              className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
                            />
                            <input
                              value={editingDetails}
                              onChange={(event) => setEditingDetails(event.target.value)}
                              placeholder="Details (optional)"
                              className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1 text-xs text-slate-200 outline-none focus:border-cyan-300/40"
                            />
                            <select
                              value={editingColumn}
                              onChange={(event) => setEditingColumn(event.target.value as TaskColumn)}
                              className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1 text-xs text-slate-200 outline-none focus:border-cyan-300/40"
                            >
                              <option value="To Do">To Do</option>
                              <option value="Working On">Ongoing</option>
                              <option value="Done">Done</option>
                            </select>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={saveEditingTask}
                                className="rounded-md p-1 text-teal-200 transition hover:bg-teal-300/20"
                                aria-label="Save task edits"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditingTask}
                                className="rounded-md p-1 text-slate-400 transition hover:bg-white/10"
                                aria-label="Cancel task edits"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p>{task.title}</p>
                            {task.details ? <p className="mt-1 text-xs text-slate-400">{task.details}</p> : null}
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {canEdit && !isEditing && (
                          <button
                            type="button"
                            onClick={() => startEditingTask(task.id, task.title, task.details, task.column)}
                            className="rounded-md p-1 text-slate-400 transition hover:bg-white/10 hover:text-cyan-200"
                            aria-label="Edit task"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeDailyTask(task.id)}
                          className="rounded-md p-1 text-slate-500 transition hover:bg-white/10 hover:text-red-300"
                          aria-label="Remove task"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </GlassCard>
        ))}
      </section>
      <style jsx>{`
        .picker-input::-webkit-calendar-picker-indicator {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .picker-icon {
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
