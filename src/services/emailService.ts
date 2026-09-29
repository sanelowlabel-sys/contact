import { EmailLog, Ticket, TicketMessage } from '../types';
import {
  generateTicketConfirmationEmail,
  generateNewReplyEmail,
  generateStatusChangeEmail,
} from '../utils/emailTemplates';

class EmailService {
  private logs: EmailLog[] = [];
  private listeners: Set<(logs: EmailLog[]) => void> = new Set();

  public subscribe(listener: (logs: EmailLog[]) => void): () => void {
    this.listeners.add(listener);
    listener([...this.logs]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn([...this.logs]));
  }

  public getLogs(): EmailLog[] {
    return [...this.logs];
  }

  public async sendTicketConfirmation(ticket: Ticket): Promise<EmailLog> {
    const rendered = generateTicketConfirmationEmail(ticket);
    const log: EmailLog = {
      id: `email_${Date.now()}_conf`,
      to: ticket.customerEmail,
      subject: rendered.subject,
      template: 'ticket_confirmation',
      ticketId: ticket.id,
      sentAt: new Date().toISOString(),
      status: 'sent',
      previewHtml: rendered.html,
    };

    // Attempt to hit backend /api/email if available
    try {
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: ticket.customerEmail,
          subject: rendered.subject,
          html: rendered.html,
          type: 'ticket_confirmation',
          ticketId: ticket.id,
        }),
      }).catch(() => {
        // Fallback for client-only preview
      });
    } catch {
      // Ignored
    }

    this.logs.unshift(log);
    this.notify();
    return log;
  }

  public async sendNewReplyNotification(
    ticket: Ticket,
    message: TicketMessage
  ): Promise<EmailLog> {
    const isFromAgent = message.senderRole === 'agent' || message.senderRole === 'staff';
    const recipientEmail = isFromAgent
      ? ticket.customerEmail
      : (ticket.assignedAgent?.email || 'support@sanelowmusic.com');

    const rendered = generateNewReplyEmail(ticket, message);
    const log: EmailLog = {
      id: `email_${Date.now()}_reply`,
      to: recipientEmail,
      subject: rendered.subject,
      template: 'new_reply',
      ticketId: ticket.id,
      sentAt: new Date().toISOString(),
      status: 'sent',
      previewHtml: rendered.html,
    };

    try {
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipientEmail,
          subject: rendered.subject,
          html: rendered.html,
          type: 'new_reply',
          ticketId: ticket.id,
        }),
      }).catch(() => {});
    } catch {
      // Ignored
    }

    this.logs.unshift(log);
    this.notify();
    return log;
  }

  public async sendStatusChangeNotification(
    ticket: Ticket,
    newStatus: string
  ): Promise<EmailLog> {
    const rendered = generateStatusChangeEmail(ticket, newStatus);
    const log: EmailLog = {
      id: `email_${Date.now()}_status`,
      to: ticket.customerEmail,
      subject: rendered.subject,
      template: 'status_changed',
      ticketId: ticket.id,
      sentAt: new Date().toISOString(),
      status: 'sent',
      previewHtml: rendered.html,
    };

    try {
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: ticket.customerEmail,
          subject: rendered.subject,
          html: rendered.html,
          type: 'status_changed',
          ticketId: ticket.id,
        }),
      }).catch(() => {});
    } catch {
      // Ignored
    }

    this.logs.unshift(log);
    this.notify();
    return log;
  }
}

export const emailService = new EmailService();
