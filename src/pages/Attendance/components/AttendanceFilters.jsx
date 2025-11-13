// // src/pages/Attendance/components/AttendanceFilters.jsx
// import { useState, useEffect } from 'react';
// import { Calendar, X, Search } from 'lucide-react';
// import { getDateRange } from '../../../utils/attendanceHelpers';

// const AttendanceFilters = ({ filters, onFilterChange, showUserFilter = false }) => {
//   const [localFilters, setLocalFilters] = useState(filters);
//   const [users, setUsers] = useState([]); // You'll need to fetch users from your API

//   const statusOptions = [
//     { value: '', label: 'All Status' },
//     { value: 'present', label: 'Present' },
//     { value: 'absent', label: 'Absent' },
//     { value: 'half-day', label: 'Half Day' },
//     { value: 'on-leave', label: 'On Leave' },
//     { value: 'holiday', label: 'Holiday' },
//     { value: 'weekend', label: 'Weekend' }
//   ];

//   const dateRangePresets = [
//     { label: 'Today', value: 'today' },
//     { label: 'Last 7 Days', value: 'week' },
//     { label: 'Last 30 Days', value: 'month' },
//     { label: 'Last Year', value: 'year' }
//   ];

//   const handleInputChange = (field, value) => {
//     setLocalFilters(prev => ({ ...prev, [field]: value }));
//   };

//   const handleApplyFilters = () => {
//     onFilterChange(localFilters);
//   };

//   const handleClearFilters = () => {
//     const clearedFilters = {
//       date: '',
//       userId: '',
//       status: '',
//       startDate: '',
//       endDate: '',
//       page: 1
//     };
//     setLocalFilters(clearedFilters);
//     onFilterChange(clearedFilters);
//   };

//   const handleDateRangePreset = (preset) => {
//     const { startDate, endDate } = getDateRange(preset);
//     const newFilters = {
//       ...localFilters,
//       startDate,
//       endDate,
//       date: ''
//     };
//     setLocalFilters(newFilters);
//     onFilterChange(newFilters);
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-md p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//           <Search className="w-5 h-5 text-blue-600" />
//           Filters
//         </h3>
        
//         <button
//           onClick={handleClearFilters}
//           className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
//         >
//           <X className="w-4 h-4" />
//           Clear All
//         </button>
//       </div>

//       <div className="space-y-4">
//         {/* Date Range Presets */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Quick Select
//           </label>
//           <div className="flex flex-wrap gap-2">
//             {dateRangePresets.map((preset) => (
//               <button
//                 key={preset.value}
//                 onClick={() => handleDateRangePreset(preset.value)}
//                 className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
//               >
//                 {preset.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Date Filters Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Single Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Specific Date
//             </label>
//             <div className="relative">
//               <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="date"
//                 value={localFilters.date}
//                 onChange={(e) => handleInputChange('date', e.target.value)}
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           {/* Start Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Start Date
//             </label>
//             <div className="relative">
//               <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="date"
//                 value={localFilters.startDate}
//                 onChange={(e) => handleInputChange('startDate', e.target.value)}
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           {/* End Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               End Date
//             </label>
//             <div className="relative">
//               <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="date"
//                 value={localFilters.endDate}
//                 onChange={(e) => handleInputChange('endDate', e.target.value)}
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Status and User Filters */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Status Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Status
//             </label>
//             <select
//               value={localFilters.status}
//               onChange={(e) => handleInputChange('status', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               {statusOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* User Filter (Admin Only) */}
//           {showUserFilter && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 User
//               </label>
//               <select
//                 value={localFilters.userId}
//                 onChange={(e) => handleInputChange('userId', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="">All Users</option>
//                 {users.map((user) => (
//                   <option key={user._id} value={user._id}>
//                     {user.name} - {user.email}
//                   </option>
//                 ))}
//               </select>
//               <p className="text-xs text-gray-500 mt-1">
//                 Leave empty to see all users
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Apply Button */}
//         <div className="flex justify-end pt-4 border-t border-gray-200">
//           <button
//             onClick={handleApplyFilters}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
//           >
//             <Search className="w-4 h-4" />
//             Apply Filters
//           </button>
//         </div>
//       </div>

