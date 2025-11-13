// // src/layouts/components/Header/Header.jsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../hooks/useAuth';

// const Header = ({ toggleSidebar }) => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();
//   const [showProfileMenu, setShowProfileMenu] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
//       <div className="px-4 sm:px-6 lg:px-8 py-4">
//         <div className="flex items-center justify-between">
//           {/* Left: Menu button + Page title */}
//           <div className="flex items-center">
//             <button
//               onClick={toggleSidebar}
//               className="lg:hidden mr-4 text-gray-500 hover:text-gray-700"
//             >
//               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
            
//             <div>
//               <h2 className="text-xl font-semibold text-gray-900">
//                 Welcome back, {user?.name}!
//               </h2>
//               <p className="text-sm text-gray-500 mt-0.5">
//                 {new Date().toLocaleDateString('en-US', { 
//                   weekday: 'long', 
//                   year: 'numeric', 
//                   month: 'long', 
//                   day: 'numeric' 
//                 })}
//               </p>
//             </div>
//           </div>

//           {/* Right: Notifications + Profile */}
//           <div className="flex items-center space-x-4">
//             {/* Notifications */}
//             <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
//               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//               </svg>
//               <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//             </button>

//             {/* Profile Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowProfileMenu(!showProfileMenu)}
//                 className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition"
//               >
//                 <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
//                   {user?.name?.charAt(0).toUpperCase()}
//                 </div>
//                 <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>

//               {/* Dropdown Menu */}
//               {showProfileMenu && (
//                 <>
//                   <div 
//                     className="fixed inset-0 z-40"
//                     onClick={() => setShowProfileMenu(false)}
//                   />
//                   <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
//                     <div className="px-4 py-3 border-b border-gray-200">
//                       <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
//                       <p className="text-xs text-gray-500">{user?.email}</p>
//                       <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded capitalize">
//                         {user?.globalRole}
//                       </span>
//                     </div>
                    
//                     <button
//                       onClick={() => {
//                         navigate('/profile');
//                         setShowProfileMenu(false);
//                       }}
//                       className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                     >
//                       <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                       My Profile
//                     </button>
                    
//                     <button
//                       onClick={handleLogout}
//                       className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
//                     >
//                       <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                       </svg>
//                       Logout
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;




// src/layouts/components/Header/Header.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import NotificationBell from './NotificationBell';
import ProfileDropdown from './ProfileDropdown';

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Menu button + Page title */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="lg:hidden mr-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome back, {user?.name}!
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Right: Notifications + Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications Bell */}
            <NotificationBell />

            {/* Profile Dropdown */}
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;