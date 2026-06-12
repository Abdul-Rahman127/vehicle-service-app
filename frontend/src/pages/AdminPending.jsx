import React from 'react';
import AdminLayout from '../components/AdminLayout';
import { useApp } from '../context/AppContext';
import { Clock, Phone, Car, Calendar, Sliders, CheckCircle, XCircle } from 'lucide-react';

const AdminPending = () => {
  const { bookings, updateStatus } = useApp();

  const pendingBookings = bookings.filter(b => b.status === 'Pending');

  // Stats boxes
  const pendingCount = pendingBookings.length;
  const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  const dueToday = pendingBookings.filter(b => b.date && b.date.includes(today.split(' ')[0])).length;
  const urgentCount = pendingBookings.filter(b => {
    const created = new Date(b.createdAt);
    const hoursAgo = (Date.now() - created.getTime()) / (1000 * 60 * 60);
    return hoursAgo > 24;
  }).length;

  return (
    <AdminLayout>
      {/* Title Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">PENDING BOOKINGS</h1>
        <p className="text-gray-400 text-xs">Review and take action on all pending service requests.</p>
      </div>

      {/* Warning Box */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-900 p-4 rounded-r-lg mb-8 shadow-sm flex items-center space-x-3 text-xs sm:text-sm font-medium">
          <Clock className="text-amber-600 animate-pulse flex-shrink-0" size={20} />
          <div>
            <strong className="block font-bold">{pendingCount} bookings need your attention!</strong>
            <span>Please review and approve or reject pending requests as soon as possible.</span>
          </div>
        </div>
      )}

      {/* Mini Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            ⌛
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Pending Now</span>
            <span className="text-2xl font-black text-amber-600 block mt-0.5">{pendingCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold">
            📅
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Due Today</span>
            <span className="text-2xl font-black text-gray-800 block mt-0.5">{dueToday}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            ⚡
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Urgent (&lt;2hr)</span>
            <span className="text-2xl font-black text-gray-800 block mt-0.5">{urgentCount}</span>
          </div>
        </div>
      </div>

      {/* Card Grid View */}
      <div className="mb-12">
        <h3 className="font-bold text-gray-900 text-base mb-6 uppercase tracking-wider">Pending Requests ({pendingCount})</h3>
        
        {pendingCount === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">All caught up! No pending bookings.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingBookings.map((b) => (
              <div 
                key={b._id} 
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#7F0D0D] text-white flex items-center justify-center font-bold text-xs uppercase">
                        {b.customerName.slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{b.customerName}</h4>
                        <span className="text-xs text-gray-400 block font-semibold">{b.phone}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-amber-600 font-bold font-mono tracking-wider">{b.bookingId || 'BK013'}</span>
                  </div>

                  {/* Card fields */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-xs text-gray-600">
                    <div className="bg-gray-50 p-2.5 rounded">
                      <span className="text-gray-400 block font-semibold uppercase text-[9px] mb-0.5">Vehicle</span>
                      <span className="font-bold text-gray-800">{b.vehicleNumber}</span>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded">
                      <span className="text-gray-400 block font-semibold uppercase text-[9px] mb-0.5">Service</span>
                      <span className="font-bold text-red-600 uppercase">{b.serviceType}</span>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded">
                      <span className="text-gray-400 block font-semibold uppercase text-[9px] mb-0.5">Preferred Date</span>
                      <span className="font-bold text-gray-800">{b.date}</span>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded">
                      <span className="text-gray-400 block font-semibold uppercase text-[9px] mb-0.5">Preferred Time</span>
                      <span className="font-bold text-gray-800">{b.time}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-gray-100 text-[10px] font-bold uppercase tracking-wider">
                  <button 
                    onClick={() => updateStatus(b._id, 'Approved')}
                    className="border border-blue-200 text-blue-600 bg-blue-50/50 hover:bg-blue-100/70 py-2 rounded text-center transition"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => updateStatus(b._id, 'Completed')}
                    className="border border-green-200 text-green-600 bg-green-50/50 hover:bg-green-100/70 py-2 rounded text-center transition"
                  >
                    Complete
                  </button>
                  <button 
                    onClick={() => updateStatus(b._id, 'Rejected')}
                    className="border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-100/70 py-2 rounded text-center transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Table View Section */}
      <div>
        <h3 className="font-bold text-gray-900 text-base mb-5 uppercase tracking-wider">Pending — Table View</h3>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
              <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-center">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {pendingCount === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-gray-400 font-bold uppercase tracking-wider text-xs">
                      No pending records in table view.
                    </td>
                  </tr>
                ) : (
                  pendingBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-xs font-mono font-bold text-gray-400">{b.bookingId || 'BK013'}</td>
                      <td className="px-6 py-4 text-gray-900 font-bold">{b.customerName}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-500">{b.phone}</td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-800">{b.vehicleNumber}</td>
                      <td className="px-6 py-4 text-xs font-bold text-red-600 uppercase">{b.serviceType}</td>
                      <td className="px-6 py-4 text-xs">{b.date} ({b.time})</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center space-x-2">
                          <button 
                            onClick={() => updateStatus(b._id, 'Approved')}
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-blue-200 transition"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => updateStatus(b._id, 'Completed')}
                            className="bg-green-50 text-green-600 hover:bg-green-100 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-green-200 transition"
                          >
                            Complete
                          </button>
                          <button 
                            onClick={() => updateStatus(b._id, 'Rejected')}
                            className="bg-red-50 text-red-600 hover:bg-red-100 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-red-200 transition"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPending;
