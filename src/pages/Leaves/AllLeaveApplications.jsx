// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   ClipboardList,
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
//   Calendar,
// } from "lucide-react";
// import axios from "axios";
// import LeaveDetailsModal from "./components/LeaveDetailsModal";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// const STATUS_COLORS = {
//   pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
//   approved: "bg-green-100 text-green-800 border-green-300",
//   rejected: "bg-red-100 text-red-800 border-red-300",
// };

// export default function AllLeaveApplications({ onUpdate }) {
//   const currentYear = new Date().getFullYear();
//   const [leaves, setLeaves] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [filters, setFilters] = useState({
//     year: currentYear,
//     status: "pending",
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedLeave, setSelectedLeave] = useState(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showRejectModal, setShowRejectModal] = useState(false);

//   useEffect(() => {
//     fetchLeaves();
//   }, [filters]);

//   const fetchLeaves = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const endpoint = filters.status === "pending"
//         ? "/leaves/pending-applications"
//         : "/leaves/all-applications";

//       const params = filters.status !== "pending" ? filters : { year: filters.year };

//       const res = await axios.get(`${API_URL}${endpoint}`, {
//         params,
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setLeaves(res.data.data || []);
//     } catch (err) {
//       console.error("Error fetching leaves:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAction = async (leaveId, status, rejectionReason = "") => {
//     setActionLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `${API_URL}/leaves/applications/${leaveId}/status`,
//         { status, rejectionReason },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       await fetchLeaves();
//       setShowRejectModal(false);
//       setSelectedLeave(null);
//       if (onUpdate) onUpdate();

//       alert("✅ Leave " + status + " successfully!");
//     } catch (err) {
//       alert(err.response?.data?.message || "❌ Failed to update leave");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const filteredLeaves = leaves.filter(
//     (leave) =>
//       leave.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       leave.email?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const stats = {
//     pending: leaves.filter((l) => l.status === "pending").length,
//     approved: leaves.filter((l) => l.status === "approved").length,
//     rejected: leaves.filter((l) => l.status === "rejected").length,
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="space-y-6"
//     >
//       {/* Header Card */}
//       <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
//         <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-6">
//           <div className="flex items-center gap-3">
//             <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
//               <ClipboardList className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-white">Leave Applications</h2>
//               <p className="text-white/90 text-sm mt-1">Review and manage employee requests</p>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="p-6 bg-gray-50 border-b border-gray-200 space-y-4">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search by name or email..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
//               />
//             </div>

//             {/* Year Filter */}
//             <select
//               value={filters.year}
//               onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
//               className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
//             >
//               {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
//                 <option key={y} value={y}>{y}</option>
//               ))}
//             </select>

//             {/* Status Filter */}
//             <select
//               value={filters.status}
//               onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//               className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
//             >
//               <option value="pending">Pending</option>
//               <option value="all">All Status</option>
//               <option value="approved">Approved</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>

//           {/* Quick Stats */}
//           <div className="grid grid-cols-3 gap-4">
//             <div className="bg-yellow-50 rounded-lg p-3 border-2 border-yellow-200">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-yellow-700">Pending</span>
//                 <span className="text-2xl font-bold text-yellow-800">{stats.pending}</span>
//               </div>
//             </div>
//             <div className="bg-green-50 rounded-lg p-3 border-2 border-green-200">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-green-700">Approved</span>
//                 <span className="text-2xl font-bold text-green-800">{stats.approved}</span>
//               </div>
//             </div>
//             <div className="bg-red-50 rounded-lg p-3 border-2 border-red-200">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-red-700">Rejected</span>
//                 <span className="text-2xl font-bold text-red-800">{stats.rejected}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
//               <tr>
//                 <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Employee</th>
//                 <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Leave Type</th>
//                 <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Dates</th>
//                 <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Duration</th>
//                 <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
//                 <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {loading ? (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-12 text-center">
//                     <div className="flex justify-center">
//                       <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
//                     </div>
//                   </td>
//                 </tr>
//               ) : filteredLeaves.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
//                     <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
//                     <p>No applications found</p>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredLeaves.map((leave, index) => (
//                   <motion.tr
//                     key={leave._id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.03 }}
//                     className="hover:bg-purple-50/30 transition-colors"
//                   >
//                     <td className="px-4 py-4">
//                       <div>
//                         <p className="font-semibold text-gray-900">{leave.name}</p>
//                         <p className="text-xs text-gray-500">{leave.email}</p>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4">
//                       <div className="flex items-center gap-2">
//                         {leave.durationType === "halfday-morning" ? (
//                           <Sunrise className="w-4 h-4 text-yellow-500" />
//                         ) : leave.durationType === "halfday-evening" ? (
//                           <Sunset className="w-4 h-4 text-purple-500" />
//                         ) : (
//                           <Sun className="w-4 h-4 text-orange-500" />
//                         )}
//                         <span className="text-sm font-medium">{leave.leaveCategory}</span>
//                       </div>
//                       {leave.isLossOfPay && (
//                         <span className="text-xs text-orange-600 font-bold flex items-center gap-1 mt-1">
//                           <AlertCircle className="w-3 h-3" />
//                           LOP
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-4 py-4 text-sm text-gray-700">
//                       {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-4">
//                       <span className="text-sm font-bold text-purple-600">{leave.leaveDays} day(s)</span>
//                     </td>
//                     <td className="px-4 py-4">
//                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border-2 ${STATUS_COLORS[leave.status]}`}>
//                         {leave.status === "approved" && <CheckCircle className="w-3 h-3" />}
//                         {leave.status === "rejected" && <XCircle className="w-3 h-3" />}
//                         {leave.status === "pending" && <Clock className="w-3 h-3" />}
//                         {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4">
//                       <div className="flex gap-2 justify-center">
//                         {leave.status === "pending" ? (
//                           <>
//                             <button
//                               onClick={() => handleAction(leave._id, "approved")}
//                               disabled={actionLoading}
//                               className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
//                               title="Approve"
//                             >
//                               <CheckCircle className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => {
//                                 setSelectedLeave(leave);
//                                 setShowRejectModal(true);
//                               }}
//                               disabled={actionLoading}
//                               className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
//                               title="Reject"
//                             >
//                               <XCircle className="w-4 h-4" />
//                             </button>
//                           </>
//                         ) : (
//                           <span className="text-xs text-gray-400">{leave.status}</span>
//                         )}
//                         <button
//                           onClick={() => {
//                             setSelectedLeave(leave);
//                             setShowDetailsModal(true);
//                           }}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                           title="View Details"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </motion.tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modals */}
//       {showDetailsModal && selectedLeave && (
//         <LeaveDetailsModal
//           leave={selectedLeave}
//           onClose={() => {
//             setShowDetailsModal(false);
//             setSelectedLeave(null);
//           }}
//         />
//       )}

//       {showRejectModal && selectedLeave && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
//           >
//             <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//               <XCircle className="text-red-600" />
//               Reject Leave Application
//             </h3>
//             <p className="text-gray-600 mb-4">
//               Are you sure you want to reject leave for <strong>{selectedLeave.name}</strong>?
//             </p>
//             <textarea
//               placeholder="Reason for rejection (optional)"
//               className="w-full border-2 border-gray-300 rounded-lg p-3 mb-4 focus:border-red-500 focus:ring-4 focus:ring-red-100"
//               rows={3}
//               id="rejection-reason"
//             />
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowRejectModal(false)}
//                 className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => {
//                   const reason = document.getElementById("rejection-reason").value;
//                   handleAction(selectedLeave._id, "rejected", reason);
//                 }}
//                 disabled={actionLoading}
//                 className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
//               >
//                 {actionLoading ? "Rejecting..." : "Confirm Reject"}
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </motion.div>
//   );
// }









































// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   ClipboardList,
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
//   Calendar,
// } from "lucide-react";
// import axios from "axios";
// import LeaveDetailsModal from "./components/LeaveDetailsModal";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// const STATUS_COLORS = {
//   pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
//   approved: "bg-green-100 text-green-800 border-green-300",
//   rejected: "bg-red-100 text-red-800 border-red-300",
// };

// export default function AllLeaveApplications({ onUpdate }) {
//   const currentYear = new Date().getFullYear();
//   const [leaves, setLeaves] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [filters, setFilters] = useState({
//     year: currentYear,
//     status: "pending",
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedLeave, setSelectedLeave] = useState(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showRejectModal, setShowRejectModal] = useState(false);

//   useEffect(() => {
//     fetchLeaves();
//   }, [filters]);

//   const fetchLeaves = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const endpoint = filters.status === "pending"
//         ? "/leaves/pending-applications"
//         : "/leaves/all-applications";

//       const params = filters.status !== "pending" ? filters : { year: filters.year };

//       const res = await axios.get(`${API_URL}${endpoint}`, {
//         params,
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setLeaves(res.data.data || []);
//     } catch (err) {
//       console.error("Error fetching leaves:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAction = async (leaveId, status, rejectionReason = "") => {
//     setActionLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `${API_URL}/leaves/applications/${leaveId}/status`,
//         { status, rejectionReason },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       await fetchLeaves();
//       setShowRejectModal(false);
//       setSelectedLeave(null);
//       if (onUpdate) onUpdate();

//       alert("✅ Leave " + status + " successfully!");
//     } catch (err) {
//       alert(err.response?.data?.message || "❌ Failed to update leave");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const filteredLeaves = leaves.filter(
//     (leave) =>
//       leave.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       leave.email?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const stats = {
//     pending: leaves.filter((l) => l.status === "pending").length,
//     approved: leaves.filter((l) => l.status === "approved").length,
//     rejected: leaves.filter((l) => l.status === "rejected").length,
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="space-y-6"
//     >
//       {/* Header Card */}
//       <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
//         <div className="bg-blue-600 px-8 py-6">
//           <div className="flex items-center gap-3">
//             <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
//               <ClipboardList className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-white">Leave Applications</h2>
//               <p className="text-white/90 text-sm mt-1">Review and manage employee requests</p>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="p-6 bg-gray-50 border-b border-gray-200 space-y-4">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search by name or email..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
//               />
//             </div>

//             {/* Year Filter */}
//             <select
//               value={filters.year}
//               onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
//               className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
//             >
//               {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
//                 <option key={y} value={y}>{y}</option>
//               ))}
//             </select>

//             {/* Status Filter */}
//             <select
//               value={filters.status}
//               onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//               className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
//             >
//               <option value="pending">Pending</option>
//               <option value="all">All Status</option>
//               <option value="approved">Approved</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>

