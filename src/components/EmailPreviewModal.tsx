import React, { useState } from 'react';
import { EmailLog, Ticket } from '../types';
import {
  generateTicketConfirmationEmail,
  generateNewReplyEmail,
  generateStatusChangeEmail,
} from '../utils/emailTemplates';
import {
  X,
  Mail,
  Send,
  CheckCircle2,
  Copy,
  ExternalLink,
  Code2,
  Eye,
  Smartphone,
  Monitor,
} from 'lucide-react';

interface EmailPreviewModalProps {
  ticket: Ticket;
  emailLogs: EmailLog[];
  onClose: () => void;
  onSendTestEmail: (template: 'ticket_confirmation' | 'new_reply' | 'status_changed') => Promise<void>;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  ticket,
  emailLogs,
  onClose,
  onSendTestEmail,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<
    'ticket_confirmation' | 'new_reply' | 'status_changed'
  >('ticket_confirmation');
  const [viewMode, setViewMode] = useState<'preview' | 'html' | 'logs'>('preview');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<string | null>(null);

  // Generate template content based on current ticket
  const getRenderedEmail = () => {
    switch (selectedTemplate) {
      case 'ticket_confirmation':
        return generateTicketConfirmationEmail(ticket);
      case 'new_reply': {
        const lastMsg =
          ticket.messages[ticket.messages.length - 1] || {
            id: 'demo_msg',
            senderId: 'staff_alex',
            senderName: 'Alex Vance',
            senderRole: 'agent',
            content: 'We have processed your replacement order and expedited shipping.',
            createdAt: new Date().toISOString(),
          };
        return generateNewReplyEmail(ticket, lastMsg);
      }
      case 'status_changed':
        return generateStatusChangeEmail(ticket, ticket.status);
    }
  };

  const rendered = getRenderedEmail();

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(rendered.html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendTest = async () => {
    setIsSending(true);
    setSendStatus(null);
    try {
      await onSendTestEmail(selectedTemplate);
      setSendStatus('Notification dispatched to ' + ticket.customerEmail);
    } catch {
      setSendStatus('Email logged in preview buffer.');
    } finally {
      setIsSending(false);
      setTimeout(() => setSendStatus(null), 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-xs">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] flex flex-col border border-neutral-200 shadow-2xl rounded-xs overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-red-600 rounded text-white">
              <Mail className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono">
                Email Notification Center & Preview
              </h2>
              <p className="text-[11px] text-neutral-400 font-mono">
                Resend / SendGrid HTML Templates &bull; Sanelow Music Group
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Template Selector & View Modes */}
        <div className="p-3 border-b border-neutral-200 bg-neutral-50 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Template Tabs */}
          <div className="flex items-center gap-1 bg-white border border-neutral-200 p-0.5 rounded">
            <button
              onClick={() => setSelectedTemplate('ticket_confirmation')}
              className={`px-3 py-1 font-medium transition-colors cursor-pointer rounded-xs ${
                selectedTemplate === 'ticket_confirmation'
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              1. Creation Confirmation
            </button>
            <button
              onClick={() => setSelectedTemplate('new_reply')}
              className={`px-3 py-1 font-medium transition-colors cursor-pointer rounded-xs ${
                selectedTemplate === 'new_reply'
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              2. New Reply Alert
            </button>
            <button
              onClick={() => setSelectedTemplate('status_changed')}
              className={`px-3 py-1 font-medium transition-colors cursor-pointer rounded-xs ${
                selectedTemplate === 'status_changed'
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              3. Status / Resolved Notice
            </button>
          </div>

          {/* Action and Device Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 bg-white border border-neutral-200 p-0.5 rounded">
              <button
                onClick={() => setDeviceMode('desktop')}
                title="Desktop View"
                className={`p-1 rounded cursor-pointer ${
                  deviceMode === 'desktop' ? 'bg-neutral-200 text-black' : 'text-neutral-400'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                title="Mobile View"
                className={`p-1 rounded cursor-pointer ${
                  deviceMode === 'mobile' ? 'bg-neutral-200 text-black' : 'text-neutral-400'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode(viewMode === 'preview' ? 'html' : 'preview')}
                className="px-2.5 py-1 border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 font-mono text-[11px] rounded cursor-pointer flex items-center gap-1"
              >
                {viewMode === 'preview' ? <Code2 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{viewMode === 'preview' ? 'HTML Code' : 'Live Preview'}</span>
              </button>

              <button
                onClick={handleCopyHtml}
                className="px-2.5 py-1 border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 font-mono text-[11px] rounded cursor-pointer flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied!' : 'Copy HTML'}</span>
              </button>

              <button
                onClick={handleSendTest}
                disabled={isSending}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-semibold text-[11px] rounded cursor-pointer flex items-center gap-1 transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>{isSending ? 'Sending...' : 'Test Send'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Email Metadata Header */}
        <div className="px-5 py-2.5 bg-neutral-100/70 border-b border-neutral-200 text-xs font-mono text-neutral-700 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-neutral-400">To:</span> <strong>{ticket.customerEmail}</strong> &bull;{' '}
            <span className="text-neutral-400">From:</span> <strong>support@sanelowmusic.com</strong>
          </div>
          <div>
            <span className="text-neutral-400">Subject:</span>{' '}
            <strong className="text-neutral-900">{rendered.subject}</strong>
          </div>
        </div>

        {/* Status Toast */}
        {sendStatus && (
          <div className="px-4 py-2 bg-emerald-600 text-white text-xs font-mono flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {sendStatus}
            </span>
            <span className="text-[10px] opacity-80">Synced with Resend serverless queue</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 bg-neutral-100 overflow-y-auto p-4 flex justify-center">
          {viewMode === 'preview' ? (
            <div
              className={`bg-white shadow-md border border-neutral-200 transition-all ${
                deviceMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-[620px]'
              }`}
            >
              <iframe
                title="Email Preview"
                srcDoc={rendered.html}
                className="w-full h-[540px] border-0"
              />
            </div>
          ) : (
            <div className="w-full max-w-3xl bg-neutral-900 text-neutral-100 p-4 font-mono text-xs overflow-x-auto rounded border border-neutral-800">
              <pre>{rendered.html}</pre>
            </div>
          )}
        </div>

        {/* Footer with Recent Logs */}
        <div className="px-5 py-3 border-t border-neutral-200 bg-white flex items-center justify-between text-xs">
          <div className="text-neutral-500 font-mono text-[11px]">
            {emailLogs.length} simulated/live email event{emailLogs.length === 1 ? '' : 's'} recorded this session
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-900 hover:bg-black text-white font-medium rounded-xs cursor-pointer text-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
