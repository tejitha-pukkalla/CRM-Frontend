// src/pages/Attendance/AttendanceCalendar.jsx
import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { getMyAttendance } from '../../services/attendance.service';
import { getStatusColor, formatTimeAMPM, isWeekend } from '../../utils/attendanceHelpers';
import BreakSummary from './components/BreakSummary';
import DashboardLayout from '../../layout/DashboardLayout';

const AttendanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Fetch attendance for current month
  const fetchMonthAttendance = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

      const response = await getMyAttendance({
        startDate,
        endDate,
        limit: 100
      });

      if (response.success) {
        setAttendances(response.data.attendances);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthAttendance();
  }, [currentDate]);

  // Calendar helpers
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedAttendance(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedAttendance(null);
  };

  const getAttendanceForDate = (day) => {
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toISOString().split('T')[0];

    return attendances.find(att => {
      const attDate = new Date(att.date).toISOString().split('T')[0];
      return attDate === dateStr;
    });
  };

  const handleDayClick = (day) => {
    const attendance = getAttendanceForDate(day);
    setSelectedAttendance(attendance || null);
  };

  // Generate calendar days
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarDays = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getCellColor = (day) => {
    if (!day) return '';

    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const attendance = getAttendanceForDate(day);

    if (isWeekend(date)) {
      return 'bg-gray-100 text-gray-500';
    }

    if (!attendance) {
      return 'bg-white hover:bg-gray-50';
    }

    const hours = (attendance.netWorkingMinutes || 0) / 60;

    if (attendance.status === 'half-day') {
      return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border-yellow-300';
    }

    if (hours >= 8) {
      return 'bg-green-100 hover:bg-green-200 text-green-900 border-green-300';
    } else if (hours >= 6) {
      return 'bg-blue-100 hover:bg-blue-200 text-blue-900 border-blue-300';
    } else if (hours >= 4) {
      return 'bg-orange-100 hover:bg-orange-200 text-orange-900 border-orange-300';
    } else {
      return 'bg-red-100 hover:bg-red-200 text-red-900 border-red-300';
    }
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            Attendance Calendar
          </h1>
          <p className="text-gray-600 mt-2">
            View your monthly attendance at a glance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Calendar Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between text-white">
                  <button
                    onClick={previousMonth}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <h2 className="text-xl font-semibold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>

                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Legend */}
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                    <span className="text-gray-600">≥8h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                    <span className="text-gray-600">6-8h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
                    <span className="text-gray-600">4-6h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                    <span className="text-gray-600">&lt;4h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-100 rounded"></div>
                    <span className="text-gray-600">Weekend</span>
                  </div>
                </div>
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="text-center py-3 text-sm font-semibold text-gray-700"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading calendar...</p>
                </div>
              ) : (
                <div className="grid grid-cols-7">
                  {calendarDays.map((day, index) => {
                    const attendance = day ? getAttendanceForDate(day) : null;
                    const hours = attendance ? (attendance.netWorkingMinutes || 0) / 60 : 0;

                    return (
                      <button
                        key={index}
                        onClick={() => day && handleDayClick(day)}
                        disabled={!day}
                        className={`aspect-square p-2 border border-gray-200 transition-all ${
                          day ? getCellColor(day) + ' cursor-pointer' : 'bg-gray-50'
                        } ${
                          selectedAttendance && attendance && selectedAttendance._id === attendance._id
                            ? 'ring-2 ring-blue-500 ring-inset'
                            : ''
                        }`}
                      >
                        {day && (
                          <div className="h-full flex flex-col justify-between">
                            <span className="text-sm font-semibold">{day}</span>
                            {attendance && (
                              <div className="text-xs font-bold">
                                {hours.toFixed(1)}h
                              </div>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Month Summary */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Days Present</p>
                <p className="text-2xl font-bold text-green-600">
                  {attendances.length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Total Hours</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(attendances.reduce((sum, att) => sum + (att.netWorkingMinutes || 0), 0) / 60).toFixed(1)}h
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Avg Hours/Day</p>
                <p className="text-2xl font-bold text-purple-600">
                  {attendances.length > 0
                    ? (attendances.reduce((sum, att) => sum + (att.netWorkingMinutes || 0), 0) / attendances.length / 60).toFixed(1)
                    : '0'}h
                </p>
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-1">
            {selectedAttendance ? (
              <div className="space-y-6">
                {/* Attendance Details */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    Attendance Details
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(selectedAttendance.date).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-gray-600">Clock In</p>
                        <p className="text-base font-semibold text-green-600">
                          {formatTimeAMPM(selectedAttendance.loginTime)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Clock Out</p>
                        <p className="text-base font-semibold text-red-600">
                          {selectedAttendance.logoutTime
                            ? formatTimeAMPM(selectedAttendance.logoutTime)
                            : 'Not clocked out'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Working Hours</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {((selectedAttendance.netWorkingMinutes || 0) / 60).toFixed(2)}h
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAttendance.status)}`}>
                        {selectedAttendance.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-600">Breaks</p>
                        <p className="text-lg font-bold text-orange-600">
                          {selectedAttendance.breaks?.length || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Break Time</p>
                        <p className="text-lg font-bold text-orange-600">
                          {Math.floor(selectedAttendance.totalBreakMinutes || 0)}m
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Break Summary */}
                <BreakSummary attendance={selectedAttendance} />
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Select a Date
                </h3>
                <p className="text-sm text-gray-500">
                  Click on any date in the calendar to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default AttendanceCalendar;