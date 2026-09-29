import React, { useState, useEffect } from 'react';
import {
  Ticket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  TicketAttachment,
  UserProfile,
  UserRole,
  InAppNotification,
  EmailLog,
  AgentInfo,
} from './types';
import {
  INITIAL_USER,
  INITIAL_TICKETS,
  INITIAL_NOTIFICATIONS,
  DEMO_PROFILES,
  AVAILABLE_AGENTS,
  SUPPORT_AVATAR,
} from './data/mockData';
import { emailService } from './services/emailService';
import { realtimeManager } from './services/realtimeService';
import { Header } from './components/Header';
import { ContactCards } from './components/ContactCards';
import { FaqSection } from './components/FaqSection';
import { CreateTicketForm } from './components/CreateTicketForm';
import { TicketDashboard } from './components/TicketDashboard';
import { TicketThreadModal } from './components/TicketThreadModal';
import { GuestLookupModal } from './components/GuestLookupModal';
import { AuthModal } from './components/AuthModal';
import { VercelSetupModal } from './components/VercelSetupModal';
import { EmailPreviewModal } from './components/EmailPreviewModal';
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
  Zap,
  Mail,
} from 'lucide-react';

export default function App() {
  // Navigation & User State
  const [currentTab, setCurrentTab] = useState<'contact' | 'create' | 'dashboard' | 'faq'>('contact');
  const [dashboardSubTab, setDashboardSubTab] = useState<'tickets' | 'orders'>('tickets');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [notifications, setNotifications] = useState<InAppNotification[]>(INITIAL_NOTIFICATIONS);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);

  // Modals state
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [prefillCategory, setPrefillCategory] = useState<TicketCategory | undefined>(undefined);
  const [isGuestLookupOpen, setIsGuestLookupOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);
  const [emailPreviewTicket, setEmailPreviewTicket] = useState<Ticket | null>(null);

  // Loading simulation state
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);

  // Banner toast
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setBannerNotice(msg);
    setTimeout(() => setBannerNotice(null), 3500);
  };

  // Subscribe to email service logs
  useEffect(() => {
    const unsubscribe = emailService.subscribe((logs) => {
      setEmailLogs(logs);
    });
    return unsubscribe;
  }, []);

  // Quick switch role
  const handleQuickSwitchRole = (role: UserRole) => {
    const profile = DEMO_PROFILES[role];
    if (profile) {
      setUser(profile);
      showNotice(`Active role: ${role.toUpperCase()} (${profile.name})`);
    }
  };

  // Notification actions
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showNotice('All in-app alerts marked as read.');
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    showNotice('Notifications cleared.');
  };

  const handleSelectTicketFromNotification = (ticketId: string) => {
    const found = tickets.find((t) => t.id === ticketId);
    if (found) {
      setActiveTicketId(ticketId);
    } else {
      showNotice(`Ticket ${ticketId} not found in current queue.`);
    }
  };

  // Create ticket handler
  const handleCreateTicket = async (newTicket: Ticket) => {
    setTickets((prev) => [newTicket, ...prev]);

    // Dispatch automated confirmation email
    await emailService.sendTicketConfirmation(newTicket);

    // Push in-app notification
    const newNotif: InAppNotification = {
      id: `notif_${Date.now()}`,
      ticketId: newTicket.id,
      ticketSubject: newTicket.subject,
      title: `Ticket Logged: ${newTicket.id}`,
      message: `Confirmation email sent to ${newTicket.customerEmail}. Our team has received your inquiry.`,
      type: 'created',
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showNotice(`Ticket ${newTicket.id} logged & confirmation email dispatched!`);
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
  const handleSendMessage = async (
    ticketId: string,
    content: string,
    attachments: TicketAttachment[],
    isInternal: boolean = false
  ) => {
    let sentMessage: any = null;

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const isStaffSender = user.role === 'agent' || user.role === 'admin';
          const newMsg = {
            id: `msg_${Date.now()}`,
            senderId: user.isGuest ? 'guest' : user.id,
            senderName: user.isGuest ? t.customerName : user.name,
            senderRole: user.role === 'customer' ? ('customer' as const) : ('agent' as const),
            avatar: user.avatar,
            content,
            attachments,
            isInternal,
            createdAt: new Date().toISOString(),
          };
          sentMessage = newMsg;

          // Determine next status:
          // If customer replies, status becomes 'in_progress' or 'open'
          // If staff replies to customer, status becomes 'pending_user'
          let updatedStatus = t.status;
          if (!isInternal) {
            if (isStaffSender && t.status !== 'resolved' && t.status !== 'closed') {
              updatedStatus = 'pending_user';
            } else if (!isStaffSender && (t.status === 'pending_user' || t.status === 'open')) {
              updatedStatus = 'in_progress';
            }
          }

          return {
            ...t,
            messages: [...t.messages, newMsg],
            status: updatedStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );

    // If message is public, broadcast real-time event and trigger email
    const currentTicket = tickets.find((t) => t.id === ticketId);
    if (currentTicket && sentMessage && !isInternal) {
      realtimeManager.publish(`ticket-${ticketId}`, 'new_message', sentMessage);
      await emailService.sendNewReplyNotification(currentTicket, sentMessage);

      // In-app alert
      const alertNotif: InAppNotification = {
        id: `notif_${Date.now()}`,
        ticketId: currentTicket.id,
        ticketSubject: currentTicket.subject,
        title: `New message on ${currentTicket.id}`,
        message: `${sentMessage.senderName}: "${content.slice(0, 75)}${content.length > 75 ? '...' : ''}"`,
        type: 'reply',
        read: false,
        createdAt: new Date().toISOString(),
        senderName: sentMessage.senderName,
      };
      setNotifications((prev) => [alertNotif, ...prev]);
    }
  };

  // Update status (e.g. resolve / reopen / closed)
  const handleUpdateStatus = async (ticketId: string, status: TicketStatus) => {
    let affectedTicket: Ticket | undefined;

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          affectedTicket = { ...t, status, updatedAt: new Date().toISOString() };
          return affectedTicket;
        }
        return t;
      })
    );

    if (affectedTicket) {
      realtimeManager.publish(`ticket-${ticketId}`, 'status_change', { status });
      await emailService.sendStatusChangeNotification(affectedTicket, status);

      const statusNotif: InAppNotification = {
        id: `notif_${Date.now()}`,
        ticketId: affectedTicket.id,
        ticketSubject: affectedTicket.subject,
        title: `Status Changed: ${status.toUpperCase()}`,
        message: `Ticket ${affectedTicket.id} was updated to ${status}. Notification email sent to ${affectedTicket.customerEmail}.`,
        type: 'status_change',
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [statusNotif, ...prev]);
    }
  };

  // Update priority
  const handleUpdatePriority = (ticketId: string, priority: TicketPriority) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, priority, updatedAt: new Date().toISOString() } : t))
    );
    showNotice(`Priority updated to ${priority.toUpperCase()}`);
  };

  // Assign agent
  const handleAssignAgent = (ticketId: string, agent: AgentInfo | null) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, assignedAgent: agent, updatedAt: new Date().toISOString() } : t
      )
    );

    if (agent) {
      const assignNotif: InAppNotification = {
        id: `notif_${Date.now()}`,
        ticketId,
        ticketSubject: tickets.find((t) => t.id === ticketId)?.subject || '',
        title: `Ticket Assigned to ${agent.name}`,
        message: `${agent.name} (${agent.title}) has taken ownership of this ticket.`,
        type: 'assignment',
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [assignNotif, ...prev]);
    }
  };

  // Refresh ticket list with skeleton loader
  const handleRefreshTickets = () => {
    setIsLoadingTickets(true);
    setTimeout(() => {
      setIsLoadingTickets(false);
      showNotice('Ticket queue synchronized with serverless data layer.');
    }, 900);
  };

  // Open ticket form with prefilled order
  const handleOpenTicketForOrder = (orderId: string) => {
    setCurrentTab('create');
    setPrefillCategory('Damaged / Misprinted Item');
  };

  // Open Email Preview for a ticket
  const handleOpenEmailPreviewForTicket = (ticket: Ticket) => {
    setEmailPreviewTicket(ticket);
    setIsEmailPreviewOpen(true);
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

      {/* Header with Navigation, Notifications, Roles, and Vercel Specs */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        ticketCount={tickets.filter((t) => t.status !== 'resolved' && t.status !== 'closed').length}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        onClearAllNotifications={handleClearAllNotifications}
        onSelectTicketFromNotification={handleSelectTicketFromNotification}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenVercelModal={() => setIsVercelModalOpen(true)}
        onQuickSwitchRole={handleQuickSwitchRole}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* VIEW 1: CONTACT & HELP CENTER */}
        {currentTab === 'contact' && (
          <div>
            {/* Page Header / Hero Section */}
            <div className="mb-10 text-center sm:text-left border-b border-neutral-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                  <SanelowLogo size={18} color="#DC2626" className="inline-block shrink-0" />
                  <span>Sanelow Music Group Operations</span>
                  <span>·</span>
                  <span className="text-red-600 font-semibold">Vercel Serverless Ready</span>
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
                  onClick={() => setIsVercelModalOpen(true)}
                  className="cursor-pointer px-3.5 py-2 text-xs font-mono font-medium text-black bg-white border border-neutral-300 hover:border-black transition-colors flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-neutral-900" />
                  <span>Vercel Architecture</span>
                </button>
                <button
                  onClick={() => setIsGuestLookupOpen(true)}
                  className="cursor-pointer px-4 py-2 text-xs font-medium text-black bg-white border border-neutral-300 hover:border-black transition-colors flex items-center gap-1.5"
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

            {/* User Active Tickets Quick Glance */}
            {tickets.length > 0 && (
              <div className="mb-12 border border-neutral-200 bg-neutral-50/60 p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                      Active Ticket Activity ({tickets.filter((t) => t.status !== 'resolved' && t.status !== 'closed').length} open)
                    </h2>
                  </div>
                  <button
                    onClick={() => setCurrentTab('dashboard')}
                    className="cursor-pointer text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <span>Go to Full Ticket Queue</span>
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

        {/* VIEW 2: SUBMIT TICKET FORM */}
        {currentTab === 'create' && (
          <div>
            <CreateTicketForm
              user={user}
              prefillCategory={prefillCategory}
              onSubmitTicket={handleCreateTicket}
              onSwitchToAuth={() => setIsAuthModalOpen(true)}
              onViewTicket={(ticketId) => {
                setActiveTicketId(ticketId);
              }}
            />
          </div>
        )}

        {/* VIEW 3: SUPPORT & TICKET DASHBOARD */}
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
                {user.role === 'customer' ? 'My Support Tickets' : 'Operations Queue'} ({tickets.length})
              </button>
              {!user.isGuest && user.orders && user.orders.length > 0 && (
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

        {/* VIEW 4: DEDICATED FAQ & SIZING GUIDE */}
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
          onUpdatePriority={handleUpdatePriority}
          onAssignAgent={handleAssignAgent}
          onOpenEmailPreview={handleOpenEmailPreviewForTicket}
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

      {/* Role-Based Authentication & Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={(newUser) => {
          setUser(newUser);
          showNotice(`Logged in as ${newUser.name} (${newUser.role})`);
        }}
        currentRole={user.role}
      />

      {/* Vercel Architecture & Deployment Specs Modal */}
      {isVercelModalOpen && (
        <VercelSetupModal onClose={() => setIsVercelModalOpen(false)} />
      )}

      {/* Email Notification & Template Preview Modal */}
      {isEmailPreviewOpen && emailPreviewTicket && (
        <EmailPreviewModal
          ticket={emailPreviewTicket}
          emailLogs={emailLogs}
          onClose={() => setIsEmailPreviewOpen(false)}
          onSendTestEmail={async (tmpl) => {
            if (tmpl === 'ticket_confirmation') {
              await emailService.sendTicketConfirmation(emailPreviewTicket);
            } else if (tmpl === 'new_reply') {
              const lastMsg =
                emailPreviewTicket.messages[emailPreviewTicket.messages.length - 1] || {
                  id: 'demo',
                  senderId: 'staff',
                  senderName: 'Alex Vance',
                  senderRole: 'agent',
                  content: 'Test reply dispatch from preview inspector.',
                  createdAt: new Date().toISOString(),
                };
              await emailService.sendNewReplyNotification(emailPreviewTicket, lastMsg);
            } else if (tmpl === 'status_changed') {
              await emailService.sendStatusChangeNotification(
                emailPreviewTicket,
                emailPreviewTicket.status
              );
            }
          }}
        />
      )}

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
              <button
                onClick={() => setIsVercelModalOpen(true)}
                className="text-neutral-900 font-mono hover:text-red-600 cursor-pointer flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-red-600" />
                <span>Vercel Deploy Guide</span>
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
