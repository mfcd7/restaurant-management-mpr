import { createContext, useState, useContext } from 'react';

const RestaurantContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useRestaurant = () => useContext(RestaurantContext);

const generateId = () => '#' + Math.floor(1000 + Math.random() * 9000);

export function RestaurantProvider({ children }) {
  // Initial dummy tables
  const [tables, setTables] = useState([
    { id: 'T-01', status: 'free', capacity: 2, currentOrder: null },
    { id: 'T-02', status: 'occupied', capacity: 4, currentOrder: null },
    { id: 'T-03', status: 'ordered', capacity: 4, currentOrder: null }, // Will populate on mount
    { id: 'T-04', status: 'free', capacity: 6, currentOrder: null },
    { id: 'T-05', status: 'cooking', capacity: 2, currentOrder: null },
    { id: 'T-06', status: 'free', capacity: 4, currentOrder: null },
    { id: 'T-07', status: 'paying', capacity: 8, currentOrder: null },
    { id: 'T-08', status: 'free', capacity: 2, currentOrder: null },
  ]);

  // Initial dummy orders (Kitchen & Admin perspective)
  const [orders, setOrders] = useState([
    {
      id: generateId(),
      tableId: 'T-03',
      status: 'pending', // pending, cooking, ready, billed, paid
      time: '12:30 PM',
      items: [
        { name: 'Paneer Tikka', qty: 2, price: 350.00 },
        { name: 'Garlic Naan', qty: 1, price: 80.00 }
      ],
      total: 780.00
    },
    {
      id: generateId(),
      tableId: 'T-05',
      status: 'cooking',
      time: '12:15 PM',
      items: [
        { name: 'Butter Chicken', qty: 1, price: 450.00, notes: 'Spicy' }
      ],
      total: 450.00
    },
    {
      id: generateId(),
      tableId: 'T-07',
      status: 'ready', // ready for billing/serving
      time: '11:45 AM',
      items: [
        { name: 'Mutton Biryani', qty: 2, price: 550.00 },
        { name: 'Sweet Lassi', qty: 2, price: 120.00 }
      ],
      total: 1340.00
    }
  ]);

  const getMenuItems = () => [
    { id: 1, category: 'Mains', name: 'Paneer Tikka', price: 350.00 },
    { id: 2, category: 'Mains', name: 'Butter Chicken', price: 450.00 },
    { id: 3, category: 'Mains', name: 'Mutton Biryani', price: 550.00 },
    { id: 4, category: 'Sides', name: 'Garlic Naan', price: 80.00 },
    { id: 5, category: 'Sides', name: 'Masala Papad', price: 60.00 },
    { id: 6, category: 'Drinks', name: 'Masala Chai', price: 50.00 },
    { id: 7, category: 'Drinks', name: 'Sweet Lassi', price: 120.00 },
  ];

  const placeOrder = (tableId, items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const newOrder = {
      id: generateId(),
      tableId,
      status: 'pending',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items,
      total
    };

    setOrders(prev => [newOrder, ...prev]);
    setTables(prev => prev.map(t =>
      t.id === tableId ? { ...t, status: 'ordered', currentOrder: newOrder.id } : t
    ));
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    // Auto-update table status based on order status
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    if (newStatus === 'cooking') {
      updateTableStatus(order.tableId, 'cooking');
    } else if (newStatus === 'ready') {
      updateTableStatus(order.tableId, 'paying'); // ready to serve and pay
    } else if (newStatus === 'paid') {
      updateTableStatus(order.tableId, 'free');
    }
  };

  const updateTableStatus = (tableId, status) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status } : t));
  };

  const calculateTableBill = (tableId) => {
    const tableOrders = orders.filter(o => o.tableId === tableId && (o.status !== 'paid'));
    return tableOrders.reduce((sum, order) => sum + order.total, 0);
  };

  const value = {
    tables,
    orders,
    getMenuItems,
    placeOrder,
    updateOrderStatus,
    updateTableStatus,
    calculateTableBill,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}
