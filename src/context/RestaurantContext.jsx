import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

const RestaurantContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useRestaurant = () => useContext(RestaurantContext);

const generateId = () => '#' + Math.floor(1000 + Math.random() * 9000);

export function RestaurantProvider({ children }) {
  const [userRole, setUserRole] = useState(null); // 'admin', 'kitchen', 'waiter'
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleTableChange = (payload) => {
    const formattedTable = { ...payload.new, currentOrder: payload.new.currentorder };
    if (payload.eventType === 'INSERT') {
      setTables(prev => [...prev, formattedTable]);
    } else if (payload.eventType === 'UPDATE') {
      setTables(prev => prev.map(t => t.id === formattedTable.id ? formattedTable : t));
    } else if (payload.eventType === 'DELETE') {
      setTables(prev => prev.filter(t => t.id !== payload.old.id));
    }
  };

  const handleOrderChange = (payload) => {
    const formattedOrder = { ...payload.new, tableId: payload.new.tableid };
    if (payload.eventType === 'INSERT') {
      setOrders(prev => [formattedOrder, ...prev]);
    } else if (payload.eventType === 'UPDATE') {
      setOrders(prev => prev.map(o => o.id === formattedOrder.id ? formattedOrder : o));
    } else if (payload.eventType === 'DELETE') {
      setOrders(prev => prev.filter(o => o.id !== payload.old.id));
    }
  };

  const fetchInitialData = async () => {
    setLoading(true);
    
    // Fetch tables
    const { data: tablesData } = await supabase.from('tables').select('*');
    if (tablesData) {
      setTables(tablesData.map(t => ({ ...t, currentOrder: t.currentorder })));
    }
    
    // Fetch orders
    const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (ordersData) {
      setOrders(ordersData.map(o => ({ ...o, tableId: o.tableid })));
    }

    // Fetch messages
    const { data: messagesData } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
    if (messagesData) setMessages(messagesData);

    setLoading(false);
  };

  // Initial fetch and subscription setup
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchInitialData();

    // Subscribe to realtime changes
    const tablesSubscription = supabase
      .channel('tables-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tables' }, (payload) => {
        handleTableChange(payload);
      })
      .subscribe();

    const ordersSubscription = supabase
      .channel('orders-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        handleOrderChange(payload);
      })
      .subscribe();

    const messagesSubscription = supabase
      .channel('messages-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(tablesSubscription);
      supabase.removeChannel(ordersSubscription);
      supabase.removeChannel(messagesSubscription);
    };
  }, []);



  const getMenuItems = () => [
    { id: 1, category: 'Mains', name: 'Paneer Tikka', price: 350.00 },
    { id: 2, category: 'Mains', name: 'Butter Chicken', price: 450.00 },
    { id: 3, category: 'Mains', name: 'Mutton Biryani', price: 550.00 },
    { id: 4, category: 'Mains', name: 'Dal Makhani', price: 280.00 },
    { id: 5, category: 'Mains', name: 'Palak Paneer', price: 320.00 },
    { id: 6, category: 'Sides', name: 'Garlic Naan', price: 80.00 },
    { id: 7, category: 'Sides', name: 'Tandoori Roti', price: 40.00 },
    { id: 8, category: 'Sides', name: 'Lachha Paratha', price: 60.00 },
    { id: 9, category: 'Sides', name: 'Aloo Paratha', price: 90.00 },
    { id: 10, category: 'Sides', name: 'Masala Papad', price: 60.00 },
    { id: 11, category: 'Drinks', name: 'Masala Chai', price: 50.00 },
    { id: 12, category: 'Drinks', name: 'Sweet Lassi', price: 120.00 },
    { id: 13, category: 'Drinks', name: 'Cold Coffee', price: 150.00 },
  ];

  const placeOrder = async (tableId, items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const newOrderId = generateId();
    
    const newOrder = {
      id: newOrderId,
      tableid: tableId, // Supabase maps unquoted CamelCase to lowercase
      status: 'pending',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items,
      total
    };

    // Insert order to Supabase
    const { error: orderError } = await supabase.from('orders').insert([newOrder]);
    if (orderError) {
      console.error("Error placing order", orderError);
      return;
    }

    // Update table status in Supabase
    await supabase.from('tables').update({ status: 'ordered', currentorder: newOrderId }).eq('id', tableId);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    // Update order status in Supabase
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if(error) {
       console.error("Error updating order", error);
       return;
    }

    // Auto-update table status based on order status
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    if (newStatus === 'cooking') {
      updateTableStatus(order.tableId, 'cooking');
    } else if (newStatus === 'ready') {
      updateTableStatus(order.tableId, 'paying'); // ready to serve and pay
    } else if (newStatus === 'paid') {
      updateTableStatus(order.tableId, 'free', null);
    }
  };

  const updateTableStatus = async (tableId, status, currentOrder = undefined) => {
    const updates = { status };
    if (currentOrder !== undefined) {
      updates.currentorder = currentOrder; // Send as currentorder to match PostgreSQL
    }
    
    const { error } = await supabase.from('tables').update(updates).eq('id', tableId);
    if (error) {
       console.error("Error updating table", error);
    }
  };

  const calculateTableBill = (tableId) => {
    const tableOrders = orders.filter(o => o.tableId === tableId && (o.status !== 'paid' && o.status !== 'cancelled'));
    return tableOrders.reduce((sum, order) => sum + order.total, 0);
  };

  const cancelOrder = async (orderId) => {
    const { error } = await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId);
    if (error) {
       console.error("Error cancelling order", error);
       return;
    }

    const order = orders.find(o => o.id === orderId);
    if (order) {
      updateTableStatus(order.tableId, 'free', null);
    }
  };

  const updateOrderItems = async (orderId, newItems) => {
    const total = newItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const { error } = await supabase.from('orders').update({ items: newItems, total, status: 'pending' }).eq('id', orderId);
    if (error) {
      console.error("Error updating order items", error);
      return;
    }

    const order = orders.find(o => o.id === orderId);
    if (order) {
      updateTableStatus(order.tableId, 'ordered', order.id);
    }
  };
  
  const sendMessage = async (sender, content) => {
      const { error } = await supabase.from('messages').insert([{ sender, content }]);
      if (error) {
          console.error("Error sending message", error);
      }
  };

  const login = (role) => {
    setUserRole(role);
  };

  const logout = () => {
    setUserRole(null);
  };

  const value = {
    userRole,
    login,
    logout,
    tables,
    orders,
    messages,
    loading,
    getMenuItems,
    placeOrder,
    updateOrderStatus,
    updateTableStatus,
    calculateTableBill,
    cancelOrder,
    updateOrderItems,
    sendMessage
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}