//       {/* Active Filters Display */}
//       {(localFilters.date || localFilters.startDate || localFilters.endDate || localFilters.status || localFilters.userId) && (
//         <div className="mt-4 pt-4 border-t border-gray-200">
//           <p className="text-sm font-medium text-gray-700 mb-2">Active Filters:</p>
//           <div className="flex flex-wrap gap-2">
//             {localFilters.date && (
//               <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
//                 Date: {localFilters.date}
//                 <button
//                   onClick={() => handleInputChange('date', '')}
//                   className="hover:bg-blue-200 rounded-full p-0.5"
//                 >
//                   <X className="w-3 h-3" />
//                 </button>
//               </span>
//             )}
//             {localFilters.startDate && (
//               <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
//                 From: {localFilters.startDate}
//                 <button
//                   onClick={() => handleInputChange('startDate', '')}
//                   className="hover:bg-blue-200 rounded-full p-0.5"
//                 >
//                   <X className="w-3 h-3" />
//                 </button>
//               </span>
//             )}
//             {localFilters.endDate && (
//               <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
//                 To: {localFilters.endDate}
//                 <button
//                   onClick={() => handleInputChange('endDate', '')}
//                   className="hover:bg-blue-200 rounded-full p-0.5"
//                 >
//                   <X className="w-3 h-3" />
//                 </button>
//               </span>
//             )}
//             {localFilters.status && (
//               <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
//                 Status: {localFilters.status}
//                 <button
//                   onClick={() => handleInputChange('status', '')}
//                   className="hover:bg-green-200 rounded-full p-0.5"
//                 >
//                   <X className="w-3 h-3" />
//                 </button>
//               </span>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AttendanceFilters;






import { useState, useEffect } from 'react';
import { Calendar, X, Search } from 'lucide-react';
import { getDateRange } from '../../../utils/attendanceHelpers';

// 🔥 CHANGED: Added 'users' prop
const AttendanceFilters = ({ filters, onFilterChange, showUserFilter = false, users = [] }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // 🔥 DEBUG: Log when users prop changes
  useEffect(() => {
    console.log('👥 Users received in AttendanceFilters:', users);
    console.log('👥 Users length:', users.length);
  }, [users]);

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'half-day', label: 'Half Day' },
    { value: 'on-leave', label: 'On Leave' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'weekend', label: 'Weekend' }
  ];

  const dateRangePresets = [
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: 'week' },
    { label: 'Last 30 Days', value: 'month' },
    { label: 'Last Year', value: 'year' }
  ];

  const handleInputChange = (field, value) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      date: '',
      userId: '',
      status: '',
      startDate: '',
      endDate: '',
      page: 1
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const handleDateRangePreset = (preset) => {
    const { startDate, endDate } = getDateRange(preset);
    const newFilters = {
      ...localFilters,
      startDate,
      endDate,
      date: ''
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          Filters
        </h3>
        
        <button
          onClick={handleClearFilters}
          className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        {/* Date Range Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Select
          </label>
          <div className="flex flex-wrap gap-2">
            {dateRangePresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handleDateRangePreset(preset.value)}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Single Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specific Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={localFilters.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={localFilters.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={localFilters.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Status and User Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={localFilters.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* User Filter (Admin Only) */}
          {showUserFilter && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User
              </label>
              <select
                value={localFilters.userId}
                onChange={(e) => handleInputChange('userId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Users</option>
                {/* 🔥 FIXED: Now using the 'users' prop */}
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} - {user.email}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {users.length === 0 ? 'Loading users...' : `${users.length} users available`}
              </p>
            </div>
          )}
        </div>

        {/* Apply Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={handleApplyFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(localFilters.date || localFilters.startDate || localFilters.endDate || localFilters.status || localFilters.userId) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {localFilters.date && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Date: {localFilters.date}
                <button
                  onClick={() => handleInputChange('date', '')}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.startDate && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                From: {localFilters.startDate}
                <button
                  onClick={() => handleInputChange('startDate', '')}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.endDate && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                To: {localFilters.endDate}
                <button
                  onClick={() => handleInputChange('endDate', '')}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.status && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Status: {localFilters.status}
                <button
                  onClick={() => handleInputChange('status', '')}
                  className="hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.userId && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                User: {users.find(u => u._id === localFilters.userId)?.name || 'Selected'}
                <button
                  onClick={() => handleInputChange('userId', '')}
                  className="hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceFilters;