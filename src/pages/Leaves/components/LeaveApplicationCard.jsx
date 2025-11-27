import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Sun,
  Sunrise,
  Sunset,
  Eye,
  User
} from "lucide-react";

/**
 * Reusable Leave Application Card Component
 * Can be used in lists/grids to display leave applications
 */
export default function LeaveApplicationCard({ 
  leave, 
  index = 0,
  onViewDetails,
  onApprove,
  onReject,
  showActions = false,
  showEmployee = true
}) {
  const getLeaveTypeIcon = (durationType) => {
    if (durationType === "halfday-morning") return <Sunrise className="w-4 h-4 text-yellow-500" />;
    if (durationType === "halfday-evening") return <Sunset className="w-4 h-4 text-purple-500" />;
    return <Sun className="w-4 h-4 text-orange-500" />;
  };

  const getLeaveTypeText = (durationType) => {
    if (durationType === "halfday-morning") return "Half Day - Morning";
    if (durationType === "halfday-evening") return "Half Day - Evening";
    return "Full Day";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (status === "approved") return "bg-green-100 text-green-800 border-green-300";
    if (status === "rejected") return "bg-red-100 text-red-800 border-red-300";
  };

  const getStatusIcon = (status) => {
    if (status === "pending") return <Clock className="w-4 h-4" />;
    if (status === "approved") return <CheckCircle className="w-4 h-4" />;
    if (status === "rejected") return <XCircle className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 p-5 hover:scale-[1.02]"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Employee Info */}
          {showEmployee && (
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{leave.name}</p>
                <p className="text-xs text-gray-500">{leave.email}</p>
              </div>
            </div>
          )}

          {/* Leave Type */}
          <div className="flex items-center gap-2 mb-2">
            {getLeaveTypeIcon(leave.durationType)}
            <span className="text-sm font-medium text-gray-700 capitalize">
              {leave.leaveCategory}
            </span>
            <span className="text-xs text-gray-500">
              • {getLeaveTypeText(leave.durationType)}
            </span>
          </div>

          {/* LOP Badge */}
          {leave.isLossOfPay && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 rounded-full">
              <AlertCircle className="w-3 h-3 text-orange-600" />
              <span className="text-xs font-bold text-orange-600">
                LOP: {leave.lossOfPayCount || 0} day(s)
              </span>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(
            leave.status
          )}`}
        >
          {getStatusIcon(leave.status)}
          {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
        </span>
      </div>

      {/* Dates & Duration */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
          <Calendar className="w-4 h-4 text-blue-600" />
          <div>
            <p className="text-xs text-gray-600">Duration</p>
            <p className="text-sm font-bold text-blue-600">
              {(leave.leaveDays || leave.hours / 8).toFixed(1)} day(s)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
          <Clock className="w-4 h-4 text-purple-600" />
          <div>
            <p className="text-xs text-gray-600">Applied On</p>
            <p className="text-xs font-bold text-purple-600">
              {formatDate(leave.appliedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Date Range */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-gray-500">From:</span>
            <p className="font-semibold text-gray-800">{formatDate(leave.fromDate)}</p>
          </div>
          <div className="text-gray-400">→</div>
          <div>
            <span className="text-gray-500">To:</span>
            <p className="font-semibold text-gray-800">{formatDate(leave.toDate)}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      {leave.description && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600 mb-1">Reason:</p>
          <p className="text-sm text-gray-800">{leave.description}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-200">
        {showActions && leave.status === "pending" ? (
          <>
            <button
              onClick={() => onApprove && onApprove(leave)}
              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={() => onReject && onReject(leave)}
              className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </>
        ) : (
          <button
            onClick={() => onViewDetails && onViewDetails(leave)}
            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
        )}
      </div>
    </motion.div>
  );
}