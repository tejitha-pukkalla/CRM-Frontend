// src/layouts/components/Sidebar/SidebarItem.jsx
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ item }) => {
  return (
    <li>
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center px-4 py-3 rounded-lg transition-colors ${
            isActive
              ? 'bg-purple-50 text-purple-600 font-semibold'
              : 'text-gray-700 hover:bg-gray-100'
          }`
        }
      >
        {item.icon}
        <span className="ml-3">{item.name}</span>
        {item.badge && (
          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {item.badge}
          </span>
        )}
      </NavLink>
    </li>
  );
};

export default SidebarItem;