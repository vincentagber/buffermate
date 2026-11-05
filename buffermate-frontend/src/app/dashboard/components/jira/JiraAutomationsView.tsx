'use client';

import React, { useState } from 'react';
import { Zap, Play, CheckCircle2, AlertCircle, Clock, Plus, Sparkles } from 'lucide-react';
import { JiraProject } from './types';

interface JiraAutomationsViewProps {
  project: JiraProject;
}

export default function JiraAutomationsView({ project }: JiraAutomationsViewProps) {
  const [rules, setRules] = useState([
    {
      id: 'rule-1',
      name: 'Auto-Assign Bugs to Project Lead',
      description: 'When a new bug is reported without an assignee, automatically assign to Alex Morgan.',
      trigger: 'When: Issue Created',
      condition: 'If: Issue Type is Bug AND Assignee is Unassigned',
      action: 'Then: Assign to Alex Morgan & Add triage comment',
      is_active: true,
      execution_count: 3,
      last_executed: '2 days ago',
    },
    {
      id: 'rule-2',
      name: 'Auto-Timestamp Done Issues',
      description: 'When an issue moves to Done, record completion timestamp and resolution.',
      trigger: 'When: Status changed to Done',
      condition: 'If: All Subtasks are resolved',
      action: 'Then: Set resolution = Done & Record completed_at',
      is_active: true,
      execution_count: 12,
      last_executed: '8 hours ago',
    },
    {
      id: 'rule-3',
      name: 'Overdue Deadline Warning Notification',
      description: 'When issue due date passes, flag task as blocked and notify assignee.',
      trigger: 'When: Scheduled due date check',
      condition: 'If: due_date < NOW() AND status != Done',
      action: 'Then: Emit alert notification to assignee',
      is_active: true,
      execution_count: 5,
      last_executed: 'Yesterday',
    },
  ]);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_active: !r.is_active } : r))
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Automation Rules Engine</h3>
          <p className="text-xs text-slate-500">Event-driven automation rules based on Trigger → Condition → Action</p>
        </div>

        <button
          type="button"
          onClick={() => alert('Custom rule builder dialog opened')}
          className="px-4 py-1.5 bg-[#141416] hover:bg-black text-white rounded-full text-xs font-semibold shadow-2xs transition-all flex items-center space-x-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Rule</span>
        </button>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/60 shadow-2xs">
                  <Zap className="w-4 h-4" />
                </div>

                {/* Toggle */}
                <button
                  type="button"
                  onClick={() => toggleRule(rule.id)}
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

              <div>
                <h4 className="text-xs font-bold text-slate-900">{rule.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{rule.description}</p>
              </div>

              {/* Trigger -> Condition -> Action flow pills */}
              <div className="space-y-1.5 pt-1">
                <div className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-[10px] font-mono font-semibold">
                  {rule.trigger}
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-[10px] font-mono font-semibold">
                  {rule.condition}
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-mono font-semibold">
                  {rule.action}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>{rule.execution_count} executions</span>
              <span>Last: {rule.last_executed}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

