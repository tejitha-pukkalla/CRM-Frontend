// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { X, Calendar, AlertCircle, CheckCircle, Briefcase, Heart, UserX, Home, Info } from "lucide-react";
// import axios from "axios";
// import { useAuth } from "../../../hooks/useAuth";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// const LEAVE_CATEGORIES = [
//   {
//     value: "annual",
//     label: "Annual Leave",
//     icon: <Briefcase className="w-4 h-4" />,
//     description: "1 paid day per month from annual leave quota",
//     color: "blue",
//     info: "You get 12 annual leaves per year. Only 1st leave per month is paid.",
//   },
//   {
//     value: "sick",
//     label: "Sick Leave",
//     icon: <Heart className="w-4 h-4" />,
//     description: "Medical/health related absence",
//     color: "red",
//     info: "Requires admin allocation. Contact SuperAdmin if not available.",
//   },
//   {
//     value: "maternity",
//     label: "Maternity Leave",
//     icon: <Heart className="w-4 h-4" />,
//     description: "Maternity/paternity leave",
//     color: "pink",
//     info: "Requires admin allocation. Contact SuperAdmin for eligibility.",
//   },
//   {
//     value: "bereavement",
//     label: "Bereavement Leave",
//     icon: <UserX className="w-4 h-4" />,
//     description: "Family emergency/bereavement",
//     color: "gray",
//     info: "Requires admin allocation. Contact SuperAdmin if needed.",
//   },
//   {
//     value: "workFromHome",
//     label: "Work From Home",
//     icon: <Home className="w-4 h-4" />,
//     description: "Remote work (always unpaid)",
//     color: "green",
//     info: "Work from home is always counted as Loss of Pay (unpaid).",
//   },
// ];

// export default function ApplyLeaveModal({ isOpen, onClose, onSuccess, leaveCredit }) {
//   const { user } = useAuth();
//   const today = new Date().toISOString().split("T")[0];

//   const [formData, setFormData] = useState({
//     fromDate: today,
//     toDate: today,
//     leaveCategory: "annual",
//     durationType: "fullday",
//     description: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [calculatedDays, setCalculatedDays] = useState(1);
//   const [annualLeaveUsedThisMonth, setAnnualLeaveUsedThisMonth] = useState(0);
//   const [showCategoryInfo, setShowCategoryInfo] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = "hidden";
//       checkAnnualLeaveUsage();
//     } else {
//       document.body.style.overflow = "unset";
//     }
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [isOpen]);

//   const checkAnnualLeaveUsage = async () => {
//     try {
//       const currentDate = new Date();
//       const year = currentDate.getFullYear();
//       const month = currentDate.getMonth() + 1;
//       const token = localStorage.getItem("token");

//       const res = await axios.get(`${API_URL}/leaves/my-applications`, {
//         params: { year },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const leaves = res.data.data || [];

//       const approvedAnnualThisMonth = leaves.filter((leave) => {
//         const leaveDate = new Date(leave.fromDate);
//         return (
//           leave.leaveCategory === "annual" &&
//           leave.status === "approved" &&
//           leaveDate.getMonth() + 1 === month &&
//           leaveDate.getFullYear() === year
//         );
//       }).length;

//       setAnnualLeaveUsedThisMonth(approvedAnnualThisMonth);
//     } catch (err) {
//       console.error("Error checking annual leave usage:", err);
//     }
//   };

//   useEffect(() => {
//     if (formData.fromDate && formData.toDate) {
//       const from = new Date(formData.fromDate);
//       const to = new Date(formData.toDate);

//       if (to >= from) {
//         if (formData.fromDate === formData.toDate) {
//           setCalculatedDays(formData.durationType === "fullday" ? 1 : 0.5);
//         } else {
//           const diffTime = Math.abs(to - from);
//           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
//           setCalculatedDays(diffDays);
//         }
//       } else {
//         setCalculatedDays(0);
//       }
//     }
//   }, [formData.fromDate, formData.toDate, formData.durationType]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     setMessage({ type: "", text: "" });
//   };

//   const getTimeSlot = () => {
//     if (formData.durationType === "fullday") return "9:30 AM to 6:30 PM";
//     if (formData.durationType === "halfday-morning") return "9:30 AM to 2:00 PM";
//     return "2:00 PM to 6:30 PM";
//   };

//   const validateForm = () => {
//     if (!formData.fromDate || !formData.toDate) {
//       setMessage({ type: "error", text: "Please select both dates" });
//       return false;
//     }

//     const from = new Date(formData.fromDate);
//     const to = new Date(formData.toDate);

//     if (to < from) {
//       setMessage({ type: "error", text: "End date cannot be before start date" });
//       return false;
//     }

//     if (formData.durationType !== "fullday" && formData.fromDate !== formData.toDate) {
//       setMessage({ type: "error", text: "Half day leave can only be applied for a single day" });
//       return false;
//     }

//     if (["sick", "maternity", "bereavement"].includes(formData.leaveCategory)) {
//       const leaveType = formData.leaveCategory + "Leave";
//       const totalAllocated = leaveCredit?.[leaveType]?.total || 0;

//       if (totalAllocated === 0) {
//         const selectedCategory = LEAVE_CATEGORIES.find((c) => c.value === formData.leaveCategory);
//         setMessage({
//           type: "error",
//           text: `You are not allocated ${selectedCategory.label}. Please contact SuperAdmin.`,
//         });
//         return false;
//       }
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       const token = localStorage.getItem("token");
//       const payload = {
//         fromDate: formData.fromDate,
//         toDate: formData.toDate,
//         leaveCategory: formData.leaveCategory,
//         durationType: formData.durationType,
//         timeSlot: getTimeSlot(),
//         description: formData.description,
//       };

//       const res = await axios.post(`${API_URL}/leaves/apply`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const isLOP = res.data.info?.isLossOfPay;
//       const lopDays = res.data.info?.lossOfPayDays || 0;

//       let successMessage = "✅ Leave applied successfully!";
//       if (isLOP) {
//         successMessage = `⚠️ Leave applied as Loss of Pay (${lopDays} day${lopDays > 1 ? "s" : ""})`;
//       } else {
//         successMessage = "✅ Leave applied! Will deduct from balance after approval.";
//       }

//       setMessage({ type: isLOP ? "warning" : "success", text: successMessage });

//       setTimeout(() => {
//         setFormData({
//           fromDate: today,
//           toDate: today,
//           leaveCategory: "annual",
//           durationType: "fullday",
//           description: "",
//         });
//         setMessage({ type: "", text: "" });
//         if (onSuccess) onSuccess();
//       }, 2000);
//     } catch (err) {
//       console.error("Apply leave error:", err);
//       setMessage({
//         type: "error",
//         text: err.response?.data?.message || "❌ Failed to apply leave",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     if (!loading) {
//       setFormData({
//         fromDate: today,
//         toDate: today,
//         leaveCategory: "annual",
//         durationType: "fullday",
//         description: "",
//       });
//       setMessage({ type: "", text: "" });
//       setShowCategoryInfo(false);
//       onClose();
//     }
//   };

//   const handleBackdropClick = (e) => {
//     if (e.target === e.currentTarget) {
//       handleClose();
//     }
//   };

//   if (!isOpen) return null;

//   const isSingleDay = formData.fromDate === formData.toDate;
//   const selectedCategory = LEAVE_CATEGORIES.find((c) => c.value === formData.leaveCategory);
//   const remainingAnnual = leaveCredit ? leaveCredit.annualLeave.total - leaveCredit.annualLeave.used : 0;

//   const willBeLOP = () => {
//     if (formData.leaveCategory === "workFromHome") return true;

//     if (formData.leaveCategory === "annual") {
//       if (annualLeaveUsedThisMonth >= 1) return true;
//       if (calculatedDays > remainingAnnual) return true;
//     }

//     if (["sick", "maternity", "bereavement"].includes(formData.leaveCategory)) {
//       const leaveType = formData.leaveCategory + "Leave";
//       const remaining = (leaveCredit?.[leaveType]?.total || 0) - (leaveCredit?.[leaveType]?.used || 0);
//       if (calculatedDays > remaining) return true;
//     }

//     return false;
//   };

//   const isLOP = willBeLOP();

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <div className="fixed inset-0 z-50 overflow-y-auto" onClick={handleBackdropClick}>
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
//             aria-hidden="true"
//           />

//           <div className="flex min-h-full items-center justify-center p-4">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               transition={{ duration: 0.2 }}
//               className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Header */}
//               <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-2xl">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xl font-bold text-white flex items-center gap-2">
//                     <Calendar className="w-6 h-6" />
//                     Apply for Leave
//                   </h3>
//                   <button
//                     type="button"
//                     onClick={handleClose}
//                     disabled={loading}
//                     className="text-white/80 hover:text-white transition-colors disabled:opacity-50"
//                   >
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>

