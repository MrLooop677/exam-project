import React, { useState, useEffect } from "react";

import { AudioRecorder } from "react-audio-voice-recorder";
import Footer from "../../layout/footer";
import Header from "../../layout/header";
import { useParams } from "react-router-dom";
import { getAllQuestionsReading, submitExamData } from "../../api/adminApis";
import { FiTrash2 } from "react-icons/fi";

const SpeakingQuestions: React.FC = () => {
  const [readingQuestions, setReadingQuestions] = useState<any>(null);
  const [fileUploads, setFileUploads] = useState<File[]>([]); // New state to store uploaded files
  const { examId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // record voice

  const [audioElements, setAudioElements] = useState<
    { key: number; src: string }[]
  >([]);
  console.log("audioElements", audioElements);

  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob);

    // Create a unique key for each audio element
    const audioKey = Date.now();

    // Store audio `src` and its key in the state
    setAudioElements((prev) => [...prev, { key: audioKey, src: url }]);
  };
  const deleteAudioElement = (key: number) => {
    // Filter out the audio element to be deleted
    setAudioElements((prev) => prev.filter((audio) => audio.key !== key));
  };
  // timer
  const [timeLeft, setTimeLeft] = useState(10); // Initial countdown time in seconds

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup on component unmount or when timeLeft changes
    } else {
      alert("Time is up!"); // Show warning when timer ends
    }
  }, [timeLeft]);
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
          question?.QuestionType?.toString() || "0"
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
        formData.append(`${baseKey}.FreeWritingAnswer`, "");
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
        if (audioElements && audioElements.length > 0) {
          Array.from(audioElements)?.forEach((file, index) => {
            formData.append(`${baseKey}.AnswerFile[${index}]`, file);
          });
        }
      });
    });

    try {
      const response = await submitExamData(formData);
      alert("Successfully submitted exam data");
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
              <p className="title">Speaking</p>
              <ul className="points">
                <li>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </li>
                <li>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </li>
                <li>
                  Lorem Ipsum is simply dummy text of the printing and
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
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Time Left: {timeLeft} seconds</h1>
          </div>
        </div>

        <div className="write-about-wrapper mt-10">
          <div className="img-wrapper">
            <img src="/assets/exams/school.svg" alt="" />
          </div>

          <p className="about-title">Write About Your School</p>
          <div className="writing-area-container">
            <div>
              <AudioRecorder
                onRecordingComplete={addAudioElement}
                audioTrackConstraints={{
                  noiseSuppression: true,
                  echoCancellation: true,
                }}
                downloadOnSavePress={false}
                downloadFileExtension="webm"
                mediaRecorderOptions={{
                  audioBitsPerSecond: 128000,
                }}
              />
              <br />
              <div id="audio-container" className="audio-container">
                {audioElements.length > 0 ? (
                  audioElements.map(({ key, src }) => (
                    <div
                      key={key}
                      className="audio-item"
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <audio controls src={src}></audio>
                      <FiTrash2
                        onClick={() => deleteAudioElement(key)}
                        className="delete-btn"
                      />
                    </div>
                  ))
                ) : (
                  <p>No audio recordings yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

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

export default SpeakingQuestions;
