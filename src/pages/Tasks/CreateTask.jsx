import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layout/DashboardLayout';
import TaskForm from './components/TaskForm';
import taskService from '../../services/task.service';
import Toast from '../../components/common/Toast';

const CreateTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const handleSubmit = async (taskData) => {
    try {
      setLoading(true);
      const response = await taskService.createTask(taskData);
      
      setToast({
        show: true,
        message: 'Task created successfully!',
        type: 'success'
      });

      setTimeout(() => {
        navigate('/tasks');
      }, 1500);
    } catch (error) {
      setToast({
        show: true,
        message: error.response?.data?.message || 'Failed to create task',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
    <div className="p-6 max-w-4xl mx-auto">
      <button
          onClick={() => navigate('/tasks')}
          className="mb-6 flex items-center text-gray-600 hover:text-purple-600 font-medium"
        >
          ← Back to Tasks
        </button>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Create New Task</h1>
        <p className="text-gray-600 mt-1">Assign a new task to a team member</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <TaskForm
          onSubmit={handleSubmit}
          loading={loading}
          onCancel={() => navigate('/tasks')}
        />
      </div>

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
    </DashboardLayout>
  );
};

export default CreateTask;