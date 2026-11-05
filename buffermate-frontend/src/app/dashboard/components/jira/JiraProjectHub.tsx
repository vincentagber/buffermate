'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Plus,
  Layers,
  CheckSquare,
  Calendar,
  TrendingUp,
  Zap,
  Settings,
  RefreshCw,
  Search,
  CheckCircle2,
  Users,
  ChevronDown
} from 'lucide-react';
import { JiraProject, JiraIssue, JiraSprint, JiraBoard, IssueStatus } from './types';
import JiraBoardView from './JiraBoardView';
import JiraBacklogView from './JiraBacklogView';
import JiraTimelineView from './JiraTimelineView';
import JiraReportsView from './JiraReportsView';
import JiraAutomationsView from './JiraAutomationsView';
import JiraProjectSettingsView from './JiraProjectSettingsView';
import JiraCreateProjectModal from './JiraCreateProjectModal';
import JiraCreateIssueModal from './JiraCreateIssueModal';
import JiraIssueDetailModal from './JiraIssueDetailModal';

export default function JiraProjectHub() {
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<JiraProject | null>(null);
  const [activeTab, setActiveTab] = useState<'board' | 'backlog' | 'timeline' | 'reports' | 'automations' | 'settings'>('board');
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [sprints, setSprints] = useState<JiraSprint[]>([]);
  const [board, setBoard] = useState<JiraBoard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false);
  const [createIssueDefaultSprintId, setCreateIssueDefaultSprintId] = useState<string | null>(null);
  const [selectedIssueIdOrKey, setSelectedIssueIdOrKey] = useState<string | null>(null);

  // 1. Fetch Projects
  useEffect(() => {
    fetchProjects();

    try {
      const pending = sessionStorage.getItem('buffermate_pending_open_issue');
      if (pending) {
        setSelectedIssueIdOrKey(pending);
        sessionStorage.removeItem('buffermate_pending_open_issue');
      }
    } catch {}

    const handleOpenIssue = (e: any) => {
      if (e.detail?.issueIdOrKey) {
        setSelectedIssueIdOrKey(e.detail.issueIdOrKey);
      }
    };
    window.addEventListener('open-jira-issue', handleOpenIssue);
    return () => window.removeEventListener('open-jira-issue', handleOpenIssue);
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/jira/projects');
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setProjects(data.data);
        if (!selectedProject) {
          setSelectedProject(data.data[0]);
        }
      }
    } catch (e) {
      console.error('Failed to fetch Jira projects:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Fetch Project Data (Board, Sprints, Issues)
  useEffect(() => {
    if (!selectedProject) return;
    loadProjectWorkspace(selectedProject.id);
  }, [selectedProject?.id]);

  const loadProjectWorkspace = async (projectId: string) => {
    try {
      const [boardRes, sprintRes, issueRes] = await Promise.all([
        fetch(`/api/jira/projects/${projectId}/board`),
        fetch(`/api/jira/projects/${projectId}/sprints`),
        fetch(`/api/jira/projects/${projectId}/issues`),
      ]);

      const [boardData, sprintData, issueData] = await Promise.all([
        boardRes.json().catch(() => ({})),
        sprintRes.json().catch(() => ({})),
        issueRes.json().catch(() => ({})),
      ]);

      if (boardData.success && boardData.data) {
        setBoard(boardData.data.board);
      }
      if (sprintData.success && Array.isArray(sprintData.data)) {
        setSprints(sprintData.data);
      }
      if (issueData.success && Array.isArray(issueData.data)) {
        setIssues(issueData.data);
      }
    } catch (err) {
      console.error('Failed to load project workspace:', err);
    }
  };

  // Status transition handler for drag-and-drop
  const handleIssueStatusChange = async (issueId: string, nextStatus: IssueStatus) => {
    // Optimistic local update
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, status: nextStatus } : i))
    );

    try {
      const res = await fetch(`/api/jira/issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success && data.data && selectedProject) {
        loadProjectWorkspace(selectedProject.id);
        window.dispatchEvent(new CustomEvent('jira-notification-refresh'));
      }
    } catch (err) {
      console.error('Failed to update issue status on server:', err);
    }
  };

  const handleIssueCreated = (newIssue: JiraIssue) => {
    setIssues((prev) => [newIssue, ...prev]);
    if (selectedProject) loadProjectWorkspace(selectedProject.id);
    window.dispatchEvent(new CustomEvent('jira-notification-refresh'));
  };

  const handleIssueUpdated = (updated: JiraIssue) => {
    setIssues((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    if (selectedProject) loadProjectWorkspace(selectedProject.id);
    window.dispatchEvent(new CustomEvent('jira-notification-refresh'));
  };

  const handleIssueDeleted = (deletedId: string) => {
    setIssues((prev) => prev.filter((i) => i.id !== deletedId));
    if (selectedProject) loadProjectWorkspace(selectedProject.id);
  };

  const handleOpenCreateWithContext = (sprintId?: string | null) => {
    setCreateIssueDefaultSprintId(sprintId || null);
    setIsCreateIssueOpen(true);
  };

  if (isLoading && projects.length === 0) {
    return (
      <div className="p-16 text-center text-xs text-slate-400">
        Loading project management environment...
      </div>
    );
  }

  // Zero projects state
  if (!selectedProject && projects.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-2xs space-y-4 max-w-md mx-auto">
        <div className="w-14 h-14 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
          <FolderGit2 className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">No Projects Yet</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Create your first software project to begin tracking tasks, grooming backlogs, and managing agile Scrum and Kanban boards.
        </p>
        <button
          type="button"
          onClick={() => setIsCreateProjectOpen(true)}
          className="px-5 py-2.5 bg-[#141416] hover:bg-black text-white text-xs font-semibold rounded-full shadow-2xs transition-all cursor-pointer inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Project</span>
        </button>

        <JiraCreateProjectModal
          isOpen={isCreateProjectOpen}
          onClose={() => setIsCreateProjectOpen(false)}
          onProjectCreated={(p) => {
            setProjects([p, ...projects]);
            setSelectedProject(p);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in pb-16">
      {/* Sub-Tabs Navigation - Mobile touch-scrolling & responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-2">
        <div className="flex items-center overflow-x-auto gap-1.5 sm:gap-2 scrollbar-none pb-1 -mx-2 px-2 sm:mx-0 sm:px-0">
          {[
            { id: 'board', label: 'Active Board', icon: CheckSquare },
            { id: 'backlog', label: 'Backlog & Sprints', icon: Layers },
            { id: 'timeline', label: 'Timeline & Roadmap', icon: Calendar },
            { id: 'reports', label: 'Agile Reports', icon: TrendingUp },
            { id: 'automations', label: 'Automations', icon: Zap },
            { id: 'settings', label: 'Project Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#141416] text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {projects.length > 1 && (
          <div className="flex items-center space-x-2 shrink-0">
            <select
              value={selectedProject?.id}
              onChange={(e) => {
                const p = projects.find((pr) => pr.id === e.target.value);
                if (p) setSelectedProject(p);
              }}
              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 rounded-full px-3 py-1.5 focus:outline-hidden"
            >
              {projects.map((pr) => (
                <option key={pr.id} value={pr.id}>
                  {pr.name} ({pr.key})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tab Views */}
      {selectedProject && (
        <>
          {activeTab === 'board' && (
            <JiraBoardView
              project={selectedProject}
              board={board}
              issues={issues}
              onIssueClick={(issue) => setSelectedIssueIdOrKey(issue.id)}
              onIssueStatusChange={handleIssueStatusChange}
              onOpenCreateIssue={handleOpenCreateWithContext}
            />
          )}

          {activeTab === 'backlog' && (
            <JiraBacklogView
              project={selectedProject}
              sprints={sprints}
              issues={issues}
              onIssueClick={(issue) => setSelectedIssueIdOrKey(issue.id)}
              onRefresh={() => loadProjectWorkspace(selectedProject.id)}
              onOpenCreateIssue={handleOpenCreateWithContext}
            />
          )}

          {activeTab === 'timeline' && (
            <JiraTimelineView
              project={selectedProject}
              issues={issues}
              onIssueClick={(issue) => setSelectedIssueIdOrKey(issue.id)}
            />
          )}

          {activeTab === 'reports' && (
            <JiraReportsView project={selectedProject} />
          )}

          {activeTab === 'automations' && (
            <JiraAutomationsView project={selectedProject} />
          )}

          {activeTab === 'settings' && (
            <JiraProjectSettingsView
              project={selectedProject}
              onProjectUpdated={(p) => {
                setSelectedProject(p);
                fetchProjects();
              }}
              onProjectDeleted={() => {
                fetchProjects();
                setSelectedProject(null);
              }}
            />
          )}
        </>
      )}

      {/* Create Project Modal */}
      <JiraCreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onProjectCreated={(newProj) => {
          setProjects([newProj, ...projects]);
          setSelectedProject(newProj);
        }}
      />

      {/* Create Issue Modal */}
      {selectedProject && (
        <JiraCreateIssueModal
          isOpen={isCreateIssueOpen}
          onClose={() => setIsCreateIssueOpen(false)}
          project={selectedProject}
          sprints={sprints}
          defaultSprintId={createIssueDefaultSprintId}
          onIssueCreated={handleIssueCreated}
        />
      )}

      {/* Issue Detail Modal */}
      {selectedIssueIdOrKey && (
        <JiraIssueDetailModal
          issueIdOrKey={selectedIssueIdOrKey}
          onClose={() => setSelectedIssueIdOrKey(null)}
          onIssueUpdated={handleIssueUpdated}
          onIssueDeleted={handleIssueDeleted}
          project={selectedProject}
          availableIssues={issues}
        />
      )}
    </div>
  );
}

