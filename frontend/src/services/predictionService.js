import api from "@/lib/api";

export const costPredict = async (features) => {
    try {
        const response = await api.post(`/predict/cost`, features);
        if (response?.data?.prediction) {
            return response?.data?.prediction[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error request:", error);
    }
};
export const circularityPredict = async (features) => {
    try {
        const response = await api.post(`/predict/circularity`, features);
        if (response?.data?.prediction) {
            return response?.data?.prediction[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error request:", error);
    }
};
export const profitabilityPredict = async (features) => {
    try {
        const response = await api.post(`/predict/profit`, features);
        if (response?.data?.prediction) {
            return response?.data?.prediction[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error request:", error);
    }
};