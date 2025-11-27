// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   Calendar,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Filter,
//   Search,
//   Eye,
//   AlertCircle,
//   Sun,
//   Sunrise,
//   Sunset,
//   TrendingUp,
// } from "lucide-react";
// import axios from "axios";
// import LeaveDetailsModal from "./components/LeaveDetailsModal";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// const STATUS_COLORS = {
//   pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
//   approved: "bg-green-100 text-green-800 border-green-300",
//   rejected: "bg-red-100 text-red-800 border-red-300",
// };

// export default function MyLeaveHistory({ onLeaveUpdate }) {
//   const currentYear = new Date().getFullYear();
//   const [leaves, setLeaves] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState({
//     year: currentYear,
//     status: "all",
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedLeave, setSelectedLeave] = useState(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);

//   useEffect(() => {
//     fetchLeaves();
//   }, [filters]);

//   const fetchLeaves = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${API_URL}/leaves/my-applications`, {
//         params: filters.status === "all" ? { year: filters.year } : filters,
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setLeaves(res.data.data || []);
//     } catch (err) {
//       console.error("Error fetching leaves:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getLeaveTypeIcon = (durationType) => {
//     if (durationType === "halfday-morning") return <Sunrise className="w-4 h-4 text-yellow-500" />;
//     if (durationType === "halfday-evening") return <Sunset className="w-4 h-4 text-purple-500" />;
//     return <Sun className="w-4 h-4 text-orange-500" />;
//   };

//   const getLeaveTypeText = (durationType) => {
//     if (durationType === "halfday-morning") return "Half Day - Morning";
//     if (durationType === "halfday-evening") return "Half Day - Evening";
//     return "Full Day";
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const stats = {
//     total: leaves.length,
//     pending: leaves.filter((l) => l.status === "pending").length,
//     approved: leaves.filter((l) => l.status === "approved").length,
//     rejected: leaves.filter((l) => l.status === "rejected").length,
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden"
//     >
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 px-8 py-6">
//         <div className="flex items-center gap-3">
//           <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
//             <Calendar className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-white">My Leave Applications</h2>
//             <p className="text-white/90 text-sm mt-1">Track all your leave requests and their status</p>
//           </div>
//         </div>
//       </div>

//       {/* Filters & Search */}
//       <div className="p-6 bg-gray-50 border-b border-gray-200 space-y-4">
//         <div className="flex flex-col md:flex-row gap-4">
//           {/* Search */}
//           <div className="flex-1 relative">
//             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Search leaves..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all"
//             />
//           </div>

//           {/* Filters */}
//           <select
//             value={filters.year}
//             onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
//             className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all"
//           >
//             {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
//               <option key={y} value={y}>{y}</option>
//             ))}
//           </select>

//           <select
//             value={filters.status}
//             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//             className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all"
//           >
//             <option value="all">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="approved">Approved</option>
//             <option value="rejected">Rejected</option>
//           </select>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//           <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-blue-700">Total</span>
//               <span className="text-xl font-bold text-blue-800">{stats.total}</span>
//             </div>
//           </div>
//           <div className="bg-yellow-50 rounded-lg p-3 border-2 border-yellow-200">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-yellow-700">Pending</span>
//               <span className="text-xl font-bold text-yellow-800">{stats.pending}</span>
//             </div>
//           </div>
//           <div className="bg-green-50 rounded-lg p-3 border-2 border-green-200">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-green-700">Approved</span>
//               <span className="text-xl font-bold text-green-800">{stats.approved}</span>
//             </div>
//           </div>
//           <div className="bg-red-50 rounded-lg p-3 border-2 border-red-200">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-red-700">Rejected</span>
//               <span className="text-xl font-bold text-red-800">{stats.rejected}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
//             <tr>
//               <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Type</th>
//               <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Dates</th>
//               <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Duration</th>
//               <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
//               <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Applied On</th>
//               <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase">Details</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {loading ? (
//               <tr>
//                 <td colSpan="6" className="px-6 py-12 text-center">
//                   <div className="flex justify-center">
//                     <div className="animate-spin w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full" />
//                   </div>
//                 </td>
//               </tr>
//             ) : leaves.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
//                   <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
//                   <p className="text-lg font-medium">No leave applications found</p>
//                   <p className="text-sm">You haven't applied for any leaves yet</p>
//                 </td>
//               </tr>
//             ) : (
//               leaves.map((leave, index) => (
//                 <motion.tr
//                   key={leave._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.03 }}
//                   className="hover:bg-cyan-50/30 transition-colors"
//                 >
//                   <td className="px-4 py-4">
//                     <div className="flex items-center gap-2">
//                       {getLeaveTypeIcon(leave.durationType)}
//                       <div className="flex flex-col">
//                         <span className="text-sm font-medium text-gray-800">
//                           {leave.leaveCategory}
//                         </span>
//                         <span className="text-xs text-gray-500">
//                           {getLeaveTypeText(leave.durationType)}
//                         </span>
//                       </div>
//                     </div>
//                     {leave.isLossOfPay && (
//                       <span className="text-xs text-orange-600 font-bold flex items-center gap-1 mt-1">
//                         <AlertCircle className="w-3 h-3" />
//                         LOP: {leave.lossOfPayCount || 0} day(s)
//                       </span>
//                     )}
//                   </td>

//                   <td className="px-4 py-4 text-sm text-gray-700">
//                     <div className="flex flex-col">
//                       <span>{formatDate(leave.fromDate)}</span>
//                       <span className="text-xs text-gray-500">to</span>
//                       <span>{formatDate(leave.toDate)}</span>
//                     </div>
//                   </td>

//                   <td className="px-4 py-4">
//                     <span className="text-sm font-bold text-cyan-600">
//                       {(leave.leaveDays || leave.hours / 8).toFixed(1)} day(s)
//                     </span>
//                   </td>

//                   <td className="px-4 py-4">
//                     <span
//                       className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border-2 ${
//                         STATUS_COLORS[leave.status]
//                       }`}
//                     >
//                       {leave.status === "approved" && <CheckCircle className="w-3 h-3" />}
//                       {leave.status === "rejected" && <XCircle className="w-3 h-3" />}
//                       {leave.status === "pending" && <Clock className="w-3 h-3" />}
//                       {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
//                     </span>
//                   </td>

//                   <td className="px-4 py-4 text-sm text-gray-600">
//                     {formatDate(leave.appliedAt)}
//                   </td>

//                   <td className="px-4 py-4">
//                     <button
//                       onClick={() => {
//                         setSelectedLeave(leave);
//                         setShowDetailsModal(true);
//                       }}
//                       className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mx-auto block"
//                       title="View Details"
//                     >
//                       <Eye className="w-4 h-4" />
//                     </button>
//                   </td>
//                 </motion.tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Details Modal */}
//       {showDetailsModal && selectedLeave && (
//         <LeaveDetailsModal
//           leave={selectedLeave}
//           onClose={() => {
//             setShowDetailsModal(false);
//             setSelectedLeave(null);
//           }}
//         />
//       )}
//     </motion.div>
//   );
// }



























// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   Calendar,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Filter,
//   Search,
//   Eye,
//   AlertCircle,
//   Sun,
//   Sunrise,
//   Sunset,
//   TrendingUp,
// } from "lucide-react";
// import axios from "axios";
// import LeaveDetailsModal from "./components/LeaveDetailsModal";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// const STATUS_COLORS = {
//   pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
//   approved: "bg-green-100 text-green-800 border-green-300",
//   rejected: "bg-red-100 text-red-800 border-red-300",
// };

// export default function MyLeaveHistory({ onLeaveUpdate }) {
//   const currentYear = new Date().getFullYear();
//   const [leaves, setLeaves] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState({
//     year: currentYear,
//     status: "all",
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedLeave, setSelectedLeave] = useState(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);

//   useEffect(() => {
//     fetchLeaves();
//   }, [filters]);

//   const fetchLeaves = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${API_URL}/leaves/my-applications`, {
//         params: filters.status === "all" ? { year: filters.year } : filters,
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setLeaves(res.data.data || []);
//     } catch (err) {
//       console.error("Error fetching leaves:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getLeaveTypeIcon = (durationType) => {
//     if (durationType === "halfday-morning") return <Sunrise className="w-4 h-4 text-yellow-500" />;
//     if (durationType === "halfday-evening") return <Sunset className="w-4 h-4 text-purple-500" />;
//     return <Sun className="w-4 h-4 text-orange-500" />;
//   };

