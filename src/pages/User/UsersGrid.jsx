// src/pages/Users/UsersGrid.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layout/DashboardLayout';
import UserCard from './components/UserCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import { userService } from '../../services/user.service';
import { useAuth } from '../../hooks/useAuth';
import { useDebounce } from '../../hooks/useDebounce';
import { ROLES } from '../../config/constants';

const UsersGrid = () => {
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
    search: ''
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    fetchUsers();
  }, [filters.role, filters.department, filters.isActive, debouncedSearch]);

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
      [name]: value
    }));
  };

  const handleEdit = (userId) => {
    navigate(`/users/${userId}/edit`);
  };

  const handleDeleteClick = (userId, userName) => {
    setDeleteModal({ isOpen: true, userId, userName });
  };

  const handleDeleteConfirm = async () => {
    try {
      await userService.deleteUser(deleteModal.userId);
      fetchUsers();
    } catch (err) {
      setError('Failed to deactivate user');
      console.error(err);
    }
  };

  const clearFilters = () => {
    setFilters({
      role: '',
      department: '',
      isActive: 'true',
      search: ''
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">{users.length} users found</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/users')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            List View
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

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        ) : (
          users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onEdit={handleEdit}
              onDelete={(userId) => handleDeleteClick(userId, user.name)}
              canDelete={currentUser.globalRole === ROLES.SUPERADMIN && user._id !== currentUser._id}
            />
          ))
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

export default UsersGrid;