import React, { useState } from "react";

const Exams: React.FC = () => {
  // States for "Arrange Words" section
  const [words, setWords] = useState(["Word1", "Word2", "Word3"]);
  const [slots, setSlots] = useState(Array(3).fill(null)); // Initialize empty slots for the gray box

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

    // Remove the word from words list if it was dropped from the list
    const newWords = words.filter((w) => w !== word);

    // Place the word in the slot
    const newSlots = [...slots];
    newSlots[index] = word;

    setWords(newWords);
    setSlots(newSlots);
  };

  const handleListDrop = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.preventDefault();
    const word = event.dataTransfer.getData("text");

    // If the word was in a slot, remove it from the slot first
    const newSlots = slots.map((slot) => (slot === word ? null : slot));

    // Add word back to the words list at the specified index
    const newWords = [...words];
    if (!newWords.includes(word)) {
      newWords.splice(index, 0, word);
    }

    setWords(newWords);
    setSlots(newSlots);
  };

  const allowDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  return (
    <div>
      <div className="arrange-words">
        <p className="section-title">Drag and Drop to Arrange Words</p>
        <div className="arrange-words-question">
          <div className="words-to-arrange">
            {words.map((word, index) => (
              <p
                key={word}
                className="word"
                draggable
                onDragStart={(event) => handleWordDragStart(event, word)}
                onDragOver={allowDrop}
                onDrop={(event) => handleListDrop(event, index)}
              >
                {word}
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
                    onDragStart={(event) => handleWordDragStart(event, slot)}
                  >
                    {slot}
                  </p>
                ) : (
                  <p className="empty-slot">Drop Here</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exams;