//                 {leaveCredit && (
//                   <div className="mt-3 space-y-1 text-sm text-white/90">
//                     <p>
//                       Annual Leave: <strong>{remainingAnnual}</strong> of{" "}
//                       <strong>{leaveCredit.annualLeave.total}</strong> remaining
//                     </p>
//                     {annualLeaveUsedThisMonth > 0 && (
//                       <p className="text-yellow-200 text-xs flex items-center gap-1">
//                         <AlertCircle className="w-3 h-3" />
//                         {annualLeaveUsedThisMonth} annual leave(s) approved this month
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>

//               <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
//                 {/* User Info */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                     <input
//                       type="text"
//                       value={user?.name || ""}
//                       disabled
//                       className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                     <input
//                       type="email"
//                       value={user?.email || ""}
//                       disabled
//                       className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm"
//                     />
//                   </div>
//                 </div>

//                 {/* Leave Category */}
//                 <div>
//                   <div className="flex items-center justify-between mb-2">
//                     <label className="block text-sm font-medium text-gray-700">Leave Category *</label>
//                     <button
//                       type="button"
//                       onClick={() => setShowCategoryInfo(!showCategoryInfo)}
//                       className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center gap-1"
//                     >
//                       <Info className="w-3 h-3" />
//                       {showCategoryInfo ? "Hide" : "Show"} Info
//                     </button>
//                   </div>
//                   <select
//                     name="leaveCategory"
//                     value={formData.leaveCategory}
//                     onChange={handleChange}
//                     disabled={loading}
//                     className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:opacity-50"
//                   >
//                     {LEAVE_CATEGORIES.map((cat) => (
//                       <option key={cat.value} value={cat.value}>
//                         {cat.label}
//                       </option>
//                     ))}
//                   </select>

//                   {selectedCategory && (
//                     <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
//                       {selectedCategory.icon}
//                       {selectedCategory.description}
//                     </p>
//                   )}

//                   {showCategoryInfo && selectedCategory && (
//                     <motion.div
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: "auto" }}
//                       exit={{ opacity: 0, height: 0 }}
//                       className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3"
//                     >
//                       <p className="text-xs text-blue-800">
//                         <strong>ℹ️ About {selectedCategory.label}:</strong>
//                         <br />
//                         {selectedCategory.info}
//                       </p>
//                     </motion.div>
//                   )}
//                 </div>

//                 {/* Dates */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">From Date *</label>
//                     <input
//                       type="date"
//                       name="fromDate"
//                       value={formData.fromDate}
//                       onChange={handleChange}
//                       min={today}
//                       required
//                       disabled={loading}
//                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:opacity-50"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">To Date *</label>
//                     <input
//                       type="date"
//                       name="toDate"
//                       value={formData.toDate}
//                       onChange={handleChange}
//                       min={formData.fromDate || today}
//                       required
//                       disabled={loading}
//                       className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:opacity-50"
//                     />
//                   </div>
//                 </div>

//                 {/* Duration */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
//                   <select
//                     name="durationType"
//                     value={formData.durationType}
//                     onChange={handleChange}
//                     disabled={loading}
//                     className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:opacity-50"
//                   >
//                     <option value="fullday">Full Day (9:30 AM – 6:30 PM)</option>
//                     {isSingleDay && (
//                       <>
//                         <option value="halfday-morning">Half Day – Morning (9:30 AM – 2:00 PM)</option>
//                         <option value="halfday-evening">Half Day – Evening (2:00 PM – 6:30 PM)</option>
//                       </>
//                     )}
//                   </select>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     disabled={loading}
//                     rows={2}
//                     className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:opacity-50"
//                     placeholder="Brief reason for leave..."
//                   />
//                 </div>

//                 {/* Summary */}
//                 {calculatedDays > 0 && (
//                   <div
//                     className={`border-2 rounded-lg p-4 ${
//                       isLOP ? "bg-orange-50 border-orange-200" : "bg-indigo-50 border-indigo-200"
//                     }`}
//                   >
//                     <h4
//                       className={`font-semibold mb-2 flex items-center gap-2 ${
//                         isLOP ? "text-orange-900" : "text-indigo-900"
//                       }`}
//                     >
//                       <AlertCircle className="w-4 h-4" />
//                       Leave Summary
//                     </h4>
//                     <div className={`space-y-2 text-sm ${isLOP ? "text-orange-800" : "text-indigo-800"}`}>
//                       <div className="flex items-center justify-between">
//                         <span>Duration:</span>
//                         <strong>{calculatedDays} day(s)</strong>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span>Time:</span>
//                         <strong className="text-xs">{getTimeSlot()}</strong>
//                       </div>