//   const getLeaveTypeText = (durationType) => {
//     if (durationType === "halfday-morning") return "Half Day - Morning";
//     if (durationType === "halfday-evening") return "Half Day - Evening";
//     return "Full Day";
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const stats = {
//     total: leaves.length,
//     pending: leaves.filter((l) => l.status === "pending").length,
//     approved: leaves.filter((l) => l.status === "approved").length,
//     rejected: leaves.filter((l) => l.status === "rejected").length,
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
//     >
//       {/* Header */}
//       <div className="bg-blue-600 px-8 py-6">
//         <div className="flex items-center gap-3">
//           <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
//             <Calendar className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-white">My Leave Applications</h2>
//             <p className="text-white/90 text-sm mt-1">Track all your leave requests and their status</p>
//           </div>
//         </div>
//       </div>

//       {/* Filters & Search */}
//       <div className="p-6 bg-gray-50 border-b border-gray-200 space-y-4">
//         <div className="flex flex-col md:flex-row gap-4">
//           {/* Search */}
//           <div className="flex-1 relative">
//             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Search leaves..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
//             />
//           </div>

//           {/* Filters */}
//           <select
//             value={filters.year}
//             onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
//             className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
//           >
//             {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
//               <option key={y} value={y}>{y}</option>
//             ))}
//           </select>

//           <select
//             value={filters.status}
//             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//             className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
//           >
//             <option value="all">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="approved">Approved</option>
//             <option value="rejected">Rejected</option>
//           </select>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//           <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-blue-700">Total</span>
//               <span className="text-xl font-bold text-blue-800">{stats.total}</span>
//             </div>
//           </div>
//           <div className="bg-yellow-50 rounded-lg p-3 border-2 border-yellow-200">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-yellow-700">Pending</span>
//               <span className="text-xl font-bold text-yellow-800">{stats.pending}</span>
//             </div>
//           </div>
//           <div className="bg-green-50 rounded-lg p-3 border-2 border-green-200">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-green-700">Approved</span>
//               <span className="text-xl font-bold text-green-800">{stats.approved}</span>
//             </div>
//           </div>
//           <div className="bg-red-50 rounded-lg p-3 border-2 border-red-200">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-red-700">Rejected</span>
//               <span className="text-xl font-bold text-red-800">{stats.rejected}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
//             <tr>
//               <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Type</th>
//               <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Dates</th>
//               <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Duration</th>
//               <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
//               <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Applied On</th>
//               <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase">Details</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {loading ? (
//               <tr>
//                 <td colSpan="6" className="px-6 py-12 text-center">
//                   <div className="flex justify-center">
//                     <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
//                   </div>
//                 </td>
//               </tr>
//             ) : leaves.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
//                   <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
//                   <p className="text-lg font-medium">No leave applications found</p>
//                   <p className="text-sm">You haven't applied for any leaves yet</p>
//                 </td>
//               </tr>
//             ) : (
//               leaves.map((leave, index) => (
//                 <motion.tr
//                   key={leave._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.03 }}
//                   className="hover:bg-blue-50/30 transition-colors"
//                 >
//                   <td className="px-4 py-4">
//                     <div className="flex items-center gap-2">
//                       {getLeaveTypeIcon(leave.durationType)}
//                       <div className="flex flex-col">
//                         <span className="text-sm font-medium text-gray-800">
//                           {leave.leaveCategory}
//                         </span>
//                         <span className="text-xs text-gray-500">
//                           {getLeaveTypeText(leave.durationType)}
//                         </span>
//                       </div>
//                     </div>
//                     {leave.isLossOfPay && (
//                       <span className="text-xs text-orange-600 font-bold flex items-center gap-1 mt-1">
//                         <AlertCircle className="w-3 h-3" />
//                         LOP: {leave.lossOfPayCount || 0} day(s)
//                       </span>
//                     )}
//                   </td>

//                   <td className="px-4 py-4 text-sm text-gray-700">
//                     <div className="flex flex-col">
//                       <span>{formatDate(leave.fromDate)}</span>
//                       <span className="text-xs text-gray-500">to</span>
//                       <span>{formatDate(leave.toDate)}</span>
//                     </div>
//                   </td>

//                   <td className="px-4 py-4">
//                     <span className="text-sm font-bold text-blue-600">
//                       {(leave.leaveDays || leave.hours / 8).toFixed(1)} day(s)
//                     </span>
//                   </td>

//                   <td className="px-4 py-4">
//                     <span
//                       className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border-2 ${
//                         STATUS_COLORS[leave.status]
//                       }`}
//                     >
//                       {leave.status === "approved" && <CheckCircle className="w-3 h-3" />}
//                       {leave.status === "rejected" && <XCircle className="w-3 h-3" />}
//                       {leave.status === "pending" && <Clock className="w-3 h-3" />}
//                       {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
//                     </span>
//                   </td>

//                   <td className="px-4 py-4 text-sm text-gray-600">
//                     {formatDate(leave.appliedAt)}
//                   </td>

//                   <td className="px-4 py-4">
//                     <button
//                       onClick={() => {
//                         setSelectedLeave(leave);
//                         setShowDetailsModal(true);
//                       }}
//                       className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mx-auto block"
//                       title="View Details"
//                     >
//                       <Eye className="w-4 h-4" />
//                     </button>
//                   </td>
//                 </motion.tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Details Modal */}
//       {showDetailsModal && selectedLeave && (
//         <LeaveDetailsModal
//           leave={selectedLeave}
//           onClose={() => {
//             setShowDetailsModal(false);
//             setSelectedLeave(null);
//           }}
//         />
//       )}
//     </motion.div>
//   );
// }


























import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Eye,
  AlertCircle,
  Sun,
  Sunrise,
  Sunset,
  TrendingUp,
} from "lucide-react";
import axios from "axios";
import LeaveDetailsModal from "./components/LeaveDetailsModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  approved: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
};

