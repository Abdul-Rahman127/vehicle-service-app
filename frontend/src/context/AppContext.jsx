import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import * as api from '../api';

const AppContext = createContext();
const POLL_INTERVAL = 15000;

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('drivex_token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publicStats, setPublicStats] = useState({ totalCompleted: 0, satisfactionPercent: 98, serviceCount: 6 });
  const [publicSettings, setPublicSettings] = useState(null);

  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const notificationIdsRef = useRef(new Set());
  const pollTimerRef = useRef(null);

  const [stats, setStats] = useState({
    total: 0, pending: 0, approved: 0, completed: 0, rejected: 0,
    serviceStats: [], completedServiceStats: [], recentBookings: [],
    monthlyStats: [], dailyStats: [], avgRating: 0, satisfactionPercent: 0, estimatedRevenue: 0
  });
  const [statsPeriod, setStatsPeriod] = useState('month');

  const refreshData = async (period = statsPeriod) => {
    try {
      const servicesData = await api.getServices();
      setServices(servicesData);
      setPublicStats(await api.getPublicStats());
      setPublicSettings(await api.getPublicSettings());

      if (token) {
        const bookingsRes = await api.getBookings({ limit: 500 });
        setBookings(bookingsRes.bookings || []);
        setStats(await api.getBookingStats(period));
        setUser(await api.getProfile());

        const msgRes = await api.getContactMessages({ status: 'unread', limit: 1 });
        setUnreadMessageCount(msgRes.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch data from MongoDB API:', error.message);
      // Mock data for UI presentation when DB is down
      setServices([
        { _id: '1', name: 'Full Service', description: 'Comprehensive bumper-to-bumper vehicle inspection and service.', price: 25000, duration: 180, isActive: true, icon: 'Tool' },
        { _id: '2', name: 'Oil Change', description: 'Premium synthetic oil replacement and filter change.', price: 8500, duration: 45, isActive: true, icon: 'Droplet' },
        { _id: '3', name: 'Brake Inspection', description: 'Complete brake pad replacement and disc skimming.', price: 15000, duration: 90, isActive: true, icon: 'Disc' },
        { _id: '4', name: 'AC Service', description: 'Air conditioning gas refill, leak test, and cleaning.', price: 12000, duration: 60, isActive: true, icon: 'Wind' },
        { _id: '5', name: 'Battery Check', description: 'Battery health diagnostic and terminal cleaning.', price: 3000, duration: 30, isActive: true, icon: 'Battery' },
        { _id: '6', name: 'Engine Diagnostics', description: 'OBD-II computer scan and error code clearing.', price: 5000, duration: 45, isActive: true, icon: 'Cpu' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = useCallback(async (isInitial = false) => {
    if (!token) return;
    try {
      const data = await api.getNotifications();
      const incoming = data.notifications || [];

      if (isInitial) {
        notificationIdsRef.current = new Set(incoming.map((n) => n._id));
        setNotifications(incoming);
      } else {
        const newItems = incoming.filter((n) => !notificationIdsRef.current.has(n._id));
        if (newItems.length > 0) {
          newItems.forEach((n) => notificationIdsRef.current.add(n._id));
          setNotifications((prev) => {
            const merged = [...newItems, ...prev];
            const seen = new Set();
            return merged.filter((n) => {
              if (seen.has(n._id)) return false;
              seen.add(n._id);
              return true;
            }).slice(0, 50);
          });
          await refreshData();
        } else {
          setNotifications(incoming.slice(0, 50));
        }
      }
      setUnreadNotificationCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error.message);
    }
  }, [token]);

  const markNotificationAsRead = async (id) => {
    try {
      const data = await api.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      setUnreadNotificationCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to mark notification read:', error.message);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadNotificationCount(0);
    } catch (error) {
      console.error('Failed to mark all read:', error.message);
    }
  };

  useEffect(() => {
    refreshData();
  }, [token]);

  useEffect(() => {
    if (!token) {
      notificationIdsRef.current = new Set();
      setNotifications([]);
      setUnreadNotificationCount(0);
      return;
    }

    fetchNotifications(true);
    pollTimerRef.current = setInterval(() => fetchNotifications(false), POLL_INTERVAL);
    return () => clearInterval(pollTimerRef.current);
  }, [token, fetchNotifications]);

  const refreshStats = async (period) => {
    setStatsPeriod(period);
    try {
      setStats(await api.getBookingStats(period));
    } catch (error) {
      console.error('Failed to refresh stats:', error.message);
    }
  };

  const login = async (username, password) => {
    const data = await api.loginAdmin({ username, password });
    localStorage.setItem('drivex_token', data.token);
    setToken(data.token);
    setIsAuthenticated(true);
    setUser(data.user);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('drivex_token');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    setBookings([]);
    setNotifications([]);
    setUnreadNotificationCount(0);
    notificationIdsRef.current = new Set();
    setStats({
      total: 0, pending: 0, approved: 0, completed: 0, rejected: 0,
      serviceStats: [], completedServiceStats: [], recentBookings: [],
      monthlyStats: [], dailyStats: [], avgRating: 0, satisfactionPercent: 0, estimatedRevenue: 0
    });
  };

  const addBooking = async (bookingData) => {
    const res = await api.createBooking(bookingData);
    await refreshData();
    return res.booking;
  };

  const updateStatus = async (id, status) => {
    await api.updateBookingStatus(id, status);
    await refreshData();
  };

  const removeBooking = async (id) => {
    await api.deleteBooking(id);
    await refreshData();
  };

  const addService = async (serviceData) => {
    const res = await api.createService(serviceData);
    await refreshData();
    return res.service;
  };

  const editService = async (id, serviceData) => {
    await api.updateService(id, serviceData);
    await refreshData();
  };

  const removeService = async (id) => {
    await api.deleteService(id);
    await refreshData();
  };

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      api.getProfile().then(setUser).catch(() => {});
    }
  }, [token]);

  return (
    <AppContext.Provider value={{
      isAuthenticated, token, user, setUser, services, bookings, stats, statsPeriod,
      refreshStats, publicStats, publicSettings, loading, login, logout,
      addBooking, updateStatus, removeBooking, addService, editService, removeService, refreshData,
      notifications, unreadNotificationCount, unreadMessageCount, setUnreadMessageCount,
      markNotificationAsRead, markAllNotificationsAsRead, fetchNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
