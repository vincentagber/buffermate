'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Check,
  Plus,
  Send,
  Trash2,
  Clock,
  User,
  Calendar,
  Tag,
  Link as LinkIcon,
  MessageSquare,
  History,
  AlertCircle,
  CheckCircle2,
  GitCommit,
  ExternalLink,
  Edit3,
  Eye,
  EyeOff,
  AtSign,
  Layers,
  FileText,
  Paperclip,
  Download,
  UploadCloud,
  File,
  Edit2
} from 'lucide-react';
import { WorkItem, Project, IssueStatus, IssuePriority, IssueType } from './types';
import { IssueTypeIcon, IssuePriorityIcon, IssueStatusBadge } from './WorkItemIcons';
import { safeFetchJson } from '@/lib/safe-fetch';
import { triggerConfetti } from '@/components/ui/Confetti';

interface WorkItemDetailModalProps {
  issueIdOrKey: string | null;
  onClose: () => void;
  onIssueUpdated: (updated: WorkItem) => void;
  onIssueDeleted: (deletedId: string) => void;
  project?: Project | null;
  availableIssues?: WorkItem[];
}

export default function WorkItemDetailModal({
  issueIdOrKey,
  onClose,
  onIssueUpdated,
  onIssueDeleted,
  project,
  availableIssues = [],
}: WorkItemDetailModalProps) {
  const [issue, setIssue] = useState<WorkItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'comments' | 'history'>('comments');
  const [mobileSection, setMobileSection] = useState<'overview' | 'details'>('overview');
  const [newComment, setNewComment] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleEdit, setTitleEdit] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descEdit, setDescEdit] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [linkTargetId, setLinkTargetId] = useState('');
  const [linkRelation, setLinkRelation] = useState<'blocks' | 'is_blocked_by' | 'relates_to'>('is_blocked_by');
  const [isSaving, setIsSaving] = useState(false);
  const [watchersCount, setWatchersCount] = useState(0);
  const [isWatching, setIsWatching] = useState(false);
  const [watchersList, setWatchersList] = useState<any[]>([]);
  const [isTogglingWatcher, setIsTogglingWatcher] = useState(false);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!issueIdOrKey) return;
    fetchIssueDetails();
  }, [issueIdOrKey]);

  const fetchIssueDetails = async () => {
    if (!issueIdOrKey) return;
    setIsLoading(true);
    try {
      const { data } = await safeFetchJson<any>(`/api/issues/${issueIdOrKey}`);
      if (data?.success && data.data) {
        setIssue(data.data);
        setTitleEdit(data.data.title);
        setDescEdit(data.data.description || '');
        fetchWatchers(data.data.id);
      }
    } catch (e) {
      console.error('Failed to load issue details:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWatchers = async (issueId: string) => {
    try {
      const { data } = await safeFetchJson<any>(`/api/issues/${issueId}/watchers`);
      if (data?.success && data.data) {
        setWatchersCount(data.data.count || 0);
        setIsWatching(!!data.data.is_watching);
        setWatchersList(data.data.watchers || []);
      }
    } catch (e) {
      console.error('Failed to load watchers:', e);
    }
  };

  const handleToggleWatch = async () => {
    if (!issue) return;
    setIsTogglingWatcher(true);
    try {
      const { data } = await safeFetchJson<any>(`/api/issues/${issue.id}/watchers/toggle`, {
        method: 'POST',
      });
      if (data?.success && data.data) {
        setIsWatching(data.data.is_watching);
        setWatchersCount(data.data.count);
      }
    } catch (e) {
      console.error('Failed to toggle watch:', e);
    } finally {
      setIsTogglingWatcher(false);
    }
  };

  if (!issueIdOrKey) return null;

  const handleUpdateField = async (fields: Partial<WorkItem>) => {
    if (!issue) return;
    setIsSaving(true);
    try {
      const { data } = await safeFetchJson<any>(`/api/issues/${issue.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      if (data?.success && data.data) {
        setIssue(data.data);
        onIssueUpdated(data.data);
        window.dispatchEvent(new CustomEvent('project-notification-refresh'));
        if (fields.status === 'done') {
          triggerConfetti();
        }
      }
    } catch (err) {
      console.error('Failed to update issue:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue || !newComment.trim()) return;

    try {
      const { data } = await safeFetchJson<any>(`/api/issues/${issue.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment.trim(),
          author_name: 'Alex Morgan',
        }),
      });
      if (data?.success && data.data) {
        setIssue({
          ...issue,
          comments: [...(issue.comments || []), data.data],
        });
        setNewComment('');
        fetchWatchers(issue.id);
        window.dispatchEvent(new CustomEvent('project-notification-refresh'));
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectId = project?.id || (issue as any)?.project_id || (issue as any)?.project?.id;
    if (!issue || !newSubtaskTitle.trim() || !projectId) return;

    try {
      const { data } = await safeFetchJson<any>(`/api/projects/${projectId}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newSubtaskTitle.trim(),
          type: 'subtask',
          parent_id: issue.id,
          sprint_id: issue.sprint_id,
          status: 'todo',
        }),
      });
      if (data?.success && data.data) {
        setIssue({
          ...issue,
          subtasks: [...(issue.subtasks || []), data.data],
        });
        setNewSubtaskTitle('');
        setIsAddingSubtask(false);
      }
    } catch (err) {
      console.error('Failed to add subtask:', err);
    }
  };

  const handleToggleSubtask = async (subtask: WorkItem) => {
    const nextStatus = subtask.status === 'done' ? 'todo' : 'done';
    try {
      const { data } = await safeFetchJson<any>(`/api/issues/${subtask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (data?.success && data.data) {
        setIssue((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            subtasks: (prev.subtasks || []).map((s) => (s.id === subtask.id ? data.data : s)),
          };
        });
        if (nextStatus === 'done') triggerConfetti();
      }
    } catch (err) {
      console.error('Failed to toggle subtask:', err);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue || !linkTargetId) return;

    try {
      const res = await fetch(`/api/issues/${issue.id}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_work_item_id: linkTargetId,
          relationship: linkRelation,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setIssue({
          ...issue,
          links: [...(issue.links || []), data.data],
        });
        setIsLinking(false);
        setLinkTargetId('');
      }
    } catch (err) {
      console.error('Failed to link issue:', err);
    }
  };

  const handleDeleteIssue = async () => {
    if (!issue) return;
    if (!confirm(`Delete ${issue.key} permanently?`)) return;

    try {
      const res = await fetch(`/api/issues/${issue.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onIssueDeleted(issue.id);
        onClose();
      }
    } catch (err) {
      console.error('Failed to delete issue:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !issue) return;

    setIsUploadingAttachment(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const res = await fetch(`/api/issues/${issue.id}/attachments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            file_path: base64Data,
            file_type: file.type || 'application/octet-stream',
            file_size: file.size,
            thumbnail_url: file.type.startsWith('image/') ? base64Data : null,
          }),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setIssue({
            ...issue,
            attachments: [data.data, ...(issue.attachments || [])],
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Failed to upload attachment:', err);
    } finally {
      setIsUploadingAttachment(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!issue) return;
    try {
      const res = await fetch(`/api/issues/${issue.id}/attachments/${attachmentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setIssue({
          ...issue,
          attachments: (issue.attachments || []).filter((a) => a.id !== attachmentId),
        });
      }
    } catch (err) {
      console.error('Failed to delete attachment:', err);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!issue || !editCommentText.trim()) return;
    try {
      const res = await fetch(`/api/issues/${issue.id}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editCommentText.trim() }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setIssue({
          ...issue,
          comments: (issue.comments || []).map((c) =>
            c.id === commentId ? { ...c, content: editCommentText.trim() } : c
          ),
        });
        setEditingCommentId(null);
        setEditCommentText('');
      }
    } catch (err) {
      console.error('Failed to update comment:', err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!issue || !confirm('Delete this comment?')) return;
    try {
      const res = await fetch(`/api/issues/${issue.id}/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setIssue({
          ...issue,
          comments: (issue.comments || []).filter((c) => c.id !== commentId),
        });
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  // Subtask completion math
  const subtasks = issue?.subtasks || [];
  const completedSubtasks = subtasks.filter((s) => s.status === 'done').length;
  const subtaskPct = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;

  if (!mounted) return null;

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
          className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 mx-auto flex flex-col h-auto max-h-[92dvh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/70">
          <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
            <span className="text-xs font-bold text-slate-400 font-mono shrink-0">
              {project?.key || (issue as any)?.project?.key || 'BM'}
            </span>
            <span className="text-slate-300 shrink-0">/</span>
            <div className="flex items-center space-x-1.5 px-2 sm:px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold shrink-0">
              <IssueTypeIcon type={issue?.type || 'task'} className="w-3.5 h-3.5" />
              <span>{issue?.key || issueIdOrKey}</span>
            </div>
            {issue?.resolution && (
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                Resolved
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <button
              onClick={handleDeleteIssue}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all cursor-pointer"
              title="Delete issue"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-slate-200/80 hover:bg-slate-100 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher on screens < lg */}
        {issue && !isLoading && (
          <div className="lg:hidden flex items-center border-b border-slate-100 bg-slate-50/90 px-3 sm:px-4 py-2 gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setMobileSection('overview')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                mobileSection === 'overview'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Overview & Comments</span>
              {(issue.comments?.length ?? 0) > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 font-mono">
                  {issue.comments?.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileSection('details')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                mobileSection === 'details'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              <span>Status & Details</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-700 font-bold uppercase font-mono">
                {issue.status}
              </span>
            </button>
          </div>
        )}

        {/* Modal Body: 2-Column Responsive Layout */}
        {isLoading || !issue ? (
          <div className="p-16 text-center text-xs text-slate-400">Loading issue details...</div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Content Area */}
            <div className={`flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 pb-14 ${
              mobileSection === 'details' ? 'hidden lg:block' : 'block'
            }`}>
              {/* Title Section */}
              <div className="space-y-1">
                {isEditingTitle ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={titleEdit}
                      onChange={(e) => setTitleEdit(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                    />
                    <button
                      onClick={() => {
                        handleUpdateField({ title: titleEdit });
                        setIsEditingTitle(false);
                      }}
                      className="px-3 py-1.5 bg-[#141416] text-white text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingTitle(false)}
                      className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <h1
                    onClick={() => setIsEditingTitle(true)}
                    className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight cursor-pointer hover:bg-slate-50 p-1 -ml-1 rounded-lg transition-colors flex items-center justify-between group"
                    title="Click to edit title"
                  >
                    <span>{issue.title}</span>
                    <Edit3 className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </h1>
                )}
              </div>

              {/* Description Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Description
                </label>
                {isEditingDesc ? (
                  <div className="space-y-2">
                    <textarea
                      rows={5}
                      value={descEdit}
                      onChange={(e) => setDescEdit(e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900 resize-none"
                    />
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          handleUpdateField({ description: descEdit });
                          setIsEditingDesc(false);
                        }}
                        className="px-3.5 py-1.5 bg-[#141416] text-white text-xs font-semibold rounded-xl cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingDesc(false)}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsEditingDesc(true)}
                    className="p-3.5 bg-slate-50/70 hover:bg-slate-100/70 rounded-2xl text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed cursor-pointer transition-colors min-h-[70px]"
                  >
                    {issue.description || <span className="text-slate-400 italic">Add a description...</span>}
                  </div>
                )}
              </div>

              {/* Subtasks Section */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Subtasks
                    </label>
                    {subtasks.length > 0 && (
                      <span className="text-[11px] font-semibold text-slate-500 font-mono">
                        {completedSubtasks}/{subtasks.length} ({subtaskPct}%)
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingSubtask(true)}
                    className="text-xs text-blue-600 hover:underline font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Subtask</span>
                  </button>
                </div>

                {/* Progress Bar */}
                {subtasks.length > 0 && (
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${subtaskPct}%` }}
                    />
                  </div>
                )}

                {/* Subtask list */}
                <div className="space-y-1.5">
                  {subtasks.map((st) => (
                    <div
                      key={st.id}
                      className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/60 text-xs transition-colors"
                    >
                      <div className="flex items-center space-x-2.5">
                        <button
                          type="button"
                          onClick={() => handleToggleSubtask(st)}
                          className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all cursor-pointer ${
                            st.status === 'done'
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-white border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {st.status === 'done' && <Check className="w-3 h-3" />}
                        </button>
                        <span className="font-mono text-[10px] text-slate-400 font-bold">{st.key}</span>
                        <span
                          className={`font-medium ${
                            st.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {st.title}
                        </span>
                      </div>
                      <IssueStatusBadge status={st.status} />
                    </div>
                  ))}

                  {isAddingSubtask && (
                    <form onSubmit={handleAddSubtask} className="flex items-center space-x-2 pt-1">
                      <input
                        type="text"
                        autoFocus
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        placeholder="What needs to be done?"
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                      />
                      <button
                        type="submit"
                        disabled={!newSubtaskTitle.trim()}
                        className="px-3 py-1.5 bg-[#141416] text-white text-xs font-semibold rounded-xl cursor-pointer"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingSubtask(false)}
                        className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Linked Issues & Dependencies Section */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>Linked Issues</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsLinking(!isLinking)}
                    className="text-xs text-blue-600 hover:underline font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Link Issue</span>
                  </button>
                </div>

                {isLinking && (
                  <form onSubmit={handleAddLink} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <select
                        value={linkRelation}
                        onChange={(e) => setLinkRelation(e.target.value as any)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="is_blocked_by">is blocked by</option>
                        <option value="blocks">blocks</option>
                        <option value="relates_to">relates to</option>
                      </select>

                      <select
                        value={linkTargetId}
                        onChange={(e) => setLinkTargetId(e.target.value)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="">Select target issue...</option>
                        {availableIssues
                          .filter((i) => i.id !== issue.id)
                          .map((i) => (
                            <option key={i.id} value={i.id}>
                              {i.key} - {i.title.slice(0, 30)}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsLinking(false)}
                        className="px-2.5 py-1 text-xs text-slate-500 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!linkTargetId}
                        className="px-3 py-1 bg-[#141416] text-white text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        Link
                      </button>
                    </div>
                  </form>
                )}

                {/* Existing Links */}
                <div className="space-y-1.5">
                  {(issue.links || []).map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-200/70 px-1.5 py-0.5 rounded-sm">
                          {link.relationship.replace(/_/g, ' ')}
                        </span>
                        <span className="font-mono text-blue-600 font-bold">{link.target?.key}</span>
                        <span className="text-slate-800 font-medium truncate max-w-[200px]">
                          {link.target?.title}
                        </span>
                      </div>
                      {link.target && <IssueStatusBadge status={link.target.status} />}
                    </div>
                  ))}
                  {(!issue.links || issue.links.length === 0) && !isLinking && (
                    <p className="text-xs text-slate-400 italic">No linked issues or dependencies.</p>
                  )}
                </div>
              </div>

              {/* Attachments Section */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Paperclip className="w-4 h-4 text-slate-500" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Attachments ({issue.attachments?.length || 0})
                    </h3>
                  </div>

                  <label className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center space-x-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Attachment</span>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploadingAttachment}
                    />
                  </label>
                </div>

                {isUploadingAttachment && (
                  <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-xl flex items-center space-x-2">
                    <UploadCloud className="w-4 h-4 animate-bounce" />
                    <span>Uploading attachment to issue...</span>
                  </div>
                )}

                {/* Attachments Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(issue.attachments || []).map((att) => (
                    <div
                      key={att.id}
                      className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between group hover:border-slate-300 transition-all text-xs"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                        {att.thumbnail_url ? (
                          <img
                            src={att.thumbnail_url}
                            alt={att.filename}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/60">
                            <File className="w-4 h-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate" title={att.filename}>
                            {att.filename}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {formatFileSize(att.file_size)} · {new Date(att.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <a
                          href={att.file_path}
                          download={att.filename}
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteAttachment(att.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {(!issue.attachments || issue.attachments.length === 0) && !isUploadingAttachment && (
                    <div className="col-span-full border-2 border-dashed border-slate-200/80 rounded-2xl p-4 text-center">
                      <p className="text-xs text-slate-400">Drag and drop screenshots, mockups, or documents here, or click upload.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity / Comments Tabs */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center space-x-4 border-b border-slate-100 pb-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('comments')}
                    className={`text-xs font-bold pb-1 flex items-center space-x-1.5 cursor-pointer ${
                      activeTab === 'comments'
                        ? 'text-slate-900 border-b-2 border-slate-900'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Comments ({issue.comments?.length || 0})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className={`text-xs font-bold pb-1 flex items-center space-x-1.5 cursor-pointer ${
                      activeTab === 'history'
                        ? 'text-slate-900 border-b-2 border-slate-900'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>History ({issue.history?.length || 0})</span>
                  </button>
                </div>

                {activeTab === 'comments' ? (
                  <div className="space-y-3">
                    {/* Add Comment input */}
                    <form onSubmit={handleAddComment} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment... (use @name to mention team)"
                        className="flex-1 px-3.5 py-2 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-slate-50/50"
                      />
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="px-4 py-2 bg-[#141416] hover:bg-black text-white text-xs font-semibold rounded-2xl cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>

                    {/* Quick Mention Chips */}
                    <div className="flex items-center space-x-1.5 flex-wrap text-[10px] pt-0.5">
                      <span className="text-slate-400 font-semibold flex items-center space-x-1">
                        <AtSign className="w-3 h-3 text-purple-600" />
                        <span>Mention:</span>
                      </span>
                      {['Alex Morgan', 'Elena Rostova', 'Liam Chen', 'Sarah Connor'].map((member) => (
                        <button
                          key={member}
                          type="button"
                          onClick={() => setNewComment((prev) => `${prev ? prev + ' ' : ''}@${member} `)}
                          className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-600 transition-colors cursor-pointer"
                        >
                          @{member.split(' ')[0]}
                        </button>
                      ))}
                    </div>

                    {/* Comment list */}
                    <div className="space-y-2">
                      {(issue.comments || []).map((c) => (
                        <div key={c.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 group">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-800">{c.author_name || c.user_id}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-400">
                                {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {editingCommentId !== c.id && (
                                <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingCommentId(c.id);
                                      setEditCommentText(c.content);
                                    }}
                                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteComment(c.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {editingCommentId === c.id ? (
                            <div className="space-y-2 pt-1">
                              <textarea
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-xl text-xs bg-white text-slate-900 focus:outline-hidden"
                                rows={2}
                              />
                              <div className="flex justify-end space-x-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingCommentId(null)}
                                  className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEditComment(c.id)}
                                  className="px-3 py-1 bg-[#141416] text-white text-xs font-semibold rounded-lg cursor-pointer"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{c.content}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {(issue.history || []).map((h) => (
                      <div key={h.id} className="text-xs text-slate-600 p-2 bg-slate-50 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-800">{h.user_id}</span> changed{' '}
                          <span className="font-mono text-blue-600 font-bold">{h.field}</span>
                          {h.from_value && (
                            <>
                              {' '}from <span className="line-through text-slate-400">{h.from_value}</span>
                            </>
                          )}{' '}
                          to <span className="font-semibold text-slate-900">{h.to_value}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(h.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Details Panel */}
            <div className={`w-full lg:w-80 xl:w-96 shrink-0 bg-slate-50/80 border-t lg:border-t-0 lg:border-l border-slate-200/80 p-4 sm:p-6 space-y-5 overflow-y-auto min-h-0 pb-20 ${
              mobileSection === 'overview' ? 'hidden lg:block' : 'block'
            }`}>
              {/* Status Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Workflow Status
                </label>
                <select
                  value={issue.status}
                  onChange={(e) => handleUpdateField({ status: e.target.value as IssueStatus })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold uppercase bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 cursor-pointer shadow-2xs text-slate-800"
                >
                  <option value="backlog">Backlog</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="in_review">In Review</option>
                  <option value="blocked">Blocked</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {/* Priority Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Priority
                </label>
                <select
                  value={issue.priority}
                  onChange={(e) => handleUpdateField({ priority: e.target.value as IssuePriority })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 cursor-pointer shadow-2xs text-slate-800"
                >
                  <option value="highest">Highest</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="lowest">Lowest</option>
                </select>
              </div>

              {/* Assignee */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Assignee
                </label>
                <select
                  value={issue.assignee_user_id || ''}
                  onChange={(e) => handleUpdateField({ assignee_user_id: e.target.value || null })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 cursor-pointer shadow-2xs text-slate-800"
                >
                  <option value="dev_user">Alex Morgan (Me)</option>
                  <option value="Elena Rostova">Elena Rostova</option>
                  <option value="Liam Chen">Liam Chen</option>
                  <option value="Sarah Connor">Sarah Connor</option>
                  <option value="">Unassigned</option>
                </select>
              </div>

              {/* Reporter */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Reporter
                </label>
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{issue.reporter_user_id || 'Alex Morgan'}</span>
                </div>
              </div>

              {/* Watchers & Notification Scheme */}
              <div className="space-y-2 pt-2 border-t border-slate-200/60">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Watchers
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                    {watchersCount} {watchersCount === 1 ? 'watcher' : 'watchers'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleToggleWatch}
                  disabled={isTogglingWatcher}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-2xs ${
                    isWatching
                      ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isWatching ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-blue-600" />
                      <span>Watching for Updates</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Watch Issue</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {isWatching
                    ? "You receive in-app notifications whenever status, comments, or assignments change on this issue."
                    : "Click to receive in-app notifications whenever this issue changes."}
                </p>
              </div>

              {/* Story Points */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Story Points
                </label>
                <input
                  type="number"
                  value={issue.story_points ?? ''}
                  onChange={(e) => handleUpdateField({ story_points: e.target.value ? parseInt(e.target.value, 10) : null })}
                  placeholder="e.g. 5"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 font-bold"
                />
              </div>

              {/* Time Tracking */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Time Tracking (Hours)
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Est:</span>
                    <input
                      type="number"
                      step="0.5"
                      value={issue.estimated_hours ?? ''}
                      onChange={(e) => handleUpdateField({ estimated_hours: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="Hours"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Logged:</span>
                    <input
                      type="number"
                      step="0.5"
                      value={issue.logged_hours ?? 0}
                      onChange={(e) => handleUpdateField({ logged_hours: e.target.value ? parseFloat(e.target.value) : 0 })}
                      placeholder="Hours"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-2 pt-2 border-t border-slate-200/60 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Created</span>
                  <span className="text-slate-700 font-medium">{new Date(issue.created_at).toLocaleDateString()}</span>
                </div>
                {issue.completed_at && (
                  <div>
                    <span className="text-[10px] text-emerald-600 block font-semibold uppercase">Completed At</span>
                    <span className="text-emerald-700 font-medium">{new Date(issue.completed_at).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>,
    document.body
  );
}

