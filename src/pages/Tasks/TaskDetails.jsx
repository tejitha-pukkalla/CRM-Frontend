import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import taskService from '../../services/task.service';
import {useAuth} from '../../hooks/useAuth';
import DashboardLayout from '../../layout/DashboardLayout';
import TaskStatusBadge from './components/TaskStatusBadge';
import TaskPriorityBadge from './components/TaskPriorityBadge';
import TaskApprovalStatus from './components/TaskApprovalStatus';
import StartWorkButton from './components/StartWorkButton';
import TaskTimer from './components/TaskTimer';
import TaskUpdates from './components/TaskUpdates';
import TaskSubtasks from './components/TaskSubtasks';
import TaskTimeline from './components/TaskTimeline';
import CompleteTaskModal from './components/CompleteTaskModal';
import ReassignModal from './components/ReassignModal';
import Spinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import { format } from 'date-fns';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTask(id);
      setTaskData(response.data);
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!taskData) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Task not found</p>
      </div>
    );
  }

  const { task, updates, subtasks, timeLogs, totalTimeSpent } = taskData;
  const isAssignedToMe = task.assignedTo._id === user._id;
  const canReassign = ['superadmin', 'teamlead', 'projectlead'].includes(user.globalRole);
  const canEdit = task.assignedBy._id === user._id || user.globalRole === 'superadmin';

  return (
    <DashboardLayout>
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => navigate('/tasks')}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back
              </button>
              <h1 className="text-3xl font-bold text-gray-800">{task.title}</h1>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <TaskStatusBadge status={task.status} />
              <TaskApprovalStatus approvalStatus={task.approvalStatus} />
              <TaskPriorityBadge priority={task.priority} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {canEdit && (
              <Button
                onClick={() => navigate(`/tasks/${task._id}/edit`)}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Edit
              </Button>
            )}
            {canReassign && (
              <Button
                onClick={() => setShowReassignModal(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Reassign
              </Button>
            )}
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-gray-500">Project</p>
            <p className="font-medium text-gray-800">{task.projectId.title}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Assigned To</p>
            <div className="flex items-center gap-2 mt-1">
              <Avatar
                src={task.assignedTo.profilePic}
                name={task.assignedTo.name}
                size="xs"
              />
              <p className="font-medium text-gray-800">{task.assignedTo.name}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Due Date</p>
            <p className="font-medium text-gray-800">
              {format(new Date(task.dueDate), 'MMM dd, yyyy')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Time</p>
            <p className="font-medium text-gray-800">
              {Math.round(totalTimeSpent / 60)}h / {task.estimatedTime}h
            </p>
          </div>
        </div>
      </div>

      {/* Timer & Actions (for assigned member) */}
      {isAssignedToMe && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <TaskTimer taskId={task._id} />
            <div className="flex gap-3">
              <StartWorkButton
                task={task}
                onStart={fetchTaskDetails}
              />
              {task.status === 'in-progress' && (
                <Button
                  onClick={() => setShowCompleteModal(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Mark Complete
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <div className="flex gap-6 px-6">
            {['overview', 'updates', 'subtasks', 'timeline'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 border-b-2 font-medium capitalize ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
              </div>

              {task.tags && task.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {task.attachments && task.attachments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Attachments</h3>
                  <div className="space-y-2">
                    {task.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        📎 {attachment.fileName}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'updates' && (
            <TaskUpdates
              taskId={task._id}
              updates={updates}
              onUpdateAdded={fetchTaskDetails}
            />
          )}

          {activeTab === 'subtasks' && (
            <TaskSubtasks
              taskId={task._id}
              subtasks={subtasks}
              onSubtaskChanged={fetchTaskDetails}
            />
          )}

          {activeTab === 'timeline' && (
            <TaskTimeline timeLogs={timeLogs} task={task} />
          )}
        </div>
      </div>

      {/* Modals */}
      {showCompleteModal && (
        <CompleteTaskModal
          taskId={task._id}
          onClose={() => setShowCompleteModal(false)}
          onComplete={() => {
            setShowCompleteModal(false);
            fetchTaskDetails();
          }}
        />
      )}

      {showReassignModal && (
        <ReassignModal
          task={task}
          onClose={() => setShowReassignModal(false)}
          onReassign={() => {
            setShowReassignModal(false);
            fetchTaskDetails();
          }}
        />
      )}
    </div>
    </DashboardLayout>
  );
};

export default TaskDetails;