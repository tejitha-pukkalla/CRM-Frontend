import React from 'react';
import Badge from '../../../components/common/Badge';

const ProjectCard = ({ project, onClick }) => {
  const getStatusColor = (status) => {
    const colors = {
      'active': 'success',
      'completed': 'info',
      'on-hold': 'warning'
    };
    return colors[status] || 'default';
  };

  const getProgressColor = (percentage) => {
    if (percentage < 30) return 'bg-red-500';
    if (percentage < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold group-hover:underline">
            {project.title}
          </h3>
          <Badge variant={getStatusColor(project.status)} size="sm">
            {project.status.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>
        <p className="text-purple-100 text-sm line-clamp-2">
          {project.description}
        </p>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 font-medium">Progress</span>
            <span className="text-gray-900 font-bold">
              {project.completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`${getProgressColor(project.completionPercentage)} h-3 rounded-full transition-all`}
              style={{ width: `${project.completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Created by:</span>
            <span className="font-medium text-gray-900">
              {project.createdBy?.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Start Date:</span>
            <span className="text-gray-900">
              {new Date(project.startDate).toLocaleDateString()}
            </span>
          </div>
          {project.endDate && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">End Date:</span>
              <span className="text-gray-900">
                {new Date(project.endDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

