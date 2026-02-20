import { TrendingUp, Users, IndianRupee, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { name: 'Today\'s Revenue', value: '₹4,289', change: '+12.5%', positive: true, icon: IndianRupee },
    { name: 'Active Orders', value: '42', change: '+5.2%', positive: true, icon: Clock },
    { name: 'Served Customers', value: '184', change: '-2.4%', positive: false, icon: Users },
    { name: 'Average Ticket', value: '₹38.50', change: '+8.1%', positive: true, icon: TrendingUp },
  ];

  const recentOrders = [
    { id: '#1024', table: 'T-12', status: 'ready', time: '2 min ago', total: '₹85.00' },
    { id: '#1025', table: 'T-04', status: 'cooking', time: '5 min ago', total: '₹142.50' },
    { id: '#1026', table: 'T-08', status: 'pending', time: '8 min ago', total: '₹45.00' },
    { id: '#1027', table: 'T-02', status: 'ready', time: '12 min ago', total: '₹210.00' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Here's what's happening in your restaurant today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Live Activity (Placeholder Chart)</h2>
          <div className="h-64 w-full bg-slate-50 rounded-lg flex items-center justify-center border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">Revenue Chart Area</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</button>
          </div>

          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                    {order.table}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{order.id}</p>
                    <p className="text-xs text-slate-500">{order.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{order.total}</p>
                  <p className={`text-xs font-medium capitalize mt-0.5 ${order.status === 'ready' ? 'text-emerald-600' :
                      order.status === 'cooking' ? 'text-amber-500' : 'text-slate-500'
                    }`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
