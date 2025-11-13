import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import timeLogService from '../../services/timeLog.service';
import TimeLogTable from './components/TimeLogTable';
import TimeStats from './components/TimeStats';
import Spinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import DashboardLayout from '../../layout/DashboardLayout.jsx';

const TimeLog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchTimeLogs();
  }, [dateRange]);

  const fetchTimeLogs = async () => {
    try {
      setLoading(true);
      const data = await timeLogService.getUserTimeLogs(dateRange);
      setTimeLogs(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch time logs');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalMinutes = timeLogs.reduce((acc, log) => acc + (log.duration || 0), 0);
    const totalHours = (totalMinutes / 60).toFixed(2);
    const avgPerDay = (totalMinutes / 7 / 60).toFixed(2);
    
    return {
      totalHours,
      avgPerDay,
      totalEntries: timeLogs.length,
      automaticEntries: timeLogs.filter(log => log.entryType === 'automatic').length,
      manualEntries: timeLogs.filter(log => log.entryType === 'manual').length
    };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="large" />
        </div>
      </DashboardLayout>
    );
  }

  const stats = calculateStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Time Tracking</h1>
              <p className="text-sm text-gray-600">View and manage your time entries</p>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/time-tracking/manual')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Manual Entry
          </button>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {/* Stats Section */}
        <TimeStats stats={stats} />

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-blue-100 rounded-md">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-gray-900">Filter by Date Range</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Time Log Table */}
        <TimeLogTable timeLogs={timeLogs} onRefresh={fetchTimeLogs} />
      </div>
    </DashboardLayout>
  );
};

export default TimeLog;