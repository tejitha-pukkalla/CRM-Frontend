// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Badge from '../../../components/common/Badge';

// const UserCard = ({ user, onEdit, onDelete, canDelete }) => {
//   const navigate = useNavigate();

//   const getRoleBadgeVariant = (role) => {
//     const variants = {
//       superadmin: 'danger',
//       teamlead: 'purple',
//       projectlead: 'info',
//       member: 'success'
//     };
//     return variants[role] || 'default';
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex items-center">
//           <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
//             <span className="text-2xl font-bold text-white">
//               {user.name.charAt(0).toUpperCase()}
//             </span>
//           </div>
//           <div>
//             <h3 
//               className="text-xl font-bold text-gray-900 cursor-pointer hover:text-purple-600"
//               onClick={() => navigate(`/users/${user._id}`)}
//             >
//               {user.name}
//             </h3>
//             <p className="text-gray-600 text-sm">{user.email}</p>
//           </div>
//         </div>

//         <Badge variant={user.isActive ? 'success' : 'danger'}>
//           {user.isActive ? 'Active' : 'Inactive'}
//         </Badge>
//       </div>

//       <div className="space-y-2 mb-4">
//         <div className="flex items-center justify-between">
//           <span className="text-sm text-gray-600">Role:</span>
//           <Badge variant={getRoleBadgeVariant(user.globalRole)}>
//             {user.globalRole.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
//           </Badge>
//         </div>
        
//         {user.department && (
//           <div className="flex items-center justify-between">
//             <span className="text-sm text-gray-600">Department:</span>
//             <span className="text-sm font-medium text-gray-900">{user.department}</span>
//           </div>
//         )}
        
//         {user.phone && (
//           <div className="flex items-center justify-between">
//             <span className="text-sm text-gray-600">Phone:</span>
//             <span className="text-sm font-medium text-gray-900">{user.phone}</span>
//           </div>
//         )}
//       </div>

//       <div className="flex gap-2 pt-4 border-t border-gray-200">
//         <button
//           onClick={() => onEdit(user._id)}
//           className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition font-medium"
//         >
//           Edit
//         </button>
//         {canDelete && (
//           <button
//             onClick={() => onDelete(user._id)}
//             className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
//           >
//             Delete
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserCard;














// frontend/src/pages/User/components/UserCard.jsx - MODIFIED VERSION

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../../components/common/Badge';

const UserCard = ({ user, onEdit, onDelete, canDelete }) => {
  const navigate = useNavigate();

  const getRoleBadgeVariant = (role) => {
    const variants = {
      superadmin: 'danger',
      teamlead: 'purple',
      projectlead: 'info',
      member: 'success'
    };
    return variants[role] || 'default';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
            <span className="text-2xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 
              className="text-xl font-bold text-gray-900 cursor-pointer hover:text-purple-600"
              onClick={() => navigate(`/users/${user._id}`)}
            >
              {user.name}
            </h3>
            <p className="text-gray-600 text-sm">{user.email}</p>
            {user.employeeId && (
              <p className="text-gray-500 text-xs mt-1">ID: {user.employeeId}</p>
            )}
          </div>
        </div>

        <Badge variant={user.isActive ? 'success' : 'danger'}>
          {user.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Role:</span>
          <Badge variant={getRoleBadgeVariant(user.globalRole)}>
            {user.globalRole.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
          </Badge>
        </div>
        
        {user.department && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Department:</span>
            <span className="text-sm font-medium text-gray-900">{user.department}</span>
          </div>
        )}
        
        {user.phone && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Phone:</span>
            <span className="text-sm font-medium text-gray-900">{user.phone}</span>
          </div>
        )}

        {user.gender && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Gender:</span>
            <span className="text-sm font-medium text-gray-900">{user.gender}</span>
          </div>
        )}

        {user.dateOfJoining && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Joined:</span>
            <span className="text-sm font-medium text-gray-900">
              {new Date(user.dateOfJoining).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onEdit(user._id)}
          className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition font-medium"
        >
          Edit
        </button>
        {canDelete && (
          <button
            onClick={() => onDelete(user._id)}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;