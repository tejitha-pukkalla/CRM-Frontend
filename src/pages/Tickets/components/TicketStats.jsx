import { motion } from "framer-motion";
import { AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react";

export default function TicketStats({ tickets }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[
        { title: "Total Tickets", count: tickets.length, icon: <AlertCircle className="text-blue-600" size={24} />, color: "bg-blue-100" },
        { title: "Open", count: tickets.filter(t => t.status === "Open").length, icon: <Clock className="text-blue-600" size={24} />, color: "bg-blue-100" },
        { title: "Resolved", count: tickets.filter(t => t.status === "Resolved").length, icon: <CheckCircle className="text-green-600" size={24} />, color: "bg-green-100" },
        { title: "High Priority", count: tickets.filter(t => t.priority === "High").length, icon: <XCircle className="text-red-600" size={24} />, color: "bg-red-100" },
      ].map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-800">{stat.count}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-xl`}>{stat.icon}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
