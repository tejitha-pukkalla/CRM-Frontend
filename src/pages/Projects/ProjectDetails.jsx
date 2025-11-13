import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { projectService } from '../../services/project.service';
import { userService } from '../../services/user.service';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../config/constants';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [taskStats, setTaskStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add Member Modal
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [newMember, setNewMember] = useState({ userId: '', roleInProject: 'member' });
  const [addingMember, setAddingMember] = useState(false);

  const canManage = [ROLES.SUPERADMIN, ROLES.TEAMLEAD].includes(user?.globalRole);

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching project with ID:', id);
      const response = await projectService.getProject(id);
      
      console.log('Project response:', response);
      
      if (response.success) {
        setProject(response.data.project);
        setMembers(response.data.members || []);
        setTaskStats(response.data.taskStats || []);
      } else {
        setError(response.message || 'Failed to load project');
      }
    } catch (err) {
      console.error('Project fetch error:', err);
      console.error('Error response:', err.response);
      
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to load project details';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMemberClick = async () => {
    try {
      const response = await userService.getAllUsers({ isActive: 'true', limit: 100 });
      if (response.success) {
        // Filter out users already in project
        const memberUserIds = members.map(m => m.userId?._id).filter(Boolean);
        const filtered = response.data.filter(u => !memberUserIds.includes(u._id));
        setAvailableUsers(filtered);
      }
      setShowAddMemberModal(true);
    } catch (err) {
      console.error('Failed to load users:', err);
      alert('Failed to load users');
    }
  };

  const handleAddMember = async () => {
    if (!newMember.userId) {
      alert('Please select a user');
      return;
    }

    setAddingMember(true);
    try {
      const response = await projectService.addMember(id, newMember);
      if (response.success) {
        alert('Member added successfully');
        setShowAddMemberModal(false);
        setNewMember({ userId: '', roleInProject: 'member' });
        fetchProjectDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add member');
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      const response = await projectService.removeMember(id, userId);
      if (response.success) {
        alert('Member removed successfully');
        fetchProjectDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'success',
      'completed': 'info',
      'on-hold': 'warning'
    };
    return colors[status] || 'default';
  };

  const getRoleColor = (role) => {
    const colors = {
      'teamlead': 'purple',
      'projectlead': 'info',
      'member': 'success'
    };
    return colors[role] || 'default';
  };

  if (loading) {
    return (
      <DashboardLayout title="Project Details">
        <LoadingSpinner message="Loading project details..." />
      </DashboardLayout>
    );
  }

  if (error || !project) {
    return (
      <DashboardLayout title="Project Details">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/projects')}
            className="mb-6 flex items-center text-gray-600 hover:text-purple-600 font-medium"
          >
            ← Back to Projects
          </button>
          
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <h3 className="font-semibold mb-2">Error Loading Project</h3>
            <p>{error || 'Project not found'}</p>
            <button
              onClick={() => navigate('/projects')}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Go Back to Projects
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Project Details">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/projects')}
          className="mb-6 flex items-center text-gray-600 hover:text-purple-600 font-medium"
        >
          ← Back to Projects
        </button>

        {/* Project Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-12">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-3">{project.title}</h1>
                <p className="text-purple-100 text-lg mb-4">{project.description}</p>
                <div className="flex items-center gap-4">
                  <Badge variant={getStatusColor(project.status)} size="lg">
                    {project.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-white">
                    Created by: <span className="font-semibold">{project.createdBy?.name || 'Unknown'}</span>
                  </span>
                </div>
              </div>
              {canManage && (
                <button
                  onClick={() => navigate(`/projects/${id}/edit`)}
                  className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition font-semibold"
                >
                  Edit Project
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-8 py-6 bg-gray-50 border-b">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700 font-semibold">Project Progress</span>
              <span className="text-gray-900 font-bold text-lg">
                {project.completionPercentage || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all"
                style={{ width: `${project.completionPercentage || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Project Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{project.requirements}</p>
              </div>
            </div>

            {/* Documents */}
            {project.documents && project.documents.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Documents</h2>
                <div className="space-y-2">
                  {project.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                    >
                      <span className="text-2xl mr-3">📄</span>
                      <span className="text-purple-600 hover:underline">
                        Document {index + 1}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Task Statistics */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Task Statistics</h2>
              {taskStats.length === 0 ? (
                <p className="text-gray-500">No tasks created yet</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {taskStats.map((stat) => (
                    <div key={stat._id} className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1 capitalize">
                        {stat._id.replace('-', ' ')}
                      </p>
                      <p className="text-3xl font-bold text-purple-600">{stat.count}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Team Members */}
          <div className="space-y-6">
            {/* Project Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Project Info</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Start Date:</span>
                  <p className="font-medium text-gray-900">
                    {new Date(project.startDate).toLocaleDateString()}
                  </p>
                </div>
                {project.endDate && (
                  <div>
                    <span className="text-gray-600">End Date:</span>
                    <p className="font-medium text-gray-900">
                      {new Date(project.endDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Created:</span>
                  <p className="font-medium text-gray-900">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
                {canManage && (
                  <button
                    onClick={handleAddMemberClick}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition text-sm font-medium"
                  >
                    + Add
                  </button>
                )}
              </div>

              {members.length === 0 ? (
                <p className="text-gray-500 text-sm">No members assigned yet</p>
              ) : (
                <div className="space-y-3">
                  {members.map((member) => (
                    <div key={member._id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-purple-600 font-bold">
                            {member.userId?.name?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {member.userId?.name || 'Unknown User'}
                          </p>
                          <Badge variant={getRoleColor(member.roleInProject)} size="sm">
                            {member.roleInProject.replace('lead', ' Lead').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      {canManage && member.userId?._id && (
                        <button
                          onClick={() => handleRemoveMember(member.userId._id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        title="Add Team Member"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select User
            </label>
            <select
              value={newMember.userId}
              onChange={(e) => setNewMember(prev => ({ ...prev, userId: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              disabled={addingMember}
            >
              <option value="">Choose a user</option>
              {availableUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} - {u.globalRole}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role in Project
            </label>
            <select
              value={newMember.roleInProject}
              onChange={(e) => setNewMember(prev => ({ ...prev, roleInProject: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              disabled={addingMember}
            >
              <option value="teamlead">Team Lead</option>
              <option value="projectlead">Project Lead</option>
              <option value="member">Member</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowAddMemberModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              disabled={addingMember}
            >
              Cancel
            </button>
            <button
              onClick={handleAddMember}
              className={`flex-1 px-4 py-2 rounded-lg text-white transition ${
                addingMember ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
              }`}
              disabled={addingMember}
            >
              {addingMember ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default ProjectDetails;