export default function MyLeaveHistory({ onLeaveUpdate }) {
  const currentYear = new Date().getFullYear();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    year: currentYear,
    status: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, [filters]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/leaves/my-applications`, {
        params: filters.status === "all" ? { year: filters.year } : filters,
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Sort by appliedAt date in descending order (most recent first)
      const sortedLeaves = (res.data.data || []).sort((a, b) => {
        return new Date(b.appliedAt) - new Date(a.appliedAt);
      });
      
      setLeaves(sortedLeaves);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  const getLeaveTypeIcon = (durationType) => {
    if (durationType === "halfday-morning") return <Sunrise className="w-4 h-4 text-yellow-500" />;
    if (durationType === "halfday-evening") return <Sunset className="w-4 h-4 text-purple-500" />;
    return <Sun className="w-4 h-4 text-orange-500" />;
  };

  const getLeaveTypeText = (durationType) => {
    if (durationType === "halfday-morning") return "Half Day - Morning";
    if (durationType === "halfday-evening") return "Half Day - Evening";
    return "Full Day";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stats = {
    total: leaves.length,
    pending: leaves.filter((l) => l.status === "pending").length,
    approved: leaves.filter((l) => l.status === "approved").length,
    rejected: leaves.filter((l) => l.status === "rejected").length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-blue-600 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">My Leave Applications</h2>
            <p className="text-white/90 text-sm mt-1">Track all your leave requests (Recent First)</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-6 bg-gray-50 border-b border-gray-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search leaves..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Filters */}
          <select
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
          >
            {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-700">Total</span>
              <span className="text-xl font-bold text-blue-800">{stats.total}</span>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 border-2 border-yellow-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-yellow-700">Pending</span>
              <span className="text-xl font-bold text-yellow-800">{stats.pending}</span>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-green-700">Approved</span>
              <span className="text-xl font-bold text-green-800">{stats.approved}</span>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 border-2 border-red-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-red-700">Rejected</span>
              <span className="text-xl font-bold text-red-800">{stats.rejected}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Type</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Dates</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Duration</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Applied On</th>
              <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
                  </div>
                </td>
              </tr>
            ) : leaves.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">No leave applications found</p>
                  <p className="text-sm">You haven't applied for any leaves yet</p>
                </td>
              </tr>
            ) : (
              leaves.map((leave, index) => (
                <motion.tr
                  key={leave._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {getLeaveTypeIcon(leave.durationType)}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800">
                          {leave.leaveCategory}
                        </span>
                        <span className="text-xs text-gray-500">
                          {getLeaveTypeText(leave.durationType)}
                        </span>
                      </div>
                    </div>
                    {leave.isLossOfPay && (
                      <span className="text-xs text-orange-600 font-bold flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        LOP: {leave.lossOfPayCount || 0} day(s)
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-700">
                    <div className="flex flex-col">
                      <span>{formatDate(leave.fromDate)}</span>
                      <span className="text-xs text-gray-500">to</span>
                      <span>{formatDate(leave.toDate)}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-sm font-bold text-blue-600">
                      {(leave.leaveDays || leave.hours / 8).toFixed(1)} day(s)
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border-2 ${
                        STATUS_COLORS[leave.status]
                      }`}
                    >
                      {leave.status === "approved" && <CheckCircle className="w-3 h-3" />}
                      {leave.status === "rejected" && <XCircle className="w-3 h-3" />}
                      {leave.status === "pending" && <Clock className="w-3 h-3" />}
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {formatDate(leave.appliedAt)}
                  </td>

                  <td className="px-4 py-4">
                    <button
                      onClick={() => {
                        setSelectedLeave(leave);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mx-auto block"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedLeave && (
        <LeaveDetailsModal
          leave={selectedLeave}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedLeave(null);
          }}
        />
      )}
    </motion.div>
  );
}