import React, { useState, useEffect } from 'react';
import { LineChart, BarChart3, Users, Settings, Database, Activity, Receipt, Send, CheckCircle2, ChefHat, MessageSquare, X, TrendingUp, IndianRupee, ArrowUpRight, ArrowDownRight, Clock, Plus, Mail } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import WaiterPage from './WaiterPage';
import KDSPage from './KDSPage';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import emailjs from '@emailjs/browser';

export default function AdminPage() {
  const { orders, messages, updateOrderStatus, getMenuItems, placeExternalOrder } = useRestaurant();
  const [activeTab, setActiveTab] = useState('overview'); // overview, billing, waiter, kitchen
  const [showMessages, setShowMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // New features state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: 'Waiter' });
  const [settings, setSettings] = useState({
    autoPrint: true,
    notifications: true,
    taxRate: '5',
  });

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderType, setOrderType] = useState('Takeaway');
  const [orderCart, setOrderCart] = useState([]);

  // E-Bill Feature State
  const [billingEmailModalOrder, setBillingEmailModalOrder] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState('');
  const [emailErrorMsg, setEmailErrorMsg] = useState('');

  const menuItems = getMenuItems ? getMenuItems() : [];

  const [users, setUsers] = useState([
    { id: 1, name: 'Rahul Sharma', role: 'Manager', status: 'Active', lastLogin: '2 mins ago' },
    { id: 2, name: 'Amit Kumar', role: 'Head Chef', status: 'Active', lastLogin: '1 hour ago' },
    { id: 3, name: 'Priya Raj', role: 'Waiter', status: 'Offline', lastLogin: 'Yesterday' },
    { id: 4, name: 'Rohan Gupta', role: 'Waiter', status: 'Active', lastLogin: '15 mins ago' },
    { id: 5, name: 'Sneha Patel', role: 'Host', status: 'Active', lastLogin: '10 mins ago' },
  ]);

  // Only show orders that are 'served' to be billed or 'paid'
  const billingOrders = orders.filter(o => o.status === 'served' || o.status === 'paid');

  const prevMessagesLength = React.useRef(messages.length);

  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      if (!showMessages) {
        setUnreadCount(prev => prev + (messages.length - prevMessagesLength.current));
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages, showMessages]);

  const generateInvoicePDF = (order) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text("RestoDash", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("123 Food Street, Sector 5", 14, 28);
    doc.text("Receipt / Tax Invoice", 14, 34);
    
    // Order Info
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`Order ID: ${order.id}`, 14, 45);
    doc.text(`Table/Type: ${order.tableId}`, 14, 52);
    doc.text(`Date: ${new Date().toLocaleDateString()} ${order.time}`, 14, 59);
    
    // Items Table
    const tableColumn = ["Item", "Qty", "Price", "Amount"];
    const tableRows = [];
    
    order.items.forEach(item => {
      const amount = (item.price * item.qty).toFixed(2);
      tableRows.push([
        item.name,
        item.qty.toString(),
        `Rs. ${item.price.toFixed(2)}`,
        `Rs. ${amount}`
      ]);
    });
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 65,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }, // indigo-600
    });
    
    // Footer / Total
    const finalY = doc.lastAutoTable.finalY || 65;
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(`Total Amount: Rs. ${order.total.toFixed(2)}`, 14, finalY + 10);
    
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Thank you for dining with RestoDash!", 14, finalY + 25);
    
    return doc;
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if(!customerEmail.trim() || !billingEmailModalOrder) return;
    setIsSendingEmail(true);
    setEmailErrorMsg('');
    setEmailSuccessMsg('');
    
    try {
      const doc = generateInvoicePDF(billingEmailModalOrder);
      const pdfDataUri = doc.output('datauristring');
      
      // Auto-download PDF for admin locally instantly
      doc.save(`RestoDash_Bill_${billingEmailModalOrder.id.replace('#','')}.pdf`);

      const serviceId = 'service_mndfj19';
      const templateId = 'template_i4iev39';
      const publicKey = 'L_-5hLjiW4RgJp6g-';
      
      // Ensure we match the Admin PDF exactly: include "Amount"
      const orderItemsHtml = `
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; text-align: left;">
          <thead>
            <tr style="background-color: #f8fafc;">
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${billingEmailModalOrder.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>₹${(item.price * item.qty).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      // Pass the fully constructed table and additional info to the template
      const templateParams = {
        to_email: customerEmail,
        order_id: `${billingEmailModalOrder.id} (${billingEmailModalOrder.tableId})`, // Included table type to match admin
        date: `${new Date().toLocaleDateString()} ${billingEmailModalOrder.time}`, // Included time to match admin
        order_items: orderItemsHtml,
        total_amount: billingEmailModalOrder.total.toFixed(2)
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      setEmailSuccessMsg(`Bill successfully sent to ${customerEmail}!`);
    } catch (err) {
       console.error("EmailJS or internal error:", err);
       const errorMessage = err?.text || err?.message || String(err);
       setEmailErrorMsg(`Failed to send email: ${errorMessage}`);
    } finally {
       setIsSendingEmail(false);
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto flex flex-col h-screen">
      {/* Changed z-index from z-20 to z-50 to ensure message dropdown overrides other blocks */}
      <div className="w-full h-24 flex items-center justify-between mb-6 shrink-0 relative z-50">
        <div className="w-full bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/50 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">Admin Console</h1>
            <p className="text-slate-500 font-medium text-sm mt-0.5">Manage users, view analytics, and process e-bills.</p>
          </div>
          <div className="flex gap-3 relative">
            <button 
              onClick={() => {
                setShowMessages(!showMessages);
                if (!showMessages) setUnreadCount(0);
              }}
              className="relative flex items-center justify-center w-10 h-10 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showMessages && (
              <div className="absolute top-12 right-0 w-80 bg-white rounded-xl shadow-2xl border border-slate-300 z-[100] overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-slate-50">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    Messages
                  </h3>
                  <button onClick={() => setShowMessages(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto p-3 space-y-3">
                  {messages.length === 0 ? (
                    <p className="text-center text-slate-500 text-sm py-4">No messages yet</p>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-indigo-700">{msg.sender}</span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">{msg.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <button 
              onClick={() => alert('Data has been exported to Excel. (Dummy Action)')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Database className="w-4 h-4" /> Export Data
            </button>
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
          </div>
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
        <button
          onClick={() => setActiveTab('waiter')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'waiter'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
        >
          <Users className="w-4 h-4" /> Waiter View
        </button>
        <button
          onClick={() => setActiveTab('kitchen')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'kitchen'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
        >
          <ChefHat className="w-4 h-4" /> Kitchen View
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-8 space-y-8 relative z-10">
        {activeTab === 'overview' ? (
          <>
            {/* Overview Tab Content */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Today's Performance</h2>
              <button 
                onClick={() => setShowOrderModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-md shadow-teal-600/20"
              >
                <Plus className="w-4 h-4" /> New Order (Takeaway/Online)
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Today\'s Revenue', value: '₹42,890', change: '+12.5%', positive: true, icon: IndianRupee },
                { name: 'Active Orders', value: '42', change: '+5.2%', positive: true, icon: Clock },
                { name: 'Served Customers', value: '184', change: '-2.4%', positive: false, icon: Users },
                { name: 'Average Ticket', value: '₹850', change: '+8.1%', positive: true, icon: TrendingUp },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.name} className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-sm border border-white/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-medium ${stat.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {stat.change}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                      <p className="text-sm text-slate-500 font-medium">{stat.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm overflow-hidden flex flex-col max-h-[450px]">
                <div className="p-6 border-b border-slate-200/50 flex items-center justify-between bg-white/40 shrink-0">
                  <h2 className="font-bold text-slate-900">Staff Management</h2>
                  <button 
                    onClick={() => setShowAddStaffModal(true)}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Add Staff
                  </button>
                </div>
                <div className="overflow-x-auto flex-1 overflow-y-auto">
                  <table className="w-full text-left border-collapse relative">
                    <thead className="sticky top-0 bg-white shadow-sm z-10 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
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

              <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm p-6 flex flex-col">
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
        ) : activeTab === 'billing' ? (
          <>
            {/* Billing Tab Content */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-6 border-b border-slate-200/50 flex items-center justify-between bg-white/40">
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">Finalize Billing & Send E-Bills</h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">Orders marked as 'Served' require billing action.</p>
                </div>
              </div>

              {billingOrders.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                  <Receipt className="w-16 h-16 mb-4 text-slate-200" />
                  <p className="font-medium text-slate-600 text-lg">No orders ready for billing</p>
                  <p className="text-sm mt-2">When the Waiter marks an order as served, it will appear here.</p>
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
                          onClick={() => {
                            setBillingEmailModalOrder(order);
                            setCustomerEmail('');
                            setEmailSuccessMsg('');
                            setEmailErrorMsg('');
                          }}
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
        ) : activeTab === 'waiter' ? (
          <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm overflow-hidden h-[800px] relative">
            <WaiterPage embedded={true} />
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm overflow-hidden h-[800px] relative">
            <KDSPage embedded={true} />
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="font-bold text-xl text-slate-900">System Settings</h2>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-slate-600 bg-white rounded-md p-1 border border-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">Auto-print Kitchen Tickets</h3>
                  <p className="text-sm text-slate-500">Automatically print KOT when order is placed</p>
                </div>
                <button 
                  onClick={() => setSettings({...settings, autoPrint: !settings.autoPrint})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.autoPrint ? 'bg-indigo-600' : 'bg-slate-200'}`}
                >
                  <span className={`inline-block w-4 h-4 transform rounded-full bg-white transition-transform ${settings.autoPrint ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">Push Notifications</h3>
                  <p className="text-sm text-slate-500">Enable sounds and popup alerts</p>
                </div>
                <button 
                  onClick={() => setSettings({...settings, notifications: !settings.notifications})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.notifications ? 'bg-indigo-600' : 'bg-slate-200'}`}
                >
                  <span className={`inline-block w-4 h-4 transform rounded-full bg-white transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div>
                <label className="block font-bold text-slate-900 mb-1">Default Tax Rate (%)</label>
                <input 
                  type="number" 
                  value={settings.taxRate} 
                  onChange={(e) => setSettings({...settings, taxRate: e.target.value})}
                  className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors" 
                />
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowSettingsModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors">Cancel</button>
              <button onClick={() => setShowSettingsModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="font-bold text-xl text-slate-900">Add New Staff</h2>
              <button onClick={() => setShowAddStaffModal(false)} className="text-slate-400 hover:text-slate-600 bg-white rounded-md p-1 border border-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-bold text-slate-900 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                  placeholder="e.g. John Doe"
                  className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block font-bold text-slate-900 mb-1">Role</label>
                <select 
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                  className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition-colors appearance-none"
                >
                  <option value="Manager">Manager</option>
                  <option value="Head Chef">Head Chef</option>
                  <option value="Chef">Chef</option>
                  <option value="Waiter">Waiter</option>
                  <option value="Host">Host</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowAddStaffModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors">Cancel</button>
              <button 
                onClick={() => {
                  if(newStaff.name.trim()) {
                    setUsers([{
                      id: users.length + 1,
                      name: newStaff.name,
                      role: newStaff.role,
                      status: 'Offline',
                      lastLogin: 'Never'
                    }, ...users]);
                    setShowAddStaffModal(false);
                    setNewStaff({name: '', role: 'Waiter'});
                  }
                }} 
                className={`px-5 py-2.5 rounded-xl font-bold text-white shadow-md transition-colors ${newStaff.name.trim() ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' : 'bg-slate-300 cursor-not-allowed'}`}
                disabled={!newStaff.name.trim()}
              >
                Add Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* External Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-[80vh] md:h-[600px]">
            {/* Left side - Menu selection */}
            <div className="flex-1 flex flex-col border-r border-slate-200/60 bg-white/50">
              <div className="p-5 border-b border-slate-200/60 flex items-center justify-between bg-white/60 shrink-0">
                <h2 className="font-bold text-xl text-slate-900">Select Items</h2>
                <div className="flex gap-2">
                  <select 
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="border border-slate-200 bg-white rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-teal-500 outline-none text-sm font-bold text-slate-700"
                  >
                    <option value="Takeaway">Takeaway</option>
                    <option value="Online Order">Online Order</option>
                  </select>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {menuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setOrderCart(prev => {
                        const existing = prev.find(i => i.id === item.id);
                        if (existing) {
                          return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
                        }
                        return [...prev, { ...item, qty: 1 }];
                      });
                    }}
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

            {/* Right side - Cart Summary */}
            <div className="w-full md:w-96 flex flex-col bg-slate-50/50">
              <div className="p-5 border-b border-slate-200/60 flex items-center justify-between bg-white/60 shrink-0">
                <h2 className="font-bold text-xl text-slate-900">Cart</h2>
                <button onClick={() => { setShowOrderModal(false); setOrderCart([]); }} className="text-slate-400 hover:text-red-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {orderCart.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                    No items selected
                  </div>
                ) : (
                  orderCart.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-sm">{item.qty}x</span>
                        <span className="text-slate-900 font-bold text-sm">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-slate-600 text-sm">₹{(item.price * item.qty).toFixed(2)}</span>
                        <button 
                          onClick={() => setOrderCart(prev => prev.filter(i => i.id !== item.id))} 
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-5 border-t border-slate-200/60 bg-white/80 shrink-0">
                <div className="flex items-center justify-between font-bold text-slate-900 mb-4">
                  <span>Total amount</span>
                  <span className="text-xl text-teal-600">₹{orderCart.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2)}</span>
                </div>
                <button 
                  disabled={orderCart.length === 0}
                  onClick={() => {
                    // Generate identifier
                    const identifier = Math.floor(100 + Math.random() * 900);
                    placeExternalOrder(`${orderType} #${identifier}`, orderCart);
                    setShowOrderModal(false);
                    setOrderCart([]);
                  }}
                  className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${orderCart.length > 0
                    ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  <Send className="w-5 h-5" /> Send to Kitchen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* E-Bill Send Modal */}
      {billingEmailModalOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-teal-600" />
                Email E-Bill
              </h2>
              <button 
                onClick={() => setBillingEmailModalOrder(null)} 
                className="text-slate-400 hover:text-slate-600 bg-white rounded-md p-1 border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-sm text-slate-500 font-medium tracking-wide">ORDER DETAILS</p>
                <div className="flex justify-between mt-2">
                  <span className="font-bold text-slate-900">{billingEmailModalOrder.tableId}</span>
                  <span className="font-black text-teal-600">₹{billingEmailModalOrder.total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">ID: {billingEmailModalOrder.id}</p>
              </div>

              {emailSuccessMsg ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-4 rounded-xl flex flex-col items-center justify-center gap-3 text-sm font-medium text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  {emailSuccessMsg}
                </div>
              ) : (
                <form onSubmit={handleSendEmail} className="space-y-4">
                  {emailErrorMsg && (
                    <div className="text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2 rounded-lg text-sm font-bold">
                      {emailErrorMsg}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Customer Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white/50 transition-colors outline-none"
                        placeholder="customer@example.com"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Due to format limits, this will download a PDF copy for your records, and send a rich HTML formatted email copy securely to the customer.
                    </p>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isSendingEmail || !customerEmail.trim()}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-4 ${isSendingEmail || !customerEmail.trim()
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/20'}`}
                  >
                    {isSendingEmail ? 'Sending Email...' : 'Download PDF & Email Selected'} <Send className="w-4 h-4 ml-1" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
