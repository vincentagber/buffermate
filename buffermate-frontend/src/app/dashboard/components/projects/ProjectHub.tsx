'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Plus,
  Layers,
  Calendar,
  CheckSquare,
  TrendingUp,
  Zap,
  Settings,
  Sparkles,
  CheckCircle2,
  Users,
  ChevronDown
} from 'lucide-react';
import { Project, WorkItem, Sprint, Board, IssueStatus } from './types';
import ProjectBoardView from './ProjectBoardView';
import ProjectBacklogView from './ProjectBacklogView';
import ProjectTimelineView from './ProjectTimelineView';
import ProjectReportsView from './ProjectReportsView';
import ProjectAutomationsView from './ProjectAutomationsView';
import ProjectSettingsView from './ProjectSettingsView';
import CreateProjectModal from './CreateProjectModal';
import CreateWorkItemModal from './CreateWorkItemModal';
import WorkItemDetailModal from './WorkItemDetailModal';
import AddNewButton from '@/components/ui/AddNewButton';

export default function ProjectHub() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'board' | 'backlog' | 'timeline' | 'reports' | 'automations' | 'settings'>('board');
  const [issues, setIssues] = useState<WorkItem[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false);
  const [createIssueDefaultSprintId, setCreateIssueDefaultSprintId] = useState<string | null>(null);
  const [selectedIssueIdOrKey, setSelectedIssueIdOrKey] = useState<string | null>(null);

  // 1. Fetch Projects
  useEffect(() => {
    fetchProjects();

    // Check if URL has issue query param
    try {
      const params = new URLSearchParams(window.location.search);
      const urlIssue = params.get('issue');
      if (urlIssue) {
        setSelectedIssueIdOrKey(urlIssue);
      }
    } catch {}

    const handleOpenIssue = (e: any) => {
      if (e.detail?.issueIdOrKey) {
        setSelectedIssueIdOrKey(e.detail.issueIdOrKey);
      }
    };
    window.addEventListener('open-project-task', handleOpenIssue);
    return () => {
      window.removeEventListener('open-project-task', handleOpenIssue);
    };
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setProjects(data.data);
        if (!selectedProject) {
          setSelectedProject(data.data[0]);
        }
      }
    } catch (e) {
      console.error('Failed to fetch projects:', e);
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
        fetch(`/api/projects/${projectId}/board`),
        fetch(`/api/projects/${projectId}/sprints`),
        fetch(`/api/projects/${projectId}/issues`),
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
      const res = await fetch(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success && data.data && selectedProject) {
        loadProjectWorkspace(selectedProject.id);
        window.dispatchEvent(new CustomEvent('project-notification-refresh'));
      }
    } catch (err) {
      console.error('Failed to update issue status on server:', err);
    }
  };

  const handleIssueCreated = (newIssue: WorkItem) => {
    setIssues((prev) => [newIssue, ...prev]);
    if (selectedProject) loadProjectWorkspace(selectedProject.id);
    window.dispatchEvent(new CustomEvent('project-notification-refresh'));
  };

  const handleIssueUpdated = (updated: WorkItem) => {
    setIssues((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    if (selectedProject) loadProjectWorkspace(selectedProject.id);
    window.dispatchEvent(new CustomEvent('project-notification-refresh'));
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
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-purple-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading project engine...</p>
      </div>
    );
  }

  // Empty state if no projects exist
  if (!isLoading && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-lg mx-auto space-y-4 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
          <FolderGit2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Projects Found</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Create your first software project to begin tracking tasks, grooming backlogs, and managing agile Scrum and Kanban boards.
        </p>
        <AddNewButton
          title="Create Project"
          size={24}
          onClick={() => setIsCreateProjectOpen(true)}
          label="Create Project"
          iconClassName="stroke-emerald-400 group-hover:stroke-white"
          className="px-5 py-2.5 bg-[#141416] hover:bg-black text-white text-xs font-semibold rounded-full shadow-2xs transition-all inline-flex items-center space-x-1.5"
        />

        <CreateProjectModal
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

        <div className="flex items-center space-x-2 shrink-0">
          {projects.length > 1 && (
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
          )}

          <AddNewButton
            title="Create New Project"
            size={22}
            onClick={() => setIsCreateProjectOpen(true)}
            label="New Project"
            iconClassName="stroke-emerald-400 group-hover:stroke-white"
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-full shadow-2xs transition-all flex items-center space-x-1.5"
          />
        </div>
      </div>

      {/* Tab Views */}
      {selectedProject && (
        <>
          {activeTab === 'board' && (
            <ProjectBoardView
              project={selectedProject}
              board={board}
              issues={issues}
              onIssueClick={(issue) => setSelectedIssueIdOrKey(issue.id)}
              onIssueStatusChange={handleIssueStatusChange}
              onOpenCreateIssue={handleOpenCreateWithContext}
            />
          )}

          {activeTab === 'backlog' && (
            <ProjectBacklogView
              project={selectedProject}
              sprints={sprints}
              issues={issues}
              onIssueClick={(issue) => setSelectedIssueIdOrKey(issue.id)}
              onRefresh={() => loadProjectWorkspace(selectedProject.id)}
              onOpenCreateIssue={handleOpenCreateWithContext}
            />
          )}

          {activeTab === 'timeline' && (
            <ProjectTimelineView
              project={selectedProject}
              issues={issues}
              onIssueClick={(issue) => setSelectedIssueIdOrKey(issue.id)}
            />
          )}

          {activeTab === 'reports' && (
            <ProjectReportsView project={selectedProject} />
          )}

          {activeTab === 'automations' && (
            <ProjectAutomationsView project={selectedProject} />
          )}

          {activeTab === 'settings' && (
            <ProjectSettingsView
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
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onProjectCreated={(newProj) => {
          setProjects([newProj, ...projects]);
          setSelectedProject(newProj);
        }}
      />

      {/* Create Issue Modal */}
      {selectedProject && (
        <CreateWorkItemModal
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
        <WorkItemDetailModal
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
