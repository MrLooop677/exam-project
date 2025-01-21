// import React, { useState, useEffect } from "react";

// // Timer component receives `initialTime` in minutes
// interface TimerProps {
//   TimerPerMinutes: number; // Timer duration in minutes
//   onTimeUp: () => void; // Callback when time is up
// }

// const ExamTimer: React.FC<TimerProps> = ({ TimerPerMinutes, onTimeUp }) => {
//   const [timeLeft, setTimeLeft] = useState<number>(TimerPerMinutes * 60); // Convert minutes to seconds
//   const [formattedTime, setFormattedTime] = useState<string>("00:00:00");

//   useEffect(() => {
//     setTimeLeft(TimerPerMinutes * 60); // Reset time when TimerPerMinutes changes
//   }, [TimerPerMinutes]);

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       onTimeUp(); // Trigger time-up callback when timer hits 0
//       return;
//     }

//     const timerInterval = setInterval(() => {
//       setTimeLeft((prevTime) => prevTime - 1);
//     }, 1000);

//     return () => clearInterval(timerInterval); // Cleanup interval on unmount or when timer changes
//   }, [timeLeft, onTimeUp]);

//   useEffect(() => {
//     // Format time as HH:MM:SS
//     const hours = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
//     const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
//     const seconds = String(timeLeft % 60).padStart(2, "0");
//     setFormattedTime(`${hours}:${minutes}:${seconds}`);
//   }, [timeLeft]);

//   return (
//     <div>
//       <h1>{formattedTime}</h1>
//     </div>
//   );
// };

// export default ExamTimer;



import React, { useState, useEffect } from "react";

// Timer component receives `initialTime` in minutes
interface TimerProps {
  TimerPerMinutes: number; // Timer duration in minutes
  onTimeUp: () => void; // Callback when time is up
}

const ExamTimer: React.FC<TimerProps> = ({ TimerPerMinutes, onTimeUp }) => {
  // Load the saved time from localStorage if available, otherwise default to the initial time
  const savedTime = localStorage.getItem("timeLeft");
  const initialTime = savedTime ? parseInt(savedTime) : TimerPerMinutes * 60;

  const [timeLeft, setTimeLeft] = useState<number>(initialTime); // Set the initial time based on saved or default
  const [formattedTime, setFormattedTime] = useState<string>("00:00:00");

  useEffect(() => {
    // Reset time when TimerPerMinutes changes
    setTimeLeft(TimerPerMinutes * 60);
  }, [TimerPerMinutes]);

  useEffect(() => {
    // If the time is 0 or below, trigger the callback
    if (timeLeft <= 0) {
      onTimeUp(); // Trigger time-up callback when timer hits 0
      return;
    }

    // Set up the interval to decrement time every second
    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Store the time in localStorage whenever it changes
    localStorage.setItem("timeLeft", timeLeft.toString());

    return () => clearInterval(timerInterval); // Cleanup interval on unmount or when time changes
  }, [timeLeft, onTimeUp]);

  useEffect(() => {
    // Format time as HH:MM:SS
    const hours = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");
    setFormattedTime(`${hours}:${minutes}:${seconds}`);
  }, [timeLeft]);

  return (
    <div>
      <h1>{formattedTime}</h1>
    </div>
  );
};

export default ExamTimer;
