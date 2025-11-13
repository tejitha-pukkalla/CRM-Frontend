// src/pages/Tasks/components/CompleteTaskModal.jsx
import { useState } from 'react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import taskService from '../../../services/task.service';

const CompleteTaskModal = ({ taskId, onClose, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleComplete = async () => {
    try {
      setLoading(true);
      await taskService.completeTask(taskId);
      
      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Complete Task"
    >
      <div className="space-y-4">
        <p className="text-gray-700">
          Are you sure you want to mark this task as completed? This will:
        </p>
        
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Stop any running timers</li>
          <li>Record the actual time spent</li>
          <li>Notify the task assigner</li>
          <li>Update the task status to "Completed"</li>
        </ul>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            onClick={onClose}
            disabled={loading}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleComplete}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Completing...' : '✓ Complete Task'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CompleteTaskModal;