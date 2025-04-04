import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Correct usage of Vite env variable

export const axiosInstance = axios.create({
    baseURL: API_URL, // Use API_URL here
});

export const generateResume = async (description) => {
    console.log("baseUrl:", API_URL); // Debugging: Check if API_URL is correctly loaded
    
    try {
        const response = await axiosInstance.post(`/api/v1/resume/generate`,
           { userDescription: description},
            { headers: { "Content-Type": "application/json" } }
        );

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
