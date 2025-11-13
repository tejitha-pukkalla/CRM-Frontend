import { useState } from 'react';
import { Coffee, Play, Loader2, AlertTriangle } from 'lucide-react';
import { startBreak, endBreak } from '../../../services/attendance.service';
import { useAttendance } from '../../../hooks/useAttendance';
import { useBreakTimer } from '../../../hooks/useBreakTimer';

const BreakButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBreakTypes, setShowBreakTypes] = useState(false);
  
  const { 
    isClockedIn, 
    isOnBreak, 
    activeBreak,
    attendance,
    updateAfterBreakStart,
    updateAfterBreakEnd 
  } = useAttendance();

  const { 
    formattedTime, 
    isWarning, 
    isDanger,
    remainingMinutes 
  } = useBreakTimer(isOnBreak, activeBreak?.startTime);

  const breakTypes = [
    { value: 'tea-break', label: '☕ Tea Break', icon: '☕' },
    { value: 'lunch-break', label: '🍽️ Lunch Break', icon: '🍽️' },
    { value: 'short-break', label: '⏸️ Short Break', icon: '⏸️' },
    { value: 'personal', label: '👤 Personal', icon: '👤' }
  ];

  const handleStartBreak = async (breakType) => {
    try {
      setLoading(true);
      setError('');

      const response = await startBreak(breakType);

      if (response.success) {
        updateAfterBreakStart(response.data);
        setShowBreakTypes(false);
        
        if (window.showToast) {
          window.showToast('success', 'Break started! ☕');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to start break');
      if (window.showToast) {
        window.showToast('error', err.message || 'Failed to start break');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEndBreak = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await endBreak();

      if (response.success) {
        updateAfterBreakEnd(response.data);
        
        if (window.showToast) {
          window.showToast('success', 'Break ended! Back to work 💪');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to end break');
      if (window.showToast) {
        window.showToast('error', err.message || 'Failed to end break');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isClockedIn) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-gray-500">
          <Coffee className="w-5 h-5" />
          <span className="text-sm">Clock in first to take a break</span>
        </div>
      </div>
    );
  }

  // Break in progress
  if (isOnBreak) {
    return (
      <div className="space-y-3">
        <div className={`rounded-xl p-4 border-2 ${
          isDanger 
            ? 'bg-red-50 border-red-300' 
            : isWarning 
            ? 'bg-orange-50 border-orange-300'
            : 'bg-blue-50 border-blue-300'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Coffee className={`w-5 h-5 ${
                isDanger ? 'text-red-600' : isWarning ? 'text-orange-600' : 'text-blue-600'
              }`} />
              <span className={`font-semibold ${
                isDanger ? 'text-red-900' : isWarning ? 'text-orange-900' : 'text-blue-900'
              }`}>
                On Break
              </span>
            </div>
            <span className={`text-2xl font-bold tabular-nums ${
              isDanger ? 'text-red-700' : isWarning ? 'text-orange-700' : 'text-blue-700'
            }`}>
              {formattedTime}
            </span>
          </div>

          {/* Warning/Danger Messages */}
          {isWarning && !isDanger && (
            <div className="flex items-start gap-2 bg-orange-100 rounded-lg p-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
              <div className="text-xs text-orange-800">
                <strong>Warning:</strong> {remainingMinutes} minutes left
              </div>
            </div>
          )}

          {isDanger && (
            <div className="flex items-start gap-2 bg-red-100 rounded-lg p-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
              <div className="text-xs text-red-800">
                <strong>Exceeded:</strong> Maximum break time reached!
              </div>
            </div>
          )}

          {/* Resume Button */}
          <button
            onClick={handleEndBreak}
            disabled={loading}
            className={`w-full font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Resuming...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Resume Work</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Start break options
  return (
    <div className="space-y-3">
      {!showBreakTypes ? (
        <button
          onClick={() => setShowBreakTypes(true)}
          disabled={attendance?.breaks?.length >= 4}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
        >
          <Coffee className="w-6 h-6" />
          <span>Take a Break</span>
        </button>
      ) : (
        <div className="bg-white border-2 border-orange-200 rounded-xl p-4 space-y-2">
          <h4 className="font-semibold text-gray-900 mb-3">Select Break Type</h4>
          
          {breakTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleStartBreak(type.value)}
              disabled={loading}
              className="w-full bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-all flex items-center gap-3 disabled:opacity-50"
            >
              <span className="text-2xl">{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}

          <button
            onClick={() => setShowBreakTypes(false)}
            disabled={loading}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors mt-2"
          >
            Cancel
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Break Stats */}
      {attendance && (
        <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Breaks Today:</span>
            <span className="font-semibold text-gray-900">
              {attendance.breaks?.length || 0} / 4
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Total Break Time:</span>
            <span className="font-semibold text-gray-900">
              {Math.floor(attendance.totalBreakMinutes || 0)} / 60 min
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreakButton;