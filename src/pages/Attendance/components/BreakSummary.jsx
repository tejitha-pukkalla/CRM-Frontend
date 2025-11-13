// src/pages/Attendance/components/BreakSummary.jsx
import { Coffee, Clock, TrendingDown } from 'lucide-react';
import { getBreakTypeInfo, formatMinutesToReadable, formatTimeAMPM } from '../../../utils/attendanceHelpers';

const BreakSummary = ({ attendance }) => {
  if (!attendance || !attendance.breaks || attendance.breaks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Coffee className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Break Summary</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Coffee className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No breaks taken</p>
        </div>
      </div>
    );
  }

  const totalBreakMinutes = attendance.totalBreakMinutes || 0;
  const breakCount = attendance.breaks.length;
  const avgBreakMinutes = breakCount > 0 ? totalBreakMinutes / breakCount : 0;
  const remainingBreaks = Math.max(0, 4 - breakCount);
  const remainingBreakTime = Math.max(0, 60 - totalBreakMinutes);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Break Summary</h3>
          </div>
          <span className="text-sm opacity-90">
            {breakCount} / 4 breaks taken
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-xs text-orange-600 font-medium mb-1">Total Time</p>
            <p className="text-xl font-bold text-orange-700">
              {Math.floor(totalBreakMinutes)}m
            </p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600 font-medium mb-1">Avg Break</p>
            <p className="text-xl font-bold text-blue-700">
              {Math.floor(avgBreakMinutes)}m
            </p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-600 font-medium mb-1">Remaining</p>
            <p className="text-xl font-bold text-purple-700">
              {remainingBreakTime}m
            </p>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4 mb-6">
          {/* Breaks Used */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Breaks Used</span>
              <span className="font-semibold text-gray-900">
                {breakCount} / 4
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  breakCount >= 4 ? 'bg-red-500' : 'bg-orange-500'
                }`}
                style={{ width: `${(breakCount / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Time Used */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Time Used</span>
              <span className="font-semibold text-gray-900">
                {Math.floor(totalBreakMinutes)} / 60 min
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  totalBreakMinutes >= 60 ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min((totalBreakMinutes / 60) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Break List */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Break Details</h4>
          <div className="space-y-2">
            {attendance.breaks.map((brk, index) => {
              const breakInfo = getBreakTypeInfo(brk.breakType);
              const duration = brk.duration || 0;
              const isExceeded = duration > 15;

              return (
                <div
                  key={brk._id || index}
                  className={`p-3 rounded-lg border-2 ${
                    brk.isActive
                      ? 'bg-orange-50 border-orange-300'
                      : isExceeded
                      ? 'bg-red-50 border-red-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{breakInfo.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {breakInfo.label}
                        </p>
                        <p className="text-xs text-gray-600">
                          Started: {formatTimeAMPM(brk.startTime)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {brk.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500 text-white rounded-full text-xs font-medium">
                          <Clock className="w-3 h-3 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <div>
                          <p className={`text-sm font-bold ${
                            isExceeded ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {duration} min
                          </p>
                          {isExceeded && (
                            <span className="text-xs text-red-600 font-medium">
                              Exceeded!
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {!brk.isActive && brk.endTime && (
                    <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-200">
                      <span>Ended: {formatTimeAMPM(brk.endTime)}</span>
                      <span>Duration: {formatMinutesToReadable(duration)}</span>
                    </div>
                  )}

                  {brk.notes && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600 italic">
                        Note: {brk.notes}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Warning Messages */}
        {breakCount >= 4 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Maximum breaks reached for today
            </p>
          </div>
        )}

        {totalBreakMinutes >= 60 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Maximum break time exceeded
            </p>
          </div>
        )}

        {remainingBreaks > 0 && remainingBreakTime > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>{remainingBreaks} breaks</strong> and{' '}
              <strong>{remainingBreakTime} minutes</strong> remaining today
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreakSummary;