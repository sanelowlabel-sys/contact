export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';

export type TicketStatus = 'pending_agent' | 'in_progress' | 'awaiting_reply' | 'resolved';

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
  senderRole: 'customer' | 'staff' | 'system';
  avatar?: string;
  content: string;
  attachments?: TicketAttachment[];
  createdAt: string;
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
  isGuest: boolean;
  orders: UserOrder[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Shipping' | 'Sizing & Blanks' | 'Pre-Orders' | 'Cancellations & Returns' | 'Care & Quality';
}
