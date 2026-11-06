'use client';

import React, { useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Layers,
  Clock,
  AlertCircle,
  Link as LinkIcon,
  ZoomIn,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { WorkItem, Project } from './types';
import { IssueTypeIcon, IssueStatusBadge } from './WorkItemIcons';

interface ProjectTimelineViewProps {
  project: Project;
  issues: WorkItem[];
  onIssueClick: (issue: WorkItem) => void;
}

export default function ProjectTimelineView({
  project,
  issues,
  onIssueClick,
}: ProjectTimelineViewProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<'weeks' | 'months' | 'quarters'>('weeks');
  const [showOnlyDependencies, setShowOnlyDependencies] = useState(false);

  const filteredIssues = issues.filter((i) => {
    if (filterType !== 'all' && i.type !== filterType) return false;
    if (showOnlyDependencies && (!i.links || i.links.length === 0)) return false;
    return true;
  });

  // Calculate timeline window based on zoom level
  const totalDays = zoomLevel === 'weeks' ? 28 : zoomLevel === 'months' ? 60 : 120;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (zoomLevel === 'weeks' ? 7 : zoomLevel === 'months' ? 14 : 30));

  const days: { date: Date; label: string; isToday: boolean; isWeekend: boolean }[] = [];
  const todayStr = new Date().toDateString();

  const stepDays = zoomLevel === 'quarters' ? 4 : zoomLevel === 'months' ? 2 : 1;
  for (let i = 0; i < totalDays; i += stepDays) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();
    days.push({
      date: d,
      label:
        zoomLevel === 'quarters'
          ? d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          : zoomLevel === 'months'
          ? d.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })
          : d.toLocaleDateString(undefined, { weekday: 'narrow', day: 'numeric' }),
      isToday: d.toDateString() === todayStr,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    });
  }

  // Calculate bar offset and width %
  const getBarStyle = (issue: WorkItem) => {
    const issueStart = issue.start_date ? new Date(issue.start_date) : new Date(issue.created_at);
    const issueDue = issue.due_date ? new Date(issue.due_date) : new Date(issueStart.getTime() + 86400000 * 6);

    const diffStart = (issueStart.getTime() - startDate.getTime()) / 86400000;
    const duration = Math.max(1, (issueDue.getTime() - issueStart.getTime()) / 86400000);

    const leftPercent = Math.max(0, Math.min(100, (diffStart / totalDays) * 100));
    const widthPercent = Math.max(3, Math.min(100 - leftPercent, (duration / totalDays) * 100));

    return {
      left: `${leftPercent}%`,
      width: `${widthPercent}%`,
    };
  };

  return (
    <div className="space-y-4">
      {/* Controls & Zoom Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Timeline & Roadmap</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Interactive Gantt
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Dependencies, milestone delivery dates & Gantt scheduling across Epics
          </p>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          {/* Zoom Level Switcher */}
          <div className="flex bg-slate-100 p-0.5 rounded-full text-xs font-semibold">
            {(['weeks', 'months', 'quarters'] as const).map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setZoomLevel(z)}
                className={`px-3 py-1 rounded-full capitalize transition-all cursor-pointer ${
                  zoomLevel === z
                    ? 'bg-[#141416] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {z}
              </button>
            ))}
          </div>

          {/* Filter Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 border-none text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value="all">All Items</option>
            <option value="epic">Epics Only</option>
            <option value="story">Stories Only</option>
            <option value="task">Tasks & Bugs</option>
          </select>

          {/* Dependency Filter Toggle */}
          <button
            type="button"
            onClick={() => setShowOnlyDependencies(!showOnlyDependencies)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              showOnlyDependencies
                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Dependencies</span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-4 text-[11px] text-slate-500 px-2 flex-wrap gap-y-1">
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-purple-600" />
          <span>Epic Milestone</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
          <span>Standard Task</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 ring-2 ring-rose-300" />
          <span>Blocked Dependency</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
          <span>Completed (Done)</span>
        </span>
      </div>

      {/* Timeline Gantt Grid with responsive horizontal scroll */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xs overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Days Header */}
          <div className="flex border-b border-slate-200/80 bg-slate-50/70 text-[10px] font-mono text-slate-500">
            <div className="w-1/3 min-w-[260px] p-3 font-bold border-r border-slate-200/60 uppercase tracking-wider text-slate-700">
              Work Item ({filteredIssues.length})
            </div>
            <div className="flex-1 flex divide-x divide-slate-100 overflow-x-auto">
              {days.map((day, idx) => (
                <div
                  key={idx}
                  className={`flex-1 py-2 text-center font-semibold text-[10px] ${
                    day.isToday
                      ? 'bg-blue-100 text-blue-700 font-bold'
                      : day.isWeekend
                      ? 'bg-slate-100/50 text-slate-400'
                      : ''
                  }`}
                >
                  {day.label}
                </div>
              ))}
            </div>
          </div>

          {/* Issue Rows */}
          <div className="divide-y divide-slate-100">
            {filteredIssues.map((issue) => {
              const barStyle = getBarStyle(issue);
              const blockedByLink = issue.links?.find((l) => l.relationship === 'is_blocked_by');
              const blocksLink = issue.links?.find((l) => l.relationship === 'blocks');
              const isBlocked = !!blockedByLink;

              return (
                <div
                  key={issue.id}
                  onClick={() => onIssueClick(issue)}
                  className="flex items-center hover:bg-slate-50/70 transition-colors cursor-pointer group"
                >
                  {/* Left Item Summary */}
                  <div className="w-1/3 min-w-[260px] p-3 border-r border-slate-100 flex items-center justify-between truncate pr-3">
                    <div className="flex items-center space-x-2 truncate min-w-0">
                      <IssueTypeIcon type={issue.type} />
                      <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-blue-600 transition-colors shrink-0">
                        {issue.key}
                      </span>
                      <span className="text-xs font-medium text-slate-800 truncate" title={issue.title}>
                        {issue.title}
                      </span>
                    </div>

                    {/* Dependency Badges in Summary */}
                    {blockedByLink && (
                      <span
                        className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 shrink-0 ml-1.5 flex items-center gap-0.5"
                        title={`Blocked by ${blockedByLink.target?.key}`}
                      >
                        <ShieldAlert className="w-3 h-3" />
                        <span>{blockedByLink.target?.key}</span>
                      </span>
                    )}
                    {blocksLink && (
                      <span
                        className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 shrink-0 ml-1.5 flex items-center gap-0.5"
                        title={`Blocks ${blocksLink.target?.key}`}
                      >
                        <ArrowRight className="w-3 h-3" />
                        <span>{blocksLink.target?.key}</span>
                      </span>
                    )}
                  </div>

                  {/* Right Gantt Bar Area */}
                  <div className="flex-1 relative h-12 px-2 flex items-center">
                    <div
                      className={`absolute h-7 rounded-xl shadow-2xs transition-all flex items-center justify-between px-2.5 text-[10px] font-bold text-white truncate group/bar ${
                        issue.status === 'done'
                          ? 'bg-emerald-500 hover:bg-emerald-600'
                          : isBlocked
                          ? 'bg-rose-500 hover:bg-rose-600 ring-2 ring-rose-400/50'
                          : issue.type === 'epic'
                          ? 'bg-purple-600 hover:bg-purple-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      style={barStyle}
                      title={`${issue.key}: ${issue.title} (${issue.status.toUpperCase()})`}
                    >
                      <span className="truncate">{issue.title}</span>

                      {/* Dependency connector indicator on bar */}
                      {(blockedByLink || blocksLink) && (
                        <span className="ml-1 px-1 py-0.2 rounded bg-white/20 text-white font-mono text-[9px] shrink-0">
                          {blockedByLink ? `← ${blockedByLink.target?.key}` : `→ ${blocksLink?.target?.key}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredIssues.length === 0 && (
              <div className="p-12 text-center text-xs text-slate-400">
                No items matching timeline criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
