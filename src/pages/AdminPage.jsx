import { useState } from 'react';
import { LineChart, BarChart3, Users, Settings, Database, Activity, Receipt, Send, CheckCircle2 } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export default function AdminPage() {
  const { orders, updateOrderStatus } = useRestaurant();
  const [activeTab, setActiveTab] = useState('overview'); // overview, billing

  // Only show orders that are 'ready' to be billed or 'paid'
  const billingOrders = orders.filter(o => o.status === 'ready' || o.status === 'paid');

  const users = [
    { id: 1, name: 'Rahul Sharma', role: 'Manager', status: 'Active', lastLogin: '2 mins ago' },
    { id: 2, name: 'Amit Kumar', role: 'Head Chef', status: 'Active', lastLogin: '1 hour ago' },
    { id: 3, name: 'Priya Raj', role: 'Waiter', status: 'Offline', lastLogin: 'Yesterday' },
    { id: 4, name: 'Rohan Gupta', role: 'Waiter', status: 'Active', lastLogin: '15 mins ago' },
    { id: 5, name: 'Sneha Patel', role: 'Host', status: 'Active', lastLogin: '10 mins ago' },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto flex flex-col h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Console</h1>
          <p className="text-slate-500 mt-1">Manage users, view analytics, and process e-bills.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Database className="w-4 h-4" /> Export Data
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
            <Settings className="w-4 h-4" /> Settings
          </button>
        </div>
      </div>

      <div className="flex gap-6 mb-8 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'overview'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
        >
          <Activity className="w-4 h-4" /> System Overview
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'billing'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
        >
          <Receipt className="w-4 h-4" /> E-Billing & Completed Orders
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-8 space-y-8">
        {activeTab === 'overview' ? (
          <>
            {/* Overview Tab Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Staff</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">24</h3>
                  <p className="text-xs text-emerald-600 font-bold mt-1 bg-emerald-50 px-2 py-0.5 rounded inline-block">+2 this month</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                  <LineChart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">System Uptime</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">99.9%</h3>
                  <p className="text-xs text-emerald-600 font-bold mt-1 bg-emerald-50 px-2 py-0.5 rounded inline-block">All systems go</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">API Requests</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">1.2M</h3>
                  <p className="text-xs text-slate-500 font-bold mt-1 bg-slate-100 px-2 py-0.5 rounded inline-block">Last 30 days</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                  <h2 className="font-bold text-slate-900">Staff Management</h2>
                  <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">Add Staff</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-slate-200">
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{user.name}</p>
                            <p className="text-xs font-medium text-slate-500">{user.lastLogin}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">{user.role}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                              }`}>
                              {user.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-bold text-slate-900">Weekly Revenue</h2>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-slate-500" />
                  </div>
                </div>
                <div className="flex-1 w-full flex items-end justify-between gap-3 relative min-h-[250px]">
                  {/* Grid Lines */}
                  <div className="absolute inset-x-0 top-0 border-t border-dashed border-slate-200"></div>
                  <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-200"></div>

                  {[40, 70, 45, 90, 65, 80, 50].map((height, idx) => (
                    <div key={idx} className="w-full bg-indigo-50/50 rounded-t-lg hover:bg-indigo-100 transition-colors relative group h-full flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-indigo-600 to-indigo-500 rounded-t-lg group-hover:from-indigo-500 group-hover:to-indigo-400 transition-colors relative"
                        style={{ height: `${height}%` }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold py-1 px-2 rounded transition-opacity">
                          ₹{height * 100}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs font-bold text-slate-400 px-2 uppercase tracking-wide">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Billing Tab Content */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
              <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">Finalize Billing & Send E-Bills</h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">Orders marked as 'Ready to Serve' require billing action.</p>
                </div>
              </div>

              {billingOrders.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                  <Receipt className="w-16 h-16 mb-4 text-slate-200" />
                  <p className="font-medium text-slate-600 text-lg">No orders ready for billing</p>
                  <p className="text-sm mt-2">When the kitchen marks an order as ready, it will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {billingOrders.map(order => (
                    <div key={order.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-black text-xl text-slate-900">{order.tableId}</span>
                          <span className="text-sm font-medium text-slate-500">Order {order.id} • {order.time}</span>
                          <span className={`px-2.5 py-1 text-xs font-bold flex items-center gap-1 rounded-md ${order.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                            {order.status === 'paid' ? <><CheckCircle2 className="w-3.5 h-3.5" /> Paid</> : 'Pending Payment'}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-600 mb-1">Items: {order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}</p>
                        <p className="font-black text-lg text-teal-600">₹{order.total.toFixed(2)}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        {order.status !== 'paid' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'paid')}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                          >
                            <Receipt className="w-4 h-4" /> Mark as Paid
                          </button>
                        )}
                        <button
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all shadow-md shadow-teal-500/20"
                          onClick={() => alert('Dummy action: Sending e-Bill to customer.')}
                        >
                          <Send className="w-4 h-4" /> Send E-Bill
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
