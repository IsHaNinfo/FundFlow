// models/mongodbLoanLog.js
import mongoose from "mongoose";

const LoanLogSchema = new mongoose.Schema({
  loanId: {
    type: String, // UUID or ObjectId
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['Loan Created', 'Loan Updated', 'Status Changed']
  },
  oldData: {
    type: Object,
    default: {}
  },
  newData: {
    type: Object,
    default: {}
  },
  performedBy: {
    type: String // Admin email or ID
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'loan_logs'
});

export const LoanLog = mongoose.model('LoanLog', LoanLogSchema);
