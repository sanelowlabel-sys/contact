import React, { useState } from 'react';
import { Ticket, TicketPriority, TicketStatus, UserProfile } from '../types';
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
  UserCheck,
  Lock,
  Calendar,
  Layers,
  Sparkles,
  Zap,
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
  const [statusFilter, setStatusFilter] = useState<'all' | TicketStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TicketPriority>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [agentScope, setAgentScope] = useState<'all' | 'mine' | 'unassigned'>('all');

  // Permission filtering:
  // Customers only see their own tickets. Agents & Admins see all tickets in queue.
  const isStaff = user.role === 'agent' || user.role === 'admin';

  const relevantTickets = isStaff
    ? tickets
    : user.isGuest
    ? tickets
    : tickets.filter(
        (t) => !t.userId || t.userId === user.id || t.customerEmail === user.email
      );

  const filteredTickets = relevantTickets.filter((t) => {
    // 1. Full-text Search
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      t.id.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.customerEmail.toLowerCase().includes(q) ||
      (t.orderNumber && t.orderNumber.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q) ||
      t.messages.some((m) => m.content.toLowerCase().includes(q));

    // 2. Status Filter
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

    // 3. Priority Filter
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;

    // 4. Category Filter
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;

    // 5. Date Filter
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const ticketDate = new Date(t.createdAt).getTime();
      const now = Date.now();
      const diffDays = (now - ticketDate) / (1000 * 60 * 60 * 24);
      if (dateFilter === 'today') {
        matchesDate = diffDays <= 1;
      } else if (dateFilter === '7days') {
        matchesDate = diffDays <= 7;
      } else if (dateFilter === '30days') {
        matchesDate = diffDays <= 30;
      }
    }

    // 6. Agent Scope (for Staff)
    let matchesAgentScope = true;
    if (isStaff && agentScope === 'mine') {
      matchesAgentScope = t.assignedAgent?.id === user.id;
    } else if (isStaff && agentScope === 'unassigned') {
      matchesAgentScope = !t.assignedAgent;
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesCategory &&
      matchesDate &&
      matchesAgentScope
    );
  });

  // Summary counts
  const totalOpen = relevantTickets.filter((t) => t.status === 'open').length;
  const totalInProgress = relevantTickets.filter((t) => t.status === 'in_progress').length;
  const totalPendingUser = relevantTickets.filter((t) => t.status === 'pending_user').length;
  const totalResolved = relevantTickets.filter(
    (t) => t.status === 'resolved' || t.status === 'closed'
  ).length;

  const renderStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold text-red-600 border border-red-200 bg-red-50/60 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            Open
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold text-amber-700 border border-amber-200 bg-amber-50/60 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            In Progress
          </span>
        );
      case 'pending_user':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold text-blue-700 border border-blue-200 bg-blue-50/60 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Pending User
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-semibold text-emerald-700 border border-emerald-200 bg-emerald-50 whitespace-nowrap">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Resolved
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium text-neutral-500 border border-neutral-200 bg-neutral-100 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  const renderPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white bg-red-600 rounded">
            Urgent
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 rounded">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 rounded">
            Medium
          </span>
        );
      case 'low':
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono text-neutral-500 bg-neutral-100 border border-neutral-200 rounded">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Role Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight font-sans">
              {isStaff ? 'Operations Support Desk Queue' : 'My Support Tickets'}
            </h2>
            {isStaff && (
              <span className="px-2 py-0.5 bg-neutral-900 text-white font-mono text-[10px] uppercase font-bold tracking-wider rounded">
                {user.role === 'admin' ? 'Admin Full Access' : 'Agent Assigned View'}
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 mt-1 font-mono">
            {isStaff
              ? 'Real-time multi-agent triage, priority escalation, and customer resolution desk.'
              : `Tracking requests for ${user.email || 'Guest Customer'}.`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefreshTickets}
            title="Refresh Ticket Stream"
            disabled={isLoading}
            className="cursor-pointer p-2 border border-neutral-200 hover:border-black text-neutral-600 hover:text-black transition-colors rounded-xs bg-white"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-red-600' : ''}`} />
          </button>

          <button
            onClick={onCreateNew}
            className="cursor-pointer flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Ticket</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setStatusFilter(statusFilter === 'open' ? 'all' : 'open')}
          className={`p-3.5 border text-left transition-all cursor-pointer ${
            statusFilter === 'open'
              ? 'border-red-600 bg-red-50/40 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 font-semibold flex items-center justify-between">
            <span>Open (New)</span>
            <span className="w-2 h-2 rounded-full bg-red-600" />
          </div>
          <div className="text-2xl font-black text-black font-sans mt-1">{totalOpen}</div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Awaiting agent triage</div>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'in_progress' ? 'all' : 'in_progress')}
          className={`p-3.5 border text-left transition-all cursor-pointer ${
            statusFilter === 'in_progress'
              ? 'border-amber-500 bg-amber-50/40 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 font-semibold flex items-center justify-between">
            <span>In Progress</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-black text-black font-sans mt-1">{totalInProgress}</div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Under active review</div>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'pending_user' ? 'all' : 'pending_user')}
          className={`p-3.5 border text-left transition-all cursor-pointer ${
            statusFilter === 'pending_user'
              ? 'border-blue-600 bg-blue-50/40 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 font-semibold flex items-center justify-between">
            <span>Pending User</span>
            <span className="w-2 h-2 rounded-full bg-blue-600" />
          </div>
          <div className="text-2xl font-black text-black font-sans mt-1">{totalPendingUser}</div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Awaiting customer reply</div>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'resolved' ? 'all' : 'resolved')}
          className={`p-3.5 border text-left transition-all cursor-pointer ${
            statusFilter === 'resolved'
              ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 font-semibold flex items-center justify-between">
            <span>Resolved</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-black font-sans mt-1">{totalResolved}</div>
          <div className="text-[10px] text-neutral-400 mt-0.5">Completed inquiries</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 border border-neutral-200 bg-white space-y-3">
        {/* Search Row */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by ID (#TK-8492), keyword, order #, customer, or message..."
            className="w-full pl-9 pr-4 py-2.5 text-xs border border-neutral-200 focus:border-red-600 focus:outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-neutral-400 hover:text-black text-xs cursor-pointer font-mono"
            >
              Clear
            </button>
          )}
        </div>

        {/* Multi-Filters: Status, Priority, Date, Category */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-500 font-semibold mb-1">
              Status Lifecycle
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs border border-neutral-200 focus:border-red-600 focus:outline-none bg-white rounded-xs"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open (New)</option>
              <option value="in_progress">In Progress</option>
              <option value="pending_user">Pending User</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-500 font-semibold mb-1">
              Priority Level
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs border border-neutral-200 focus:border-red-600 focus:outline-none bg-white rounded-xs"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-500 font-semibold mb-1">
              Date Window
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs border border-neutral-200 focus:border-red-600 focus:outline-none bg-white rounded-xs"
            >
              <option value="all">All Time</option>
              <option value="today">Today (Last 24h)</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-500 font-semibold mb-1">
              Issue Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-neutral-200 focus:border-red-600 focus:outline-none bg-white rounded-xs"
            >
              <option value="all">All Categories</option>
              <option value="Damaged / Misprinted Item">Damaged / Misprint</option>
              <option value="Size Exchange">Size Exchange</option>
              <option value="Pre-Order Fulfillment">Pre-Order Vinyl</option>
              <option value="Order Tracking">Order Tracking</option>
              <option value="Return / Refund">Return / Refund</option>
              <option value="Wholesale / Bulk">Wholesale / Bulk</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
          </div>
        </div>

        {/* Staff-only Agent Filter Bar */}
        {isStaff && (
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="font-mono text-[10px] uppercase text-neutral-400">Agent Queue Scope:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setAgentScope('all')}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-xs cursor-pointer ${
                  agentScope === 'all'
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                }`}
              >
                All Tickets ({relevantTickets.length})
              </button>
              <button
                onClick={() => setAgentScope('mine')}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-xs cursor-pointer ${
                  agentScope === 'mine'
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                }`}
              >
                Assigned to Me ({relevantTickets.filter((t) => t.assignedAgent?.id === user.id).length})
              </button>
              <button
                onClick={() => setAgentScope('unassigned')}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-xs cursor-pointer ${
                  agentScope === 'unassigned'
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                }`}
              >
                Unassigned ({relevantTickets.filter((t) => !t.assignedAgent).length})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ticket List Table / Grid */}
      {isLoading ? (
        <SkeletonLoader count={4} />
      ) : filteredTickets.length === 0 ? (
        <div className="p-12 text-center border border-neutral-200 bg-white">
          <SanelowLogo size={44} color="#DC2626" className="mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-black font-sans uppercase">
            No matching support tickets found
          </h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1 leading-relaxed">
            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try clearing your active filters or searching with a different term.'
              : 'You do not have any logged support tickets right now. Need assistance with an order?'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            {(searchQuery || statusFilter !== 'all' || priorityFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setDateFilter('all');
                  setCategoryFilter('all');
                }}
                className="px-4 py-2 border border-neutral-200 text-neutral-700 hover:text-black hover:border-black text-xs font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
            <button
              onClick={onCreateNew}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              Submit New Ticket
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-neutral-200 bg-white divide-y divide-neutral-200 shadow-xs">
          {filteredTickets.map((ticket) => {
            const hasInternalNotes = ticket.messages.some((m) => m.isInternal);
            const lastMessage = ticket.messages[ticket.messages.length - 1];

            return (
              <div
                key={ticket.id}
                onClick={() => onOpenTicket(ticket)}
                className="p-4 sm:p-5 hover:bg-neutral-50/70 transition-colors cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: ID, Subject, Meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-black text-black group-hover:text-red-600 transition-colors">
                      {ticket.id}
                    </span>

                    {renderStatusBadge(ticket.status)}
                    {renderPriorityBadge(ticket.priority)}

                    <span className="text-[11px] font-mono text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                      {ticket.category}
                    </span>

                    {ticket.orderNumber && (
                      <span className="text-[11px] font-mono text-neutral-600 border border-neutral-200 px-1.5 py-0.5">
                        {ticket.orderNumber}
                      </span>
                    )}

                    {isStaff && hasInternalNotes && (
                      <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        Internal Note
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-black group-hover:text-red-600 transition-colors truncate">
                    {ticket.subject}
                  </h3>

                  <p className="text-xs text-neutral-500 line-clamp-1 mt-1 leading-relaxed">
                    {lastMessage ? (
                      <span>
                        <strong className="text-neutral-700">{lastMessage.senderName}:</strong>{' '}
                        {lastMessage.content}
                      </span>
                    ) : (
                      ticket.description
                    )}
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-[11px] font-mono text-neutral-400">
                    <span>Opened {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-neutral-400" />
                      {ticket.messages.length} message{ticket.messages.length === 1 ? '' : 's'}
                    </span>
                    {isStaff && (
                      <>
                        <span>&bull;</span>
                        <span className="text-neutral-600">{ticket.customerName}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Assigned Agent & Quick Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100">
                  {/* Assigned Agent display */}
                  <div className="text-left md:text-right">
                    <div className="text-[10px] font-mono uppercase text-neutral-400">Assigned Agent</div>
                    {ticket.assignedAgent ? (
                      <div className="flex items-center md:justify-end gap-1.5 mt-0.5">
                        <img
                          src={ticket.assignedAgent.avatar}
                          alt={ticket.assignedAgent.name}
                          className="w-5 h-5 rounded-full object-cover border border-neutral-200"
                        />
                        <span className="text-xs font-semibold text-neutral-800">
                          {ticket.assignedAgent.name.split(' ')[0]}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-mono text-neutral-400">Unassigned</span>
                    )}
                  </div>

                  {/* Open Thread Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTicket(ticket);
                    }}
                    className="p-2 border border-neutral-200 group-hover:border-black group-hover:bg-black group-hover:text-white text-neutral-600 transition-colors rounded-xs cursor-pointer flex items-center gap-1 text-xs font-semibold"
                  >
                    <span>Thread</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
