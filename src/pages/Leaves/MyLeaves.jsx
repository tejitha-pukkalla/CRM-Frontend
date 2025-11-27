// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Calendar,
//   Plus,
//   RefreshCw,
//   Briefcase,
//   AlertTriangle,
//   Heart,
//   UserX,
//   CheckCircle2,
//   XCircle,
//   History,
//   ChevronDown,
//   ChevronUp,
//   TrendingUp,
// } from "lucide-react";
// import axios from "axios";
// import DashboardLayout from "../../layout/DashboardLayout";
// import { useAuth } from "../../hooks/useAuth";
// import ApplyLeaveModal from "./components/ApplyLeaveModal";
// import MyLeaveHistory from "./MyLeaveHistory";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// export default function MyLeaves() {
//   const { user } = useAuth();
//   const currentYear = new Date().getFullYear();
//   const [year, setYear] = useState(currentYear);
//   const [credit, setCredit] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [showHistory, setShowHistory] = useState(false);

//   useEffect(() => {
//     fetchCredit();
//   }, [year]);

//   const fetchCredit = async (silent = false) => {
//     if (!silent) setLoading(true);
//     setError("");
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${API_URL}/leaves/myleave-credits`, {
//         params: { year },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCredit(res.data.data || null);
//     } catch (err) {
//       console.error("Error fetching leave credit:", err);
//       setError("Failed to fetch your leave credit");
//     } finally {
//       if (!silent) setLoading(false);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchCredit(true);
//     setTimeout(() => setRefreshing(false), 500);
//   };

//   const handleLeaveSuccess = () => {
//     setShowModal(false);
//     fetchCredit(true);
//   };

//   const remainingAnnual = credit ? credit.annualLeave.total - credit.annualLeave.used : 0;
//   const remainingSick = credit ? credit.sickLeave.total - credit.sickLeave.used : 0;
//   const remainingMaternity = credit ? credit.maternityLeave.total - credit.maternityLeave.used : 0;
//   const remainingBereavement = credit ? credit.bereavementLeave.total - credit.bereavementLeave.used : 0;

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
//                 My Leave Dashboard
//               </h1>
//               <p className="text-gray-600 mt-2 text-lg">View your leave balance and apply for leaves</p>
//             </div>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={handleRefresh}
//                 disabled={refreshing}
//                 className="p-3 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-purple-100"
//                 title="Refresh"
//               >
//                 <RefreshCw className={`w-5 h-5 text-purple-600 ${refreshing ? "animate-spin" : ""}`} />
//               </button>
//               <select
//                 value={year}
//                 onChange={(e) => setYear(parseInt(e.target.value))}
//                 className="px-4 py-3 rounded-xl bg-white shadow-lg border border-purple-100 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
//               >
//                 <option value={currentYear}>{currentYear}</option>
//               </select>
//             </div>
//           </motion.div>

//           {/* Error Message */}
//           {error && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 font-medium"
//             >
//               {error}
//             </motion.div>
//           )}

//           {/* Loading State */}
//           {loading ? (
//             <div className="flex justify-center py-20">
//               <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full" />
//             </div>
//           ) : !credit ? (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="bg-white rounded-2xl shadow-xl border border-purple-100 p-12 text-center"
//             >
//               <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <p className="text-xl font-bold text-gray-700 mb-2">No Leave Credit Found</p>
//               <p className="text-gray-500">Please contact your administrator to set up leave credits</p>
//             </motion.div>
//           ) : (
//             <>
//               {/* Main Leave Card */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden"
//               >
//                 {/* Header */}
//                 <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-8 py-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-white/90 text-sm mb-1">👤 {user?.name || "You"}</p>
//                       <h2 className="text-3xl font-bold text-white">{credit.annualLeave.total} Annual Leaves</h2>
//                       <p className="text-white/90 text-sm mt-1">12 days per year (1 paid per month)</p>
//                     </div>
//                     {remainingAnnual > 0 ? (
//                       <CheckCircle2 className="text-white w-12 h-12" />
//                     ) : (
//                       <XCircle className="text-white w-12 h-12" />
//                     )}
//                   </div>
//                 </div>

//                 {/* Progress */}
//                 <div className="p-8">
//                   <div className="mb-6">
//                     <div className="flex justify-between text-sm mb-2">
//                       <span className="font-medium text-gray-700">Annual Leave Used</span>
//                       <span className="font-bold text-gray-900">
//                         {credit.annualLeave.used} / {credit.annualLeave.total}
//                       </span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-3">
//                       <motion.div
//                         initial={{ width: 0 }}
//                         animate={{
//                           width: `${Math.min((credit.annualLeave.used / credit.annualLeave.total) * 100, 100)}%`,
//                         }}
//                         transition={{ duration: 1, ease: "easeOut" }}
//                         className={`h-3 rounded-full ${
//                           remainingAnnual > 0 ? "bg-gradient-to-r from-purple-600 to-pink-600" : "bg-red-500"
//                         }`}
//                       />
//                     </div>
//                   </div>

//                   {/* Stats Grid */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                     <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
//                             <Briefcase className="w-4 h-4" />
//                             Remaining Annual
//                           </p>
//                           <p className="text-3xl font-bold text-purple-600">{remainingAnnual}</p>
//                           <p className="text-xs text-gray-500 mt-1">Updates after approval</p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
//                             <AlertTriangle className="w-4 h-4 text-orange-600" />
//                             Loss of Pay Days
//                           </p>
//                           <p className="text-3xl font-bold text-orange-700">{credit.lossOfPayCount || 0}</p>
//                           <p className="text-xs text-gray-500 mt-1">Unpaid leave count</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Additional Leave Types */}
//                   {(credit.sickLeave?.total > 0 ||
//                     credit.maternityLeave?.total > 0 ||
//                     credit.bereavementLeave?.total > 0) && (
//                     <div className="border-t-2 border-gray-100 pt-6 mt-6">
//                       <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                         <TrendingUp className="w-5 h-5 text-purple-600" />
//                         Additional Leave Types
//                       </h3>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         {credit.sickLeave?.total > 0 && (
//                           <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
//                             <div className="flex items-center gap-2 mb-2">
//                               <Heart className="w-5 h-5 text-green-600" />
//                               <p className="font-bold text-green-700">Sick Leave</p>
//                             </div>
//                             <p className="text-xs text-gray-600 mb-1">
//                               Used: {credit.sickLeave.used} / {credit.sickLeave.total}
//                             </p>
//                             <p className="text-2xl font-bold text-green-700">Remaining: {remainingSick}</p>
//                           </div>
//                         )}

//                         {credit.maternityLeave?.total > 0 && (
//                           <div className="bg-pink-50 rounded-xl p-4 border-2 border-pink-200">
//                             <div className="flex items-center gap-2 mb-2">
//                               <UserX className="w-5 h-5 text-pink-600" />
//                               <p className="font-bold text-pink-700">Maternity Leave</p>
//                             </div>
//                             <p className="text-xs text-gray-600 mb-1">
//                               Used: {credit.maternityLeave.used} / {credit.maternityLeave.total}
//                             </p>
//                             <p className="text-2xl font-bold text-pink-700">Remaining: {remainingMaternity}</p>
//                           </div>
//                         )}

//                         {credit.bereavementLeave?.total > 0 && (
//                           <div className="bg-gray-100 rounded-xl p-4 border-2 border-gray-300">
//                             <div className="flex items-center gap-2 mb-2">
//                               <Heart className="w-5 h-5 text-gray-600" />
//                               <p className="font-bold text-gray-700">Bereavement Leave</p>
//                             </div>
//                             <p className="text-xs text-gray-600 mb-1">
//                               Used: {credit.bereavementLeave.used} / {credit.bereavementLeave.total}
//                             </p>
//                             <p className="text-2xl font-bold text-gray-700">Remaining: {remainingBereavement}</p>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Action Buttons */}
//                   <div className="flex gap-4 pt-6 border-t-2 border-gray-100 mt-6">
//                     <button
//                       onClick={() => setShowHistory(!showHistory)}
//                       className="flex-1 px-6 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
//                     >
//                       <History className="w-5 h-5" />
//                       {showHistory ? "Hide" : "View"} History
//                       {showHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//                     </button>

//                     <button
//                       onClick={() => setShowModal(true)}
//                       className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
//                     >
//                       <Plus className="w-5 h-5" />
//                       Apply Leave
//                     </button>
//                   </div>

//                   {/* Last Updated */}
//                   <p className="text-xs text-gray-400 text-center mt-4">
//                     Last Updated: {new Date(credit.updatedAt).toLocaleDateString()}
//                   </p>
//                 </div>
//               </motion.div>

//               {/* History Section */}
//               <AnimatePresence>
//                 {showHistory && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: "auto" }}
//                     exit={{ opacity: 0, height: 0 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <MyLeaveHistory onLeaveUpdate={handleRefresh} />
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </>
//           )}

//           {/* Apply Leave Modal */}
//           {showModal && (
//             <ApplyLeaveModal
//               isOpen={showModal}
//               onClose={() => setShowModal(false)}
//               onSuccess={handleLeaveSuccess}
//               leaveCredit={credit}
//             />
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }
















































