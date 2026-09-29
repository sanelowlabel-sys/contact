import { AgentInfo, FAQItem, InAppNotification, Ticket, UserProfile } from '../types';

export const SUPPORT_AVATAR = '/src/assets/images/support_lead_avatar_1790136139952.jpg';
export const MERCH_SAMPLE_IMAGE = '/src/assets/images/merch_sample_hoodie_1790136151327.jpg';

export const AVAILABLE_AGENTS: AgentInfo[] = [
  {
    id: 'staff_alex',
    name: 'Alex Vance',
    email: 'alex.vance@sanelowmusic.com',
    avatar: SUPPORT_AVATAR,
    title: 'Senior Merch Operations Lead',
  },
  {
    id: 'staff_maya',
    name: 'Maya Lin',
    email: 'maya.lin@sanelowmusic.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Vinyl Pressing & QA Specialist',
  },
  {
    id: 'staff_marcus',
    name: 'Marcus Brody',
    email: 'marcus.brody@sanelowmusic.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Global Fulfillment Director',
  },
];

export const DEMO_PROFILES: Record<string, UserProfile> = {
  customer: {
    id: 'usr_88291',
    name: 'Jordan Mercer',
    email: 'jordan.mercer@gmail.com',
    role: 'customer',
    isGuest: false,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    orders: [
      {
        id: '#ORD-9182',
        date: 'Sept 10, 2026',
        items: ['World Tour Heavyweight Hoodie (L)', 'Gatefold 2xLP Vinyl Collector Edition'],
        total: '$148.00',
        status: 'Delivered',
      },
      {
        id: '#ORD-8821',
        date: 'Sept 02, 2026',
        items: ['Acid Wash Vintage Tour Graphic Tee (XL)'],
        total: '$48.00',
        status: 'Delivered',
      },
      {
        id: '#ORD-7409',
        date: 'Aug 18, 2026',
        items: ['Embroidered Skull Beanie', 'Screenprinted Tour Poster Pack (18x24)'],
        total: '$62.00',
        status: 'In Transit',
      },
    ],
  },
  agent: {
    id: 'staff_alex',
    name: 'Alex Vance',
    email: 'alex.vance@sanelowmusic.com',
    role: 'agent',
    isGuest: false,
    avatar: SUPPORT_AVATAR,
    orders: [],
  },
  admin: {
    id: 'admin_elena',
    name: 'Elena Rostova',
    email: 'elena.rostova@sanelowmusic.com',
    role: 'admin',
    isGuest: false,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    orders: [],
  },
  guest: {
    id: 'guest_session',
    name: 'Guest Customer',
    email: '',
    role: 'customer',
    isGuest: true,
    orders: [],
  },
};

export const INITIAL_USER: UserProfile = DEMO_PROFILES.customer;

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: '#TK-8492',
    subject: 'Front chest screenprint misalignment on Tour Hoodie',
    description:
      'I received my order #ORD-9182 yesterday. The heavyweight hoodie quality is great, but the front graphic print is noticeably tilted ~15 degrees to the left and has some ink smudging on the lower hem. Photo proof attached.',
    category: 'Damaged / Misprinted Item',
    priority: 'urgent',
    status: 'pending_user',
    customerName: 'Jordan Mercer',
    customerEmail: 'jordan.mercer@gmail.com',
    orderNumber: '#ORD-9182',
    assignedAgent: AVAILABLE_AGENTS[0],
    createdAt: '2026-09-20T14:32:00Z',
    updatedAt: '2026-09-21T09:15:00Z',
    userId: 'usr_88291',
    emailNotificationEnabled: true,
    attachments: [
      {
        id: 'att_01',
        name: 'misprinted_chest_graphic.jpg',
        size: '2.4 MB',
        type: 'image/jpeg',
        url: MERCH_SAMPLE_IMAGE,
        uploadedAt: '2026-09-20T14:32:00Z',
      },
    ],
    messages: [
      {
        id: 'msg_01',
        senderId: 'usr_88291',
        senderName: 'Jordan Mercer',
        senderRole: 'customer',
        content:
          'Hi Team, just unpacked order #ORD-9182. The World Tour Hoodie graphic is skewed and there is ink bleeds. Would love to get a replacement before the show next Friday!',
        attachments: [
          {
            id: 'att_01',
            name: 'misprinted_chest_graphic.jpg',
            size: '2.4 MB',
            type: 'image/jpeg',
            url: MERCH_SAMPLE_IMAGE,
            uploadedAt: '2026-09-20T14:32:00Z',
          },
        ],
        createdAt: '2026-09-20T14:32:00Z',
      },
      {
        id: 'msg_02',
        senderId: 'staff_alex',
        senderName: 'Alex Vance',
        senderRole: 'agent',
        avatar: SUPPORT_AVATAR,
        content:
          'Hi Jordan! Thanks for bringing this to our attention and sharing clear photos. That print tilt definitely slipped through our QA check at the factory. We have authorized a priority replacement hoodie for you at zero extra charge. Can you confirm if your shipping address on file is still current?',
        createdAt: '2026-09-21T09:15:00Z',
      },
      {
        id: 'msg_03_internal',
        senderId: 'staff_alex',
        senderName: 'Alex Vance',
        senderRole: 'agent',
        avatar: SUPPORT_AVATAR,
        content:
          '[Internal Staff Note]: Warehouse SKU #WT-HD-BLK-L bin batch #802 has 3 reported tilted prints. Notified production QA team to pull remaining inventory from aisle C-4.',
        createdAt: '2026-09-21T09:20:00Z',
        isInternal: true,
      },
    ],
  },
  {
    id: '#TK-8120',
    subject: 'Size exchange inquiry: XL Acid Wash Graphic Tee fits slightly snug',
    description:
      'Wondering if I can exchange my XL tee for a 2XL? The garment has a boxier cut than expected and I prefer an oversized drape.',
    category: 'Size Exchange',
    priority: 'medium',
    status: 'in_progress',
    customerName: 'Jordan Mercer',
    customerEmail: 'jordan.mercer@gmail.com',
    orderNumber: '#ORD-8821',
    assignedAgent: AVAILABLE_AGENTS[0],
    createdAt: '2026-09-18T11:20:00Z',
    updatedAt: '2026-09-19T16:40:00Z',
    userId: 'usr_88291',
    emailNotificationEnabled: true,
    attachments: [],
    messages: [
      {
        id: 'msg_10',
        senderId: 'usr_88291',
        senderName: 'Jordan Mercer',
        senderRole: 'customer',
        content:
          'Hello, loved the wash on the graphic tee, but it fits a little tighter on the shoulders than my previous tour tees. Do you have 2XL in stock for exchange?',
        createdAt: '2026-09-18T11:20:00Z',
      },
      {
        id: 'msg_11',
        senderId: 'staff_alex',
        senderName: 'Alex Vance',
        senderRole: 'agent',
        avatar: SUPPORT_AVATAR,
        content:
          'Hey Jordan! Yes, we still have 14 units of the 2XL reserved at our warehouse. We have placed a 48-hour hold on one for you while your return label processes.',
        createdAt: '2026-09-19T16:40:00Z',
      },
    ],
  },
  {
    id: '#TK-7490',
    subject: 'Limited Edition Gatefold Vinyl pre-order dispatch timeline',
    description: 'Looking for an estimated ship date for the vinyl release included in order #ORD-9182.',
    category: 'Pre-Order Fulfillment',
    priority: 'low',
    status: 'resolved',
    customerName: 'Jordan Mercer',
    customerEmail: 'jordan.mercer@gmail.com',
    orderNumber: '#ORD-9182',
    assignedAgent: AVAILABLE_AGENTS[1],
    createdAt: '2026-09-12T09:05:00Z',
    updatedAt: '2026-09-13T10:00:00Z',
    userId: 'usr_88291',
    emailNotificationEnabled: true,
    attachments: [],
    messages: [
      {
        id: 'msg_20',
        senderId: 'usr_88291',
        senderName: 'Jordan Mercer',
        senderRole: 'customer',
        content: 'Hi! Just wondering if the vinyl will ship separately from the hoodie?',
        createdAt: '2026-09-12T09:05:00Z',
      },
      {
        id: 'msg_21',
        senderId: 'staff_maya',
        senderName: 'Maya Lin',
        senderRole: 'agent',
        avatar: AVAILABLE_AGENTS[1].avatar,
        content:
          'Hi Jordan! All vinyl pre-orders are packaged in specialized corrugated record mailers and dispatched separately to avoid crushing any apparel items. Your tracking info has been updated on your account.',
        createdAt: '2026-09-13T10:00:00Z',
      },
    ],
  },
  {
    id: '#TK-6921',
    subject: 'Order tracking status stuck at regional hub',
    description: 'Order #ORD-7409 has not shown scan updates for 5 business days with carrier.',
    category: 'Order Tracking',
    priority: 'high',
    status: 'open',
    customerName: 'Jordan Mercer',
    customerEmail: 'jordan.mercer@gmail.com',
    orderNumber: '#ORD-7409',
    assignedAgent: null,
    createdAt: '2026-09-22T08:30:00Z',
    updatedAt: '2026-09-22T08:30:00Z',
    userId: 'usr_88291',
    emailNotificationEnabled: true,
    attachments: [],
    messages: [
      {
        id: 'msg_30',
        senderId: 'usr_88291',
        senderName: 'Jordan Mercer',
        senderRole: 'customer',
        content:
          'Tracking hasn’t refreshed since Monday. Is the carrier delayed or has the package been transferred to local postal services?',
        createdAt: '2026-09-22T08:30:00Z',
      },
    ],
  },
  {
    id: '#TK-5830',
    subject: 'Wholesale inquiry for independent record shop in Austin, TX',
    description: 'Requesting wholesale catalog and bulk terms for Sanelow tour vinyl and apparel.',
    category: 'Wholesale / Bulk',
    priority: 'medium',
    status: 'closed',
    customerName: 'Samira Patel',
    customerEmail: 'samira@endofanear.com',
    assignedAgent: AVAILABLE_AGENTS[2],
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-04T15:00:00Z',
    userId: 'usr_ext_01',
    emailNotificationEnabled: true,
    attachments: [],
    messages: [
      {
        id: 'msg_40',
        senderId: 'usr_ext_01',
        senderName: 'Samira Patel',
        senderRole: 'customer',
        content: 'Hi, we would like to order 50 units of the Gatefold 2xLP for our Austin store.',
        createdAt: '2026-09-01T10:00:00Z',
      },
      {
        id: 'msg_41',
        senderId: 'staff_marcus',
        senderName: 'Marcus Brody',
        senderRole: 'agent',
        avatar: AVAILABLE_AGENTS[2].avatar,
        content: 'B2B dealer account approved. Invoice sent via wholesale portal.',
        createdAt: '2026-09-04T15:00:00Z',
      },
    ],
  },
];

export const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif_1',
    ticketId: '#TK-8492',
    ticketSubject: 'Front chest screenprint misalignment on Tour Hoodie',
    title: 'Alex Vance replied to your ticket',
    message: 'Authorized priority replacement hoodie at zero extra charge. Can you confirm your shipping address?',
    type: 'reply',
    read: false,
    createdAt: '2026-09-21T09:15:00Z',
    senderName: 'Alex Vance',
  },
  {
    id: 'notif_2',
    ticketId: '#TK-8120',
    ticketSubject: 'Size exchange inquiry: XL Acid Wash Graphic Tee',
    title: 'Ticket Status Updated to In Progress',
    message: 'Alex Vance placed a 48-hour hold on size 2XL inventory while return label is generated.',
    type: 'status_change',
    read: false,
    createdAt: '2026-09-19T16:40:00Z',
    senderName: 'Alex Vance',
  },
  {
    id: 'notif_3',
    ticketId: '#TK-7490',
    ticketSubject: 'Limited Edition Gatefold Vinyl pre-order dispatch timeline',
    title: 'Ticket Marked as Resolved',
    message: 'Maya Lin confirmed split-shipment dispatch in heavy corrugated mailers.',
    type: 'status_change',
    read: true,
    createdAt: '2026-09-13T10:00:00Z',
    senderName: 'Maya Lin',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq_1',
    category: 'Shipping',
    question: 'How long does standard and express shipping take for merchandise?',
    answer:
      'Standard domestic shipments are fulfilled within 1–2 business days and arrive within 3–5 business days via USPS Ground Advantage or UPS. Express 2-Day Air shipping is available at checkout for domestic orders placed before 1:00 PM EST. International shipments typically take 7–14 business days depending on customs clearance.',
  },
  {
    id: 'faq_2',
    category: 'Sizing & Blanks',
    question: 'What garment blanks do you use and how do they fit?',
    answer:
      'Our tour hoodies use 450 GSM ultra-heavyweight combed organic cotton fleece with a relaxed, boxy streetwear fit and double-lined hood. Graphic tees are printed on 240 GSM pre-shrunk vintage carded cotton with drop-shoulder seams. For a true-to-size boxy look, order your standard size; for an exaggerated oversized drape, size up one notch. Every product page contains exact pit-to-pit and length charts in inches and centimeters.',
  },
  {
    id: 'faq_3',
    category: 'Pre-Orders',
    question: 'How does pre-order fulfillment work when combining apparel and vinyl?',
    answer:
      'If your order contains both in-stock apparel and a pre-order vinyl record, we split-ship automatically: your apparel ships immediately, and the vinyl is dispatched once pressing plant quality batches arrive at our fulfillment center. You will receive separate tracking numbers with no extra freight charge.',
  },
  {
    id: 'faq_4',
    category: 'Cancellations & Returns',
    question: 'Can I cancel or edit my shipping address after placing an order?',
    answer:
      'We have an automated 60-minute order modification window. If you notice a typo in your address or selected the wrong size, submit a ticket immediately under "General Inquiry" or email us with your order number. Once our warehouse generates the packing slip and barcode, address changes cannot be guaranteed, but we can issue a carrier package redirect.',
  },
  {
    id: 'faq_5',
    category: 'Cancellations & Returns',
    question: 'What is your policy for damaged, misprinted, or defective merch?',
    answer:
      'We stand behind every print run. If your apparel has misaligned graphics, ink bleeds, fabric tears, or wrong sizing tags, submit a ticket with a quick photo proof. We will issue an immediate free replacement or full refund without requiring you to ship the damaged item back.',
  },
  {
    id: 'faq_6',
    category: 'Care & Quality',
    question: 'How should I wash puff print and screenprinted apparel?',
    answer:
      'Machine wash cold inside-out on gentle cycle with similar dark colors. Hang dry or tumble dry low heat. Never iron directly over screenprinted, puff, or reflective vinyl graphics to avoid cracking and adhesive release.',
  },
];
