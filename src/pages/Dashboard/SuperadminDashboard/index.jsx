// src/pages/Dashboard/SuperadminDashboard/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../layout/DashboardLayout';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { dashboardService } from '../../../services/dashboard.service';
import AttendanceOverview from './AttendanceOverview';


// Import sub-components
import StatsCards from './StatsCards';
import UsersByRole from './UsersByRole';
import RecentActivities from './RecentActivities';

const SuperadminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner text="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Superadmin Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your entire system</p>
        </div>

        {/* Stats Cards Grid */}
        <StatsCards stats={stats} />

        {/* ADD ATTENDANCE OVERVIEW  */}
        <AttendanceOverview />

        {/* Users by Role & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UsersByRole stats={stats} />
          <RecentActivities />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/register')}
              className="flex items-center justify-center px-6 py-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New User
            </button>

            <button
              onClick={() => navigate('/users')}
              className="flex items-center justify-center px-6 py-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Manage Users
            </button>

            <button
              onClick={() => navigate('/approvals')}
              className="flex items-center justify-center px-6 py-4 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Approvals
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperadminDashboard;