// src/pages/Attendance/components/WorkingHoursChart.jsx
import { BarChart3 } from 'lucide-react';
import { formatDate } from '../../../utils/attendanceHelpers';

const WorkingHoursChart = ({ attendances }) => {
  // Get last 7 days of data
  const last7Days = attendances.slice(0, 7).reverse();

  const maxHours = Math.max(
    ...last7Days.map(att => (att.netWorkingMinutes || 0) / 60),
    8
  );

  const getBarColor = (hours) => {
    if (hours >= 8) return 'bg-green-500';
    if (hours >= 6) return 'bg-yellow-500';
    if (hours >= 4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getBarHeight = (hours) => {
    const percentage = (hours / maxHours) * 100;
    return `${Math.max(percentage, 5)}%`;
  };

  if (last7Days.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Working Hours Trend (Last 7 Days)
        </h3>
        
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">≥8h</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-600">6-8h</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-gray-600">4-6h</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600">&lt;4h</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 w-8">
          <span>{maxHours.toFixed(0)}h</span>
          <span>{(maxHours * 0.75).toFixed(0)}h</span>
          <span>{(maxHours * 0.5).toFixed(0)}h</span>
          <span>{(maxHours * 0.25).toFixed(0)}h</span>
          <span>0h</span>
        </div>

        {/* Chart area */}
        <div className="ml-10">
          {/* Grid lines */}
          <div className="relative h-64 border-l border-b border-gray-200">
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 25, 50, 75, 100].map((i) => (
                <div key={i} className="border-t border-gray-100"></div>
              ))}
            </div>

            {/* Bars */}
            <div className="absolute inset-0 flex items-end justify-around px-4">
              {last7Days.map((attendance, index) => {
                const hours = (attendance.netWorkingMinutes || 0) / 60;
                const barColor = getBarColor(hours);
                const barHeight = getBarHeight(hours);

                return (
                  <div
                    key={attendance._id || index}
                    className="flex-1 mx-1 flex flex-col items-center group"
                  >
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      {hours.toFixed(2)}h
                      {attendance.totalBreakMinutes > 0 && (
                        <span className="text-orange-300">
                          {' '}(-{Math.floor(attendance.totalBreakMinutes)}m)
                        </span>
                      )}
                    </div>

                    {/* Bar */}
                    <div
                      className={`w-full ${barColor} rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer`}
                      style={{ height: barHeight }}
                    ></div>

                    {/* Value label on bar */}
                    <div className="absolute text-xs font-semibold text-white" style={{ bottom: `calc(${barHeight} + 4px)` }}>
                      {hours.toFixed(1)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-around mt-2 text-xs text-gray-600">
            {last7Days.map((attendance, index) => (
              <div key={attendance._id || index} className="flex-1 text-center">
                <div className="font-medium">
                  {new Date(attendance.date).toLocaleDateString('en-IN', { 
                    day: 'numeric',
                    month: 'short'
                  })}
                </div>
                <div className="text-gray-500 text-xs">
                  {new Date(attendance.date).toLocaleDateString('en-IN', { 
                    weekday: 'short'
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats Below Chart */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Avg Hours/Day</p>
          <p className="text-2xl font-bold text-gray-900">
            {(last7Days.reduce((sum, att) => sum + (att.netWorkingMinutes || 0), 0) / last7Days.length / 60).toFixed(1)}h
          </p>
        </div>
        <div className="text-center border-l border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Hours</p>
          <p className="text-2xl font-bold text-gray-900">
            {(last7Days.reduce((sum, att) => sum + (att.netWorkingMinutes || 0), 0) / 60).toFixed(1)}h
          </p>
        </div>
        <div className="text-center border-l border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Breaks</p>
          <p className="text-2xl font-bold text-gray-900">
            {last7Days.reduce((sum, att) => sum + (att.breaks?.length || 0), 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkingHoursChart;