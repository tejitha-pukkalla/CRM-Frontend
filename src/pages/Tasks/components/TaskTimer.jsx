// src/pages/Tasks/components/TaskTimer.jsx
import { useState, useEffect } from 'react';
import taskService from '../../../services/task.service';
import Button from '../../../components/common/Button';

const TaskTimer = ({ taskId }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if there's a running timer in localStorage
    const savedTimer = localStorage.getItem(`timer_${taskId}`);
    if (savedTimer) {
      const { start, isActive } = JSON.parse(savedTimer);
      if (isActive) {
        setIsRunning(true);
        setStartTime(new Date(start));
      }
    }
  }, [taskId]);

  useEffect(() => {
    let interval;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now - startTime) / 1000); // seconds
        setElapsedTime(diff);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStart = async () => {
    try {
      setLoading(true);
      await taskService.startTimer(taskId);
      const now = new Date();
      setStartTime(now);
      setIsRunning(true);
      
      // Save to localStorage
      localStorage.setItem(`timer_${taskId}`, JSON.stringify({
        start: now.toISOString(),
        isActive: true
      }));
    } catch (error) {
      console.error('Error starting timer:', error);
      alert(error.response?.data?.message || 'Failed to start timer');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    try {
      setLoading(true);
      await taskService.stopTimer(taskId);
      setIsRunning(false);
      setStartTime(null);
      setElapsedTime(0);
      
      // Clear localStorage
      localStorage.removeItem(`timer_${taskId}`);
    } catch (error) {
      console.error('Error stopping timer:', error);
      alert(error.response?.data?.message || 'Failed to stop timer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Timer Display */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
        <div className="text-2xl font-mono font-bold text-gray-800">
          {formatTime(elapsedTime)}
        </div>
      </div>

      {/* Start/Stop Button */}
      {!isRunning ? (
        <Button
          onClick={handleStart}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700"
        >
          {loading ? 'Starting...' : '▶ Start Timer'}
        </Button>
      ) : (
        <Button
          onClick={handleStop}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700"
        >
          {loading ? 'Stopping...' : '⏸ Stop Timer'}
        </Button>
      )}
    </div>
  );
};

export default TaskTimer;