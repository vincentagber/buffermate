'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Sparkles, Tag, Calendar, User, Layers } from 'lucide-react';
import { WorkItem, Project, Sprint, IssueType, IssuePriority } from './types';
import { IssueTypeIcon, IssuePriorityIcon } from './WorkItemIcons';
import { triggerConfetti } from '@/components/ui/Confetti';

interface CreateWorkItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  sprints: Sprint[];
  onIssueCreated: (issue: WorkItem) => void;
  defaultSprintId?: string | null;
  defaultType?: IssueType;
}

export default function CreateWorkItemModal({
  isOpen,
  onClose,
  project,
  sprints,
  onIssueCreated,
  defaultSprintId = null,
  defaultType = 'task',
}: CreateWorkItemModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<IssueType>(defaultType);
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [storyPoints, setStoryPoints] = useState<string>('3');
  const [sprintId, setSprintId] = useState<string>(defaultSprintId || '');
  const [assignee, setAssignee] = useState<string>('dev_user');
  const [labelsStr, setLabelsStr] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const labels = labelsStr
      .split(',')
      .map((l) => l.trim().toLowerCase())
      .filter((l) => l.length > 0);

    try {
      const res = await fetch(`/api/projects/${project.id}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          type,
          priority,
          story_points: storyPoints ? parseInt(storyPoints, 10) : null,
          sprint_id: sprintId || null,
          assignee_user_id: assignee || null,
          labels,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        triggerConfetti();
        onIssueCreated(data.data);
        onClose();
      } else {
        setError(data.message || 'Failed to create issue');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const types: { id: IssueType; label: string }[] = [
    { id: 'story', label: 'Story' },
    { id: 'task', label: 'Task' },
    { id: 'bug', label: 'Bug' },
    { id: 'epic', label: 'Epic' },
  ];

  const priorities: { id: IssuePriority; label: string }[] = [
    { id: 'highest', label: 'Highest' },
    { id: 'high', label: 'High' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' },
    { id: 'lowest', label: 'Lowest' },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-xs font-sans animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="min-h-full flex items-center justify-center p-3 sm:p-6"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 mx-auto flex flex-col max-h-[92dvh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200">
              {project?.key || 'BM'}
            </span>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Create Work Item</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-200/80 hover:bg-slate-100 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0 flex-1">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          {/* Type Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Issue Type
            </label>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    type === t.id
                      ? 'bg-[#141416] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <IssueTypeIcon type={t.id} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Summary / Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Summary <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement real-time Webhook sync for Threads API"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200/80 text-xs bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900 font-medium"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe technical requirements, expected behavior, acceptance criteria..."
              className="w-full px-3.5 py-2 rounded-2xl border border-slate-200/80 text-xs bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900 resize-none"
            />
          </div>

          {/* Priority & Story Points */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as IssuePriority)}
                className="w-full px-3 py-2 rounded-2xl border border-slate-200/80 text-xs bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900 cursor-pointer"
              >
                {priorities.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Story Points (Fibonacci)
              </label>
              <select
                value={storyPoints}
                onChange={(e) => setStoryPoints(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl border border-slate-200/80 text-xs bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900 cursor-pointer"
              >
                <option value="">None</option>
                <option value="1">1 pt - Trivial</option>
                <option value="2">2 pts - Simple</option>
                <option value="3">3 pts - Moderate</option>
                <option value="5">5 pts - Significant</option>
                <option value="8">8 pts - Complex</option>
                <option value="13">13 pts - Architecture</option>
              </select>
            </div>
          </div>

          {/* Sprint & Assignee */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Sprint
              </label>
              <select
                value={sprintId}
                onChange={(e) => setSprintId(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl border border-slate-200/80 text-xs bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900 cursor-pointer"
              >
                <option value="">Product Backlog (Unassigned)</option>
                {sprints.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.status.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Assignee
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl border border-slate-200/80 text-xs bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900 cursor-pointer"
              >
                <option value="dev_user">Alex Morgan (Me)</option>
                <option value="Elena Rostova">Elena Rostova</option>
                <option value="Liam Chen">Liam Chen</option>
                <option value="Sarah Connor">Sarah Connor</option>
                <option value="">Unassigned</option>
              </select>
            </div>
          </div>

          {/* Labels & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Labels (comma-separated)
              </label>
              <input
                type="text"
                value={labelsStr}
                onChange={(e) => setLabelsStr(e.target.value)}
                placeholder="frontend, api, bug"
                className="w-full px-3.5 py-2 rounded-2xl border border-slate-200/80 text-xs bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl border border-slate-200/80 text-xs bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-5 py-2 bg-[#141416] hover:bg-black text-white text-xs font-semibold rounded-full shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Creating...' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>,
    document.body
  );
}

