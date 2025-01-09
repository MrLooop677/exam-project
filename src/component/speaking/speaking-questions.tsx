import React, { useState, useEffect } from "react";

import { AudioRecorder } from "react-audio-voice-recorder";
import Footer from "../../layout/footer";
import Header from "../../layout/header";

const SpeakingQuestions: React.FC = () => {
  // record voice
  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
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
                  // autoGainControl,
                  // channelCount,
                  // deviceId,
                  // groupId,
                  // sampleRate,
                  // sampleSize,
                }}
                onNotAllowedOrFound={(err) => console.table(err)}
                downloadOnSavePress={true}
                downloadFileExtension="webm"
                mediaRecorderOptions={{
                  audioBitsPerSecond: 128000,
                }}
                // showVisualizer={true}
              />
              <br />
            </div>
          </div>
        </div>

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

export default SpeakingQuestions;
