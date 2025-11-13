// // src/layouts/DashboardLayout.jsx
// import { useState } from 'react';
// import Sidebar from './components/Sidebar/Sidebar';
// import Header from './components/Header/Header';

// const DashboardLayout = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Sidebar */}
//       <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Header */}
//         <Header toggleSidebar={toggleSidebar} />

//         {/* Page Content */}
//         <main className="flex-1 p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;





import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';  
 
 
const DashboardLayout = ({ children }) => {
  // (Hamburger menu)
  const [sidebarOpen, setSidebarOpen] = useState(false);
 
  // --- 1. STATE LIFTING ---
  //  (hover expand/collapse)
  const [isExpanded, setIsExpanded] = useState(false);
  // --- ---
 
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
 
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        isExpanded={isExpanded}      
        setIsExpanded={setIsExpanded}
      />
 
      {/* Main Content */}
 
      <div
        className={`flex-1 flex flex-col min-w-0
                  transition-all duration-500 ease-in-out
                  ${isExpanded ? 'lg:pl-64' : 'lg:pl-20'}
        `}
      >
        {/* Header  */}
        <Header toggleSidebar={toggleSidebar} />
 
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
 
export default DashboardLayout;