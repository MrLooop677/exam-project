import apiInstance from "./axiosInstance";

// Login function
export const studentLogin = async (username: string, password: string) => {
  try {
    const response = await apiInstance.post("/Account/StudentLogin", {
      UserName: username, // Updated key from phone to UserName
      Password: password,
    });

    // Assuming the token is returned in the response data under "token"
    const { token } = response.data.Data;

    // Store the token in localStorage
    if (token) {
      localStorage.setItem("token", token);
    }

    return response.data; // Assuming the response contains user data or token
  } catch (error: any) {
    throw error.response ? error.response.data : new Error("Login failed");
  }
};
export const adminSchoolLogin = async (username: string, password: string) => {
  try {
    const response = await apiInstance.post("/Account/AdminSchoolLogin", {
      UserName: username, // Updated key to UserName
      Password: password,
    });

    // Assuming the token is returned in the response data under "token"
    const { token } = response.data.Data;

    // Store the token in localStorage
    if (token) {
      localStorage.setItem("token", token);
    }

    return response.data; // Assuming the response contains user data or token
  } catch (error: any) {
    throw error.response ? error.response.data : new Error("Login failed");
  }
};

export const getStudentExams = async () => {
  try {
    const response = await apiInstance.get("/Exam/GetStudentExams");

    // Assuming the response data contains the exam data
    return response.data;
  } catch (error: any) {
    throw error.response
      ? error.response.data
      : new Error("Failed to fetch exams");
  }
};

export const checkSkillsExamsAvailability = async (id) => {
  try {
    const response = await apiInstance.get(
      `/Exam/CheckSkillsExamsAvailability?examId=${id}`
    );

    // Assuming the response data contains the availability information
    return response.data;
  } catch (error: any) {
    throw error.response
      ? error.response.data
      : new Error("Failed to check skills exams availability");
  }
};
export const getAllQuestionsReading = async (id) => {
  try {
    const response = await apiInstance.get(
      `/Student/GetStudentModelExam?Skill=1&ExamId=${id}`
    );

    // Assuming the response data contains the availability information
    return response.data;
  } catch (error: any) {
    throw error.response
      ? error.response.data
      : new Error("Failed to check skills exams availability");
  }
};
export const submitExamData = async (payload) => {
  try {
    const response = await apiInstance.post(
      `/Student/SubmitStudentAnswerModelExam`,
      payload
    );

    // Assuming the response data contains the availability information
    return response.data;
  } catch (error: any) {
    throw error.response
      ? error.response.data
      : new Error("Failed to check skills exams availability");
  }
};

export const searchSchools = async (
  keyword: string = "",
  page: number = 1,
  size: number = 20,
  sortField: string | null = null, // Optional: field to sort by
  sortOrder: number | null = null, // Optional: sort order (1 for ascending, -1 for descending)
  filters: { field: string; value: string }[] = [] // Optional: array of filters
) => {
  try {
    const requestBody: any = {
      keyword, // The keyword to search for schools
      page, // Page number for pagination
      size, // Page size for pagination
    };

    // Add sort object if sortField and sortOrder are provided
    if (sortField && sortOrder !== null) {
      requestBody.sortObj = {
        FieldName: sortField,
        SortOrder: sortOrder,
      };
    }

    // Add filters if provided
    if (filters.length > 0) {
      requestBody.filterParams = filters.map((filter) => ({
        ColumnName: filter.field,
        FilterValue: filter.value,
      }));
    }

    const response = await apiInstance.post("/School/Search", requestBody);
    return response.data; // Return the response data containing the search results
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to search for schools");
  }
};

export const downloadStudentsFile = async (
  gradeId: string,
  schoolId: string
) => {
  try {
    // Send the POST request to download the file with the specified GradeId and SchoolId
    const response = await apiInstance.post(
      `/Account/DownloadStudentsFile`,
      { GradeId: gradeId, SchoolId: schoolId }, // Request body containing GradeId and SchoolId
      {
        responseType: "blob", // Set the response type to 'blob' to handle binary data
      }
    );

    // Create a blob from the response data
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    // Create a download link for the blob
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;

    // Get the filename from the response headers if available, or use a default name
    const filename =
      response.headers["content-disposition"]
        ?.split("filename=")[1]
        ?.replace(/['"]/g, "") || "students_file.xlsx";
    link.download = filename;

    // Programmatically click the link to trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up and remove the link element
    link.remove();

    return response.data; // Return the response data (optional)
  } catch (error: any) {
    console.error("Failed to download the file", error);
    throw error.response?.data || new Error("File download failed");
  }
};

export const searchGrades = async (
  keyword: string = "",
  page: number = 1,
  size: number = 20,
  sortField: string | null = null, // Optional: field to sort by
  sortOrder: number | null = null, // Optional: sort order (1 for ascending, -1 for descending)
  filters: { field: string; value: string }[] = [] // Optional: array of filters
) => {
  try {
    const requestBody: any = {
      keyword, // The keyword to search for schools
      page, // Page number for pagination
      size, // Page size for pagination
    };

    // Add sort object if sortField and sortOrder are provided
    if (sortField && sortOrder !== null) {
      requestBody.sortObj = {
        FieldName: sortField,
        SortOrder: sortOrder,
      };
    }

    // Add filters if provided
    if (filters.length > 0) {
      requestBody.filterParams = filters.map((filter) => ({
        ColumnName: filter.field,
        FilterValue: filter.value,
      }));
    }

    const response = await apiInstance.post("/Grade/Search", requestBody);
    return response.data; // Return the response data containing the search results
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to search for schools");
  }
};
