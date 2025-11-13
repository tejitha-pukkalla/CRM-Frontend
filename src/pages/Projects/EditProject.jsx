import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { projectService } from '../../services/project.service';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    status: 'active',
    completionPercentage: 0
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setApiError('');
      
      console.log('Fetching project for edit, ID:', id);
      const response = await projectService.getProject(id);
      
      console.log('Project data:', response);
      
      if (response.success && response.data.project) {
        const project = response.data.project;
        setFormData({
          title: project.title || '',
          description: project.description || '',
          requirements: project.requirements || '',
          status: project.status || 'active',
          completionPercentage: project.completionPercentage || 0
        });
      } else {
        setApiError('Failed to load project details');
      }
    } catch (err) {
      console.error('Fetch project error:', err);
      console.error('Error response:', err.response);
      
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to load project details';
      setApiError(errorMessage);
    } finally {
      setLoading(false);
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

    const completion = parseInt(formData.completionPercentage);
    if (isNaN(completion) || completion < 0 || completion > 100) {
      newErrors.completionPercentage = 'Completion must be between 0 and 100';
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

    setSubmitting(true);
    setApiError('');
    setSuccessMessage('');

    try {
      const response = await projectService.updateProject(id, formData);

      if (response.success) {
        setSuccessMessage('Project updated successfully!');
        setTimeout(() => {
          navigate(`/projects/${id}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Update error:', error);
      setApiError(
        error.response?.data?.message || 
        'Failed to update project. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Edit Project">
        <LoadingSpinner message="Loading project..." />
      </DashboardLayout>
    );
  }

  if (apiError && !formData.title) {
    return (
      <DashboardLayout title="Edit Project">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/projects')}
            className="mb-6 flex items-center text-gray-600 hover:text-purple-600 font-medium"
          >
            ← Back to Projects
          </button>
          
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <h3 className="font-semibold mb-2">Error Loading Project</h3>
            <p>{apiError}</p>
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
    <DashboardLayout title="Edit Project">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/projects/${id}`)}
          className="mb-6 flex items-center text-gray-600 hover:text-purple-600 font-medium"
        >
          ← Back to Project Details
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit Project
            </h1>
            <p className="text-gray-600">
              Update project information
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

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                  errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={submitting}
                placeholder="Enter project title"
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                  errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={submitting}
                placeholder="Describe the project..."
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                  errors.requirements ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={submitting}
                placeholder="List project requirements..."
              />
              {errors.requirements && <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>}
            </div>

            {/* Status and Completion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  disabled={submitting}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Completion Percentage
                </label>
                <input
                  type="number"
                  name="completionPercentage"
                  value={formData.completionPercentage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    errors.completionPercentage ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={submitting}
                  placeholder="0-100"
                />
                {errors.completionPercentage && (
                  <p className="mt-1 text-sm text-red-600">{errors.completionPercentage}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/projects/${id}`)}
                disabled={submitting}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition ${
                  submitting ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {submitting ? 'Updating...' : 'Update Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditProject;