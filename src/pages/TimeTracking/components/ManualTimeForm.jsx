
import { useState, useEffect } from 'react';
import taskService from '../../../services/task.service';

const ManualTimeForm = ({ onSubmit, loading, initialTaskId }) => {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [formData, setFormData] = useState({
    taskId: initialTaskId || '',
    startTime: '',
    endTime: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUserTasks();
  }, []);

//   const fetchUserTasks = async () => {
//     try {
//       setLoadingTasks(true);
//       // Backend filters tasks for members automatically
//       const response = await taskService.getMyTasks();
//       console.log('Tasks fetched:', response);
      
//       // Handle different response structures
//       const tasksData = response.data?.tasks || response.data || [];
//       setTasks(tasksData);
//     } catch (err) {
//       console.error('Failed to fetch tasks:', err);
//       setErrors({ fetch: 'Failed to load tasks. Please refresh the page.' });
//     } finally {
//       setLoadingTasks(false);
//     }
//   };




const fetchUserTasks = async () => {
  try {
    setLoadingTasks(true);
    // ✅ UPDATED - Get MY tasks (works for member, projectlead, teamlead)
    const response = await taskService.getMyTasks({
      limit: 100
    });
    console.log('Tasks fetched:', response);
    
    // Handle different response structures
    const tasksData = response.data?.tasks || response.data || [];
    setTasks(tasksData);
  } catch (err) {
    console.error('Failed to fetch tasks:', err);
    setErrors({ fetch: 'Failed to load tasks. Please refresh the page.' });
  } finally {
    setLoadingTasks(false);
  }
};




  const validateForm = () => {
    const newErrors = {};

    if (!formData.taskId) newErrors.taskId = 'Please select a task';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';

    if (formData.startTime && formData.endTime) {
      if (new Date(formData.endTime) <= new Date(formData.startTime)) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.fetch && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errors.fetch}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task <span className="text-red-500">*</span>
        </label>
        {loadingTasks ? (
          <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
            Loading tasks...
          </div>
        ) : (
          <select
            value={formData.taskId}
            onChange={(e) => handleChange('taskId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.taskId ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={tasks.length === 0}
          >
            <option value="">
              {tasks.length === 0 ? 'No tasks available' : 'Select a task...'}
            </option>
            {tasks.map((task) => (
              <option key={task._id} value={task._id}>
                {task.title} {task.projectId?.title ? `- ${task.projectId.title}` : ''}
              </option>
            ))}
          </select>
        )}
        {errors.taskId && (
          <p className="mt-1 text-sm text-red-600">{errors.taskId}</p>
        )}
        {tasks.length === 0 && !loadingTasks && (
          <p className="mt-1 text-sm text-gray-500">
            No tasks assigned to you. You need to have tasks assigned before adding time entries.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => handleChange('startTime', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.startTime ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.startTime && (
            <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) => handleChange('endTime', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.endTime ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.endTime && (
            <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="What did you work on?"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || tasks.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Adding...
            </>
          ) : (
            'Add Time Entry'
          )}
        </button>
      </div>
    </form>
  );
};

export default ManualTimeForm;