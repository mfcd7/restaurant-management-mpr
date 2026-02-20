import { LineChart, BarChart3, Users, Settings, Database, Activity } from 'lucide-react';

export default function AdminPage() {
  const users = [
    { id: 1, name: 'Priya Patil', role: 'Manager', status: 'Active', lastLogin: '2 mins ago' },
    { id: 2, name: 'Vikram Singh', role: 'Head Chef', status: 'Active', lastLogin: '1 hour ago' },
    { id: 3, name: 'Kavya Mehta', role: 'Waiter', status: 'Offline', lastLogin: 'Yesterday' },
    { id: 4, name: 'Aryan Sharma', role: 'Waiter', status: 'Active', lastLogin: '15 mins ago' },
    { id: 5, name: 'Arjun Malhotra', role: 'Host', status: 'Active', lastLogin: '10 mins ago' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Console</h1>
          <p className="text-slate-500 mt-1">Manage users, system settings, and analytics.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Database className="w-4 h-4" /> Export Data
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
            <Settings className="w-4 h-4" /> System Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Staff</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">24</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">+2 this month</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <LineChart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">System Uptime</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">99.9%</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">All systems operational</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">API Requests</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">1.2M</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Last 30 days</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Staff Management</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Add Staff</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.lastLogin}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-700">{user.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-900">Weekly Revenue (Placeholder)</h2>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-64 w-full flex items-end justify-between gap-2">
            {[40, 70, 45, 90, 65, 80, 50].map((height, idx) => (
              <div key={idx} className="w-full bg-indigo-50 rounded-t-sm hover:bg-indigo-100 transition-colors relative group">
                <div
                  className="absolute bottom-0 w-full bg-indigo-600 rounded-t-md group-hover:bg-indigo-500 transition-colors"
                  style={{ height: `${height}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-bold text-slate-400 px-2">
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
    </div>
  );
}
