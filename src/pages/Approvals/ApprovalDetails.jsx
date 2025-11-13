import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import taskService from '../../services/task.service';
import approvalService from '../../services/approval.service';
import DashboardLayout from '../../layout/DashboardLayout';
import ApproveButton from './components/ApproveButton';
import RejectModal from './components/RejectModal';
import TaskStatusBadge from '../Tasks/components/TaskStatusBadge';
import TaskPriorityBadge from '../Tasks/components/TaskPriorityBadge';
import Spinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

const ApprovalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTask(id);
      setTask(data.data.task);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch task details');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await approvalService.approveTask(id);
      navigate('/approvals');
    } catch (err) {
      setError(err.message || 'Failed to approve task');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (reason) => {
    try {
      setActionLoading(true);
      await approvalService.rejectTask(id, reason);
      setShowRejectModal(false);
      navigate('/approvals');
    } catch (err) {
      setError(err.message || 'Failed to reject task');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message="Task not found" />
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <button
          onClick={() => navigate('/approvals')}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Approvals
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Task Approval</h1>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {task.title}
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                <TaskStatusBadge status={task.status} />
                <TaskPriorityBadge priority={task.priority} />
                <span className="text-sm text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
            <p className="text-gray-900 whitespace-pre-wrap">{task.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Assigned To</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {task.assignedTo?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{task.assignedTo?.name}</p>
                  <p className="text-sm text-gray-500">{task.assignedTo?.email}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Assigned By</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                  {task.assignedBy?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{task.assignedBy?.name}</p>
                  <p className="text-sm text-gray-500">{task.assignedBy?.email}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Project</h3>
              <p className="text-gray-900">{task.projectId?.title}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Estimated Time</h3>
              <p className="text-gray-900">{task.estimatedTime} hours</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Created At</h3>
              <p className="text-gray-900">
                {new Date(task.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Approval Status</h3>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                task.approvalStatus === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800'
                  : task.approvalStatus === 'pending_teamlead'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {task.approvalStatus === 'pending_teamlead' 
                  ? 'Pending Team Lead' 
                  : task.approvalStatus.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {task.tags && task.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-4">
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={actionLoading}
            className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reject Task
          </button>
          <ApproveButton
            onClick={handleApprove}
            loading={actionLoading}
          />
        </div>
      </div>

      <RejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onReject={handleReject}
        loading={actionLoading}
        taskTitle={task.title}
      />
    </div>
    </DashboardLayout>
  );
};

export default ApprovalDetails;