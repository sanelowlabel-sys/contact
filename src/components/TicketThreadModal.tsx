import React, { useState, useRef, useEffect } from 'react';
import {
  Ticket,
  TicketMessage,
  TicketAttachment,
  UserProfile,
  TicketStatus,
} from '../types';
import { SUPPORT_AVATAR, MERCH_SAMPLE_IMAGE } from '../data/mockData';
import { SkeletonLoader } from './SkeletonLoader';
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
} from 'lucide-react';

interface TicketThreadModalProps {
  ticket: Ticket;
  user: UserProfile;
  onClose: () => void;
  onSendMessage: (ticketId: string, content: string, attachments: TicketAttachment[]) => void;
  onUpdateStatus: (ticketId: string, status: TicketStatus) => void;
  onToggleEmailNotifications: (ticketId: string) => void;
  onSimulateStaffReply: (ticketId: string) => void;
}

export const TicketThreadModal: React.FC<TicketThreadModalProps> = ({
  ticket,
  user,
  onClose,
  onSendMessage,
  onUpdateStatus,
  onToggleEmailNotifications,
  onSimulateStaffReply,
}) => {
  const [replyContent, setReplyContent] = useState('');
  const [replyAttachments, setReplyAttachments] = useState<TicketAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSimulatingAgent, setIsSimulatingAgent] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket.messages.length]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() && replyAttachments.length === 0) return;

    onSendMessage(ticket.id, replyContent, replyAttachments);
    setReplyContent('');
    setReplyAttachments([]);
    showToast('Reply dispatched to support desk.');
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
    }, 800);
  };

  const handleAttachSample = () => {
    setIsUploading(true);
    setTimeout(() => {
      setReplyAttachments((prev) => [
        ...prev,
        {
          id: `att_sample_${Date.now()}`,
          name: 'replacement_label_confirmation.jpg',
          size: '1.8 MB',
          type: 'image/jpeg',
          url: MERCH_SAMPLE_IMAGE,
          previewUrl: MERCH_SAMPLE_IMAGE,
          uploadedAt: new Date().toISOString(),
        },
      ]);
      setIsUploading(false);
    }, 600);
  };

  const handleSimulateStaff = () => {
    setIsSimulatingAgent(true);
    setTimeout(() => {
      onSimulateStaffReply(ticket.id);
      setIsSimulatingAgent(false);
      showToast('Support specialist Alex Vance replied to this ticket.');
    }, 1200);
  };

  const handleToggleResolve = () => {
    if (ticket.status === 'resolved') {
      onUpdateStatus(ticket.id, 'in_progress');
      showToast('Ticket reopened and placed in active queue.');
    } else {
      onUpdateStatus(ticket.id, 'resolved');
      showToast('Ticket marked as resolved.');
    }
  };

  // Status badge styling adhering strictly to requirement 1:
  // "Accents: Vibrant Red (#DC2626) for active status badges (e.g., 'Open Ticket', 'Urgent'). Muted Grey for closed status indicators."
  const renderStatusBadge = () => {
    switch (ticket.status) {
      case 'pending_agent':
        return (
          <span className="font-mono text-xs text-red-600 font-bold flex items-center gap-1.5 border border-red-200 bg-red-50/50 px-2.5 py-1">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            Pending Agent
          </span>
        );
      case 'in_progress':
        return (
          <span className="font-mono text-xs text-amber-700 font-bold flex items-center gap-1.5 border border-amber-200 bg-amber-50/50 px-2.5 py-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            In Progress
          </span>
        );
      case 'awaiting_reply':
        return (
          <span className="font-mono text-xs text-red-600 font-bold flex items-center gap-1.5 border border-red-300 bg-red-50 px-2.5 py-1">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            Awaiting Customer Reply
          </span>
        );
      case 'resolved':
        return (
          <span className="font-mono text-xs text-neutral-500 font-medium flex items-center gap-1.5 border border-neutral-200 bg-neutral-100 px-2.5 py-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500" />
            Resolved
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-60 bg-black text-white px-4 py-2.5 text-xs font-semibold shadow-lg border border-neutral-800 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="w-2 h-2 rounded-full bg-red-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white border border-neutral-200 w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <SanelowLogo size={24} color="#DC2626" className="shrink-0" />
            <span className="font-mono font-bold text-black text-base">
              {ticket.id}
            </span>
            <span className="text-neutral-300 hidden sm:inline">|</span>
            <span className="text-sm font-semibold text-black truncate max-w-md">
              {ticket.subject}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="cursor-pointer p-1.5 text-neutral-400 hover:text-black border border-neutral-200 hover:border-neutral-300 transition-colors"
              title="Close thread"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body: 2 Columns on Desktop */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left / Main: Chat Thread */}
          <div className="flex-1 flex flex-col bg-neutral-50 overflow-hidden">
            {/* Thread Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Original Ticket Description Card */}
              <div className="bg-white border border-neutral-200 p-4 sm:p-5">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black">{ticket.customerName}</span>
                    <span className="text-neutral-400">opened this case</span>
                  </div>
                  <span className="font-mono text-neutral-400">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-neutral-800 leading-relaxed font-sans">
                  {ticket.description}
                </p>

                {/* Attachments from initial report */}
                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-neutral-100">
                    <span className="font-mono text-[11px] text-neutral-400 uppercase block mb-2">
                      Original Attached Proof ({ticket.attachments.length}):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {ticket.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="border border-neutral-200 p-2 bg-neutral-50 flex flex-col gap-1.5"
                        >
                          {att.url && (
                            <img
                              src={att.url}
                              alt={att.name}
                              className="w-full h-24 object-cover border border-neutral-200"
                            />
                          )}
                          <div className="truncate">
                            <p className="font-mono text-[11px] text-black font-semibold truncate">
                              {att.name}
                            </p>
                            <p className="font-mono text-[10px] text-neutral-500">{att.size}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Message List */}
              {ticket.messages
                .filter((_, idx) => idx > 0) // Skip first if duplicate of initial description
                .map((msg) => {
                  const isStaff = msg.senderRole === 'staff';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 items-start ${
                        isStaff ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      {isStaff && (
                        <img
                          src={msg.avatar || SUPPORT_AVATAR}
                          alt={msg.senderName}
                          className="w-9 h-9 rounded-full object-cover border border-neutral-300 shrink-0 mt-0.5"
                        />
                      )}

                      <div
                        className={`max-w-[85%] sm:max-w-[75%] p-4 border text-sm leading-relaxed ${
                          isStaff
                            ? 'bg-white border-neutral-200 text-black'
                            : 'bg-white border-neutral-300 text-black ml-auto'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 pb-2 mb-2 border-b border-neutral-100 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-black">{msg.senderName}</span>
                            {isStaff ? (
                              <span className="font-mono text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 font-semibold">
                                STAFF
                              </span>
                            ) : (
                              <span className="font-mono text-[10px] text-neutral-400">
                                CUSTOMER
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[11px] text-neutral-400">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <p className="whitespace-pre-line text-neutral-800">{msg.content}</p>

                        {/* Message Attachments */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-neutral-100 space-y-2">
                            {msg.attachments.map((att) => (
                              <div
                                key={att.id}
                                className="flex items-center gap-2 p-1.5 bg-neutral-50 border border-neutral-200 text-xs"
                              >
                                {att.url && (
                                  <img
                                    src={att.url}
                                    alt={att.name}
                                    className="w-8 h-8 object-cover border border-neutral-200"
                                  />
                                )}
                                <div className="truncate">
                                  <p className="font-mono text-xs text-black truncate">{att.name}</p>
                                  <span className="font-mono text-[10px] text-neutral-500">
                                    {att.size}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

              {/* Simulating Staff loader */}
              {isSimulatingAgent && (
                <div className="pt-2">
                  <SkeletonLoader type="thread" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Reply Composer */}
            <div className="p-4 bg-white border-t border-neutral-200">
              {ticket.status === 'resolved' ? (
                <div className="p-3 bg-neutral-100 border border-neutral-200 flex items-center justify-between text-xs">
                  <span className="text-neutral-600">
                    This ticket is currently marked as <strong>Resolved</strong>.
                  </span>
                  <button
                    onClick={handleToggleResolve}
                    className="cursor-pointer font-bold text-red-600 hover:text-red-700 flex items-center gap-1 underline"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reopen Ticket to Send Message</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSend} className="space-y-3">
                  {/* File previews in reply box */}
                  {replyAttachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 pb-2">
                      {replyAttachments.map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center gap-2 px-2 py-1 bg-neutral-100 border border-neutral-200 text-xs"
                        >
                          <span className="font-mono text-black truncate max-w-xs">{a.name}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setReplyAttachments((prev) => prev.filter((item) => item.id !== a.id))
                            }
                            className="text-neutral-400 hover:text-red-600 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="relative">
                    <textarea
                      rows={3}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Type your reply to merchandise customer support..."
                      className="w-full p-3 text-xs sm:text-sm border border-neutral-200 focus:border-red-600 focus:outline-none transition-colors text-black resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        multiple
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer text-xs text-neutral-600 hover:text-black flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 hover:border-neutral-300 transition-colors"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Attach Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleAttachSample}
                        className="cursor-pointer text-xs text-red-600 hover:text-red-700 flex items-center gap-1 px-2.5 py-1.5 border border-red-100 hover:border-red-300 bg-red-50/50 transition-colors hidden sm:flex"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Sample Proof</span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={!replyContent.trim() && replyAttachments.length === 0}
                      className="cursor-pointer px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Reply</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Ticket Metadata & Management Sidebar */}
          <div className="w-full md:w-72 bg-white border-t md:border-t-0 md:border-l border-neutral-200 p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
            <div className="space-y-5">
              <div>
                <span className="font-mono text-[11px] uppercase text-neutral-400 block mb-1">
                  Ticket Status
                </span>
                {renderStatusBadge()}
              </div>

              <div>
                <span className="font-mono text-[11px] uppercase text-neutral-400 block mb-1">
                  Priority
                </span>
                <span
                  className={`font-mono text-xs uppercase font-bold ${
                    ticket.priority === 'urgent' ? 'text-red-600' : 'text-black'
                  }`}
                >
                  {ticket.priority}
                </span>
              </div>

              <div>
                <span className="font-mono text-[11px] uppercase text-neutral-400 block mb-1">
                  Category
                </span>
                <p className="text-xs font-medium text-black">{ticket.category}</p>
              </div>

              {ticket.orderNumber && (
                <div>
                  <span className="font-mono text-[11px] uppercase text-neutral-400 block mb-1">
                    Linked Order
                  </span>
                  <p className="font-mono text-xs font-bold text-black">{ticket.orderNumber}</p>
                </div>
              )}

              <div>
                <span className="font-mono text-[11px] uppercase text-neutral-400 block mb-1">
                  Customer
                </span>
                <p className="text-xs font-semibold text-black">{ticket.customerName}</p>
                <p className="font-mono text-[11px] text-neutral-500">{ticket.customerEmail}</p>
              </div>

              <div>
                <span className="font-mono text-[11px] uppercase text-neutral-400 block mb-1">
                  Assigned Team Lead
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <img
                    src={SUPPORT_AVATAR}
                    alt="Alex Vance"
                    className="w-7 h-7 rounded-full object-cover border border-neutral-200"
                  />
                  <div>
                    <p className="text-xs font-semibold text-black">Alex Vance</p>
                    <p className="text-[10px] text-neutral-500">Sanelow Care & Merch Lead</p>
                  </div>
                </div>
              </div>

              {/* Email Notification Toggle Placeholder */}
              <div className="pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => onToggleEmailNotifications(ticket.id)}
                  className="cursor-pointer w-full text-left flex items-start gap-2 p-2.5 border border-neutral-200 hover:border-neutral-300 transition-colors bg-neutral-50"
                >
                  {ticket.emailNotificationEnabled ? (
                    <Bell className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  ) : (
                    <BellOff className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-xs font-bold text-black">
                      {ticket.emailNotificationEnabled ? 'Email Alerts Active' : 'Email Alerts Muted'}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Dispatches immediate emails to {ticket.customerEmail} when staff responds.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-5 mt-5 border-t border-neutral-200 space-y-2">
              {/* Simulate Staff Reply Button */}
              <button
                type="button"
                onClick={handleSimulateStaff}
                disabled={isSimulatingAgent}
                className="cursor-pointer w-full px-3 py-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                <span>Simulate Staff Reply</span>
              </button>

              {/* Resolve / Reopen */}
              <button
                type="button"
                onClick={handleToggleResolve}
                className={`cursor-pointer w-full px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border ${
                  ticket.status === 'resolved'
                    ? 'border-neutral-300 text-black bg-white hover:bg-neutral-100'
                    : 'border-black text-white bg-black hover:bg-neutral-900'
                }`}
              >
                {ticket.status === 'resolved' ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reopen Ticket</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
                    <span>Mark as Resolved</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
