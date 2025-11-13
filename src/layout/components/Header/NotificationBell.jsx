// // src/layouts/components/Header/NotificationBell.jsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const NotificationBell = () => {
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);
//   const [notifications] = useState([
//     {
//       id: 1,
//       type: 'task_assigned',
//       title: 'New Task Assigned',
//       message: 'You have been assigned a new task',
//       time: '5 min ago',
//       isRead: false
//     },
//     {
//       id: 2,
//       type: 'task_approved',
//       title: 'Task Approved',
//       message: 'Your task has been approved',
//       time: '1 hour ago',
//       isRead: false
//     },
//     {
//       id: 3,
//       type: 'project_created',
//       title: 'New Project',
//       message: 'You have been added to a new project',
//       time: '2 hours ago',
//       isRead: true
//     }
//   ]);

//   const unreadCount = notifications.filter(n => !n.isRead).length;

//   const getNotificationIcon = (type) => {
//     switch(type) {
//       case 'task_assigned':
//         return (
//           <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//             <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//             </svg>
//           </div>
//         );
//       case 'task_approved':
//         return (
//           <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//             <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//         );
//       case 'project_created':
//         return (
//           <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
//             <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
//             </svg>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="relative">
//       <button 
//         onClick={() => setIsOpen(!isOpen)}
//         className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
//       >
//         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//         </svg>
//         {unreadCount > 0 && (
//           <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {/* Dropdown */}
//       {isOpen && (
//         <>
//           <div 
//             className="fixed inset-0 z-40"
//             onClick={() => setIsOpen(false)}
//           />
//           <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
//             {/* Header */}
//             <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
//               <h3 className="font-semibold text-gray-900">Notifications</h3>
//               {unreadCount > 0 && (
//                 <span className="text-xs text-purple-600 font-medium">
//                   {unreadCount} new
//                 </span>
//               )}
//             </div>

//             {/* Notifications List */}
//             <div className="divide-y divide-gray-100">
//               {notifications.length === 0 ? (
//                 <div className="px-4 py-8 text-center text-gray-500">
//                   <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                   </svg>
//                   <p className="text-sm">No notifications</p>
//                 </div>
//               ) : (
//                 notifications.map((notification) => (
//                   <button
//                     key={notification.id}
//                     onClick={() => {
//                       setIsOpen(false);
//                       navigate('/notifications');
//                     }}
//                     className={`w-full px-4 py-3 hover:bg-gray-50 transition text-left ${
//                       !notification.isRead ? 'bg-purple-50' : ''
//                     }`}
//                   >
//                     <div className="flex items-start space-x-3">
//                       {getNotificationIcon(notification.type)}
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-semibold text-gray-900">
//                           {notification.title}
//                         </p>
//                         <p className="text-sm text-gray-600 mt-0.5">
//                           {notification.message}
//                         </p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           {notification.time}
//                         </p>
//                       </div>
//                       {!notification.isRead && (
//                         <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
//                       )}
//                     </div>
//                   </button>
//                 ))
//               )}
//             </div>

//             {/* Footer */}
//             {notifications.length > 0 && (
//               <div className="px-4 py-3 border-t border-gray-200">
//                 <button
//                   onClick={() => {
//                     setIsOpen(false);
//                     navigate('/notifications');
//                   }}
//                   className="w-full text-center text-sm text-purple-600 font-semibold hover:text-purple-700"
//                 >
//                   View all notifications
//                 </button>
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;




// src/layouts/components/Header/NotificationBell.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    fetchNotifications, 
    markAsRead 
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch recent notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications({ limit: 5 });
    }
  }, [isOpen, fetchNotifications]);

  const getNotificationIcon = (type) => {
    const iconClass = "w-5 h-5";
    
    switch(type) {
      case 'task_assigned':
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className={`${iconClass} text-blue-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        );
      case 'task_approved':
        return (
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className={`${iconClass} text-green-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'task_rejected':
        return (
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className={`${iconClass} text-red-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'project_created':
        return (
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className={`${iconClass} text-purple-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
        );
      case 'task_reassigned':
        return (
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className={`${iconClass} text-yellow-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        );
      case 'due_date_approaching':
      case 'task_overdue':
        return (
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className={`${iconClass} text-orange-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className={`${iconClass} text-gray-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    // Close dropdown
    setIsOpen(false);

    // Navigate based on notification type
    const { referenceType, referenceId } = notification;
    
    switch (referenceType) {
      case 'task':
        navigate(`/tasks/${referenceId}`);
        break;
      case 'project':
        navigate(`/projects/${referenceId}`);
        break;
      case 'user':
        navigate(`/users/${referenceId}`);
        break;
      default:
        break;
    }
  };

  const getTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return 'Just now';
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs text-purple-600 font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>

            {/* Notifications List */}
            <div className="divide-y divide-gray-100">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full px-4 py-3 hover:bg-gray-50 transition text-left ${
                      !notification.isRead ? 'bg-purple-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {getTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200 sticky bottom-0 bg-white">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/notifications');
                  }}
                  className="w-full text-center text-sm text-purple-600 font-semibold hover:text-purple-700"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;