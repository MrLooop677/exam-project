import React, { ChangeEvent, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReadingQuestions from "../../component/reading/reading-questions";
import SpeakingQuestions from "../../component/speaking/speaking-questions";
import WritingQuestions from "../../component/writing/writing-questions";

const Questions: React.FC = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const location = useLocation();
  const { skillName } = location.state || {};
  // console.log("skillName", skillName);

  switch (location.state?.skillName) {
    case "Reading":
      return (
        <div className="mt-5">
          <ReadingQuestions />
        </div>
      );
    case "Writing":
      return <WritingQuestions />;
    case "Speaking":
      return <SpeakingQuestions />;
    case "Listening":
      return <div>Listening</div>;
    default:
      return <div>Default</div>;
  }
};

export default Questions;
