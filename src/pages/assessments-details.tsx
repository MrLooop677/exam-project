import React, { useEffect, useState } from "react";
import Header from "../layout/header";
import Footer from "../layout/footer";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { checkSkillsExamsAvailability } from "../api/adminApis";

interface Skill {
  SkillName: string;
  SkillId: string;
}

const AssessmentsDetails: React.FC = () => {
  const [availability, setAvailability] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const { title } = location.state || {};
  const navigate = useNavigate();
  const { examId } = useParams();

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const availabilityData = await checkSkillsExamsAvailability(examId);
        setAvailability(availabilityData);
      } catch (err: any) {
        setError(err.message || "Failed to check skills exams availability");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [examId]);

  const handleAssessmentClick = (skillName: string, skillId: string) => {
    console.log(skillName, skillId);
    navigate(`/questions/${skillId}`, { state: { skillName } });
  };

  const renderSkillIcon = (
    skillName: string,
    skillId: string,
    imgSrc: string,
    altText: string,
    className: string
  ) => {
    return (
      <div
        className={`icon-bg ${className}`}
        onClick={() => handleAssessmentClick(skillName, skillId)}
      >
        <img src={imgSrc} alt={altText} />
        <p className="icon-text">
          {skillName}
          <br />
          {getTranslatedSkillName(skillName)}
        </p>
      </div>
    );
  };

  const getTranslatedSkillName = (skillName: string) => {
    const translations: Record<string, string> = {
      Listening: "الاستماع",
      Speaking: "التحدث",
      Reading: "القراءة",
      Writing: "الكتابة",
    };
    return translations[skillName] || skillName;
  };

  const skillIcons = [
    {
      skillName: "Listening",
      imgSrc: "/assets/assessment/hearing.svg",
      altText: "Hearing",
      className: "hear-icon",
    },
    {
      skillName: "Speaking",
      imgSrc: "/assets/assessment/mic.svg",
      altText: "Mic",
      className: "mic-icon",
    },
    {
      skillName: "Reading",
      imgSrc: "/assets/assessment/dictionary.svg",
      altText: "Dictionary",
      className: "dic-icon",
    },
    {
      skillName: "Writing",
      imgSrc: "/assets/assessment/edit.svg",
      altText: "Edit",
      className: "edit-icon",
    },
  ];

  return (
    <div className="mt-5">
      <Header leftChildren={<p>{title || "Available Assessments"}</p>} />
      <div className="assessments-details-wrapper">
        <p className="title-assessment">{title || "Assessment Title"}</p>
        <div className="details-main">
          <div className="left-side">
            <img src="/assets/assessment/green-arrow.svg" alt="Assessment" />
            <div className="txt-container txt-container-green">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s.
              </p>
            </div>
          </div>
          <div className="middle-clock">
            <div className="clock-img">
              <img src="/assets/assessment/clock.svg" alt="Clock" />
            </div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && (
              <>
                {skillIcons.map(({ skillName, imgSrc, altText, className }) =>
                  availability.some((skill) => skill.SkillName === skillName)
                    ? renderSkillIcon(
                        skillName,
                        availability.find(
                          (skill) => skill.SkillName === skillName
                        )?.ExamId || "",
                        imgSrc,
                        altText,
                        className
                      )
                    : null
                )}
              </>
            )}
          </div>
          <div className="right-side">
            <img src="/assets/assessment/dark-arrow.svg" alt="Assessment" />
            <div className="txt-container txt-container-dark">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AssessmentsDetails;
