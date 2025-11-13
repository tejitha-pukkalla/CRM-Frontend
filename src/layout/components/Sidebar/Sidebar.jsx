 import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '../../../hooks/useAuth';
import { ROLES } from '../../../config/constants';
 
// Animation variants for the sub-menu
const subMenuAnimate = {
  enter: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};
 
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const location = useLocation();
  const { user } = useAuth();
 
  const getNavItems = () => {
    const commonItems = [
      {
        name: "Dashboard",
        path: `/dashboard/${user?.globalRole}`,
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        ),
      },
     
 
    ];
 
    const roleSpecificItems = {
      [ROLES.SUPERADMIN]: [
        {
          name: 'Users',
          path: '/users',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )
        },
        {
        name: "Work",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v2h6v-2M8 9h8v4H8zM4 7a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"
            />
          </svg>
        ),
        children: [
          {
            name: "Projects",
            path: "/projects",
          },
          {
            name: "Tasks",
            path: "/tasks",
          },
        ],
      },
        {
          name: 'Approvals',
          path: '/approvals',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        }
      ],
      [ROLES.TEAMLEAD]: [
        {
          name: 'Users',
          path: '/users',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )
        },
        {
        name: "Work",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v2h6v-2M8 9h8v4H8zM4 7a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"
            />
          </svg>
        ),
        children: [
          {
            name: "Projects",
            path: "/projects",
          },
          {
            name: "Tasks",
            path: "/tasks",
          },
        ],
      },
      {
          name: 'My Tasks',
          path: '/my-tasks',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          )
        },
        {
          name: 'Approvals',
          path: '/approvals',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        },
        {
          name: 'Time Tracking',
          path: '/time-tracking',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        }
      ],
      [ROLES.PROJECTLEAD]: [
        {
          name: 'My Projects',
          path: '/projects',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          )
        },
        {
          name: 'Tasks',
          path: '/tasks',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          )
        },
        {
          name: 'My Tasks',
          path: '/my-tasks',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          )
        },
        {
          name: 'Time Tracking',
          path: '/time-tracking',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        }
      ],
      [ROLES.MEMBER]: [
        {
          name: 'My Tasks',
          path: '/my-tasks',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          )
        },
        {
          name: 'Time Tracking',
          path: '/time-tracking',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        }
      ]
    };
 
    return [...commonItems, ...(roleSpecificItems[user?.globalRole] || [])];
  };
 
  const handleSubMenuToggle = (name) => {
    if (isExpanded) {
      setOpenSubMenu(openSubMenu === name ? null : name);
    }
  };
 
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
 
      <aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => {
          setIsExpanded(false);
          setOpenSubMenu(null);
        }}
        className={`fixed top-0 left-0 z-50 h-screen ${
          isExpanded ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transform
          transition-all duration-500 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 flex-shrink-0 min-h-[81px]">
            {!isExpanded && (
              <div className="w-full flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Logo Icon"
                  className="w-12 h-12 rounded-md object-cover"
                />
              </div>
            )}
 
            <AnimatePresence>
              {isExpanded && (
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-xl font-bold text-blue-900 whitespace-nowrap"
                >
                  DESIGN <span className="text-yellow-400">BLOCKS</span>
                </motion.h1>
              )}
            </AnimatePresence>
 
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
 
          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 overflow-y-auto">
            <ul className="space-y-2">
              {getNavItems().map((item) => {
                const isSubMenuOpen = openSubMenu === item.name && isExpanded;
 
                if (item.children) {
                  const isSubMenuActive =
                    item.children &&
                    item.children.some(
                      (child) => location.pathname === child.path
                    );
                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => handleSubMenuToggle(item.name)}
                        className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                          isSubMenuActive
                            ? "bg-purple-50 text-purple-600 font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        } ${!isExpanded ? "justify-center" : ""}`}
                      >
                        {item.icon}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.span
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -8 }}
                              transition={{ duration: 0.5 }}
                              className="ml-3 flex-1 text-left whitespace-nowrap"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            animate={{
                              rotate: isSubMenuOpen ? 180 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                            className="ml-auto"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </button>
 
                      <AnimatePresence>
                        {isSubMenuOpen && (
                          <motion.ul
                            key={`submenu-${item.name}`}
                            initial="exit"
                            animate="enter"
                            exit="exit"
                            variants={subMenuAnimate}
                            className="pl-8 pr-2 py-1 overflow-hidden"
                          >
                            {item.children.map((child) => (
                              <li key={child.path} className="mt-1">
                                <NavLink
                                  to={child.path}
                                  className={({ isActive }) =>
                                    `flex items-center px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                                      isActive
                                        ? "bg-purple-100 text-purple-700 font-semibold"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`
                                  }
                                >
                                  {child.name}
                                </NavLink>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                }
 
                // Normal link
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-purple-50 text-purple-600 font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        } ${!isExpanded ? "justify-center" : ""}`
                      }
                    >
                      {item.icon}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.span
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.5 }}
                            className="ml-3 whitespace-nowrap"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
 
          {/* User Info */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.5 }}
                    className="ml-3 flex-1 overflow-hidden"
                  >
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize truncate">
                      {user?.globalRole}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
 
export default Sidebar;