import { FAQItem, Ticket, UserProfile } from '../types';

export const SUPPORT_AVATAR = '/src/assets/images/support_lead_avatar_1790136139952.jpg';
export const MERCH_SAMPLE_IMAGE = '/src/assets/images/merch_sample_hoodie_1790136151327.jpg';

export const INITIAL_USER: UserProfile = {
  id: 'usr_88291',
  name: 'Jordan Mercer',
  email: 'jordan.mercer@gmail.com',
  isGuest: false,
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
};

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: '#TK-8492',
    subject: 'Front chest screenprint misalignment on Tour Hoodie',
    description:
      'I received my order #ORD-9182 yesterday. The heavyweight hoodie quality is great, but the front graphic print is noticeably tilted ~15 degrees to the left and has some ink smudging on the lower hem. Photo proof attached.',
    category: 'Damaged / Misprinted Item',
    priority: 'urgent',
    status: 'awaiting_reply',
    customerName: 'Jordan Mercer',
    customerEmail: 'jordan.mercer@gmail.com',
    orderNumber: '#ORD-9182',
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
        senderRole: 'staff',
        avatar: SUPPORT_AVATAR,
        content:
          'Hi Jordan! Thanks for bringing this to our attention and sharing clear photos. That print tilt definitely slipped through our QA check at the factory. We have authorized a priority replacement hoodie for you at zero extra charge. Can you confirm if your shipping address on file is still current?',
        createdAt: '2026-09-21T09:15:00Z',
      },
    ],
  },
  {
    id: '#TK-8120',
    subject: 'Size exchange inquiry: XL Acid Wash Graphic Tee fits slightly snug',
    description:
      'Wondering if I can exchange my XL tee for a 2XL? The garment has a boxier cut than expected and I prefer an oversized drape.',
    category: 'Size Exchange',
    priority: 'normal',
    status: 'in_progress',
    customerName: 'Jordan Mercer',
    customerEmail: 'jordan.mercer@gmail.com',
    orderNumber: '#ORD-8821',
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
        senderRole: 'staff',
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
        senderId: 'staff_alex',
        senderName: 'Alex Vance',
        senderRole: 'staff',
        avatar: SUPPORT_AVATAR,
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
    status: 'pending_agent',
    customerName: 'Jordan Mercer',
    customerEmail: 'jordan.mercer@gmail.com',
    orderNumber: '#ORD-7409',
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
