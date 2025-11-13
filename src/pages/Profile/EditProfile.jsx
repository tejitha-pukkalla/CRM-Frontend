// // frontend/src/pages/Profile/EditProfile.jsx - NEW FILE

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import DashboardLayout from '../../layout/DashboardLayout';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
// import { profileService } from '../../services/profile.services';

// const EditProfile = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     gender: '',
//     dateOfBirth: '',
//     address: '',
//     profilePic: ''
//   });

//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [apiError, setApiError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       const response = await profileService.getProfile();
//       if (response.success) {
//         const user = response.data.user;
//         setFormData({
//           name: user.name || '',
//           phone: user.phone || '',
//           gender: user.gender || '',
//           dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
//           address: user.address || '',
//           profilePic: user.profilePic || ''
//         });
//       }
//     } catch (err) {
//       setApiError('Failed to load profile');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
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
//       const response = await profileService.updateProfile(formData);

//       if (response.success) {
//         setSuccessMessage('Profile updated successfully!');
//         setTimeout(() => {
//           navigate('/profile');
//         }, 1500);
//       }
//     } catch (error) {
//       setApiError(
//         error.response?.data?.message || 
//         'Failed to update profile. Please try again.'
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <DashboardLayout title="Edit Profile">
//         <LoadingSpinner />
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout title="Edit Profile">
//       <div className="max-w-3xl mx-auto">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate('/profile')}
//           className="mb-6 flex items-center text-gray-600 hover:text-purple-600 font-medium"
//         >
//           <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//           </svg>
//           Back to Profile
//         </button>

//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               Edit Profile
//             </h1>
//             <p className="text-gray-600">
//               Update your personal information
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

//             {/* Info Box */}
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <div className="flex items-start">
//                 <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                 </svg>
//                 <div>
//                   <p className="text-sm text-blue-800">
//                     <strong>Note:</strong> You can only edit your personal information here. 
//                     Email, role, department, and employee ID can only be changed by administrators.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Name */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Full Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
//                   errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                 }`}
//                 disabled={submitting}
//               />
//               {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
//             </div>

//             {/* Phone and Gender Row */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   disabled={submitting}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Gender
//                 </label>
//                 <select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   disabled={submitting}
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//             </div>

//             {/* Date of Birth */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Date of Birth
//               </label>
//               <input
//                 type="date"
//                 name="dateOfBirth"
//                 value={formData.dateOfBirth}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 disabled={submitting}
//               />
//             </div>

//             {/* Address */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Address
//               </label>
//               <textarea
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 rows={3}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 placeholder="Enter your full address"
//                 disabled={submitting}
//               />
//             </div>

//             {/* Profile Picture URL (Optional) */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Profile Picture URL (Optional)
//               </label>
//               <input
//                 type="url"
//                 name="profilePic"
//                 value={formData.profilePic}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 placeholder="https://example.com/profile.jpg"
//                 disabled={submitting}
//               />
//               <p className="mt-1 text-xs text-gray-500">
//                 Enter a valid image URL for your profile picture
//               </p>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-4 pt-4">
//               <button
//                 type="button"
//                 onClick={() => navigate('/profile')}
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
//                   'Save Changes'
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default EditProfile;



























































