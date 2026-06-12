import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SafeImage from './SafeImage';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  Settings, 
  LogOut, 
  Sliders, 
  BarChart3,
  Mail,
  Bell,
  Menu,
  X
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookings, logout, user, notifications, unreadNotificationCount, unreadMessageCount, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path
      ? 'bg-red-900 border-l-4 border-white font-medium text-white'
      : 'text-red-100 hover:bg-red-900/50 hover:text-white transition';
  };

  // Dynamic counts for badges
  const allCount = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const initials = `${user?.firstName?.[0] || 'A'}${user?.lastName?.[0] || 'D'}`;
  const displayName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Admin';

  return (
    <div className="min-h-screen flex bg-slate-50 relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Sidebar - Deep Maroon/Crimson Panel */}
      <aside className={`w-64 bg-[#7F0D0D] text-white flex flex-col flex-shrink-0 shadow-xl fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Title/Logo Section */}
        <div className="p-6 border-b border-red-900/60 flex justify-between items-center">
          <Link to="/" className="block">
            <span className="text-3xl font-extrabold tracking-tighter block font-serif">DRIVEX</span>
            <span className="text-xs text-red-300 font-semibold uppercase tracking-wider block -mt-1">Admin Panel</span>
          </Link>
          <button 
            className="md:hidden text-white hover:text-red-300"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* User Card */}
        <div className="p-6 border-b border-red-900/40 flex items-center space-x-3">
          {user?.profilePhoto ? (
            <SafeImage src={user.profilePhoto} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-red-400" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-red-900 flex items-center justify-center font-bold border border-red-400">{initials}</div>
          )}
          <div>
            <h4 className="font-semibold text-sm">{displayName}</h4>
            <span className="text-xs text-red-300">{user?.role || 'Super Administrator'}</span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-7">
          {/* Main Category */}
          <div>
            <span className="px-3 text-xs font-bold text-red-300 uppercase tracking-widest block mb-3">Main</span>
            <nav className="space-y-1">
              <Link to="/admin" className={`flex items-center justify-between px-3 py-2 rounded text-sm ${isActive('/admin')}`}>
                <div className="flex items-center space-x-3">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </div>
              </Link>

              <Link to="/admin/bookings" className={`flex items-center justify-between px-3 py-2 rounded text-sm ${isActive('/admin/bookings')}`}>
                <div className="flex items-center space-x-3">
                  <CalendarDays size={18} />
                  <span>All Bookings</span>
                </div>
                {allCount > 0 && (
                  <span className="bg-red-800 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {allCount}
                  </span>
                )}
              </Link>

              <Link to="/admin/pending" className={`flex items-center justify-between px-3 py-2 rounded text-sm ${isActive('/admin/pending')}`}>
                <div className="flex items-center space-x-3">
                  <Clock size={18} />
                  <span>Pending</span>
                </div>
                {pendingCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </Link>

              <Link to="/admin/completed" className={`flex items-center justify-between px-3 py-2 rounded text-sm ${isActive('/admin/completed')}`}>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 size={18} />
                  <span>Completed</span>
                </div>
              </Link>
            </nav>
          </div>

          {/* Manage Category */}
          <div>
            <span className="px-3 text-xs font-bold text-red-300 uppercase tracking-widest block mb-3">Manage</span>
            <nav className="space-y-1">
              <Link to="/admin/services" className={`flex items-center px-3 py-2 rounded text-sm ${isActive('/admin/services')}`}>
                <div className="flex items-center space-x-3">
                  <Sliders size={18} />
                  <span>Service Categories</span>
                </div>
              </Link>
              <Link to="/admin/reports" className={`flex items-center px-3 py-2 rounded text-sm ${isActive('/admin/reports')}`}>
                <div className="flex items-center space-x-3">
                  <BarChart3 size={18} />
                  <span>Reports</span>
                </div>
              </Link>
              <Link to="/admin/messages" className={`flex items-center justify-between px-3 py-2 rounded text-sm ${isActive('/admin/messages')}`}>
                <div className="flex items-center space-x-3">
                  <Mail size={18} />
                  <span>Contact Messages</span>
                </div>
                {unreadMessageCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{unreadMessageCount}</span>
                )}
              </Link>
            </nav>
          </div>

          {/* System Category */}
          <div>
            <span className="px-3 text-xs font-bold text-red-300 uppercase tracking-widest block mb-3">System</span>
            <nav className="space-y-1">
              <Link to="/admin/settings" className={`flex items-center px-3 py-2 rounded text-sm ${isActive('/admin/settings')}`}>
                <div className="flex items-center space-x-3">
                  <Settings size={18} />
                  <span>Settings</span>
                </div>
              </Link>
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center px-3 py-2 rounded text-sm text-red-100 hover:bg-red-900/50 hover:text-white transition"
              >
                <div className="flex items-center space-x-3">
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </div>
              </button>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-4 text-gray-600 hover:text-red-600" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">DriveX Control Suite</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition">
                <Bell size={20} />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Notifications</span>
                    {unreadNotificationCount > 0 && (
                      <button onClick={markAllNotificationsAsRead} className="text-[10px] font-bold text-red-600 hover:underline uppercase">Mark all read</button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-center py-8 text-gray-400 text-xs font-semibold">No notifications</p>
                    ) : notifications.slice(0, 20).map((n) => (
                      <button key={n._id} onClick={() => { markNotificationAsRead(n._id); if (n.link) navigate(n.link); setShowNotifications(false); }}
                        className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition ${!n.isRead ? 'bg-red-50/50' : ''}`}>
                        <p className="text-xs font-bold text-gray-900">{n.title}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-gray-400 mt-1 block">{new Date(n.createdAt).toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-gray-500">Welcome, {displayName}</span>
            {user?.profilePhoto ? (
              <SafeImage src={user.profilePhoto} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#7F0D0D] text-white flex items-center justify-center font-bold text-sm">{initials}</div>
            )}
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 overflow-auto p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
