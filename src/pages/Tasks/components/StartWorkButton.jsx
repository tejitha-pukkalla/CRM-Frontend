// src/pages/Tasks/components/StartWorkButton.jsx
import { useState } from 'react';
import Button from '../../../components/common/Button';
import taskService from '../../../services/task.service';
import Toast from '../../../components/common/Toast';

const StartWorkButton = ({ task, onStart }) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const canStart = () => {
    // Already started
    if (task.status === 'in-progress') {
      return { allowed: false, reason: 'Task already in progress' };
    }

    // Already completed
    if (task.status === 'completed') {
      return { allowed: false, reason: 'Task already completed' };
    }

    // Cancelled task
    if (task.status === 'cancelled') {
      return { allowed: false, reason: 'Task is cancelled' };
    }

    // For Project Lead assigned tasks - must wait for Team Lead approval
    if (task.approvalStatus === 'pending_teamlead') {
      return { allowed: false, reason: 'Waiting for Team Lead approval' };
    }

    // For Team Lead assigned tasks - can start immediately (pending superadmin approval)
    // Approved tasks - can start
    return { allowed: true, reason: '' };
  };

  const handleStart = async () => {
    try {
      setLoading(true);
      await taskService.startTask(task._id);
      
      setToast({
        show: true,
        message: 'Task started successfully! Timer is running.',
        type: 'success'
      });

      if (onStart) {
        setTimeout(() => {
          onStart();
        }, 1000);
      }
    } catch (error) {
      setToast({
        show: true,
        message: error.response?.data?.message || 'Failed to start task',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const startCheck = canStart();

  return (
    <>
      <Button
        onClick={handleStart}
        disabled={!startCheck.allowed || loading}
        className={`${
          startCheck.allowed
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
        title={startCheck.reason}
      >
        {loading ? 'Starting...' : '▶ Start Work'}
      </Button>

      {!startCheck.allowed && (
        <p className="text-sm text-orange-600 mt-2">{startCheck.reason}</p>
      )}

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </>
  );
};

export default StartWorkButton;