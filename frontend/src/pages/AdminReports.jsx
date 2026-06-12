import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useApp } from '../context/AppContext';
import { Star, Download, Calendar, Coins, CheckSquare, Loader2 } from 'lucide-react';
import { generateReportPdf } from '../utils/generateReportPdf';

const AdminReports = () => {
  const { stats, services, refreshStats } = useApp();
  const [period, setPeriod] = useState('month');
  const [hoveredBar, setHoveredBar] = useState(null);
  const [exportingPdf, setExportingPdf] = useState(false);

  const total = stats.total || 0;
  const completed = stats.completed || 0;
  const pending = stats.pending || 0;
  const approved = stats.approved || 0;
  const rejected = stats.rejected || 0;
  const estimatedRevenue = stats.estimatedRevenue || 0;
  const satisfaction = stats.satisfactionPercent || 0;
  const avgRating = stats.avgRating || 0;
  const ratedCount = stats.ratedCount || 0;

  const dailyStats = stats.dailyStats || [];
  const maxDaily = Math.max(...dailyStats.map((d) => d.count), 1);

  const topServices = (stats.serviceStats || []).slice(0, 5);
  const priceMap = {};
  services.forEach((s) => { priceMap[s.name] = s.price; });

  const handlePeriodChange = (p) => {
    setPeriod(p);
    refreshStats(p);
  };

  const periodLabel = period === 'week' ? 'Last 7 Days' : period === 'year' ? 'Last 12 Months' : 'Last 30 Days';

  const handleExportPDF = async () => {
    setExportingPdf(true);
    try {
      await generateReportPdf({
        period,
        periodLabel,
        total,
        completed,
        pending,
        approved,
        rejected,
        estimatedRevenue,
        satisfaction,
        avgRating,
        ratedCount,
        completedToday: stats.completedToday || 0,
        dailyStats,
        monthlyStats: stats.monthlyStats || [],
        topServices: topServices.map((s) => ({
          _id: s._id,
          name: s._id,
          count: s.count,
          price: priceMap[s._id]
        }))
      });
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">REPORTS & ANALYTICS</h1>
          <p className="text-gray-400 text-xs">DriveX performance overview and analysis dashboards.</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold">
          {['week', 'month', 'year'].map((p) => (
            <button key={p} onClick={() => handlePeriodChange(p)}
              className={`px-3 py-1.5 rounded uppercase tracking-wider ${period === p ? 'bg-red-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {p}
            </button>
          ))}
          <button onClick={handleExportPDF} disabled={exportingPdf}
            className="bg-[#DC2626] hover:bg-red-700 disabled:opacity-60 text-white px-4 py-1.5 rounded inline-flex items-center space-x-1.5 transition uppercase tracking-wider shadow shadow-red-200 min-w-[130px] justify-center">
            {exportingPdf ? (
              <><Loader2 size={14} className="animate-spin" /><span>Generating...</span></>
            ) : (
              <><Download size={14} /><span>Export PDF</span></>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Bookings</span>
            <span className="text-2xl font-black text-gray-800 block mt-1">{total}</span>
            {stats.bookingsWeekTrend !== undefined && (
              <span className={`text-[10px] font-bold mt-1 block ${stats.bookingsWeekTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.bookingsWeekTrend >= 0 ? '+' : ''}{stats.bookingsWeekTrend}% vs prev week
              </span>
            )}
          </div>
          <div className="w-10 h-10 bg-red-50 text-[#DC2626] rounded-full flex items-center justify-center"><Calendar size={18} /></div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Completed</span>
            <span className="text-2xl font-black text-gray-800 block mt-1">{completed}</span>
            <span className="text-[10px] text-green-600 font-bold mt-1 block">{stats.completedToday || 0} today</span>
          </div>
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center"><CheckSquare size={18} /></div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Est. Revenue</span>
            <span className="text-2xl font-black text-gray-800 block mt-1">LKR {estimatedRevenue?.toLocaleString()}</span>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><Coins size={18} /></div>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Satisfaction</span>
            <span className="text-2xl font-black text-gray-800 block mt-1">{satisfaction}%</span>
          </div>
          <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center"><Star size={18} fill="currentColor" /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-2 uppercase tracking-wider">Daily Bookings — {periodLabel}</h3>
            <p className="text-gray-400 text-xs mb-6">Hover bars to see count</p>
            <div className="h-48 flex items-end space-x-1 sm:space-x-2 pt-4 border-b border-gray-100 relative">
              {dailyStats.length === 0 ? (
                <div className="w-full text-center text-gray-400 text-xs font-semibold uppercase py-16">No booking data for this period</div>
              ) : (
                dailyStats.map((d, i) => (
                  <div key={d._id} className="flex-1 flex flex-col items-center relative group"
                    onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                    {hoveredBar === i && (
                      <div className="absolute -top-8 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-10">
                        {d._id}: {d.count} bookings
                      </div>
                    )}
                    <div className="w-full bg-[#DC2626]/85 rounded-t hover:bg-[#DC2626] transition-all duration-300 cursor-pointer"
                      style={{ height: `${(d.count / maxDaily) * 100}%`, minHeight: d.count > 0 ? '4px' : '0' }}
                      title={`${d._id}: ${d.count} bookings`}></div>
                  </div>
                ))
              )}
            </div>
            {dailyStats.length > 0 && (
              <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase mt-3">
                <span>{dailyStats[0]?._id}</span>
                <span>{dailyStats[Math.floor(dailyStats.length / 2)]?._id}</span>
                <span>{dailyStats[dailyStats.length - 1]?._id}</span>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-6 uppercase tracking-wider">Top Services Summary</h3>
            <div className="space-y-4">
              {topServices.length === 0 ? (
                <p className="text-gray-400 text-xs font-semibold uppercase">No booking data yet</p>
              ) : topServices.map((s, i) => (
                <div key={s._id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-semibold">{i + 1}. {s._id}</span>
                  <span className="bg-red-100 text-red-600 font-extrabold text-xs px-2.5 py-0.5 rounded">
                    {s.count} bookings{priceMap[s._id] ? ` (LKR ${priceMap[s._id]?.toLocaleString()})` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-6 uppercase tracking-wider">Booking Status Breakdown</h3>
            <div className="flex justify-center items-center py-6 border-b border-gray-100 mb-6">
              <div className="relative w-36 h-36 rounded-full border-8 border-gray-100 flex items-center justify-center flex-col">
                <span className="text-3xl font-black text-gray-800">{total}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Logs</span>
              </div>
            </div>
            <div className="space-y-3.5 text-xs font-semibold text-gray-500">
              {[{ label: 'Completed', count: completed, color: 'bg-green-500' }, { label: 'Approved', count: approved, color: 'bg-blue-500' },
                { label: 'Pending', count: pending, color: 'bg-amber-500' }, { label: 'Rejected', count: rejected, color: 'bg-red-500' }].map((s) => (
                <div key={s.label} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2"><span className={`w-3 h-3 rounded-full ${s.color}`}></span><span>{s.label}</span></div>
                  <span className="font-extrabold text-gray-800">{s.count} ({total > 0 ? Math.round((s.count / total) * 100) : 0}%)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wider">Monthly Summary</h3>
            <div className="space-y-3.5 text-xs text-gray-600">
              {(stats.monthlyStats || []).length === 0 ? (
                <p className="text-gray-400 font-semibold uppercase">No monthly data yet</p>
              ) : (stats.monthlyStats || []).map((m) => (
                <div key={`${m.month}-${m.year}`} className="flex justify-between py-1 border-b border-gray-50">
                  <span className="font-bold">{m.month} {m.year}</span>
                  <span className="text-gray-400">{m.total} bookings • {m.completed} completed
                    {m.trend !== 0 && <strong className={`font-extrabold ml-1 ${m.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>{m.trend >= 0 ? '▲' : '▼'} {Math.abs(m.trend)}%</strong>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <h3 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wider text-left">Customer Ratings</h3>
            <div className="py-2">
              <span className="text-5xl font-black text-amber-500">{avgRating || '—'}</span>
              <div className="flex justify-center text-amber-500 mt-2 space-x-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < Math.round(avgRating) ? 'currentColor' : 'none'} />)}
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1 block">Based on {ratedCount} reviews</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
