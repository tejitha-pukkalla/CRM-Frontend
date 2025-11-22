import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import DashboardLayout from "../../layout/DashboardLayout";
import TicketStats from "./components/TicketStats";
import TicketTable from "./components/TicketsTable";
import TicketModal from "./components/TicketModal";
import TicketDetailPage from "./TicketDetailPage";
import ticketService from "../../services/ticket.service";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";

export default function TicketManagement() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Low",
    category: "General",
  });

  useEffect(() => {
    if (user) {
      console.log("✅ User globalRole:", user?.globalRole);
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");

      let data;
      if (user?.globalRole === "superadmin") {
        console.log("🔓 Fetching ALL tickets for SuperAdmin");
        data = await ticketService.getAllTickets();
      } else {
        console.log("🔒 Fetching MY tickets");
        data = await ticketService.getMyTickets();
      }

      console.log("📦 Tickets data:", data);
      setTickets(data?.data || []);
    } catch (err) {
      console.error("❌ Error fetching tickets:", err);
      setError("Failed to load tickets. Please try again.");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const response = await ticketService.createTicket(formData);
      setTickets([response?.data || response, ...tickets]);
      setForm({ title: "", description: "", priority: "Low", category: "General" });
      setTimeout(() => setIsModalOpen(false), 1500);
      return { success: true, message: "✅ Ticket created successfully!" };
    } catch (err) {
      console.error("Error creating ticket:", err);
      return { success: false, message: "❌ Failed to create ticket." };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  };

  const handleViewTicketDetail = (ticketId) => {
    setSelectedTicketId(ticketId);
  };

  const handleBackFromDetail = () => {
    setSelectedTicketId(null);
    fetchTickets(); // Refresh tickets after returning
  };

  // Show Ticket Detail Page
  if (selectedTicketId) {
    return <TicketDetailPage ticketId={selectedTicketId} onBack={handleBackFromDetail} />;
  }

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading tickets...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isSuperAdmin = user?.globalRole === "superadmin";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header - Fixed Font Size */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                🎫 Support Tickets
              </h1>
              <p className="text-sm text-gray-600">
                {isSuperAdmin
                  ? "Manage and track all support requests from all users"
                  : "View and track your support requests"}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 font-medium text-sm"
            >
              <Plus size={18} /> Create Request
            </motion.button>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Stats */}
          <TicketStats tickets={tickets} />

          {/* Ticket Table */}
          <TicketTable
            tickets={tickets}
            formatDate={formatDate}
            user={user}
            onViewDetail={handleViewTicketDetail}
          />

          {/* Modal */}
          <TicketModal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}