//                       {isLOP ? (
//                         <div className="bg-orange-100 border border-orange-300 rounded p-3 mt-2">
//                           <p className="text-orange-900 font-bold flex items-center gap-2">
//                             <AlertCircle className="w-4 h-4" />
//                             ⚠️ Loss of Pay Leave
//                           </p>
//                           <p className="text-xs mt-1 text-orange-800">
//                             This leave will NOT deduct from your balance and is unpaid.
//                           </p>
//                         </div>
//                       ) : (
//                         <div className="bg-green-100 border border-green-300 rounded p-3 mt-2">
//                           <p className="text-green-900 font-bold flex items-center gap-2">
//                             <CheckCircle className="w-4 h-4" />
//                             ✅ Paid Leave
//                           </p>
//                           <p className="text-xs mt-1 text-green-800">
//                             {calculatedDays} day(s) will be deducted after approval.
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* Message */}
//                 {message.text && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${
//                       message.type === "success"
//                         ? "bg-green-50 text-green-700 border-2 border-green-200"
//                         : message.type === "warning"
//                         ? "bg-orange-50 text-orange-700 border-2 border-orange-200"
//                         : "bg-red-50 text-red-700 border-2 border-red-200"
//                     }`}
//                   >
//                     {message.type === "success" || message.type === "warning" ? (
//                       <CheckCircle className="w-5 h-5" />
//                     ) : (
//                       <AlertCircle className="w-5 h-5" />
//                     )}
//                     {message.text}
//                   </motion.div>
//                 )}

//                 {/* Action Buttons */}
//                 <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
//                   <button
//                     type="button"
//                     onClick={handleClose}
//                     disabled={loading}
//                     className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold transition-colors disabled:opacity-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={loading || calculatedDays === 0}
//                     className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-colors disabled:opacity-50"
//                   >
//                     {loading ? (
//                       <span className="flex items-center justify-center gap-2">
//                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                         Submitting...
//                       </span>
//                     ) : (
//                       "Submit Application"
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// }









































import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, AlertCircle, CheckCircle, Briefcase, Heart, UserX, Home, Info } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const LEAVE_CATEGORIES = [
  {
    value: "annual",
    label: "Annual Leave",
    icon: <Briefcase className="w-4 h-4" />,
    description: "1 paid day per month from annual leave quota",
    color: "blue",
    info: "You get 12 annual leaves per year. Only 1st leave per month is paid.",
  },
  {
    value: "sick",
    label: "Sick Leave",
    icon: <Heart className="w-4 h-4" />,
    description: "Medical/health related absence",
    color: "red",
    info: "Requires admin allocation. Contact SuperAdmin if not available.",
  },
  {
    value: "maternity",
    label: "Maternity Leave",
    icon: <Heart className="w-4 h-4" />,
    description: "Maternity/paternity leave",
    color: "yellow",
    info: "Requires admin allocation. Contact SuperAdmin for eligibility.",
  },
  {
    value: "bereavement",
    label: "Bereavement Leave",
    icon: <UserX className="w-4 h-4" />,
    description: "Family emergency/bereavement",
    color: "gray",
    info: "Requires admin allocation. Contact SuperAdmin if needed.",
  },
  {
    value: "workFromHome",
    label: "Work From Home",
    icon: <Home className="w-4 h-4" />,
    description: "Remote work (always unpaid)",
    color: "green",
    info: "Work from home is always counted as Loss of Pay (unpaid).",
  },
];

