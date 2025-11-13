import { useState } from 'react';
import { LogOut, Loader2, AlertCircle } from 'lucide-react';
import { clockOut } from '../../../services/attendance.service';
import { useAttendance } from '../../../hooks/useAttendance';
import { getBrowserInfo } from '../../../utils/attendanceHelpers';

const ClockOutButton = () => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const { updateAfterClockOut, isClockedIn, isOnBreak, attendance } = useAttendance();

  const handleClockOut = async () => {
    try {
      setLoading(true);
      setError('');

      const location = getBrowserInfo();
      const response = await clockOut(location);

      if (response.success) {
        updateAfterClockOut();
        setShowConfirm(false);
        
        const workingHours = (response.data.netWorkingMinutes / 60).toFixed(2);
        if (window.showToast) {
          window.showToast('success', `Clocked out successfully! Worked ${workingHours} hours today 👏`);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to clock out');
      if (window.showToast) {
        window.showToast('error', err.message || 'Failed to clock out');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isClockedIn) {
    return null;
  }

  if (isOnBreak) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-orange-700">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">Please end your break before clocking out</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
        >
          <LogOut className="w-6 h-6" />
          <span>Clock Out</span>
        </button>
      ) : (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 mb-1">
                Confirm Clock Out
              </h4>
              <p className="text-sm text-red-700">
                Are you sure you want to clock out? This will end your work day.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleClockOut}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Clocking Out...</span>
                </>
              ) : (
                <span>Yes, Clock Out</span>
              )}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={loading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Working Summary */}
      {attendance && (
        <div className="bg-gray-50 rounded-lg p-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-gray-600">Login Time:</span>
              <div className="font-semibold text-gray-900">
                {new Date(attendance.loginTime).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Breaks Taken:</span>
              <div className="font-semibold text-gray-900">
                {attendance.breaks?.length || 0}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClockOutButton;