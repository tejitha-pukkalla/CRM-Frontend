// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Calendar, RefreshCw, Loader2, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// export default function BulkLeaveCredit({ onSuccess }) {
//   const currentYear = new Date().getFullYear();
//   const [formData, setFormData] = useState({
//     year: currentYear,
//     effectiveFrom: new Date().toISOString().split("T")[0],
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.post(
//         `${API_URL}/leaves/leave-credits/bulk`,
//         {
//           year: parseInt(formData.year),
//           effectiveFrom: formData.effectiveFrom,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setMessage({
//         type: "success",
//         text: res.data.message || "✅ Leave credits created successfully!",
//       });

//       if (onSuccess) onSuccess();

//       // Reset form after 2 seconds
//       setTimeout(() => {
//         setMessage({ type: "", text: "" });
//       }, 3000);
//     } catch (err) {
//       console.error("Bulk creation error:", err);
//       setMessage({
//         type: "error",
//         text: err.response?.data?.message || "❌ Error creating leave credits",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       year: currentYear,
//       effectiveFrom: new Date().toISOString().split("T")[0],
//     });
//     setMessage({ type: "", text: "" });
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden"
//     >
//       {/* Header */}
//       <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-8 py-6">
//         <div className="flex items-center gap-3">
//           <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
//             <Calendar className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-white">Create Annual Leave Credits</h2>
//             <p className="text-white/90 text-sm mt-1">
//               Allocate 12 annual leave days to all active employees
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Info Banner */}
//       <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mx-8 mt-6">
//         <div className="flex items-start gap-3">
//           <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
//           <div className="text-sm text-blue-800">
//             <p className="font-semibold mb-1">📌 Important Information:</p>
//             <ul className="list-disc list-inside space-y-1 text-blue-700">
//               <li>Creates 12 annual leave days (1 per month) for all users</li>
//               <li>Can only be created once per year</li>
//               <li>Applies to Members, Team Leads, and Project Leads only</li>
//               <li>Additional leaves (sick/maternity) can be added later</li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="p-8 space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Year Selection */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Select Year *
//             </label>
//             <select
//               value={formData.year}
//               onChange={(e) => setFormData({ ...formData, year: e.target.value })}
//               className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
//               disabled={loading}
//             >
//               {[currentYear, currentYear + 1, currentYear + 2].map((y) => (
//                 <option key={y} value={y}>
//                   {y}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Effective Date */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Effective From *
//             </label>
//             <input
//               type="date"
//               value={formData.effectiveFrom}
//               onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
//               className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
//               disabled={loading}
//             />
//           </div>
//         </div>

//         {/* Summary Box */}
//         <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
//           <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
//             <CheckCircle className="w-5 h-5" />
//             Summary
//           </h3>
//           <div className="grid grid-cols-2 gap-4 text-sm">
//             <div>
//               <p className="text-gray-600">Year</p>
//               <p className="font-bold text-purple-900 text-lg">{formData.year}</p>
//             </div>
//             <div>
//               <p className="text-gray-600">Total Annual Leaves</p>
//               <p className="font-bold text-purple-900 text-lg">12 days</p>
//             </div>
//             <div>
//               <p className="text-gray-600">Leaves Per Month</p>
//               <p className="font-bold text-purple-900 text-lg">1 day</p>
//             </div>
//             <div>
//               <p className="text-gray-600">Effective Date</p>
//               <p className="font-bold text-purple-900 text-lg">
//                 {new Date(formData.effectiveFrom).toLocaleDateString()}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Message */}
//         {message.text && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className={`flex items-center gap-3 p-4 rounded-xl font-medium ${
//               message.type === "success"
//                 ? "bg-green-50 text-green-800 border-2 border-green-200"
//                 : "bg-red-50 text-red-800 border-2 border-red-200"
//             }`}
//           >
//             {message.type === "success" ? (
//               <CheckCircle className="w-5 h-5 flex-shrink-0" />
//             ) : (
//               <AlertCircle className="w-5 h-5 flex-shrink-0" />
//             )}
//             {message.text}
//           </motion.div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex gap-4 pt-4">
//           <button
//             type="submit"
//             disabled={loading}
//             className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="w-5 h-5 animate-spin" />
//                 Creating...
//               </>
//             ) : (
//               <>
//                 <Sparkles className="w-5 h-5" />
//                 Create Leave Credits
//               </>
//             )}
//           </button>

//           <button
//             type="button"
//             onClick={handleReset}
//             disabled={loading}
//             className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
//           >
//             <RefreshCw className="w-5 h-5" />
//             Reset
//           </button>
//         </div>
//       </form>
//     </motion.div>
//   );
// }


































































import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, RefreshCw, Loader2, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function BulkLeaveCredit({ onSuccess }) {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    year: currentYear,
    effectiveFrom: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/leaves/leave-credits/bulk`,
        {
          year: parseInt(formData.year),
          effectiveFrom: formData.effectiveFrom,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({
        type: "success",
        text: res.data.message || "✅ Leave credits created successfully!",
      });

      if (onSuccess) onSuccess();

      // Reset form after 2 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (err) {
      console.error("Bulk creation error:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "❌ Error creating leave credits",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      year: currentYear,
      effectiveFrom: new Date().toISOString().split("T")[0],
    });
    setMessage({ type: "", text: "" });
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
            <h2 className="text-2xl font-bold text-white">Create Annual Leave Credits</h2>
            <p className="text-white/90 text-sm mt-1">
              Allocate 12 annual leave days to all active employees
            </p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mx-8 mt-6">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">📌 Important Information:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Creates 12 annual leave days (1 per month) for all users</li>
              <li>Can only be created once per year</li>
              <li>Applies to Members, Team Leads, and Project Leads only</li>
              <li>Additional leaves (sick/maternity) can be added later</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Year Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Year *
            </label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              disabled={loading}
            >
              {[currentYear, currentYear + 1, currentYear + 2].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Effective Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Effective From *
            </label>
            <input
              type="date"
              value={formData.effectiveFrom}
              onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              disabled={loading}
            />
          </div>
        </div>

        {/* Summary Box */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Summary
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Year</p>
              <p className="font-bold text-blue-900 text-lg">{formData.year}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Annual Leaves</p>
              <p className="font-bold text-blue-900 text-lg">12 days</p>
            </div>
            <div>
              <p className="text-gray-600">Leaves Per Month</p>
              <p className="font-bold text-blue-900 text-lg">1 day</p>
            </div>
            <div>
              <p className="text-gray-600">Effective Date</p>
              <p className="font-bold text-blue-900 text-lg">
                {new Date(formData.effectiveFrom).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 p-4 rounded-xl font-medium ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border-2 border-green-200"
                : "bg-red-50 text-red-800 border-2 border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            {message.text}
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Create Leave Credits
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Reset
          </button>
        </div>
      </form>
    </motion.div>
  );
}