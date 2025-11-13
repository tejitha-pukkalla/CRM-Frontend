// src/pages/Tasks/components/TaskStatusBadge.jsx
export const TaskStatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'not-started':
        return { color: 'bg-gray-100 text-gray-700', label: 'Not Started' };
      case 'in-progress':
        return { color: 'bg-blue-100 text-blue-700', label: 'In Progress' };
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

// src/pages/Tasks/components/TaskPriorityBadge.jsx
export const TaskPriorityBadge = ({ priority }) => {
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

// src/pages/Tasks/components/TaskApprovalStatus.jsx
export const TaskApprovalStatus = ({ approvalStatus }) => {
  const getApprovalConfig = () => {
    switch (approvalStatus) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-700', label: 'Pending SA' };
      case 'pending_teamlead':
        return { color: 'bg-orange-100 text-orange-700', label: 'Pending TL' };
      case 'approved':
        return { color: 'bg-green-100 text-green-700', label: 'Approved' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-700', label: 'Rejected' };
      default:
        return { color: 'bg-gray-100 text-gray-700', label: approvalStatus };
    }
  };

  const config = getApprovalConfig();

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};