// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Calendar,
//   Users,
//   ClipboardList,
//   BarChart3,
//   Plus,
//   Edit2,
//   CheckCircle,
//   XCircle,
//   Clock,
//   TrendingUp,
//   RefreshCw,
// } from "lucide-react";
// import axios from "axios";
// import DashboardLayout from "../../layout/DashboardLayout";
// import BulkLeaveCredit from "./BulkLeaveCredit";
// import EditLeaveCredits from "./EditLeaveCredits";
// import AllLeaveApplications from "./AllLeaveApplications";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// const TABS = [
//   { id: "create", label: "Create Credits", icon: Plus },
//   { id: "manage", label: "Manage Credits", icon: Edit2 },
//   { id: "applications", label: "Applications", icon: ClipboardList },
//   { id: "analytics", label: "Analytics", icon: BarChart3 },
// ];

// export default function LeaveManagement() {
//   const [activeTab, setActiveTab] = useState("create");
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     pendingApplications: 0,
//     approvedThisMonth: 0,
//     totalLOP: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const currentYear = new Date().getFullYear();

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const headers = { Authorization: `Bearer ${token}` };

//       // Fetch all required stats
//       const [creditsRes, applicationsRes] = await Promise.all([
//         axios.get(`${API_URL}/leaves/leave-credits/all`, {
//           params: { year: currentYear },
//           headers,
//         }),
//         axios.get(`${API_URL}/leaves/all-applications`, {
//           params: { year: currentYear },
//           headers,
//         }),
//       ]);

//       const credits = creditsRes.data.data || [];
//       const applications = applicationsRes.data.data || [];

//       const pending = applications.filter((app) => app.status === "pending").length;
//       const approvedThisMonth = applications.filter(
//         (app) =>
//           app.status === "approved" &&
//           new Date(app.appliedAt).getMonth() === new Date().getMonth()
//       ).length;
//       const totalLOP = credits.reduce((sum, credit) => sum + (credit.lossOfPayCount || 0), 0);

//       setStats({
//         totalUsers: credits.length,
//         pendingApplications: pending,
//         approvedThisMonth,
//         totalLOP,
//       });
//     } catch (error) {
//       console.error("Error fetching stats:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "create":
//         return <BulkLeaveCredit onSuccess={fetchStats} />;
//       case "manage":
//         return <EditLeaveCredits />;
//       case "applications":
//         return <AllLeaveApplications onUpdate={fetchStats} />;
//       case "analytics":
//         return <AnalyticsTab stats={stats} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <DashboardLayout>
//       <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
//         <div className="max-w-7xl mx-auto space-y-6">
//           {/* Header */}
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="flex items-center justify-between"
//           >
//             <div>
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
//                 <Calendar className="w-10 h-10 text-purple-600" />
//                 Leave Management System
//               </h1>
//               <p className="text-gray-600 mt-2 text-lg">
//                 Manage employee leave credits and applications
//               </p>
//             </div>
//             <button
//               onClick={fetchStats}
//               className="p-3 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-purple-100"
//             >
//               <RefreshCw className="w-5 h-5 text-purple-600" />
//             </button>
//           </motion.div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//             <StatsCard
//               icon={Users}
//               label="Total Users"
//               value={stats.totalUsers}
//               color="from-blue-500 to-cyan-500"
//               delay={0}
//             />
//             <StatsCard
//               icon={Clock}
//               label="Pending"
//               value={stats.pendingApplications}
//               color="from-yellow-500 to-orange-500"
//               delay={0.1}
//               pulse={stats.pendingApplications > 0}
//             />
//             <StatsCard
//               icon={CheckCircle}
//               label="Approved (This Month)"
//               value={stats.approvedThisMonth}
//               color="from-green-500 to-emerald-500"
//               delay={0.2}
//             />
//             <StatsCard
//               icon={TrendingUp}
//               label="Total LOP Days"
//               value={stats.totalLOP}
//               color="from-red-500 to-pink-500"
//               delay={0.3}
//             />
//           </div>

