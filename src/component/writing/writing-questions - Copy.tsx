import React, { ChangeEvent, useEffect, useState } from "react";
import Header from "../../layout/header";
import Footer from "../../layout/footer";
import { useParams } from "react-router-dom";
import { getAllQuestionsReading, submitExamData } from "../../api/adminApis";
import FileUploader from "./upload-file";
import { toast } from "react-toastify";

const WritingQuestions: React.FC = () => {
  const { examId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [readingQuestions, setReadingQuestions] = useState<any>(null);
  const [fileUploads, setFileUploads] = useState<File[]>([]); // New state to store uploaded files
  const [text, setText] = useState<string>("");
  const [selectActiveClass, setSelectActiveClass] = useState(null);

  const [selectTypeQuestion, setSelectTypeQuestion] = useState<number | null>(
    1
  );

  // Handle the file changes from FileUploader
  const handleFileChange = (
    files: File[],
    topicIndex: number,
    questionIndex: number
  ) => {
    const key = `${topicIndex}-${questionIndex}`;
    setFileUploads((prev) => ({
      ...prev,
      [key]: files,
    }));
  };
  const handleTextChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
    topicIndex: number,
    questionIndex: number
  ): void => {
    const key = `${topicIndex}-${questionIndex}`;
    setText((prev) => ({ ...prev, [key]: event.target.value }));
  };
  const handleSubmit = async () => {
    if (!readingQuestions) return;

    // Create a FormData instance
    const formData = new FormData();

    // Align with the first request structure
    formData.append("SubjectId", readingQuestions.SubjectId || "");
    formData.append("Round", "0");
    formData.append("DegreeStudent", "0");
    formData.append("SchoolId", "");
    formData.append("DegreeModelEx", "0");
    formData.append("ExamStatus", "0");
    formData.append("Skill", readingQuestions.Skill?.toString() || "0");
    formData.append("GradeId", readingQuestions.GradeId || "");
    formData.append("NameEn", readingQuestions.NameEn || "");
    formData.append("NumberOfMandatoryQuestions", "0");
    formData.append("StudentId", "");
    formData.append("ModelExId", readingQuestions.Id || "");
    formData.append("ExamId", examId || "");
    formData.append("Id", "");
    formData.append("NameAr", readingQuestions.NameAr || "");
    formData.append("AcademicYearId", "");
    formData.append("LevelId", readingQuestions.LevelId || "");

    // Add Topics and Questions in the correct structure
    readingQuestions.Topics.forEach((topic: any, topicIndex: number) => {
      formData.append(
        `StudentTopics[${topicIndex}].TitleAr`,
        topic.TitleAr || ""
      );
      formData.append(
        `StudentTopics[${topicIndex}].TitleEn`,
        topic.TitleEn || ""
      );
      formData.append(`StudentTopics[${topicIndex}].File`, topic.File || "");
      formData.append(
        `StudentTopics[${topicIndex}].TopicContent`,
        topic.TopicContent || ""
      );
      formData.append(
        `StudentTopics[${topicIndex}].StudentModelExamId`,
        topic.StudentModelExamId || ""
      );

      // Add nested Questions
      topic.Questions.forEach((question: any, questionIndex: number) => {
        const baseKey = `StudentTopics[${topicIndex}].StudentQuestions[${questionIndex}]`;
        const key = `${topicIndex}-${questionIndex}`; // Key for text mapping

        formData.append(
          `${baseKey}.QuestionType`,
          selectTypeQuestion?.toString() || "0"
        );
        // formData.append(`${baseKey}.AnswerFile`, question.File || "");
        formData.append(
          `${baseKey}.ParentQuestionId`,
          question.ParentQuestionId || ""
        );
        formData.append(
          `${baseKey}.DisplayOrder`,
          question.DisplayOrder?.toString() || "0"
        );
        formData.append(`${baseKey}.FreeWritingAnswer`, text[key] || "");
        formData.append(
          `${baseKey}.StudentTopicId`,
          question.StudentTopicId || ""
        );
        formData.append(
          `${baseKey}.DegreeStudent`,
          question.DegreeStudent?.toString() || "0"
        );
        formData.append(
          `${baseKey}.DegreeQuestion`,
          question.DegreeQuestion?.toString() || "0"
        );
        formData.append(
          `${baseKey}.AnswerType`,
          question.AnswerType?.toString() || "0"
        );
        formData.append(`${baseKey}.AnswerFile`, ""); // Empty if no file
        formData.append(
          `${baseKey}.ContentQuestion`,
          question.ContentQuestion || ""
        );
        const uploadedFiles = fileUploads[`${topicIndex}-${questionIndex}`];
        if (uploadedFiles && uploadedFiles.length > 0) {
          Array.from(uploadedFiles)?.forEach((file, index) => {
            formData.append(`${baseKey}.AnswerFile[${index}]`, file);
          });
        }
      });
    });

    // // Append the uploaded files to formData
    // fileUploads?.forEach((file, index) => {
    //   formData.append(`FileUpload[${index}]`, file);
    // });
    try {
      const response = await submitExamData(formData);
      //alert("Successfully submitted exam data");
      toast.success("Successfully submitted exam data");
      console.log("Submission successful", response);
    } catch (err: any) {
      console.error("Error submitting exam data:", err);
    }
  };

  // const handleSubmit = async () => {
  //   if (!readingQuestions) return;

  //   // Create a FormData instance
  //   const formData = new FormData();

  //   // Append top-level fields
  //   formData.append("SubjectId", readingQuestions.SubjectId || "");
  //   formData.append("Round", "0");
  //   formData.append("DegreeStudent", "0");
  //   formData.append("SchoolId", "");
  //   formData.append("DegreeModelEx", "0");
  //   formData.append("ExamStatus", "0");
  //   formData.append("Skill", readingQuestions.Skill?.toString() || "0");
  //   formData.append("GradeId", readingQuestions.GradeId || "");
  //   formData.append("NameEn", readingQuestions.NameEn || "");
  //   formData.append("NumberOfMandatoryQuestions", "0");
  //   formData.append("StudentId", "");
  //   formData.append("ModelExId", readingQuestions.Id || "");
  //   formData.append("ExamId", examId || "");
  //   formData.append("Id", "");
  //   formData.append("NameAr", readingQuestions.NameAr || "");
  //   formData.append("AcademicYearId", "");
  //   formData.append("LevelId", readingQuestions.LevelId || "");

  //   // Append StudentTopics array
  //   readingQuestions.Topics.forEach((topic: any, topicIndex: number) => {
  //     formData.append(
  //       `StudentTopics[${topicIndex}].TitleAr`,
  //       topic.TitleAr || ""
  //     );
  //     formData.append(
  //       `StudentTopics[${topicIndex}].TitleEn`,
  //       topic.TitleEn || ""
  //     );
  //     formData.append(`StudentTopics[${topicIndex}].File`, topic.File || "");
  //     formData.append(
  //       `StudentTopics[${topicIndex}].TopicContent`,
  //       topic.TopicContent || ""
  //     );
  //     formData.append(`StudentTopics[${topicIndex}].StudentModelExamId`, "");

  //     // Append StudentQuestions array inside each StudentTopic
  //     topic.Questions.forEach((question: any, questionIndex: number) => {
  //       const baseKey = `StudentTopics[${topicIndex}].StudentQuestions[${questionIndex}]`;
  //       const key = `${topicIndex}-${questionIndex}`;

  //       formData.append(
  //         `${baseKey}.QuestionType`,
  //         selectTypeQuestion?.toString() || "0"
  //       );
  //       formData.append(`${baseKey}.FileQuestion`, question.File || "");
  //       formData.append(
  //         `${baseKey}.ParentQuestionId`,
  //         question.ParentQuestionId || ""
  //       );
  //       formData.append(`${baseKey}.DisplayOrder`, "0");
  //       formData.append(`${baseKey}.FreeWritingAnswer`, text[key] || "");
  //       formData.append(`${baseKey}.StudentTopicId`, "");
  //       formData.append(`${baseKey}.DegreeStudent`, "0");
  //       formData.append(`${baseKey}.DegreeQuestion`, "0");
  //       formData.append(`${baseKey}.AnswerType`, "0");
  //       formData.append(`${baseKey}.AnswerFile`, "");
  //       formData.append(
  //         `${baseKey}.ContentQuestion`,
  //         question.ContentQuestion || ""
  //       );
  //     });
  //   });

  //   try {
  //     const response = await submitExamData(formData);
  //     alert("Successfully submitted modal exam");
  //     console.log("Submission successful", response);
  //   } catch (err: any) {
  //     console.error("Error submitting exam data:", err);
  //   }
  // };
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const availabilityData = await getAllQuestionsReading(examId, 3);
        setReadingQuestions(availabilityData?.Data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch reading questions");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [examId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-5">
      <Header />
      <div className="questions-wrapper">
        <div className="reading-instructions">
          <div className="left-side">
            <img src="/assets/home/highlight.svg" alt="" />
            <div className="main-points">
              <p className="title">Writing</p>
              <ul className="points">
                <li>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </li>
                <li>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </li>
                <li>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </li>
              </ul>
            </div>
          </div>
          <div className="right-side-img">
            <div className="whole-img">
              <div className="img-bg">
                <img src="/assets/home/reading-a-book.svg" alt="" />
              </div>
            </div>
            <div className="extra-writing-instruction">
              <div
                onClick={() => setSelectTypeQuestion(1)}
                style={{ cursor: "pointer" }}
                className={`instruction-item ${
                  selectTypeQuestion === 1 ? "active" : ""
                }`}
              >
                <img src="/assets/exams/keyboard.svg" alt="" />
                <p className="keyboard">Write with Keyboard</p>
              </div>
              <div
                onClick={() => setSelectTypeQuestion(2)}
                style={{ cursor: "pointer" }}
                className={`instruction-item ${
                  selectTypeQuestion === 2 ? "active" : ""
                }`}
              >
                <img src="/assets/exams/write.svg" alt="" />
                <p>Hand writing</p>
              </div>
            </div>
          </div>
        </div>
        <div className="reading-timer">
          <img src="/assets/home/timer.svg" alt="" />
        </div>

        {readingQuestions?.Topics?.map((topic: any, topicIndex: number) => (
          <div key={topicIndex} className="topic-wrapper mt-7">
            <h3 className="mb-1 text-[#785ABE] font-semibold text-xl">
              {topic.TitleEn}
            </h3>

            <div className="border-solid border-2 border-[#9a7ed9] mb-16 p-10 rounded-[10px]">
              <p className="text-center">{topic.TopicContent}</p>
              {topic?.File ? (
                <img
                  className="w-full h-96 object-contain"
                  src={`https://sah-platform-api-egghayfcc4ddeuae.canadacentral-01.azurewebsites.net/${topic.File}`}
                  alt="Topic Image"
                />
              ) : (
                <div className="flex items-center justify-center">
                  {/* <span>No Image</span> */}
                </div>
              )}

              {topic?.Questions?.map((question: any, questionIndex: number) => (
                <div key={questionIndex} className="write-about-wrapper mt-10">
                  <div className="img-wrapper">
                    {question.File && (
                      <img src={question.File} alt="Question related visual" />
                    )}
                  </div>
                  <p className="about-title text-center">
                    {question.ContentQuestion}
                  </p>
                  {selectTypeQuestion === 2 ? (
                    <FileUploader
                      onFileChange={(files) =>
                        handleFileChange(files, topicIndex, questionIndex)
                      }
                    />
                  ) : (
                    <div className="writing-area-container">
                      <textarea
                        className="writing-area"
                        value={text[`${topicIndex}-${questionIndex}`] || ""}
                        onChange={(event) =>
                          handleTextChange(event, topicIndex, questionIndex)
                        }
                        maxLength={200}
                      />
                      <div
                        className={`count ${
                          (text[`${topicIndex}-${questionIndex}`] || "")
                            .length >= 180
                            ? "warning"
                            : ""
                        }`}
                      >
                        {(text[`${topicIndex}-${questionIndex}`] || "").length}{" "}
                        / 200
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="submit-and-move">
          <div></div>
          <button onClick={handleSubmit}>Submit</button>
          <div className="next-arrow">
            <img src="/assets/assessment/next-arrow.svg" alt="" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WritingQuestions;
