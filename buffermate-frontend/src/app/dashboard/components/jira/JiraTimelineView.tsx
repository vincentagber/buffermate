'use client';

import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Layers, Clock, AlertCircle } from 'lucide-react';
import { JiraIssue, JiraProject } from './types';
import { IssueTypeIcon, IssueStatusBadge } from './JiraIssueIcons';

interface JiraTimelineViewProps {
  project: JiraProject;
  issues: JiraIssue[];
  onIssueClick: (issue: JiraIssue) => void;
}

export default function JiraTimelineView({
  project,
  issues,
  onIssueClick,
}: JiraTimelineViewProps) {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredIssues = issues.filter((i) => {
    if (filterType !== 'all' && i.type !== filterType) return false;
    return true;
  });

  // Calculate timeline window: 4 weeks (28 days) centered on today
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const totalDays = 35;

  const days: { date: Date; label: string; isToday: boolean; isWeekend: boolean }[] = [];
  const todayStr = new Date().toDateString();

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();
    days.push({
      date: d,
      label: d.toLocaleDateString(undefined, { weekday: 'narrow', day: 'numeric' }),
      isToday: d.toDateString() === todayStr,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    });
  }

  // Calculate bar offset and width %
  const getBarStyle = (issue: JiraIssue) => {
    const issueStart = issue.start_date ? new Date(issue.start_date) : new Date(issue.created_at);
    const issueDue = issue.due_date ? new Date(issue.due_date) : new Date(issueStart.getTime() + 86400000 * 5);

    const diffStart = (issueStart.getTime() - startDate.getTime()) / 86400000;
    const duration = Math.max(1, (issueDue.getTime() - issueStart.getTime()) / 86400000);

    const leftPercent = Math.max(0, Math.min(100, (diffStart / totalDays) * 100));
    const widthPercent = Math.max(2, Math.min(100 - leftPercent, (duration / totalDays) * 100));

    return {
      left: `${leftPercent}%`,
      width: `${widthPercent}%`,
    };
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Timeline & Roadmap</h3>
          <p className="text-xs text-slate-500">Gantt scheduling across Epics, Stories, and delivery milestones</p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 border-none text-slate-700 cursor-pointer focus:outline-hidden"
          >
            <option value="all">All Work Items</option>
            <option value="epic">Epics Only</option>
            <option value="story">Stories Only</option>
            <option value="task">Tasks & Bugs</option>
          </select>
        </div>
      </div>

      {/* Timeline Gantt Grid with responsive horizontal scroll */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xs overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Days Header */}
          <div className="flex border-b border-slate-200/80 bg-slate-50/70 text-[10px] font-mono text-slate-500">
          <div className="w-1/3 min-w-[220px] p-3 font-bold border-r border-slate-200/60 uppercase tracking-wider text-slate-700">
            Work Item ({filteredIssues.length})
          </div>
          <div className="flex-1 grid grid-cols-35 divide-x divide-slate-100 overflow-x-auto">
            {days.map((day, idx) => (
              <div
                key={idx}
                className={`py-2 text-center font-semibold ${
                  day.isToday ? 'bg-blue-100 text-blue-700 font-bold' : day.isWeekend ? 'bg-slate-100/50 text-slate-400' : ''
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
            const isBlocked = issue.links?.some((l) => l.relationship === 'is_blocked_by');

            return (
              <div
                key={issue.id}
                onClick={() => onIssueClick(issue)}
                className="flex items-center hover:bg-slate-50/70 transition-colors cursor-pointer group"
              >
                {/* Left Item Summary */}
                <div className="w-1/3 min-w-[220px] p-3 border-r border-slate-100 flex items-center space-x-2.5 truncate">
                  <IssueTypeIcon type={issue.type} />
                  <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
                    {issue.key}
                  </span>
                  <span className="text-xs font-medium text-slate-800 truncate">
                    {issue.title}
                  </span>
                </div>

                {/* Right Bar Area */}
                <div className="flex-1 relative h-11 px-2 flex items-center">
                  <div
                    className={`absolute h-6 rounded-lg shadow-2xs transition-all flex items-center px-2 text-[10px] font-bold text-white truncate ${
                      issue.status === 'done'
                        ? 'bg-emerald-500 hover:bg-emerald-600'
                        : isBlocked
                        ? 'bg-rose-500 hover:bg-rose-600 ring-2 ring-rose-400/40'
                        : issue.type === 'epic'
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    style={barStyle}
                    title={`${issue.key}: ${issue.title} (${issue.status.toUpperCase()})`}
                  >
                    <span className="truncate">{issue.title}</span>
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

