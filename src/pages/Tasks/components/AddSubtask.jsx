// src/pages/Tasks/components/AddSubtask.jsx
import { useState } from 'react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import taskService from '../../../services/task.service';

const AddSubtask = ({ taskId, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Subtask title is required');
      return;
    }

    try {
      setLoading(true);
      await taskService.addSubtask(taskId, { title: title.trim() });
      
      // Reset form
      setTitle('');
      setError('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add subtask');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError('');
            }}
            placeholder="Enter subtask title..."
            error={error}
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !title.trim()}
          className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
        >
          {loading ? 'Adding...' : 'Add Subtask'}
        </Button>
      </div>
    </form>
  );
};

export default AddSubtask;