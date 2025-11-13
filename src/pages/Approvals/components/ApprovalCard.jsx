import { useState } from 'react';
import TaskStatusBadge from '../../Tasks/components/TaskStatusBadge';
import TaskPriorityBadge from '../../Tasks/components/TaskPriorityBadge';
import ApproveButton from './ApproveButton';
import RejectModal from './RejectModal';

const ApprovalCard = ({ task, onApprove, onReject, onViewDetails }) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await onApprove(task._id);
    setLoading(false);
  };

  const handleReject = async (reason) => {
    setLoading(true);
    await onReject(task._id, reason);
    setLoading(false);
    setShowRejectModal(false);
  };

  const getApprovalTypeLabel = () => {
    if (task.approvalStatus === 'pending_teamlead') {
      return {
        label: 'Team Lead Approval Required',
        color: 'bg-orange-100 text-orange-800 border-orange-200'
      };
    }
    return {
      label: 'Superadmin Approval Required',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
  };

  const approvalType = getApprovalTypeLabel();

  return (
    <>
      <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${approvalType.color}`}>
                  {approvalType.label}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {task.title}
              </h3>
              <p className="text-gray-600 line-clamp-2 mb-3">
                {task.description}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <TaskStatusBadge status={task.status} />
                <TaskPriorityBadge priority={task.priority} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Assigned To</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                  {task.assignedTo?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{task.assignedTo?.name}</p>
                  <p className="text-xs text-gray-500">{task.assignedTo?.email}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Assigned By</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-medium">
                  {task.assignedBy?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{task.assignedBy?.name}</p>
                  <p className="text-xs text-gray-500">{task.assignedBy?.email}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Project</p>
              <p className="text-sm font-medium text-gray-900">{task.projectId?.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={() => onViewDetails(task._id)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Details →
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={loading}
                className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
              <ApproveButton onClick={handleApprove} loading={loading} />
            </div>
          </div>
        </div>
      </div>

      <RejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onReject={handleReject}
        loading={loading}
        taskTitle={task.title}
      />
    </>
  );
};

export default ApprovalCard;