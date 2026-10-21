'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  X,
  Check,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { triggerConfetti } from '@/components/ui/Confetti';

interface FlowAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRemindersSent?: (count: number) => void;
}

export default function FlowAssistModal({
  isOpen,
  onClose,
  onRemindersSent,
}: FlowAssistModalProps) {
  const [clients, setClients] = useState([
    {
      id: 'c1',
      name: 'Jessica Vance',
      lastTreatment: 'Botox (Full Forehead)',
      lastDate: '12 wks ago',
      recommended: 'Botox Touch-up',
      estRevenue: '$380',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      selected: true,
      draft: 'Hi Jessica, your Botox results from July are likely ready for a soft refresh! We have an opening with Dr. Ines this Thursday at 3 PM if you’d like to keep your smooth glow.',
    },
    {
      id: 'c2',
      name: 'Marcus Sterling',
      lastTreatment: 'Microneedling RF',
      lastDate: '6 wks ago',
      recommended: 'Session #2 of 3',
      estRevenue: '$650',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      selected: true,
      draft: 'Hi Marcus, following up on your RF treatment! To maximize collagen remodeling, session 2 is best scheduled between weeks 6-8. Would Friday afternoon work for you?',
    },
    {
      id: 'c3',
      name: 'Elena Rostova',
      lastTreatment: 'HydraFacial Deluxe',
      lastDate: '4 wks ago',
      recommended: 'Monthly HydraFacial',
      estRevenue: '$225',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      selected: true,
      draft: 'Hi Elena, time for your monthly pore cleanse and peptide infusion! You still have 1 facial credit on your Silver membership ready to use.',
    },
    {
      id: 'c4',
      name: 'Amara Okafor',
      lastTreatment: 'Lip Filler Subtle',
      lastDate: '9 mos ago',
      recommended: 'Volume Refresh',
      estRevenue: '$550',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80',
      selected: true,
      draft: 'Hi Amara, hope you’ve loved your lips this year! If you’d like to top up before the holidays, Dr. Ortiz has a few appointments open next week.',
    },
    {
      id: 'c5',
      name: 'Lucas Meyer',
      lastTreatment: 'Clear + Brilliant Laser',
      lastDate: '8 wks ago',
      recommended: 'Laser Maintenance',
      estRevenue: '$420',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80',
      selected: true,
      draft: 'Hi Lucas, maintaining your skin tone is easiest with a quick autumn touch-up. Leo Park has a Tuesday laser slot available with your name on it!',
    },
    {
      id: 'c6',
      name: 'Victoria Song',
      lastTreatment: 'Chemical Peel Glow',
      lastDate: '5 wks ago',
      recommended: 'Hydration Recovery',
      estRevenue: '$195',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&auto=format&fit=crop&q=80',
      selected: true,
      draft: 'Hi Victoria, checking in on your post-peel barrier! Would you like to pair your check-in with a calming LED therapy session this Wednesday?',
    },
  ]);

  if (!isOpen) return null;

  const toggleClient = (id: string) => {
    setClients(clients.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c)));
  };

  const selectedCount = clients.filter((c) => c.selected).length;
  const totalRevenue = clients
    .filter((c) => c.selected)
    .reduce((acc, c) => acc + parseInt(c.estRevenue.replace('$', '')), 0);

  const handleSendAll = () => {
    triggerConfetti();
    if (onRemindersSent) onRemindersSent(selectedCount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EAF6DA] text-[#46731B] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#161616]">Flow Assist · Rebooking Radar</h3>
              <p className="text-xs text-slate-500">
                6 clients due for treatment refresh this week · ~${totalRevenue.toLocaleString()} pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Client List */}
        <div className="overflow-y-auto py-4 space-y-3 flex-1 pr-1">
          {clients.map((c) => (
            <div
              key={c.id}
              onClick={() => toggleClient(c.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                c.selected
                  ? 'bg-purple-50/40 border-purple-200'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                      c.selected ? 'bg-[#161616] border-[#161616] text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {c.selected && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                  />

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      {c.lastTreatment} · <span className="font-semibold">{c.lastDate}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-900">{c.estRevenue}</span>
                  <span className="block text-[10px] text-purple-700 font-semibold">{c.recommended}</span>
                </div>
              </div>

              {/* AI Draft preview */}
              <div className="mt-2.5 pt-2.5 border-t border-slate-200/50 text-[11px] text-slate-600 bg-white/70 p-2.5 rounded-xl border border-slate-100 font-mono">
                {c.draft}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-900">{selectedCount}</span> of 6 selected (
            <span className="font-bold text-emerald-700">${totalRevenue.toLocaleString()}</span>)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              onClick={handleSendAll}
              disabled={selectedCount === 0}
              className="bg-[#161616] hover:bg-black disabled:opacity-40 text-white text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send {selectedCount} Reminders</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
