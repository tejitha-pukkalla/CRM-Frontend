// src/pages/Tasks/components/TaskFilters.jsx
import React from 'react';
import Select from '../../../components/common/Select';

const TaskFilters = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const handleReset = () => {
    onFilterChange({
      status: '',
      priority: '',
      approvalStatus: '',
      projectId: ''
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select
          label="Status"
          name="status"
          value={filters.status}
          onChange={handleChange}
        >
          <option value="">All Status</option>
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Select>

        <Select
          label="Priority"
          name="priority"
          value={filters.priority}
          onChange={handleChange}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>

        <Select
          label="Approval Status"
          name="approvalStatus"
          value={filters.approvalStatus}
          onChange={handleChange}
        >
          <option value="">All Approvals</option>
          <option value="pending">Pending SA</option>
          <option value="pending_teamlead">Pending TL</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </Select>

        <div className="flex items-end">
          <button
            onClick={handleReset}
            className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;