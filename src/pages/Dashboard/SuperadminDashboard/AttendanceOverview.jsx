// // src/pages/Dashboard/SuperadminDashboard/AttendanceOverview.jsx
// import { useState, useEffect } from 'react';
// import { Users, TrendingUp, Clock, AlertCircle, ChevronRight, UserCheck, UserX } from 'lucide-react';
// import { getTodayAttendance } from '../../../services/attendance.service';
// import { formatTimeAMPM, calculateAttendancePercentage } from '../../../utils/attendanceHelpers';
// import { useNavigate } from 'react-router-dom';

// const AttendanceOverview = () => {
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchTodayAttendance();
    
//     // Refresh every 5 minutes
//     const interval = setInterval(fetchTodayAttendance, 5 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchTodayAttendance = async () => {
//     try {
//       setLoading(true);
//       const response = await getTodayAttendance();
      
//       if (response.success) {
//         setData(response.data);
//       }
//     } catch (err) {
//       console.error('Error fetching today attendance:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && !data) {
//     return (
//       <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
//         <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
//         <div className="space-y-3">
//           <div className="h-20 bg-gray-200 rounded"></div>
//           <div className="h-20 bg-gray-200 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <div className="flex items-center gap-2 text-red-600 mb-2">
//           <AlertCircle className="w-5 h-5" />
//           <h3 className="font-semibold">Error Loading Attendance</h3>
//         </div>
//         <p className="text-sm text-gray-600">{error}</p>
//       </div>
//     );
//   }

//   if (!data) return null;

//   const { present, absent, stats } = data;

//   // Get users currently on break
//   const onBreak = present.filter(att => att.breaks?.some(brk => brk.isActive));

//   // Get late arrivals (after 9:30 AM)
//   const lateArrivals = present.filter(att => {
//     const loginTime = new Date(att.loginTime);
//     const lateTime = new Date(loginTime);
//     lateTime.setHours(9, 30, 0, 0);
//     return loginTime > lateTime;
//   });

//   return (
//     <div className="bg-white rounded-xl shadow-md overflow-hidden">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="bg-white/20 p-2 rounded-lg">
//               <Users className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-white">Today's Attendance</h2>
//               <p className="text-blue-100 text-sm">
//                 {new Date().toLocaleDateString('en-IN', {
//                   weekday: 'long',
//                   day: 'numeric',
//                   month: 'long'
//                 })}
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={() => navigate('/attendance/report')}
//             className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
//           >
//             <span className="text-sm font-medium">View All</span>
//             <ChevronRight className="w-4 h-4" />
//           </button>
//         </div>
//       </div>

//       {/* Statistics Grid */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6">
//         {/* Total Users */}
//         <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
//           <div className="flex items-center justify-between mb-2">
//             <Users className="w-8 h-8 text-gray-600" />
//           </div>
//           <p className="text-sm text-gray-600 font-medium">Total Users</p>
//           <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
//         </div>

//         {/* Present */}
//         <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
//           <div className="flex items-center justify-between mb-2">
//             <UserCheck className="w-8 h-8 text-green-600" />
//           </div>
//           <p className="text-sm text-green-700 font-medium">Present</p>
//           <div className="flex items-baseline gap-2">
//             <p className="text-3xl font-bold text-green-900">{stats.present}</p>
//             <span className="text-sm text-green-600 font-semibold">
//               ({stats.presentPercentage}%)
//             </span>
//           </div>
//         </div>

//         {/* Absent */}
//         <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
//           <div className="flex items-center justify-between mb-2">
//             <UserX className="w-8 h-8 text-red-600" />
//           </div>
//           <p className="text-sm text-red-700 font-medium">Absent</p>
//           <p className="text-3xl font-bold text-red-900">{stats.absent}</p>
//         </div>

//         {/* On Break */}
//         <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
//           <div className="flex items-center justify-between mb-2">
//             <Clock className="w-8 h-8 text-orange-600" />
//           </div>
//           <p className="text-sm text-orange-700 font-medium">On Break</p>
//           <p className="text-3xl font-bold text-orange-900">{onBreak.length}</p>
//         </div>
//       </div>

