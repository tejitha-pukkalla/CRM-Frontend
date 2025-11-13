// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { authService } from '../../services/auth.service';
// import { useAuth } from '../../hooks/useAuth';
// import { ROLES } from '../../config/constants';

// const Register = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
  
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     globalRole: 'member',
//     department: '',
//     phone: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [apiError, setApiError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   // Determine which roles current user can create
//   const availableRoles = () => {
//     if (user?.globalRole === ROLES.SUPERADMIN) {
//       return [
//         { value: 'superadmin', label: 'Superadmin' },
//         { value: 'teamlead', label: 'Team Lead' },
//         { value: 'projectlead', label: 'Project Lead' },
//         { value: 'member', label: 'Member' }
//       ];
//     } else if (user?.globalRole === ROLES.TEAMLEAD) {
//       return [
//         { value: 'projectlead', label: 'Project Lead' },
//         { value: 'member', label: 'Member' }
//       ];
//     }
//     return [];
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
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

//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
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

//     setLoading(true);
//     setApiError('');
//     setSuccessMessage('');

//     try {
//       const { confirmPassword, ...userData } = formData;
      
//       const response = await authService.register(userData);

//       if (response.success) {
//         setSuccessMessage(`User ${userData.name} created successfully!`);
//         setFormData({
//           name: '',
//           email: '',
//           password: '',
//           confirmPassword: '',
//           globalRole: 'member',
//           department: '',
//           phone: ''
//         });
//         setTimeout(() => {
//           navigate('/users');
//         }, 2000);
//       }
//     } catch (error) {
//       setApiError(
//         error.response?.data?.message || 
//         'Failed to create user. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <button
//           onClick={() => navigate('/users')}
//           className="mb-6 flex items-center text-gray-600 hover:text-purple-600 font-medium"
//         >
//           ← Back to Users
//         </button>
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               Create New User
//             </h1>
//             <p className="text-gray-600">
//               Add a new user to the system
//             </p>
//           </div>

//           {/* Form */}
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

//             {/* Name and Email Row */}
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
//                   placeholder="Enter full name"
//                   disabled={loading}
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
//                   placeholder="Enter email"
//                   disabled={loading}
//                 />
//                 {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
//               </div>
//             </div>

//             {/* Password Row */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Password <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
//                     errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                   }`}
//                   placeholder="Minimum 6 characters"
//                   disabled={loading}
//                 />
//                 {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Confirm Password <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
//                     errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                   }`}
//                   placeholder="Re-enter password"
//                   disabled={loading}
//                 />
//                 {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
//               </div>
//             </div>

//             {/* Role and Department Row */}
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
//                   disabled={loading}
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
//                   placeholder="e.g., Development, Design"
//                   disabled={loading}
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
//                 placeholder="Enter phone number"
//                 disabled={loading}
//               />
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-4 pt-4">
//               <button
//                 type="button"
//                 onClick={() => navigate('/users')}
//                 disabled={loading}
//                 className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition ${
//                   loading
//                     ? 'bg-purple-400 cursor-not-allowed'
//                     : 'bg-purple-600 hover:bg-purple-700'
//                 }`}
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center">
//                     <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                     </svg>
//                     Creating...
//                   </span>
//                 ) : (
//                   'Create User'
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;






















// frontend/src/pages/Auth/Register.jsx - COMPLETE MODIFIED VERSION

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../config/constants';

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    globalRole: 'member',
    department: '',
    phone: '',
    employeeId: '',
    gender: '',
    dateOfBirth: '',
    dateOfJoining: '',
    address: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Determine which roles current user can create
  const availableRoles = () => {
    if (user?.globalRole === ROLES.SUPERADMIN) {
      return [
        { value: 'superadmin', label: 'Superadmin' },
        { value: 'teamlead', label: 'Team Lead' },
        { value: 'projectlead', label: 'Project Lead' },
        { value: 'member', label: 'Member' }
      ];
    } else if (user?.globalRole === ROLES.TEAMLEAD) {
      return [
        { value: 'projectlead', label: 'Project Lead' },
        { value: 'member', label: 'Member' }
      ];
    }
    return [];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required (for password generation)';
    } else if (formData.phone.length < 4) {
      newErrors.phone = 'Phone must be at least 4 digits';
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

    setLoading(true);
    setApiError('');
    setSuccessData(null);

    try {
      const response = await authService.register(formData);

      if (response.success) {
        // Store success data with default password
        setSuccessData({
          userName: formData.name,
          userEmail: formData.email,
          defaultPassword: response.data.defaultPassword
        });
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          globalRole: 'member',
          department: '',
          phone: '',
          employeeId: '',
          gender: '',
          dateOfBirth: '',
          dateOfJoining: '',
          address: ''
        });
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message || 
        'Failed to create user. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessData(null);
    navigate('/users');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <button
            onClick={() => navigate('/users')}
            className="mb-6 flex items-center text-gray-600 hover:text-purple-600 font-medium"
          >
            ← Back to Users
          </button>
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New User
            </h1>
            <p className="text-gray-600">
              Add a new user to the system. Password will be auto-generated.
            </p>
          </div>

          {/* Success Modal */}
          {successData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    User Created Successfully!
                  </h3>
                  <p className="text-gray-600">
                    {successData.userName} has been added to the system.
                  </p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-yellow-800 mb-2">
                        Important: Default Password
                      </p>
                      <p className="text-sm text-yellow-700 mb-3">
                        Please share this password with the user:
                      </p>
                      <div className="bg-white rounded-lg p-3 border border-yellow-200">
                        <code className="text-lg font-mono font-bold text-purple-600">
                          {successData.defaultPassword}
                        </code>
                      </div>
                      <p className="text-xs text-yellow-600 mt-2">
                        User should change this password after first login.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900">{successData.userEmail}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Password:</span>
                    <span className="font-mono font-bold text-purple-600">{successData.defaultPassword}</span>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                >
                  Close & Go to Users
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {apiError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {apiError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email Row */}
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
                  placeholder="Enter full name"
                  disabled={loading}
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
                  placeholder="Enter email"
                  disabled={loading}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            {/* Phone and Employee ID Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Required for password generation"
                  disabled={loading}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                <p className="mt-1 text-xs text-gray-500">Used to generate default password</p>
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
                  placeholder="e.g., EMP001"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Role and Department Row */}
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
                  disabled={loading}
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
                  placeholder="e.g., Development, Design"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Gender and Date of Birth Row */}
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
                  disabled={loading}
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
                  disabled={loading}
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
                disabled={loading}
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
                placeholder="Enter full address"
                disabled={loading}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/users')}
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
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </span>
                ) : (
                  'Create User'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;