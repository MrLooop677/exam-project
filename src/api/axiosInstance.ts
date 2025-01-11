import axios from "axios";

// Create an axios instance
const apiInstance = axios.create({
  baseURL:
    "https://sah-platform-api-egghayfcc4ddeuae.canadacentral-01.azurewebsites.net/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to include the token from localStorage in each request
apiInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Add Authorization header to the request
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.url?.includes("Student/SubmitStudentAnswerModelExam")) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiInstance;
