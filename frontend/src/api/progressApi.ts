import axiosInstance from "./axios";

export const getProgress = async () => {
    const response = await axiosInstance.get("/progress");
    return response.data;
};