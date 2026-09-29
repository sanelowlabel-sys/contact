export type UserRole = 'customer' | 'agent' | 'admin';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketStatus = 'open' | 'in_progress' | 'pending_user' | 'resolved' | 'closed';

export type TicketCategory =
  | 'Order Tracking'
  | 'Return / Refund'
  | 'Size Exchange'
  | 'Damaged / Misprinted Item'
  | 'Pre-Order Fulfillment'
  | 'Wholesale / Bulk'
  | 'General Inquiry';

export interface TicketAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
  previewUrl?: string;
  uploadedAt: string;
}

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'agent' | 'admin' | 'staff' | 'system';
  avatar?: string;
  content: string;
  attachments?: TicketAttachment[];
  createdAt: string;
  isInternal?: boolean; // For private staff notes not visible to customers
}

export interface AgentInfo {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
}

export interface Ticket {
  id: string; // formatted as '#TK-8492'
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  customerName: string;
  customerEmail: string;
  orderNumber?: string;
  assignedAgent?: AgentInfo | null;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  attachments: TicketAttachment[];
  userId?: string;
  emailNotificationEnabled: boolean;
}

export interface UserOrder {
  id: string; // formatted as '#ORD-9182'
  date: string;
  items: string[];
  total: string;
  status: 'Delivered' | 'In Transit' | 'Processing';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isGuest: boolean;
  avatar?: string;
  orders: UserOrder[];
}

export interface InAppNotification {
  id: string;
  ticketId: string;
  ticketSubject: string;
  title: string;
  message: string;
  type: 'reply' | 'status_change' | 'assignment' | 'created';
  read: boolean;
  createdAt: string;
  senderName?: string;
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  template: 'ticket_confirmation' | 'new_reply' | 'status_changed';
  ticketId: string;
  sentAt: string;
  status: 'sent' | 'simulated';
  previewHtml: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Shipping' | 'Sizing & Blanks' | 'Pre-Orders' | 'Cancellations & Returns' | 'Care & Quality';
}
