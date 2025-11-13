export const ROLES = {
  SUPERADMIN: 'superadmin',
  TEAMLEAD: 'teamlead',
  PROJECTLEAD: 'projectlead',
  MEMBER: 'member'
};

export const PROJECT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ON_HOLD: 'on-hold'
};

export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const TASK_APPROVAL_STATUS = {
  PENDING: 'pending',
  PENDING_TEAMLEAD: 'pending_teamlead',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const TASK_STATUS = {
  NOT_STARTED: 'not-started',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  BACK_TO_PROJECTLEAD: 'back_to_projectlead'
};

export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const PROJECT_ROLES = {
  TEAMLEAD: 'teamlead',
  PROJECTLEAD: 'projectlead',
  MEMBER: 'member'
};

export const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'task_assigned',
  TASK_APPROVED: 'task_approved',
  TASK_REJECTED: 'task_rejected',
  TASK_COMPLETED: 'task_completed',
  PROJECT_CREATED: 'project_created',
  USER_CREATED: 'user_created',
  TASK_REASSIGNED: 'task_reassigned',
  DUE_DATE_APPROACHING: 'due_date_approaching',
  TASK_OVERDUE: 'task_overdue'
};