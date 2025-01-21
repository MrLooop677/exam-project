import React, { useState, useEffect } from "react";
import { AudioRecorder } from "react-audio-voice-recorder";
import Footer from "../../layout/footer";
import Header from "../../layout/header";
import { useParams } from "react-router-dom";
import { getAllQuestionsReading, submitExamData } from "../../api/adminApis";
import { FiTrash2 } from "react-icons/fi";
import ExamTimer from "../shared/exam-timer/exam-timer";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";

const SpeakingQuestions: React.FC = () => {
  const [readingQuestions, setReadingQuestions] = useState<any>(null);
  const [fileUploads, setFileUploads] = useState<File[]>([]); // New state to store uploaded files
  const { examId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0); // Initialize timeLeft state
  const MySwal = withReactContent(Swal);

  // record voice
  const [audioElements, setAudioElements] = useState<
    { key: number; src: string }[][]
  >([]);
  console.log("audioElements", audioElements);

  const addAudioElement = (
    blob: Blob,
    topicIndex: number,
    questionIndex: number
  ) => {
    const url = URL.createObjectURL(blob);
    const audioKey = Date.now();

    setAudioElements((prev) => {
      const newAudioElements = [...prev];
      if (!newAudioElements[topicIndex]) {
        newAudioElements[topicIndex] = []; // Initialize if not present
      }
      if (!newAudioElements[topicIndex][questionIndex]) {
        newAudioElements[topicIndex][questionIndex] = []; // Initialize if not present
      }
      newAudioElements[topicIndex][questionIndex].push({
        key: audioKey,
        src: url,
      });
      return newAudioElements;
    });
  };

  const deleteAudioElement = (
    key: number,
    topicIndex: number,
    questionIndex: number
  ) => {
    setAudioElements((prev) => {
      const newAudioElements = [...prev];
      newAudioElements[topicIndex] = newAudioElements[topicIndex].map(
        (q, index) => {
          if (index === questionIndex) {
            return q.filter((audio) => audio.key !== key); // Filter out the deleted audio
          }
          return q; // Return unchanged
        }
      );
      return newAudioElements;
    });
  };

  const handleTimeUp = () => {
    // Open SweetAlert modal when the time is up
    MySwal.fire({
      title: "Time is up!",
      text: "Please submit your answers now.",
      icon: "warning",
      showConfirmButton: false, // Disable the confirm button
      timer: 10000, // Set a timer for 10 seconds
      allowOutsideClick: false, // Disable closing by clicking outside
      willClose: () => {
        // Handle what happens when SweetAlert closes
      },
    });
  };

  useEffect(() => {
    if (readingQuestions && readingQuestions.TimerPerMinutes) {
      const timerInSeconds = readingQuestions.TimerPerMinutes * 60;
      // Check localStorage to see if there's a saved time left
      const savedTime = localStorage.getItem("timerTimeLeft");
      const initialTime = savedTime ? parseInt(savedTime) : timerInSeconds;
      setTimeLeft(initialTime); // Set initial time for the timer
    }
  }, [readingQuestions]);

  useEffect(() => {
    // Save time left to localStorage when it changes
    if (timeLeft >= 0) {  // Ensure the time is non-negative before saving
      localStorage.setItem("timerTimeLeft", timeLeft.toString());
    }
  }, [timeLeft]);

  const handleSubmit = async () => {
    if (!readingQuestions) return;

    // Check if any audio recordings have been made
    let hasRecording = false;

    readingQuestions.Topics.forEach((topic: any, topicIndex: number) => {
      topic.Questions.forEach((question: any, questionIndex: number) => {
        const audio = audioElements[topicIndex]?.[questionIndex];
        if (audio && audio.length > 0) {
          hasRecording = true;
        }
      });
    });

    if (!hasRecording) {
      // Show SweetAlert warning if no audio recordings are found
      Swal.fire({
        title: "Warning",
        text: "You haven't recorded any answers yet. Please record your responses before submitting.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    // Create a FormData instance
    const formData = new FormData();

    // Add all your form data logic here
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

        // Add the audio files if available
        const audio = audioElements[topicIndex]?.[questionIndex];
        if (audio && audio.length > 0) {
          audio.forEach(({ key, src }) => {
            formData.append(`${baseKey}.AnswerFile`, src);
          });
        }
      });
    });

    try {
      const response = await submitExamData(formData);
      toast.success("Successfully submitted exam data");
      console.log("Submission successful", response);
    } catch (err: any) {
      console.error("Error submitting exam data:", err);
    }
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const availabilityData = await getAllQuestionsReading(examId, 4);
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
                <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
                <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
                <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
              </ul>
            </div>
          </div>
          <div className="right-side-img">
            <div className="whole-img">
              <div className="img-bg">
                <img src="/assets/home/reading-a-book.svg" alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className="reading-timer">
          {readingQuestions?.TimerPerMinutes && (
            <ExamTimer
              TimerPerMinutes={readingQuestions.TimerPerMinutes}
              onTimeUp={handleTimeUp}
              timeLeft={timeLeft}  // Pass timeLeft as a prop
              setTimeLeft={setTimeLeft}  // Pass the setter function
            />
          )}
        </div>

        {readingQuestions?.Topics?.map((topic: any, topicIndex: number) => (
          <div key={topicIndex} className="write-about-wrapper mt-10">
            <h3 className="mb-1 text-[#785ABE] font-semibold text-xl">
              {topic.TitleEn}
            </h3>
            {topic.Questions.map((question, questionIndex) => (
              <div key={questionIndex}>
                <p>{question.ContentQuestion}</p>
                <div className="img-wrapper">
                  {topic?.File ? (
                    <img
                      className="w-full h-96 object-contain"
                      src={`https://sah-platform-api-egghayfcc4ddeuae.canadacentral-01.azurewebsites.net/${topic.File}`}
                      alt="Topic Image"
                    />
                  ) : (
                    <div className="flex items-center justify-center"></div>
                  )}
                </div>
                <div className="writing-area-container">
                  <div>
                    <AudioRecorder
                      onRecordingComplete={(blob) =>
                        addAudioElement(blob, topicIndex, questionIndex)
                      }
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
                      {(audioElements[topicIndex]?.[questionIndex] || []).map(
                        ({ key, src }) => (
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
                              onClick={() =>
                                deleteAudioElement(
                                  key,
                                  topicIndex,
                                  questionIndex
                                )
                              }
                              className="delete-btn"
                            />
                          </div>
                        )
                      ) || <p>No audio recordings yet.</p>}
                    </div>
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

export default SpeakingQuestions;
