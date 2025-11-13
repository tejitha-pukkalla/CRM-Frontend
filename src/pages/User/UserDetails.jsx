// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import DashboardLayout from '../../layout/DashboardLayout';
// import Badge from '../../components/common/Badge';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import { userService } from '../../services/user.service';

// const UserDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchUserDetails();
//   }, [id]);

//   const fetchUserDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await userService.getUser(id);
//       if (response.success) {
//         setUser(response.data.user);
//       }
//     } catch (err) {
//       setError('Failed to load user details');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <DashboardLayout title="User Details">
//         <LoadingSpinner />
//       </DashboardLayout>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardLayout title="User Details">
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//           {error}
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout title="User Details">
//       <div className="max-w-4xl">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate('/users')}
//           className="mb-6 flex items-center text-gray-600 hover:text-purple-600 font-medium"
//         >
//           ← Back to Users
//         </button>

//         {/* User Card */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-12">
//             <div className="flex items-center">
//               <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mr-6">
//                 <span className="text-4xl font-bold text-purple-600">
//                   {user?.name?.charAt(0).toUpperCase()}
//                 </span>
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-white mb-2">{user?.name}</h1>
//                 <p className="text-purple-100 text-lg">{user?.email}</p>
//               </div>
//             </div>
//           </div>

//           {/* Details */}
//           <div className="px-8 py-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Role */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Role
//                 </label>
//                 <Badge variant="purple" size="lg">
//                   {user?.globalRole?.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
//                 </Badge>
//               </div>

//               {/* Status */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Status
//                 </label>
//                 <Badge variant={user?.isActive ? 'success' : 'danger'} size="lg">
//                   {user?.isActive ? 'Active' : 'Inactive'}
//                 </Badge>
//               </div>

//               {/* Department */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Department
//                 </label>
//                 <p className="text-gray-900 text-lg">{user?.department || 'N/A'}</p>
//               </div>

//               {/* Phone */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Phone Number
//                 </label>
//                 <p className="text-gray-900 text-lg">{user?.phone || 'N/A'}</p>
//               </div>

//               {/* Created By */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Created By
//                 </label>
//                 <p className="text-gray-900 text-lg">
//                   {user?.createdBy?.name || 'System'}
//                 </p>
//               </div>

//               {/* Created At */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Created At
//                 </label>
//                 <p className="text-gray-900 text-lg">
//                   {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
//                 </p>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
//               <button
//                 onClick={() => navigate(`/users/${id}/edit`)}
//                 className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
//               >
//                 Edit User
//               </button>
//               <button
//                 onClick={() => navigate('/users')}
//                 className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
//               >
//                 Back to List
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default UserDetails;






















// frontend/src/pages/User/UserDetails.jsx - MODIFIED VERSION

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { userService } from '../../services/user.service';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await userService.getUser(id);
      if (response.success) {
        setUser(response.data.user);
      }
    } catch (err) {
      setError('Failed to load user details');
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
      <DashboardLayout title="User Details">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="User Details">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="User Details">
      <div className="max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/users')}
          className="mb-6 flex items-center text-gray-600 hover:text-purple-600 font-medium"
        >
          ← Back to Users
        </button>

        {/* User Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-12">
            <div className="flex items-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mr-6">
                <span className="text-4xl font-bold text-purple-600">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
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

          {/* Details */}
          <div className="px-8 py-6">
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

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <Badge variant={user?.isActive ? 'success' : 'danger'} size="lg">
                  {user?.isActive ? 'Active' : 'Inactive'}
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

              {/* Created By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Created By
                </label>
                <p className="text-gray-900 text-lg">
                  {user?.createdBy?.name || 'System'}
                </p>
              </div>

              {/* Created At */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Created At
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

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
              <button
                onClick={() => navigate(`/users/${id}/edit`)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
              >
                Edit User
              </button>
              <button
                onClick={() => navigate('/users')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDetails;