'use client';

import React, { useState } from 'react';
import {
  Plus,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Layers,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { Board, WorkItem, Project, IssueStatus } from './types';
import { IssueTypeIcon, IssuePriorityIcon, IssueStatusBadge } from './WorkItemIcons';
import { triggerConfetti } from '@/components/ui/Confetti';

interface ProjectBoardViewProps {
  project: Project;
  board: Board | null;
  issues: WorkItem[];
  onIssueClick: (issue: WorkItem) => void;
  onIssueStatusChange: (issueId: string, nextStatus: IssueStatus) => Promise<void>;
  onOpenCreateIssue: (defaultStatus?: IssueStatus) => void;
}

export default function ProjectBoardView({
  project,
  board,
  issues,
  onIssueClick,
  onIssueStatusChange,
  onOpenCreateIssue,
}: ProjectBoardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyMyIssues, setOnlyMyIssues] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);
  const [dragOverColStatus, setDragOverColStatus] = useState<string | null>(null);

  // Default standard columns if board not loaded
  const rawColumns = board?.columns && board.columns.length > 0
    ? board.columns
    : [
        { id: 'c-todo', name: 'To Do', mapped_status: 'todo' as IssueStatus, wip_limit: 10, order_index: 0, cards: [], card_count: 0, story_points_sum: 0, is_over_wip: false },
        { id: 'c-prog', name: 'In Progress', mapped_status: 'in_progress' as IssueStatus, wip_limit: 5, order_index: 1, cards: [], card_count: 0, story_points_sum: 0, is_over_wip: false },
        { id: 'c-rev', name: 'In Review', mapped_status: 'in_review' as IssueStatus, wip_limit: 4, order_index: 2, cards: [], card_count: 0, story_points_sum: 0, is_over_wip: false },
        { id: 'c-done', name: 'Done', mapped_status: 'done' as IssueStatus, wip_limit: null, order_index: 3, cards: [], card_count: 0, story_points_sum: 0, is_over_wip: false },
      ];

  const columns = rawColumns.filter(
    (col) => col.mapped_status !== 'backlog' && col.name.toLowerCase() !== 'backlog'
  );

  // Filtering
  const filteredIssues = issues.filter((issue) => {
    if (onlyMyIssues && issue.assignee_user_id !== 'dev_user' && issue.assignee_user_id !== 'Alex Morgan') {
      return false;
    }
    if (filterPriority !== 'all' && issue.priority !== filterPriority) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchKey = issue.key.toLowerCase().includes(q);
      const matchTitle = issue.title.toLowerCase().includes(q);
      if (!matchKey && !matchTitle) return false;
    }
    return true;
  });

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, issueId: string) => {
    e.dataTransfer.setData('text/plain', issueId);
    setDraggedIssueId(issueId);
  };

  const handleDragOver = (e: React.DragEvent, colStatus: string) => {
    e.preventDefault();
    setDragOverColStatus(colStatus);
  };

  const handleDrop = async (e: React.DragEvent, nextStatus: IssueStatus) => {
    e.preventDefault();
    setDragOverColStatus(null);
    const issueId = e.dataTransfer.getData('text/plain') || draggedIssueId;
    if (issueId) {
      await onIssueStatusChange(issueId, nextStatus);
    }
    setDraggedIssueId(null);
  };

  return (
    <div className="space-y-4">
      {/* Quick Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center flex-wrap gap-2">
          {/* Search Input */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search board..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-full text-xs focus:outline-hidden focus:ring-1 focus:ring-slate-900 text-slate-800"
            />
          </div>

          {/* Quick Filters */}
          <button
            type="button"
            onClick={() => setOnlyMyIssues(!onlyMyIssues)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              onlyMyIssues
                ? 'bg-[#141416] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Only My Issues
          </button>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 border-none text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value="all">All Priorities</option>
            <option value="highest">Highest</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-mono">
            {filteredIssues.length} issues
          </span>
          <button
            type="button"
            onClick={() => onOpenCreateIssue()}
            className="px-4 py-1.5 bg-[#141416] hover:bg-black text-white rounded-full text-xs font-semibold shadow-2xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Issue</span>
          </button>
        </div>
      </div>

      {/* Board Columns Grid - Fully responsive on mobile, tablet, and desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 items-start">
        {columns.map((col) => {
          const colCards = filteredIssues.filter((i) => i.status === col.mapped_status);
          const isOverWip = col.wip_limit && colCards.length > col.wip_limit;
          const isDragOver = dragOverColStatus === col.mapped_status;
          const totalPoints = colCards.reduce((acc, c) => acc + (c.story_points || 0), 0);

          return (
            <div
              key={col.id || col.mapped_status}
              onDragOver={(e) => handleDragOver(e, col.mapped_status)}
              onDragLeave={() => setDragOverColStatus(null)}
              onDrop={(e) => handleDrop(e, col.mapped_status)}
              className={`bg-slate-100/70 rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 border transition-all flex flex-col min-h-[360px] sm:min-h-[480px] ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20'
                  : 'border-slate-200/70'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200/60 mb-3">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {col.name}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isOverWip
                        ? 'bg-rose-100 text-rose-700 border border-rose-300'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                    title={isOverWip ? `Exceeds WIP limit of ${col.wip_limit}` : undefined}
                  >
                    {colCards.length}
                    {col.wip_limit ? ` / ${col.wip_limit}` : ''}
                  </span>
                </div>

                {totalPoints > 0 && (
                  <span className="text-[10px] font-mono text-slate-400 font-semibold" title="Total Story Points">
                    {totalPoints} pts
                  </span>
                )}
              </div>

              {/* Cards List */}
              <div className="space-y-2.5 flex-1 overflow-y-auto">
                {colCards.map((card) => {
                  const hasSubtasks = card.subtasks && card.subtasks.length > 0;
                  const completedSubtasks = hasSubtasks
                    ? card.subtasks!.filter((s) => s.status === 'done').length
                    : 0;

                  const isBlocked = card.links?.some((l) => l.relationship === 'is_blocked_by');

                  return (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, card.id)}
                      onClick={() => onIssueClick(card)}
                      className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer space-y-2.5 group"
                    >
                      {/* Card Top: Type, Key, Priority */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <IssueTypeIcon type={card.type} />
                          <span className="text-[11px] font-mono font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
                            {card.key}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          {isBlocked && (
                            <span className="px-1.5 py-0.5 rounded-sm bg-rose-50 text-rose-600 text-[9px] font-bold border border-rose-200 flex items-center space-x-1" title="Blocked by dependency">
                              <AlertCircle className="w-2.5 h-2.5" />
                              <span>BLOCKED</span>
                            </span>
                          )}
                          <IssuePriorityIcon priority={card.priority} />
                        </div>
                      </div>

                      {/* Title */}
                      <p className="text-xs font-semibold text-slate-900 leading-snug line-clamp-2">
                        {card.title}
                      </p>

                      {/* Card Bottom: Points, Subtasks, Assignee */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-400">
                        <div className="flex items-center space-x-2">
                          {card.story_points !== null && card.story_points !== undefined && (
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold font-mono text-[10px]">
                              {card.story_points}
                            </span>
                          )}

                          {hasSubtasks && (
                            <span className="flex items-center space-x-1 text-[10px] text-slate-500 font-mono">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                              <span>{completedSubtasks}/{card.subtasks!.length}</span>
                            </span>
                          )}
                        </div>

                        {/* Assignee Avatar */}
                        <div
                          className="w-5 h-5 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center shrink-0"
                          title={card.assignee_user_id || 'Unassigned'}
                        >
                          {(card.assignee_user_id || 'U').slice(0, 2).toUpperCase()}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {colCards.length === 0 && (
                  <div className="h-24 border-2 border-dashed border-slate-200/80 rounded-2xl flex items-center justify-center text-slate-300 text-xs font-medium">
                    Drop cards here
                  </div>
                )}
              </div>

              {/* Bottom Quick Create Action */}
              <button
                type="button"
                onClick={() => onOpenCreateIssue(col.mapped_status)}
                className="mt-3 w-full py-1.5 border border-transparent hover:border-slate-200 hover:bg-white text-slate-500 hover:text-slate-900 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create item</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

