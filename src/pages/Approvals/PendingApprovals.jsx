import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import approvalService from '../../services/approval.service';
import DashboardLayout from '../../layout/DashboardLayout';
import ApprovalCard from './components/ApprovalCard';
import ApprovalFilters from './components/ApprovalFilters';
import Spinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

const PendingApprovals = () => {
  const navigate = useNavigate();
  const [approvals, setApprovals] = useState([]);
  const [filteredApprovals, setFilteredApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priority: '',
    project: '',
    search: ''
  });

  useEffect(() => {
    fetchApprovals();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, approvals]);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const data = await approvalService.getPendingApprovals();
      setApprovals(data.data.tasks || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch approvals');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...approvals];

    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.project) {
      filtered = filtered.filter(task => 
        task.projectId?._id === filters.project
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title?.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.assignedTo?.name?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredApprovals(filtered);
  };

  const handleApprove = async (taskId) => {
    try {
      await approvalService.approveTask(taskId);
      fetchApprovals();
    } catch (err) {
      setError(err.message || 'Failed to approve task');
    }
  };

  const handleReject = async (taskId, reason) => {
    try {
      await approvalService.rejectTask(taskId, reason);
      fetchApprovals();
    } catch (err) {
      setError(err.message || 'Failed to reject task');
    }
  };

  const handleViewDetails = (taskId) => {
    navigate(`/approvals/${taskId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Approvals</h1>
        <p className="text-gray-600">
          Review and approve tasks assigned by team members
        </p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <ApprovalFilters
        filters={filters}
        onFilterChange={setFilters}
        projects={[...new Set(approvals.map(a => a.projectId).filter(Boolean))]}
      />

      <div className="mt-6">
        {filteredApprovals.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Pending Approvals
            </h3>
            <p className="text-gray-600">
              All tasks have been reviewed. Check back later for new approvals.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredApprovals.length} of {approvals.length} tasks
              </p>
            </div>
            {filteredApprovals.map((task) => (
              <ApprovalCard
                key={task._id}
                task={task}
                onApprove={handleApprove}
                onReject={handleReject}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
  );
};

export default PendingApprovals;