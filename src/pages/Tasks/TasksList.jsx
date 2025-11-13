import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import taskService from '../../services/task.service';
import DashboardLayout from '../../layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';  
import TaskCard from './components/TaskCard';
import TaskFilters from './components/TaskFilters';
import Spinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';

const TasksList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    approvalStatus: '',
    projectId: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAllTasks(filters);
      setTasks(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const canCreateTask = ['superadmin', 'teamlead', 'projectlead'].includes(user?.globalRole);

  return (
    <DashboardLayout>
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage and track all tasks</p>
        </div>
        {canCreateTask && (
          <Button
            onClick={() => navigate('/tasks/create')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            + Create Task
          </Button>
        )}
      </div>

      {/* Filters */}
      <TaskFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Tasks List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tasks found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={fetchTasks}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="px-4 py-2"
              >
                Previous
              </Button>
              <span className="text-gray-600">
                Page {filters.page} of {pagination.totalPages}
              </span>
              <Button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === pagination.totalPages}
                className="px-4 py-2"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
    </DashboardLayout>
  );
};

export default TasksList;