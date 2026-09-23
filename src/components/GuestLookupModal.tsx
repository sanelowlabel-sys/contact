import React, { useState } from 'react';
import { Ticket } from '../types';
import { X, Search, AlertCircle, ArrowRight } from 'lucide-react';
import { SanelowLogo } from './SanelowLogo';

interface GuestLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
}

export const GuestLookupModal: React.FC<GuestLookupModalProps> = ({
  isOpen,
  onClose,
  tickets,
  onSelectTicket,
}) => {
  const [ticketId, setTicketId] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formattedInputId = ticketId.trim().toUpperCase();
    const targetId = formattedInputId.startsWith('#') ? formattedInputId : `#${formattedInputId}`;

    const match = tickets.find(
      (t) =>
        t.id.toUpperCase() === targetId &&
        t.customerEmail.toLowerCase() === email.trim().toLowerCase()
    );

    if (match) {
      onSelectTicket(match);
      onClose();
    } else {
      setError(
        `No ticket found matching ${targetId} and email ${email}. Please check your order confirmation email.`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-neutral-200 w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-5">
          <div className="flex items-center gap-2.5">
            <SanelowLogo size={22} color="#DC2626" className="shrink-0" />
            <h3 className="text-base font-extrabold text-black uppercase">
              Sanelow Ticket Lookup
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-black cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
          Enter your Ticket ID (e.g. <strong className="font-mono text-black">#TK-8492</strong>) and the email address used during ticket submission.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLookup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-black mb-1">
              Ticket ID
            </label>
            <input
              type="text"
              required
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="#TK-8492"
              className="w-full px-3 py-2 text-xs font-mono border border-neutral-200 bg-white text-black focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-black mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., jordan.mercer@gmail.com"
              className="w-full px-3 py-2 text-xs border border-neutral-200 bg-white text-black focus:border-red-600 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 text-xs text-neutral-600 hover:text-black border border-neutral-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 flex items-center gap-1.5"
            >
              <span>Locate Ticket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Demo Hint */}
        <div className="mt-5 pt-3 border-t border-neutral-100 text-[11px] text-neutral-400">
          Demo hint: try <strong className="font-mono text-neutral-700">#TK-8492</strong> and{' '}
          <strong className="font-mono text-neutral-700">jordan.mercer@gmail.com</strong>
        </div>
      </div>
    </div>
  );
};