//           {/* Quick Stats */}
//           <div className="grid grid-cols-3 gap-4">
//             <div className="bg-yellow-50 rounded-lg p-3 border-2 border-yellow-200">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-yellow-700">Pending</span>
//                 <span className="text-2xl font-bold text-yellow-800">{stats.pending}</span>
//               </div>
//             </div>
//             <div className="bg-green-50 rounded-lg p-3 border-2 border-green-200">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-green-700">Approved</span>
//                 <span className="text-2xl font-bold text-green-800">{stats.approved}</span>
//               </div>
//             </div>
//             <div className="bg-red-50 rounded-lg p-3 border-2 border-red-200">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-red-700">Rejected</span>
//                 <span className="text-2xl font-bold text-red-800">{stats.rejected}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
//               <tr>
//                 <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Employee</th>
//                 <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Leave Type</th>
//                 <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Dates</th>
//                 <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Duration</th>
//                 <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
//                 <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {loading ? (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-12 text-center">
//                     <div className="flex justify-center">
//                       <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
//                     </div>
//                   </td>
//                 </tr>
//               ) : filteredLeaves.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
//                     <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
//                     <p>No applications found</p>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredLeaves.map((leave, index) => (
//                   <motion.tr
//                     key={leave._id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.03 }}
//                     className="hover:bg-blue-50/30 transition-colors"
//                   >
//                     <td className="px-4 py-4">
//                       <div>
//                         <p className="font-semibold text-gray-900">{leave.name}</p>
//                         <p className="text-xs text-gray-500">{leave.email}</p>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4">
//                       <div className="flex items-center gap-2">
//                         {leave.durationType === "halfday-morning" ? (
//                           <Sunrise className="w-4 h-4 text-yellow-500" />
//                         ) : leave.durationType === "halfday-evening" ? (
//                           <Sunset className="w-4 h-4 text-blue-500" />
//                         ) : (
//                           <Sun className="w-4 h-4 text-orange-500" />
//                         )}
//                         <span className="text-sm font-medium">{leave.leaveCategory}</span>
//                       </div>
//                       {leave.isLossOfPay && (
//                         <span className="text-xs text-orange-600 font-bold flex items-center gap-1 mt-1">
//                           <AlertCircle className="w-3 h-3" />
//                           LOP
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-4 py-4 text-sm text-gray-700">
//                       {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-4">
//                       <span className="text-sm font-bold text-blue-600">{leave.leaveDays} day(s)</span>
//                     </td>
//                     <td className="px-4 py-4">
//                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border-2 ${STATUS_COLORS[leave.status]}`}>
//                         {leave.status === "approved" && <CheckCircle className="w-3 h-3" />}
//                         {leave.status === "rejected" && <XCircle className="w-3 h-3" />}
//                         {leave.status === "pending" && <Clock className="w-3 h-3" />}
//                         {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4">
//                       <div className="flex gap-2 justify-center">
//                         {leave.status === "pending" ? (
//                           <>
//                             <button
//                               onClick={() => handleAction(leave._id, "approved")}
//                               disabled={actionLoading}
//                               className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
//                               title="Approve"
//                             >
//                               <CheckCircle className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => {
//                                 setSelectedLeave(leave);
//                                 setShowRejectModal(true);
//                               }}
//                               disabled={actionLoading}
//                               className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
//                               title="Reject"
//                             >
//                               <XCircle className="w-4 h-4" />
//                             </button>
//                           </>
//                         ) : (
//                           <span className="text-xs text-gray-400">{leave.status}</span>
//                         )}
//                         <button
//                           onClick={() => {
//                             setSelectedLeave(leave);
//                             setShowDetailsModal(true);
//                           }}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                           title="View Details"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </motion.tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modals */}
//       {showDetailsModal && selectedLeave && (
//         <LeaveDetailsModal
//           leave={selectedLeave}
//           onClose={() => {
//             setShowDetailsModal(false);
//             setSelectedLeave(null);
//           }}
//         />
//       )}

//       {showRejectModal && selectedLeave && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
//           >
//             <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//               <XCircle className="text-red-600" />
//               Reject Leave Application
//             </h3>
//             <p className="text-gray-600 mb-4">
//               Are you sure you want to reject leave for <strong>{selectedLeave.name}</strong>?
//             </p>
//             <textarea
//               placeholder="Reason for rejection (optional)"
//               className="w-full border-2 border-gray-300 rounded-lg p-3 mb-4 focus:border-red-500 focus:ring-4 focus:ring-red-100"
//               rows={3}
//               id="rejection-reason"
//             />
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowRejectModal(false)}
//                 className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => {
//                   const reason = document.getElementById("rejection-reason").value;
//                   handleAction(selectedLeave._id, "rejected", reason);
//                 }}
//                 disabled={actionLoading}
//                 className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
//               >
//                 {actionLoading ? "Rejecting..." : "Confirm Reject"}
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </motion.div>
//   );
// }


















import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
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
  Calendar,
} from "lucide-react";
import axios from "axios";
import LeaveDetailsModal from "./components/LeaveDetailsModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  approved: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
};

