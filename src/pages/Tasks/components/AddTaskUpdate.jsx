// src/pages/Tasks/components/AddTaskUpdate.jsx
import { useState } from 'react';
import TextArea from '../../../components/common/TextArea';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import taskService from '../../../services/task.service';

const AddTaskUpdate = ({ taskId, onSuccess }) => {
  const [formData, setFormData] = useState({
    updateType: 'progress',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      setError('Update description is required');
      return;
    }

    try {
      setLoading(true);
      await taskService.addTaskUpdate(taskId, formData);
      
      // Reset form
      setFormData({
        updateType: 'progress',
        description: ''
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="space-y-4">
        <Select
          label="Update Type"
          name="updateType"
          value={formData.updateType}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="progress">Progress Update</option>
          <option value="issue">Issue/Blocker</option>
          <option value="comment">Comment</option>
          <option value="file">File Attached</option>
        </Select>

        <TextArea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your update..."
          rows={4}
          error={error}
          disabled={loading}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Adding...' : 'Add Update'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddTaskUpdate;