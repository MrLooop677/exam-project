import React, { ChangeEvent, useEffect, useState } from "react";
import Header from "../../layout/header";
import Footer from "../../layout/footer";
import {
  getAllQuestionsTopicReading,
  getAllTopicsReading,
} from "../../api/adminApis";
import { useParams } from "react-router-dom";

const ListingQuestions: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [readingQuestions, setReadingQuestions] = useState<any>(null);
  const [topics, setTopics] = useState<any>(null);
  const { examId } = useParams();
  const [topicsWithQuestions, setTopicsWithQuestions] = useState<any[]>([]); // Store topics with their questions

  const [draggedWord, setDraggedWord] = useState<string | null>(null);
  const [placedWords, setPlacedWords] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);

  const words_1 = ["Word1", "Word2", "Word3"];

  const handleDragStart = (word: string) => {
    setDraggedWord(word);
  };

  const handleDrop = (index: number) => {
    if (draggedWord) {
      const updatedPlacedWords = [...placedWords];

      if (index === -1) {
        // If dropped in the top section, remove the word from all boxes
        for (let i = 0; i < updatedPlacedWords.length; i++) {
          if (updatedPlacedWords[i] === draggedWord) {
            updatedPlacedWords[i] = null;
          }
        }
      } else {
        // If dropped in a specific box, first remove it from any other box
        for (let i = 0; i < updatedPlacedWords.length; i++) {
          if (updatedPlacedWords[i] === draggedWord) {
            updatedPlacedWords[i] = null;
          }
        }
        updatedPlacedWords[index] = draggedWord;
      }

      setPlacedWords(updatedPlacedWords);
      setDraggedWord(null); // Reset dragged word
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  // States for "Arrange Words" section
  const [words, setWords] = useState(["Word1", "Word2", "Word3"]);
  const [slots, setSlots] = useState(Array(3).fill(null)); // Initialize empty slots for placement
  const [usedWords, setUsedWords] = useState<string[]>([]); // Track words that have been used

  const handleWordDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    word: string
  ) => {
    event.dataTransfer.setData("text/plain", word);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleSlotDrop = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.preventDefault();
    const word = event.dataTransfer.getData("text");

    // Clone the slots and usedWords arrays to modify
    const newSlots = [...slots];
    const newUsedWords = new Set(usedWords);

    // If the target slot is already occupied, return the replaced word to the top list
    const replacedWord = newSlots[index];
    if (replacedWord) {
      newUsedWords.delete(replacedWord); // Remove replaced word from usedWords
    }

    // Remove the dragged word from any previous slot if it exists
    const previousIndex = newSlots.findIndex((slotWord) => slotWord === word);
    if (previousIndex !== -1) {
      newSlots[previousIndex] = null;
    }

    // Place the word in the new slot
    newSlots[index] = word;
    newUsedWords.add(word);

    // Update the state
    setSlots(newSlots);
    setUsedWords(Array.from(newUsedWords));

    // Add the replaced word back to the top list if it was in a slot
    if (replacedWord && !words.includes(replacedWord)) {
      setWords((prevWords) => [...prevWords, replacedWord]);
    }
  };

  const handleListDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const word = event.dataTransfer.getData("text");

    // Clear the word from any slot it's currently in
    const newSlots = slots.map((slot) => (slot === word ? null : slot));

    // Remove the word from usedWords to make it draggable again
    const newUsedWords = usedWords.filter((w) => w !== word);

    // Ensure the word is in the top list if it’s removed from the slot
    if (!words.includes(word)) {
      setWords((prevWords) => [...prevWords, word]);
    }

    setSlots(newSlots);
    setUsedWords(newUsedWords);
  };

  const allowDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const [text, setText] = useState<string>("");

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setText(event.target.value);
  };
  useEffect(() => {
    const fetchTopicsAndQuestions = async () => {
      try {
        setLoading(true);

        // Fetch topics
        const topicsData = await getAllTopicsReading(examId, 1);
        const topics = topicsData?.Data?.Topics;

        if (topics && topics.length > 0) {
          // Fetch questions for each topic
          const topicsWithQuestionsPromises = topics.map(async (topic: any) => {
            console.log("topic", topic);

            const questionsData = await getAllQuestionsTopicReading(topic?.Id);
            return {
              TitleAr: topic?.TitleAr,
              TitleEn: topic?.TitleEn,
              topicId: topic?.Id,
              TopicContent: topic?.TopicContent,
              questions: questionsData?.Data || [],
            };
          });

          const topicsWithQuestions = await Promise.all(
            topicsWithQuestionsPromises
          );
          setTopicsWithQuestions(topicsWithQuestions);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch topics and questions");
      } finally {
        setLoading(false);
      }
    };

    fetchTopicsAndQuestions();
  }, [examId]);
  const renderQuestion = (question: any) => {
    switch (question?.QuestionType) {
      case 1:
        return (
          <div className="true-or-false">
            <p className="section-title">
              {/* <span className="question-num">2</span>True or false ? */}
              {question?.ContentQuestion}
            </p>
            <div className="true-or-false-question">
              <p className="question">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. 
              </p>

              <div className="true-or-false-answer">
                {question?.Answers.map((answer: any, index: number) => (
                  <label className="true" key={index}>
                    <input type="radio" name={answer?.Id} value="true" />
                    {answer?.Answer}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="write-about-wrapper">
            <p className="question-title">Question Title</p>
            {question?.File && (
              <div className="img-wrapper">
                <img src={question?.File} alt="" />
              </div>
            )}

            <p className="about-title">{question?.ContentQuestion}</p>
            <div className="writing-area-container">
              <textarea
                className="writing-area"
                value={text}
                onChange={handleTextChange}
                maxLength={200}
              />
              <div className={`count ${text.length >= 180 ? "warning" : ""}`}>
                {text.length} / 200
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="choose-the-correct-answer">
            <p className="section-title">
              <span className="question-num">1</span>
              choose the correct answer
            </p>
            <div className="choose-questions">
              <div className="question-item">
                <p className="question">
                  {/* <span className="question-letter">A</span>Question Title */}
                  {question?.ContentQuestion}
                </p>
                <div className="answers">
                  {question?.Answers.map((answer: any, index: number) => (
                    <label key={index}>
                      <input
                        type="radio"
                        name={answer?.QuestionId}
                        value="answer1"
                      />
                      {answer?.Answer}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="arrange-words">
            <p className="section-title">
              {" "}
              {/* <span className="question-num">4</span>Drag and Drop to Arrange
              Words */}
              {question?.ContentQuestion}
            </p>
            <div className="arrange-words-question">
              <div
                className="words-to-arrange"
                onDrop={handleListDrop}
                onDragOver={allowDrop}
              >
                {question?.Answers.map((word) => (
                  <p
                    key={word?.Answer}
                    className={`word ${
                      usedWords.includes(word?.Answer) ? "used-word" : ""
                    }`}
                    draggable
                    onDragStart={(event) =>
                      handleWordDragStart(event, word?.Answer)
                    }
                  >
                    {word?.Answer}
                  </p>
                ))}
              </div>

              <div className="words-place">
                {slots.map((slot, index) => (
                  <div
                    key={index}
                    className="gray-box-slot"
                    onDrop={(event) => handleSlotDrop(event, index)}
                    onDragOver={allowDrop}
                  >
                    {slot ? (
                      <p
                        className="word-in-slot"
                        draggable
                        onDragStart={(event) =>
                          handleWordDragStart(event, slot)
                        }
                      >
                        {slot}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="put-in-right-place">
            <p className="section-title">
              {" "}
              {/* <span className="question-num">3</span>Put words in right places */}
              {question?.ContentQuestion}
            </p>
            <div className="put-in-right-place-questions">
              <div
                className="words-to-choose"
                onDrop={() => handleDrop(-1)} // Drop back to top
                onDragOver={handleDragOver}
              >
                {question?.Answers.map((word, index) => {
                  const isUsed = placedWords.includes(word?.Answer); // Check if word is in a box
                  return (
                    <div
                      key={index}
                      className={`word ${isUsed ? "used-word" : ""}`} // Apply "used-word" class if placed
                      draggable={!isUsed} // Disable dragging if placed in a box
                      onDragStart={() => handleDragStart(word?.Answer)}
                    >
                      {word?.Answer}
                    </div>
                  );
                })}
              </div>
              {placedWords.map((word, index) => (
                <div className="words-description" key={index}>
                  <p className="description">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry.
                  </p>
                  <div
                    className="drag-box"
                    onDrop={() => handleDrop(index)}
                    onDragOver={handleDragOver}
                    draggable={!!word} // Allow dragging from box if there's a word
                    onDragStart={() => handleDragStart(word as string)}
                  >
                    {word || ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div>Question type not supported</div>;
    }
  };

  console.log("topicsWithQuestions", topicsWithQuestions);

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
              <p className="title">Listining</p>
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
        </div>

        {topicsWithQuestions.map((topic) => (
          <div className="reading-comprehension" key={topic?.topicId}>
            <p className="comprehension-title">{topic?.TitleAr}</p>
            <div className="comprehension-questions">
              <p className="question-title">Question Title</p>
              <div className="comprehension-paragraph">
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. 
                </p>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. 
                </p>
              </div>
              {topic?.questions?.map((question: any, index: number) => (
                <div className="question-item" key={index}>
                  {renderQuestion(question)}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="submit-and-move">
          <div></div>
          <button>Submit</button>
          <div className="next-arrow">
            <img src="/assets/assessment/next-arrow.svg" alt="" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListingQuestions;