export default function AllLeaveApplications({ onUpdate }) {
  const currentYear = new Date().getFullYear();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [filters, setFilters] = useState({
    year: currentYear,
    status: "pending",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, [filters]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const endpoint = filters.status === "pending"
        ? "/leaves/pending-applications"
        : "/leaves/all-applications";

      const params = filters.status !== "pending" ? filters : { year: filters.year };

      const res = await axios.get(`${API_URL}${endpoint}`, {
        params,
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

  const handleAction = async (leaveId, status, rejectionReason = "") => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/leaves/applications/${leaveId}/status`,
        { status, rejectionReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchLeaves();
      setShowRejectModal(false);
      setSelectedLeave(null);
      if (onUpdate) onUpdate();

      alert("✅ Leave " + status + " successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Failed to update leave");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredLeaves = leaves.filter(
    (leave) =>
      leave.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    pending: leaves.filter((l) => l.status === "pending").length,
    approved: leaves.filter((l) => l.status === "approved").length,
    rejected: leaves.filter((l) => l.status === "rejected").length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
        <div className="bg-blue-600 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Leave Applications</h2>
              <p className="text-white/90 text-sm mt-1">Review and manage employee requests (Recent First)</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 bg-gray-50 border-b border-gray-200 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Year Filter */}
            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            >
              {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            >
              <option value="pending">Pending</option>
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-yellow-50 rounded-lg p-3 border-2 border-yellow-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-700">Pending</span>
                <span className="text-2xl font-bold text-yellow-800">{stats.pending}</span>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border-2 border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-700">Approved</span>
                <span className="text-2xl font-bold text-green-800">{stats.approved}</span>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 border-2 border-red-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-700">Rejected</span>
                <span className="text-2xl font-bold text-red-800">{stats.rejected}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Employee</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Leave Type</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Dates</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Duration</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase">Actions</th>
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
              ) : filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No applications found</p>
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave, index) => (
                  <motion.tr
                    key={leave._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{leave.name}</p>
                        <p className="text-xs text-gray-500">{leave.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {leave.durationType === "halfday-morning" ? (
                          <Sunrise className="w-4 h-4 text-yellow-500" />
                        ) : leave.durationType === "halfday-evening" ? (
                          <Sunset className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Sun className="w-4 h-4 text-orange-500" />
                        )}
                        <span className="text-sm font-medium">{leave.leaveCategory}</span>
                      </div>
                      {leave.isLossOfPay && (
                        <span className="text-xs text-orange-600 font-bold flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3" />
                          LOP
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-blue-600">{leave.leaveDays} day(s)</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border-2 ${STATUS_COLORS[leave.status]}`}>
                        {leave.status === "approved" && <CheckCircle className="w-3 h-3" />}
                        {leave.status === "rejected" && <XCircle className="w-3 h-3" />}
                        {leave.status === "pending" && <Clock className="w-3 h-3" />}
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2 justify-center">
                        {leave.status === "pending" ? (
                          <>
                            <button
                              onClick={() => handleAction(leave._id, "approved")}
                              disabled={actionLoading}
                              className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedLeave(leave);
                                setShowRejectModal(true);
                              }}
                              disabled={actionLoading}
                              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">{leave.status}</span>
                        )}
                        <button
                          onClick={() => {
                            setSelectedLeave(leave);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showDetailsModal && selectedLeave && (
        <LeaveDetailsModal
          leave={selectedLeave}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedLeave(null);
          }}
        />
      )}

      {showRejectModal && selectedLeave && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <XCircle className="text-red-600" />
              Reject Leave Application
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to reject leave for <strong>{selectedLeave.name}</strong>?
            </p>
            <textarea
              placeholder="Reason for rejection (optional)"
              className="w-full border-2 border-gray-300 rounded-lg p-3 mb-4 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              rows={3}
              id="rejection-reason"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const reason = document.getElementById("rejection-reason").value;
                  handleAction(selectedLeave._id, "rejected", reason);
                }}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
              >
                {actionLoading ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}