// src/pages/Users/UsersList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layout/DashboardLayout';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import { userService } from '../../services/user.service';
import { useAuth } from '../../hooks/useAuth';
import { useDebounce } from '../../hooks/useDebounce';
import { ROLES } from '../../config/constants';

const UsersList = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null, userName: '' });

  // Filters
  const [filters, setFilters] = useState({
    role: '',
    department: '',
    isActive: 'true',
    search: '',
    page: 1,
    limit: 10
  });

  // Debounced search
  const debouncedSearch = useDebounce(filters.search, 500);

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    fetchUsers();
  }, [filters.role, filters.department, filters.isActive, debouncedSearch, filters.page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await userService.getAllUsers({
        ...filters,
        search: debouncedSearch
      });
      
      if (response.success) {
        setUsers(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      setError('Failed to load users');
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

  const handleRowClick = (user) => {
    navigate(`/users/${user._id}`);
  };

  const handleDeleteClick = (user, e) => {
    e.stopPropagation();
    setDeleteModal({ 
      isOpen: true, 
      userId: user._id,
      userName: user.name 
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await userService.deleteUser(deleteModal.userId);
      if (response.success) {
        fetchUsers();
      }
    } catch (err) {
      setError('Failed to deactivate user');
      console.error(err);
    }
  };

  const clearFilters = () => {
    setFilters({
      role: '',
      department: '',
      isActive: '',
      search: '',
      page: 1,
      limit: 10
    });
  };

  const getRoleBadgeVariant = (role) => {
    const variants = {
      superadmin: 'danger',
      teamlead: 'purple',
      projectlead: 'info',
      member: 'success'
    };
    return variants[role] || 'default';
  };

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      render: (user) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-purple-600 font-bold">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: 'globalRole',
      render: (user) => (
        <Badge variant={getRoleBadgeVariant(user.globalRole)}>
          {user.globalRole.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
        </Badge>
      )
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (user) => (
        <span className="text-gray-700">{user.department || 'N/A'}</span>
      )
    },
    {
      header: 'Phone',
      accessor: 'phone',
      render: (user) => (
        <span className="text-gray-700">{user.phone || 'N/A'}</span>
      )
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (user) => (
        <Badge variant={user.isActive ? 'success' : 'danger'}>
          {user.isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      render: (user) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/users/${user._id}/edit`);
            }}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm font-medium"
          >
            Edit
          </button>
          {currentUser.globalRole === ROLES.SUPERADMIN && user._id !== currentUser._id && (
            <button
              onClick={(e) => handleDeleteClick(user, e)}
              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm font-medium"
            >
              Delete
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">Manage system users and their roles</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/users/grid')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Grid View
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Name or email..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="superadmin">Superadmin</option>
              <option value="teamlead">Team Lead</option>
              <option value="projectlead">Project Lead</option>
              <option value="member">Member</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              placeholder="Department..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="isActive"
              value={filters.isActive}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-purple-600 font-medium"
        >
          Clear Filters
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Table 
              columns={columns} 
              data={users} 
              onRowClick={handleRowClick}
            />
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, userId: null, userName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Deactivate User"
        message={`Are you sure you want to deactivate ${deleteModal.userName}? They will no longer be able to access the system.`}
        confirmText="Deactivate"
        variant="danger"
      />
    </DashboardLayout>
  );
};

export default UsersList;