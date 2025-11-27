// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Users, Edit2, Save, X, Search, Filter, CheckCircle, AlertCircle } from "lucide-react";
// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// export default function EditLeaveCredits() {
//   const currentYear = new Date().getFullYear();
//   const [year, setYear] = useState(currentYear);
//   const [credits, setCredits] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [message, setMessage] = useState({ type: "", text: "" });

//   useEffect(() => {
//     fetchCredits();
//   }, [year]);

//   const fetchCredits = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${API_URL}/leaves/leave-credits/all`, {
//         params: { year },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCredits(res.data.data || []);
//     } catch (err) {
//       console.error("Error fetching credits:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditClick = (credit) => {
//     setEditingId(credit._id);
//     setEditForm({
//       sickLeave: credit.sickLeave?.total || 0,
//       maternityLeave: credit.maternityLeave?.total || 0,
//       bereavementLeave: credit.bereavementLeave?.total || 0,
//     });
//   };

//   const handleSave = async (creditId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(`${API_URL}/leaves/leave-credits/${creditId}`, editForm, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setMessage({ type: "success", text: "✅ Credits updated successfully!" });
//       setEditingId(null);
//       fetchCredits();

//       setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//     } catch (err) {
//       setMessage({ type: "error", text: err.response?.data?.message || "❌ Failed to update" });
//     }
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditForm({});
//   };

//   const filteredCredits = credits.filter((credit) =>
//     credit.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     credit.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden"
//     >
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 px-8 py-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
//               <Users className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-white">Manage User Credits</h2>
//               <p className="text-white/90 text-sm mt-1">Edit additional leave allocations</p>
//             </div>
//           </div>

//           {/* Year Filter */}
//           <select
//             value={year}
//             onChange={(e) => setYear(parseInt(e.target.value))}
//             className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white font-semibold border-2 border-white/30 focus:border-white focus:outline-none"
//           >
//             {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
//               <option key={y} value={y} className="text-gray-900">
//                 {y}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="p-6 bg-gray-50 border-b border-gray-200">
//         <div className="flex items-center gap-4">
//           <div className="flex-1 relative">
//             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Search by name or email..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
//             />
//           </div>
//           <button className="px-4 py-3 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all flex items-center gap-2 font-medium text-gray-700">
//             <Filter className="w-5 h-5" />
//             Filter
//           </button>
//         </div>

//         {/* Info */}
//         <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
//           <AlertCircle className="w-4 h-4" />
//           <span>
//             Showing <strong>{filteredCredits.length}</strong> user(s) for {year}
//           </span>
//         </div>
//       </div>

//       {/* Message */}
//       {message.text && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className={`mx-6 mt-4 flex items-center gap-3 p-4 rounded-xl font-medium ${
//             message.type === "success"
//               ? "bg-green-50 text-green-800 border-2 border-green-200"
//               : "bg-red-50 text-red-800 border-2 border-red-200"
//           }`}
//         >
//           {message.type === "success" ? (
//             <CheckCircle className="w-5 h-5" />
//           ) : (
//             <AlertCircle className="w-5 h-5" />
//           )}
//           {message.text}
//         </motion.div>
//       )}

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
//             <tr>
//               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
//                 Employee
//               </th>
//               <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
//                 Annual Leave
//               </th>
//               <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
//                 Sick Leave
//               </th>
//               <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
//                 Maternity Leave
//               </th>
//               <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
//                 Bereavement Leave
//               </th>
//               <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
//                 Actions
//               </th>
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
//             ) : filteredCredits.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
//                   No credits found for {year}
//                 </td>
//               </tr>
//             ) : (
//               filteredCredits.map((credit, index) => (
//                 <motion.tr
//                   key={credit._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.03 }}
//                   className="hover:bg-blue-50/50 transition-colors"
//                 >
//                   {/* Employee Info */}
//                   <td className="px-6 py-4">
//                     <div>
//                       <p className="font-semibold text-gray-900">{credit.userId?.name}</p>
//                       <p className="text-sm text-gray-500">{credit.userId?.email}</p>
//                     </div>
//                   </td>

//                   {/* Annual Leave (Read-only) */}
//                   <td className="px-6 py-4 text-center">
//                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-semibold">
//                       {credit.annualLeave.used}/{credit.annualLeave.total}
//                     </div>
//                   </td>

