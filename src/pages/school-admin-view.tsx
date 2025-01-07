import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useGradeSearch } from "../hooks/useGradesSearch";
import { downloadStudentsFile } from "../api/adminApis";
import Header from "../layout/header";
import Footer from "../layout/footer";

export function StudentFilePage() {
  const methods = useForm(); // Use React Hook Form's `useForm`
  const { watch, setValue } = methods;
  const [isStudentFileDownloading, setIsStudentFileDownloading] =
    useState(false);
  const [schoolId, setSchoolId] = useState<string | null>(null); // State to hold SchoolId

  // Fetch grades using hook
  const {
    grades,
    isLoading: isLoadingGrades,
    error: gradeError,
  } = useGradeSearch();

  // Get SchoolId from localStorage's user object
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setSchoolId(user.SchoolId || null); // Set SchoolId state
    if (user.SchoolId) {
      setValue("schoolId", user.SchoolId); // Set SchoolId in the form
    }
  }, [setValue]);

  const selectedGrade = watch("gradeId");

  // Handle student file download
  const handleStudentFileDownload = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent form submission

    if (!schoolId || !selectedGrade) {
      alert(
        schoolId
          ? "Please select a grade before downloading."
          : "You don't have an assigned school. Please contact your administrator."
      );
      return;
    }

    setIsStudentFileDownloading(true);
    try {
      await downloadStudentsFile(selectedGrade, schoolId); // Download API call
      alert("Student file downloaded successfully!");
    } catch (error) {
      console.error("Error downloading student file:", error);
      alert("Failed to download student file. Please try again.");
    } finally {
      setIsStudentFileDownloading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen mt-5">
      {/* Header */}
      <Header
        leftChildren={
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/about">Contact Us</a>
            </li>
          </ul>
        }
        rightChildren={
          <div className="flex gap-4">
            <div className="header-circle"></div>
          </div>
        }
      />

      {/* Main Content */}
      <main className="flex-grow">
        <FormProvider {...methods}>
          <form
            onSubmit={handleStudentFileDownload}
            className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Column 1: Select Grade */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Select Filters</h2>

              {/* Grade Dropdown */}
              <div className="space-y-1">
                <label htmlFor="grade" className="block text-sm font-medium">
                  Grade
                </label>
                <select
                  id="grade"
                  {...methods.register("gradeId")}
                  className="w-full border rounded p-2 bg-gray-100"
                  disabled={isLoadingGrades}
                >
                  <option value="">Select grade</option>
                  {grades.map((grade) => (
                    <option key={grade.Id} value={grade.Id}>
                      {grade.NameEn}
                    </option>
                  ))}
                </select>
                {isLoadingGrades && (
                  <p className="text-sm text-gray-500">Loading grades...</p>
                )}
                {gradeError && (
                  <p className="text-sm text-red-500">{gradeError}</p>
                )}
              </div>

              {/* School */}
              <div className="space-y-1">
                <label htmlFor="school" className="block text-sm font-medium">
                  School
                </label>
                {schoolId ? (
                  <input
                    id="school"
                    value={schoolId}
                    readOnly
                    className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
                  />
                ) : (
                  <p className="text-sm text-red-500">
                    You don't have an assigned school. Please contact your
                    administrator.
                  </p>
                )}
              </div>

              {/* Download Student File Button */}
              <button
                type="submit"
                className={`w-full py-2 px-4 rounded text-white ${
                  isStudentFileDownloading || !selectedGrade || !schoolId
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#a883f3] hover:bg-purple-500"
                }`}
                disabled={
                  isStudentFileDownloading || !selectedGrade || !schoolId
                }
              >
                {isStudentFileDownloading
                  ? "Downloading..."
                  : "Download Student File"}
              </button>
            </div>
          </form>
        </FormProvider>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
