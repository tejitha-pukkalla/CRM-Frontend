import { Clock, Coffee, Calendar, User } from 'lucide-react';
import { 
  formatDate, 
  formatTimeAMPM, 
  getStatusColor,
  isLateArrival,
  isEarlyDeparture 
} from '../../../utils/attendanceHelpers';

const AttendanceTable = ({ attendances, loading, showUser = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!attendances || attendances.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No Attendance Records
        </h3>
        <p className="text-sm text-gray-500">
          No attendance data found for the selected period.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              {showUser && (
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  User
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Logout
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Working Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Breaks
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attendances.map((attendance) => {
              const workingHours = ((attendance.netWorkingMinutes || 0) / 60).toFixed(2);
              const isLate = isLateArrival(attendance.loginTime);
              const isEarly = attendance.logoutTime && isEarlyDeparture(attendance.logoutTime);

              return (
                <tr key={attendance._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(attendance.date)}
                      </span>
                    </div>
                  </td>

                  {showUser && attendance.user && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {attendance.user.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {attendance.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                  )}

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatTimeAMPM(attendance.loginTime)}
                        </div>
                        {isLate && (
                          <span className="text-xs text-orange-600 font-medium">
                            Late
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {attendance.logoutTime ? (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-red-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatTimeAMPM(attendance.logoutTime)}
                          </div>
                          {isEarly && (
                            <span className="text-xs text-orange-600 font-medium">
                              Early
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 italic">Working...</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`text-sm font-bold ${
                        workingHours >= 8 ? 'text-green-600' :
                        workingHours >= 6 ? 'text-yellow-600' :
                        workingHours >= 4 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {workingHours}h
                      </div>
                      {attendance.totalBreakMinutes > 0 && (
                        <span className="text-xs text-gray-500">
                          (-{Math.floor(attendance.totalBreakMinutes)}m)
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Coffee className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-900">
                        {attendance.breaks?.length || 0}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(attendance.status)}`}>
                      {attendance.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {attendances.map((attendance) => {
          const workingHours = ((attendance.netWorkingMinutes || 0) / 60).toFixed(2);

          return (
            <div 
              key={attendance._id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              {/* Date and Status */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    {formatDate(attendance.date)}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(attendance.status)}`}>
                  {attendance.status}
                </span>
              </div>

              {/* User Info (if shown) */}
              {showUser && attendance.user && (
                <div className="mb-3 pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {attendance.user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {attendance.user.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Times Grid */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Login</div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-green-500" />
                    <span className="text-sm font-medium text-gray-900">
                      {formatTimeAMPM(attendance.loginTime)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Logout</div>
                  {attendance.logoutTime ? (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-red-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {formatTimeAMPM(attendance.logoutTime)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 italic">Working...</span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                <div>
                  <div className="text-xs text-gray-600">Working Hours</div>
                  <div className="text-lg font-bold text-green-600">
                    {workingHours}h
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Breaks</div>
                  <div className="text-lg font-bold text-orange-600">
                    {attendance.breaks?.length || 0}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceTable;