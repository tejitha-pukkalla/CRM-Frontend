import React from 'react';

const TaskPriorityBadge = ({ priority }) => {
  const getPriorityConfig = () => {
    switch (priority) {
      case 'high':
        return { color: 'bg-red-100 text-red-700', label: 'High', icon: '🔴' };
      case 'medium':
        return { color: 'bg-yellow-100 text-yellow-700', label: 'Medium', icon: '🟡' };
      case 'low':
        return { color: 'bg-green-100 text-green-700', label: 'Low', icon: '🟢' };
      default:
        return { color: 'bg-gray-100 text-gray-700', label: priority, icon: '' };
    }
  };

  const config = getPriorityConfig();

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon} {config.label}
    </span>
  );
};

export default TaskPriorityBadge;