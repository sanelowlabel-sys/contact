import React, { useState } from 'react';
import { InAppNotification, UserProfile, UserRole } from '../types';
import { Ticket, User, LifeBuoy, ArrowUpRight, Zap, ShieldCheck } from 'lucide-react';
import { SanelowLogo } from './SanelowLogo';
import { NotificationDropdown } from './NotificationDropdown';

interface HeaderProps {
  currentTab: 'contact' | 'create' | 'dashboard' | 'faq';
  onSelectTab: (tab: 'contact' | 'create' | 'dashboard' | 'faq') => void;
  user: UserProfile;
  ticketCount: number;
  notifications: InAppNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onClearAllNotifications: () => void;
  onSelectTicketFromNotification: (ticketId: string) => void;
  onOpenAuthModal: () => void;
  onOpenVercelModal: () => void;
  onQuickSwitchRole: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  user,
  ticketCount,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onClearAllNotifications,
  onSelectTicketFromNotification,
  onOpenAuthModal,
  onOpenVercelModal,
  onQuickSwitchRole,
}) => {
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-900 text-white rounded">
            Admin
          </span>
        );
      case 'agent':
        return (
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-red-100 text-red-600 rounded">
            Support Agent
          </span>
        );
      case 'customer':
      default:
        return (
          <span className="font-mono text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded">
            Customer
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element brand wordmark with Sanelow Logo */}
        <button
          onClick={() => onSelectTab('contact')}
          className="text-left group cursor-pointer focus:outline-none flex items-center gap-2.5 shrink-0"
        >
          <SanelowLogo size={34} color="#DC2626" className="shrink-0 transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-black font-sans uppercase leading-none">
              SANELOW <span className="text-red-600">MUSIC GROUP</span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 font-semibold mt-0.5">
              Support & Ticket Center
            </span>
          </div>
          <span className="sr-only">Sanelow Music Group Support</span>
        </button>

        {/* Zone 2: Navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onSelectTab('contact')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 ${
              currentTab === 'contact'
                ? 'text-black border-red-600 font-semibold'
                : 'text-neutral-600 border-transparent hover:text-black'
            }`}
          >
            Contact & Hub
          </button>
          <button
            onClick={() => onSelectTab('faq')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 ${
              currentTab === 'faq'
                ? 'text-black border-red-600 font-semibold'
                : 'text-neutral-600 border-transparent hover:text-black'
            }`}
          >
            FAQ & Sizing
          </button>
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
              currentTab === 'dashboard'
                ? 'text-black border-red-600 font-semibold'
                : 'text-neutral-600 border-transparent hover:text-black'
            }`}
          >
            <span>{user.role === 'customer' ? 'My Tickets' : 'Ticket Queue'}</span>
            {ticketCount > 0 && (
              <span className="font-mono text-xs text-red-600 font-semibold">({ticketCount})</span>
            )}
          </button>
          <button
            onClick={() => onSelectTab('create')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 ${
              currentTab === 'create'
                ? 'text-black border-red-600 font-semibold'
                : 'text-neutral-600 border-transparent hover:text-black'
            }`}
          >
            Submit Ticket
          </button>
        </nav>

        {/* Zone 3: Actions, Vercel guide, Notifications, Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Vercel & Serverless Specs button */}
          <button
            onClick={onOpenVercelModal}
            className="cursor-pointer text-xs flex items-center gap-1.5 px-2.5 py-1.5 border border-neutral-200 hover:border-black text-neutral-700 hover:text-black transition-colors rounded-xs bg-neutral-50/60"
            title="View Vercel & Serverless Architecture Specs"
          >
            <Zap className="w-3.5 h-3.5 text-neutral-900" />
            <span className="hidden sm:inline font-mono font-medium text-[11px]">Vercel Deploy</span>
          </button>

          {/* In-App Notification Center */}
          <NotificationDropdown
            notifications={notifications}
            onMarkAsRead={onMarkNotificationAsRead}
            onMarkAllAsRead={onMarkAllNotificationsAsRead}
            onClearAll={onClearAllNotifications}
            onSelectTicket={onSelectTicketFromNotification}
          />

          {/* Role & Auth dropdown/button */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenAuthModal}
              title={`Logged in as ${user.name} (${user.role}). Click to switch role or sign in.`}
              className="cursor-pointer text-xs flex items-center gap-2 px-2.5 py-1.5 border border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:text-black transition-colors"
            >
              <User className="w-3.5 h-3.5 text-neutral-500" />
              <span className="hidden md:inline font-medium text-black">
                {user.name.split(' ')[0]}
              </span>
              {getRoleBadge(user.role)}
            </button>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => onSelectTab('create')}
            className="cursor-pointer flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open Ticket</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>
    </header>
  );
};
