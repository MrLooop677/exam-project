import React, { ChangeEvent, useEffect, useState } from "react";
import Header from "../../layout/header";
import Footer from "../../layout/footer";
import { useParams } from "react-router-dom";
import { getAllQuestionsReading, submitExamData } from "../../api/adminApis";

const ReadingQuestions: React.FC = () => {
  const { examId } = useParams();
  const [readingQuestions, setReadingQuestions] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState<string>("");

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setText(event.target.value);
  };

  const handleSubmit = async () => {
    if (!readingQuestions) return;

    // Create a FormData instance
    const formData = new FormData();

    // Append top-level fields
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

    // Append StudentTopics array
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
      formData.append(`StudentTopics[${topicIndex}].StudentModelExamId`, "");

      // Append StudentQuestions array inside each StudentTopic
      topic.Questions.forEach((question: any, questionIndex: number) => {
        const baseKey = `StudentTopics[${topicIndex}].StudentQuestions[${questionIndex}]`;

        formData.append(
          `${baseKey}.QuestionType`,
          question.QuestionType?.toString() || "0"
        );
        formData.append(`${baseKey}.FileQuestion`, question.File || "");
        formData.append(
          `${baseKey}.ParentQuestionId`,
          question.ParentQuestionId || ""
        );
        formData.append(`${baseKey}.DisplayOrder`, "0");
        formData.append(`${baseKey}.FreeWritingAnswer`, text || "");
        formData.append(`${baseKey}.StudentTopicId`, "");
        formData.append(`${baseKey}.DegreeStudent`, "0");
        formData.append(`${baseKey}.DegreeQuestion`, "0");
        formData.append(`${baseKey}.AnswerType`, "0");
        formData.append(`${baseKey}.AnswerFile`, "");
        formData.append(
          `${baseKey}.ContentQuestion`,
          question.ContentQuestion || ""
        );
      });
    });

    try {
      const response = await submitExamData(formData);
      console.log("Submission successful", response);
    } catch (err: any) {
      console.error("Error submitting exam data:", err);
    }
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const availabilityData = await getAllQuestionsReading(examId);
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
              <p className="title">Reading</p>
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
              <div className="instruction-item">
                <img src="/assets/exams/keyboard.svg" alt="" />
                <p className="keyboard">Write with Keyboard</p>
              </div>
              <div className="instruction-item">
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
          <div key={topicIndex} className="topic-wrapper">
            <h3>{topic.TitleEn}</h3>
            <p>{topic.TopicContent}</p>
            {topic.Questions.map((question: any, questionIndex: number) => (
              <div key={questionIndex} className="write-about-wrapper mt-10">
                <div className="img-wrapper">
                  {question.File && (
                    <img src={question.File} alt="Question related visual" />
                  )}
                </div>
                <p className="about-title">{question.ContentQuestion}</p>
                <div className="writing-area-container">
                  <textarea
                    className="writing-area"
                    value={text}
                    onChange={handleTextChange}
                    maxLength={200}
                  />
                  <div
                    className={`count ${text.length >= 180 ? "warning" : ""}`}
                  >
                    {text.length} / 200
                  </div>
                </div>
              </div>
            ))}
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

export default ReadingQuestions;
