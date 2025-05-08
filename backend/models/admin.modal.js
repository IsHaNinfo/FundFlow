import { DataTypes } from "sequelize";
import sequelize from "../config/db.connection.js";

export const Admin = sequelize.define(
    "Admin",
    {
        
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "Admin",
    }
);