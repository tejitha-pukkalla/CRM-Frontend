// frontend/src/pages/Profile/MyProfile.jsx - NEW FILE

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { profileService } from '../../services/profile.services';

const MyProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile();
      if (response.success) {
        setUser(response.data.user);
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardLayout title="My Profile">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="My Profile">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Profile">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mr-6">
                  {user?.profilePic ? (
                    <img 
                      src={user.profilePic} 
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-purple-600">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{user?.name}</h1>
                  <p className="text-purple-100 text-lg">{user?.email}</p>
                  {user?.employeeId && (
                    <p className="text-purple-200 text-sm mt-1">
                      Employee ID: {user.employeeId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="px-8 py-6">
            {/* Quick Actions */}
            <div className="mb-6 flex gap-4">
              <button
                onClick={() => navigate('/profile/edit')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
              <button
                onClick={() => navigate('/profile/change-password')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Change Password
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <Badge variant="purple" size="lg">
                  {user?.globalRole?.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
                </Badge>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department
                </label>
                <p className="text-gray-900 text-lg">{user?.department || 'N/A'}</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <p className="text-gray-900 text-lg">{user?.phone || 'N/A'}</p>
              </div>

              {/* Employee ID */}
              {user?.employeeId && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Employee ID
                  </label>
                  <p className="text-gray-900 text-lg">{user.employeeId}</p>
                </div>
              )}

              {/* Gender */}
              {user?.gender && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender
                  </label>
                  <p className="text-gray-900 text-lg">{user.gender}</p>
                </div>
              )}

              {/* Date of Birth */}
              {user?.dateOfBirth && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <p className="text-gray-900 text-lg">{formatDate(user.dateOfBirth)}</p>
                </div>
              )}

              {/* Date of Joining */}
              {user?.dateOfJoining && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Joining
                  </label>
                  <p className="text-gray-900 text-lg">{formatDate(user.dateOfJoining)}</p>
                </div>
              )}

              {/* Account Created */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Account Created
                </label>
                <p className="text-gray-900 text-lg">
                  {formatDate(user?.createdAt)}
                </p>
              </div>
            </div>

            {/* Address - Full Width */}
            {user?.address && (
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <p className="text-gray-900 text-lg">{user.address}</p>
              </div>
            )}

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> You can edit your personal information (name, gender, date of birth, address, phone) from the Edit Profile page. 
                    Your email, role, department, and employee ID can only be changed by administrators.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyProfile;