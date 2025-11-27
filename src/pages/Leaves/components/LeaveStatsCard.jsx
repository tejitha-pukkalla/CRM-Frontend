import { motion } from "framer-motion";

/**
 * Reusable Stats Card Component
 * Used in dashboards to display key metrics
 */
export default function LeaveStatsCard({ 
  icon: Icon, 
  label, 
  value, 
  color, 
  delay = 0, 
  pulse = false,
  subtext = "",
  onClick = null
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      onClick={onClick}
      className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 overflow-hidden group hover:scale-105 ${
        pulse ? "animate-pulse" : ""
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      {/* Gradient Background on Hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />

      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-4xl font-bold text-gray-900">{value}</p>
          {subtext && (
            <p className="text-xs text-gray-500 mt-1">{subtext}</p>
          )}
        </div>
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} shadow-lg flex-shrink-0`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`} />
    </motion.div>
  );
}