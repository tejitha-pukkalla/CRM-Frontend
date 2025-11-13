// // src/pages/Users/EditUser.jsx
// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import DashboardLayout from '../../layout/DashboardLayout';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import { userService } from '../../services/user.service';
// import { useAuth } from '../../hooks/useAuth';
// import { ROLES } from '../../config/constants';

// const EditUser = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user: currentUser } = useAuth();

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     globalRole: '',
//     department: '',
//     phone: '',
//     isActive: true
//   });

//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [apiError, setApiError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   useEffect(() => {
//     fetchUserDetails();
//   }, [id]);

//   const fetchUserDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await userService.getUser(id);
//       if (response.success) {
//         const user = response.data.user;
//         setFormData({
//           name: user.name || '',
//           email: user.email || '',
//           globalRole: user.globalRole || '',
//           department: user.department || '',
//           phone: user.phone || '',
//           isActive: user.isActive
//         });
//       }
//     } catch (err) {
//       setApiError('Failed to load user details');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const availableRoles = () => {
//     if (currentUser?.globalRole === ROLES.SUPERADMIN) {
//       return [
//         { value: 'superadmin', label: 'Superadmin' },
//         { value: 'teamlead', label: 'Team Lead' },
//         { value: 'projectlead', label: 'Project Lead' },
//         { value: 'member', label: 'Member' }
//       ];
//     } else if (currentUser?.globalRole === ROLES.TEAMLEAD) {
//       return [
//         { value: 'projectlead', label: 'Project Lead' },
//         { value: 'member', label: 'Member' }
//       ];
//     }
//     return [];
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//     setApiError('');
//   };

//   const validate = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = 'Name is required';
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }

//     if (!formData.globalRole) {
//       newErrors.globalRole = 'Role is required';
//     }

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setSubmitting(true);
//     setApiError('');
//     setSuccessMessage('');

//     try {
//       const response = await userService.updateUser(id, formData);

//       if (response.success) {
//         setSuccessMessage('User updated successfully!');
//         setTimeout(() => {
//           navigate('/users');
//         }, 1500);
//       }
//     } catch (error) {
//       setApiError(
//         error.response?.data?.message || 
//         'Failed to update user. Please try again.'
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <LoadingSpinner />
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="max-w-4xl">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate('/users')}
//           className="mb-6 flex items-center text-gray-600 hover:text-purple-600 font-medium"
//         >
//           <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//           </svg>
//           Back to Users
//         </button>

//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               Edit User
//             </h1>
//             <p className="text-gray-600">
//               Update user information
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Success Message */}
//             {successMessage && (
//               <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
//                 <div className="flex items-center">
//                   <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   {successMessage}
//                 </div>
//               </div>
//             )}

//             {/* Error Message */}
//             {apiError && (
//               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//                 {apiError}
//               </div>
//             )}

//             {/* Name and Email */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Full Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
//                     errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                   }`}
//                   disabled={submitting}
//                 />
//                 {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Email Address <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
//                     errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                   }`}
//                   disabled={submitting}
//                 />
//                 {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
//               </div>
//             </div>

//             {/* Role and Department */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Role <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="globalRole"
//                   value={formData.globalRole}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
//                     errors.globalRole ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                   }`}
//                   disabled={submitting}
//                 >
//                   <option value="">Select Role</option>
//                   {availableRoles().map(role => (
//                     <option key={role.value} value={role.value}>
//                       {role.label}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.globalRole && <p className="mt-1 text-sm text-red-600">{errors.globalRole}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Department
//                 </label>
//                 <input
//                   type="text"
//                   name="department"
//                   value={formData.department}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   disabled={submitting}
//                 />
//               </div>
//             </div>

//             {/* Phone */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Phone Number
//               </label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 disabled={submitting}
//               />
//             </div>

//             {/* Active Status */}
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 name="isActive"
//                 checked={formData.isActive}
//                 onChange={handleChange}
//                 className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
//                 disabled={submitting}
//               />
//               <label className="ml-3 text-sm font-medium text-gray-700">
//                 User is Active
//               </label>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-4 pt-4">
//               <button
//                 type="button"
//                 onClick={() => navigate('/users')}
//                 disabled={submitting}
//                 className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition ${
//                   submitting
//                     ? 'bg-purple-400 cursor-not-allowed'
//                     : 'bg-purple-600 hover:bg-purple-700'
//                 }`}
//               >
//                 {submitting ? (
//                   <span className="flex items-center justify-center">
//                     <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                     </svg>
//                     Updating...
//                   </span>
//                 ) : (
//                   'Update User'
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default EditUser;



















