import { useState, useEffect } from 'react';
import timeLogService from '../../../services/timeLog.service';
import Button from '../../../components/common/Button';

const TaskTimer = ({ taskId, taskStatus, onTimerChange }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [pauseTime, setPauseTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pausedDuration, setPausedDuration] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if there's a running timer in localStorage
    const savedTimer = localStorage.getItem(`timer_${taskId}`);
    if (savedTimer) {
      const { start, isActive, paused, pauseStart, pausedTime } = JSON.parse(savedTimer);
      if (isActive) {
        setIsRunning(true);
        setStartTime(new Date(start));
        if (paused) {
          setIsPaused(true);
          setPauseTime(new Date(pauseStart));
          setPausedDuration(pausedTime || 0);
        }
      }
    }
  }, [taskId]);

  useEffect(() => {
    let interval;
    if (isRunning && !isPaused && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now - startTime) / 1000) - pausedDuration; // seconds
        setElapsedTime(Math.max(0, diff));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, startTime, pausedDuration]);

  // Calculate paused time
  useEffect(() => {
    let interval;
    if (isPaused && pauseTime) {
      interval = setInterval(() => {
        const now = new Date();
        const pausedSeconds = Math.floor((now - pauseTime) / 1000);
        // Update display but don't add to elapsed time
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, pauseTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStart = async () => {
    try {
      setLoading(true);
      await timeLogService.startTimer(taskId);
      const now = new Date();
      setStartTime(now);
      setIsRunning(true);
      setIsPaused(false);
      setPausedDuration(0);
      
      localStorage.setItem(`timer_${taskId}`, JSON.stringify({
        start: now.toISOString(),
        isActive: true,
        paused: false,
        pausedTime: 0
      }));

      if (onTimerChange) onTimerChange();
    } catch (error) {
      console.error('Error starting timer:', error);
      alert(error.message || 'Failed to start timer');
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    try {
      setLoading(true);
      const reason = prompt('Reason for pause (optional):');
      await timeLogService.pauseTimer(taskId, reason);
      
      const now = new Date();
      setPauseTime(now);
      setIsPaused(true);
      
      const savedTimer = JSON.parse(localStorage.getItem(`timer_${taskId}`));
      localStorage.setItem(`timer_${taskId}`, JSON.stringify({
        ...savedTimer,
        paused: true,
        pauseStart: now.toISOString(),
        pausedTime: pausedDuration
      }));

      if (onTimerChange) onTimerChange();
    } catch (error) {
      console.error('Error pausing timer:', error);
      alert(error.message || 'Failed to pause timer');
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    try {
      setLoading(true);
      await timeLogService.resumeTimer(taskId);
      
      // Calculate pause duration
      if (pauseTime) {
        const pauseDuration = Math.floor((new Date() - pauseTime) / 1000);
        setPausedDuration(prev => prev + pauseDuration);
      }
      
      setIsPaused(false);
      setPauseTime(null);
      
      const savedTimer = JSON.parse(localStorage.getItem(`timer_${taskId}`));
      localStorage.setItem(`timer_${taskId}`, JSON.stringify({
        ...savedTimer,
        paused: false,
        pauseStart: null,
        pausedTime: pausedDuration + (pauseTime ? Math.floor((new Date() - pauseTime) / 1000) : 0)
      }));

      if (onTimerChange) onTimerChange();
    } catch (error) {
      console.error('Error resuming timer:', error);
      alert(error.message || 'Failed to resume timer');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    try {
      setLoading(true);
      await timeLogService.stopTimer(taskId);
      setIsRunning(false);
      setIsPaused(false);
      setStartTime(null);
      setPauseTime(null);
      setElapsedTime(0);
      setPausedDuration(0);
      
      localStorage.removeItem(`timer_${taskId}`);
      if (onTimerChange) onTimerChange();
    } catch (error) {
      console.error('Error stopping timer:', error);
      alert(error.message || 'Failed to stop timer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Timer Display */}
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${
          isPaused ? 'bg-orange-500 animate-pulse' : 
          isRunning ? 'bg-green-500 animate-pulse' : 
          'bg-gray-300'
        }`}></div>
        <div className="text-2xl font-mono font-bold text-gray-800">
          {formatTime(elapsedTime)}
        </div>
        {isPaused && (
          <span className="text-sm text-orange-600 font-semibold animate-pulse">
            ⏸️ PAUSED
          </span>
        )}
      </div>

      {/* Timer Controls */}
      <div className="flex gap-2">
        {!isRunning ? (
          <Button
            onClick={handleStart}
            disabled={loading || taskStatus === 'on-hold'}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Starting...' : '▶️ Start Timer'}
          </Button>
        ) : (
          <>
            {!isPaused ? (
              <>
                <Button
                  onClick={handlePause}
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {loading ? 'Pausing...' : '⏸️ Pause'}
                </Button>
                <Button
                  onClick={handleStop}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {loading ? 'Stopping...' : '⏹️ Stop'}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleResume}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Resuming...' : '▶️ Resume'}
                </Button>
                <Button
                  onClick={handleStop}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {loading ? 'Stopping...' : '⏹️ Stop'}
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskTimer;
