import React, { useState } from 'react';
import { Ticket, TicketStatus, UserProfile } from '../types';
import { SkeletonLoader } from './SkeletonLoader';
import { SanelowLogo } from './SanelowLogo';
import {
  Search,
  Filter,
  RefreshCw,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface TicketDashboardProps {
  tickets: Ticket[];
  user: UserProfile;
  onOpenTicket: (ticket: Ticket) => void;
  onQuickResolve: (ticketId: string) => void;
  onCreateNew: () => void;
  onRefreshTickets: () => void;
  isLoading: boolean;
}

export const TicketDashboard: React.FC<TicketDashboardProps> = ({
  tickets,
  user,
  onOpenTicket,
  onQuickResolve,
  onCreateNew,
  onRefreshTickets,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'pending' | 'resolved'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter tickets for this user if logged in, or all created tickets if guest
  const relevantTickets = user.isGuest
    ? tickets
    : tickets.filter((t) => !t.userId || t.userId === user.id || t.customerEmail === user.email);

  const filteredTickets = relevantTickets.filter((t) => {
    // Search
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.orderNumber && t.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'open') {
      matchesStatus = t.status !== 'resolved';
    } else if (statusFilter === 'pending') {
      matchesStatus = t.status === 'pending_agent' || t.status === 'awaiting_reply';
    } else if (statusFilter === 'resolved') {
      matchesStatus = t.status === 'resolved';
    }

    // Category
    const matchesCat = categoryFilter === 'all' || t.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCat;
  });

  const totalOpen = relevantTickets.filter((t) => t.status !== 'resolved').length;
  const totalPending = relevantTickets.filter((t) => t.status === 'pending_agent').length;
  const totalResolved = relevantTickets.filter((t) => t.status === 'resolved').length;

  const renderStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'pending_agent':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold text-red-600 border border-red-200 bg-red-50/60 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            Pending Agent
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold text-amber-700 border border-amber-200 bg-amber-50/60 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            In Progress
          </span>
        );
      case 'awaiting_reply':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold text-red-600 border border-red-300 bg-red-50 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            Awaiting Customer Reply
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium text-neutral-500 border border-neutral-200 bg-neutral-100 whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 text-neutral-500" />
            Resolved
          </span>
        );
    }
  };

  return (
    <div className="border border-neutral-200 bg-white p-6 sm:p-8 mb-16">
      {/* Top Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <SanelowLogo size={16} color="#DC2626" className="shrink-0" />
            <span className="font-mono text-xs uppercase text-neutral-500 tracking-wider">
              Account Dashboard
            </span>
            <span className="text-neutral-300">/</span>
            <span className="font-mono text-xs text-red-600 font-semibold uppercase">
              Sanelow Support
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black uppercase tracking-tight mt-1">
            My Support Tickets
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Track real-time correspondence with merchandise specialists, review replacement authorizations, and upload additional photos.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRefreshTickets}
            title="Refresh ticket queue"
            disabled={isLoading}
            className="cursor-pointer p-2 border border-neutral-200 hover:border-neutral-400 bg-white text-neutral-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-red-600' : ''}`} />
          </button>
          <button
            onClick={onCreateNew}
            className="cursor-pointer px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Open New Ticket</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-3 gap-3 my-6 text-xs">
        <div className="border border-neutral-200 p-3.5 bg-neutral-50 flex items-center justify-between">
          <span className="text-neutral-600 font-medium">Active Open</span>
          <span className="font-mono font-bold text-base text-black">{totalOpen}</span>
        </div>
        <div className="border border-neutral-200 p-3.5 bg-neutral-50 flex items-center justify-between">
          <span className="text-neutral-600 font-medium">Pending Review</span>
          <span className="font-mono font-bold text-base text-red-600">{totalPending}</span>
        </div>
        <div className="border border-neutral-200 p-3.5 bg-neutral-50 flex items-center justify-between">
          <span className="text-neutral-600 font-medium">Resolved Cases</span>
          <span className="font-mono font-bold text-base text-neutral-700">{totalResolved}</span>
        </div>
      </div>

      {/* Controls Bar: Search & Status Segments */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-4 border-b border-neutral-100">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Ticket ID, Order #, or subject..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-red-600 focus:outline-none transition-colors text-black placeholder:text-neutral-400"
          />
        </div>

        {/* Status segment buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`cursor-pointer px-3 py-1.5 border transition-colors whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-black text-white border-black font-semibold'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-black'
            }`}
          >
            All ({relevantTickets.length})
          </button>
          <button
            onClick={() => setStatusFilter('open')}
            className={`cursor-pointer px-3 py-1.5 border transition-colors whitespace-nowrap ${
              statusFilter === 'open'
                ? 'bg-black text-white border-black font-semibold'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-black'
            }`}
          >
            Open ({totalOpen})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`cursor-pointer px-3 py-1.5 border transition-colors whitespace-nowrap ${
              statusFilter === 'pending'
                ? 'bg-black text-white border-black font-semibold'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-black'
            }`}
          >
            Pending ({totalPending})
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`cursor-pointer px-3 py-1.5 border transition-colors whitespace-nowrap ${
              statusFilter === 'resolved'
                ? 'bg-black text-white border-black font-semibold'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-black'
            }`}
          >
            Resolved ({totalResolved})
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <SkeletonLoader type="table" rows={4} />
      ) : filteredTickets.length > 0 ? (
        /* Ticket List Table */
        <div className="overflow-x-auto border border-neutral-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-100 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-black">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Subject & Details</th>
                <th className="py-3 px-4 hidden md:table-cell">Category</th>
                <th className="py-3 px-4 hidden lg:table-cell">Order #</th>
                <th className="py-3 px-4 hidden sm:table-cell">Date Opened</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-xs">
              {filteredTickets.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => onOpenTicket(t)}
                  className="hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                >
                  {/* Ticket ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-black whitespace-nowrap">
                    <span className="group-hover:text-red-600 transition-colors">{t.id}</span>
                    {t.priority === 'urgent' && (
                      <span className="ml-1.5 text-[10px] font-mono text-red-600 font-bold">
                        URGENT
                      </span>
                    )}
                  </td>

                  {/* Subject */}
                  <td className="py-3.5 px-4 max-w-xs sm:max-w-sm">
                    <p className="font-semibold text-black truncate group-hover:text-red-600 transition-colors">
                      {t.subject}
                    </p>
                    <div className="flex items-center gap-2 text-neutral-500 text-[11px] mt-0.5">
                      <span className="flex items-center gap-1 font-mono">
                        <MessageSquare className="w-3 h-3 text-neutral-400" />
                        {t.messages.length} messages
                      </span>
                      {t.attachments.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="font-mono text-neutral-500">
                            {t.attachments.length} proof attached
                          </span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 hidden md:table-cell text-neutral-700 whitespace-nowrap font-medium">
                    {t.category}
                  </td>

                  {/* Order # */}
                  <td className="py-3.5 px-4 hidden lg:table-cell font-mono text-neutral-600 whitespace-nowrap">
                    {t.orderNumber || '—'}
                  </td>

                  {/* Date Opened */}
                  <td className="py-3.5 px-4 hidden sm:table-cell font-mono text-neutral-500 whitespace-nowrap">
                    {new Date(t.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {renderStatusBadge(t.status)}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenTicket(t);
                      }}
                      className="cursor-pointer text-xs font-semibold text-black hover:text-red-600 flex items-center gap-1 ml-auto transition-colors"
                    >
                      <span>View Thread</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty state */
        <div className="py-12 px-6 text-center border border-dashed border-neutral-300 bg-neutral-50">
          <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-black uppercase">No Support Tickets Found</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? 'No tickets match the current filters. Clear the search bar or filter buttons above.'
              : 'You have no open customer tickets. Need assistance with an order or product sizing?'}
          </p>
          <div className="mt-4">
            <button
              onClick={onCreateNew}
              className="cursor-pointer px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Ticket</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
