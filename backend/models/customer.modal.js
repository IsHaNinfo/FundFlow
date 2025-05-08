import { DataTypes } from "sequelize";
import sequelize from "../config/db.connection.js";

export const Customer = sequelize.define(
    "Customer",
    {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nic: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        monthlyIncome: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        creditScore: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
    },
    {
        tableName: "Customer",
    }
);