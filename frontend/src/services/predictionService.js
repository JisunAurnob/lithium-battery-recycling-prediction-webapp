import api from "@/lib/api";

const predict = async (model, features) => {
  try {
    const response = await api.post(`/predict/${model}`, { features });
    const prediction = response?.data?.prediction?.[0];

    if (typeof prediction !== "number" || !Number.isFinite(prediction)) {
      throw new Error("The prediction service returned an invalid result.");
    }

    return prediction;
  } catch (error) {
    const message = error.response?.data?.error;

    if (message) {
      throw new Error(message);
    }

    if (error.code === "ECONNABORTED") {
      throw new Error("The prediction took too long. Please try again.");
    }

    if (error.request) {
      throw new Error(
        "The prediction server could not be reached. Check that the backend is running."
      );
    }

    throw error;
  }
};

export const costPredict = (features) => predict("cost", features);
export const circularityPredict = (features) =>
  predict("circularity", features);
export const profitabilityPredict = (features) => predict("profit", features);
