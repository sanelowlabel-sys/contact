import React, { useState, useRef, useEffect } from 'react';
import { InAppNotification } from '../types';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  ExternalLink,
  MessageSquare,
  RefreshCw,
  Sparkles,
  Wifi,
} from 'lucide-react';

interface NotificationDropdownProps {
  notifications: InAppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectTicket: (ticketId: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onSelectTicket,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTimestamp = (iso: string) => {
    try {
      const date = new Date(iso);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-sm transition-colors cursor-pointer focus:outline-none"
        title="In-App Notifications"
        aria-label="In-App Notifications"
      >
        <Bell className="w-4 h-4 text-neutral-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white font-mono text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-neutral-200 shadow-xl rounded-sm z-50 overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-black font-mono">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-red-100 text-red-600 rounded">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="cursor-pointer text-[11px] text-neutral-500 hover:text-black flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-neutral-200/60"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3 h-3 text-red-600" />
                  <span>Mark all read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="cursor-pointer text-[11px] text-neutral-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                  title="Clear notifications"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Real-time Status Badge */}
          <div className="px-3 py-1.5 bg-emerald-50/60 border-b border-emerald-100 flex items-center justify-between text-[11px] text-emerald-800 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Pusher / Realtime Channel Live
            </span>
            <span className="text-[10px] text-emerald-600">WebSocket / SSE</span>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
            {notifications.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <Bell className="w-6 h-6 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-neutral-500">No new notifications</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  You will receive real-time updates when agents reply or change ticket statuses.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    onMarkAsRead(notif.id);
                    onSelectTicket(notif.ticketId);
                    setIsOpen(false);
                  }}
                  className={`p-3 text-left cursor-pointer transition-colors hover:bg-neutral-50 flex gap-2.5 items-start ${
                    !notif.read ? 'bg-red-50/30 border-l-2 border-l-red-600' : ''
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {notif.type === 'reply' ? (
                      <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">
                        <MessageSquare className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center text-xs font-bold">
                        <RefreshCw className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1 mb-0.5">
                      <span className="text-xs font-bold text-black truncate">
                        {notif.title}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-400 shrink-0">
                        {formatTimestamp(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="font-mono text-[10px] font-semibold text-red-600">
                        {notif.ticketId}
                      </span>
                      <span className="text-[10px] text-neutral-400 truncate">
                        {notif.ticketSubject}
                      </span>
                    </div>
                  </div>

                  {!notif.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="p-2.5 bg-neutral-50 border-t border-neutral-100 text-center">
            <span className="text-[10px] text-neutral-500 font-mono">
              Notifications sync with Resend / SendGrid emails
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
