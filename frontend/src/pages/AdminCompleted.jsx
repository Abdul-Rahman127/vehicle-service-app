import React from 'react';
import AdminLayout from '../components/AdminLayout';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Star } from 'lucide-react';

const AdminCompleted = () => {
  const { bookings, stats } = useApp();

  const completedBookings = bookings.filter(b => b.status === 'Completed');
  const totalCompletedCount = completedBookings.length;
  const completedToday = stats.completedToday || 0;
  const avgRating = stats.avgRating || 0;
  const satisfaction = stats.satisfactionPercent || 0;

  const ratedCompleted = completedBookings.filter(b => b.rating);
  const avgDuration = completedBookings.length
    ? Math.round(completedBookings.reduce((sum, b) => {
        const svc = stats.serviceStats?.find(s => s._id === b.serviceType);
        return sum + 45;
      }, 0) / completedBookings.length)
    : 0;

  const topCompleted = (stats.completedServiceStats || stats.serviceStats || []).slice(0, 3);
  const maxCount = topCompleted[0]?.count || 1;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">COMPLETED BOOKINGS</h1>
        <p className="text-gray-400 text-xs">All successfully completed vehicle service records.</p>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 mb-8 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Performance Overview</h4>
            <p className="text-gray-500 text-xs mt-0.5">
              {totalCompletedCount} services completed with {satisfaction}% satisfaction rate.
            </p>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <span className="text-3xl font-black text-emerald-600 block">{satisfaction}%</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Satisfaction</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Completed</span>
          <span className="text-2xl font-black text-gray-800 block mt-1">{totalCompletedCount}</span>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Completed Today</span>
          <span className="text-2xl font-black text-emerald-600 block mt-1">{completedToday}</span>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Avg Rating</span>
            <span className="text-2xl font-black text-amber-500 block mt-1">{avgRating || '—'}</span>
          </div>
          <div className="flex items-center text-amber-500 space-x-0.5">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.round(avgRating) ? 'currentColor' : 'none'} />)}
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Rated Services</span>
          <span className="text-2xl font-black text-gray-800 block mt-1">{ratedCompleted.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-10">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Completed Service Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">ID</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Vehicle</th><th className="px-6 py-4">Service</th><th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time</th><th className="px-6 py-4">Rating</th><th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {completedBookings.length === 0 ? (
                <tr><td colSpan="9" className="text-center py-16 text-gray-400 font-bold uppercase tracking-wider text-xs">No completed bookings in database yet.</td></tr>
              ) : completedBookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-xs font-mono font-bold text-gray-400">{b.bookingId}</td>
                  <td className="px-6 py-4 text-gray-900 font-bold">{b.customerName}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-gray-500">{b.phone}</td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-800">{b.vehicleNumber}</td>
                  <td className="px-6 py-4 text-xs font-bold text-red-600 uppercase">{b.serviceType}</td>
                  <td className="px-6 py-4 text-xs">{b.date}</td>
                  <td className="px-6 py-4 text-xs">{b.time}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-amber-500 space-x-0.5">
                      {[...Array(b.rating || 0)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                      {!b.rating && <span className="text-gray-300 text-xs">—</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded font-bold uppercase">Completed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 text-sm mb-6 uppercase tracking-wider">Top Completed Services</h3>
          <div className="space-y-4">
            {topCompleted.length === 0 ? (
              <p className="text-gray-400 text-xs font-semibold uppercase">No data yet</p>
            ) : topCompleted.map((s) => (
              <div key={s._id}>
                <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                  <span>{s._id}</span>
                  <span className="font-bold text-gray-800">{s.count} completions</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(s.count / maxCount) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 text-sm mb-6 uppercase tracking-wider">Recent Completions</h3>
          <div className="space-y-4">
            {completedBookings.slice(0, 3).map((b) => (
              <div key={b._id} className="flex items-start space-x-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 font-bold">✓</div>
                <div>
                  <p className="text-gray-800 font-medium"><strong className="text-gray-900">{b.customerName}</strong> booking marked Completed.</p>
                  <span className="text-[10px] text-gray-400 font-semibold block uppercase mt-0.5">{b.serviceType} | {b.vehicleNumber}</span>
                </div>
              </div>
            ))}
            {completedBookings.length === 0 && <p className="text-gray-400 text-xs font-semibold uppercase">No recent completions</p>}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCompleted;