//                   {/* Editable Fields */}
//                   {editingId === credit._id ? (
//                     <>
//                       <td className="px-6 py-4">
//                         <input
//                           type="number"
//                           min="0"
//                           value={editForm.sickLeave}
//                           onChange={(e) => setEditForm({ ...editForm, sickLeave: parseInt(e.target.value) || 0 })}
//                           className="w-24 px-3 py-2 text-center border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
//                         />
//                       </td>
//                       <td className="px-6 py-4">
//                         <input
//                           type="number"
//                           min="0"
//                           value={editForm.maternityLeave}
//                           onChange={(e) => setEditForm({ ...editForm, maternityLeave: parseInt(e.target.value) || 0 })}
//                           className="w-24 px-3 py-2 text-center border-2 border-pink-300 rounded-lg focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
//                         />
//                       </td>
//                       <td className="px-6 py-4">
//                         <input
//                           type="number"
//                           min="0"
//                           value={editForm.bereavementLeave}
//                           onChange={(e) => setEditForm({ ...editForm, bereavementLeave: parseInt(e.target.value) || 0 })}
//                           className="w-24 px-3 py-2 text-center border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:ring-4 focus:ring-gray-100"
//                         />
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex justify-center gap-2">
//                           <button
//                             onClick={() => handleSave(credit._id)}
//                             className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
//                             title="Save"
//                           >
//                             <Save className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={handleCancel}
//                             className="p-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition-colors"
//                             title="Cancel"
//                           >
//                             <X className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </>
//                   ) : (
//                     <>
//                       <td className="px-6 py-4 text-center">
//                         <span className="text-sm font-medium text-gray-700">
//                           {credit.sickLeave?.used || 0}/{credit.sickLeave?.total || 0}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-center">
//                         <span className="text-sm font-medium text-gray-700">
//                           {credit.maternityLeave?.used || 0}/{credit.maternityLeave?.total || 0}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-center">
//                         <span className="text-sm font-medium text-gray-700">
//                           {credit.bereavementLeave?.used || 0}/{credit.bereavementLeave?.total || 0}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex justify-center">
//                           <button
//                             onClick={() => handleEditClick(credit)}
//                             className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
//                             title="Edit"
//                           >
//                             <Edit2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </>
//                   )}
//                 </motion.tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </motion.div>
//   );
// }















































import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Edit2, Save, X, Search, Filter, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function EditLeaveCredits() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchCredits();
  }, [year]);

  const fetchCredits = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/leaves/leave-credits/all`, {
        params: { year },
        headers: { Authorization: `Bearer ${token}` },
      });
      setCredits(res.data.data || []);
    } catch (err) {
      console.error("Error fetching credits:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (credit) => {
    setEditingId(credit._id);
    setEditForm({
      sickLeave: credit.sickLeave?.total || 0,
      maternityLeave: credit.maternityLeave?.total || 0,
      bereavementLeave: credit.bereavementLeave?.total || 0,
    });
  };

  const handleSave = async (creditId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/leaves/leave-credits/${creditId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ type: "success", text: "✅ Credits updated successfully!" });
      setEditingId(null);
      fetchCredits();

      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "❌ Failed to update" });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const filteredCredits = credits.filter((credit) =>
    credit.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    credit.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-blue-600 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Manage User Credits</h2>
              <p className="text-white/90 text-sm mt-1">Edit additional leave allocations</p>
            </div>
          </div>

          {/* Year Filter */}
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white font-semibold border-2 border-white/30 focus:border-white focus:outline-none"
          >
            {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
              <option key={y} value={y} className="text-gray-900">
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-4">
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
          <button className="px-4 py-3 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all flex items-center gap-2 font-medium text-gray-700">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>

        {/* Info */}
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <AlertCircle className="w-4 h-4" />
          <span>
            Showing <strong>{filteredCredits.length}</strong> user(s) for {year}
          </span>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mx-6 mt-4 flex items-center gap-3 p-4 rounded-xl font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border-2 border-green-200"
              : "bg-red-50 text-red-800 border-2 border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </motion.div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Annual Leave
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Sick Leave
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Maternity Leave
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Bereavement Leave
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
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
            ) : filteredCredits.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                  No credits found for {year}
                </td>
              </tr>
            ) : (
              filteredCredits.map((credit, index) => (
                <motion.tr
                  key={credit._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-blue-50/50 transition-colors"
                >
                  {/* Employee Info */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{credit.userId?.name}</p>
                      <p className="text-sm text-gray-500">{credit.userId?.email}</p>
                    </div>
                  </td>

                  {/* Annual Leave (Read-only) */}
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-semibold">
                      {credit.annualLeave.used}/{credit.annualLeave.total}
                    </div>
                  </td>

                  {/* Editable Fields */}
                  {editingId === credit._id ? (
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="0"
                          value={editForm.sickLeave}
                          onChange={(e) => setEditForm({ ...editForm, sickLeave: parseInt(e.target.value) || 0 })}
                          className="w-24 px-3 py-2 text-center border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="0"
                          value={editForm.maternityLeave}
                          onChange={(e) => setEditForm({ ...editForm, maternityLeave: parseInt(e.target.value) || 0 })}
                          className="w-24 px-3 py-2 text-center border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="0"
                          value={editForm.bereavementLeave}
                          onChange={(e) => setEditForm({ ...editForm, bereavementLeave: parseInt(e.target.value) || 0 })}
                          className="w-24 px-3 py-2 text-center border-2 border-gray-300 rounded-lg focus:border-gray-500 focus:ring-4 focus:ring-gray-100"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleSave(credit._id)}
                            className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            title="Save"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-gray-700">
                          {credit.sickLeave?.used || 0}/{credit.sickLeave?.total || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-gray-700">
                          {credit.maternityLeave?.used || 0}/{credit.maternityLeave?.total || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-gray-700">
                          {credit.bereavementLeave?.used || 0}/{credit.bereavementLeave?.total || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleEditClick(credit)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}