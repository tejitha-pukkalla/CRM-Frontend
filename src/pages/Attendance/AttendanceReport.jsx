import { useState, useEffect } from 'react';
import { Users, Calendar, Download, TrendingUp, Filter } from 'lucide-react';
import { getAllAttendance, getAttendanceSummary } from '../../services/attendance.service';
import { userService } from '../../services/user.service';
import AttendanceTable from './components/AttendanceTable';
import AttendanceFilters from './components/AttendanceFilters';
import WorkingHoursChart from './components/WorkingHoursChart';
import { exportToCSV } from '../../utils/attendanceHelpers';
import DashboardLayout from '../../layout/DashboardLayout';

const AttendanceReport = () => {
  const [attendances, setAttendances] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true); // 🔥 NEW: Track users loading
  const [filters, setFilters] = useState({
    date: '',
    userId: '',
    status: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [summary, setSummary] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // 🔥 IMPROVED: Fetch users with better error handling
  const fetchUsers = async () => {
    try {
      console.log('🔄 Fetching users...');
      setUsersLoading(true);
      
      const response = await userService.getAllUsers({ limit: 1000 });
      
      console.log('📦 Full API Response:', response);
      console.log('✅ Response success:', response.success);
      console.log('👥 Users data:', response.data);
      
      if (response.success) {
        // 🔥 HANDLE DIFFERENT RESPONSE STRUCTURES
        let usersList = [];
        
        if (response.data.users) {
          // Structure: { success: true, data: { users: [...] } }
          usersList = response.data.users;
          console.log('📋 Found users in response.data.users:', usersList.length);
        } else if (Array.isArray(response.data)) {
          // Structure: { success: true, data: [...] }
          usersList = response.data;
          console.log('📋 Found users directly in response.data:', usersList.length);
        } else if (response.users) {
          // Structure: { success: true, users: [...] }
          usersList = response.users;
          console.log('📋 Found users in response.users:', usersList.length);
        }
        
        console.log('✅ Final users list:', usersList);
        setUsers(usersList);
        
        if (window.showToast && usersList.length > 0) {
          window.showToast('success', `Loaded ${usersList.length} users`);
        }
      } else {
        console.error('❌ API returned success: false');
        if (window.showToast) {
          window.showToast('error', 'Failed to fetch users');
        }
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response,
        stack: error.stack
      });
      
      if (window.showToast) {
        window.showToast('error', error.message || 'Failed to fetch users');
      }
    } finally {
      setUsersLoading(false);
      console.log('✅ Finished fetching users');
    }
  };

  // Fetch all attendance data
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await getAllAttendance(filters);
      
      if (response.success) {
        setAttendances(response.data.attendances);
        setPagination(response.data.pagination);
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

  // Fetch summary statistics
  const fetchSummary = async () => {
    try {
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.userId) params.userId = filters.userId;

      const response = await getAttendanceSummary(params);
      
      if (response.success) {
        setSummary(response.data.summary);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  // 🔥 Fetch users on component mount
  useEffect(() => {
    console.log('🚀 Component mounted, fetching users...');
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchAttendance();
    fetchSummary();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleExport = () => {
    exportToCSV(attendances, `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    if (window.showToast) {
      window.showToast('success', 'Report exported successfully!');
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
                <Users className="w-8 h-8 text-blue-600" />
                Attendance Report
              </h1>
              <p className="text-gray-600 mt-2">
                View and analyze team attendance data
                {/* 🔥 DEBUG: Show users count */}
                <span className="ml-2 text-sm text-blue-600">
                  ({usersLoading ? 'Loading users...' : `${users.length} users loaded`})
                </span>
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 font-medium py-2 px-4 rounded-lg transition-colors ${
                  showFilters
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              
              <button
                onClick={handleExport}
                disabled={attendances.length === 0}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Days</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalDays}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500 opacity-60" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Present Days</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.presentDays}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500 opacity-60" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Hours</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalWorkingHours}h</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500 opacity-60" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Hours/Day</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.averageWorkingHours}h</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500 opacity-60" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Attendance %</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.attendancePercentage}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-indigo-500 opacity-60" />
              </div>
            </div>
          </div>
        )}

        {/* Working Hours Chart */}
        {attendances.length > 0 && (
          <div className="mb-8">
            <WorkingHoursChart attendances={attendances} />
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <div className="mb-6">
            <AttendanceFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              showUserFilter={true}
              users={users}
            />
          </div>
        )}

        {/* Attendance Table */}
        <AttendanceTable
          attendances={attendances}
          loading={loading}
          showUser={true}
        />

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
                {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        pagination.page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
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

export default AttendanceReport;