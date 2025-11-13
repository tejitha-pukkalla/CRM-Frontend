// src/pages/Notifications/components/NotificationFilters.jsx
const NotificationFilters = ({ filters, onFilterChange }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
      {/* Filter by Read Status */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700">Filter:</label>
        <select
          value={filters.isRead === undefined ? 'all' : filters.isRead ? 'read' : 'unread'}
          onChange={(e) => {
            const value = e.target.value;
            handleFilterChange(
              'isRead',
              value === 'all' ? undefined : value === 'read'
            );
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Notifications</option>
          <option value="unread">Unread Only</option>
          <option value="read">Read Only</option>
        </select>
      </div>

      {/* Items per page */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700">Show:</label>
        <select
          value={filters.limit}
          onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </div>
  );
};

export default NotificationFilters;