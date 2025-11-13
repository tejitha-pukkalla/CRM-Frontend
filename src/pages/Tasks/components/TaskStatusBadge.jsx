// src/pages/Tasks/components/TaskStatusBadge.jsx
export const TaskStatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'not-started':
        return { color: 'bg-gray-100 text-gray-700', label: 'Not Started' };
      case 'in-progress':
        return { color: 'bg-blue-100 text-blue-700', label: 'In Progress' };
        case 'on-hold':  // ✅ NEW
        return { 
          color: 'bg-orange-100 text-orange-700 border-2 border-orange-300', 
          label: 'On Hold',
          icon: '⏸️'
        };
      case 'completed':
        return { color: 'bg-green-100 text-green-700', label: 'Completed' };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-700', label: 'Cancelled' };
      case 'back_to_projectlead':
        return { color: 'bg-orange-100 text-orange-700', label: 'Back to PL' };
      default:
        return { color: 'bg-gray-100 text-gray-700', label: status };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

export default TaskStatusBadge;