//       {/* Quick Insights */}
//       <div className="px-6 pb-6 space-y-3">
//         {/* Late Arrivals Alert */}
//         {lateArrivals.length > 0 && (
//           <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
//               <div className="flex-1">
//                 <h4 className="font-semibold text-orange-900 mb-1">
//                   {lateArrivals.length} Late Arrival{lateArrivals.length > 1 ? 's' : ''}
//                 </h4>
//                 <div className="text-sm text-orange-700 space-y-1">
//                   {lateArrivals.slice(0, 3).map(att => (
//                     <div key={att._id} className="flex items-center justify-between">
//                       <span>{att.user.name}</span>
//                       <span className="font-medium">{formatTimeAMPM(att.loginTime)}</span>
//                     </div>
//                   ))}
//                   {lateArrivals.length > 3 && (
//                     <p className="text-xs text-orange-600 font-medium pt-1">
//                       +{lateArrivals.length - 3} more
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Recent Clock-ins */}
//         <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
//           <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//             <TrendingUp className="w-4 h-4 text-blue-600" />
//             Recent Clock-ins
//           </h4>
//           <div className="space-y-2">
//             {present.slice(0, 5).map(att => (
//               <div 
//                 key={att._id}
//                 className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                     <span className="text-sm font-semibold text-blue-700">
//                       {att.user.name.charAt(0)}
//                     </span>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">{att.user.name}</p>
//                     <p className="text-xs text-gray-500">{att.user.department || 'No department'}</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm font-semibold text-gray-900">
//                     {formatTimeAMPM(att.loginTime)}
//                   </p>
//                   {att.breaks?.some(brk => brk.isActive) && (
//                     <span className="inline-block text-xs text-orange-600 font-medium">
//                       On Break
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ))}
//             {present.length === 0 && (
//               <p className="text-sm text-gray-500 text-center py-4">
//                 No one has clocked in yet today
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Absent Users Warning */}
//         {absent.length > 0 && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
//               <div className="flex-1">
//                 <h4 className="font-semibold text-red-900 mb-2">
//                   {absent.length} User{absent.length > 1 ? 's' : ''} Not Clocked In
//                 </h4>
//                 <div className="flex flex-wrap gap-2">
//                   {absent.slice(0, 10).map(user => (
//                     <span
//                       key={user._id}
//                       className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium"
//                     >
//                       {user.name}
//                     </span>
//                   ))}
//                   {absent.length > 10 && (
//                     <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
//                       +{absent.length - 10} more
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Footer Actions */}
//       <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
//         <div className="flex items-center justify-between">
//           <p className="text-sm text-gray-600">
//             Last updated: {new Date().toLocaleTimeString('en-IN')}
//           </p>
//           <button
//             onClick={fetchTodayAttendance}
//             className="text-sm text-blue-600 hover:text-blue-700 font-medium"
//           >
//             Refresh
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttendanceOverview;
















// src/pages/Dashboard/SuperadminDashboard/AttendanceOverview.jsx
import { useState, useEffect } from 'react';
import { Users, TrendingUp, Clock, AlertCircle, ChevronRight, UserCheck, UserX, Coffee, X, User } from 'lucide-react';
import { getTodayAttendance } from '../../../services/attendance.service';
import { formatTimeAMPM, calculateAttendancePercentage } from '../../../utils/attendanceHelpers';
import { useNavigate } from 'react-router-dom';

