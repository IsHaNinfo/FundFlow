import { Admin } from "../models/admin.modal.js";
import bcrypt from "bcrypt";
import sequelize from "../config/db.connection.js";

export const createAdmin = async () => {



    const encrypted_pw = await bcrypt.hash(process.env.ADMIN_PW, 10);
    await sequelize.sync();

    const newAdmin = await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: encrypted_pw,
    });
    return newAdmin;

};

export const verifyAdmin = async (email, password) => {
    const admin = await Admin.findOne({ where: { email } });

    return admin;

};

export const getAdminByEmail = async (email) => {

    const admin = await Admin.findOne({ where: { email } });
    return admin;

}
