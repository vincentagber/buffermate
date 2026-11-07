'use client';

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  User,
  Trash2,
  Check,
  AlertTriangle,
  GitBranch,
  Layers,
  Plus,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Lock,
  Eye,
  Key,
  Users,
  Save,
  HelpCircle
} from 'lucide-react';
import { Project, ProjectRole } from './types';
import { IssueTypeIcon } from './WorkItemIcons';
import { safeFetchJson } from '@/lib/safe-fetch';

interface ProjectSettingsViewProps {
  project: Project;
  onProjectUpdated: (project: Project) => void;
  onProjectDeleted: () => void;
}

type SettingsTab = 'general' | 'workflows' | 'issue_types' | 'permissions';

export default function ProjectSettingsView({
  project,
  onProjectUpdated,
  onProjectDeleted,
}: ProjectSettingsViewProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  // General tab state
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');
  const [category, setCategory] = useState(project.category || 'Core Architecture');
  const [lead, setLead] = useState(project.lead_user_id || 'Alex Morgan');
  const [defaultAssignee, setDefaultAssignee] = useState('Unassigned');
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Workflow tab state
  const [statuses, setStatuses] = useState([
    { key: 'backlog', name: 'Backlog', category: 'todo', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { key: 'todo', name: 'To Do', category: 'todo', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { key: 'in_progress', name: 'In Progress', category: 'in_progress', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { key: 'in_review', name: 'In Review', category: 'in_progress', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { key: 'qa', name: 'QA & Verify', category: 'in_progress', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { key: 'done', name: 'Done', category: 'done', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ]);
  const [newStatusName, setNewStatusName] = useState('');
  const [newStatusCategory, setNewStatusCategory] = useState<'todo' | 'in_progress' | 'done'>('in_progress');
  const [requireSubtasksForDone, setRequireSubtasksForDone] = useState(true);
  const [allowGlobalTransitions, setAllowGlobalTransitions] = useState(true);
  const [isSavingWorkflow, setIsSavingWorkflow] = useState(false);

  // Issue types tab state
  const [issueTypes, setIssueTypes] = useState([
    { id: 'epic', name: 'Epic', desc: 'Big chunk of work that encompasses multiple stories or tasks', active: true },
    { id: 'story', name: 'Story', desc: 'User capability or feature requirement deliverable', active: true },
    { id: 'task', name: 'Task', desc: 'Technical or operational work to be completed', active: true },
    { id: 'bug', name: 'Bug', desc: 'Defect or issue needing resolution', active: true },
    { id: 'subtask', name: 'Subtask', desc: 'Granular work item belonging to a parent story/task', active: true },
  ]);
  const [customFields, setCustomFields] = useState([
    { id: 'cf_1', name: 'Story Points', type: 'Number', required: false, enabled: true },
    { id: 'cf_2', name: 'Acceptance Criteria', type: 'Rich Text', required: true, enabled: true },
    { id: 'cf_3', name: 'Root Cause / Environment', type: 'Dropdown', required: false, enabled: true },
    { id: 'cf_4', name: 'Target Release Date', type: 'Date', required: false, enabled: true },
  ]);

  // Permissions / Members tab state
  const [members, setMembers] = useState([
    { user_id: 'dev_user', name: 'Alex Morgan', role: 'project_admin' as ProjectRole },
    { user_id: 'Elena Rostova', name: 'Elena Rostova', role: 'scrum_master' as ProjectRole },
    { user_id: 'Liam Chen', name: 'Liam Chen', role: 'developer' as ProjectRole },
    { user_id: 'Sarah Connor', name: 'Sarah Connor', role: 'developer' as ProjectRole },
    { user_id: 'Guest Reviewer', name: 'Client Auditor', role: 'viewer' as ProjectRole },
  ]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<ProjectRole>('developer');
  const [isSavingMembers, setIsSavingMembers] = useState(false);

  const showNotification = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3500);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGeneral(true);
    try {
      const { data } = await safeFetchJson<any>(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          category,
          lead_user_id: lead,
        }),
      });

      if (data?.success && data?.data) {
        onProjectUpdated(data.data);
        showNotification('General project settings saved successfully.');
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSavingGeneral(false);
    }
  };

  const handleSaveWorkflow = async () => {
    setIsSavingWorkflow(true);
    try {
      const { data } = await safeFetchJson<any>(`/api/projects/${project.id}/workflow`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statuses: statuses.map((s) => ({ key: s.key, name: s.name })),
          transition_rules: {
            allow_global_transitions: allowGlobalTransitions,
            require_subtasks_for_done: requireSubtasksForDone,
          },
        }),
      });
      if (data?.success) {
        showNotification('Custom workflow scheme saved successfully.');
      }
    } catch (err) {
      console.error('Failed to save workflow:', err);
    } finally {
      setIsSavingWorkflow(false);
    }
  };

  const handleAddStatus = () => {
    if (!newStatusName.trim()) return;
    const key = newStatusName.trim().toLowerCase().replace(/\s+/g, '_');
    const color =
      newStatusCategory === 'done'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : newStatusCategory === 'in_progress'
        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
        : 'bg-slate-100 text-slate-700 border-slate-200';

    setStatuses([...statuses, { key, name: newStatusName.trim(), category: newStatusCategory, color }]);
    setNewStatusName('');
  };

  const handleRemoveStatus = (key: string) => {
    if (['backlog', 'done'].includes(key)) {
      alert('Standard initial and terminal states cannot be removed.');
      return;
    }
    setStatuses(statuses.filter((s) => s.key !== key));
  };

  const handleSaveMembers = async () => {
    setIsSavingMembers(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/members`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('RBAC Access Permissions saved successfully.');
      }
    } catch (err) {
      console.error('Failed to save members:', err);
    } finally {
      setIsSavingMembers(false);
    }
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    setMembers([
      ...members,
      {
        user_id: newMemberName.trim(),
        name: newMemberName.trim(),
        role: newMemberRole,
      },
    ]);
    setNewMemberName('');
  };

  const handleDelete = async () => {
    if (!confirm(`Are you absolutely sure you want to delete project ${project.name} (${project.key})? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onProjectDeleted();
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast Alert */}
      {message && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-2xl border border-emerald-200 flex items-center space-x-2 shadow-xs animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{message}</span>
        </div>
      )}

      {/* Enterprise Project Administration Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center font-black text-sm tracking-widest shadow-xs">
              {project.key}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">{project.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Lead: <span className="font-semibold text-slate-700">{lead}</span> · Template:{' '}
                <span className="font-semibold text-slate-700 uppercase">{project.template || 'Scrum'}</span> · Category:{' '}
                <span className="font-semibold text-slate-700">{category}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Administration Navigation Tabs */}
        <div className="flex items-center space-x-2 pt-4 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'general'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>General & Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('workflows')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'workflows'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Workflows & Transitions</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 font-mono">P3</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('issue_types')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'issue_types'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Issue Types & Fields</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('permissions')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === 'permissions'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Access & Permissions (RBAC)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: GENERAL & DETAILS */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Project Details & Identity</h3>
                <p className="text-xs text-slate-500">Configure key project parameters, category, and lead ownership</p>
              </div>
              <button
                type="submit"
                disabled={isSavingGeneral}
                className="px-5 py-2 bg-[#141416] hover:bg-black text-white text-xs font-semibold rounded-full shadow-2xs transition-all disabled:opacity-50 cursor-pointer flex items-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingGeneral ? 'Saving...' : 'Save Details'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Project Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200/80 text-xs bg-slate-50/50 focus:bg-white text-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Project Key Prefix</label>
                <input
                  type="text"
                  disabled
                  value={project.key}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200/80 text-xs bg-slate-100 text-slate-500 font-mono font-bold cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200/80 text-xs bg-slate-50/50 focus:bg-white text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Project Lead</label>
                <input
                  type="text"
                  value={lead}
                  onChange={(e) => setLead(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200/80 text-xs bg-slate-50/50 focus:bg-white text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Default Assignee</label>
                <select
                  value={defaultAssignee}
                  onChange={(e) => setDefaultAssignee(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200/80 text-xs bg-slate-50/50 focus:bg-white text-slate-900 font-medium"
                >
                  <option value="Unassigned">Unassigned</option>
                  <option value="Project Lead">Project Lead ({lead})</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="High-level project scope and architecture deliverables..."
                className="w-full px-3.5 py-2 rounded-2xl border border-slate-200/80 text-xs bg-slate-50/50 focus:bg-white text-slate-900 resize-none"
              />
            </div>
          </form>

          {/* Danger Zone */}
          <div className="bg-rose-50/60 rounded-3xl p-6 border border-rose-200/80 space-y-4">
            <div className="flex items-center space-x-2 text-rose-700">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold tracking-tight">Danger Zone</h3>
            </div>
            <p className="text-xs text-slate-600">
              Deleting this project permanently removes all work items, boards, sprint cycles, and audit logs. This action cannot be reversed.
            </p>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold shadow-2xs transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Project Permanently</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOM WORKFLOWS & TRANSITIONS (P3) */}
      {activeTab === 'workflows' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Custom Workflow & Status Scheme</h3>
                <p className="text-xs text-slate-500">
                  Define issue lifecycle stages, transition rules, and validation gates
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveWorkflow}
                disabled={isSavingWorkflow}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full shadow-2xs transition-all disabled:opacity-50 cursor-pointer flex items-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingWorkflow ? 'Deploying...' : 'Save Workflow Scheme'}</span>
              </button>
            </div>

            {/* Workflow Diagram Preview */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Lifecycle State Machine Pipeline
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {statuses.map((st, i) => (
                  <React.Fragment key={st.key}>
                    <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border bg-white shadow-2xs">
                      <span className={`w-2 h-2 rounded-full ${st.category === 'done' ? 'bg-emerald-500' : st.category === 'in_progress' ? 'bg-blue-500' : 'bg-slate-400'}`} />
                      <span className="text-xs font-bold text-slate-800">{st.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({st.category})</span>
                      {!['backlog', 'done'].includes(st.key) && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStatus(st.key)}
                          className="text-slate-300 hover:text-rose-500 ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    {i < statuses.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Add Custom Status */}
            <div className="p-4 rounded-2xl border border-dashed border-slate-200 bg-white space-y-3">
              <span className="text-xs font-bold text-slate-800">Add Custom Workflow Status</span>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="e.g. Code Review, Acceptance, Staging"
                  value={newStatusName}
                  onChange={(e) => setNewStatusName(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 w-full"
                />
                <select
                  value={newStatusCategory}
                  onChange={(e) => setNewStatusCategory(e.target.value as any)}
                  className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium cursor-pointer w-full sm:w-auto"
                >
                  <option value="todo">To Do category</option>
                  <option value="in_progress">In Progress category</option>
                  <option value="done">Done category</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddStatus}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 w-full sm:w-auto justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Status</span>
                </button>
              </div>
            </div>

            {/* Workflow Transition Rules / Validators */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Transition Validators & Rules</h4>
              
              <div className="space-y-2">
                <label className="flex items-start space-x-3 p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-all">
                  <input
                    type="checkbox"
                    checked={allowGlobalTransitions}
                    onChange={(e) => setAllowGlobalTransitions(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">Allow all-to-all transitions</span>
                    <span className="text-slate-500">Issues can jump directly across any status column without rigid sequence enforcement.</span>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-all">
                  <input
                    type="checkbox"
                    checked={requireSubtasksForDone}
                    onChange={(e) => setRequireSubtasksForDone(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">Enforce subtask completion before transitioning to Done</span>
                    <span className="text-slate-500">Prevent issues from resolving if any nested subtasks are still pending or in progress.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ISSUE TYPES & FIELDS */}
      {activeTab === 'issue_types' && (
        <div className="space-y-6">
          {/* Issue Type Schemes */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Issue Type Scheme</h3>
              <p className="text-xs text-slate-500">Enabled issue hierarchies and representations for this project</p>
            </div>

            <div className="divide-y divide-slate-100">
              {issueTypes.map((it, idx) => (
                <div key={it.id} className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-slate-100">
                      <IssueTypeIcon type={it.id as any} className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{it.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({it.id})</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{it.desc}</p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={it.active}
                    onChange={(e) => {
                      const updated = [...issueTypes];
                      updated[idx].active = e.target.checked;
                      setIssueTypes(updated);
                      showNotification(`Updated ${it.name} schema status.`);
                    }}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Custom Fields */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Custom Field Configuration</h3>
                <p className="text-xs text-slate-500">Configure project-specific metadata, story estimation, and environment inputs</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {customFields.map((cf, idx) => (
                <div key={cf.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Sliders className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="text-xs font-bold text-slate-900">{cf.name}</span>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                        <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded">{cf.type}</span>
                        {cf.required && <span className="text-rose-600 font-bold">Required</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-[11px] font-semibold text-slate-600">Active on screens</span>
                    <input
                      type="checkbox"
                      checked={cf.enabled}
                      onChange={(e) => {
                        const updated = [...customFields];
                        updated[idx].enabled = e.target.checked;
                        setCustomFields(updated);
                        showNotification(`Field ${cf.name} updated.`);
                      }}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ACCESS & PERMISSIONS (RBAC) */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Project Members & Access Roles</h3>
                <p className="text-xs text-slate-500">Assign role-based access control (RBAC) to team members</p>
              </div>
              <button
                type="button"
                onClick={handleSaveMembers}
                disabled={isSavingMembers}
                className="px-5 py-2 bg-[#141416] hover:bg-black text-white text-xs font-semibold rounded-full shadow-2xs transition-all disabled:opacity-50 cursor-pointer flex items-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingMembers ? 'Saving...' : 'Save Permissions'}</span>
              </button>
            </div>

            {/* Member list */}
            <div className="divide-y divide-slate-100">
              {members.map((member, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{member.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{member.user_id}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={member.role}
                      onChange={(e) => {
                        const newRole = e.target.value as ProjectRole;
                        setMembers(members.map((m, i) => (i === idx ? { ...m, role: newRole } : m)));
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800 cursor-pointer"
                    >
                      <option value="project_admin">Project Admin</option>
                      <option value="scrum_master">Scrum Master</option>
                      <option value="developer">Developer</option>
                      <option value="viewer">Viewer (Read-Only)</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setMembers(members.filter((_, i) => i !== idx))}
                      className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg cursor-pointer"
                      title="Remove member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Member form */}
            <div className="p-4 rounded-2xl border border-dashed border-slate-200 bg-white space-y-3">
              <span className="text-xs font-bold text-slate-800">Add Team Member to Project</span>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="User display name or email"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 w-full"
                />
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as ProjectRole)}
                  className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium cursor-pointer w-full sm:w-auto"
                >
                  <option value="developer">Developer</option>
                  <option value="scrum_master">Scrum Master</option>
                  <option value="project_admin">Project Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 w-full sm:w-auto justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              </div>
            </div>
          </div>

          {/* RBAC Permissions Matrix */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">RBAC Permission Scheme Matrix</h3>
              <p className="text-xs text-slate-500">Fine-grained capability distribution across project roles</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-mono text-[11px]">
                    <th className="py-2.5 font-bold">Permission Capability</th>
                    <th className="py-2.5 font-bold text-center">Project Admin</th>
                    <th className="py-2.5 font-bold text-center">Scrum Master</th>
                    <th className="py-2.5 font-bold text-center">Developer</th>
                    <th className="py-2.5 font-bold text-center">Viewer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  <tr>
                    <td className="py-3 font-semibold text-slate-900">Browse Project & View Issues</td>
                    <td className="py-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="py-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="py-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="py-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-900">Create & Comment on Issues</td>
                    <td className="py-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="py-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="py-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="py-3 text-center"><span className="text-slate-300 font-mono">—</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-900">Transition Status & Log Work</td>
                    <td className="py-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="py-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="py-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="py-3 text-center"><span className="text-slate-300 font-mono">—</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-900">Start, Complete & Manage Sprints</td>
                    <td className="py-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="py-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="py-3 text-center"><span className="text-slate-300 font-mono">—</span></td>
                    <td className="py-3 text-center"><span className="text-slate-300 font-mono">—</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-slate-900">Manage Automations & Custom Workflows</td>
                    <td className="py-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="py-3 text-center"><span className="text-slate-300 font-mono">—</span></td>
                    <td className="py-3 text-center"><span className="text-slate-300 font-mono">—</span></td>
                    <td className="py-3 text-center"><span className="text-slate-300 font-mono">—</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
