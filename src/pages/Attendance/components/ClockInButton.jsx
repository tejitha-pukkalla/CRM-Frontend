import { useState } from 'react';
import { LogIn, Loader2 } from 'lucide-react';
import { clockIn } from '../../../services/attendance.service';
import { useAttendance } from '../../../hooks/useAttendance';
import { getBrowserInfo } from '../../../utils/attendanceHelpers';

const ClockInButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { updateAfterClockIn, isClockedIn } = useAttendance();

  const handleClockIn = async () => {
    try {
      setLoading(true);
      setError('');

      const location = getBrowserInfo();
      const response = await clockIn(location);

      if (response.success) {
        updateAfterClockIn(response.data);
        
        // Show success toast/notification
        if (window.showToast) {
          window.showToast('success', 'Clocked in successfully! 🎉');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to clock in');
      if (window.showToast) {
        window.showToast('error', err.message || 'Failed to clock in');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isClockedIn) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-700">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium">Already Clocked In</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleClockIn}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Clocking In...</span>
          </>
        ) : (
          <>
            <LogIn className="w-6 h-6" />
            <span>Clock In</span>
          </>
        )}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        Click to start your work day
      </p>
    </div>
  );
};

export default ClockInButton;