import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { profileService } from '../../services/profile.services';

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: ''
  });

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [currentProfilePic, setCurrentProfilePic] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile();
      if (response.success) {
        const user = response.data.user;
        setFormData({
          name: user.name || '',
          phone: user.phone || '',
          gender: user.gender || '',
          dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
          address: user.address || ''
        });
        setCurrentProfilePic(user.profilePic || '');
      }
    } catch (err) {
      setApiError('Failed to load profile');
      console.error(err);
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

  // IMAGE FILE SELECTION - THIS OPENS FILE PICKER
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type - ONLY PNG and JPEG
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ 
          ...prev, 
          profilePic: 'Only PNG and JPEG images are allowed' 
        }));
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ 
          ...prev, 
          profilePic: 'Image size must be less than 5MB' 
        }));
        return;
      }

      // Store the actual file
      setProfilePicFile(file);
      
      // Create preview to show selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear errors
      setErrors(prev => ({ ...prev, profilePic: '' }));
    }
  };

  // UPLOAD THE IMAGE FILE TO SERVER
  const handleImageUpload = async () => {
    if (!profilePicFile) {
      setErrors(prev => ({ 
        ...prev, 
        profilePic: 'Please select an image file first' 
      }));
      return;
    }

    setUploadingImage(true);
    setApiError('');

    try {
      // Send actual file to backend
      const response = await profileService.uploadProfilePicture(profilePicFile);
      
      if (response.success) {
        setCurrentProfilePic(response.data.profilePic);
        setProfilePicFile(null);
        setProfilePicPreview('');
        setSuccessMessage('Profile picture uploaded successfully!');
        
        // Refresh profile after upload
        await fetchProfile();
        
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message || 
        'Failed to upload image. Please try again.'
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveSelectedImage = () => {
    setProfilePicFile(null);
    setProfilePicPreview('');
    setErrors(prev => ({ ...prev, profilePic: '' }));
    // Reset file input
    const fileInput = document.getElementById('profilePicInput');
    if (fileInput) fileInput.value = '';
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
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
      const response = await profileService.updateProfile(formData);

      if (response.success) {
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message || 
        'Failed to update profile. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Edit Profile">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Edit Profile">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/profile')}
          className="mb-6 flex items-center text-gray-600 hover:text-purple-600 font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Profile
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit Profile
            </h1>
            <p className="text-gray-600">
              Update your personal information
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
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
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {apiError}
            </div>
          )}

          {/* ========== PROFILE PICTURE UPLOAD SECTION ========== */}
          <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-900">
                Upload Profile Picture
              </h2>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Image Preview Circle */}
              <div className="flex-shrink-0">
                <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-purple-300 shadow-lg">
                  {profilePicPreview ? (
                    <img 
                      src={profilePicPreview} 
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : currentProfilePic ? (
                    <img 
                      src={currentProfilePic} 
                      alt="Current"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-20 h-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                {profilePicPreview && (
                  <p className="mt-2 text-center text-sm text-green-600 font-semibold">
                    ✓ Image Selected
                  </p>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 w-full">
                <div className="space-y-4">
                  {/* File Input Button */}
                  <div>
                    <label 
                      htmlFor="profilePicInput"
                      className="inline-flex items-center px-6 py-3 bg-white border-2 border-purple-300 rounded-lg font-semibold text-purple-700 hover:bg-purple-50 hover:border-purple-400 cursor-pointer transition shadow-sm"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Choose Image File
                    </label>
                    <input
                      id="profilePicInput"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </div>

                  {/* Info Text */}
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <p className="text-sm text-gray-700 flex items-start">
                      <svg className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>
                        <strong>Supported formats:</strong> PNG, JPEG, JPG<br/>
                        <strong>Maximum size:</strong> 5MB
                      </span>
                    </p>
                  </div>

                  {/* Error Message for Image */}
                  {errors.profilePic && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                      {errors.profilePic}
                    </div>
                  )}

                  {/* Upload/Cancel Buttons (shown when file is selected) */}
                  {profilePicFile && (
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={uploadingImage}
                        className={`flex-1 px-6 py-3 rounded-lg font-bold text-white transition shadow-lg ${
                          uploadingImage
                            ? 'bg-purple-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        }`}
                      >
                        {uploadingImage ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Uploading...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload Now
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveSelectedImage}
                        disabled={uploadingImage}
                        className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> You can only edit your personal information here. 
                  Email, role, department, and employee ID can only be changed by administrators.
                </p>
              </div>
            </div>
          </div>

          {/* PROFILE INFORMATION FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
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

            {/* Phone and Gender Row */}
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
            </div>

            {/* Date of Birth */}
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
                placeholder="Enter your full address"
                disabled={submitting}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
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
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditProfile;