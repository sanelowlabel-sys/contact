import { Ticket, TicketMessage } from '../types';

export interface EmailRenderResult {
  subject: string;
  html: string;
  text: string;
}

export function generateTicketConfirmationEmail(ticket: Ticket): EmailRenderResult {
  const subject = `[Sanelow Music Group Support] Ticket Received: ${ticket.id} - ${ticket.subject}`;
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F9FAFB; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);" cellspacing="0" cellpadding="0">
          
          <!-- Header Bar with Red Accent -->
          <tr>
            <td style="background-color: #000000; padding: 24px 32px; border-bottom: 3px solid #DC2626;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="color: #FFFFFF; font-size: 18px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                      SANELOW <span style="color: #DC2626;">MUSIC GROUP</span>
                    </span>
                    <div style="color: #9CA3AF; font-size: 11px; font-family: monospace; letter-spacing: 1px; text-transform: uppercase; margin-top: 4px;">
                      Customer Support Desk & Tour Logistics
                    </div>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: #DC2626; color: #FFFFFF; font-family: monospace; font-size: 12px; font-weight: 700; padding: 4px 8px; border-radius: 2px;">
                      ${ticket.id}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 16px; font-size: 22px; font-weight: 800; color: #000000; letter-spacing: -0.5px;">
                Support Request Logged
              </h1>
              <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #4B5563;">
                Hi <strong>${ticket.customerName}</strong>,
              </p>
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #4B5563;">
                Thank you for contacting Sanelow Music Group Support. Your request has been assigned ticket ID <strong>${ticket.id}</strong>. Our merchandise and tour fulfillment specialists review every inquiry with highest priority.
              </p>

              <!-- Ticket Overview Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-left: 4px solid #DC2626; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <div style="font-size: 12px; font-family: monospace; text-transform: uppercase; color: #6B7280; margin-bottom: 4px;">Ticket Subject</div>
                    <div style="font-size: 15px; font-weight: 700; color: #000000; margin-bottom: 12px;">${ticket.subject}</div>
                    
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="50%" style="font-size: 13px; color: #4B5563; padding: 4px 0;">
                          <strong style="color: #111827;">Category:</strong> ${ticket.category}
                        </td>
                        <td width="50%" style="font-size: 13px; color: #4B5563; padding: 4px 0;">
                          <strong style="color: #111827;">Priority:</strong> <span style="text-transform: uppercase; font-family: monospace; font-weight: 700; color: #DC2626;">${ticket.priority}</span>
                        </td>
                      </tr>
                      ${ticket.orderNumber ? `
                      <tr>
                        <td colspan="2" style="font-size: 13px; color: #4B5563; padding: 4px 0;">
                          <strong style="color: #111827;">Associated Order:</strong> <span style="font-family: monospace; font-weight: 600;">${ticket.orderNumber}</span>
                        </td>
                      </tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Description Snapshot -->
              <div style="margin-bottom: 28px;">
                <div style="font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 6px;">Your Issue Description:</div>
                <div style="font-size: 14px; line-height: 1.6; color: #4B5563; background-color: #FFFFFF; border: 1px solid #E5E7EB; padding: 14px; border-radius: 3px;">
                  ${ticket.description}
                </div>
              </div>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="#view-ticket-${ticket.id}" style="display: inline-block; background-color: #DC2626; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Track Ticket & Live Thread &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #6B7280;">
                Need to attach additional photos or tracking receipts? You can upload files anytime directly inside your ticket thread.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F3F4F6; padding: 20px 32px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #6B7280; line-height: 1.5;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <strong>Sanelow Music Group Operations</strong><br>
                    Global Merch Fulfillment & Artist Management<br>
                    support@sanelowmusic.com &bull; Los Angeles &bull; London &bull; Tokyo
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="font-family: monospace; font-size: 11px; color: #9CA3AF;">REF: ${ticket.id}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `SANELOW MUSIC GROUP SUPPORT\nTicket Received: ${ticket.id}\n\nHi ${ticket.customerName},\nYour support request regarding "${ticket.subject}" has been received.\nCategory: ${ticket.category}\nPriority: ${ticket.priority}\nStatus: ${ticket.status}\n\nTrack your ticket thread at: https://support.sanelowmusic.com/tickets/${ticket.id}`;

  return { subject, html, text };
}

