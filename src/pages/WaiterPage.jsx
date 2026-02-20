import { useState } from 'react';
import { Users, Search, PlusCircle, Coffee } from 'lucide-react';

export default function WaiterPage() {
  const [activeTab, setActiveTab] = useState('all');

  const tables = Array.from({ length: 12 }, (_, i) => {
    return {
      id: `T-${(i + 1).toString().padStart(2, '0')}`,
      status: i === 0 ? 'occupied' : i === 3 ? 'ordered' : i === 7 ? 'paying' : 'free',
      capacity: 4,
      guests: i === 0 ? 3 : i === 3 ? 4 : i === 7 ? 2 : 0,
      bill: i === 3 ? '$84.50' : i === 7 ? '$112.00' : '$0.00'
    };
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'free': return 'bg-white border-slate-200 hover:border-indigo-500';
      case 'occupied': return 'bg-amber-50 border-amber-200 shadow-sm';
      case 'ordered': return 'bg-indigo-50 border-indigo-200 shadow-sm';
      case 'paying': return 'bg-emerald-50 border-emerald-200 shadow-sm';
      default: return 'bg-white border-slate-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'free': return 'Available';
      case 'occupied': return 'Seated';
      case 'ordered': return 'Food Ordered';
      case 'paying': return 'Bill Requested';
      default: return status;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto flex gap-8 h-screen">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Floor Plan</h1>
            <p className="text-slate-500 mt-1">Manage tables and take orders.</p>
          </div>

          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search table or item..."
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow bg-white"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-slate-200 pb-px">
          {['All Tables', 'My Tables', 'Available', 'Needs Attention'].map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${(activeTab === 'all' && i === 0) || activeTab === tab.toLowerCase()
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1 overflow-y-auto pb-4">
          {tables.map(table => (
            <button
              key={table.id}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between h-36 transition-all active:scale-[0.98] ${getStatusColor(table.status)}`}
            >
              <div className="flex justify-between items-start">
                <span className={`font-bold text-xl ${table.status !== 'free' ? 'text-slate-900' : 'text-slate-700'}`}>
                  {table.id}
                </span>
                <span className="flex items-center gap-1 text-slate-500 text-sm font-medium">
                  <Users className="w-4 h-4" />
                  {table.capacity}
                </span>
              </div>

              <div>
                {table.status !== 'free' && (
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-700">
                    <Users className="w-4 h-4" /> {table.guests} Guests
                  </div>
                )}
                {table.status !== 'free' && table.bill !== '$0.00' && (
                  <div className="font-bold text-slate-900">
                    {table.bill}
                  </div>
                )}
                <div className={`text-xs font-bold uppercase tracking-wider mt-1 ${table.status === 'free' ? 'text-slate-400' :
                  table.status === 'occupied' ? 'text-amber-600' :
                    table.status === 'ordered' ? 'text-indigo-600' : 'text-emerald-600'
                  }`}>
                  {getStatusText(table.status)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="w-80 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col sticky top-8 h-[calc(100vh-4rem)] overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-slate-900">Quick Actions</h2>
            <Coffee className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-sm text-slate-500">Select a table to start an order</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
          <PlusCircle className="w-12 h-12 mb-4 text-slate-200" />
          <p className="font-medium text-slate-500">No active table selected</p>
          <p className="text-sm mt-1">Tap a table on the floor plan to view details</p>
        </div>
      </div>
    </div>
  );
}
