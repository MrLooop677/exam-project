import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../layout/footer";
import Header from "../layout/header";
import { getStudentExams } from "../api/adminApis";
import { BASE_IMG_URL } from "../api/endpoint";

const Assessments: React.FC = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await getStudentExams();
        if (response?.StatusCode === 200 && Array.isArray(response.Data)) {
          setExams(response.Data); // Access the "Data" property of the response
        } else {
          setExams([]); // Set exams to an empty array if no valid data is returned
        }
      } catch (err: any) {
        setError(err.message || "Failed to load exams");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleCardClick = (examId: string, title: string) => {
    navigate(`/details/${examId}`, {
      state: { title }, // Pass the title to the next page
    });
  };
  return (
    <>
      <div className="assessment-wrapper h-[100vh]">
        <Header leftChildren={<p>Available Assessments</p>} />
        <div className="assessment-grid">
          {loading && <p>Loading assessments...</p>}
          {error && <p>Error: {error}</p>}
          {!loading && !error && exams.length === 0 && (
            <p>No assessments available at this time.</p>
          )}
          {!loading &&
            !error &&
            exams.length > 0 &&
            exams.map((exam, index) => (
              <div key={index} className="assessment-item">
                <div className="img-wrapper">
                  <img
                    src={
                      exam.Imag
                        ? `${BASE_IMG_URL}/${exam.Imag}`
                        : "/assets/assessment/assess.svg"
                    }
                    alt="Assessment"
                  />
                </div>
                <p>{exam.TitleEn || "Assessment Title"}</p>
                <button
                  onClick={() =>
                    handleCardClick(
                      exam.ExamId,
                      exam.TitleEn || "Assessment Title"
                    )
                  }
                >
                  View Details
                </button>
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Assessments;
