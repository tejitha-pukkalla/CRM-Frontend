import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layout/DashboardLayout';
import ProjectCard from './components/ProjectCard';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import { projectService } from '../../services/project.service';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../config/constants';

const ProjectsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
    limit: 9
  });

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await projectService.getAllProjects(filters);
      
      if (response.success) {
        setProjects(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const canCreateProject = [ROLES.SUPERADMIN, ROLES.TEAMLEAD].includes(user?.globalRole);

  const getStatusColor = (status) => {
    const colors = {
      'active': 'success',
      'completed': 'info',
      'on-hold': 'warning'
    };
    return colors[status] || 'default';
  };

  return (
    <DashboardLayout title="Projects">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Projects</h2>
          <p className="text-gray-600 mt-1">
            {pagination.total} total projects
          </p>
        </div>
        {canCreateProject && (
          <button
            onClick={() => navigate('/projects/create')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold flex items-center"
          >
            <span className="text-xl mr-2">+</span>
            Create Project
          </button>
        )}
      </div>

      {/* Filters & View Toggle */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search projects..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-48">
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => setFilters({
                status: '',
                search: '',
                page: 1,
                limit: 9
              })}
              className="px-4 py-2 text-gray-600 hover:text-purple-600 font-medium"
            >
              Clear
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md font-medium transition ${
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md font-medium transition ${
                viewMode === 'list'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Projects Display */}
      {loading ? (
        <LoadingSpinner message="Loading projects..." />
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Projects Found</h3>
          <p className="text-gray-600 mb-6">
            {filters.search || filters.status
              ? 'Try adjusting your filters'
              : canCreateProject
              ? 'Get started by creating your first project'
              : 'No projects assigned to you yet'}
          </p>
          {canCreateProject && (
            <button
              onClick={() => navigate('/projects/create')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              Create Project
            </button>
          )}
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onClick={() => navigate(`/projects/${project._id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="p-6 hover:bg-gray-50 cursor-pointer transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600">
                            Created by: <span className="font-medium">{project.createdBy?.name}</span>
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">
                            {new Date(project.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={getStatusColor(project.status)}>
                          {project.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {project.completionPercentage}% Complete
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default ProjectsList;
