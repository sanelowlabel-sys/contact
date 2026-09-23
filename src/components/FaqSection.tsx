import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/mockData';
import { ChevronDown, Search, HelpCircle, ArrowRight } from 'lucide-react';

interface FaqSectionProps {
  onOpenTicketForm: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenTicketForm }) => {
  const [openIds, setOpenIds] = useState<string[]>(['faq_1', 'faq_2']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Shipping', 'Sizing & Blanks', 'Pre-Orders', 'Cancellations & Returns', 'Care & Quality'];

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="border border-neutral-200 bg-white p-6 sm:p-8 mb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <span className="font-mono text-xs uppercase text-neutral-500 tracking-wider">
            Knowledge Base
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black uppercase tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-neutral-600 mt-1 max-w-xl">
            Instant guidance on tour drops, garment sizing blanks, vinyl pre-orders, and shipping timetables.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs (e.g., sizing, vinyl)..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-red-600 focus:outline-none transition-colors text-black placeholder:text-neutral-400"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto py-4 border-b border-neutral-100 scrollbar-none text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`cursor-pointer px-3 py-1.5 whitespace-nowrap transition-colors border ${
              selectedCategory === cat
                ? 'bg-black text-white border-black font-semibold'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-black'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="divide-y divide-neutral-100 mt-2">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div key={faq.id} className="py-4 group">
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex-1 pr-4">
                    <span className="font-mono text-[11px] uppercase text-neutral-400 block mb-1">
                      {faq.category}
                    </span>
                    <span className="text-base font-semibold text-black group-hover:text-red-600 transition-colors">
                      {faq.question}
                    </span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border border-neutral-200 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-neutral-100 border-neutral-300' : 'bg-white'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-600" />
                  </div>
                </button>

                {isOpen && (
                  <div className="pt-3 pb-2 text-sm text-neutral-600 leading-relaxed font-sans">
                    <p className="border-l-2 border-red-600 pl-4 py-1">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-10 text-center">
            <HelpCircle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-black">No matching FAQ found</p>
            <p className="text-xs text-neutral-500 mt-1">
              Try searching with different keywords or open a direct ticket with our support specialists.
            </p>
          </div>
        )}
      </div>

      {/* Bottom helper prompt */}
      <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-50 p-4 border border-neutral-200">
        <div>
          <p className="text-sm font-bold text-black">Can't find the answer you're looking for?</p>
          <p className="text-xs text-neutral-600">
            Submit a customer ticket with your order number and photo attachments. Average reply is under 4 hours.
          </p>
        </div>
        <button
          onClick={onOpenTicketForm}
          className="cursor-pointer shrink-0 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-1.5"
        >
          <span>Open Support Ticket</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