export function generateNewReplyEmail(ticket: Ticket, message: TicketMessage): EmailRenderResult {
  const isFromAgent = message.senderRole === 'agent' || message.senderRole === 'staff';
  const recipientName = isFromAgent ? ticket.customerName : (ticket.assignedAgent?.name || 'Support Desk');
  const subject = `[Update on ${ticket.id}] New message from ${message.senderName}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F9FAFB; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);" cellspacing="0" cellpadding="0">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #000000; padding: 24px 32px; border-bottom: 3px solid #DC2626;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="color: #FFFFFF; font-size: 18px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                      SANELOW <span style="color: #DC2626;">MUSIC GROUP</span>
                    </span>
                    <div style="color: #9CA3AF; font-size: 11px; font-family: monospace; letter-spacing: 1px; text-transform: uppercase; margin-top: 4px;">
                      Ticket Conversation Update
                    </div>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: #DC2626; color: #FFFFFF; font-family: monospace; font-size: 12px; font-weight: 700; padding: 4px 8px; border-radius: 2px;">
                      ${ticket.id}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <div style="font-size: 12px; font-family: monospace; text-transform: uppercase; color: #DC2626; font-weight: 700; margin-bottom: 6px;">
                New Response Added
              </div>
              <h1 style="margin: 0 0 12px; font-size: 20px; font-weight: 800; color: #000000; letter-spacing: -0.5px;">
                ${ticket.subject}
              </h1>
              <p style="margin: 0 0 20px; font-size: 14px; color: #4B5563;">
                Hi <strong>${recipientName}</strong>, a new response has been posted by <strong>${message.senderName}</strong>:
              </p>

              <!-- Message Speech Bubble -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-left: 4px solid ${isFromAgent ? '#DC2626' : '#000000'}; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 18px;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                      <strong style="color: #111827; font-size: 14px;">${message.senderName}</strong>
                      <span style="font-size: 11px; font-family: monospace; color: #6B7280; margin-left: 8px;">
                        (${isFromAgent ? 'Sanelow Support Agent' : 'Customer'})
                      </span>
                    </div>
                    <div style="font-size: 14px; line-height: 1.6; color: #374151; white-space: pre-wrap;">
                      ${message.content}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Action button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="#view-ticket-${ticket.id}" style="display: inline-block; background-color: #DC2626; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 13px 26px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Reply to Message &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #9CA3AF; text-align: center;">
                You can reply directly through your browser session or by clicking the link above.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F3F4F6; padding: 18px 32px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #6B7280;">
              Sanelow Music Group Support &bull; Automated Dispatch System &bull; Reference ${ticket.id}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `SANELOW MUSIC GROUP SUPPORT\nUpdate on ${ticket.id}: ${ticket.subject}\n\nNew message from ${message.senderName}:\n"${message.content}"\n\nReply at: https://support.sanelowmusic.com/tickets/${ticket.id}`;

  return { subject, html, text };
}

export function generateStatusChangeEmail(ticket: Ticket, newStatus: string): EmailRenderResult {
  const isResolved = newStatus === 'resolved';
  const subject = `[Ticket ${ticket.id}] Status Updated: ${newStatus.toUpperCase()}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F9FAFB; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);" cellspacing="0" cellpadding="0">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #000000; padding: 24px 32px; border-bottom: 3px solid ${isResolved ? '#10B981' : '#DC2626'};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="color: #FFFFFF; font-size: 18px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                      SANELOW <span style="color: #DC2626;">MUSIC GROUP</span>
                    </span>
                    <div style="color: #9CA3AF; font-size: 11px; font-family: monospace; letter-spacing: 1px; text-transform: uppercase; margin-top: 4px;">
                      Ticket Status Notice
                    </div>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: ${isResolved ? '#10B981' : '#DC2626'}; color: #FFFFFF; font-family: monospace; font-size: 12px; font-weight: 700; padding: 4px 8px; border-radius: 2px;">
                      ${newStatus.toUpperCase()}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 12px; font-size: 22px; font-weight: 800; color: #000000; letter-spacing: -0.5px;">
                ${isResolved ? 'Ticket Marked as Resolved' : `Status Updated to ${newStatus}`}
              </h1>
              <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #4B5563;">
                Hi <strong>${ticket.customerName}</strong>,
              </p>
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #4B5563;">
                ${isResolved
                  ? `Your ticket <strong>${ticket.id}</strong> ("${ticket.subject}") has been marked as resolved. If you have any further questions or if your issue is not fully settled, you can reopen this ticket at any time.`
                  : `Your ticket <strong>${ticket.id}</strong> status has been updated to <strong>${newStatus}</strong> by our support team.`}
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="#view-ticket-${ticket.id}" style="display: inline-block; background-color: #000000; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 13px 26px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.5px;">
                      View Ticket Details &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F3F4F6; padding: 18px 32px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #6B7280;">
              Sanelow Music Group Support &bull; Reference ${ticket.id}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `SANELOW MUSIC GROUP SUPPORT\nTicket ${ticket.id} status changed to ${newStatus}.\nSubject: ${ticket.subject}\n\nView ticket at: https://support.sanelowmusic.com/tickets/${ticket.id}`;

  return { subject, html, text };
}
