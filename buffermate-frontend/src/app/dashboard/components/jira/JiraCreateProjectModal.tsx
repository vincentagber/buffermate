'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, FolderGit2, Check, Sparkles, Layers, CheckSquare } from 'lucide-react';
import { JiraProject, ProjectTemplate } from './types';

interface JiraCreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: JiraProject) => void;
}

export default function JiraCreateProjectModal({
  isOpen,
  onClose,
  onProjectCreated,
}: JiraCreateProjectModalProps) {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [template, setTemplate] = useState<ProjectTemplate>('scrum');
  const [category, setCategory] = useState('Core Architecture');
  const [lead, setLead] = useState('Alex Morgan');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    // Auto-generate key from name if not manually edited
    if (!key || key === name.slice(0, 3).toUpperCase()) {
      const words = val.trim().split(/\s+/);
      let suggestedKey = '';
      if (words.length >= 2) {
        suggestedKey = words.map(w => w[0]).join('').slice(0, 4).toUpperCase();
      } else {
        suggestedKey = val.slice(0, 3).toUpperCase();
      }
      setKey(suggestedKey.replace(/[^A-Z0-9]/g, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !key.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/jira/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          key: key.trim().toUpperCase(),
          description: description.trim() || null,
          template,
          category,
          lead_user_id: lead,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        onProjectCreated(data.data);
        onClose();
      } else {
        setError(data.message || 'Failed to create project');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-xs font-sans animate-fade-in flex flex-col items-center justify-end sm:justify-center p-0 sm:p-4 md:p-6">
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200/80 mx-auto my-0 sm:my-auto flex flex-col max-h-[94dvh] sm:max-h-[calc(100dvh-3.5rem)] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-2xs font-bold">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Create Project</h2>
              <p className="text-xs text-slate-500">Configure your agile software project</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-200/80 hover:bg-slate-100 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto min-h-0 flex-1">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          {/* Template Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Project Template
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTemplate('scrum')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  template === 'scrum'
                    ? 'border-blue-600 bg-blue-50/40 text-blue-900 ring-2 ring-blue-500/10'
                    : 'border-slate-200/80 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs">
                  <div className="flex items-center space-x-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Scrum</span>
                  </div>
                  {template === 'scrum' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Sprints, backlog grooming & burndown charts</p>
              </button>

              <button
                type="button"
                onClick={() => setTemplate('kanban')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  template === 'kanban'
                    ? 'border-blue-600 bg-blue-50/40 text-blue-900 ring-2 ring-blue-500/10'
                    : 'border-slate-200/80 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs">
                  <div className="flex items-center space-x-1.5">
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                    <span>Kanban</span>
                  </div>
                  {template === 'kanban' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Continuous flow with WIP column limits</p>
              </button>
            </div>
          </div>

          {/* Project Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Project Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Growth Marketing Platform"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200/80 text-xs bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900 font-medium"
            />
          </div>

          {/* Key and Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Key Prefix <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={8}
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                placeholder="e.g. GMP"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200/80 text-xs font-mono font-bold bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900"
              />
              <p className="text-[10px] text-slate-400">Issues will be {key || 'PROJ'}-1, {key || 'PROJ'}-2</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-slate-200/80 text-xs bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900 cursor-pointer"
              >
                <option value="Core Architecture">Core Architecture</option>
                <option value="Product Development">Product Development</option>
                <option value="Growth Marketing">Growth Marketing</option>
                <option value="Infrastructure & DevOps">Infrastructure & DevOps</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline project objectives and milestones..."
              className="w-full px-3.5 py-2 rounded-2xl border border-slate-200/80 text-xs bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !key.trim()}
              className="px-5 py-2 bg-[#141416] hover:bg-black text-white text-xs font-semibold rounded-full shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

