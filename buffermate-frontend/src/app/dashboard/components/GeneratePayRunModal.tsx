'use client';

import React, { useState } from 'react';
import { X, ChevronRight, CheckCircle2, ShieldCheck, DollarSign, Calendar, Users, FileSpreadsheet } from 'lucide-react';
import ChevronStepper, { ChevronStepItem } from '@/components/ui/ChevronStepper';
import { triggerConfetti } from '@/components/ui/Confetti';

interface GeneratePayRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (runData: any) => void;
}

export default function GeneratePayRunModal({
  isOpen,
  onClose,
  onSuccess,
}: GeneratePayRunModalProps) {
  const [activeStep, setActiveStep] = useState<number>(0);

  // Form State
  const [cycleTitle, setCycleTitle] = useState('November 2026 Monthly Payroll Run');
  const [periodStart, setPeriodStart] = useState('2026-11-01');
  const [periodEnd, setPeriodEnd] = useState('2026-11-30');
  const [scheduledPayDate, setScheduledPayDate] = useState('2026-11-28');
  
  // Step 2 details
  const [departmentScope, setDepartmentScope] = useState('All Departments (48 Staff)');
  const [payStructure, setPayStructure] = useState('Standard Salaried + Bonus Tier');
  const [includeAllowances, setIncludeAllowances] = useState(true);
  const [includeStatutory, setIncludeStatutory] = useState(true);

  if (!isOpen) return null;

  const steps: ChevronStepItem[] = [
    {
      id: 0,
      title: 'Select Period',
      subtitle: 'Dates & Run Title',
    },
    {
      id: 1,
      title: 'Details',
      subtitle: 'Scope & Headcount',
    },
    {
      id: 2,
      title: 'Verify',
      subtitle: 'Calculations & Audit',
    },
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      triggerConfetti();
      if (onSuccess) {
        onSuccess({
          cycleTitle,
          periodStart,
          periodEnd,
          scheduledPayDate,
          departmentScope,
          grossAmount: '₦5,330,000.00',
          netAmount: '₦4,650,000.00',
        });
      }
      onClose();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden animate-scale-up flex flex-col">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Generate Pay Run Cycle
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Automated computation of basic pay, allowances, statutory PAYE, loan deductions, and PF.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reusable Chevron Stepper Component Header */}
        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
          <ChevronStepper
            steps={steps}
            currentStep={activeStep}
            onChange={(stepId) => setActiveStep(Number(stepId))}
            variant="blue"
            size="md"
          />
        </div>

        {/* Modal Body / Active Step View */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {activeStep === 0 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Pay Run Cycle Title
                </label>
                <input
                  type="text"
                  value={cycleTitle}
                  onChange={(e) => setCycleTitle(e.target.value)}
                  placeholder="e.g. November 2026 Monthly Payroll Run"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-2xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Period Start
                  </label>
                  <input
                    type="date"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-2xs font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Period End
                  </label>
                  <input
                    type="date"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-2xs font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Scheduled Pay Date
                </label>
                <input
                  type="date"
                  value={scheduledPayDate}
                  onChange={(e) => setScheduledPayDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-2xs font-medium"
                />
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Department & Staff Scope
                </label>
                <select
                  value={departmentScope}
                  onChange={(e) => setDepartmentScope(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-2xs font-medium"
                >
                  <option value="All Departments (48 Staff)">All Departments (48 Staff)</option>
                  <option value="Executive & Management (8 Staff)">Executive & Management (8 Staff)</option>
                  <option value="Marketing & Growth (14 Staff)">Marketing & Growth (14 Staff)</option>
                  <option value="Clinical & Operations (26 Staff)">Clinical & Operations (26 Staff)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Salary & Commission Structure
                </label>
                <select
                  value={payStructure}
                  onChange={(e) => setPayStructure(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-2xs font-medium"
                >
                  <option value="Standard Salaried + Bonus Tier">Standard Salaried + Bonus Tier</option>
                  <option value="Hourly Contractors Only">Hourly Contractors Only</option>
                  <option value="Commission-Only Sales Reps">Commission-Only Sales Reps</option>
                </select>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAllowances}
                    onChange={(e) => setIncludeAllowances(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Include Housing & Transport Allowances</p>
                    <p className="text-[11px] text-slate-500">Automatically dispatches approved recurring allowances</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeStatutory}
                    onChange={(e) => setIncludeStatutory(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Statutory Tax & Pension Deductions (PAYE, PF)</p>
                    <p className="text-[11px] text-slate-500">Complies with 2026 state tax schedule</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Total Gross Payroll</span>
                  <p className="text-lg font-extrabold text-blue-950 mt-0.5">₦5,330,000.00</p>
                  <span className="text-[10px] text-blue-700 font-medium">48 active personnel</span>
                </div>

                <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Net Direct Disbursal</span>
                  <p className="text-lg font-extrabold text-emerald-950 mt-0.5">₦4,650,000.00</p>
                  <span className="text-[10px] text-emerald-700 font-medium">Auto bank settlement</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-600">Cycle Title:</span>
                  <span className="font-semibold text-slate-900">{cycleTitle}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-600">Payroll Period:</span>
                  <span className="font-semibold text-slate-900">{periodStart} to {periodEnd}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-600">Scheduled Pay Date:</span>
                  <span className="font-semibold text-slate-900">{scheduledPayDate}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Total Statutory Deductions:</span>
                  <span className="font-semibold text-rose-600">-₦680,000.00</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-emerald-50/50 border border-emerald-200/70 rounded-xl text-emerald-800 text-xs font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero calculation anomalies detected. Audit ready for executive authorization.</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-white flex items-center justify-between">
          <button
            onClick={activeStep === 0 ? onClose : handleBack}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
          >
            {activeStep === 0 ? 'Cancel' : 'Back'}
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#064E3B] hover:bg-[#043d2e] shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
          >
            <span>{activeStep === steps.length - 1 ? 'Authorize Pay Run' : 'Next Step'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

