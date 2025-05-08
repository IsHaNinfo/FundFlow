import { DataTypes } from "sequelize";
import sequelize from "../config/db.connection.js";
import { Customer } from "./customer.modal.js";

export const Loan = sequelize.define(
    "Loan",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        loanAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        durationMonths: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        purpose: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        monthlyIncome: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        existingLoans: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        customerId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Customer,
                key: 'id'
            }
        }
    },
    {
        tableName: "Loan",
    }
);

// Define the relationship
Loan.belongsTo(Customer, {
    foreignKey: 'customerId',
    as: 'customer'
});

Customer.hasMany(Loan, {
    foreignKey: 'customerId',
    as: 'loans'
});