import { Clock, CheckCircle2 } from 'lucide-react';

export default function KDSPage() {
  const tickets = [
    {
      id: '#1028',
      table: 'T-05',
      time: '12:45 PM',
      wait: '12m',
      status: 'cooking',
      items: [
        { name: 'Butter Chicken', notes: 'Medium spicy', qty: 1 },
        { name: 'Garlic Naan', notes: 'Extra butter', qty: 1 },
      ]
    },
    {
      id: '#1029',
      table: 'T-12',
      time: '12:48 PM',
      wait: '9m',
      status: 'cooking',
      items: [
        { name: 'Paneer Butter Masala', notes: 'Less spicy', qty: 2 },
        { name: 'Jeera Rice', notes: '', qty: 1 },
        { name: 'Tandoori Roti', notes: '', qty: 1 },
      ]
    },
    {
      id: '#1030',
      table: 'Takeout-4',
      time: '12:52 PM',
      wait: '5m',
      status: 'pending',
      items: [
        { name: 'Chicken Biryani', notes: 'Extra raita', qty: 1 },
        { name: 'Gulab Jamun', notes: '', qty: 2 },
      ]
    },
    {
      id: '#1031',
      table: 'T-01',
      time: '12:55 PM',
      wait: '2m',
      status: 'pending',
      items: [
        { name: 'Masala Dosa', notes: 'Crispy', qty: 2 },
      ]
    }
  ];

  return (
    <div className="p-8 h-screen flex flex-col max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kitchen Display System</h1>
          <p className="text-slate-500 mt-1">Manage active orders and tickets.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            Pending ({tickets.filter(t => t.status === 'pending').length})
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            Cooking ({tickets.filter(t => t.status === 'cooking').length})
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full items-start w-max">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`w-80 flex flex-col bg-white rounded-xl shadow-sm border-t-4 border-x border-b border-slate-200 shrink-0 ${ticket.status === 'pending' ? 'border-t-rose-500' : 'border-t-amber-500'
                }`}
            >
              {/* Ticket Header */}
              <div className="p-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/50 rounded-t-lg">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{ticket.table}</h2>
                  <p className="text-sm font-medium text-slate-500">{ticket.id} • {ticket.time}</p>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-bold ${parseInt(ticket.wait) > 10 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                  <Clock className="w-4 h-4" />
                  {ticket.wait}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 flex-1 space-y-3">
                {ticket.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <span className="font-bold text-lg text-slate-900">{item.qty}</span>
                    <div>
                      <p className="font-bold text-slate-900 text-lg leading-tight">{item.name}</p>
                      {item.notes && (
                        <p className="text-sm text-amber-600 font-medium mt-0.5 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-slate-100 mt-auto">
                <button
                  className={`w-full py-3 rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-2 ${ticket.status === 'pending'
                      ? 'bg-amber-500 hover:bg-amber-600'
                      : 'bg-emerald-500 hover:bg-emerald-600'
                    }`}
                >
                  {ticket.status === 'pending' ? (
                    'Start Cooking'
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Mark Ready
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
