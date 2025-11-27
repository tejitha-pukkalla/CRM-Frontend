import { motion } from "framer-motion";
import { X, Calendar, AlertCircle, CheckCircle, XCircle, Clock, Sun, Sunrise, Sunset } from "lucide-react";

const STATUS_COLORS = {
  pending: "bg-yellow-50 border-yellow-200 text-yellow-900",
  approved: "bg-green-50 border-green-200 text-green-900",
  rejected: "bg-red-50 border-red-200 text-red-900",
};

export default function LeaveDetailsModal({ leave, onClose }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getLeaveTypeIcon = (durationType) => {
    if (durationType === "halfday-morning") return <Sunrise className="w-5 h-5 text-yellow-500" />;
    if (durationType === "halfday-evening") return <Sunset className="w-5 h-5 text-purple-500" />;
    return <Sun className="w-5 h-5 text-orange-500" />;
  };

  const getLeaveTypeText = (durationType) => {
    if (durationType === "halfday-morning") return "Half Day - Morning";
    if (durationType === "halfday-evening") return "Half Day - Evening";
    return "Full Day";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Leave Application Details
            </h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Employee Info */}
          <div className="bg-indigo-50 rounded-xl p-4 border-2 border-indigo-200">
            <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Employee Information
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-indigo-700 font-medium">Name:</span>
                <p className="font-bold text-indigo-900 mt-1">{leave.name}</p>
              </div>
              <div>
                <span className="text-indigo-700 font-medium">Email:</span>
                <p className="font-bold text-indigo-900 mt-1">{leave.email}</p>
              </div>
            </div>
          </div>

          {/* Leave Details */}
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
            <h4 className="font-bold text-gray-900 mb-3">Leave Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 font-medium">Category:</span>
                <p className="font-bold text-gray-900 mt-1 capitalize">{leave.leaveCategory}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Type:</span>
                <p className="font-bold text-gray-900 mt-1 flex items-center gap-2">
                  {getLeaveTypeIcon(leave.durationType)}
                  {getLeaveTypeText(leave.durationType)}
                </p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Duration:</span>
                <p className="font-bold text-gray-900 mt-1">
                  {(leave.leaveDays || leave.hours / 8).toFixed(1)} day(s)
                </p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Hours:</span>
                <p className="font-bold text-gray-900 mt-1">{leave.hours} hours</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">From Date:</span>
                <p className="font-bold text-gray-900 mt-1">{formatDate(leave.fromDate)}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">To Date:</span>
                <p className="font-bold text-gray-900 mt-1">{formatDate(leave.toDate)}</p>
              </div>
              {leave.timeSlot && (
                <div className="col-span-2">
                  <span className="text-gray-600 font-medium">Time Slot:</span>
                  <p className="font-bold text-gray-900 mt-1 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    {leave.timeSlot}
                  </p>
                </div>
              )}
              {leave.description && (
                <div className="col-span-2">
                  <span className="text-gray-600 font-medium">Reason:</span>
                  <p className="font-bold text-gray-900 mt-1">{leave.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Status Information */}
          <div className={`rounded-xl p-4 border-2 ${STATUS_COLORS[leave.status]}`}>
            <h4 className="font-bold mb-3 flex items-center gap-2">
              {leave.status === "approved" && <CheckCircle className="w-5 h-5" />}
              {leave.status === "rejected" && <XCircle className="w-5 h-5" />}
              {leave.status === "pending" && <Clock className="w-5 h-5" />}
              Status Information
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">Current Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
                    leave.status === "approved"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : leave.status === "rejected"
                      ? "bg-red-100 text-red-800 border-red-300"
                      : "bg-yellow-100 text-yellow-800 border-yellow-300"
                  }`}
                >
                  {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                </span>
              </div>

              <div>
                <span className="font-medium">Applied On:</span>
                <p className="font-bold mt-1">{formatDate(leave.appliedAt)}</p>
              </div>

              {leave.reviewedBy && (
                <>
                  <div>
                    <span className="font-medium">Reviewed By:</span>
                    <p className="font-bold mt-1">{leave.reviewedBy?.name || "Administrator"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Reviewed On:</span>
                    <p className="font-bold mt-1">{formatDate(leave.reviewedAt)}</p>
                  </div>
                </>
              )}

              {leave.isLossOfPay && (
                <div className="bg-orange-100 border-2 border-orange-300 rounded-lg p-3 mt-2">
                  <p className="text-orange-900 font-bold flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Loss of Pay: {leave.lossOfPayCount || 0} day(s)
                  </p>
                  <p className="text-xs mt-1 text-orange-800">
                    This leave exceeds your monthly paid leave limit and is unpaid.
                  </p>
                </div>
              )}

              {leave.rejectionReason && (
                <div className="bg-red-100 border-2 border-red-300 rounded-lg p-3 mt-2">
                  <span className="font-bold block mb-1">Rejection Reason:</span>
                  <p className="text-red-900">{leave.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}