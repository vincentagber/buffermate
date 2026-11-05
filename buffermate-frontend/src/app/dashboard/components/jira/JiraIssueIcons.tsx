'use client';

import React from 'react';
import {
  Bookmark,
  CheckSquare,
  Bug,
  FolderGit2,
  GitCommit,
  Layers,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronsUp,
  ChevronsDown,
  Flag,
  CircleDot
} from 'lucide-react';
import { IssueType, IssuePriority, IssueStatus } from './types';

export function IssueTypeIcon({ type, className = 'w-4 h-4' }: { type: IssueType; className?: string }) {
  switch (type) {
    case 'epic':
      return (
        <span title="Epic" className="inline-flex items-center justify-center p-0.5 rounded-sm bg-purple-600 text-white shadow-2xs">
          <Layers className={className} />
        </span>
      );
    case 'story':
      return (
        <span title="Story" className="inline-flex items-center justify-center p-0.5 rounded-sm bg-emerald-500 text-white shadow-2xs">
          <Bookmark className={className} />
        </span>
      );
    case 'task':
      return (
        <span title="Task" className="inline-flex items-center justify-center p-0.5 rounded-sm bg-blue-500 text-white shadow-2xs">
          <CheckSquare className={className} />
        </span>
      );
    case 'bug':
      return (
        <span title="Bug" className="inline-flex items-center justify-center p-0.5 rounded-sm bg-rose-600 text-white shadow-2xs">
          <Bug className={className} />
        </span>
      );
    case 'subtask':
      return (
        <span title="Subtask" className="inline-flex items-center justify-center p-0.5 rounded-sm bg-sky-500 text-white shadow-2xs">
          <GitCommit className={className} />
        </span>
      );
    default:
      return (
        <span title={type} className="inline-flex items-center justify-center p-0.5 rounded-sm bg-slate-500 text-white shadow-2xs">
          <CircleDot className={className} />
        </span>
      );
  }
}

export function IssuePriorityIcon({ priority, className = 'w-3.5 h-3.5' }: { priority: IssuePriority; className?: string }) {
  switch (priority) {
    case 'highest':
      return (
        <span title="Highest Priority" className="text-rose-600 inline-flex items-center">
          <ChevronsUp className={className} />
        </span>
      );
    case 'high':
      return (
        <span title="High Priority" className="text-amber-600 inline-flex items-center">
          <ArrowUp className={className} />
        </span>
      );
    case 'medium':
      return (
        <span title="Medium Priority" className="text-orange-500 inline-flex items-center">
          <Minus className={className} />
        </span>
      );
    case 'low':
      return (
        <span title="Low Priority" className="text-blue-500 inline-flex items-center">
          <ArrowDown className={className} />
        </span>
      );
    case 'lowest':
      return (
        <span title="Lowest Priority" className="text-slate-400 inline-flex items-center">
          <ChevronsDown className={className} />
        </span>
      );
    default:
      return <Minus className={className} />;
  }
}

export function IssueStatusBadge({ status, className = '' }: { status: IssueStatus; className?: string }) {
  switch (status) {
    case 'backlog':
      return (
        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200/80 ${className}`}>
          Backlog
        </span>
      );
    case 'todo':
      return (
        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-300 ${className}`}>
          To Do
        </span>
      );
    case 'in_progress':
      return (
        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200 ${className}`}>
          In Progress
        </span>
      );
    case 'in_review':
      return (
        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200 ${className}`}>
          In Review
        </span>
      );
    case 'blocked':
      return (
        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200 ${className}`}>
          Blocked
        </span>
      );
    case 'done':
      return (
        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
          Done
        </span>
      );
    case 'cancelled':
      return (
        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-slate-100 text-slate-400 line-through ${className}`}>
          Cancelled
        </span>
      );
    default:
      return (
        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-slate-100 text-slate-600 ${className}`}>
          {status}
        </span>
      );
  }
}

