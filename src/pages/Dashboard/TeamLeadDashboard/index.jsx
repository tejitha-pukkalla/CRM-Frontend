// // src/pages/Dashboard/TeamLeadDashboard/index.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import DashboardLayout from '../../../layout/DashboardLayout';
// import StatsCard from '../../../components/common/StatsCard';
// import LoadingSpinner from '../../../components/common/LoadingSpinner';
// import { dashboardService } from '../../../services/dashboard.service';

// const TeamLeadDashboard = () => {
//   const navigate = useNavigate();
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       const response = await dashboardService.getStats();
//       if (response.success) {
//         setStats(response.data);
//       }
//     } catch (err) {
//       setError('Failed to load dashboard statistics');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <LoadingSpinner text="Loading dashboard..." />
//       </DashboardLayout>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardLayout>
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//           {error}
//         </div>
//       </DashboardLayout>
//     );
//   }

//   const myProjects = stats?.myProjects || 0;
//   const tasksAssignedByMe = stats?.tasksAssignedByMe || 0;
//   const pendingApprovals = stats?.pendingApprovals || 0;
//   const tasksByStatus = stats?.tasksByStatus || [];

//   const getStatusCount = (status) => {
//     const statusData = tasksByStatus.find(s => s._id === status);
//     return statusData?.count || 0;
//   };

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         {/* Page Title */}
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Team Lead Dashboard</h1>
//           <p className="text-gray-600 mt-1">Manage your team and projects</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatsCard
//             title="My Projects"
//             value={myProjects}
//             icon={
//               <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
//               </svg>
//             }
//             color="blue"
//             subtitle="Projects I'm leading"
//           />

//           <StatsCard
//             title="Tasks Assigned"
//             value={tasksAssignedByMe}
//             icon={
//               <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//               </svg>
//             }
//             color="green"
//             subtitle="Tasks assigned by me"
//           />

//           <StatsCard
//             title="Pending Approvals"
//             value={pendingApprovals}
//             icon={
//               <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             }
//             color="orange"
//             subtitle="Tasks awaiting my approval"
//           />

//           <StatsCard
//             title="Completed Tasks"
//             value={getStatusCount('completed')}
//             icon={
//               <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             }
//             color="purple"
//             subtitle="Successfully completed"
//           />
//         </div>

//         {/* Tasks by Status */}
//         <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">Tasks Overview</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-yellow-700 font-medium">Not Started</p>
//                   <p className="text-2xl font-bold text-yellow-900 mt-1">
//                     {getStatusCount('not-started')}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
//                   <svg className="w-6 h-6 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-blue-700 font-medium">In Progress</p>
//                   <p className="text-2xl font-bold text-blue-900 mt-1">
//                     {getStatusCount('in-progress')}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
//                   <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-green-50 p-4 rounded-lg border border-green-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-green-700 font-medium">Completed</p>
//                   <p className="text-2xl font-bold text-green-900 mt-1">
//                     {getStatusCount('completed')}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
//                   <svg className="w-6 h-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <button
//               onClick={() => navigate('/projects/create')}
//               className="flex items-center justify-center px-6 py-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-semibold"
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//               </svg>
//               Create Project
//             </button>

//             <button
//               onClick={() => navigate('/tasks/create')}
//               className="flex items-center justify-center px-6 py-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-semibold"
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//               </svg>
//               Assign Task
//             </button>

//             <button
//               onClick={() => navigate('/register')}
//               className="flex items-center justify-center px-6 py-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition font-semibold"
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//               </svg>
//               Add Member
//             </button>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default TeamLeadDashboard;


// src/pages/Dashboard/TeamLeadDashboard/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../layout/DashboardLayout';
import StatsCard from '../../../components/common/StatsCard';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { dashboardService } from '../../../services/dashboard.service';
import AttendanceWidget from '../MemberDashboard/AttendanceWidget'; // ADD THIS IMPORT

const TeamLeadDashboard = () => {
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

  const myProjects = stats?.myProjects || 0;
  const tasksAssignedByMe = stats?.tasksAssignedByMe || 0;
  const pendingApprovals = stats?.pendingApprovals || 0;
  const tasksByStatus = stats?.tasksByStatus || [];

  const getStatusCount = (status) => {
    const statusData = tasksByStatus.find(s => s._id === status);
    return statusData?.count || 0;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Lead Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your team and projects</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="My Projects"
            value={myProjects}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            }
            color="blue"
            subtitle="Projects I'm leading"
          />

          <StatsCard
            title="Tasks Assigned"
            value={tasksAssignedByMe}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            color="green"
            subtitle="Tasks assigned by me"
          />

          <StatsCard
            title="Pending Approvals"
            value={pendingApprovals}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="orange"
            subtitle="Tasks awaiting my approval"
          />

          <StatsCard
            title="Completed Tasks"
            value={getStatusCount('completed')}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="purple"
            subtitle="Successfully completed"
          />
        </div>

        {/* ADD ATTENDANCE WIDGET HERE - AFTER STATS CARDS */}
        <AttendanceWidget />

        {/* Tasks Overview */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tasks Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-700 font-medium">Not Started</p>
                  <p className="text-2xl font-bold text-yellow-900 mt-1">
                    {getStatusCount('not-started')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">In Progress</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">
                    {getStatusCount('in-progress')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium">Completed</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    {getStatusCount('completed')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/projects/create')}
              className="flex items-center justify-center px-6 py-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Project
            </button>

            <button
              onClick={() => navigate('/tasks/create')}
              className="flex items-center justify-center px-6 py-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Assign Task
            </button>

            <button
              onClick={() => navigate('/register')}
              className="flex items-center justify-center px-6 py-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Member
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeamLeadDashboard;