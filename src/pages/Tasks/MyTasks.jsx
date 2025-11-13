import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import taskService from '../../services/task.service';
import {useAuth} from '../../hooks/useAuth';
import TaskCard from './components/TaskCard';
import DashboardLayout from '../../layout/DashboardLayout';
import Spinner from '../../components/common/LoadingSpinner';

const MyTasks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchMyTasks();
  }, []);



  const fetchMyTasks = async () => {
  try {
    setLoading(true);
    // ✅ USE NEW API
    const response = await taskService.getMyTasks({
      limit: 100
    });
    setTasks(response.data);
  } catch (error) {
    console.error('Error fetching tasks:', error);
  } finally {
    setLoading(false);
  }
};

  const filterTasks = (status) => {
    switch (status) {
      case 'not-started':
        return tasks.filter(t => t.status === 'not-started');
      case 'in-progress':
        return tasks.filter(t => t.status === 'in-progress');
      case 'completed':
        return tasks.filter(t => t.status === 'completed');
      default:
        return tasks;
    }
  };

  const filteredTasks = filterTasks(activeFilter);

  const getStatusCount = (status) => {
    return tasks.filter(t => t.status === status).length;
  };

  const filters = [
    { id: 'all', label: 'All Tasks', count: tasks.length },
    { id: 'not-started', label: 'Not Started', count: getStatusCount('not-started') },
    { id: 'in-progress', label: 'In Progress', count: getStatusCount('in-progress') },
    { id: 'completed', label: 'Completed', count: getStatusCount('completed') }
  ];

  return (
    <DashboardLayout>
    <div className="p-6">
      <button
          onClick={() => navigate('/tasks')}
          className="mb-6 flex items-center text-gray-600 hover:text-purple-600 font-medium"
        >
          ← Back to Tasks
        </button>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
        <p className="text-gray-600 mt-1">Tasks assigned to you</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              activeFilter === filter.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-sm text-gray-600">{filter.label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{filter.count}</p>
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 text-lg">
            {activeFilter === 'all'
              ? 'No tasks assigned to you yet'
              : `No ${filters.find(f => f.id === activeFilter)?.label.toLowerCase()} tasks`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdate={fetchMyTasks}
            />
          ))}
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default MyTasks;