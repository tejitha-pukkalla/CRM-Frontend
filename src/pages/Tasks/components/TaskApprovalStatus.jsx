import React from 'react';

const TaskApprovalStatus = ({ approvalStatus }) => {
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

export default TaskApprovalStatus;