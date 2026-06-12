import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Trash2, 
  TrendingUp,
  Clock,
  ArrowUpRight
} from 'lucide-react';

const AdminDashboard = () => {
  const { bookings, stats, updateStatus, removeBooking } = useApp();
  const [activeTab, setActiveTab] = useState('All');

  // Filter bookings based on activeTab
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'All') return true;
    return b.status === activeTab;
  }).slice(0, 7); // Show latest 7 in the dashboard list

  // Quick stats values from local database
  const totalCount = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const approvedCount = bookings.filter(b => b.status === 'Approved').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;
  const rejectedCount = bookings.filter(b => b.status === 'Rejected').length;

  // Status colors utility
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded font-bold uppercase">Pending</span>;
      case 'Approved':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded font-bold uppercase">Approved</span>;
      case 'Completed':
        return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded font-bold uppercase">Completed</span>;
      case 'Rejected':
        return <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded font-bold uppercase">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">DASHBOARD OVERVIEW</h1>
          <p className="text-gray-400 text-xs">DriveX performance statistics and booking list updates.</p>
        </div>
        <div className="bg-white px-4 py-2 border border-gray-200 rounded text-xs font-semibold text-gray-600 flex items-center space-x-1.5 shadow-sm">
          <Clock size={14} className="text-red-600" />
          <span>Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Total Bookings */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Total Bookings</span>
            <span className="text-3xl font-black text-gray-900 mt-1 block">{totalCount}</span>
            {stats.bookingsThisWeek > 0 && (
              <span className="text-[10px] text-green-600 font-bold mt-1 inline-flex items-center space-x-0.5">
                <span>{stats.bookingsThisWeek} this week</span>
              </span>
            )}
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Pending</span>
            <span className="text-3xl font-black text-amber-600 mt-1 block">{pendingCount}</span>
            <span className="text-[10px] text-amber-600 font-semibold mt-1 inline-flex items-center">
              <span>Needs attention</span>
            </span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
            <AlertCircle size={20} />
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Completed</span>
            <span className="text-3xl font-black text-green-600 mt-1 block">{completedCount}</span>
            <span className="text-[10px] text-green-600 font-bold mt-1 inline-flex items-center space-x-0.5">
              <span>{stats.completedToday || 0} today</span>
            </span>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Rejected</span>
            <span className="text-3xl font-black text-red-600 mt-1 block">{rejectedCount}</span>
            <span className="text-[10px] text-gray-400 font-semibold mt-1 inline-flex items-center">
              <span>All time logs</span>
            </span>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
            <XCircle size={20} />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Bookings Table (2 cols width) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="font-bold text-gray-900 text-base uppercase tracking-wider">Recent Bookings</h3>
              
              {/* Tab Filters */}
              <div className="flex flex-wrap gap-1.5 text-xs font-bold">
                {['All', 'Pending', 'Approved', 'Completed', 'Rejected'].map((tab) => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded uppercase tracking-wider transition ${activeTab === tab ? 'bg-red-600 text-white shadow' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* List / Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
                <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">ID / Customer</th>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Date/Time</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-gray-400 font-semibold uppercase tracking-wider text-xs">
                        No bookings found for active filter.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <span className="text-xs text-gray-400 font-mono block">{booking.bookingId || 'BK013'}</span>
                          <span className="font-bold text-gray-800">{booking.customerName}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-800">{booking.vehicleNumber}</span>
                          <span className="text-[10px] text-gray-400 block font-semibold uppercase">{booking.vehicleType}</span>
                        </td>
                        <td className="px-6 py-4 text-red-600 font-bold text-xs uppercase">{booking.serviceType}</td>
                        <td className="px-6 py-4 text-xs font-semibold">
                          <span>{booking.date}</span>
                          <span className="text-gray-400 block">{booking.time}</span>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center items-center space-x-2">
                            {booking.status === 'Pending' && (
                              <button 
                                onClick={() => updateStatus(booking._id, 'Approved')}
                                className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2.5 py-1 rounded font-bold uppercase transition"
                              >
                                Approve
                              </button>
                            )}
                            {(booking.status === 'Approved' || booking.status === 'Pending') && (
                              <button 
                                onClick={() => updateStatus(booking._id, 'Completed')}
                                className="text-xs bg-green-50 text-green-600 hover:bg-green-100 px-2.5 py-1 rounded font-bold uppercase transition"
                              >
                                Done
                              </button>
                            )}
                            {booking.status === 'Pending' && (
                              <button 
                                onClick={() => updateStatus(booking._id, 'Rejected')}
                                className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 rounded font-bold uppercase transition"
                              >
                                Reject
                              </button>
                            )}
                            <button 
                              onClick={() => removeBooking(booking._id)}
                              className="text-gray-400 hover:text-red-600 p-1.5 transition rounded-full hover:bg-gray-100"
                              title="Delete log"
                            >
                              <Trash2 size={15} />
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

          <div className="p-4 border-t border-gray-100 text-center bg-gray-50/50">
            <span className="text-xs text-gray-400 font-semibold uppercase">Showing latest updates</span>
          </div>
        </div>

        {/* Right Column: Status Breakdown & Top Services */}
        <div className="space-y-8">
          
          {/* Status Breakdown Panel */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 text-base mb-5 uppercase tracking-wider">Status Breakdown</h3>
            
            <div className="space-y-4">
              {/* Completed Row */}
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5 uppercase">
                  <span>Completed</span>
                  <span className="text-green-600 font-extrabold">{completedCount} ({totalCount > 0 ? Math.round((completedCount/totalCount)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500 h-full transition-all duration-500" 
                    style={{ width: `${totalCount > 0 ? (completedCount/totalCount)*100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Pending Row */}
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5 uppercase">
                  <span>Pending</span>
                  <span className="text-amber-600 font-extrabold">{pendingCount} ({totalCount > 0 ? Math.round((pendingCount/totalCount)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full transition-all duration-500" 
                    style={{ width: `${totalCount > 0 ? (pendingCount/totalCount)*100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Approved Row */}
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5 uppercase">
                  <span>Approved</span>
                  <span className="text-blue-600 font-extrabold">{approvedCount} ({totalCount > 0 ? Math.round((approvedCount/totalCount)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full transition-all duration-500" 
                    style={{ width: `${totalCount > 0 ? (approvedCount/totalCount)*100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Rejected Row */}
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5 uppercase">
                  <span>Rejected</span>
                  <span className="text-red-600 font-extrabold">{rejectedCount} ({totalCount > 0 ? Math.round((rejectedCount/totalCount)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-red-500 h-full transition-all duration-500" 
                    style={{ width: `${totalCount > 0 ? (rejectedCount/totalCount)*100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Services Panel */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 text-base mb-5 uppercase tracking-wider">Top Services</h3>
            <div className="space-y-4">
              {(stats.serviceStats || []).slice(0, 5).length === 0 ? (
                <p className="text-gray-400 text-xs font-semibold uppercase">No booking data yet</p>
              ) : (stats.serviceStats || []).slice(0, 5).map((s, i) => (
                <div key={s._id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-semibold">{i + 1}. {s._id}</span>
                  <span className="bg-red-100 text-red-600 font-extrabold text-xs px-2.5 py-0.5 rounded">{s.count} bookings</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
