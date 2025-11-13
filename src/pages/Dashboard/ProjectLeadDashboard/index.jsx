// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import DashboardLayout from '../../../layout/DashboardLayout';
// import StatsCard from '../../../components/common/StatsCard';
// import LoadingSpinner from '../../../components/common/LoadingSpinner';
// import { dashboardService } from '../../../services/dashboard.service';
// import AttendanceWidget from '../MemberDashboard/AttendanceWidget'; // ADD THIS IMPORT

// const ProjectLeadDashboard = () => {
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
//   const tasksByStatus = stats?.tasksByStatus || [];
//   const tasksByApproval = stats?.tasksByApproval || [];

//   const getStatusCount = (status) => {
//     const statusData = tasksByStatus.find(s => s._id === status);
//     return statusData?.count || 0;
//   };

//   const getApprovalCount = (status) => {
//     const approvalData = tasksByApproval.find(a => a._id === status);
//     return approvalData?.count || 0;
//   };

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         {/* Page Title */}
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Project Lead Dashboard</h1>
//           <p className="text-gray-600 mt-1">Monitor your projects and team tasks</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <StatsCard
//             title="My Projects"
//             value={myProjects}
//             icon={
//               <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
//               </svg>
//             }
//             color="indigo"
//             subtitle="Projects I manage"
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
//             subtitle="Tasks I assigned"
//           />

//           <StatsCard
//             title="Pending Approval"
//             value={getApprovalCount('pending_teamlead')}
//             icon={
//               <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             }
//             color="orange"
//             subtitle="Awaiting Team Lead approval"
//           />
//         </div>

//         {/* ADD ATTENDANCE WIDGET HERE - BELOW STATS CARDS */}
//         <AttendanceWidget />

//         {/* Tasks by Status & Approval */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Tasks by Status */}
//           <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Status</h2>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
//                   <span className="text-sm font-medium text-gray-700">Not Started</span>
//                 </div>
//                 <span className="text-sm font-bold text-gray-900">
//                   {getStatusCount('not-started')}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
//                   <span className="text-sm font-medium text-gray-700">In Progress</span>
//                 </div>
//                 <span className="text-sm font-bold text-gray-900">
//                   {getStatusCount('in-progress')}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
//                   <span className="text-sm font-medium text-gray-700">Completed</span>
//                 </div>
//                 <span className="text-sm font-bold text-gray-900">
//                   {getStatusCount('completed')}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Tasks by Approval Status */}
//           <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Approval Status</h2>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
//                   <span className="text-sm font-medium text-gray-700">Pending TL Approval</span>
//                 </div>
//                 <span className="text-sm font-bold text-gray-900">
//                   {getApprovalCount('pending_teamlead')}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
//                   <span className="text-sm font-medium text-gray-700">Approved</span>
//                 </div>
//                 <span className="text-sm font-bold text-gray-900">
//                   {getApprovalCount('approved')}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
//                   <span className="text-sm font-medium text-gray-700">Rejected</span>
//                 </div>
//                 <span className="text-sm font-bold text-gray-900">
//                   {getApprovalCount('rejected')}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <button
//               onClick={() => navigate('/projects')}
//               className="flex items-center justify-center px-6 py-4 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition font-semibold"
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
//               </svg>
//               View My Projects
//             </button>

//             <button
//               onClick={() => navigate('/tasks/create')}
//               className="flex items-center justify-center px-6 py-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-semibold"
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//               </svg>
//               Assign New Task
//             </button>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default ProjectLeadDashboard;
















// src/pages/Dashboard/ProjectLeadDashboard/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../layout/DashboardLayout';
import StatsCard from '../../../components/common/StatsCard';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { dashboardService } from '../../../services/dashboard.service';
import taskService from '../../../services/task.service'; // ✅ ADD THIS IMPORT
import AttendanceWidget from '../MemberDashboard/AttendanceWidget';

const ProjectLeadDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [myTasksStats, setMyTasksStats] = useState(null); // ✅ ADD THIS STATE
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  // ✅ MODIFIED - Fetch both dashboard stats AND my tasks stats
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch general dashboard stats
      const dashboardResponse = await dashboardService.getStats();
      if (dashboardResponse.success) {
        setStats(dashboardResponse.data);
      }

      // ✅ Fetch MY tasks stats (tasks assigned TO me)
      const myTasksResponse = await taskService.getMyTasks({ limit: 100 });
      if (myTasksResponse.success) {
        // Calculate stats from my tasks
        const tasks = myTasksResponse.data;
        const taskStats = {
          total: tasks.length,
          notStarted: tasks.filter(t => t.status === 'not-started').length,
          inProgress: tasks.filter(t => t.status === 'in-progress').length,
          completed: tasks.filter(t => t.status === 'completed').length,
          pendingApproval: tasks.filter(t => 
            t.approvalStatus === 'pending_teamlead' || t.approvalStatus === 'pending'
          ).length,
          approved: tasks.filter(t => t.approvalStatus === 'approved').length,
          rejected: tasks.filter(t => t.approvalStatus === 'rejected').length
        };
        setMyTasksStats(taskStats);
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Lead Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your projects and team tasks</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="My Projects"
            value={myProjects}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            }
            color="indigo"
            subtitle="Projects I manage"
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
            subtitle="Tasks I assigned"
          />

          <StatsCard
            title="My Pending Tasks"
            value={myTasksStats?.pendingApproval || 0}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="orange"
            subtitle="Tasks awaiting approval"
          />
        </div>

        {/* ADD ATTENDANCE WIDGET */}
        <AttendanceWidget />

        {/* ✅ MODIFIED - Tasks by Status showing MY tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks by Status */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">My Tasks by Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Not Started</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {myTasksStats?.notStarted || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">In Progress</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {myTasksStats?.inProgress || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Completed</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {myTasksStats?.completed || 0}
                </span>
              </div>
            </div>
          </div>

          {/* ✅ MODIFIED - Approval Status showing MY tasks */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">My Tasks Approval Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Pending Approval</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {myTasksStats?.pendingApproval || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Approved</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {myTasksStats?.approved || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Rejected</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {myTasksStats?.rejected || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/my-tasks')}
              className="flex items-center justify-center px-6 py-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              View My Tasks
            </button>

            <button
              onClick={() => navigate('/projects')}
              className="flex items-center justify-center px-6 py-4 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              View My Projects
            </button>

            <button
              onClick={() => navigate('/tasks/create')}
              className="flex items-center justify-center px-6 py-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Assign New Task
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectLeadDashboard;