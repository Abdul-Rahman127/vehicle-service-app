import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { useApp } from '../context/AppContext';
import * as api from '../api';
import SafeImage from '../components/SafeImage';
import { Camera, Check, ShieldAlert } from 'lucide-react';

const AdminSettings = () => {
  const { user, setUser, logout, refreshData } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeMenu, setActiveMenu] = useState('Profile');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');

  const [businessInfo, setBusinessInfo] = useState({
    name: '', address: '', city: 'Kandy', country: 'Sri Lanka',
    phone: '', email: '', website: '', description: ''
  });
  const [bookingSettings, setBookingSettings] = useState({
    slotDuration: 30, maxDailyBookings: 20, autoApprove: false, advanceBookingDays: 30
  });
  const [notifications, setNotifications] = useState({
    emailBookings: true, emailReminders: true, smsBookings: false, smsReminders: false, weeklyReport: true
  });
  const [workingHours, setWorkingHours] = useState([]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dangerConfirm, setDangerConfirm] = useState('');
  const [dangerPassword, setDangerPassword] = useState('');
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setProfilePhoto(user.profilePhoto || '');
    }
  }, [user]);

  useEffect(() => {
    api.getSettings().then((s) => {
      if (s.businessInfo) setBusinessInfo(s.businessInfo);
      if (s.bookingSettings) setBookingSettings(s.bookingSettings);
      if (s.notifications) setNotifications(s.notifications);
      if (s.workingHours) setWorkingHours(s.workingHours);
    }).catch(() => {});
  }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setErrorMsg('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Photo must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await api.updateProfilePhoto(reader.result);
        setProfilePhoto(res.user.profilePhoto);
        setUser(res.user);
        showSuccess('Profile photo updated successfully');
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Failed to upload photo');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      if (activeMenu === 'Profile') {
        const res = await api.updateProfile({ firstName, lastName, email, phone });
        setUser(res.user);
        showSuccess('Profile updated successfully');
      } else if (activeMenu === 'Business Info') {
        await api.updateSettings('businessInfo', businessInfo);
        showSuccess('Business information saved');
        refreshData();
      } else if (activeMenu === 'Booking Settings') {
        await api.updateSettings('bookingSettings', bookingSettings);
        showSuccess('Booking settings saved');
      } else if (activeMenu === 'Notifications') {
        await api.updateSettings('notifications', notifications);
        showSuccess('Notification preferences saved');
      } else if (activeMenu === 'Working Hours') {
        await api.updateSettings('workingHours', workingHours);
        showSuccess('Working hours saved');
        refreshData();
      } else if (activeMenu === 'Security') {
        if (newPassword !== confirmPassword) {
          setErrorMsg('New passwords do not match');
          return;
        }
        await api.changePassword({ currentPassword, newPassword });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        showSuccess('Password changed successfully');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDangerAction = async (action) => {
    if (!dangerConfirm || !dangerPassword) {
      setErrorMsg('Enter confirmation text and password');
      return;
    }
    setSaving(true);
    try {
      await api.dangerZoneAction(action, dangerConfirm, dangerPassword);
      setDangerConfirm('');
      setDangerPassword('');
      if (action === 'deleteAccount') {
        logout();
        navigate('/login');
        return;
      }
      showSuccess('Action completed successfully');
      refreshData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Action failed');
    } finally {
      setSaving(false);
    }
  };

  const menuItems = ['Profile', 'Business Info', 'Booking Settings', 'Notifications', 'Security', 'Working Hours', 'Danger Zone'];
  const initials = `${firstName?.[0] || 'A'}${lastName?.[0] || 'D'}`;

  return (
    <AdminLayout>
      <form onSubmit={handleSaveChanges}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight font-sans">SETTINGS</h1>
            <p className="text-gray-400 text-xs">Manage your DriveX system preferences.</p>
          </div>
          {activeMenu !== 'Danger Zone' && (
            <button type="submit" disabled={saving} className="bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs tracking-wider uppercase px-6 py-2.5 rounded shadow shadow-red-200 transition disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>

        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm font-semibold flex items-center space-x-2">
            <Check size={16} /><span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm font-semibold flex items-center space-x-2">
            <ShieldAlert size={16} /><span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 h-fit">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button key={item} type="button" onClick={() => { setActiveMenu(item); setErrorMsg(''); }}
                  className={`w-full text-left px-4 py-2.5 rounded text-sm font-semibold uppercase tracking-wide transition ${activeMenu === item ? 'bg-red-50 text-red-600 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
            {activeMenu === 'Profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 text-base uppercase tracking-wider">Admin Profile</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Update your personal information.</p>
                </div>
                <div className="flex items-center space-x-5 py-4 border-y border-gray-100">
                  {profilePhoto ? (
                    <SafeImage src={profilePhoto} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-red-300 shadow" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-3xl border-2 border-red-300 shadow">{initials}</div>
                  )}
                  <div>
                    <input type="file" ref={fileInputRef} accept="image/jpeg,image/png" className="hidden" onChange={handlePhotoUpload} />
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs tracking-wider uppercase px-4 py-2 rounded transition inline-flex items-center space-x-1.5">
                      <Camera size={14} /><span>Upload Photo</span>
                    </button>
                    <span className="text-[10px] text-gray-400 block mt-1.5 font-semibold uppercase tracking-wide">JPG, PNG up to 2MB</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">First Name</label>
                    <input type="text" required className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none bg-gray-50/50" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Name</label>
                    <input type="text" required className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none bg-gray-50/50" value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                    <input type="email" required className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none bg-gray-50/50" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                    <input type="text" required className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none bg-gray-50/50" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                </div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
                  <input type="text" readOnly className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm bg-gray-50 text-gray-400 font-bold uppercase tracking-wider cursor-not-allowed" value={user?.role || 'Super Administrator'} /></div>
              </div>
            )}

            {activeMenu === 'Business Info' && (
              <div className="space-y-6">
                <div><h3 className="font-bold text-gray-900 text-base uppercase tracking-wider">Business Information</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Manage your service center details.</p></div>
                {['name', 'address', 'city', 'country', 'phone', 'email', 'website'].map((field) => (
                  <div key={field}><label className="block text-xs font-bold text-gray-500 uppercase mb-1">{field.replace(/([A-Z])/g, ' $1')}</label>
                    <input type="text" className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none bg-gray-50/50"
                      value={businessInfo[field] || ''} onChange={(e) => setBusinessInfo({ ...businessInfo, [field]: e.target.value })} /></div>
                ))}
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                  <textarea rows="3" className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none bg-gray-50/50"
                    value={businessInfo.description || ''} onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })} /></div>
              </div>
            )}

            {activeMenu === 'Booking Settings' && (
              <div className="space-y-6">
                <div><h3 className="font-bold text-gray-900 text-base uppercase tracking-wider">Booking Settings</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Configure booking rules and limits.</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slot Duration (mins)</label>
                    <input type="number" className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none bg-gray-50/50"
                      value={bookingSettings.slotDuration} onChange={(e) => setBookingSettings({ ...bookingSettings, slotDuration: parseInt(e.target.value) })} /></div>
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Max Daily Bookings</label>
                    <input type="number" className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none bg-gray-50/50"
                      value={bookingSettings.maxDailyBookings} onChange={(e) => setBookingSettings({ ...bookingSettings, maxDailyBookings: parseInt(e.target.value) })} /></div>
                  <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Advance Booking Days</label>
                    <input type="number" className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none bg-gray-50/50"
                      value={bookingSettings.advanceBookingDays} onChange={(e) => setBookingSettings({ ...bookingSettings, advanceBookingDays: parseInt(e.target.value) })} /></div>
                </div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-600">
                  <input type="checkbox" checked={bookingSettings.autoApprove} onChange={(e) => setBookingSettings({ ...bookingSettings, autoApprove: e.target.checked })} className="rounded text-red-600" />
                  <span>Auto-approve new bookings</span>
                </label>
              </div>
            )}

            {activeMenu === 'Notifications' && (
              <div className="space-y-6">
                <div><h3 className="font-bold text-gray-900 text-base uppercase tracking-wider">Notification Preferences</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Choose how you receive alerts.</p></div>
                {[
                  { key: 'emailBookings', label: 'Email notifications for new bookings' },
                  { key: 'emailReminders', label: 'Email reminders for upcoming appointments' },
                  { key: 'smsBookings', label: 'SMS notifications for new bookings' },
                  { key: 'smsReminders', label: 'SMS reminders for upcoming appointments' },
                  { key: 'weeklyReport', label: 'Weekly performance report email' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center space-x-2 text-sm font-semibold text-gray-600">
                    <input type="checkbox" checked={notifications[key]} onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })} className="rounded text-red-600" />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            )}

            {activeMenu === 'Security' && (
              <div className="space-y-6">
                <div><h3 className="font-bold text-gray-900 text-base uppercase tracking-wider">Security</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Change your admin password.</p></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current Password</label>
                  <input type="password" required className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none bg-gray-50/50"
                    value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Password</label>
                  <input type="password" required className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none bg-gray-50/50"
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirm New Password</label>
                  <input type="password" required className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none bg-gray-50/50"
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
              </div>
            )}

            {activeMenu === 'Working Hours' && (
              <div className="space-y-6">
                <div><h3 className="font-bold text-gray-900 text-base uppercase tracking-wider">Working Hours</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Set your service center schedule.</p></div>
                {workingHours.map((wh, i) => (
                  <div key={wh.day} className="grid grid-cols-4 gap-4 items-center">
                    <span className="text-sm font-bold text-gray-700">{wh.day}</span>
                    <input type="text" disabled={wh.closed} className="border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50/50"
                      value={wh.open} onChange={(e) => { const u = [...workingHours]; u[i].open = e.target.value; setWorkingHours(u); }} />
                    <input type="text" disabled={wh.closed} className="border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50/50"
                      value={wh.close} onChange={(e) => { const u = [...workingHours]; u[i].close = e.target.value; setWorkingHours(u); }} />
                    <label className="flex items-center space-x-1 text-xs font-semibold text-gray-500">
                      <input type="checkbox" checked={wh.closed} onChange={(e) => { const u = [...workingHours]; u[i].closed = e.target.checked; setWorkingHours(u); }} className="rounded text-red-600" />
                      <span>Closed</span>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {activeMenu === 'Danger Zone' && (
              <div className="space-y-6">
                <div><h3 className="font-bold text-red-600 text-base uppercase tracking-wider flex items-center space-x-2"><ShieldAlert size={18} /><span>Danger Zone</span></h3>
                  <p className="text-gray-400 text-xs mt-0.5">Irreversible actions. Type DELETE and enter your password to confirm.</p></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirmation (type DELETE)</label>
                  <input type="text" className="w-full border border-red-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
                    value={dangerConfirm} onChange={(e) => setDangerConfirm(e.target.value)} placeholder="DELETE" /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Password</label>
                  <input type="password" className="w-full border border-red-200 rounded px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
                    value={dangerPassword} onChange={(e) => setDangerPassword(e.target.value)} /></div>
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  {[
                    { action: 'deleteBookings', label: 'Delete All Bookings', color: 'border-amber-300 text-amber-700 hover:bg-amber-50' },
                    { action: 'deleteServices', label: 'Delete All Services', color: 'border-amber-300 text-amber-700 hover:bg-amber-50' },
                    { action: 'resetData', label: 'Reset All Data', color: 'border-red-300 text-red-700 hover:bg-red-50' },
                    { action: 'deleteAccount', label: 'Delete Admin Account', color: 'border-red-500 text-red-700 hover:bg-red-50' }
                  ].map(({ action, label, color }) => (
                    <button key={action} type="button" disabled={saving}
                      onClick={() => handleDangerAction(action)}
                      className={`w-full border px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition ${color} disabled:opacity-50`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminSettings;