import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plus,
  RefreshCw,
  Briefcase,
  AlertTriangle,
  Heart,
  UserX,
  CheckCircle2,
  XCircle,
  History,
  ChevronDown,
  ChevronUp,
  TrendingUp,
} from "lucide-react";
import axios from "axios";
import DashboardLayout from "../../layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import ApplyLeaveModal from "./components/ApplyLeaveModal";
import MyLeaveHistory from "./MyLeaveHistory";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function MyLeaves() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [credit, setCredit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchCredit();
  }, [year]);

  const fetchCredit = async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/leaves/myleave-credits`, {
        params: { year },
        headers: { Authorization: `Bearer ${token}` },
      });
      setCredit(res.data.data || null);
    } catch (err) {
      console.error("Error fetching leave credit:", err);
      setError("Failed to fetch your leave credit");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCredit(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleLeaveSuccess = () => {
    setShowModal(false);
    fetchCredit(true);
  };

  const remainingAnnual = credit ? credit.annualLeave.total - credit.annualLeave.used : 0;
  const remainingSick = credit ? credit.sickLeave.total - credit.sickLeave.used : 0;
  const remainingMaternity = credit ? credit.maternityLeave.total - credit.maternityLeave.used : 0;
  const remainingBereavement = credit ? credit.bereavementLeave.total - credit.bereavementLeave.used : 0;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                My Leave Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg">View your leave balance and apply for leaves</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-3 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-blue-100"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 text-blue-600 ${refreshing ? "animate-spin" : ""}`} />
              </button>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="px-4 py-3 rounded-xl bg-white shadow-lg border border-blue-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              >
                <option value={currentYear}>{currentYear}</option>
              </select>
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : !credit ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-xl border border-blue-100 p-12 text-center"
            >
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-bold text-gray-700 mb-2">No Leave Credit Found</p>
              <p className="text-gray-500">Please contact your administrator to set up leave credits</p>
            </motion.div>
          ) : (
            <>
              {/* Main Leave Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/90 text-sm mb-1">👤 {user?.name || "You"}</p>
                      <h2 className="text-3xl font-bold text-white">{credit.annualLeave.total} Annual Leaves</h2>
                      <p className="text-white/90 text-sm mt-1">12 days per year (1 paid per month)</p>
                    </div>
                    {remainingAnnual > 0 ? (
                      <CheckCircle2 className="text-white w-12 h-12" />
                    ) : (
                      <XCircle className="text-white w-12 h-12" />
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div className="p-8">
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">Annual Leave Used</span>
                      <span className="font-bold text-gray-900">
                        {credit.annualLeave.used} / {credit.annualLeave.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min((credit.annualLeave.used / credit.annualLeave.total) * 100, 100)}%`,
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-3 rounded-full ${
                          remainingAnnual > 0 ? "bg-gradient-to-r from-blue-600 to-blue-700" : "bg-red-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-4 border-2 border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Remaining Annual
                          </p>
                          <p className="text-3xl font-bold text-blue-600">{remainingAnnual}</p>
                          <p className="text-xs text-gray-500 mt-1">Updates after approval</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border-2 border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            Loss of Pay Days
                          </p>
                          <p className="text-3xl font-bold text-red-700">{credit.lossOfPayCount || 0}</p>
                          <p className="text-xs text-gray-500 mt-1">Unpaid leave count</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Leave Types */}
                  {(credit.sickLeave?.total > 0 ||
                    credit.maternityLeave?.total > 0 ||
                    credit.bereavementLeave?.total > 0) && (
                    <div className="border-t-2 border-gray-100 pt-6 mt-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Additional Leave Types
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {credit.sickLeave?.total > 0 && (
                          <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Heart className="w-5 h-5 text-green-600" />
                              <p className="font-bold text-green-700">Sick Leave</p>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                              Used: {credit.sickLeave.used} / {credit.sickLeave.total}
                            </p>
                            <p className="text-2xl font-bold text-green-700">Remaining: {remainingSick}</p>
                          </div>
                        )}

                        {credit.maternityLeave?.total > 0 && (
                          <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
                            <div className="flex items-center gap-2 mb-2">
                              <UserX className="w-5 h-5 text-yellow-600" />
                              <p className="font-bold text-yellow-700">Maternity Leave</p>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                              Used: {credit.maternityLeave.used} / {credit.maternityLeave.total}
                            </p>
                            <p className="text-2xl font-bold text-yellow-700">Remaining: {remainingMaternity}</p>
                          </div>
                        )}

                        {credit.bereavementLeave?.total > 0 && (
                          <div className="bg-gray-100 rounded-xl p-4 border-2 border-gray-300">
                            <div className="flex items-center gap-2 mb-2">
                              <Heart className="w-5 h-5 text-gray-600" />
                              <p className="font-bold text-gray-700">Bereavement Leave</p>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                              Used: {credit.bereavementLeave.used} / {credit.bereavementLeave.total}
                            </p>
                            <p className="text-2xl font-bold text-gray-700">Remaining: {remainingBereavement}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 border-t-2 border-gray-100 mt-6">
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className="flex-1 px-6 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <History className="w-5 h-5" />
                      {showHistory ? "Hide" : "View"} History
                      {showHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={() => setShowModal(true)}
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Apply Leave
                    </button>
                  </div>

                  {/* Last Updated */}
                  <p className="text-xs text-gray-400 text-center mt-4">
                    Last Updated: {new Date(credit.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>

              {/* History Section */}
              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MyLeaveHistory onLeaveUpdate={handleRefresh} />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Apply Leave Modal */}
          {showModal && (
            <ApplyLeaveModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onSuccess={handleLeaveSuccess}
              leaveCredit={credit}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}