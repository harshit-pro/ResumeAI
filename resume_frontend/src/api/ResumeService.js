import axios from "axios";
// export const baseUrl = `${process.env.REACT_APP_API_URL}`; // using backticks to allow environment variables
export const baseUrl = import.meta.env.VITE_API_URL;
export const axiosInstance = axios.create({
    baseURL: baseUrl,
});

export const generateResume = async (description) => {
    console.log("baseUrl", baseUrl);
    
    try {
        const response = await axiosInstance.post("/api/v1/resume/generate", {
            userDescription: description,
        });

        if (response.data && response.data.generatedResume) {
            return response.data.generatedResume; // Extract only the resume content
        } else {
            throw new Error("Invalid response format from server.");
        }

    } catch (error) {
        console.error("Error generating resume:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to generate resume. Please try again.");
    }
};