// frontend/src/pages/User/EditUser.jsx - COMPLETE MODIFIED VERSION

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { userService } from '../../services/user.service';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../config/constants';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    globalRole: '',
    department: '',
    phone: '',
    employeeId: '',
    gender: '',
    dateOfBirth: '',
    dateOfJoining: '',
    address: '',
    isActive: true
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordResetData, setPasswordResetData] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await userService.getUser(id);
      if (response.success) {
        const user = response.data.user;
        setFormData({
          name: user.name || '',
          email: user.email || '',
          globalRole: user.globalRole || '',
          department: user.department || '',
          phone: user.phone || '',
          employeeId: user.employeeId || '',
          gender: user.gender || '',
          dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
          dateOfJoining: user.dateOfJoining ? user.dateOfJoining.split('T')[0] : '',
          address: user.address || '',
          isActive: user.isActive
        });
      }
    } catch (err) {
      setApiError('Failed to load user details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const availableRoles = () => {
    if (currentUser?.globalRole === ROLES.SUPERADMIN) {
      return [
        { value: 'superadmin', label: 'Superadmin' },
        { value: 'teamlead', label: 'Team Lead' },
        { value: 'projectlead', label: 'Project Lead' },
        { value: 'member', label: 'Member' }
      ];
    } else if (currentUser?.globalRole === ROLES.TEAMLEAD) {
      return [
        { value: 'projectlead', label: 'Project Lead' },
        { value: 'member', label: 'Member' }
      ];
    }
    return [];
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.globalRole) {
      newErrors.globalRole = 'Role is required';
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
      const response = await userService.updateUser(id, formData);

      if (response.success) {
        setSuccessMessage('User updated successfully!');
        setTimeout(() => {
          navigate('/users');
        }, 1500);
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message || 
        'Failed to update user. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // 🆕 Reset Password Handler
  const handleResetPassword = async () => {
    if (!window.confirm('Are you sure you want to reset this user\'s password to default?')) {
      return;
    }

    setResettingPassword(true);
    setApiError('');
    setSuccessMessage('');

    try {
      const response = await userService.resetPassword(id);

      if (response.success) {
        setPasswordResetData({
          defaultPassword: response.data.defaultPassword
        });
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message || 
        'Failed to reset password. Please try again.'
      );
    } finally {
      setResettingPassword(false);
    }
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
      <div className="max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/users')}
          className="mb-6 flex items-center text-gray-600 hover:text-purple-600 font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Users
        </button>

        {/* Password Reset Success Modal */}
        {passwordResetData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Password Reset Successful!
                </h3>
                <p className="text-gray-600">
                  The user's password has been reset to default.
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-yellow-800 mb-2">
                      New Default Password
                    </p>
                    <p className="text-sm text-yellow-700 mb-3">
                      Please share this password with the user:
                    </p>
                    <div className="bg-white rounded-lg p-3 border border-yellow-200">
                      <code className="text-lg font-mono font-bold text-purple-600">
                        {passwordResetData.defaultPassword}
                      </code>
                    </div>
                    <p className="text-xs text-yellow-600 mt-2">
                      User should change this password after login.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setPasswordResetData(null)}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Edit User
              </h1>
              <p className="text-gray-600">
                Update user information
              </p>
            </div>
            
            {/* Reset Password Button */}
            {(currentUser.globalRole === ROLES.SUPERADMIN || currentUser.globalRole === ROLES.TEAMLEAD) && (
              <button
                onClick={handleResetPassword}
                disabled={resettingPassword}
                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition font-medium flex items-center gap-2"
              >
                {resettingPassword ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Resetting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset Password
                  </>
                )}
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {successMessage}
                </div>
              </div>
            )}

            {/* Error Message */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {apiError}
              </div>
            )}

            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={submitting}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={submitting}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            {/* Phone and Employee ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Role and Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="globalRole"
                  value={formData.globalRole}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.globalRole ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={submitting}
                >
                  <option value="">Select Role</option>
                  {availableRoles().map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                {errors.globalRole && <p className="mt-1 text-sm text-red-600">{errors.globalRole}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Gender and Date of Birth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={submitting}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Date of Joining */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Joining
              </label>
              <input
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={submitting}
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={submitting}
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                disabled={submitting}
              />
              <label className="ml-3 text-sm font-medium text-gray-700">
                User is Active
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/users')}
                disabled={submitting}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition ${
                  submitting
                    ? 'bg-purple-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating...
                  </span>
                ) : (
                  'Update User'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditUser;