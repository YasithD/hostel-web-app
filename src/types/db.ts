export const REQUEST_UPDATE_ACTIONS = {
  UPDATE_LAST_VIEWED_AT: "UPDATE_LAST_VIEWED_AT",
  APPROVE_REQUEST: "APPROVE_REQUEST",
  REJECT_REQUEST: "REJECT_REQUEST",
} as const;

export type RequestAction = (typeof REQUEST_UPDATE_ACTIONS)[keyof typeof REQUEST_UPDATE_ACTIONS];

export const ACCOUNT_ACTIVATION_STATUS = {
  PENDING: "pending",
  ACTIVATION_SENT: "activation_sent",
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type AccountActivationStatus = (typeof ACCOUNT_ACTIVATION_STATUS)[keyof typeof ACCOUNT_ACTIVATION_STATUS];

export type UserActions = AccountActivationStatus;