export default function ApplyLeaveModal({ isOpen, onClose, onSuccess, leaveCredit }) {
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    fromDate: today,
    toDate: today,
    leaveCategory: "annual",
    durationType: "fullday",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [calculatedDays, setCalculatedDays] = useState(1);
  const [annualLeaveUsedThisMonth, setAnnualLeaveUsedThisMonth] = useState(0);
  const [showCategoryInfo, setShowCategoryInfo] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      checkAnnualLeaveUsage();
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const checkAnnualLeaveUsage = async () => {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/leaves/my-applications`, {
        params: { year },
        headers: { Authorization: `Bearer ${token}` },
      });
      const leaves = res.data.data || [];

      const approvedAnnualThisMonth = leaves.filter((leave) => {
        const leaveDate = new Date(leave.fromDate);
        return (
          leave.leaveCategory === "annual" &&
          leave.status === "approved" &&
          leaveDate.getMonth() + 1 === month &&
          leaveDate.getFullYear() === year
        );
      }).length;

      setAnnualLeaveUsedThisMonth(approvedAnnualThisMonth);
    } catch (err) {
      console.error("Error checking annual leave usage:", err);
    }
  };

  useEffect(() => {
    if (formData.fromDate && formData.toDate) {
      const from = new Date(formData.fromDate);
      const to = new Date(formData.toDate);

      if (to >= from) {
        if (formData.fromDate === formData.toDate) {
          setCalculatedDays(formData.durationType === "fullday" ? 1 : 0.5);
        } else {
          const diffTime = Math.abs(to - from);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          setCalculatedDays(diffDays);
        }
      } else {
        setCalculatedDays(0);
      }
    }
  }, [formData.fromDate, formData.toDate, formData.durationType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage({ type: "", text: "" });
  };

  const getTimeSlot = () => {
    if (formData.durationType === "fullday") return "9:30 AM to 6:30 PM";
    if (formData.durationType === "halfday-morning") return "9:30 AM to 2:00 PM";
    return "2:00 PM to 6:30 PM";
  };

  const validateForm = () => {
    if (!formData.fromDate || !formData.toDate) {
      setMessage({ type: "error", text: "Please select both dates" });
      return false;
    }

    const from = new Date(formData.fromDate);
    const to = new Date(formData.toDate);

    if (to < from) {
      setMessage({ type: "error", text: "End date cannot be before start date" });
      return false;
    }

    if (formData.durationType !== "fullday" && formData.fromDate !== formData.toDate) {
      setMessage({ type: "error", text: "Half day leave can only be applied for a single day" });
      return false;
    }

    if (["sick", "maternity", "bereavement"].includes(formData.leaveCategory)) {
      const leaveType = formData.leaveCategory + "Leave";
      const totalAllocated = leaveCredit?.[leaveType]?.total || 0;

      if (totalAllocated === 0) {
        const selectedCategory = LEAVE_CATEGORIES.find((c) => c.value === formData.leaveCategory);
        setMessage({
          type: "error",
          text: `You are not allocated ${selectedCategory.label}. Please contact SuperAdmin.`,
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const payload = {
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        leaveCategory: formData.leaveCategory,
        durationType: formData.durationType,
        timeSlot: getTimeSlot(),
        description: formData.description,
      };

      const res = await axios.post(`${API_URL}/leaves/apply`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const isLOP = res.data.info?.isLossOfPay;
      const lopDays = res.data.info?.lossOfPayDays || 0;

      let successMessage = "✅ Leave applied successfully!";
      if (isLOP) {
        successMessage = `⚠️ Leave applied as Loss of Pay (${lopDays} day${lopDays > 1 ? "s" : ""})`;
      } else {
        successMessage = "✅ Leave applied! Will deduct from balance after approval.";
      }

      setMessage({ type: isLOP ? "warning" : "success", text: successMessage });

      setTimeout(() => {
        setFormData({
          fromDate: today,
          toDate: today,
          leaveCategory: "annual",
          durationType: "fullday",
          description: "",
        });
        setMessage({ type: "", text: "" });
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      console.error("Apply leave error:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "❌ Failed to apply leave",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        fromDate: today,
        toDate: today,
        leaveCategory: "annual",
        durationType: "fullday",
        description: "",
      });
      setMessage({ type: "", text: "" });
      setShowCategoryInfo(false);
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const isSingleDay = formData.fromDate === formData.toDate;
  const selectedCategory = LEAVE_CATEGORIES.find((c) => c.value === formData.leaveCategory);
  const remainingAnnual = leaveCredit ? leaveCredit.annualLeave.total - leaveCredit.annualLeave.used : 0;

  const willBeLOP = () => {
    if (formData.leaveCategory === "workFromHome") return true;

    if (formData.leaveCategory === "annual") {
      if (annualLeaveUsedThisMonth >= 1) return true;
      if (calculatedDays > remainingAnnual) return true;
    }

    if (["sick", "maternity", "bereavement"].includes(formData.leaveCategory)) {
      const leaveType = formData.leaveCategory + "Leave";
      const remaining = (leaveCredit?.[leaveType]?.total || 0) - (leaveCredit?.[leaveType]?.used || 0);
      if (calculatedDays > remaining) return true;
    }

    return false;
  };

  const isLOP = willBeLOP();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={handleBackdropClick}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
            aria-hidden="true"
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="w-6 h-6" />
                    Apply for Leave
                  </h3>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="text-white/80 hover:text-white transition-colors disabled:opacity-50"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {leaveCredit && (
                  <div className="mt-3 space-y-1 text-sm text-white/90">
                    <p>
                      Annual Leave: <strong>{remainingAnnual}</strong> of{" "}
                      <strong>{leaveCredit.annualLeave.total}</strong> remaining
                    </p>
                    {annualLeaveUsedThisMonth > 0 && (
                      <p className="text-yellow-200 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {annualLeaveUsedThisMonth} annual leave(s) approved this month
                      </p>
                    )}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* User Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={user?.name || ""}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm"
                    />
                  </div>
                </div>

                {/* Leave Category */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Leave Category *</label>
                    <button
                      type="button"
                      onClick={() => setShowCategoryInfo(!showCategoryInfo)}
                      className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                    >
                      <Info className="w-3 h-3" />
                      {showCategoryInfo ? "Hide" : "Show"} Info
                    </button>
                  </div>
                  <select
                    name="leaveCategory"
                    value={formData.leaveCategory}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
                  >
                    {LEAVE_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>

                  {selectedCategory && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      {selectedCategory.icon}
                      {selectedCategory.description}
                    </p>
                  )}

                  {showCategoryInfo && selectedCategory && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3"
                    >
                      <p className="text-xs text-blue-800">
                        <strong>ℹ️ About {selectedCategory.label}:</strong>
                        <br />
                        {selectedCategory.info}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date *</label>
                    <input
                      type="date"
                      name="fromDate"
                      value={formData.fromDate}
                      onChange={handleChange}
                      min={today}
                      required
                      disabled={loading}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date *</label>
                    <input
                      type="date"
                      name="toDate"
                      value={formData.toDate}
                      onChange={handleChange}
                      min={formData.fromDate || today}
                      required
                      disabled={loading}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
                  <select
                    name="durationType"
                    value={formData.durationType}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
                  >
                    <option value="fullday">Full Day (9:30 AM – 6:30 PM)</option>
                    {isSingleDay && (
                      <>
                        <option value="halfday-morning">Half Day – Morning (9:30 AM – 2:00 PM)</option>
                        <option value="halfday-evening">Half Day – Evening (2:00 PM – 6:30 PM)</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={loading}
                    rows={2}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
                    placeholder="Brief reason for leave..."
                  />
                </div>

                {/* Summary */}
                {calculatedDays > 0 && (
                  <div
                    className={`border-2 rounded-lg p-4 ${
                      isLOP ? "bg-yellow-50 border-yellow-200" : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <h4
                      className={`font-semibold mb-2 flex items-center gap-2 ${
                        isLOP ? "text-yellow-900" : "text-blue-900"
                      }`}
                    >
                      <AlertCircle className="w-4 h-4" />
                      Leave Summary
                    </h4>
                    <div className={`space-y-2 text-sm ${isLOP ? "text-yellow-800" : "text-blue-800"}`}>
                      <div className="flex items-center justify-between">
                        <span>Duration:</span>
                        <strong>{calculatedDays} day(s)</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Time:</span>
                        <strong className="text-xs">{getTimeSlot()}</strong>
                      </div>

                      {isLOP ? (
                        <div className="bg-yellow-100 border border-yellow-300 rounded p-3 mt-2">
                          <p className="text-yellow-900 font-bold flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            ⚠️ Loss of Pay Leave
                          </p>
                          <p className="text-xs mt-1 text-yellow-800">
                            This leave will NOT deduct from your balance and is unpaid.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-green-100 border border-green-300 rounded p-3 mt-2">
                          <p className="text-green-900 font-bold flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            ✅ Paid Leave
                          </p>
                          <p className="text-xs mt-1 text-green-800">
                            {calculatedDays} day(s) will be deducted after approval.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Message */}
                {message.text && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${
                      message.type === "success"
                        ? "bg-green-50 text-green-700 border-2 border-green-200"
                        : message.type === "warning"
                        ? "bg-yellow-50 text-yellow-700 border-2 border-yellow-200"
                        : "bg-red-50 text-red-700 border-2 border-red-200"
                    }`}
                  >
                    {message.type === "success" || message.type === "warning" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    {message.text}
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || calculatedDays === 0}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}