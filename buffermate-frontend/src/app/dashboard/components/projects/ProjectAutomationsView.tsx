'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Zap,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Sparkles,
  Trash2,
  History,
  X,
  Check,
  RotateCw
} from 'lucide-react';
import { Project } from './types';
import { triggerConfetti } from '@/components/ui/Confetti';

interface ProjectAutomationsViewProps {
  project: Project;
}

interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  trigger_event: string;
  conditions?: any[];
  actions?: any[];
  is_active: boolean;
  execution_count: number;
  last_executed_at?: string;
  created_at?: string;
}

interface AutomationExecution {
  id: string;
  rule_id: string;
  trigger_payload: any;
  status: string;
  execution_log: string;
  executed_at: string;
}

export default function ProjectAutomationsView({ project }: ProjectAutomationsViewProps) {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [executions, setExecutions] = useState<AutomationExecution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rules' | 'audit'>('rules');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [testingRuleId, setTestingRuleId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // New Rule Form State
  const [ruleName, setRuleName] = useState('');
  const [ruleDesc, setRuleDesc] = useState('');
  const [triggerEvent, setTriggerEvent] = useState('issue_created');
  const [conditionField, setConditionField] = useState('type');
  const [conditionOperator, setConditionOperator] = useState('equals');
  const [conditionValue, setConditionValue] = useState('bug');
  const [actionType, setActionType] = useState('assign_issue');
  const [actionValue, setActionValue] = useState('Alex Morgan');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    fetchAutomations();
  }, [project.id]);

  const fetchAutomations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/automations`);
      const data = await res.json();
      if (data.success && data.data) {
        setRules(data.data.rules || []);
        setExecutions(data.data.executions || []);
      }
    } catch (e) {
      console.error('Failed to load project automations:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRule = async (ruleId: string) => {
    try {
      const res = await fetch(`/api/projects/${project.id}/automations/${ruleId}/toggle`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (data.success && data.data) {
        setRules((prev) =>
          prev.map((r) => (r.id === ruleId ? { ...r, is_active: data.data.is_active } : r))
        );
        showToast(data.message);
      }
    } catch (e) {
      console.error('Failed to toggle rule:', e);
    }
  };

  const handleTestRunRule = async (ruleId: string) => {
    setTestingRuleId(ruleId);
    try {
      const res = await fetch(`/api/projects/${project.id}/automations/${ruleId}/test`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success && data.data) {
        setRules((prev) =>
          prev.map((r) => (r.id === ruleId ? data.data.rule : r))
        );
        setExecutions((prev) => [data.data.execution, ...prev]);
        triggerConfetti();
        showToast(data.message || 'Rule executed successfully!');
      } else {
        showToast(data.message || 'Test run failed.');
      }
    } catch (e) {
      console.error('Failed to test rule:', e);
    } finally {
      setTestingRuleId(null);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this automation rule?')) return;
    try {
      const res = await fetch(`/api/projects/${project.id}/automations/${ruleId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setRules((prev) => prev.filter((r) => r.id !== ruleId));
        showToast('Automation rule deleted.');
      }
    } catch (e) {
      console.error('Failed to delete rule:', e);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    setIsSubmitting(true);
    try {
      let actions = [];
      if (actionType === 'assign_issue') {
        actions.push({ action: 'assign_issue', user_id: actionValue });
      } else if (actionType === 'set_status') {
        actions.push({ action: 'set_status', status: actionValue });
      } else if (actionType === 'add_comment') {
        actions.push({ action: 'add_comment', comment: actionValue });
      } else {
        actions.push({ action: 'set_resolution', resolution: 'Done' });
      }

      const res = await fetch(`/api/projects/${project.id}/automations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ruleName.trim(),
          description: ruleDesc.trim() || null,
          trigger_event: triggerEvent,
          conditions: [
            {
              field: conditionField,
              operator: conditionOperator,
              value: conditionValue,
            },
          ],
          actions,
          is_active: true,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setRules([data.data, ...rules]);
        setIsBuilderOpen(false);
        setRuleName('');
        setRuleDesc('');
        triggerConfetti();
        showToast('New project automation rule created & activated! ⚡');
      }
    } catch (e) {
      console.error('Failed to create rule:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatEventLabel = (evt: string) => {
    switch (evt) {
      case 'issue_created':
        return 'When: Issue Created';
      case 'status_changed':
        return 'When: Status Changed';
      case 'assignee_changed':
        return 'When: Assignee Changed';
      case 'comment_added':
        return 'When: Comment Added';
      default:
        return `When: ${evt}`;
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141416] text-white px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Rule Builder Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Automation Rules Engine</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              When → If → Then
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Event-driven triggers, conditional filters, and automated issue handoffs
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Tab Switcher: Rules vs Audit Log */}
          <div className="flex bg-slate-100 p-0.5 rounded-full text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                activeTab === 'rules'
                  ? 'bg-[#141416] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rules ({rules.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-[#141416] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Audit Log ({executions.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsBuilderOpen(true)}
            className="px-4 py-1.5 bg-[#141416] hover:bg-black text-white rounded-full text-xs font-semibold shadow-2xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Rule</span>
          </button>
        </div>
      </div>

      {activeTab === 'rules' ? (
        /* Rules Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-xs transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/60 shadow-2xs">
                    <Zap className="w-4 h-4" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleTestRunRule(rule.id)}
                      disabled={testingRuleId === rule.id}
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center space-x-1 transition-all cursor-pointer disabled:opacity-50"
                      title="Test-run this rule against latest project issue"
                    >
                      <Play className={`w-3 h-3 ${testingRuleId === rule.id ? 'animate-spin' : ''}`} />
                      <span>{testingRuleId === rule.id ? 'Running...' : 'Run Now'}</span>
                    </button>

                    {/* Active Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleRule(rule.id)}
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                        rule.is_active ? 'bg-slate-900' : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                          rule.is_active ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900">{rule.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {rule.description || 'Custom event automation rule.'}
                  </p>
                </div>

                {/* When -> If -> Then Flow Badges */}
                <div className="space-y-1.5 pt-1">
                  <div className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-[10px] font-mono font-semibold">
                    {formatEventLabel(rule.trigger_event)}
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-[10px] font-mono font-semibold">
                    If: {rule.conditions?.[0]?.field || 'Issue'} {rule.conditions?.[0]?.operator || 'is'} {rule.conditions?.[0]?.value || 'matched'}
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-mono font-semibold">
                    Then: {rule.actions?.[0]?.action?.replace(/_/g, ' ') || 'Execute action'} ({rule.actions?.[0]?.user_id || rule.actions?.[0]?.status || 'applied'})
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>{rule.execution_count} executions</span>
                <div className="flex items-center space-x-2">
                  <span>{rule.last_executed_at ? new Date(rule.last_executed_at).toLocaleDateString() : 'Never run'}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-slate-300 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                    title="Delete Rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {rules.length === 0 && !isLoading && (
            <div className="col-span-full bg-white rounded-3xl p-12 text-center text-xs text-slate-400 border border-slate-200/80">
              No automation rules created yet. Click "Create Rule" above to build your first workflow trigger!
            </div>
          )}
        </div>
      ) : (
        /* Audit Log Table */
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900">Recent Rule Executions</h4>
            <span className="text-xs text-slate-400 font-mono">{executions.length} logged runs</span>
          </div>

          <div className="divide-y divide-slate-100">
            {executions.map((exec) => (
              <div key={exec.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/70 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/60 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block">
                      {exec.execution_log}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Issue: {exec.trigger_payload?.work_item_key || 'Project'} · Status: {exec.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {new Date(exec.executed_at).toLocaleString()}
                </span>
              </div>
            ))}

            {executions.length === 0 && (
              <div className="p-12 text-center text-xs text-slate-400">
                No automation executions recorded yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Automation Rule Builder Modal */}
      {isBuilderOpen && mounted && createPortal(
        <div
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-xs font-sans animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsBuilderOpen(false);
          }}
        >
          <div
            className="min-h-full flex items-center justify-center p-3 sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsBuilderOpen(false);
            }}
          >
            <div
              className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 mx-auto flex flex-col max-h-[92dvh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/70">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">Create Automation Rule</h3>
                  <p className="text-[11px] text-slate-500">Configure trigger, condition, and execution action</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBuilderOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-900 flex items-center justify-center cursor-pointer shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="p-5 space-y-4 overflow-y-auto flex-1 pb-10">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Rule Name</label>
                <input
                  type="text"
                  required
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g. Auto-assign high priority bugs to QA lead"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs bg-slate-50 focus:bg-white text-slate-900 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Description</label>
                <input
                  type="text"
                  value={ruleDesc}
                  onChange={(e) => setRuleDesc(e.target.value)}
                  placeholder="Brief summary of what this automation executes"
                  className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 text-xs bg-slate-50 focus:bg-white text-slate-900"
                />
              </div>

              {/* Step 1: WHEN Trigger */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
                <span className="text-[10px] font-bold uppercase text-blue-700 tracking-wider block">1. When (Trigger)</span>
                <select
                  value={triggerEvent}
                  onChange={(e) => setTriggerEvent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-blue-200 text-xs font-bold bg-white text-blue-900 cursor-pointer"
                >
                  <option value="issue_created">Issue is created</option>
                  <option value="status_changed">Workflow status changes</option>
                  <option value="assignee_changed">Assignee is updated</option>
                  <option value="comment_added">New comment is posted</option>
                </select>
              </div>

              {/* Step 2: IF Condition */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <span className="text-[10px] font-bold uppercase text-amber-700 tracking-wider block">2. If (Condition)</span>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={conditionField}
                    onChange={(e) => setConditionField(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl border border-amber-200 text-xs font-semibold bg-white text-amber-900 cursor-pointer"
                  >
                    <option value="type">Issue Type</option>
                    <option value="priority">Priority</option>
                    <option value="status">Status</option>
                  </select>

                  <select
                    value={conditionOperator}
                    onChange={(e) => setConditionOperator(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl border border-amber-200 text-xs font-semibold bg-white text-amber-900 cursor-pointer"
                  >
                    <option value="equals">equals</option>
                    <option value="not_equals">does not equal</option>
                  </select>

                  <input
                    type="text"
                    value={conditionValue}
                    onChange={(e) => setConditionValue(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl border border-amber-200 text-xs font-semibold bg-white text-amber-900"
                    placeholder="e.g. bug, high"
                  />
                </div>
              </div>

              {/* Step 3: THEN Action */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider block">3. Then (Action)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value)}
                    className="px-2.5 py-2 rounded-xl border border-emerald-200 text-xs font-bold bg-white text-emerald-900 cursor-pointer"
                  >
                    <option value="assign_issue">Assign issue to</option>
                    <option value="set_status">Transition status to</option>
                    <option value="add_comment">Add automated comment</option>
                    <option value="set_resolution">Set resolution to Done</option>
                  </select>

                  <input
                    type="text"
                    value={actionValue}
                    onChange={(e) => setActionValue(e.target.value)}
                    className="px-2.5 py-2 rounded-xl border border-emerald-200 text-xs font-semibold bg-white text-emerald-900"
                    placeholder="e.g. Alex Morgan or in_progress"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsBuilderOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#141416] hover:bg-black text-white text-xs font-semibold rounded-full shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving Rule...' : 'Save & Enable Rule'}
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