const AttendanceOverview = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBreakModal, setShowBreakModal] = useState(false);

  useEffect(() => {
    fetchTodayAttendance();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchTodayAttendance, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      setLoading(true);
      const response = await getTodayAttendance();
      
      if (response.success) {
        setData(response.data);
      }
    } catch (err) {
      console.error('Error fetching today attendance:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-semibold">Error Loading Attendance</h3>
        </div>
        <p className="text-sm text-gray-600">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const { present, absent, stats } = data;

  // Get users currently on break
  const onBreak = present.filter(att => att.breaks?.some(brk => brk.isActive));

  // Get late arrivals (after 9:30 AM)
  const lateArrivals = present.filter(att => {
    const loginTime = new Date(att.loginTime);
    const lateTime = new Date(loginTime);
    lateTime.setHours(9, 30, 0, 0);
    return loginTime > lateTime;
  });

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Today's Attendance</h2>
              <p className="text-blue-100 text-sm">
                {new Date().toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/attendance/report')}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <span className="text-sm font-medium">View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-sm text-gray-600 font-medium">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
        </div>

        {/* Present */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-green-700 font-medium">Present</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-green-900">{stats.present}</p>
            <span className="text-sm text-green-600 font-semibold">
              ({stats.presentPercentage}%)
            </span>
          </div>
        </div>

        {/* Absent */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <UserX className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-sm text-red-700 font-medium">Absent</p>
          <p className="text-3xl font-bold text-red-900">{stats.absent}</p>
        </div>

        {/* On Break - NOW CLICKABLE */}
        <button
          onClick={() => setShowBreakModal(true)}
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200 hover:shadow-lg hover:scale-105 transition-all w-full text-left cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-600" />
            <ChevronRight className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-sm text-orange-700 font-medium">On Break</p>
          <p className="text-3xl font-bold text-orange-900">{onBreak.length}</p>
          <p className="text-xs text-orange-600 mt-1">Click to view details</p>
        </button>
      </div>

      {/* Quick Insights */}
      <div className="px-6 pb-6 space-y-3">
        {/* Late Arrivals Alert */}
        {lateArrivals.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-orange-900 mb-1">
                  {lateArrivals.length} Late Arrival{lateArrivals.length > 1 ? 's' : ''}
                </h4>
                <div className="text-sm text-orange-700 space-y-1">
                  {lateArrivals.slice(0, 3).map(att => (
                    <div key={att._id} className="flex items-center justify-between">
                      <span>{att.user.name}</span>
                      <span className="font-medium">{formatTimeAMPM(att.loginTime)}</span>
                    </div>
                  ))}
                  {lateArrivals.length > 3 && (
                    <p className="text-xs text-orange-600 font-medium pt-1">
                      +{lateArrivals.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Clock-ins */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Recent Clock-ins
          </h4>
          <div className="space-y-2">
            {present.slice(0, 5).map(att => (
              <div 
                key={att._id}
                className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-700">
                      {att.user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{att.user.name}</p>
                    <p className="text-xs text-gray-500">{att.user.department || 'No department'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatTimeAMPM(att.loginTime)}
                  </p>
                  {att.breaks?.some(brk => brk.isActive) && (
                    <span className="inline-block text-xs text-orange-600 font-medium">
                      On Break
                    </span>
                  )}
                </div>
              </div>
            ))}
            {present.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No one has clocked in yet today
              </p>
            )}
          </div>
        </div>

        {/* Absent Users Warning */}
        {absent.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-2">
                  {absent.length} User{absent.length > 1 ? 's' : ''} Not Clocked In
                </h4>
                <div className="flex flex-wrap gap-2">
                  {absent.slice(0, 10).map(user => (
                    <span
                      key={user._id}
                      className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium"
                    >
                      {user.name}
                    </span>
                  ))}
                  {absent.length > 10 && (
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                      +{absent.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleTimeString('en-IN')}
          </p>
          <button
            onClick={fetchTodayAttendance}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Break Details Modal */}
      {showBreakModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Coffee className="w-6 h-6 text-white" />
                <div>
                  <h3 className="text-xl font-bold text-white">Users Currently on Break</h3>
                  <p className="text-orange-100 text-sm">{onBreak.length} user{onBreak.length !== 1 ? 's' : ''} on break</p>
                </div>
              </div>
              <button
                onClick={() => setShowBreakModal(false)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
              {onBreak.length === 0 ? (
                <div className="text-center py-12">
                  <Coffee className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No one is currently on break</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {onBreak.map((attendance) => {
                    const activeBreak = attendance.breaks?.find(brk => brk.isActive);
                    const breakStart = activeBreak ? new Date(activeBreak.startTime) : null;
                    const breakDuration = breakStart 
                      ? Math.floor((Date.now() - breakStart) / 1000 / 60) 
                      : 0;
                    const isOvertime = breakDuration > 15;

                    return (
                      <div
                        key={attendance._id}
                        className={`p-4 rounded-lg border-2 ${
                          isOvertime 
                            ? 'bg-red-50 border-red-300' 
                            : 'bg-orange-50 border-orange-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            {/* User Avatar */}
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              isOvertime ? 'bg-red-200' : 'bg-orange-200'
                            }`}>
                              <User className={`w-6 h-6 ${
                                isOvertime ? 'text-red-700' : 'text-orange-700'
                              }`} />
                            </div>

                            {/* User Info */}
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-lg">
                                {attendance.user?.name || 'Unknown User'}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {attendance.user?.email || 'No email'}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {attendance.user?.department || 'No department'}
                              </p>
                            </div>
                          </div>

                          {/* Break Duration Badge */}
                          <div className={`text-right ${
                            isOvertime ? 'text-red-700' : 'text-orange-700'
                          }`}>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span className="text-2xl font-bold">
                                {breakDuration}m
                              </span>
                            </div>
                            {isOvertime && (
                              <span className="text-xs font-semibold bg-red-200 px-2 py-1 rounded-full mt-1 inline-block">
                                Overtime!
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Break Details */}
                        <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Break Type:</span>
                            <p className="font-medium text-gray-900">
                              {activeBreak?.breakType || 'Unknown'}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Started at:</span>
                            <p className="font-medium text-gray-900">
                              {breakStart ? formatTimeAMPM(breakStart.toISOString()) : 'N/A'}
                            </p>
                          </div>
                        </div>

                        {/* Warning Message for Overtime */}
                        {isOvertime && (
                          <div className="mt-3 flex items-start gap-2 bg-red-100 rounded-lg p-2">
                            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-red-800">
                              <strong>Action Required:</strong> This user has exceeded the 15-minute break limit. 
                              Please contact them to resume work.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleTimeString('en-IN')}
              </p>
              <button
                onClick={() => setShowBreakModal(false)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceOverview;