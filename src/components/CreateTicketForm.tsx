import React, { useState, useRef, useEffect } from 'react';
import {
  Ticket,
  TicketCategory,
  TicketPriority,
  TicketAttachment,
  UserProfile,
} from '../types';
import { MERCH_SAMPLE_IMAGE } from '../data/mockData';
import { SkeletonLoader } from './SkeletonLoader';
import { SanelowLogo } from './SanelowLogo';
import {
  Upload,
  X,
  FileText,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  LogIn,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface CreateTicketFormProps {
  user: UserProfile;
  prefillCategory?: TicketCategory;
  onSubmitTicket: (newTicket: Ticket) => Promise<void>;
  onSwitchToAuth: () => void;
  onViewTicket: (ticketId: string) => void;
}

export const CreateTicketForm: React.FC<CreateTicketFormProps> = ({
  user,
  prefillCategory,
  onSubmitTicket,
  onSwitchToAuth,
  onViewTicket,
}) => {
  // Form fields
  const [fullName, setFullName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [orderNumber, setOrderNumber] = useState('');
  const [customOrderNumber, setCustomOrderNumber] = useState('');
  const [category, setCategory] = useState<TicketCategory>(
    prefillCategory || 'Damaged / Misprinted Item'
  );
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  // Attachments & State
  const [attachments, setAttachments] = useState<TicketAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);
  const [guestVerificationEmailSent, setGuestVerificationEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync when user changes (e.g. toggles auth/guest)
  useEffect(() => {
    setFullName(user.name);
    setEmail(user.email);
    if (!user.isGuest && user.orders.length > 0 && !orderNumber) {
      setOrderNumber(user.orders[0].id);
    }
  }, [user]);

  useEffect(() => {
    if (prefillCategory) {
      setCategory(prefillCategory);
    }
  }, [prefillCategory]);

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setTimeout(() => {
      const newAttachments: TicketAttachment[] = Array.from(files).map((file, idx) => {
        const isImage = file.type.startsWith('image/');
        const url = isImage ? URL.createObjectURL(file) : undefined;
        return {
          id: `att_${Date.now()}_${idx}`,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: file.type,
          url: url,
          previewUrl: url,
          uploadedAt: new Date().toISOString(),
        };
      });

      setAttachments((prev) => [...prev, ...newAttachments]);
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 900);
  };

  // Quick sample photo loader for testing
  const handleAttachSampleMisprint = () => {
    setIsUploading(true);
    setTimeout(() => {
      const sampleAttachment: TicketAttachment = {
        id: `att_sample_${Date.now()}`,
        name: 'misprinted_tour_hoodie_sample.jpg',
        size: '2.4 MB',
        type: 'image/jpeg',
        url: MERCH_SAMPLE_IMAGE,
        previewUrl: MERCH_SAMPLE_IMAGE,
        uploadedAt: new Date().toISOString(),
      };
      setAttachments((prev) => [...prev, sampleAttachment]);
      setIsUploading(false);
    }, 700);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!subject.trim()) {
      setErrorMessage('Please enter a brief subject line.');
      return;
    }
    if (!description.trim() || description.length < 10) {
      setErrorMessage('Please provide a detailed description (at least 10 characters).');
      return;
    }

    const effectiveOrder = orderNumber === 'custom' ? customOrderNumber : orderNumber;
    const ticketNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `#TK-${ticketNum}`;

    const newTicket: Ticket = {
      id: newId,
      subject,
      description,
      category,
      priority,
      status: 'open',
      customerName: fullName,
      customerEmail: email,
      orderNumber: effectiveOrder || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.isGuest ? undefined : user.id,
      emailNotificationEnabled: true,
      attachments: [...attachments],
      messages: [
        {
          id: `msg_init_${Date.now()}`,
          senderId: user.isGuest ? 'guest' : user.id,
          senderName: fullName,
          senderRole: 'customer',
          content: description,
          attachments: [...attachments],
          createdAt: new Date().toISOString(),
        },
      ],
    };

    setIsSubmitting(true);
    // Simulate API delay with red/black skeleton loader as required by spec
    await new Promise((resolve) => setTimeout(resolve, 1400));
    await onSubmitTicket(newTicket);
    setIsSubmitting(false);
    setCreatedTicketId(newId);
  };

  // Reset form to submit another
  const handleResetForm = () => {
    setCreatedTicketId(null);
    setSubject('');
    setDescription('');
    setAttachments([]);
    setErrorMessage(null);
  };

  // Success view
  if (createdTicketId) {
    return (
      <div className="border border-neutral-200 bg-white p-8 max-w-3xl mx-auto my-8">
        <div className="flex items-center gap-3 text-emerald-600 mb-4">
          <CheckCircle2 className="w-8 h-8 text-red-600" />
          <div>
            <span className="font-mono text-xs uppercase text-neutral-500 tracking-wider">
              Ticket Logged Successfully
            </span>
            <h2 className="text-2xl font-extrabold text-black font-sans uppercase">
              Support Case {createdTicketId}
            </h2>
          </div>
        </div>

        <p className="text-sm text-neutral-700 leading-relaxed mb-6">
          Your support ticket has been received and routed to our merchandise operations desk.
          {user.isGuest ? (
            <span>
              {' '}
              A confirmation email and secure guest tracking link have been dispatched to{' '}
              <strong className="font-mono text-black">{email}</strong>.
            </span>
          ) : (
            <span>
              {' '}
              This ticket is now linked to your account dashboard under{' '}
              <strong className="text-black">My Tickets</strong>.
            </span>
          )}
        </p>

        {/* Action card */}
        <div className="p-4 bg-neutral-50 border border-neutral-200 mb-6 space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-neutral-200">
            <span className="text-neutral-500">Ticket ID</span>
            <span className="font-mono font-bold text-black">{createdTicketId}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-neutral-200">
            <span className="text-neutral-500">Category</span>
            <span className="font-medium text-black">{category}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-neutral-200">
            <span className="text-neutral-500">Priority</span>
            <span className={`font-medium ${priority === 'urgent' ? 'text-red-600 font-bold' : 'text-black'}`}>
              {priority.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-neutral-500">Status</span>
            <span className="text-red-600 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              Pending Agent Review
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => onViewTicket(createdTicketId)}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Open Ticket Thread & Live Reply</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetForm}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 hover:border-neutral-400 transition-colors cursor-pointer"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  // Active submission loading state with skeleton loader
  if (isSubmitting) {
    return (
      <div className="max-w-3xl mx-auto my-8">
        <SkeletonLoader
          type="submission"
          label="Dispatching ticket to Merch Warehouse & Support Team..."
        />
      </div>
    );
  }

  return (
    <div className="border border-neutral-200 bg-white p-6 sm:p-10 max-w-3xl mx-auto mb-16">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-200 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <SanelowLogo size={18} color="#DC2626" className="shrink-0" />
          <span className="font-mono text-xs uppercase text-neutral-500 tracking-wider">
            Sanelow Music Group Direct Desk
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-black uppercase tracking-tight mt-1">
          Open Support Ticket
        </h1>
        <p className="text-sm text-neutral-600 mt-1">
          Provide your order details and photos of any defect or sizing concern. We reply within 2–4 hours.
        </p>
      </div>

      {/* Auth Guard & Guest Conversion Notice */}
      {user.isGuest ? (
        <div className="mb-8 p-4 bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center shrink-0">
              <LogIn className="w-4 h-4 text-neutral-700" />
            </div>
            <div>
              <p className="text-xs font-bold text-black">Submitting as Guest</p>
              <p className="text-xs text-neutral-500">
                You can create tickets as a guest, or log in to link tickets and order history.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onSwitchToAuth}
            className="cursor-pointer text-xs font-semibold text-red-600 hover:text-red-700 underline flex items-center gap-1 shrink-0"
          >
            <span>Log In as Jordan Mercer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="mb-8 p-3 bg-red-50/40 border border-red-200/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-neutral-800">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span>
              Logged in as <strong className="text-black">{user.name}</strong> ({user.email}). Details will auto-link to your dashboard.
            </span>
          </div>
          <span className="font-mono text-neutral-500 hidden sm:inline">
            {user.orders.length} orders on file
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-3 bg-red-50 border border-red-300 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
              Full Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g., Alex Vance"
              className="w-full px-3 py-2 text-sm border border-neutral-200 bg-white text-black focus:border-red-600 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
              Email Address <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., alex@example.com"
              className="w-full px-3 py-2 text-sm border border-neutral-200 bg-white text-black focus:border-red-600 focus:outline-none transition-colors"
            />
            <span className="text-[11px] text-neutral-500 mt-1 block">
              We will send ticket progress updates and courier labels here.
            </span>
          </div>
        </div>

        {/* Row 2: Associated Order # & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
              Associated Order # (Optional)
            </label>
            {!user.isGuest && user.orders.length > 0 ? (
              <div className="space-y-2">
                <select
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 bg-white text-black focus:border-red-600 focus:outline-none transition-colors font-mono"
                >
                  <option value="">No specific order / Pre-purchase inquiry</option>
                  {user.orders.map((ord) => (
                    <option key={ord.id} value={ord.id}>
                      {ord.id} - {ord.items[0]} ({ord.status})
                    </option>
                  ))}
                  <option value="custom">Other / Custom Order #</option>
                </select>

                {orderNumber === 'custom' && (
                  <input
                    type="text"
                    value={customOrderNumber}
                    onChange={(e) => setCustomOrderNumber(e.target.value)}
                    placeholder="Enter Order # (e.g., #ORD-4491)"
                    className="w-full px-3 py-1.5 text-xs border border-neutral-200 font-mono text-black focus:border-red-600 focus:outline-none"
                  />
                )}
              </div>
            ) : (
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., #ORD-9182 (Found in order confirmation)"
                className="w-full px-3 py-2 text-sm border border-neutral-200 bg-white text-black focus:border-red-600 focus:outline-none transition-colors font-mono"
              />
            )}
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Linking an order expedites returns and tracking inquiries.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
              Issue Category <span className="text-red-600">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TicketCategory)}
              className="w-full px-3 py-2 text-sm border border-neutral-200 bg-white text-black focus:border-red-600 focus:outline-none transition-colors"
            >
              <option value="Damaged / Misprinted Item">Damaged / Misprinted Item</option>
              <option value="Size Exchange">Size Exchange</option>
              <option value="Order Tracking">Order Tracking</option>
              <option value="Pre-Order Fulfillment">Pre-Order Fulfillment</option>
              <option value="Return / Refund">Return / Refund</option>
              <option value="Wholesale / Bulk">Wholesale / Bulk Inquiry</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Routes directly to the appropriate specialist team.
            </span>
          </div>
        </div>

        {/* Priority Level */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
            Priority Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['low', 'medium', 'high', 'urgent'] as TicketPriority[]).map((lvl) => {
              const isUrgent = lvl === 'urgent';
              const isSelected = priority === lvl;
              return (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setPriority(lvl)}
                  className={`cursor-pointer px-3 py-2 text-xs font-semibold uppercase tracking-wider border transition-all text-center ${
                    isSelected
                      ? isUrgent
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-black text-white border-black'
                      : isUrgent
                      ? 'bg-white text-red-600 border-red-200 hover:border-red-500'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {lvl}
                  {isUrgent && isSelected && ' 🔥'}
                </button>
              );
            })}
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Select 'Urgent' if you are attending a tour date within 48 hours or report a misprinted item.
          </span>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
            Subject <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Front chest screenprint misalignment on Tour Hoodie"
            className="w-full px-3 py-2 text-sm border border-neutral-200 bg-white text-black focus:border-red-600 focus:outline-none transition-colors"
          />
        </div>

        {/* Detailed Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-black">
              Detailed Description <span className="text-red-600">*</span>
            </label>
            <span className="font-mono text-[11px] text-neutral-400">
              {description.length} chars
            </span>
          </div>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please detail your inquiry, garment condition, requested exchange size, or carrier status..."
            className="w-full px-3 py-2 text-sm border border-neutral-200 bg-white text-black focus:border-red-600 focus:outline-none transition-colors"
          />
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Include measurements or tag photos for sizing concerns, or batch number printed on garment care label.
          </span>
        </div>

        {/* Attachments Dropzone */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-black">
              Attachments (Photo / Video Proof)
            </label>
            <button
              type="button"
              onClick={handleAttachSampleMisprint}
              className="cursor-pointer text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Attach Sample Misprinted Hoodie</span>
            </button>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-neutral-300 hover:border-neutral-500 bg-neutral-50 hover:bg-neutral-100/50 p-6 text-center cursor-pointer transition-colors"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*,.pdf,.mp4"
              className="hidden"
            />
            <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-black">
              Click to browse or drag & drop files here
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">
              Supports JPEG, PNG, WEBP, MP4 proof up to 15 MB each.
            </p>
          </div>

          {/* Upload progress indicator */}
          {isUploading && (
            <div className="mt-3">
              <SkeletonLoader type="upload" />
            </div>
          )}

          {/* Attachment list */}
          {attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              <span className="font-mono text-[11px] text-neutral-500 uppercase">
                Attached Files ({attachments.length}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-2.5 bg-white border border-neutral-200 text-xs"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {att.previewUrl ? (
                        <img
                          src={att.previewUrl}
                          alt={att.name}
                          className="w-8 h-8 object-cover border border-neutral-200"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-neutral-100 flex items-center justify-center border border-neutral-200">
                          <FileText className="w-4 h-4 text-neutral-500" />
                        </div>
                      )}
                      <div className="truncate">
                        <p className="font-medium text-black truncate">{att.name}</p>
                        <p className="font-mono text-[10px] text-neutral-400">{att.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="cursor-pointer text-neutral-400 hover:text-red-600 p-1 transition-colors"
                      title="Remove attachment"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit action */}
        <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500 text-center sm:text-left">
            By submitting, you agree to receive automated email ticket notifications.
          </p>
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
          >
            Submit Ticket
          </button>
        </div>
      </form>
    </div>
  );
};