//           {/* Tabs Navigation */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="bg-white rounded-2xl shadow-xl border border-purple-100 p-2"
//           >
//             <div className="flex gap-2 overflow-x-auto">
//               {TABS.map((tab) => {
//                 const Icon = tab.icon;
//                 return (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
//                       activeTab === tab.id
//                         ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
//                         : "text-gray-600 hover:bg-purple-50"
//                     }`}
//                   >
//                     <Icon className="w-5 h-5" />
//                     {tab.label}
//                   </button>
//                 );
//               })}
//             </div>
//           </motion.div>

//           {/* Tab Content */}
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={activeTab}
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               transition={{ duration: 0.3 }}
//             >
//               {renderTabContent()}
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

// // Stats Card Component
// function StatsCard({ icon: Icon, label, value, color, delay, pulse }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{ delay }}
//       className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 overflow-hidden group hover:scale-105 ${
//         pulse ? "animate-pulse" : ""
//       }`}
//     >
//       {/* Gradient Background */}
//       <div
//         className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`}
//       />

//       <div className="relative flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
//           <p className="text-4xl font-bold text-gray-900">{value}</p>
//         </div>
//         <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} shadow-lg`}>
//           <Icon className="w-8 h-8 text-white" />
//         </div>
//       </div>

//       {/* Bottom Accent */}
//       <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`} />
//     </motion.div>
//   );
// }

// // Analytics Tab Component
// function AnalyticsTab({ stats }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8"
//     >
//       <div className="flex items-center gap-3 mb-6">
//         <BarChart3 className="w-8 h-8 text-purple-600" />
//         <h2 className="text-2xl font-bold text-gray-900">Leave Analytics</h2>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Quick Stats */}
//         <div className="space-y-4">
//           <h3 className="font-semibold text-gray-700 mb-4">Quick Overview</h3>
//           <div className="space-y-3">
//             <AnalyticsRow label="Total Active Users" value={stats.totalUsers} />
//             <AnalyticsRow label="Pending Requests" value={stats.pendingApplications} />
//             <AnalyticsRow label="Approved This Month" value={stats.approvedThisMonth} />
//             <AnalyticsRow label="Total LOP Days" value={stats.totalLOP} />
//           </div>
//         </div>

//         {/* Insights */}
//         <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
//           <h3 className="font-semibold text-gray-700 mb-4">Key Insights</h3>
//           <ul className="space-y-3 text-sm text-gray-600">
//             <li className="flex items-start gap-2">
//               <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
//               <span>
//                 <strong>{stats.approvedThisMonth}</strong> leaves approved this month
//               </span>
//             </li>
//             <li className="flex items-start gap-2">
//               <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
//               <span>
//                 <strong>{stats.pendingApplications}</strong> requests awaiting review
//               </span>
//             </li>
//             <li className="flex items-start gap-2">
//               <TrendingUp className="w-5 h-5 text-red-600 mt-0.5" />
//               <span>
//                 <strong>{stats.totalLOP}</strong> total LOP days recorded
//               </span>
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* Placeholder for Charts */}
//       <div className="mt-8 p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-center">
//         <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//         <p className="text-gray-500 font-medium">Charts Coming Soon</p>
//         <p className="text-sm text-gray-400 mt-2">
//           Monthly trends, department-wise stats, and more
//         </p>
//       </div>
//     </motion.div>
//   );
// }

// function AnalyticsRow({ label, value }) {
//   return (
//     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//       <span className="text-sm font-medium text-gray-700">{label}</span>
//       <span className="text-lg font-bold text-purple-600">{value}</span>
//     </div>
//   );
// }


































import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  ClipboardList,
  BarChart3,
  Plus,
  Edit2,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import DashboardLayout from "../../layout/DashboardLayout";
