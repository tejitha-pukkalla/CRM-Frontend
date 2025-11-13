// src/pages/Dashboard/SuperadminDashboard/UsersByRole.jsx
const UsersByRole = ({ stats }) => {
  const totalUsers = stats?.users?.total || 0;
  const usersByRole = stats?.users?.byRole || [];

  const getRoleCount = (role) => {
    const roleData = usersByRole.find(r => r._id === role);
    return roleData?.count || 0;
  };

  const roles = [
    { 
      name: 'Superadmin', 
      value: 'superadmin', 
      color: 'purple',
      bgColor: 'bg-purple-600'
    },
    { 
      name: 'Team Lead', 
      value: 'teamlead', 
      color: 'blue',
      bgColor: 'bg-blue-600'
    },
    { 
      name: 'Project Lead', 
      value: 'projectlead', 
      color: 'green',
      bgColor: 'bg-green-600'
    },
    { 
      name: 'Member', 
      value: 'member', 
      color: 'orange',
      bgColor: 'bg-orange-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Users by Role</h2>
        <span className="text-sm text-gray-500">Total: {totalUsers}</span>
      </div>

      <div className="space-y-4">
        {roles.map((role) => {
          const count = getRoleCount(role.value);
          const percentage = totalUsers > 0 ? (count / totalUsers) * 100 : 0;
          
          return (
            <div key={role.value}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${role.bgColor}`}></div>
                  <span className="text-sm font-medium text-gray-700">{role.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{count} users</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${role.bgColor} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Most Common</p>
            <p className="text-lg font-bold text-gray-900 capitalize">
              {usersByRole.length > 0 
                ? usersByRole.reduce((max, role) => role.count > max.count ? role : max)._id
                : '-'
              }
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Active Roles</p>
            <p className="text-lg font-bold text-gray-900">
              {usersByRole.filter(r => r.count > 0).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersByRole;