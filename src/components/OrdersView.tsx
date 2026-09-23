import React from 'react';
import { UserOrder } from '../types';
import { Package, Truck, CheckCircle2, ArrowRight, LifeBuoy } from 'lucide-react';

interface OrdersViewProps {
  orders: UserOrder[];
  onOpenTicketForOrder: (orderId: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, onOpenTicketForOrder }) => {
  return (
    <div className="border border-neutral-200 bg-white p-6 sm:p-8 mb-16">
      <div className="pb-6 border-b border-neutral-200 mb-6">
        <span className="font-mono text-xs uppercase text-neutral-500 tracking-wider">
          Purchase History
        </span>
        <h2 className="text-2xl font-extrabold text-black uppercase tracking-tight mt-1">
          Recent Merch Orders
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1">
          Select an order to view tracking status, report print defects, or initiate a sizing exchange.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((ord) => {
          const isDelivered = ord.status === 'Delivered';
          const isInTransit = ord.status === 'In Transit';

          return (
            <div
              key={ord.id}
              className="border border-neutral-200 p-5 bg-neutral-50 hover:bg-white hover:border-neutral-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-black">{ord.id}</span>
                  <span className="text-neutral-300">·</span>
                  <span className="font-mono text-xs text-neutral-500">{ord.date}</span>
                  <span className="text-neutral-300">·</span>
                  <span className="font-mono text-xs font-semibold text-black">{ord.total}</span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-neutral-800 font-medium">
                  {ord.items.map((item, i) => (
                    <span key={i} className="bg-white border border-neutral-200 px-2 py-1">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-200">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold">
                  {isDelivered && (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-600" />
                      <span className="text-neutral-700">Delivered</span>
                    </>
                  )}
                  {isInTransit && (
                    <>
                      <Truck className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                      <span className="text-red-600">In Transit</span>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onOpenTicketForOrder(ord.id)}
                  className="cursor-pointer px-3 py-1.5 text-xs font-semibold text-black hover:text-white bg-white hover:bg-red-600 border border-neutral-300 hover:border-red-600 transition-colors flex items-center gap-1.5"
                >
                  <LifeBuoy className="w-3.5 h-3.5 text-red-600 group-hover:text-white" />
                  <span>Report Issue</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
