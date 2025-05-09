// loggers/loan.logger.js
import { LoanLog } from "../models/mongodbLoanLog.js";

/**
 * Logs loan actions to MongoDB.
 * @param {Object} logData
 * @param {String} logData.loanId
 * @param {String} logData.userId
 * @param {String} logData.action - E.g., 'Loan Created', 'Status Changed'
 * @param {Object} [logData.oldData] - Optional
 * @param {Object} [logData.newData] - Optional
 * @param {String} [logData.performedBy='system']
 */
export const logLoanRequest = async ({
  loanId,
  userId,
  action,
  oldData = {},
  newData = {},
  performedBy = "system"
}) => {
  try {
    await LoanLog.create({
      loanId,
      userId,
      action,
      oldData,
      newData,
      performedBy,
      timestamp: new Date()
    });

    console.log(`[MongoDB] Logged ${action} for loan ${loanId}`);
  } catch (error) {
    console.error("MongoDB Logging Error:", error.message);
  }
};
