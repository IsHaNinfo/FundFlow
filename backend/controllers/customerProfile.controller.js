import * as customerProfileService from "../services/customerProfile.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createCustomerProfile = async (req, res, next) => {
    try {
        const profile = await customerProfileService.createCustomerProfile(req.user.id, req.body);
        return res.status(ApiResponse.HTTP_STATUS.CREATED).json(

            {
                status: ApiResponse.HTTP_STATUS.OK,
                data: profile,
                message: "Customer profile created successfully"
            }
        );
    } catch (error) {
        next(error);
    }
};

export const getCustomerProfileById = async (req, res, next) => {
    try {
        const profile = await customerProfileService.getCustomerProfileById(req.params.id);

        return res.status(ApiResponse.HTTP_STATUS.CREATED).json(

            {
                status: ApiResponse.HTTP_STATUS.OK,
                data: profile,
                message: "Customer profile retrieved successfully"
            }
        );
    } catch (error) {
        next(error);
    }
};

export const getCustomerProfileByUserId = async (req, res, next) => {
    try {
        const profile = await customerProfileService.getCustomerProfileByUserId(req.params.userId);

        return res.status(ApiResponse.HTTP_STATUS.CREATED).json(

            {
                status: ApiResponse.HTTP_STATUS.OK,
                data: profile,
                message: "Customer profile retrieved successfully"
            }
        );
    } catch (error) {
        next(error);
    }
};

export const updateCustomerProfile = async (req, res, next) => {
    try {
        const profile = await customerProfileService.updateCustomerProfile(req.params.id, req.body);

        return res.status(ApiResponse.HTTP_STATUS.CREATED).json(

            {
                status: ApiResponse.HTTP_STATUS.OK,
                data: profile,
                message: "Customer profile updated successfully"
            }
        );
    } catch (error) {
        next(error);
    }
};

export const deleteCustomerProfile = async (req, res, next) => {
    try {
        const result = await customerProfileService.deleteCustomerProfile(req.params.id);

        return res.status(ApiResponse.HTTP_STATUS.CREATED).json(

            {
                status: ApiResponse.HTTP_STATUS.OK,
                data: result,
                message: "Customer profile deleted successfully"
            }
        );
    } catch (error) {
        next(error);
    }
};

export const getAllCustomerProfiles = async (req, res, next) => {
    try {
        const profiles = await customerProfileService.getAllCustomerProfiles();

        return res.status(ApiResponse.HTTP_STATUS.CREATED).json(

            {
                status: ApiResponse.HTTP_STATUS.OK,
                data: profiles,
                message: "Customer profiles retrieved successfully"
            }
        );
    } catch (error) {
        next(error);
    }
}; 