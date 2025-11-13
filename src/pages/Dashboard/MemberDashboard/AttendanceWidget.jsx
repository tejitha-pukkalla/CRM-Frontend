// import { Calendar, Clock, TrendingUp } from 'lucide-react';
// import { useAttendance } from '../../../hooks/useAttendance';
// import ClockInButton from '../../Attendance/components/ClockInButton';
// import ClockOutButton from '../../Attendance/components/ClockOutButton';
// import BreakButton from '../../Attendance/components/BreakButton';
// import AttendanceTimer from '../../../components/widgets/AttendanceTimer';
// import { formatTimeAMPM } from '../../../utils/attendanceHelpers';




// const AttendanceWidget = () => {
//   const { attendance, isClockedIn, loading } = useAttendance();

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
//         <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
//         <div className="space-y-3">
//           <div className="h-12 bg-gray-200 rounded"></div>
//           <div className="h-12 bg-gray-200 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-md overflow-hidden">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="bg-white/20 p-2 rounded-lg">
//               <Calendar className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h3 className="text-white font-semibold text-lg">Today's Attendance</h3>
//               <p className="text-blue-100 text-sm">
//                 {new Date().toLocaleDateString('en-IN', { 
//                   weekday: 'long', 
//                   day: 'numeric',
//                   month: 'long',
//                   year: 'numeric'
//                 })}
//               </p>
//             </div>
//           </div>
          
//           {/* Status Badge */}
//           <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
//             isClockedIn 
//               ? 'bg-green-500 text-white' 
//               : 'bg-white/20 text-white'
//           }`}>
//             {isClockedIn ? '🟢 Active' : '⚪ Inactive'}
//           </div>
//         </div>
//       </div>

//       <div className="p-6 space-y-4">
//         {/* Timer Display */}
//         {isClockedIn && (
//           <AttendanceTimer />
//         )}

//         {/* Login Time Info */}
//         {isClockedIn && attendance && (
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <div className="flex items-center justify-between text-sm">
//               <div className="flex items-center gap-2 text-blue-700">
//                 <Clock className="w-4 h-4" />
//                 <span className="font-medium">Clocked In:</span>
//               </div>
//               <span className="font-bold text-blue-900">
//                 {formatTimeAMPM(attendance.loginTime)}
//               </span>
//             </div>
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="grid grid-cols-1 gap-3">
//           <ClockInButton />
//           <BreakButton />
//           <ClockOutButton />
//         </div>

//         {/* Quick Stats */}
//         {isClockedIn && attendance && (
//           <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
//             <div className="text-center">
//               <div className="text-xs text-gray-600 mb-1">Breaks</div>
//               <div className="text-lg font-bold text-gray-900">
//                 {attendance.breaks?.length || 0}
//               </div>
//             </div>
//             <div className="text-center border-l border-r border-gray-200">
//               <div className="text-xs text-gray-600 mb-1">Break Time</div>
//               <div className="text-lg font-bold text-gray-900">
//                 {Math.floor(attendance.totalBreakMinutes || 0)}m
//               </div>
//             </div>
//             <div className="text-center">
//               <div className="text-xs text-gray-600 mb-1">Net Hours</div>
//               <div className="text-lg font-bold text-green-600">
//                 {((attendance.netWorkingMinutes || 0) / 60).toFixed(1)}h
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Tips when not clocked in */}
//         {!isClockedIn && (
//           <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
//             <div className="flex items-start gap-3">
//               <TrendingUp className="w-5 h-5 text-gray-600 mt-0.5" />
//               <div className="text-sm text-gray-700">
//                 <p className="font-medium mb-1">Pro Tip:</p>
//                 <p className="text-xs text-gray-600">
//                   Clock in at the start of your day to track your working hours accurately.
//                   You can take up to 4 breaks per day (15 min each).
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
  

// };

// export default AttendanceWidget;







import { Calendar, Clock, TrendingUp, Coffee, Zap } from 'lucide-react';
import { useAttendance } from '../../../hooks/useAttendance';
import ClockInButton from '../../Attendance/components/ClockInButton';
import ClockOutButton from '../../Attendance/components/ClockOutButton';
import BreakButton from '../../Attendance/components/BreakButton';
import AttendanceTimer from '../../../components/widgets/AttendanceTimer';
import { formatTimeAMPM } from '../../../utils/attendanceHelpers';

const AttendanceWidget = () => {
  const { attendance, isClockedIn, loading } = useAttendance();

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Compact Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isClockedIn ? 'bg-green-50' : 'bg-gray-50'}`}>
              <Clock className={`w-5 h-5 ${isClockedIn ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Attendance</h3>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'short', 
                  day: 'numeric',
                  month: 'short'
                })}
              </p>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isClockedIn 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {isClockedIn ? '● Active' : '○ Inactive'}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Timer Section */}
          <div className="lg:col-span-2">
            {isClockedIn ? (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <AttendanceTimer />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center h-full">
                <Zap className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-600 mb-1">Ready to start?</p>
                <p className="text-xs text-gray-500">Clock in to begin tracking your day</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="space-y-3">
            {isClockedIn && attendance ? (
              <>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-blue-700">Clocked In</span>
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <p className="text-lg font-bold text-blue-900">
                    {formatTimeAMPM(attendance.loginTime)}
                  </p>
                </div>

                <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-orange-700">Breaks</span>
                    <Coffee className="w-3.5 h-3.5 text-orange-600" />
                  </div>
                  <p className="text-lg font-bold text-orange-900">
                    {attendance.breaks?.length || 0} / 4
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-green-700">Net Hours</span>
                    <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <p className="text-lg font-bold text-green-900">
                    {((attendance.netWorkingMinutes || 0) / 60).toFixed(1)}h
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-amber-800">
                    <p className="font-semibold mb-1">Pro Tip</p>
                    <p className="text-amber-700 leading-relaxed">
                      Start your day by clocking in. Take up to 4 breaks (15 min each).
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Horizontal */}
        <div className="grid grid-cols-3 gap-3">
          <ClockInButton />
          <BreakButton />
          <ClockOutButton />
        </div>
      </div>
    </div>
  );
};

export default AttendanceWidget;