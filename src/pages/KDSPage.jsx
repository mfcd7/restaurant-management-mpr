import { Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export default function KDSPage() {
  const { orders, updateOrderStatus } = useRestaurant();

  // Filter orders for KDS
  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'cooking');
  const pendingCount = activeOrders.filter(t => t.status === 'pending').length;
  const cookingCount = activeOrders.filter(t => t.status === 'cooking').length;

  const calculateWaitTime = () => {
    // A simple mock since we are using dummy date strings - in real code use Date.now() differences
    return "Mins Ago";
  };

  return (
    <div className="p-8 h-screen flex flex-col max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kitchen Display System</h1>
          <p className="text-slate-500 mt-1">Manage active orders and tickets from the Waiter app.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            Pending ({pendingCount})
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>
            Cooking ({cookingCount})
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full items-start w-max">
          {activeOrders.length === 0 && (
            <div className="flex items-center justify-center w-[80vw] h-64 text-slate-400 font-medium text-xl">
              No active orders right now.
            </div>
          )}
          {activeOrders.map((ticket) => (
            <div
              key={ticket.id}
              className={`w-80 flex flex-col bg-white rounded-2xl shadow-sm border-t-4 border-x border-b border-slate-200 shrink-0 ${ticket.status === 'pending' ? 'border-t-rose-500' : 'border-t-violet-500'
                }`}
            >
              {/* Ticket Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50 rounded-t-xl">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{ticket.tableId}</h2>
                  <p className="text-sm font-medium text-slate-500">{ticket.id} • {ticket.time}</p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-bold ${ticket.status === 'pending' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                  <Clock className="w-4 h-4" />
                  {calculateWaitTime(ticket.time)}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-5 flex-1 space-y-4">
                {ticket.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    <span className="font-black text-xl text-slate-300 w-6">{item.qty}x</span>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-lg leading-tight">{item.name}</p>
                      {item.notes && (
                        <p className="text-sm text-amber-600 font-medium mt-1 bg-amber-50 px-2.5 py-1 rounded-md inline-block">
                          Note: {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="p-5 border-t border-slate-100 mt-auto bg-slate-50/50 rounded-b-xl">
                <button
                  onClick={() => updateOrderStatus(ticket.id, ticket.status === 'pending' ? 'cooking' : 'ready')}
                  className={`w-full py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${ticket.status === 'pending'
                    ? 'bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/20'
                    }`}
                >
                  {ticket.status === 'pending' ? (
                    <>Start Cooking <ChevronRight className="w-5 h-5" /></>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Mark Ready to Serve
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
