import * as adminService from "../services/admin.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const admin = await adminService.verifyAdmin(email, password);
        res.status(ApiResponse.HTTP_STATUS.OK).json(
            ApiResponse.success(admin, 'Admin logged in successfully')
        );
    } catch (error) {
        next(error);
    }
};

export const getAdmin = async (req, res, next) => {
    try {
        const { email } = req.params;
        const admin = await adminService.getAdminByEmail(email);
        res.status(ApiResponse.HTTP_STATUS.OK).json(
            ApiResponse.success(admin, 'Admin retrieved successfully')
        );
    } catch (error) {
        next(error);
    }
};

export const verifyAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const admin = await adminService.verifyAdmin(email, password);
        res.status(ApiResponse.HTTP_STATUS.OK).json(
            ApiResponse.success(admin, 'Admin verified successfully')
        );
    } catch (error) {
        next(error);
    }
};

export const initializeAdmin = async (req, res, next) => {
    try {
        const admin = await adminService.initializeAdmin();
        res.status(ApiResponse.HTTP_STATUS.CREATED).json(
            ApiResponse.success(admin, 'Admin initialized successfully')
        );
    } catch (error) {
        next(error);
    }
};
