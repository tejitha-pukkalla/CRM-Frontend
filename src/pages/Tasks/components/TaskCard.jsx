// src/pages/Tasks/components/TaskCard.jsx
import { useNavigate } from 'react-router-dom';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityBadge from './TaskPriorityBadge';
import TaskApprovalStatus from './TaskApprovalStatus';
import Avatar from '../../../components/common/Avatar';
import { formatDistanceToNow } from 'date-fns';

const TaskCard = ({ task, onUpdate }) => {
  const navigate = useNavigate();

  const getDueDateColor = () => {
    if (task.status === 'completed') return 'text-green-600';
    
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'text-red-600';
    if (diffDays <= 2) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div
      onClick={() => navigate(`/tasks/${task._id}`)}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-5 border border-gray-200"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {task.title}
        </h3>
        <TaskPriorityBadge priority={task.priority} />
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {task.description}
      </p>

      {/* Status & Approval */}
      <div className="flex gap-2 mb-4">
        <TaskStatusBadge status={task.status} />
        <TaskApprovalStatus approvalStatus={task.approvalStatus} />
      </div>

      {/* Project */}
      <div className="text-sm text-gray-500 mb-3">
        <span className="font-medium">Project:</span> {task.projectId?.title}
      </div>

      {/* Assigned Info */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar
          src={task.assignedTo?.profilePic}
          name={task.assignedTo?.name}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">
            {task.assignedTo?.name}
          </p>
          <p className="text-xs text-gray-500">
            Assigned by {task.assignedBy?.name}
          </p>
        </div>
      </div>

      {/* Time Info */}
      <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
        <div>
          <span className="font-medium">Est:</span> {task.estimatedTime}h
          {task.actualTime > 0 && (
            <span className="ml-2">
              <span className="font-medium">Actual:</span> {Math.round(task.actualTime / 60)}h
            </span>
          )}
        </div>
        <div className={getDueDateColor()}>
          Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
        </div>
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="px-2 py-1 text-gray-500 text-xs">
              +{task.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;