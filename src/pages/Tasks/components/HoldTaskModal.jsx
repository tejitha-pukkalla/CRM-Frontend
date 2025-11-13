// src/pages/Tasks/components/HoldTaskModal.jsx
import { useState } from 'react';
import Modal from '../../../components/common/Modal';
import TextArea from '../../../components/common/TextArea';
import Button from '../../../components/common/Button';
import taskService from '../../../services/task.service';

const HoldTaskModal = ({ taskId, onClose, onHold }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleHold = async () => {
    try {
      setLoading(true);
      await taskService.holdTask(taskId, reason.trim() || null);
      
      if (onHold) {
        onHold();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to hold task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="⏸️ Put Task On Hold"
    >
      <div className="space-y-4">
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-orange-700">
                <strong>Putting this task on hold will:</strong>
              </p>
              <ul className="mt-2 text-sm text-orange-600 list-disc list-inside space-y-1">
                <li>Pause any running timer</li>
                <li>Change task status to "On Hold"</li>
                <li>Notify the task assigner</li>
                <li>Track hold duration separately</li>
              </ul>
            </div>
          </div>
        </div>

        <TextArea
          label="Reason for Hold (Optional)"
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setError('');
          }}
          placeholder="e.g., Waiting for client feedback, Blocked by another task, Urgent priority shift..."
          rows={4}
          disabled={loading}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
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
            onClick={handleHold}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {loading ? 'Holding...' : '⏸️ Hold Task'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default HoldTaskModal;