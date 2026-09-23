import React, { useState } from 'react';
import {
  Ticket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  TicketAttachment,
  UserProfile,
} from './types';
import {
  INITIAL_USER,
  INITIAL_TICKETS,
  SUPPORT_AVATAR,
} from './data/mockData';
import { Header } from './components/Header';
import { ContactCards } from './components/ContactCards';
import { FaqSection } from './components/FaqSection';
import { CreateTicketForm } from './components/CreateTicketForm';
import { TicketDashboard } from './components/TicketDashboard';
import { TicketThreadModal } from './components/TicketThreadModal';
import { GuestLookupModal } from './components/GuestLookupModal';
import { OrdersView } from './components/OrdersView';
import { SkeletonLoader } from './components/SkeletonLoader';
import { SanelowLogo } from './components/SanelowLogo';
import {
  Ticket as TicketIcon,
  Search,
  ShieldCheck,
  Clock,
  ArrowRight,
  User,
  CheckCircle2,
  Package,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export default function App() {
  // Navigation & User State
  const [currentTab, setCurrentTab] = useState<'contact' | 'create' | 'dashboard' | 'faq'>('contact');
  const [dashboardSubTab, setDashboardSubTab] = useState<'tickets' | 'orders'>('tickets');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);

  // Active Ticket Modal
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [prefillCategory, setPrefillCategory] = useState<TicketCategory | undefined>(undefined);

  // Guest lookup modal
  const [isGuestLookupOpen, setIsGuestLookupOpen] = useState(false);

  // Loading simulation state for list refresh
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);

  // Banner toast
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setBannerNotice(msg);
    setTimeout(() => setBannerNotice(null), 3500);
  };

  // Toggle user between Authenticated (Jordan Mercer) and Guest
  const handleToggleUserMode = () => {
    if (user.isGuest) {
      setUser(INITIAL_USER);
      showNotice('Switched to Authenticated Account: Jordan Mercer');
    } else {
      setUser({
        id: 'guest_session',
        name: 'Guest Customer',
        email: '',
        isGuest: true,
        orders: [],
      });
      showNotice('Switched to Guest Mode. Tickets will require email verification.');
    }
  };

  // Create ticket handler
  const handleCreateTicket = async (newTicket: Ticket) => {
    setTickets((prev) => [newTicket, ...prev]);
    showNotice(`Ticket ${newTicket.id} logged successfully!`);
  };

  // Open ticket thread
  const handleOpenTicketThread = (ticket: Ticket) => {
    setActiveTicketId(ticket.id);
  };

  // Open ticket by ID
  const handleOpenTicketById = (ticketId: string) => {
    setActiveTicketId(ticketId);
  };

  // Send message in thread
  const handleSendMessage = (ticketId: string, content: string, attachments: TicketAttachment[]) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const newMsg = {
            id: `msg_${Date.now()}`,
            senderId: user.isGuest ? 'guest' : user.id,
            senderName: user.isGuest ? t.customerName : user.name,
            senderRole: 'customer' as const,
            content,
            attachments,
            createdAt: new Date().toISOString(),
          };
          return {
            ...t,
            messages: [...t.messages, newMsg],
            status: t.status === 'awaiting_reply' ? 'in_progress' : t.status,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  };

  // Update status (e.g. resolve / reopen)
  const handleUpdateStatus = (ticketId: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t))
    );
  };

  // Toggle email notification
  const handleToggleEmailNotifications = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              emailNotificationEnabled: !t.emailNotificationEnabled,
            }
          : t
      )
    );
  };

  // Staff reply simulator for real-time demonstration
  const handleSimulateStaffReply = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const staffReplies = [
            'Hello! Our fulfillment warehouse supervisor just reviewed the batch. A replacement unit has been packed with priority shipping. Your replacement tracking label is generated.',
            'Hi! We have processed your size exchange request. The prepaid return label has been emailed to your address. Once scanned by the carrier, the replacement ships immediately.',
            'Thanks for following up! We reached out to our freight liaison; the customs hold at the sorting depot was cleared this morning, and delivery is projected in 48 hours.',
          ];
          const randomReply = staffReplies[Math.floor(Math.random() * staffReplies.length)];

          const staffMsg = {
            id: `msg_staff_${Date.now()}`,
            senderId: 'staff_alex',
            senderName: 'Alex Vance',
            senderRole: 'staff' as const,
            avatar: SUPPORT_AVATAR,
            content: randomReply,
            createdAt: new Date().toISOString(),
          };

          return {
            ...t,
            messages: [...t.messages, staffMsg],
            status: 'awaiting_reply' as const,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  };

  // Refresh ticket list with skeleton loader
  const handleRefreshTickets = () => {
    setIsLoadingTickets(true);
    setTimeout(() => {
      setIsLoadingTickets(false);
      showNotice('Ticket queue synchronized with server.');
    }, 1100);
  };

  // Open ticket form with prefilled order
  const handleOpenTicketForOrder = (orderId: string) => {
    setCurrentTab('create');
    setPrefillCategory('Damaged / Misprinted Item');
  };

  // Active ticket object
  const activeTicket = tickets.find((t) => t.id === activeTicketId);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-red-50 selection:text-red-600">
      {/* Top Banner Notice */}
      {bannerNotice && (
        <div className="bg-black text-white text-xs py-2 px-4 text-center font-medium border-b border-neutral-800 transition-all flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600" />
          <span>{bannerNotice}</span>
        </div>
      )}

      {/* Header with 3-Zone top bar contract */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        onToggleUserMode={handleToggleUserMode}
        ticketCount={tickets.filter((t) => t.status !== 'resolved').length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ======================================================== */}
        {/* VIEW 1: CONTACT & HELP CENTER (Default) */}
        {/* ======================================================== */}
        {currentTab === 'contact' && (
          <div>
            {/* Page Header / Hero Section */}
            <div className="mb-10 text-center sm:text-left border-b border-neutral-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                  <SanelowLogo size={18} color="#DC2626" className="inline-block shrink-0" />
                  <span>Sanelow Music Group Operations</span>
                  <span>·</span>
                  <span className="text-red-600 font-semibold">Priority Helpdesk SLA Active</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-black uppercase tracking-tight">
                  SANELOW SUPPORT CENTER
                </h1>
                <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-2xl leading-relaxed">
                  Official customer care for Sanelow Music Group artist merchandise, tour apparel, vinyl pre-orders, and label distribution.
                </p>
              </div>

              {/* Quick action buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 shrink-0">
                <button
                  onClick={() => setIsGuestLookupOpen(true)}
                  className="cursor-pointer px-4 py-2 text-xs font-medium text-black bg-white border border-neutral-300 hover:border-neutral-500 transition-colors flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Track Existing Ticket</span>
                </button>
                <button
                  onClick={() => {
                    setPrefillCategory(undefined);
                    setCurrentTab('create');
                  }}
                  className="cursor-pointer px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <TicketIcon className="w-3.5 h-3.5" />
                  <span>Submit Support Ticket</span>
                </button>
              </div>
            </div>

            {/* Quick Contact Cards */}
            <ContactCards
              onOpenTicketForm={(cat) => {
                setPrefillCategory(cat);
                setCurrentTab('create');
              }}
              onNavigateToFAQ={() => setCurrentTab('faq')}
            />

            {/* User Active Tickets Quick Glance (if tickets exist) */}
            {tickets.length > 0 && (
              <div className="mb-12 border border-neutral-200 bg-neutral-50/60 p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                      Your Active Ticket Activity ({tickets.filter((t) => t.status !== 'resolved').length} open)
                    </h2>
                  </div>
                  <button
                    onClick={() => setCurrentTab('dashboard')}
                    className="cursor-pointer text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <span>Go to Full Ticket Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tickets.slice(0, 2).map((t) => (
                    <div
                      key={t.id}
                      onClick={() => handleOpenTicketThread(t)}
                      className="cursor-pointer bg-white border border-neutral-200 p-4 hover:border-neutral-400 hover:shadow-xs transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-mono font-bold text-black">{t.id}</span>
                          <span className="font-mono text-neutral-400">
                            {new Date(t.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-black line-clamp-1 mb-1">
                          {t.subject}
                        </h4>
                        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                          {t.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                        <span className="font-medium text-neutral-700">{t.category}</span>
                        <span className="text-red-600 font-semibold flex items-center gap-1 font-mono">
                          <span>View Thread</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive FAQ Accordion */}
            <FaqSection
              onOpenTicketForm={() => {
                setPrefillCategory(undefined);
                setCurrentTab('create');
              }}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: SUBMIT TICKET FORM */}
        {/* ======================================================== */}
        {currentTab === 'create' && (
          <div>
            <CreateTicketForm
              user={user}
              prefillCategory={prefillCategory}
              onSubmitTicket={handleCreateTicket}
              onSwitchToAuth={() => {
                setUser(INITIAL_USER);
                showNotice('Logged in as Jordan Mercer');
              }}
              onViewTicket={(ticketId) => {
                setActiveTicketId(ticketId);
              }}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: SUPPORT & TICKET DASHBOARD */}
        {/* ======================================================== */}
        {currentTab === 'dashboard' && (
          <div>
            {/* Account Tab Switcher */}
            <div className="flex items-center gap-2 mb-6 border-b border-neutral-200 text-xs">
              <button
                onClick={() => setDashboardSubTab('tickets')}
                className={`cursor-pointer px-4 py-2.5 font-bold uppercase tracking-wider transition-colors border-b-2 ${
                  dashboardSubTab === 'tickets'
                    ? 'border-red-600 text-black'
                    : 'border-transparent text-neutral-500 hover:text-black'
                }`}
              >
                Support Tickets ({tickets.length})
              </button>
              {!user.isGuest && (
                <button
                  onClick={() => setDashboardSubTab('orders')}
                  className={`cursor-pointer px-4 py-2.5 font-bold uppercase tracking-wider transition-colors border-b-2 ${
                    dashboardSubTab === 'orders'
                      ? 'border-red-600 text-black'
                      : 'border-transparent text-neutral-500 hover:text-black'
                  }`}
                >
                  Recent Merch Orders ({user.orders.length})
                </button>
              )}
            </div>

            {dashboardSubTab === 'tickets' ? (
              <TicketDashboard
                tickets={tickets}
                user={user}
                onOpenTicket={handleOpenTicketThread}
                onQuickResolve={(id) => handleUpdateStatus(id, 'resolved')}
                onCreateNew={() => setCurrentTab('create')}
                onRefreshTickets={handleRefreshTickets}
                isLoading={isLoadingTickets}
              />
            ) : (
              <OrdersView
                orders={user.orders}
                onOpenTicketForOrder={handleOpenTicketForOrder}
              />
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: DEDICATED FAQ & SIZING GUIDE */}
        {/* ======================================================== */}
        {currentTab === 'faq' && (
          <div>
            <div className="mb-8 border-b border-neutral-200 pb-6">
              <span className="font-mono text-xs uppercase text-neutral-500 tracking-wider">
                Support Documentation
              </span>
              <h1 className="text-3xl font-extrabold text-black uppercase tracking-tight mt-1">
                Merch Store FAQ & Sizing Guide
              </h1>
              <p className="text-sm text-neutral-600 mt-1">
                Find answers regarding 450 GSM fleece blanks, pre-order vinyl timelines, international customs, and split shipping.
              </p>
            </div>

            <FaqSection
              onOpenTicketForm={() => {
                setPrefillCategory(undefined);
                setCurrentTab('create');
              }}
            />
          </div>
        )}
      </main>

      {/* Real-time Ticket Thread Modal */}
      {activeTicket && (
        <TicketThreadModal
          ticket={activeTicket}
          user={user}
          onClose={() => setActiveTicketId(null)}
          onSendMessage={handleSendMessage}
          onUpdateStatus={handleUpdateStatus}
          onToggleEmailNotifications={handleToggleEmailNotifications}
          onSimulateStaffReply={handleSimulateStaffReply}
        />
      )}

      {/* Guest Ticket Lookup Modal */}
      <GuestLookupModal
        isOpen={isGuestLookupOpen}
        onClose={() => setIsGuestLookupOpen(false)}
        tickets={tickets}
        onSelectTicket={(t) => {
          setActiveTicketId(t.id);
        }}
      />

      {/* Strict Theme Footer */}
      <footer className="mt-auto border-t border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <SanelowLogo size={40} color="#DC2626" className="shrink-0" />
              <div>
                <span className="text-base font-extrabold tracking-tight text-black font-sans uppercase">
                  SANELOW <span className="text-red-600">MUSIC GROUP</span>
                </span>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Official Record Label Support Desk & Merch Fulfillment Network.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-600 font-medium">
              <button
                onClick={() => setCurrentTab('contact')}
                className="hover:text-black cursor-pointer"
              >
                Contact Desk
              </button>
              <button
                onClick={() => setCurrentTab('faq')}
                className="hover:text-black cursor-pointer"
              >
                FAQ & Vinyl Shipping
              </button>
              <button
                onClick={() => setCurrentTab('create')}
                className="hover:text-black cursor-pointer"
              >
                Open Ticket
              </button>
              <button
                onClick={() => setCurrentTab('dashboard')}
                className="hover:text-black cursor-pointer"
              >
                Track Tickets
              </button>
              <button
                onClick={() => setIsGuestLookupOpen(true)}
                className="hover:text-red-600 cursor-pointer"
              >
                Guest Lookup
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-mono">
            <div>
              <span>Mon–Fri 8:00 AM – 8:00 PM EST</span>
              <span className="mx-2">·</span>
              <span>support@sanelowmusic.com</span>
            </div>
            <div>
              <span>© 2026 SANELOW MUSIC GROUP. ALL RIGHTS RESERVED.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
