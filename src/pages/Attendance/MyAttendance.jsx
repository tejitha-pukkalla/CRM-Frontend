// src/pages/Attendance/MyAttendance.jsx
import { useState, useEffect } from 'react';
import { Calendar, Download, TrendingUp, Clock, Coffee } from 'lucide-react';
import { getMyAttendance } from '../../services/attendance.service';
import AttendanceTable from './components/AttendanceTable';
import AttendanceFilters from './components/AttendanceFilters';
import { exportToCSV, calculateAttendancePercentage } from '../../utils/attendanceHelpers';
import DashboardLayout from '../../layout/DashboardLayout';

const MyAttendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [stats, setStats] = useState({
    totalDays: 0,
    totalWorkingHours: 0,
    averageHours: 0,
    totalBreaks: 0
  });

  // Fetch attendance data
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await getMyAttendance(filters);
      
      if (response.success) {
        setAttendances(response.data.attendances);
        setPagination(response.data.pagination);
        calculateStats(response.data.attendances);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      if (window.showToast) {
        window.showToast('error', error.message || 'Failed to fetch attendance');
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (data) => {
    const totalWorkingMinutes = data.reduce((sum, att) => sum + (att.netWorkingMinutes || 0), 0);
    const totalBreaks = data.reduce((sum, att) => sum + (att.breaks?.length || 0), 0);
    
    setStats({
      totalDays: data.length,
      totalWorkingHours: (totalWorkingMinutes / 60).toFixed(1),
      averageHours: data.length > 0 ? (totalWorkingMinutes / data.length / 60).toFixed(1) : 0,
      totalBreaks
    });
  };

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleExport = () => {
    exportToCSV(attendances, `my_attendance_${new Date().toISOString().split('T')[0]}.csv`);
    if (window.showToast) {
      window.showToast('success', 'Attendance exported successfully!');
    }
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-600" />
                My Attendance
              </h1>
              <p className="text-gray-600 mt-2">
                View and track your attendance history
              </p>
            </div>
            
            <button
              onClick={handleExport}
              disabled={attendances.length === 0}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 opacity-80" />
              <div className="text-right">
                <p className="text-sm opacity-90">Total Days</p>
                <p className="text-3xl font-bold">{stats.totalDays}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 opacity-80" />
              <div className="text-right">
                <p className="text-sm opacity-90">Total Hours</p>
                <p className="text-3xl font-bold">{stats.totalWorkingHours}h</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <div className="text-right">
                <p className="text-sm opacity-90">Avg. Hours/Day</p>
                <p className="text-3xl font-bold">{stats.averageHours}h</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Coffee className="w-8 h-8 opacity-80" />
              <div className="text-right">
                <p className="text-sm opacity-90">Total Breaks</p>
                <p className="text-3xl font-bold">{stats.totalBreaks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <AttendanceFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          showUserFilter={false}
        />

        {/* Attendance Table */}
        <div className="mt-6">
          <AttendanceTable
            attendances={attendances}
            loading={loading}
            showUser={false}
          />
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between bg-white rounded-lg shadow-md px-6 py-4">
            <div className="text-sm text-gray-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      pagination.page === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
  );
};

export default MyAttendance;