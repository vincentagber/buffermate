'use client';

import React, { useState } from 'react';
import { Settings, Shield, User, Trash2, Check, AlertTriangle } from 'lucide-react';
import { JiraProject, ProjectRole } from './types';

interface JiraProjectSettingsViewProps {
  project: JiraProject;
  onProjectUpdated: (project: JiraProject) => void;
  onProjectDeleted: () => void;
}

export default function JiraProjectSettingsView({
  project,
  onProjectUpdated,
  onProjectDeleted,
}: JiraProjectSettingsViewProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');
  const [category, setCategory] = useState(project.category || 'Core Architecture');
  const [lead, setLead] = useState(project.lead_user_id || 'Alex Morgan');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [members, setMembers] = useState([
    { user_id: 'dev_user', name: 'Alex Morgan', role: 'project_admin' as ProjectRole },
    { user_id: 'Elena Rostova', name: 'Elena Rostova', role: 'developer' as ProjectRole },
    { user_id: 'Liam Chen', name: 'Liam Chen', role: 'developer' as ProjectRole },
    { user_id: 'Sarah Connor', name: 'Sarah Connor', role: 'viewer' as ProjectRole },
  ]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/jira/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          category,
          lead_user_id: lead,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        onProjectUpdated(data.data);
        setMessage('Project settings saved successfully.');
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you absolutely sure you want to delete project ${project.name} (${project.key})? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/jira/projects/${project.id}`, {
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
    <div className="space-y-6 max-w-4xl">
      {/* General Settings */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Project Details & Configuration</h3>
            <p className="text-xs text-slate-500">Update general information, template, and project leadership</p>
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 bg-[#141416] hover:bg-black text-white text-xs font-semibold rounded-full shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {message && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-200 flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 rounded-2xl border border-slate-200/80 text-xs bg-slate-50/50 focus:bg-white text-slate-900 resize-none"
          />
        </div>
      </form>

      {/* Team Members & Roles (RBAC) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Project Members & Access Roles</h3>
            <p className="text-xs text-slate-500">Manage permissions across Project Admins, Scrum Masters, Developers and Viewers</p>
          </div>
        </div>

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
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-rose-50/60 rounded-3xl p-6 border border-rose-200/80 space-y-4">
        <div className="flex items-center space-x-2 text-rose-700">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-base font-bold tracking-tight">Danger Zone</h3>
        </div>
        <p className="text-xs text-slate-600">
          Deleting this project will permanently remove all issues, boards, sprints, and comments. This action cannot be reversed.
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
  );
}

