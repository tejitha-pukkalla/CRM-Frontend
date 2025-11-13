import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { projectService } from '../../services/project.service';
import { userService } from '../../services/user.service';

const CreateProject = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    documents: [],
    members: []
  });

  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await userService.getAllUsers({ isActive: 'true', limit: 100 });
      if (response.success) {
        setAvailableUsers(response.data);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      documents: files
    }));
  };

  const handleAddMember = () => {
    setSelectedMembers(prev => [
      ...prev,
      { userId: '', roleInProject: 'member' }
    ]);
  };

  const handleRemoveMember = (index) => {
    setSelectedMembers(prev => prev.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index, field, value) => {
    setSelectedMembers(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = 'Requirements are required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError('');
    setSuccessMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('requirements', formData.requirements);

      // Append documents
      formData.documents.forEach((file) => {
        formDataToSend.append('documents', file);
      });

      // Append members as JSON string
      formDataToSend.append('members', JSON.stringify(selectedMembers.filter(m => m.userId)));

      const response = await projectService.createProject(formDataToSend);

      if (response.success) {
        setSuccessMessage('Project created successfully!');
        setTimeout(() => {
          navigate('/projects');
        }, 2000);
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message || 
        'Failed to create project. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingUsers) {
    return (
      <DashboardLayout title="Create Project">
        <LoadingSpinner message="Loading..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Create Project">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/projects')}
          className="mb-6 flex items-center text-gray-600 hover:text-purple-600 font-medium"
        >
          ← Back to Projects
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Project
            </h1>
            <p className="text-gray-600">
              Fill in the project details and assign team members
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                ✓ {successMessage}
              </div>
            )}

            {/* Error Message */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {apiError}
              </div>
            )}

            {/* Project Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter project title"
                disabled={loading}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Describe the project..."
                disabled={loading}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.requirements ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="List project requirements..."
                disabled={loading}
              />
              {errors.requirements && <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>}
            </div>

            {/* Documents Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Documents
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={loading}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
              />
              <p className="mt-1 text-xs text-gray-500">
                Accepted: JPG, PNG, PDF, DOC, DOCX, XLS, XLSX (Max 10 files)
              </p>
              {formData.documents.length > 0 && (
                <div className="mt-2 space-y-1">
                  {formData.documents.map((file, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      📎 {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Team Members */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Assign Team Members
                </label>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition font-medium text-sm"
                >
                  + Add Member
                </button>
              </div>

              {selectedMembers.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">No members added yet</p>
                  <p className="text-sm text-gray-400 mt-1">Click "Add Member" to assign team members</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedMembers.map((member, index) => (
                    <div key={index} className="flex gap-3 items-start bg-gray-50 p-4 rounded-lg">
                      <div className="flex-1">
                        <select
                          value={member.userId}
                          onChange={(e) => handleMemberChange(index, 'userId', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-2"
                          disabled={loading}
                        >
                          <option value="">Select User</option>
                          {availableUsers.map((user) => (
                            <option key={user._id} value={user._id}>
                              {user.name} - {user.globalRole}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-48">
                        <select
                          value={member.roleInProject}
                          onChange={(e) => handleMemberChange(index, 'roleInProject', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          disabled={loading}
                        >
                          <option value="teamlead">Team Lead</option>
                          <option value="projectlead">Project Lead</option>
                          <option value="member">Member</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(index)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                        disabled={loading}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/projects')}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition ${
                  loading
                    ? 'bg-purple-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateProject;
