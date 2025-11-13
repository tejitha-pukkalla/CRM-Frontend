import { useState } from 'react';
import AddTaskUpdate from './AddTaskUpdate';
import Avatar from '../../../components/common/Avatar';
import { formatDistanceToNow } from 'date-fns';

const TaskUpdates = ({ taskId, updates, onUpdateAdded }) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const getUpdateIcon = (type) => {
    switch (type) {
      case 'progress':
        return '📊';
      case 'issue':
        return '⚠️';
      case 'comment':
        return '💬';
      case 'file':
        return '📎';
      case 'completion':
        return '✅';
      default:
        return '📝';
    }
  };

  const getUpdateColor = (type) => {
    switch (type) {
      case 'progress':
        return 'bg-blue-50 border-blue-200';
      case 'issue':
        return 'bg-red-50 border-red-200';
      case 'comment':
        return 'bg-gray-50 border-gray-200';
      case 'file':
        return 'bg-purple-50 border-purple-200';
      case 'completion':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Update Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Task Updates</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {showAddForm ? '- Cancel' : '+ Add Update'}
        </button>
      </div>

      {/* Add Update Form */}
      {showAddForm && (
        <AddTaskUpdate
          taskId={taskId}
          onSuccess={() => {
            setShowAddForm(false);
            onUpdateAdded();
          }}
        />
      )}

      {/* Updates List */}
      {updates && updates.length > 0 ? (
        <div className="space-y-4">
          {updates.map((update) => (
            <div
              key={update._id}
              className={`border rounded-lg p-4 ${getUpdateColor(update.updateType)}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{getUpdateIcon(update.updateType)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar
                      src={update.userId?.profilePic}
                      name={update.userId?.name}
                      size="xs"
                    />
                    <span className="font-medium text-gray-800">
                      {update.userId?.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                    </span>
                    <span className="px-2 py-0.5 bg-white rounded text-xs font-medium capitalize">
                      {update.updateType}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{update.description}</p>
                  
                  {/* Attachments */}
                  {update.attachments && update.attachments.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {update.attachments.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          📎 Attachment {index + 1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No updates yet. Add your first update!
        </div>
      )}
    </div>
  );
};

export default TaskUpdates;