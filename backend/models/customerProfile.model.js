import { DataTypes } from "sequelize";
import sequelize from "../config/db.connection.js";
import { User } from "./user.modal.js";

export const CustomerProfile = sequelize.define(
    "CustomerProfile",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        monthlyIncome: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        occupation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        creditScore: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 300,
                max: 850
            }
        }
    },
    {
        tableName: "CustomerProfile",
        timestamps: true
    }
);

// Define the relationship
CustomerProfile.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE'  // Add this line

});

User.hasOne(CustomerProfile, {
    foreignKey: 'userId',
    as: 'profile',
    onDelete: 'CASCADE'  // Add this line

}); 