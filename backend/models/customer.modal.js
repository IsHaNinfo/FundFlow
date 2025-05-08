import { DataTypes } from "sequelize";
import sequelize from "../config/db.connection.js";

export const Customer = sequelize.define(
    "Customer",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
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
            unique: true
        },
        nic: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        monthlyIncome: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        creditScore: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
    },
    {
        tableName: "Customer",
    }
);