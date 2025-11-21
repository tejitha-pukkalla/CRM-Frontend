import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Eye, ChevronLeft, ChevronRight } from "lucide-react";

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

const categoryIcons = {
  General: "📋",
  Bug: "🐛",
  Feature: "✨",
  Support: "🤝",
};

export default function TicketTable({ tickets, formatDate, user, onViewDetail }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const isSuperAdmin = user?.globalRole === "superadmin";

  const totalPages = Math.ceil(tickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTickets = tickets.slice(startIndex, endIndex);

  const goToPage = (page) => setCurrentPage(page);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {isSuperAdmin ? "All Support Tickets" : "My Tickets"}
            </h2>
            <p className="text-sm text-gray-600">
              {isSuperAdmin
                ? "View and manage all tickets. Click 👁️ to view details and manage."
                : "View and track your support requests"}
            </p>
          </div>
          {tickets.length > 0 && (
            <div className="text-sm text-gray-600">
              Total: <span className="font-semibold">{tickets.length}</span> tickets
            </div>
          )}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">Ticket ID</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">Title</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">Category</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">Priority</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">Status</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">Assigned To</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">Created By</th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">Created At</th>
              <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase whitespace-nowrap">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentTickets.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <AlertCircle size={48} className="mb-3" />
                    <p className="text-lg font-medium">No tickets found</p>
                    <p className="text-sm">Create your first support request to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentTickets.map((ticket, index) => (
                <motion.tr
                  key={ticket._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onViewDetail && onViewDetail(ticket._id)}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-indigo-600">{ticket.ticketId || ticket._id}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={ticket.title}>{ticket.title}</div>
                    <div className="text-xs text-gray-500 max-w-xs truncate" title={ticket.description}>{ticket.description}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-sm">
                      {categoryIcons[ticket.category]} {ticket.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityColors[ticket.priority]}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[ticket.status]}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {ticket.assignedTo || <span className="text-gray-400">Not assigned</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{ticket.createdBy?.name || "Unknown"}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[150px]" title={ticket.createdBy?.email}>
                      {ticket.createdBy?.email || "N/A"}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(ticket.createdAt)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); onViewDetail && onViewDetail(ticket._id); }}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      title="View & Manage"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {tickets.length > itemsPerPage && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
              <span className="font-semibold">{Math.min(endIndex, tickets.length)}</span> of{" "}
              <span className="font-semibold">{tickets.length}</span> tickets
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                <ChevronLeft size={16} /> Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)) {
                    return (
                      <button key={pageNumber} onClick={() => goToPage(pageNumber)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNumber ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100 border border-gray-300"}`}>
                        {pageNumber}
                      </button>
                    );
                  } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                    return <span key={pageNumber} className="px-2 text-gray-400">...</span>;
                  }
                  return null;
                })}
              </div>
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}