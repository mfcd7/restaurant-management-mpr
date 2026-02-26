import { useState } from 'react';
import { Users, Search, Coffee, ChevronRight, Plus, X } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export default function WaiterPage() {
  const { tables, getMenuItems, placeOrder, calculateTableBill } = useRestaurant();
  const [activeTab, setActiveTab] = useState('all');
  const [activeTableId, setActiveTableId] = useState(null);
  const [cart, setCart] = useState([]);

  const menuItems = getMenuItems();

  const getStatusStyle = (status) => {
    switch (status) {
      case 'free': return 'bg-white border-slate-200 hover:border-teal-500';
      case 'occupied': return 'bg-amber-50 border-amber-300 shadow-sm';
      case 'cooking': return 'bg-violet-50 border-violet-300 shadow-sm';
      case 'ordered': return 'bg-indigo-50 border-indigo-300 shadow-sm';
      case 'paying': return 'bg-emerald-50 border-emerald-300 shadow-sm';
      default: return 'bg-white border-slate-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'free': return 'Available';
      case 'occupied': return 'Seated';
      case 'ordered': return 'Waiting for Food';
      case 'cooking': return 'Food is Cooking';
      case 'paying': return 'Bill Requested / Paying';
      default: return status;
    }
  };

  const handleTableClick = (id) => {
    setActiveTableId(id);
    setCart([]); // reset cart when switching tables
  };

  const activeTable = tables.find(t => t.id === activeTableId);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const handlePlaceOrder = () => {
    if (cart.length > 0 && activeTableId) {
      placeOrder(activeTableId, cart);
      setCart([]);
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto flex gap-8 h-screen">
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
              placeholder="Search table..."
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-shadow bg-white"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-slate-200 pb-px">
          {['All Tables', 'My Tables', 'Available', 'Needs Attention'].map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${(activeTab === 'all' && i === 0) || activeTab === tab.toLowerCase()
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1 overflow-y-auto pb-4 pr-2">
          {tables.map(table => (
            <button
              key={table.id}
              onClick={() => handleTableClick(table.id)}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between h-40 transition-all active:scale-[0.98] ${getStatusStyle(table.status)} ${activeTableId === table.id ? 'ring-2 ring-teal-500 ring-offset-2' : ''
                }`}
            >
              <div className="flex justify-between items-start">
                <span className={`font-bold text-xl ${table.status !== 'free' ? 'text-slate-900' : 'text-slate-700'}`}>
                  {table.id}
                </span>
                <span className="flex items-center gap-1 text-slate-500 text-sm font-medium bg-white/50 px-2 py-0.5 rounded-full">
                  <Users className="w-3.5 h-3.5" />
                  {table.capacity}
                </span>
              </div>

              <div>
                {table.status !== 'free' && calculateTableBill(table.id) > 0 && (
                  <div className="font-bold text-slate-900 text-xl mb-1">
                    ₹{calculateTableBill(table.id).toFixed(2)}
                  </div>
                )}
                <div className={`text-xs font-bold uppercase tracking-wider mt-1 ${table.status === 'free' ? 'text-slate-400' :
                  table.status === 'occupied' ? 'text-amber-600' :
                    table.status === 'cooking' ? 'text-violet-600' :
                      table.status === 'ordered' ? 'text-indigo-600' : 'text-emerald-600'
                  }`}>
                  {getStatusText(table.status)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Sidebar - Action Panel */}
      <div className="w-96 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[calc(100vh-4rem)] overflow-hidden flex-shrink-0">
        {!activeTable ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-slate-50/50">
            <Coffee className="w-16 h-16 mb-4 text-slate-200" />
            <p className="font-medium text-slate-600 text-lg">No table selected</p>
            <p className="text-sm mt-2 max-w-[200px]">Tap a table on the floor plan to view details and start an order</p>
          </div>
        ) : (
          <>
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-xl text-slate-900">Table {activeTable.id.replace('T-', '')}</h2>
                <span className={`text-xs font-bold uppercase tracking-wider mt-1 ${activeTable.status === 'free' ? 'text-slate-500' : 'text-teal-600'
                  }`}>
                  {getStatusText(activeTable.status)}
                </span>
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200">
                <Users className="w-5 h-5 text-slate-500" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50/30 p-4 space-y-6">
              {/* Quick Menu Selection */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Quick Menu</h3>
                <div className="space-y-2">
                  {menuItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => addToCart(item)}
                      className="w-full text-left bg-white p-3 rounded-lg border border-slate-200 hover:border-teal-500 hover:shadow-sm transition-all flex items-center justify-between group"
                    >
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                        <p className="text-xs text-slate-500">₹{item.price.toFixed(2)}</p>
                      </div>
                      <Plus className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Order Summary */}
            <div className="p-4 border-t border-slate-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>New Order ({cart.length})</span>
                {cart.length > 0 && <span className="text-teal-600">₹{cart.reduce((s, i) => s + (i.price * i.qty), 0).toFixed(2)}</span>}
              </h3>

              {cart.length === 0 ? (
                <div className="text-sm text-center text-slate-500 py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  Tap items above to add to order
                </div>
              ) : (
                <div className="max-h-32 overflow-y-auto mb-4 space-y-2 pr-1">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{item.qty}x</span>
                        <span className="text-slate-700">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">₹{(item.price * item.qty).toFixed(2)}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-rose-400 hover:text-rose-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={cart.length === 0}
                className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${cart.length > 0
                  ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/20'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
              >
                Send to Kitchen <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
