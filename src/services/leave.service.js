import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Get Authorization Header
 */
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

/**
 * Leave Service - All API calls for leave management
 */
const leaveService = {
  // ==================== LEAVE CREDITS ====================

  /**
   * Bulk create leave credits (SuperAdmin only)
   * Creates 12 annual leave days for all eligible users
   */
  bulkCreateCredits: async (year, effectiveFrom) => {
    try {
      const response = await axios.post(
        `${API_URL}/leaves/leave-credits/bulk`,
        { year, effectiveFrom },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get all leave credits (SuperAdmin)
   * Fetch leave credits for all users for a specific year
   */
  getAllCredits: async (year) => {
    try {
      const response = await axios.get(`${API_URL}/leaves/leave-credits/all`, {
        params: { year },
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update user leave credit (SuperAdmin)
   * Update sick/maternity/bereavement leave for a specific user
   */
  updateUserCredit: async (creditId, data) => {
    try {
      const response = await axios.put(
        `${API_URL}/leaves/leave-credits/${creditId}`,
        data,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get current user's leave credits
   * Fetch my leave credit for a specific year
   */
  getMyCredits: async (year) => {
    try {
      const response = await axios.get(`${API_URL}/leaves/myleave-credits`, {
        params: { year },
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ==================== LEAVE APPLICATIONS ====================

  /**
   * Apply for leave
   * Submit a new leave application
   */
  applyLeave: async (leaveData) => {
    try {
      const response = await axios.post(
        `${API_URL}/leaves/apply`,
        leaveData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get my leave applications
   * Fetch all leave applications for current user
   */
  getMyApplications: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/leaves/my-applications`, {
        params: filters,
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get all leave applications (SuperAdmin/TeamLead)
   * Fetch all leave applications across the organization
   */
  getAllApplications: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/leaves/all-applications`, {
        params: filters,
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get pending leave applications (SuperAdmin/TeamLead)
   * Fetch only pending leave applications
   */
  getPendingApplications: async () => {
    try {
      const response = await axios.get(`${API_URL}/leaves/pending-applications`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update leave application status (Approve/Reject)
   * Review and update leave application
   */
  updateLeaveStatus: async (leaveId, status, rejectionReason = "") => {
    try {
      const response = await axios.put(
        `${API_URL}/leaves/applications/${leaveId}/status`,
        { status, rejectionReason },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ==================== ANALYTICS & STATS ====================

  /**
   * Get leave statistics
   * Fetch aggregated leave stats for dashboard
   */
  getLeaveStats: async (year) => {
    try {
      const [creditsRes, applicationsRes] = await Promise.all([
        leaveService.getAllCredits(year),
        leaveService.getAllApplications({ year }),
      ]);

      const credits = creditsRes.data || [];
      const applications = applicationsRes.data || [];

      const stats = {
        totalUsers: credits.length,
        totalApplications: applications.length,
        pendingApplications: applications.filter((app) => app.status === "pending").length,
        approvedApplications: applications.filter((app) => app.status === "approved").length,
        rejectedApplications: applications.filter((app) => app.status === "rejected").length,
        totalLOPDays: credits.reduce((sum, credit) => sum + (credit.lossOfPayCount || 0), 0),
        approvedThisMonth: applications.filter(
          (app) =>
            app.status === "approved" &&
            new Date(app.appliedAt).getMonth() === new Date().getMonth()
        ).length,
      };

      return stats;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get user leave summary
   * Fetch complete leave summary for current user
   */
  getUserLeaveSummary: async (year) => {
    try {
      const [creditRes, applicationsRes] = await Promise.all([
        leaveService.getMyCredits(year),
        leaveService.getMyApplications({ year }),
      ]);

      const credit = creditRes.data;
      const applications = applicationsRes.data || [];

      const summary = {
        credit,
        applications,
        stats: {
          total: applications.length,
          pending: applications.filter((app) => app.status === "pending").length,
          approved: applications.filter((app) => app.status === "approved").length,
          rejected: applications.filter((app) => app.status === "rejected").length,
          lopCount: credit?.lossOfPayCount || 0,
          remainingAnnual: credit
            ? credit.annualLeave.total - credit.annualLeave.used
            : 0,
        },
      };

      return summary;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Calculate leave days between two dates
   */
  calculateLeaveDays: (fromDate, toDate, durationType) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (fromDate === toDate) {
      return durationType === "fullday" ? 1 : 0.5;
    } else {
      const diffTime = Math.abs(to - from);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
  },

  /**
   * Get time slot based on duration type
   */
  getTimeSlot: (durationType) => {
    if (durationType === "fullday") return "9:30 AM to 6:30 PM";
    if (durationType === "halfday-morning") return "9:30 AM to 2:00 PM";
    if (durationType === "halfday-evening") return "2:00 PM to 6:30 PM";
    return "9:30 AM to 6:30 PM";
  },

  /**
   * Format date for display
   */
  formatDate: (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },

  /**
   * Get leave type label
   */
  getLeaveTypeLabel: (durationType) => {
    if (durationType === "halfday-morning") return "Half Day - Morning";
    if (durationType === "halfday-evening") return "Half Day - Evening";
    return "Full Day";
  },

  /**
   * Check if leave will be LOP
   * This is a helper to predict LOP before submission
   */
  willBeLOP: (leaveCategory, calculatedDays, leaveCredit, annualLeaveUsedThisMonth) => {
    // Work from home is always LOP
    if (leaveCategory === "workFromHome") return true;

    // Annual leave logic
    if (leaveCategory === "annual") {
      const remainingAnnual = leaveCredit
        ? leaveCredit.annualLeave.total - leaveCredit.annualLeave.used
        : 0;

      // If already used 1+ approved annual leave this month
      if (annualLeaveUsedThisMonth >= 1) return true;

      // If not enough balance
      if (calculatedDays > remainingAnnual) return true;
    }

    // Special leaves (sick, maternity, bereavement)
    if (["sick", "maternity", "bereavement"].includes(leaveCategory)) {
      const leaveType = leaveCategory + "Leave";
      const remaining = leaveCredit
        ? (leaveCredit[leaveType]?.total || 0) - (leaveCredit[leaveType]?.used || 0)
        : 0;

      // If not enough balance
      if (calculatedDays > remaining) return true;
    }

    return false;
  },

  /**
   * Validate leave application
   */
  validateLeaveApplication: (formData, leaveCredit) => {
    const errors = [];

    // Date validation
    if (!formData.fromDate || !formData.toDate) {
      errors.push("Please select both dates");
    }

    const from = new Date(formData.fromDate);
    const to = new Date(formData.toDate);

    if (to < from) {
      errors.push("End date cannot be before start date");
    }

    // Half day validation
    if (
      formData.durationType !== "fullday" &&
      formData.fromDate !== formData.toDate
    ) {
      errors.push("Half day leave can only be applied for a single day");
    }

    // Special leave eligibility
    if (["sick", "maternity", "bereavement"].includes(formData.leaveCategory)) {
      const leaveType = formData.leaveCategory + "Leave";
      const totalAllocated = leaveCredit?.[leaveType]?.total || 0;

      if (totalAllocated === 0) {
        errors.push(
          `You are not allocated ${formData.leaveCategory} leave. Please contact SuperAdmin.`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

export default leaveService;