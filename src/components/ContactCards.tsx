import React, { useState } from 'react';
import { Mail, HelpCircle, Building2, ArrowRight, Check, Copy } from 'lucide-react';
import { TicketCategory } from '../types';

interface ContactCardsProps {
  onOpenTicketForm: (prefillCategory?: TicketCategory) => void;
  onNavigateToFAQ: () => void;
}

export const ContactCards: React.FC<ContactCardsProps> = ({
  onOpenTicketForm,
  onNavigateToFAQ,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('support@sanelowmusic.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section className="mb-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Email Support */}
        <div
          onClick={() => onOpenTicketForm('General Inquiry')}
          className="group cursor-pointer bg-white border border-neutral-200 p-6 transition-all duration-200 hover:border-neutral-400 hover:shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-neutral-100 text-black border border-neutral-200 group-hover:border-red-600 transition-colors">
                <Mail className="w-5 h-5 text-red-600" />
              </div>
              <span className="font-mono text-xs text-neutral-500">2–4h SLA</span>
            </div>

            <h3 className="text-lg font-bold text-black mb-2 group-hover:text-red-600 transition-colors">
              Email Support
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              Direct line to our customer care team for order inquiries, split shipments, and urgent tour gear.
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <span className="font-mono text-xs text-neutral-800 font-medium">
              support@sanelowmusic.com
            </span>
            <button
              onClick={handleCopyEmail}
              title="Copy support email"
              className="cursor-pointer text-xs text-neutral-500 hover:text-red-600 flex items-center gap-1 font-mono transition-colors"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-red-600" />
                  <span className="text-red-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card 2: General Merch Inquiries */}
        <div
          onClick={onNavigateToFAQ}
          className="group cursor-pointer bg-white border border-neutral-200 p-6 transition-all duration-200 hover:border-neutral-400 hover:shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-neutral-100 text-black border border-neutral-200 group-hover:border-red-600 transition-colors">
                <HelpCircle className="w-5 h-5 text-black" />
              </div>
              <span className="font-mono text-xs text-neutral-500">Instant Answers</span>
            </div>

            <h3 className="text-lg font-bold text-black mb-2 group-hover:text-red-600 transition-colors">
              General Merch Inquiries
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              Detailed garment weight specs, sizing charts, washing guides, and upcoming drops schedule.
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center text-xs font-semibold text-black group-hover:text-red-600 transition-colors">
            <span>Explore Merch FAQ & Sizing</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Card 3: Wholesale / Label Demos */}
        <div
          onClick={() => onOpenTicketForm('Wholesale / Bulk')}
          className="group cursor-pointer bg-white border border-neutral-200 p-6 transition-all duration-200 hover:border-neutral-400 hover:shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-neutral-100 text-black border border-neutral-200 group-hover:border-red-600 transition-colors">
                <Building2 className="w-5 h-5 text-black" />
              </div>
              <span className="font-mono text-xs text-neutral-500">B2B & Artists</span>
            </div>

            <h3 className="text-lg font-bold text-black mb-2 group-hover:text-red-600 transition-colors">
              Wholesale & Label Demos
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              Custom screenprint runs, touring merchandise consignment, vinyl pressing, and record label demos.
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center text-xs font-semibold text-black group-hover:text-red-600 transition-colors">
            <span>Submit Wholesale Request</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </section>
  );
};
