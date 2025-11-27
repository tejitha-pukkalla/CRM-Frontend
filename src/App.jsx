import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';
import DashboardRedirect from './routes/DashboardRedirect';
import { ROLES } from './config/constants';
import { AttendanceProvider } from './context/AttendanceContext';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Dashboards 
import SuperadminDashboard from './pages/Dashboard/SuperadminDashboard';
import TeamLeadDashboard from './pages/Dashboard/TeamLeadDashboard';
import ProjectLeadDashboard from './pages/Dashboard/ProjectLeadDashboard';
import MemberDashboard from './pages/Dashboard/MemberDashboard';

// User Pages
import UsersList from './pages/User/UsersList';
import UsersGrid from './pages/User/UsersGrid';
import UserDetails from './pages/User/UserDetails';
import EditUser from './pages/User/EditUser';

// Profile Pages
import MyProfile from './pages/Profile/MyProfile';
import EditProfile from './pages/Profile/EditProfile';
import ChangePassword from './pages/Profile/ChangePassword';

// Project Pages
import ProjectsList from './pages/Projects/ProjectsList';
import CreateProject from './pages/Projects/CreateProject';
import ProjectDetails from './pages/Projects/ProjectDetails';
import EditProject from './pages/Projects/EditProject';

// Task Pages
import TasksList from './pages/Tasks/TasksList'; 
import CreateTask from './pages/Tasks/CreateTask';
import TaskDetails from './pages/Tasks/TaskDetails';
import EditTask from './pages/Tasks/EditTask';
import MyTasks from './pages/Tasks/MyTasks';

// Approval Pages
import PendingApprovals from './pages/Approvals/PendingApprovals';
import ApprovalDetails from './pages/Approvals/ApprovalDetails';

// Time Tracking Pages
import TimeLog from './pages/TimeTracking/TimeLog';
import ManualTimeEntry from './pages/TimeTracking/ManualTimeEntry';

// Notification Pages
import NotificationsList from './pages/Notifications/NotificationsList';

// Attendance Pages
import MyAttendance from './pages/Attendance/MyAttendance';
import AttendanceCalendar from './pages/Attendance/AttendanceCalendar';
import AttendanceReport from './pages/Attendance/AttendanceReport';

// 🎫 NEW: Ticket Pages
import TicketManagement from './pages/Tickets/TicketManagement';


// Leave Pages
import LeaveManagement from './pages/Leaves/LeaveManagement';
import MyLeaves from './pages/Leaves/MyLeaves';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } 
      />

      {/* Protected Routes */}
      <Route
        path="/register"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.TEAMLEAD]}>
              <Register />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* Dashboard Redirect */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        }
      />

      {/* Dashboard Routes */}
      <Route
        path="/dashboard/superadmin"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.SUPERADMIN]}>
              <SuperadminDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/teamlead"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.TEAMLEAD]}>
              <TeamLeadDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/projectlead"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.PROJECTLEAD]}>
              <ProjectLeadDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/member"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.MEMBER]}>
              <MemberDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* Profile Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      {/* User Management Routes */}
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.TEAMLEAD]}>
              <UsersList />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/grid"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.TEAMLEAD]}>
              <UsersGrid />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/:id"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.TEAMLEAD]}>
              <UserDetails />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/:id/edit"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.TEAMLEAD]}>
              <EditUser />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* Projects Routes */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <ProjectsList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/create"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.TEAMLEAD]}>
              <CreateProject />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <ProjectDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:id/edit"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.TEAMLEAD]}>
              <EditProject />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* Task Routes */}
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <TasksList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-tasks"
        element={
          <ProtectedRoute>
            <MyTasks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/create"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.TEAMLEAD, ROLES.PROJECTLEAD]}>
              <CreateTask />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/:id"
        element={
          <ProtectedRoute>
            <TaskDetails />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/tasks/:id/edit"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.TEAMLEAD, ROLES.PROJECTLEAD]}>
              <EditTask />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* Approval Routes */}
      <Route
        path="/approvals"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.TEAMLEAD]}>
              <PendingApprovals />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/approvals/:id"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.TEAMLEAD]}>
              <ApprovalDetails />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* Time Tracking Routes */}
      <Route
        path="/time-tracking"
        element={
          <ProtectedRoute>
            <TimeLog />
          </ProtectedRoute>
        }
      />

      <Route
        path="/time-tracking/manual"
        element={
          <ProtectedRoute>
            <ManualTimeEntry />
          </ProtectedRoute>
        }
      />

      {/* Attendance Routes */}
      <Route
        path="/attendance/my-history"
        element={
          <ProtectedRoute>
            <MyAttendance />
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance/calendar"
        element={
          <ProtectedRoute>
            <AttendanceCalendar />
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance/report"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.TEAMLEAD]}>
              <AttendanceReport />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* Leave Management - SuperAdmin & TeamLead */}
<Route
  path="/leaves/manage"
  element={
    <ProtectedRoute>
      <RoleBasedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.TEAMLEAD]}>
        <LeaveManagement />
      </RoleBasedRoute>
    </ProtectedRoute>
  }
/>

{/* Leave Applications - SuperAdmin & TeamLead */}
<Route
  path="/leaves/applications"
  element={
    <ProtectedRoute>
      <RoleBasedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.TEAMLEAD]}>
        <LeaveManagement />
      </RoleBasedRoute>
    </ProtectedRoute>
  }
/>

{/* My Leaves - All Users */}
<Route
  path="/leaves/my-leaves"
  element={
    <ProtectedRoute>
      <MyLeaves />
    </ProtectedRoute>
  }
/>


      {/* Notification Routes */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsList />
          </ProtectedRoute>
        }
      />

      {/* 🎫 NEW: Ticket Routes - All authenticated users can access */}
      <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <TicketManagement />
          </ProtectedRoute>
        }
      />

      {/* Default Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 Not Found */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-6">Page not found</p>
              <a 
                href="/login" 
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-block"
              >
                Go to Login
              </a>
            </div>
          </div>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AttendanceProvider> 
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </AttendanceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;