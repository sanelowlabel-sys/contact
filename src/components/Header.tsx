import React from 'react';
import { UserProfile } from '../types';
import { Ticket, User, LifeBuoy, ArrowUpRight } from 'lucide-react';
import { SanelowLogo } from './SanelowLogo';

interface HeaderProps {
  currentTab: 'contact' | 'create' | 'dashboard' | 'faq';
  onSelectTab: (tab: 'contact' | 'create' | 'dashboard' | 'faq') => void;
  user: UserProfile;
  onToggleUserMode: () => void;
  ticketCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  user,
  onToggleUserMode,
  ticketCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element brand wordmark with Sanelow Logo */}
        <button
          onClick={() => onSelectTab('contact')}
          className="text-left group cursor-pointer focus:outline-none flex items-center gap-2.5"
        >
          <SanelowLogo size={36} color="#DC2626" className="shrink-0 transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-black font-sans uppercase leading-none">
              SANELOW <span className="text-red-600">MUSIC GROUP</span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 font-semibold mt-0.5">
              Support & Ticket Center
            </span>
          </div>
          <span className="sr-only">Sanelow Music Group Support</span>
        </button>

        {/* Zone 2: 4-6 text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
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
            <span>My Tickets</span>
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

        {/* Zone 3: Primary action & Auth toggle */}
        <div className="flex items-center gap-3">
          {/* User Mode Quick Toggle for testing auth / guest workflow */}
          <button
            onClick={onToggleUserMode}
            title={user.isGuest ? 'Switch to Authenticated User' : 'Switch to Guest Mode'}
            className="cursor-pointer text-xs flex items-center gap-2 px-3 py-1.5 border border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:text-black transition-colors"
          >
            <User className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden sm:inline">
              {user.isGuest ? 'Guest Mode' : user.name.split(' ')[0]}
            </span>
            <span className="font-mono text-[10px] uppercase text-neutral-400">
              {user.isGuest ? 'Switch to Auth' : 'Switch to Guest'}
            </span>
          </button>

          <button
            onClick={() => onSelectTab('create')}
            className="cursor-pointer flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Open Ticket</span>
          </button>
        </div>
      </div>
    </header>
  );
};
