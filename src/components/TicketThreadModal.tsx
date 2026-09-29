import React, { useState, useRef, useEffect } from 'react';
import {
  Ticket,
  TicketMessage,
  TicketAttachment,
  UserProfile,
  TicketStatus,
  TicketPriority,
  AgentInfo,
} from '../types';
import { AVAILABLE_AGENTS } from '../data/mockData';
import { realtimeManager } from '../services/realtimeService';
import { emailService } from '../services/emailService';
import { SanelowLogo } from './SanelowLogo';
import {
  X,
  Send,
  Paperclip,
  CheckCircle2,
  RotateCcw,
  Bell,
  BellOff,
  User,
  ShieldCheck,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Lock,
  Mail,
  UserCheck,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';

interface TicketThreadModalProps {
  ticket: Ticket;
  user: UserProfile;
  onClose: () => void;
  onSendMessage: (
    ticketId: string,
    content: string,
    attachments: TicketAttachment[],
    isInternal?: boolean
  ) => void;
  onUpdateStatus: (ticketId: string, status: TicketStatus) => void;
  onUpdatePriority?: (ticketId: string, priority: TicketPriority) => void;
  onAssignAgent?: (ticketId: string, agent: AgentInfo | null) => void;
  onOpenEmailPreview: (ticket: Ticket) => void;
}

export const TicketThreadModal: React.FC<TicketThreadModalProps> = ({
  ticket,
  user,
  onClose,
  onSendMessage,
  onUpdateStatus,
  onUpdatePriority,
  onAssignAgent,
  onOpenEmailPreview,
}) => {
  const [replyContent, setReplyContent] = useState('');
  const [replyAttachments, setReplyAttachments] = useState<TicketAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [typingAgentName, setTypingAgentName] = useState('Alex Vance');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isStaff = user.role === 'agent' || user.role === 'admin';
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket.messages.length, isAgentTyping]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() && replyAttachments.length === 0) return;

    onSendMessage(ticket.id, replyContent, replyAttachments, isStaff && isInternalNote);
    setReplyContent('');
    setReplyAttachments([]);
    setIsInternalNote(false);
    showToast(isInternalNote ? 'Internal staff note recorded.' : 'Message dispatched to thread.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setTimeout(() => {
      const newAtts: TicketAttachment[] = Array.from(files).map((f, i) => {
        const isImg = f.type.startsWith('image/');
        const url = isImg ? URL.createObjectURL(f) : undefined;
        return {
          id: `reply_att_${Date.now()}_${i}`,
          name: f.name,
          size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
          type: f.type,
          url: url,
          previewUrl: url,
          uploadedAt: new Date().toISOString(),
        };
      });
      setReplyAttachments((prev) => [...prev, ...newAtts]);
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 600);
  };

  const handleRemoveAttachment = (attId: string) => {
    setReplyAttachments((prev) => prev.filter((a) => a.id !== attId));
  };

  // Simulate real-time incoming response
  const handleSimulateRealtimeAgentReply = () => {
    const agent = ticket.assignedAgent || AVAILABLE_AGENTS[0];
    setTypingAgentName(agent.name);
    showToast(`Simulating live response from ${agent.name}...`);
    realtimeManager.simulateAgentResponse(
      ticket,
      agent,
      (typing) => setIsAgentTyping(typing),
      (msg) => {
        onSendMessage(ticket.id, msg.content, [], false);
        // Automatically send email notification
        emailService.sendNewReplyNotification(ticket, msg);
        showToast(`Real-time reply received from ${agent.name}.`);
      }
    );
  };

  const statusLifecycleOrder: TicketStatus[] = [
    'open',
    'in_progress',
    'pending_user',
    'resolved',
    'closed',
  ];

  const getStatusLabel = (st: TicketStatus) => {
    switch (st) {
      case 'open':
        return 'Open';
      case 'in_progress':
        return 'In Progress';
      case 'pending_user':
        return 'Pending User';
      case 'resolved':
        return 'Resolved';
      case 'closed':
        return 'Closed';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-xs">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] flex flex-col border border-neutral-200 shadow-2xl rounded-xs overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between bg-black text-white shrink-0">
          <div className="flex items-center gap-3">
            <SanelowLogo size={30} color="#DC2626" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-red-500">{ticket.id}</span>
                <span className="text-neutral-500">&bull;</span>
                <span className="text-xs text-neutral-300 font-mono">{ticket.category}</span>
                {ticket.orderNumber && (
                  <span className="font-mono text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">
                    {ticket.orderNumber}
                  </span>
                )}
              </div>
              <h2 className="text-sm font-bold text-white truncate max-w-md mt-0.5">
                {ticket.subject}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Email Preview button */}
            <button
              onClick={() => onOpenEmailPreview(ticket)}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono rounded flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Preview Resend / SendGrid HTML email for this ticket"
            >
              <Mail className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden sm:inline">Email Preview</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lifecycle Status & Controls Bar */}
        <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* Status Track */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="font-mono text-[10px] uppercase text-neutral-500 font-semibold mr-1">
              Lifecycle:
            </span>
            {statusLifecycleOrder.map((statusKey, index) => {
              const isActive = ticket.status === statusKey;
              const isPast =
                statusLifecycleOrder.indexOf(ticket.status) > index && ticket.status !== 'closed';

              return (
                <button
                  key={statusKey}
                  disabled={!isStaff && statusKey === 'closed'}
                  onClick={() => {
                    onUpdateStatus(ticket.id, statusKey);
                    showToast(`Ticket status updated to ${getStatusLabel(statusKey)}`);
                  }}
                  className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-xs transition-colors flex items-center gap-1 ${
                    isActive
                      ? statusKey === 'resolved'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-red-600 text-white shadow-xs'
                      : isPast
                      ? 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'
                      : 'bg-white border border-neutral-200 text-neutral-600 hover:border-black'
                  } ${!isStaff && statusKey === 'closed' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  <span>{getStatusLabel(statusKey)}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Staff Controls: Agent Assignment & Priority */}
          <div className="flex items-center gap-2">
            {isStaff && (
              <>
                {/* Agent Assignment */}
                <div className="flex items-center gap-1 font-mono text-xs">
                  <span className="text-[10px] text-neutral-500 uppercase">Agent:</span>
                  <select
                    value={ticket.assignedAgent?.id || 'unassigned'}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'unassigned') {
                        onAssignAgent?.(ticket.id, null);
                        showToast('Ticket marked unassigned');
                      } else {
                        const found = AVAILABLE_AGENTS.find((a) => a.id === val);
                        if (found) {
                          onAssignAgent?.(ticket.id, found);
                          showToast(`Assigned ticket to ${found.name}`);
                        }
                      }
                    }}
                    className="px-2 py-1 bg-white border border-neutral-300 text-xs font-mono rounded-xs focus:border-red-600 focus:outline-none"
                  >
                    <option value="unassigned">Unassigned</option>
                    {AVAILABLE_AGENTS.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Selector */}
                <div className="flex items-center gap-1 font-mono text-xs">
                  <span className="text-[10px] text-neutral-500 uppercase">Priority:</span>
                  <select
                    value={ticket.priority}
                    onChange={(e) => {
                      onUpdatePriority?.(ticket.id, e.target.value as TicketPriority);
                      showToast(`Priority set to ${e.target.value.toUpperCase()}`);
                    }}
                    className="px-2 py-1 bg-white border border-neutral-300 text-xs font-mono rounded-xs focus:border-red-600 focus:outline-none font-bold"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </>
            )}

            {/* Customer Quick Resolve / Reopen Button */}
            {!isStaff && (
              <div>
                {ticket.status === 'resolved' || ticket.status === 'closed' ? (
                  <button
                    onClick={() => {
                      onUpdateStatus(ticket.id, 'open');
                      showToast('Ticket reopened');
                    }}
                    className="px-3 py-1 bg-white border border-neutral-300 hover:border-black text-black font-semibold rounded-xs cursor-pointer flex items-center gap-1 font-mono text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reopen Ticket</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onUpdateStatus(ticket.id, 'resolved');
                      showToast('Ticket marked as resolved');
                    }}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xs cursor-pointer flex items-center gap-1 font-mono text-xs shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark as Resolved</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Toast alert banner */}
        {toastMessage && (
          <div className="px-4 py-2 bg-neutral-900 text-white text-xs font-mono flex items-center justify-between border-b border-neutral-800">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {toastMessage}
            </span>
            <span className="text-[10px] text-neutral-400">Synced across real-time brokers</span>
          </div>
        )}

        {/* Messages Scrollable Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-neutral-50/50">
          {/* Initial Ticket Description Box */}
          <div className="p-4 bg-white border border-neutral-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                  {ticket.customerName.charAt(0)}
                </span>
                <span className="text-xs font-bold text-black">{ticket.customerName}</span>
                <span className="text-[11px] font-mono text-neutral-400">
                  {ticket.customerEmail}
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                {new Date(ticket.createdAt).toLocaleString()}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>

            {/* Proof Attachments */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="mt-3 pt-3 border-t border-neutral-100">
                <div className="text-[10px] font-mono uppercase text-neutral-500 font-semibold mb-2">
                  Original Attachments ({ticket.attachments.length}):
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ticket.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-2 border border-neutral-200 bg-neutral-50 rounded flex items-center gap-2 text-xs"
                    >
                      {att.previewUrl ? (
                        <img
                          src={att.previewUrl}
                          alt={att.name}
                          className="w-10 h-10 object-cover rounded shrink-0 border border-neutral-200"
                        />
                      ) : (
                        <Paperclip className="w-5 h-5 text-neutral-400 shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-medium text-neutral-800 truncate">
                          {att.name}
                        </div>
                        <div className="text-[10px] font-mono text-neutral-400">{att.size}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sequential Messages */}
          {ticket.messages.map((msg) => {
            const isCustomer = msg.senderRole === 'customer';
            const isInternal = msg.isInternal;

            // If message is internal and current user is NOT staff, hide it!
            if (isInternal && !isStaff) {
              return null;
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  {!isCustomer && (
                    <img
                      src={msg.avatar || AVAILABLE_AGENTS[0].avatar}
                      alt={msg.senderName}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                  )}
                  <span className="text-xs font-bold text-neutral-800">{msg.senderName}</span>
                  <span className="font-mono text-[10px] text-neutral-400">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {isInternal && (
                    <span className="text-[9px] font-mono font-bold bg-amber-200 text-amber-900 px-1 py-0.2 rounded uppercase flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Staff Only
                    </span>
                  )}
                </div>

                <div
                  className={`max-w-xl p-3.5 rounded text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isInternal
                      ? 'bg-amber-50 border border-amber-300 text-amber-950 font-mono text-xs'
                      : isCustomer
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-white border border-neutral-200 text-neutral-800 shadow-xs'
                  }`}
                >
                  {msg.content}

                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-neutral-200/40 grid grid-cols-2 gap-2">
                      {msg.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="p-1.5 border border-neutral-200 bg-white/10 rounded flex items-center gap-2 text-xs"
                        >
                          {att.previewUrl && (
                            <img
                              src={att.previewUrl}
                              alt={att.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                          )}
                          <span className="truncate text-[11px]">{att.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Real-time Typing Indicator */}
          {isAgentTyping && (
            <div className="flex items-center gap-2 p-2 bg-neutral-100 rounded max-w-xs text-xs font-mono text-neutral-600 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>{typingAgentName} is typing a response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Composer & Real-time simulation bar */}
        <div className="p-4 border-t border-neutral-200 bg-white shrink-0 space-y-3">
          {/* Quick simulation helper for tester */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {isStaff && (
                <label className="flex items-center gap-1.5 cursor-pointer font-mono text-xs text-amber-800 bg-amber-50 px-2 py-1 border border-amber-200 rounded">
                  <input
                    type="checkbox"
                    checked={isInternalNote}
                    onChange={(e) => setIsInternalNote(e.target.checked)}
                    className="accent-amber-600"
                  />
                  <Lock className="w-3 h-3" />
                  <span>Post as Internal Staff Note</span>
                </label>
              )}
            </div>

            <button
              type="button"
              onClick={handleSimulateRealtimeAgentReply}
              className="text-[11px] font-mono text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Real-Time Agent Reply</span>
            </button>
          </div>

          {/* Pending Attachments preview */}
          {replyAttachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {replyAttachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-neutral-200 text-xs font-mono rounded"
                >
                  <Paperclip className="w-3 h-3 text-neutral-500" />
                  <span className="truncate max-w-[150px]">{att.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(att.id)}
                    className="text-neutral-400 hover:text-red-600 cursor-pointer ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Reply Form */}
          <form onSubmit={handleSend} className="flex gap-2">
            <div className="flex-1 relative">
              <textarea
                rows={2}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={
                  isInternalNote
                    ? 'Write an internal staff note (visible only to agents and admins)...'
                    : `Write a response as ${user.name}...`
                }
                className={`w-full p-2.5 text-xs sm:text-sm border focus:outline-none resize-none transition-colors ${
                  isInternalNote
                    ? 'border-amber-400 bg-amber-50/50 focus:border-amber-600'
                    : 'border-neutral-300 focus:border-red-600 bg-white'
                }`}
              />

              <div className="absolute right-2 bottom-2.5 flex items-center gap-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="p-1.5 text-neutral-400 hover:text-black rounded transition-colors cursor-pointer"
                  title="Attach file or photo proof"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!replyContent.trim() && replyAttachments.length === 0}
              className={`px-5 py-2 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-xs ${
                isInternalNote
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-red-600 hover:bg-red-700'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
