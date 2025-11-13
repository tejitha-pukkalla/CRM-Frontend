// src/pages/Tasks/components/TaskTimeline.jsx
import { format } from 'date-fns';
import Avatar from '../../../components/common/Avatar';

const TaskTimeline = ({ timeLogs, task }) => {
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Create timeline events from task and time logs
  const timelineEvents = [];

  // Task created
  timelineEvents.push({
    type: 'created',
    date: task.createdAt,
    user: task.assignedBy,
    description: `Task created and assigned to ${task.assignedTo.name}`
  });

  // Task started
  if (task.startedAt) {
    timelineEvents.push({
      type: 'started',
      date: task.startedAt,
      user: task.assignedTo,
      description: 'Started working on task'
    });
  }

  // Time logs
  timeLogs?.forEach((log) => {
    timelineEvents.push({
      type: 'timelog',
      date: log.startTime,
      user: log.userId,
      description: `Worked for ${formatDuration(log.duration)}`,
      details: log.description,
      entryType: log.entryType
    });
  });

  // Task completed
  if (task.completedAt) {
    timelineEvents.push({
      type: 'completed',
      date: task.completedAt,
      user: task.assignedTo,
      description: 'Task completed'
    });
  }

  // Task reassigned
  if (task.reassignedAt) {
    timelineEvents.push({
      type: 'reassigned',
      date: task.reassignedAt,
      user: task.reassignedBy,
      description: `Task reassigned to ${task.assignedTo.name}`,
      reason: task.reassignmentReason
    });
  }

  // Sort by date (newest first)
  timelineEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

  const getEventIcon = (type) => {
    switch (type) {
      case 'created':
        return '🎯';
      case 'started':
        return '▶️';
      case 'timelog':
        return '⏱️';
      case 'completed':
        return '✅';
      case 'reassigned':
        return '🔄';
      default:
        return '📌';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'created':
        return 'bg-blue-100 border-blue-300';
      case 'started':
        return 'bg-green-100 border-green-300';
      case 'timelog':
        return 'bg-purple-100 border-purple-300';
      case 'completed':
        return 'bg-green-100 border-green-300';
      case 'reassigned':
        return 'bg-orange-100 border-orange-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Task Timeline</h3>

      {timelineEvents.length > 0 ? (
        <div className="space-y-4">
          {timelineEvents.map((event, index) => (
            <div key={index} className="flex gap-4">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getEventColor(event.type)}`}>
                  <span className="text-lg">{getEventIcon(event.type)}</span>
                </div>
                {index < timelineEvents.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                )}
              </div>

              {/* Event Content */}
              <div className="flex-1 pb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {event.user && (
                        <>
                          <Avatar
                            src={event.user.profilePic}
                            name={event.user.name}
                            size="xs"
                          />
                          <span className="font-medium text-gray-800">
                            {event.user.name}
                          </span>
                        </>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(new Date(event.date), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                  
                  <p className="text-gray-700">{event.description}</p>
                  
                  {event.details && (
                    <p className="text-sm text-gray-500 mt-1">{event.details}</p>
                  )}
                  
                  {event.reason && (
                    <div className="mt-2 p-2 bg-orange-50 rounded text-sm text-orange-700">
                      <strong>Reason:</strong> {event.reason}
                    </div>
                  )}

                  {event.entryType && (
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs capitalize">
                      {event.entryType} entry
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No timeline events yet.
        </div>
      )}
    </div>
  );
};

export default TaskTimeline;