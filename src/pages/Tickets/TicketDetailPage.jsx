import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  Tag,
  AlertTriangle,
  MessageSquare,
  FileText,
  Edit3,
  Save,
  X,
} from "lucide-react";
import DashboardLayout from "../../layout/DashboardLayout";
import ticketService from "../../services/ticket.service";
import { useAuth } from "../../hooks/useAuth"; 

const priorityColors = {
  Low: "bg-green-100 text-green-700 border-green-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  High: "bg-red-100 text-red-700 border-red-200",
};

const statusColors = {
  Open: "bg-blue-100 text-blue-700 border-blue-200",
  "In Progress": "bg-purple-100 text-purple-700 border-purple-200",
  Resolved: "bg-green-100 text-green-700 border-green-200",
  Closed: "bg-gray-100 text-gray-700 border-gray-200",
  Accepted: "bg-green-100 text-green-700 border-green-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
  Pending: "bg-orange-100 text-orange-700 border-orange-200",
};

const categoryIcons = { General: "📋", Bug: "🐛", Feature: "✨", Support: "🤝" };

export default function TicketDetailPage({ ticketId, onBack }) {
  const { user } = useAuth(); 
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({
    status: "",
    adminRemarks: "",
    remarks: "",
    estimatedResolutionTime: "",
    assignedTo: "",
    internalNotes: "",
  });

  
  const canEditTicket = user?.globalRole === "superadmin" || user?.globalRole === "teamlead";

  useEffect(() => {
    if (ticketId) fetchTicketDetails();
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTicketById(ticketId);
      const ticketData = data?.data || data;
      setTicket(ticketData);
      setEditData({
        status: ticketData?.status || "",
        adminRemarks: ticketData?.adminRemarks || "",
        remarks: ticketData?.remarks || "",
        estimatedResolutionTime: ticketData?.estimatedResolutionTime || "",
        assignedTo: ticketData?.assignedTo || "",
        internalNotes: ticketData?.internalNotes || "",
      });
    } catch (err) {
      setError("Failed to load ticket details");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setProcessing(true);
    setError("");
    setSuccess("");
    try {
      const response = await ticketService.updateTicketStatus(ticketId, editData);
      const updatedTicket = response?.data || response;
      
      setTicket(updatedTicket);
      
      setEditData({
        status: updatedTicket?.status || "",
        adminRemarks: updatedTicket?.adminRemarks || "",
        remarks: updatedTicket?.remarks || "",
        estimatedResolutionTime: updatedTicket?.estimatedResolutionTime || "",
        assignedTo: updatedTicket?.assignedTo || "",
        internalNotes: updatedTicket?.internalNotes || "",
      });
      
      setIsEditing(false);
      setSuccess("✅ Ticket updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update ticket");
    } finally {
      setProcessing(false);
    }
  };

  const handleAccept = async () => {
    if (!editData.adminRemarks.trim()) {
      setError("Please provide admin remarks");
      return;
    }
    setProcessing(true);
    setError("");
    try {
      const response = await ticketService.acceptTicket(ticketId, {
        status: "Accepted",
        adminRemarks: editData.adminRemarks,
        estimatedResolutionTime: editData.estimatedResolutionTime,
        assignedTo: editData.assignedTo,
        internalNotes: editData.internalNotes,
      });
      setTicket(response?.data || response);
      setSuccess("✅ Ticket accepted successfully!");
      setTimeout(() => { if (onBack) onBack(); }, 2000);
    } catch (err) {
      setError("Failed to accept ticket");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!editData.adminRemarks.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }
    setProcessing(true);
    setError("");
    try {
      const response = await ticketService.rejectTicket(ticketId, {
        status: "Rejected",
        adminRemarks: editData.adminRemarks,
        internalNotes: editData.internalNotes,
      });
      setTicket(response?.data || response);
      setSuccess("✅ Ticket rejected!");
      setTimeout(() => { if (onBack) onBack(); }, 2000);
    } catch (err) {
      setError("Failed to reject ticket");
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  };

  const canTakeAction = ticket?.status === "Open" || ticket?.status === "Pending";

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-3"></div>
            <p className="text-gray-600 text-sm">Loading ticket details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!ticket) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle size={40} className="text-red-500 mx-auto mb-3" />
            <p className="text-gray-600">Ticket not found</p>
            <button onClick={onBack} className="mt-3 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">Go Back</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 hover:bg-white rounded-lg transition-colors"><ArrowLeft size={20} /></button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Ticket Details</h1>
                <p className="text-gray-500 text-xs">Review and manage support request</p>
              </div>
            </div>
            {/* ✅ Only show Edit button if user has permission */}
            {!isEditing && canEditTicket && (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-xs font-medium">
                <Edit3 size={14} /> Edit Ticket
              </button>
            )}
          </motion.div>

          {/* Messages */}
          {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">{error}</motion.div>}
          {success && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm">{success}</motion.div>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Ticket Info Card */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{ticket.ticketId}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[ticket.status]}`}>{ticket.status}</span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">{ticket.title}</h2>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1"><FileText size={14} /><span>Description</span></div>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{ticket.description || "No description provided"}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><Tag size={12} /><span>Category</span></div>
                    <p className="text-sm font-medium text-gray-800">{categoryIcons[ticket.category]} {ticket.category}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><AlertTriangle size={12} /><span>Priority</span></div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><Calendar size={12} /><span>Created</span></div>
                    <p className="text-xs font-medium text-gray-800">{formatDate(ticket.createdAt)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><Clock size={12} /><span>Updated</span></div>
                    <p className="text-xs font-medium text-gray-800">{formatDate(ticket.updatedAt)}</p>
                  </div>
                </div>
              </motion.div>

              {/* Remarks Sections */}
              {ticket.remarks && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2"><MessageSquare size={16} className="text-yellow-600" /><h3 className="text-sm font-bold text-yellow-800">User Remarks</h3></div>
                  <p className="text-yellow-900 text-sm whitespace-pre-wrap">{ticket.remarks}</p>
                </motion.div>
              )}

              {ticket.adminRemarks && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2"><MessageSquare size={16} className="text-blue-600" /><h3 className="text-sm font-bold text-blue-800">Admin Remarks</h3></div>
                  <p className="text-blue-900 text-sm whitespace-pre-wrap">{ticket.adminRemarks}</p>
                </motion.div>
              )}

              {ticket.internalNotes && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2"><FileText size={16} className="text-gray-600" /><h3 className="text-sm font-bold text-gray-700">Internal Notes</h3></div>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{ticket.internalNotes}</p>
                </motion.div>
              )}

              {/* ✅ Edit Form - Only show if user has permission */}
              {isEditing && canEditTicket && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-md border border-indigo-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-gray-800 flex items-center gap-2"><Edit3 size={18} className="text-indigo-600" /> Edit Ticket</h3>
                    <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18} className="text-gray-500" /></button>
                  </div>

                  <div className="space-y-4">
                    {/* Status */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                      <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>

                    {/* Admin Remarks */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Admin Remarks</label>
                      <textarea value={editData.adminRemarks} onChange={(e) => setEditData({ ...editData, adminRemarks: e.target.value })}
                        placeholder="Add admin remarks..." rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Estimated Resolution */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Est. Resolution Time</label>
                        <input type="text" value={editData.estimatedResolutionTime} onChange={(e) => setEditData({ ...editData, estimatedResolutionTime: e.target.value })}
                          placeholder="e.g., 2-3 days" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      {/* Assigned To */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Assign To</label>
                        <input type="text" value={editData.assignedTo} onChange={(e) => setEditData({ ...editData, assignedTo: e.target.value })}
                          placeholder="Team member" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </div>

                    {/* Internal Notes */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Internal Notes</label>
                      <textarea value={editData.internalNotes} onChange={(e) => setEditData({ ...editData, internalNotes: e.target.value })}
                        placeholder="Internal notes (not visible to user)..." rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 resize-none" />
                    </div>

                    {/* Save Button */}
                    <div className="flex gap-2 pt-2">
                      <button onClick={handleSaveChanges} disabled={processing}
                        className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
                        {processing ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>Saving...</> : <><Save size={16} /> Save Changes</>}
                      </button>
                      <button onClick={() => setIsEditing(false)} disabled={processing} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">Cancel</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              {/* Creator Info */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"><User size={16} className="text-indigo-600" /> Created By</h3>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold text-sm">{ticket.createdBy?.name?.charAt(0) || "U"}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{ticket.createdBy?.name || "Unknown"}</p>
                    <p className="text-xs text-gray-500">{ticket.createdBy?.email || "N/A"}</p>
                  </div>
                </div>
              </motion.div>

              {/* Assignment Info */}
              {ticket.assignedTo && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                  <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2"><User size={16} className="text-green-600" /> Assigned To</h3>
                  <p className="text-sm text-gray-700">{ticket.assignedTo}</p>
                </motion.div>
              )}

              {/* Resolution Time */}
              {ticket.estimatedResolutionTime && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                  <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2"><Clock size={16} className="text-orange-600" /> Est. Resolution</h3>
                  <p className="text-sm text-gray-700">{ticket.estimatedResolutionTime}</p>
                </motion.div>
              )}

              {/* ✅ Quick Actions - Only for SuperAdmin/TeamLead */}
              {canTakeAction && !isEditing && canEditTicket && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                  <h3 className="text-sm font-bold text-gray-800 mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <button onClick={handleAccept} disabled={processing || !editData.adminRemarks.trim()}
                      className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
                      <CheckCircle size={16} /> Accept Ticket
                    </button>
                    <button onClick={handleReject} disabled={processing || !editData.adminRemarks.trim()}
                      className="w-full py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2">
                      <XCircle size={16} /> Reject Ticket
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-2">Add admin remarks before accepting/rejecting</p>
                  </div>
                </motion.div>
              )}

              {/* Activity */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"><Clock size={16} className="text-purple-600" /> Activity</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-gray-600"><div className="w-2 h-2 bg-green-500 rounded-full"></div><span>Created {formatDate(ticket.createdAt)}</span></div>
                  {ticket.updatedAt !== ticket.createdAt && <div className="flex items-center gap-2 text-gray-600"><div className="w-2 h-2 bg-blue-500 rounded-full"></div><span>Updated {formatDate(ticket.updatedAt)}</span></div>}
                  {ticket.status === "Resolved" && <div className="flex items-center gap-2 text-gray-600"><div className="w-2 h-2 bg-purple-500 rounded-full"></div><span>Resolved</span></div>}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}