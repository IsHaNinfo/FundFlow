import { DataTypes } from "sequelize";
import sequelize from "../config/db.connection.js";
import { User } from "./user.modal.js";

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
            validate: {
                min: 0
            }
        },
        durationMonths: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        purpose: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        monthlyIncome: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        existingLoans: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending',
            allowNull: false
        }
    },
    {
        tableName: "Loan",
        timestamps: true
    }
);

// Define the relationship
Loan.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

User.hasMany(Loan, {
    foreignKey: 'userId',
    as: 'loans'
});