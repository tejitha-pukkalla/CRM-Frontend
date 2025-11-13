import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskForm from './components/TaskForm';
import taskService from '../../services/task.service';
import DashboardLayout from '../../layout/DashboardLayout';
import Toast from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTask(id);
      const taskData = response.data.task;
      
      // Format data for form
      const formattedData = {
        projectId: taskData.projectId._id,
        title: taskData.title,
        description: taskData.description,
        assignedTo: taskData.assignedTo._id,
        estimatedTime: taskData.estimatedTime,
        dueDate: taskData.dueDate.split('T')[0], // Format date for input
        priority: taskData.priority,
        tags: taskData.tags?.join(', ') || ''
      };
      
      setTask(formattedData);
    } catch (error) {
      setToast({
        show: true,
        message: error.response?.data?.message || 'Failed to fetch task',
        type: 'error'
      });
      setTimeout(() => navigate('/tasks'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (taskData) => {
    try {
      setSubmitting(true);
      await taskService.updateTask(id, taskData);
      
      setToast({
        show: true,
        message: 'Task updated successfully!',
        type: 'success'
      });

      setTimeout(() => {
        navigate(`/tasks/${id}`);
      }, 1500);
    } catch (error) {
      setToast({
        show: true,
        message: error.response?.data?.message || 'Failed to update task',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" text="Loading task..." />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 text-lg">Task not found</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/tasks/${id}`)}
          className="text-gray-600 hover:text-gray-800 mb-2"
        >
          ← Back to Task
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Edit Task</h1>
        <p className="text-gray-600 mt-1">Update task details</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <TaskForm
          initialData={task}
          onSubmit={handleSubmit}
          loading={submitting}
          onCancel={() => navigate(`/tasks/${id}`)}
          isEditMode={true}
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

export default EditTask;