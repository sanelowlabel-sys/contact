import { Ticket, TicketMessage, TicketStatus, AgentInfo } from '../types';

export type RealtimeListener = (data: any) => void;

class RealtimeManager {
  private listeners: Map<string, Set<RealtimeListener>> = new Map();
  private typingTimers: Map<string, NodeJS.Timeout> = new Map();

  // Subscribe to channel (e.g. `ticket-#TK-8492` or `global-notifications`)
  public subscribe(channel: string, listener: RealtimeListener): () => void {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set());
    }
    this.listeners.get(channel)!.add(listener);

    return () => {
      const set = this.listeners.get(channel);
      if (set) {
        set.delete(listener);
        if (set.size === 0) {
          this.listeners.delete(channel);
        }
      }
    };
  }

  // Publish event to channel (in production, triggers Pusher / Supabase Realtime serverless event)
  public publish(channel: string, event: string, payload: any) {
    const set = this.listeners.get(channel);
    if (set) {
      set.forEach((listener) => {
        try {
          listener({ event, payload, timestamp: new Date().toISOString() });
        } catch (err) {
          console.error('[RealtimeManager] Listener error:', err);
        }
      });
    }
  }

  // Simulate an agent typing and responding in real-time
  public simulateAgentResponse(
    ticket: Ticket,
    agent: AgentInfo,
    onTypingStateChange: (isTyping: boolean) => void,
    onMessageCreated: (message: TicketMessage) => void
  ) {
    // 1. Start typing indicator
    onTypingStateChange(true);
    this.publish(`ticket-${ticket.id}`, 'typing', { user: agent.name, isTyping: true });

    // 2. Delay 2.5 seconds to simulate real human agent typing
    const timer = setTimeout(() => {
      onTypingStateChange(false);
      this.publish(`ticket-${ticket.id}`, 'typing', { user: agent.name, isTyping: false });

      // Generate context-aware reply
      let replyText = `Hi ${ticket.customerName}, thanks for the update. I have reviewed your ticket notes and updated the logistics record. We will follow up with confirmation details shortly.`;
      
      if (ticket.category === 'Damaged / Misprinted Item') {
        replyText = `Hi ${ticket.customerName}, our warehouse manager has logged the misprinted batch issue. A replacement unit has been packed with priority inspection and will ship out tomorrow morning.`;
      } else if (ticket.category === 'Size Exchange') {
        replyText = `Hi ${ticket.customerName}, the 2XL size reservation has been locked in. Once the return parcel scans at your local post office, your exchange automatically dispatches.`;
      } else if (ticket.category === 'Order Tracking') {
        replyText = `Hi ${ticket.customerName}, I contacted our carrier regional rep. The scan delay was caused by a weekend hub transfer; packages are scanning again today.`;
      }

      const newMsg: TicketMessage = {
        id: `msg_live_${Date.now()}`,
        senderId: agent.id,
        senderName: agent.name,
        senderRole: 'agent',
        avatar: agent.avatar,
        content: replyText,
        createdAt: new Date().toISOString(),
      };

      onMessageCreated(newMsg);
      this.publish(`ticket-${ticket.id}`, 'new_message', newMsg);
    }, 2400);

    this.typingTimers.set(ticket.id, timer);
  }

  public cancelSimulation(ticketId: string) {
    const timer = this.typingTimers.get(ticketId);
    if (timer) {
      clearTimeout(timer);
      this.typingTimers.delete(ticketId);
    }
  }
}

export const realtimeManager = new RealtimeManager();
