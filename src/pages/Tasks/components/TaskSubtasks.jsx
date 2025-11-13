// src/pages/Tasks/components/TaskSubtasks.jsx
import { useState } from 'react';
import AddSubtask from './AddSubtask';
import taskService from '../../../services/task.service';
import { format } from 'date-fns';

const TaskSubtasks = ({ taskId, subtasks, onSubtaskChanged }) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggle = async (subtaskId) => {
    try {
      await taskService.toggleSubtask(taskId, subtaskId);
      onSubtaskChanged();
    } catch (error) {
      console.error('Error toggling subtask:', error);
      alert('Failed to update subtask');
    }
  };

  const completedCount = subtasks?.filter(s => s.isCompleted).length || 0;
  const totalCount = subtasks?.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Subtasks</h3>
            <p className="text-sm text-gray-500">
              {completedCount} of {totalCount} completed
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {showAddForm ? '- Cancel' : '+ Add Subtask'}
          </button>
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Add Subtask Form */}
      {showAddForm && (
        <AddSubtask
          taskId={taskId}
          onSuccess={() => {
            setShowAddForm(false);
            onSubtaskChanged();
          }}
        />
      )}

      {/* Subtasks List */}
      {subtasks && subtasks.length > 0 ? (
        <div className="space-y-2">
          {subtasks.map((subtask) => (
            <div
              key={subtask._id}
              className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${
                subtask.isCompleted
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={subtask.isCompleted}
                onChange={() => handleToggle(subtask._id)}
                className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
              />

              {/* Content */}
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    subtask.isCompleted
                      ? 'line-through text-gray-500'
                      : 'text-gray-800'
                  }`}
                >
                  {subtask.title}
                </p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <span>
                    Created by {subtask.createdBy?.name}
                  </span>
                  {subtask.isCompleted && subtask.completedAt && (
                    <span>
                      Completed on {format(new Date(subtask.completedAt), 'MMM dd, yyyy')}
                    </span>
                  )}
                </div>
              </div>

              {/* Status Icon */}
              {subtask.isCompleted && (
                <span className="text-green-600 text-xl">✓</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No subtasks yet. Break down this task into smaller steps!
        </div>
      )}
    </div>
  );
};

export default TaskSubtasks;