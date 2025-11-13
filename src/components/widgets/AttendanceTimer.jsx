// import { useAttendance } from '../../hooks/useAttendance';
// import { Clock, Coffee, AlertCircle } from 'lucide-react';

// const AttendanceTimer = () => {
//   const {
//     isClockedIn,
//     isOnBreak,
//     formattedWorkingTime,
//     formattedBreakTime,
//     attendance,
//     loading
//   } = useAttendance();

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
//         <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
//         <div className="h-8 bg-gray-200 rounded w-1/2"></div>
//       </div>
//     );
//   }

//   if (!isClockedIn) {
//     return (
//       <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
//         <div className="flex items-center gap-2 text-gray-500">
//           <AlertCircle className="w-5 h-5" />
//           <span className="text-sm font-medium">Not Clocked In</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
//       {/* Working Time */}
//       <div className="mb-3">
//         <div className="flex items-center gap-2 mb-1">
//           <Clock className="w-4 h-4 text-blue-600" />
//           <span className="text-xs font-medium text-gray-600">Working Time</span>
//         </div>
//         <div className={`text-2xl font-bold tabular-nums ${
//           isOnBreak ? 'text-gray-400' : 'text-blue-600'
//         }`}>
//           {formattedWorkingTime}
//         </div>
//       </div>

//       {/* Break Time */}
//       {isOnBreak && (
//         <div className="pt-3 border-t border-gray-200">
//           <div className="flex items-center gap-2 mb-1">
//             <Coffee className="w-4 h-4 text-orange-600" />
//             <span className="text-xs font-medium text-gray-600">Break Time</span>
//           </div>
//           <div className="text-xl font-bold text-orange-600 tabular-nums">
//             {formattedBreakTime}
//           </div>
//           <div className="mt-2 px-2 py-1 bg-orange-100 rounded text-xs text-orange-700 font-medium inline-block">
//             On Break
//           </div>
//         </div>
//       )}

//       {/* Break Summary */}
//       {attendance && attendance.breaks && attendance.breaks.length > 0 && !isOnBreak && (
//         <div className="pt-3 border-t border-gray-200">
//           <div className="flex justify-between items-center text-xs text-gray-600">
//             <span>Total Breaks:</span>
//             <span className="font-semibold">{attendance.breaks.length}</span>
//           </div>
//           <div className="flex justify-between items-center text-xs text-gray-600 mt-1">
//             <span>Break Time:</span>
//             <span className="font-semibold">
//               {Math.floor(attendance.totalBreakMinutes || 0)} min
//             </span>
//           </div>
//         </div>
//       )}

//       {/* Status Indicator */}
//       <div className="mt-3 flex items-center gap-2">
//         <div className={`w-2 h-2 rounded-full ${
//           isOnBreak ? 'bg-orange-500 animate-pulse' : 'bg-green-500 animate-pulse'
//         }`}></div>
//         <span className="text-xs text-gray-600">
//           {isOnBreak ? 'On Break' : 'Working'}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default AttendanceTimer;








import { useAttendance } from '../../hooks/useAttendance';
import { Clock, Coffee, AlertCircle } from 'lucide-react';

const AttendanceTimer = () => {
  const {
    isClockedIn,
    isOnBreak,
    formattedWorkingTime,
    formattedBreakTime,
    attendance,
    loading
  } = useAttendance();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-blue-200 rounded w-3/4 mb-2"></div>
        <div className="h-10 bg-blue-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!isClockedIn) {
    return (
      <div className="flex items-center gap-2 text-gray-500 py-4">
        <AlertCircle className="w-5 h-5" />
        <span className="text-sm font-medium">Not Clocked In</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Working Time Display */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${isOnBreak ? 'bg-orange-500 animate-pulse' : 'bg-green-500 animate-pulse'}`}></div>
          <span className="text-xs font-medium text-gray-700">
            {isOnBreak ? 'On Break' : 'Working Time'}
          </span>
        </div>
        <div className={`text-3xl font-bold tabular-nums ${
          isOnBreak ? 'text-gray-400' : 'text-blue-700'
        }`}>
          {formattedWorkingTime}
        </div>
      </div>

      {/* Break Time - Inline when on break */}
      {isOnBreak && (
        <div className="pt-3 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-medium text-gray-700">Break Time</span>
            </div>
            <div className="text-xl font-bold text-orange-600 tabular-nums">
              {formattedBreakTime}
            </div>
          </div>
        </div>
      )}

      {/* Break Summary - Compact */}
      {attendance && attendance.breaks && attendance.breaks.length > 0 && !isOnBreak && (
        <div className="pt-3 border-t border-blue-200 grid grid-cols-2 gap-3 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Breaks:</span>
            <span className="font-bold text-gray-900">{attendance.breaks.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Break Time:</span>
            <span className="font-bold text-gray-900">
              {Math.floor(attendance.totalBreakMinutes || 0)}m
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTimer;