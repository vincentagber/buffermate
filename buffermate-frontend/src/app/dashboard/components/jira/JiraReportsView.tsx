'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  BarChart3,
  Flame,
  CheckCircle2,
  Clock,
  Layers,
  Users
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { JiraProject, JiraReportSummary } from './types';

interface JiraReportsViewProps {
  project: JiraProject;
}

export default function JiraReportsView({ project }: JiraReportsViewProps) {
  const [reportType, setReportType] = useState<'burndown' | 'velocity' | 'summary'>('burndown');
  const [burndownData, setBurndownData] = useState<any>(null);
  const [velocityData, setVelocityData] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<JiraReportSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [project.id]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [burnRes, velRes, sumRes] = await Promise.all([
        fetch(`/api/jira/projects/${project.id}/reports/burndown`),
        fetch(`/api/jira/projects/${project.id}/reports/velocity`),
        fetch(`/api/jira/projects/${project.id}/reports/summary`),
      ]);

      const [burnJson, velJson, sumJson] = await Promise.all([
        burnRes.json().catch(() => ({})),
        velRes.json().catch(() => ({})),
        sumRes.json().catch(() => ({})),
      ]);

      if (burnJson.success) setBurndownData(burnJson.data);
      if (velJson.success) setVelocityData(velJson.data);
      if (sumJson.success) setSummaryData(sumJson.data);
    } catch (e) {
      console.error('Failed to load reports:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Report Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center space-x-1">
          {[
            { id: 'burndown', label: 'Sprint Burndown', icon: Flame },
            { id: 'velocity', label: 'Velocity Chart', icon: BarChart3 },
            { id: 'summary', label: 'Workload & Distribution', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setReportType(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  reportType === tab.id
                    ? 'bg-[#141416] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {summaryData && (
          <div className="flex items-center space-x-3 text-xs font-mono font-bold text-slate-500">
            <span>Points: {summaryData.done_story_points} / {summaryData.total_story_points}</span>
            <span className="text-emerald-600">({summaryData.completion_percentage}%)</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-slate-400">Loading agile metrics...</div>
      ) : (
        <>
          {/* 1. Burndown Chart */}
          {reportType === 'burndown' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {burndownData?.sprint?.name || 'Active Sprint'} Burndown
                  </h3>
                  <p className="text-xs text-slate-500">
                    Remaining story points vs ideal burn line ({burndownData?.total_committed_points || 0} pts committed)
                  </p>
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={burndownData?.burndown_series || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '12px', fontSize: '11px', border: 'none' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line
                      type="monotone"
                      dataKey="ideal"
                      name="Guideline (Ideal)"
                      stroke="#94A3B8"
                      strokeDasharray="4 4"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      name="Remaining (Actual)"
                      stroke="#2563EB"
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 2. Velocity Chart */}
          {reportType === 'velocity' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Sprint Velocity
                  </h3>
                  <p className="text-xs text-slate-500">
                    Committed vs completed story points across past sprints. Average Velocity: {velocityData?.average_velocity || 0} pts/sprint
                  </p>
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={velocityData?.velocity_series || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="sprint" tick={{ fontSize: 10, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1E293B', color: '#fff', borderRadius: '12px', fontSize: '11px', border: 'none' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="committed" name="Committed Points" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completed" name="Completed Points" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 3. Workload & Breakdown */}
          {reportType === 'summary' && summaryData && (
            <div className="space-y-6">
              {/* Assignee Workload */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Team Workload Distribution</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3 rounded-l-xl">Assignee</th>
                        <th className="p-3">Assigned Issues</th>
                        <th className="p-3">Story Points</th>
                        <th className="p-3">Est. Hours</th>
                        <th className="p-3 rounded-r-xl">Logged Hours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {summaryData.assignee_workload.map((w, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-800">{w.assignee}</td>
                          <td className="p-3 font-semibold text-slate-600">{w.count}</td>
                          <td className="p-3 font-mono font-bold text-blue-600">{w.story_points}</td>
                          <td className="p-3 font-mono text-slate-500">{w.estimated_hours}h</td>
                          <td className="p-3 font-mono font-bold text-emerald-600">{w.logged_hours}h</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status and Priority Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Status Breakdown</h4>
                  <div className="space-y-2">
                    {Object.entries(summaryData.status_distribution).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between text-xs">
                        <span className="capitalize text-slate-600 font-medium">{status.replace('_', ' ')}</span>
                        <span className="font-mono font-bold text-slate-900 px-2 py-0.5 bg-slate-100 rounded-md">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Priority Distribution</h4>
                  <div className="space-y-2">
                    {Object.entries(summaryData.priority_distribution).map(([pri, count]) => (
                      <div key={pri} className="flex items-center justify-between text-xs">
                        <span className="capitalize text-slate-600 font-medium">{pri} Priority</span>
                        <span className="font-mono font-bold text-slate-900 px-2 py-0.5 bg-slate-100 rounded-md">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

