// // Format time to HH:MM:SS
// export const formatTime = (seconds) => {
//   const hrs = Math.floor(seconds / 3600);
//   const mins = Math.floor((seconds % 3600) / 60);
//   const secs = seconds % 60;
//   return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
// };

// // Format minutes to hours (e.g., 525 -> "8.75")
// export const minutesToHours = (minutes) => {
//   return (minutes / 60).toFixed(2);
// };

// // Format date to readable string
// export const formatDate = (date) => {
//   return new Date(date).toLocaleDateString('en-IN', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric'
//   });
// };

// // Format time to AM/PM
// export const formatTimeAMPM = (date) => {
//   return new Date(date).toLocaleTimeString('en-IN', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true
//   });
// };

// // Get status color
// export const getStatusColor = (status) => {
//   const colors = {
//     present: 'bg-green-100 text-green-800',
//     'half-day': 'bg-yellow-100 text-yellow-800',
//     absent: 'bg-red-100 text-red-800',
//     'on-leave': 'bg-blue-100 text-blue-800',
//     holiday: 'bg-purple-100 text-purple-800',
//     weekend: 'bg-gray-100 text-gray-800'
//   };
//   return colors[status] || 'bg-gray-100 text-gray-800';
// };

// // Get status badge color
// export const getStatusBadge = (status) => {
//   const badges = {
//     present: { bg: 'bg-green-500', text: 'Present' },
//     'half-day': { bg: 'bg-yellow-500', text: 'Half Day' },
//     absent: { bg: 'bg-red-500', text: 'Absent' },
//     'on-leave': { bg: 'bg-blue-500', text: 'On Leave' },
//     holiday: { bg: 'bg-purple-500', text: 'Holiday' },
//     weekend: { bg: 'bg-gray-500', text: 'Weekend' }
//   };
//   return badges[status] || badges.absent;
// };

// // Check if late arrival (after 9:30 AM)
// export const isLateArrival = (loginTime) => {
//   const login = new Date(loginTime);
//   const standardTime = new Date(login);
//   standardTime.setHours(9, 30, 0, 0);
//   return login > standardTime;
// };

// // Check if early departure (before 5:30 PM)
// export const isEarlyDeparture = (logoutTime) => {
//   const logout = new Date(logoutTime);
//   const standardTime = new Date(logout);
//   standardTime.setHours(17, 30, 0, 0);
//   return logout < standardTime;
// };

// // Calculate working hours color (for charts)
// export const getWorkingHoursColor = (hours) => {
//   if (hours >= 8) return '#10b981'; // green
//   if (hours >= 6) return '#f59e0b'; // yellow
//   if (hours >= 4) return '#f97316'; // orange
//   return '#ef4444'; // red
// };

// // Get break type label
// export const getBreakTypeLabel = (breakType) => {
//   const labels = {
//     'tea-break': '☕ Tea Break',
//     'lunch-break': '🍽️ Lunch Break',
//     'short-break': '⏸️ Short Break',
//     'personal': '👤 Personal'
//   };
//   return labels[breakType] || breakType;
// };

// // Get break type icon
// export const getBreakTypeIcon = (breakType) => {
//   const icons = {
//     'tea-break': '☕',
//     'lunch-break': '🍽️',
//     'short-break': '⏸️',
//     'personal': '👤'
//   };
//   return icons[breakType] || '⏸️';
// };

// // Calculate percentage
// export const calculatePercentage = (value, total) => {
//   if (total === 0) return 0;
//   return ((value / total) * 100).toFixed(2);
// };

// // Get attendance stats for period
// export const getAttendanceStats = (attendances) => {
//   const totalDays = attendances.length;
//   let totalWorkingMinutes = 0;
//   let totalBreakMinutes = 0;
//   let presentDays = 0;
//   let halfDays = 0;
//   let lateArrivals = 0;

//   attendances.forEach(att => {
//     totalWorkingMinutes += att.netWorkingMinutes || 0;
//     totalBreakMinutes += att.totalBreakMinutes || 0;

//     if (att.status === 'present') presentDays++;
//     if (att.status === 'half-day') halfDays++;
//     if (isLateArrival(att.loginTime)) lateArrivals++;
//   });

//   return {
//     totalDays,
//     presentDays,
//     halfDays,
//     totalWorkingHours: minutesToHours(totalWorkingMinutes),
//     totalBreakHours: minutesToHours(totalBreakMinutes),
//     averageWorkingHours: totalDays > 0 ? minutesToHours(totalWorkingMinutes / totalDays) : 0,
//     lateArrivals,
//     attendancePercentage: calculatePercentage(presentDays, totalDays)
//   };
// };

// // Get date range for filters
// export const getDateRange = (period) => {
//   const endDate = new Date();
//   let startDate = new Date();

//   switch(period) {
//     case 'today':
//       startDate = new Date();
//       break;
//     case 'week':
//       startDate.setDate(startDate.getDate() - 7);
//       break;
//     case 'month':
//       startDate.setMonth(startDate.getMonth() - 1);
//       break;
//     case 'year':
//       startDate.setFullYear(startDate.getFullYear() - 1);
//       break;
//     default:
//       startDate.setDate(startDate.getDate() - 30);
//   }

//   return {
//     startDate: startDate.toISOString().split('T')[0],
//     endDate: endDate.toISOString().split('T')[0]
//   };
// };

// // Get browser info
// export const getBrowserInfo = () => {
//   const ua = navigator.userAgent;
//   let browser = 'Unknown';

//   if (ua.includes('Firefox')) browser = 'Firefox';
//   else if (ua.includes('Chrome')) browser = 'Chrome';
//   else if (ua.includes('Safari')) browser = 'Safari';
//   else if (ua.includes('Edge')) browser = 'Edge';

//   return {
//     browser,
//     device: /Mobile|Android|iPhone|iPad/.test(ua) ? 'Mobile' : 'Desktop'
//   };
// };

// // Export to CSV
// export const exportToCSV = (data, filename) => {
//   if (!data || data.length === 0) return;

//   const headers = Object.keys(data[0]);
//   const csv = [
//     headers.join(','),
//     ...data.map(row => 
//       headers.map(header => {
//         const value = row[header];
//         return typeof value === 'string' && value.includes(',') 
//           ? `"${value}"` 
//           : value;
//       }).join(',')
//     )
//   ].join('\n');

//   const blob = new Blob([csv], { type: 'text/csv' });
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
//   a.click();
//   window.URL.revokeObjectURL(url);
// };




// src/utils/attendanceHelpers.js

/**
 * Format date as DD/MM/YYYY
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Format time in 12-hour format with AM/PM
 */
export const formatTimeAMPM = (date) => {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Format time as HH:MM:SS
 */
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes % 1) * 60);
  
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/**
 * Get status badge color classes
 */
export const getStatusColor = (status) => {
  const colors = {
    'present': 'bg-green-100 text-green-800 border-green-200',
    'absent': 'bg-red-100 text-red-800 border-red-200',
    'half-day': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'on-leave': 'bg-blue-100 text-blue-800 border-blue-200',
    'holiday': 'bg-purple-100 text-purple-800 border-purple-200',
    'weekend': 'bg-gray-100 text-gray-800 border-gray-200'
  };
  
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

/**
 * Check if login time is late (after 9:30 AM)
 */
export const isLateArrival = (loginTime) => {
  const login = new Date(loginTime);
  const standardTime = new Date(login);
  standardTime.setHours(9, 30, 0, 0);
  
  return login > standardTime;
};

/**
 * Check if logout time is early (before 5:30 PM)
 */
export const isEarlyDeparture = (logoutTime) => {
  const logout = new Date(logoutTime);
  const standardTime = new Date(logout);
  standardTime.setHours(17, 30, 0, 0);
  
  return logout < standardTime;
};

/**
 * Get browser and device info
 */
export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  let browser = 'Unknown';
  
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  
  return {
    browser,
    device: /Mobile|Android|iPhone/i.test(userAgent) ? 'Mobile' : 'Desktop'
  };
};

/**
 * Calculate working hours color
 */
export const getWorkingHoursColor = (hours) => {
  if (hours >= 8) return 'text-green-600';
  if (hours >= 6) return 'text-yellow-600';
  if (hours >= 4) return 'text-orange-600';
  return 'text-red-600';
};

/**
 * Get break type label and icon
 */
export const getBreakTypeInfo = (breakType) => {
  const types = {
    'tea-break': { label: 'Tea Break', icon: '☕', color: 'orange' },
    'lunch-break': { label: 'Lunch Break', icon: '🍽️', color: 'blue' },
    'short-break': { label: 'Short Break', icon: '⏸️', color: 'gray' },
    'personal': { label: 'Personal', icon: '👤', color: 'purple' }
  };
  
  return types[breakType] || { label: breakType, icon: '⏰', color: 'gray' };
};

/**
 * Check if date is weekend
 */
export const isWeekend = (date) => {
  const day = new Date(date).getDay();
  return day === 0 || day === 6;
};

/**
 * Get date range for filters
 */
export const getDateRange = (period) => {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  
  let startDate = new Date();
  
  switch(period) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      startDate.setDate(startDate.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
  }
  
  return { 
    startDate: startDate.toISOString().split('T')[0], 
    endDate: endDate.toISOString().split('T')[0] 
  };
};

/**
 * Format minutes to readable string
 */
export const formatMinutesToReadable = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}m`;
  }
};

/**
 * Calculate attendance percentage
 */
export const calculateAttendancePercentage = (present, total) => {
  if (total === 0) return 0;
  return ((present / total) * 100).toFixed(1);
};

/**
 * Get greeting based on time
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

/**
 * Export attendance data to CSV
 */
export const exportToCSV = (attendances, filename = 'attendance_report.csv') => {
  const headers = ['Date', 'Name', 'Login', 'Logout', 'Working Hours', 'Breaks', 'Status'];
  
  const csvData = attendances.map(att => [
    formatDate(att.date),
    att.user?.name || 'N/A',
    formatTimeAMPM(att.loginTime),
    att.logoutTime ? formatTimeAMPM(att.logoutTime) : 'Not clocked out',
    ((att.netWorkingMinutes || 0) / 60).toFixed(2),
    att.breaks?.length || 0,
    att.status
  ]);
  
  const csv = [
    headers.join(','),
    ...csvData.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};