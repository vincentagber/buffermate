'use client';

import React, { useState } from 'react';
import {
  Plus,
  Play,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Flame,
  ArrowRight
} from 'lucide-react';
import { WorkItem, Project, Sprint, IssueStatus } from './types';
import { IssueTypeIcon, IssuePriorityIcon, IssueStatusBadge } from './WorkItemIcons';
import { triggerConfetti } from '@/components/ui/Confetti';
import AddNewButton from '@/components/ui/AddNewButton';

interface ProjectBacklogViewProps {
  project: Project;
  sprints: Sprint[];
  issues: WorkItem[];
  onIssueClick: (issue: WorkItem) => void;
  onRefresh: () => void;
  onOpenCreateIssue: (sprintId?: string | null) => void;
}

export default function ProjectBacklogView({
  project,
  sprints,
  issues,
  onIssueClick,
  onRefresh,
  onOpenCreateIssue,
}: ProjectBacklogViewProps) {
  const [collapsedSprints, setCollapsedSprints] = useState<Record<string, boolean>>({});
  const [isCreatingSprint, setIsCreatingSprint] = useState(false);
  const [newSprintName, setNewSprintName] = useState('');
  const [newSprintGoal, setNewSprintGoal] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);

  const toggleSprintCollapse = (id: string) => {
    setCollapsedSprints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeSprint = sprints.find((s) => s.status === 'active');
  const futureSprints = sprints.filter((s) => s.status === 'future');
  const backlogIssues = issues.filter((i) => !i.sprint_id);

  // Create Sprint
  const handleCreateSprint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSprintName.trim()) return;

    try {
      const res = await fetch(`/api/projects/${project.id}/sprints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSprintName.trim(),
          goal: newSprintGoal.trim() || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreatingSprint(false);
        setNewSprintName('');
        setNewSprintGoal('');
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to create sprint:', err);
    }
  };

  // Start Sprint
  const handleStartSprint = async (sprintId: string) => {
    setIsActionLoading(true);
    try {
      const res = await fetch(`/api/sprints/${sprintId}/start`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        triggerConfetti();
        onRefresh();
      } else {
        alert(data.message || 'Failed to start sprint');
      }
    } catch (err) {
      console.error('Failed to start sprint:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Complete Sprint
  const handleCompleteSprint = async (sprintId: string) => {
    if (!confirm('Complete this sprint? Incomplete issues will roll over to the backlog.')) return;
    setIsActionLoading(true);
    try {
      const res = await fetch(`/api/sprints/${sprintId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incomplete_destination: 'backlog' }),
      });
      const data = await res.json();
      if (data.success) {
        triggerConfetti();
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to complete sprint:', err);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Move issue to sprint
  const handleMoveIssueToSprint = async (issueId: string, sprintId: string | null) => {
    try {
      await fetch(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sprint_id: sprintId }),
      });
      onRefresh();
    } catch (err) {
      console.error('Failed to move issue:', err);
    }
  };

  const renderIssueRow = (issue: WorkItem) => (
    <div
      key={issue.id}
      onClick={() => onIssueClick(issue)}
      className="flex items-center justify-between p-3 bg-white hover:bg-slate-50/80 border-b border-slate-100 last:border-b-0 cursor-pointer text-xs transition-colors group"
    >
      <div className="flex items-center space-x-3 truncate">
        <IssueTypeIcon type={issue.type} />
        <span className="font-mono font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
          {issue.key}
        </span>
        <span className={`font-semibold truncate max-w-[120px] xs:max-w-[180px] sm:max-w-xs md:max-w-md ${issue.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
          {issue.title}
        </span>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        {/* Story points */}
        {issue.story_points !== null && issue.story_points !== undefined && (
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold font-mono text-[10px]">
            {issue.story_points}
          </span>
        )}

        {/* Priority Icon */}
        <IssuePriorityIcon priority={issue.priority} />

        {/* Status Badge */}
        <IssueStatusBadge status={issue.status} />

        {/* Assignee Avatar */}
        <div
          className="w-5 h-5 rounded-full bg-slate-800 text-white text-[9px] font-bold flex items-center justify-center"
          title={issue.assignee_user_id || 'Unassigned'}
        >
          {(issue.assignee_user_id || 'U').slice(0, 2).toUpperCase()}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Scrum Backlog & Sprint Planning</h3>
          <p className="text-xs text-slate-500">Plan sprints, estimate story points, and commit issues</p>
        </div>

        <AddNewButton
          title="Create New Sprint"
          size={20}
          onClick={() => {
            setNewSprintName(`${project.key} Sprint ${sprints.length + 1}`);
            setIsCreatingSprint(true);
          }}
          label="Create Sprint"
          iconClassName="stroke-white group-hover:stroke-emerald-400 group-active:stroke-white"
          className="px-4 py-2 bg-[#141416] hover:bg-black active:bg-black text-white hover:text-white active:text-white rounded-full text-xs font-semibold shadow-2xs transition-all flex items-center space-x-1.5 whitespace-nowrap shrink-0"
        />
      </div>

      {/* Create Sprint Form Drawer */}
      {isCreatingSprint && (
        <form onSubmit={handleCreateSprint} className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">New Sprint Configuration</h4>
            <button type="button" onClick={() => setIsCreatingSprint(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={newSprintName}
              onChange={(e) => setNewSprintName(e.target.value)}
              placeholder="Sprint Name"
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            />
            <input
              type="text"
              value={newSprintGoal}
              onChange={(e) => setNewSprintGoal(e.target.value)}
              placeholder="Sprint Goal (e.g. Ship Core V2)"
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setIsCreatingSprint(false)} className="px-3 py-1.5 text-xs text-slate-500 cursor-pointer">Cancel</button>
            <button type="submit" className="px-4 py-1.5 bg-[#141416] text-white text-xs font-semibold rounded-xl cursor-pointer">Save Sprint</button>
          </div>
        </form>
      )}

      {/* 1. Active Sprint Container */}
      {activeSprint && (
        <div className="bg-white rounded-3xl border-2 border-blue-500/30 shadow-2xs overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-blue-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => toggleSprintCollapse(activeSprint.id)}
                className="text-slate-500 hover:text-slate-900"
              >
                {collapsedSprints[activeSprint.id] ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white flex items-center space-x-1">
                    <Flame className="w-3 h-3" />
                    <span>ACTIVE SPRINT</span>
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{activeSprint.name}</h4>
                </div>
                {activeSprint.goal && (
                  <p className="text-xs text-slate-500 mt-0.5 italic">Goal: {activeSprint.goal}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono font-bold text-slate-600">
                {issues.filter((i) => i.sprint_id === activeSprint.id).length} issues
              </span>
              <button
                type="button"
                disabled={isActionLoading}
                onClick={() => handleCompleteSprint(activeSprint.id)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              >
                Complete Sprint
              </button>
            </div>
          </div>

          {/* Issues in active sprint */}
          {!collapsedSprints[activeSprint.id] && (
            <div>
              {issues.filter((i) => i.sprint_id === activeSprint.id).map(renderIssueRow)}
              {issues.filter((i) => i.sprint_id === activeSprint.id).length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400">
                  Sprint is empty. Drag issues from the backlog or click Create Item below.
                </div>
              )}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                <AddNewButton
                  title="Create item in sprint"
                  size={20}
                  onClick={() => onOpenCreateIssue(activeSprint.id)}
                  label="Create item in sprint"
                  iconClassName="stroke-blue-600 group-hover:stroke-blue-800"
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Future Sprints */}
      {futureSprints.map((sprint) => {
        const sprintIssues = issues.filter((i) => i.sprint_id === sprint.id);
        const totalPts = sprintIssues.reduce((acc, i) => acc + (i.story_points || 0), 0);

        return (
          <div key={sprint.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => toggleSprintCollapse(sprint.id)}
                  className="text-slate-500 hover:text-slate-900"
                >
                  {collapsedSprints[sprint.id] ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                      PLANNING
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{sprint.name}</h4>
                  </div>
                  {sprint.goal && (
                    <p className="text-xs text-slate-500 mt-0.5 italic">Goal: {sprint.goal}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono font-bold text-slate-500">
                  {sprintIssues.length} issues · {totalPts} pts
                </span>
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={() => handleStartSprint(sprint.id)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold shadow-2xs transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <Play className="w-3 h-3" />
                  <span>Start Sprint</span>
                </button>
              </div>
            </div>

            {!collapsedSprints[sprint.id] && (
              <div>
                {sprintIssues.map(renderIssueRow)}
                {sprintIssues.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No issues scheduled for this sprint.
                  </div>
                )}
                <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                  <AddNewButton
                    title="Create item in sprint"
                    size={20}
                    onClick={() => onOpenCreateIssue(sprint.id)}
                    label="Create item in sprint"
                    iconClassName="stroke-blue-600 group-hover:stroke-blue-800"
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* 3. Product Backlog Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-100/60 flex items-center justify-between border-b border-slate-200/60">
          <div className="flex items-center space-x-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Product Backlog
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
              {backlogIssues.length}
            </span>
          </div>

          <AddNewButton
            title="Create item in backlog"
            size={20}
            onClick={() => onOpenCreateIssue(null)}
            label="Create item in backlog"
            iconClassName="stroke-blue-600 group-hover:stroke-blue-800"
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
          />
        </div>

        <div>
          {backlogIssues.map((issue) => (
            <div key={issue.id} className="group relative">
              {renderIssueRow(issue)}
              {/* Quick action overlay to move to active/future sprint */}
              {activeSprint && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveIssueToSprint(issue.id, activeSprint.id);
                  }}
                  className="absolute right-40 top-2.5 opacity-0 group-hover:opacity-100 px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-bold rounded-lg border border-blue-200 transition-opacity cursor-pointer flex items-center space-x-1"
                >
                  <span>Move to Active Sprint</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          ))}

          {backlogIssues.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              The backlog is empty. All issues are currently scheduled in sprints.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