import BulkLeaveCredit from "./BulkLeaveCredit";
import EditLeaveCredits from "./EditLeaveCredits";
import AllLeaveApplications from "./AllLeaveApplications";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TABS = [
  { id: "create", label: "Create Credits", icon: Plus },
  { id: "manage", label: "Manage Credits", icon: Edit2 },
  { id: "applications", label: "Applications", icon: ClipboardList },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function LeaveManagement() {
  const [activeTab, setActiveTab] = useState("create");
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApplications: 0,
    approvedThisMonth: 0,
    totalLOP: 0,
  });
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all required stats
      const [creditsRes, applicationsRes] = await Promise.all([
        axios.get(`${API_URL}/leaves/leave-credits/all`, {
          params: { year: currentYear },
          headers,
        }),
        axios.get(`${API_URL}/leaves/all-applications`, {
          params: { year: currentYear },
          headers,
        }),
      ]);

      const credits = creditsRes.data.data || [];
      const applications = applicationsRes.data.data || [];

      const pending = applications.filter((app) => app.status === "pending").length;
      const approvedThisMonth = applications.filter(
        (app) =>
          app.status === "approved" &&
          new Date(app.appliedAt).getMonth() === new Date().getMonth()
      ).length;
      const totalLOP = credits.reduce((sum, credit) => sum + (credit.lossOfPayCount || 0), 0);

      setStats({
        totalUsers: credits.length,
        pendingApplications: pending,
        approvedThisMonth,
        totalLOP,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "create":
        return <BulkLeaveCredit onSuccess={fetchStats} />;
      case "manage":
        return <EditLeaveCredits />;
      case "applications":
        return <AllLeaveApplications onUpdate={fetchStats} />;
      case "analytics":
        return <AnalyticsTab stats={stats} />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-cyan-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-800">

                Leave Management System
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Manage employee leave credits and applications
              </p>
            </div>
            <button
              onClick={fetchStats}
              className="p-3 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-blue-100"
            >
              <RefreshCw className="w-5 h-5 text-blue-600" />
            </button>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard
              icon={Users}
              label="Total Users"
              value={stats.totalUsers}
              color="from-blue-500 to-cyan-500"
              delay={0}
            />
            <StatsCard
              icon={Clock}
              label="Pending"
              value={stats.pendingApplications}
              color="from-yellow-500 to-orange-500"
              delay={0.1}
              pulse={stats.pendingApplications > 0}
            />
            <StatsCard
              icon={CheckCircle}
              label="Approved (This Month)"
              value={stats.approvedThisMonth}
              color="from-green-500 to-emerald-500"
              delay={0.2}
            />
            <StatsCard
              icon={TrendingUp}
              label="Total LOP Days"
              value={stats.totalLOP}
              color="from-red-500 to-pink-500"
              delay={0.3}
            />
          </div>

          {/* Tabs Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl border border-blue-100 p-2"
          >
            <div className="flex gap-2 overflow-x-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-lg scale-105"
                        : "text-gray-600 hover:bg-blue-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Stats Card Component
function StatsCard({ icon: Icon, label, value, color, delay, pulse }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 overflow-hidden group hover:scale-105 ${
        pulse ? "animate-pulse" : ""
      }`}
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`}
      />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-4xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Bottom Accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`} />
    </motion.div>
  );
}

// Analytics Tab Component
function AnalyticsTab({ stats }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Leave Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 mb-4">Quick Overview</h3>
          <div className="space-y-3">
            <AnalyticsRow label="Total Active Users" value={stats.totalUsers} />
            <AnalyticsRow label="Pending Requests" value={stats.pendingApplications} />
            <AnalyticsRow label="Approved This Month" value={stats.approvedThisMonth} />
            <AnalyticsRow label="Total LOP Days" value={stats.totalLOP} />
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-gray-700 mb-4">Key Insights</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <span>
                <strong>{stats.approvedThisMonth}</strong> leaves approved this month
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <span>
                <strong>{stats.pendingApplications}</strong> requests awaiting review
              </span>
            </li>
            <li className="flex items-start gap-2">
              <TrendingUp className="w-5 h-5 text-red-600 mt-0.5" />
              <span>
                <strong>{stats.totalLOP}</strong> total LOP days recorded
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Placeholder for Charts */}
      <div className="mt-8 p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-center">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Charts Coming Soon</p>
        <p className="text-sm text-gray-400 mt-2">
          Monthly trends, department-wise stats, and more
        </p>
      </div>
    </motion.div>
  );
}

function AnalyticsRow({ label, value }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-lg font-bold text-blue-600">{value}</span>
    </div>
  );
}