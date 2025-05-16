"use client";

import { useEffect, useState } from "react";
import styles from "./RatingModal.module.css";
import apiClient from "../../../config/apiClient";

// Using the exact parameters from the document
const QUESTIONS = [
  "Identify Real-World Problems",
  "Alignment of Proposed & Conducted Activities",
  "Impact and Outreach",
  "Branding and Promotion",
  "Level of Events Conducted",
  "Feedback and Documentation and Online Punching on CUIMS",
  "Recognition and Achievements",
  "Innovation and Creativity to handle the problems",
  "Sponsorship and Collaboration",
];

// Descriptions for each parameter
const DESCRIPTIONS = [
  "Events must identify and address real-world challenges relevant to the Community/Industry/SDG.",
  "The proposed event calendar should align with the actual events conducted throughout the year.",
  "[Participants will not be repeated] Must demonstrate impact toward bridging the gap between academia and industry, and outreach engagement/participation",
  "Strong visibility through CU Media, Social Platforms, and all Online/Offline promotional and branding efforts.",
  "Events should span various scales—from departmental to university-level—including flagship, monthly, and regular events.",
  "Feedback of clubs will be taken centrally and submission of complete post-event reports and documentation.",
  "Noteworthy awards, recognitions, and external acknowledgments received during the evaluation period.",
  "Introduction of new ideas, creative approaches, and tech-enabled solutions to solve problems",
  "Collaboration with departments, external entities, and efforts to secure sponsorships with measurable ROI.",
];

// Weighting criteria for each parameter
const WEIGHTS = [
  { weight: 10, maxScore: 10 },
  { weight: 10, maxScore: 10 },
  { weight: 15, maxScore: 15 },
  { weight: 10, maxScore: 10 },
  { weight: 10, maxScore: 10 },
  { weight: 10, maxScore: 10 },
  { weight: 5, maxScore: 5 },
  { weight: 15, maxScore: 15 },
  { weight: 15, maxScore: 15 },
];

// Detailed criteria for each parameter and score range
const CRITERIA = [
  // Question 1: Identify Real-World Problems
  [
    {
      range: "0-4",
      description:
        "0-3 events are identify the problem related to SDG/Community/Industry and address the real world challenge through organizing events",
    },
    {
      range: "5-7",
      description:
        "4-10 events identify the problem related to SDG/Community/Industry and conduct of the events to address the challenge",
    },
    {
      range: "8-10",
      description:
        "11-15 events identify the problem related to SDG/Community/Industry and conduct of the events to address the challenge",
    },
  ],
  // Question 2: Alignment of Proposed & Conducted Activities
  [
    {
      range: "0-3",
      description:
        "2-5 annual events align Minimal implementation on the proposed Activity/event calendar. Most proposed events not conducted or deviations occurred.",
    },
    {
      range: "4-6",
      description:
        "6-10 annual events align Some deviations from the proposed calendar; only key events conducted.",
    },
    {
      range: "7-10",
      description:
        "11-15 annual events align the Proposed Activity/Event calendar well followed and actual events closely matched.",
    },
  ],
  // Question 3: Impact and Outreach
  [
    {
      range: "0-6",
      description:
        "0-199 Multi disciplinary participants; events must have a domain impact.",
    },
    {
      range: "7-9",
      description:
        "200-499 Multi disciplinary participants; events must align with hands-on skills development and certifications.",
    },
    {
      range: "10-15",
      description:
        "500+ Multi disciplinary participants; events/project exhibitions/personal skill development/ startup / patents to showcase the overall academic excellence",
    },
  ],
  // Question 4: Branding and Promotion
  [
    {
      range: "0-5",
      description:
        "0–200 Instagram Followers, less than 500 views, likes, or impressions on social platforms, and 100+ LinkedIn Followers; no clear promotional strategy and minimal branding efforts.",
    },
    {
      range: "5-7",
      description:
        "200–500 Instagram Followers, 500–1,999 views, likes, or impressions on club social platforms, and 200+ LinkedIn Followers; pre- and post-event branding across all CU social media channels.",
    },
    {
      range: "7-10",
      description:
        "Above 500 Instagram Followers, 2,000+ views, likes, or impressions on social media platforms, and 350+ LinkedIn Followers; strong visibility across all social media platforms.",
    },
  ],
  // Question 5: Level of Events Conducted
  [
    {
      range: "0-4",
      description:
        "3-6 events annually, all at the departmental level; no flagship event; irregular events",
    },
    {
      range: "5-7",
      description:
        "7–10 events annually, including 0-1 Flagship university-level and 2-3 Monthly/Regular events",
    },
    {
      range: "8-10",
      description:
        "11-15 events annually, including 0-4 flagship events, 4+ monthly/regular events.",
    },
  ],
  // Question 6: Feedback and Documentation and Online Punching on CUIMS
  [
    {
      range: "0-4",
      description:
        "Less than 200 Positive Public Feedback; Average documentation and 0-2 event late Online Punching",
    },
    {
      range: "5-7",
      description:
        "200-500 Positive Public Feedback; Good documentation and 3-5 event late Online Punching",
    },
    {
      range: "8-10",
      description:
        "500-700 Positive Public Feedback; Excellent documentation and Pre-Online Punching",
    },
  ],
  // Question 7: Recognition and Achievements
  [
    {
      range: "0-1",
      description:
        "2-5 awards/recognitions received from university; no external acknowledgement during the evaluation period.",
    },
    {
      range: "2-3",
      description:
        "6–7 awards/recognitions; some external acknowledgement (e.g., regional or industry-level recognition).",
    },
    {
      range: "4-5",
      description:
        "8+ awards/recognitions received by students; multiple external accolades (e.g., national or international level).",
    },
  ],
  // Question 8: Innovation and Creativity to handle the problems
  [
    {
      range: "0-7",
      description:
        "Limited Innovation – 0-4 events, workshops, or sessions promote an innovation culture among students, resulting in the publication or filing of research papers/articles/patents/copyright/trademark.",
    },
    {
      range: "8-10",
      description:
        "Moderate Innovation – 5-8 events, workshops, or sessions promote an innovation culture among students, resulting in the publication or filing of research papers/articles/patents/copyright/trademark.",
    },
    {
      range: "11-15",
      description:
        "Exceptional Innovation – 9-15 events, workshops, or sessions promote an innovation culture among students, resulting in the publication or filing of research papers/articles/patents/copyright/trademark.",
    },
  ],
  // Question 9: Sponsorship and Collaboration
  [
    {
      range: "0-6",
      description:
        "0-4 collaborations (departments or other entities); 0–2 sponsorship secured with minimal ROI.",
    },
    {
      range: "7-9",
      description:
        "5-10 collaborations (external entities, departments, or external organizations); 3–5 sponsorships with moderate ROI.",
    },
    {
      range: "10-15",
      description:
        "11-15 collaborations (external entities, departments, or external organizations); 6–10 sponsorships with High ROI.",
    },
  ],
];

const RatingModal = ({ entity, onClose, onSubmit }) => {
  const [ratings, setRatings] = useState(Array(QUESTIONS.length).fill(0));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [ceremonyEvents, setCeremonyEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [totalFeedbackCount, setTotalFeedbackCount] = useState([]);
  const [totalFeedback, setTotalFeedback] = useState([]);

  const getCeremonyEvents = async () => {
    try {
      const response = await apiClient.get("ceremony_events_with_pdf/");
      setCeremonyEvents(response?.data || []);
    } catch (error) {
      console.log(error, "ERRORR");
    }
  };

  useEffect(() => {
    getCeremonyEvents();
  }, []);

  // Filter events based on entity name when entity or ceremonyEvents change
  useEffect(() => {
    if (entity && ceremonyEvents.length > 0) {
      const filtered = ceremonyEvents.filter(
        (event) =>
          event.entity_names?.toLowerCase() === entity.name?.toLowerCase()
      );
      setFilteredEvents(filtered);
    }
  }, [entity, ceremonyEvents]);

  const handleRatingChange = (questionIndex, rating) => {
    const newRatings = [...ratings];
    newRatings[questionIndex] = rating;
    setRatings(newRatings);
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // Show confirmation popup instead of submitting directly
    setShowConfirmation(true);
  };

  const confirmSubmit = () => {
    // Create payload with question numbers and ratings
    const payload = ratings.map((rating, index) => ({
      question: QUESTIONS[index],
      rating: rating,
    }));

    onSubmit(payload);
    setShowConfirmation(false);
  };

  const cancelSubmit = () => {
    setShowConfirmation(false);
  };

  const isComplete = ratings.every((rating) => rating > 0);

  const getColorForRating = (rating, maxScore) => {
    if (rating === 0) return "#e0e0e0"; // Unselected

    const percentage = (rating / maxScore) * 100;

    if (percentage <= 33) return "#ff6b6b"; // Red for low ratings
    if (percentage <= 66) return "#ffd166"; // Yellow for medium ratings
    return "#06d6a0"; // Green for high ratings
  };

  // Calculate weighted score
  const calculateWeightedScore = () => {
    if (!isComplete) return null;

    let totalScore = 0;
    let totalWeight = 0;

    ratings.forEach((rating, index) => {
      totalScore += rating * WEIGHTS[index].weight;
      totalWeight += WEIGHTS[index].weight;
    });

    return (totalScore / totalWeight).toFixed(2);
  };

  // Calculate total marks
  const calculateTotalMarks = () => {
    return ratings.reduce((total, rating, index) => {
      return total + rating;
    }, 0);
  };

  // Get the current question's max score
  const currentMaxScore = WEIGHTS[currentQuestion].maxScore;

  // Generate rating buttons based on max score
  const generateRatingButtons = () => {
    const buttons = [];
    for (let i = 1; i <= currentMaxScore; i++) {
      buttons.push(
        <button
          key={i}
          className={`${styles.ratingButton} ${
            ratings[currentQuestion] === i ? styles.selected : ""
          }`}
          style={{
            backgroundColor:
              ratings[currentQuestion] === i
                ? getColorForRating(i, currentMaxScore)
                : "#f5f5f5",
          }}
          onClick={() => handleRatingChange(currentQuestion, i)}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  // Calculate total counts for the entity
  const calculateTotalCounts = () => {
    if (!filteredEvents || filteredEvents.length === 0) {
      return { flagship: 0, monthly: 0, regular: 0, total: 0 };
    }

    return filteredEvents.reduce(
      (counts, event) => {
        return {
          flagship: counts.flagship + (event.flagship_count || 0),
          monthly: counts.monthly + (event.monthly_count || 0),
          regular: counts.regular + (event.regular_count || 0),
          total:
            counts.total +
            (event.flagship_count || 0) +
            (event.monthly_count || 0) +
            (event.regular_count || 0),
        };
      },
      { flagship: 0, monthly: 0, regular: 0, total: 0 }
    );
  };

  const eventCounts = calculateTotalCounts();

  useEffect(() => {
    if (
      filteredEvents &&
      filteredEvents?.length > 0 &&
      filteredEvents[0]?.average_rating
    ) {
      setTotalFeedback(filteredEvents[0]?.average_rating);
      setTotalFeedbackCount(filteredEvents[0]?.feedback_count);
    }
  }, [filteredEvents]);

  // Render event counts for Recognition and Achievements section
  const renderEventCounts = () => {
    if (currentQuestion === 6) {
      // Recognition and Achievements is at index 6
      return (
        <div className={styles.eventCountsContainer}>
          <h4 className={styles.eventCountsTitle}>
            Event Counts for {entity.name}
          </h4>
          <div className={styles.eventCountsGrid}>
            <div className={styles.eventCountCard}>
              <div className={styles.eventCountValue}>
                {filteredEvents[0]?.flagship_count}
              </div>
              <div className={styles.eventCountLabel}>Flagship Events</div>
            </div>
            <div className={styles.eventCountCard}>
              <div className={styles.eventCountValue}>
                {filteredEvents[0]?.monthly_count}
              </div>
              <div className={styles.eventCountLabel}>Monthly Events</div>
            </div>
            <div className={styles.eventCountCard}>
              <div className={styles.eventCountValue}>
                {filteredEvents[0]?.regular_count}
              </div>
              <div className={styles.eventCountLabel}>Regular Events</div>
            </div>
            <div
              className={`${styles.eventCountCard} ${styles.eventCountTotal}`}
            >
              <div className={styles.eventCountValue}>
                {filteredEvents[0]?.flagship_count +
                  filteredEvents[0]?.monthly_count +
                  filteredEvents[0]?.regular_count}
              </div>
              <div className={styles.eventCountLabel}>Total Events</div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Render overall rating count for Feedback and Documentation section
  const renderOverallRatingCount = () => {
    if (currentQuestion === 5) {
      // Feedback and Documentation is at index 5

      return (
        <div className={styles.eventCountsContainer}>
          <h4 className={styles.eventCountsTitle}>
            Feedback Information for {entity.name}
          </h4>
          <div className={styles.eventCountsGrid}>
            <div
              className={`${styles.eventCountCard} ${styles.eventCountTotal}`}
              style={{ gridColumn: "span 4" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "13px",
                }}
              >
                <div className={styles.eventCountValue}>
                  {totalFeedbackCount}
                </div>
                <div className={styles.eventCountLabel}>
                  Pepole rated and got total{" "}
                </div>
                <div className={styles.eventCountValue}>{totalFeedback}</div>
                <div className={styles.eventCountLabel}>stars</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Rate Entity: {entity.name}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.questionProgress}>
            <div className={styles.progressText}>
              Parameter {currentQuestion + 1} of {QUESTIONS.length}
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className={styles.questionContainer}>
            <h3 className={styles.question}>{QUESTIONS[currentQuestion]}</h3>
            <div className={styles.description}>
              {DESCRIPTIONS[currentQuestion]}
            </div>

            <div className={styles.weightInfo}>
              Weightage: <strong>{WEIGHTS[currentQuestion].weight}%</strong> |
              Scale Range: <strong>0-{currentMaxScore}</strong>
            </div>

            {/* Display overall rating count for Feedback and Documentation */}
            {renderOverallRatingCount()}

            {/* Display event counts for Recognition and Achievements */}
            {renderEventCounts()}

            <div className={styles.criteriaContainer}>
              <h4 className={styles.criteriaTitle}>Criteria:</h4>
              {CRITERIA[currentQuestion].map((criterion, index) => (
                <div key={index} className={styles.criteriaItem}>
                  <div className={styles.criteriaRange}>{criterion.range}</div>
                  <div className={styles.criteriaDescription}>
                    {criterion.description}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.ratingContainer}>
              {generateRatingButtons()}
            </div>

            <div className={styles.ratingLabels}>
              <span className={styles.ratingLabelPoor}>Poor</span>
              <span className={styles.ratingLabelAverage}>Average</span>
              <span className={styles.ratingLabelExcellent}>Excellent</span>
            </div>
          </div>

          <div className={styles.questionNav}>
            <button
              className={styles.navButton}
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>

            {currentQuestion < QUESTIONS.length - 1 ? (
              <button
                className={styles.navButton}
                onClick={handleNext}
                disabled={ratings[currentQuestion] === 0}
              >
                Next
              </button>
            ) : (
              <button
                className={`${styles.navButton} ${styles.submitButton}`}
                onClick={handleSubmit}
                disabled={!isComplete}
              >
                Submit Ratings
              </button>
            )}
          </div>
        </div>

        <div className={styles.ratingSummary}>
          <h4>
            Rating Summary{" "}
            {isComplete && `- Weighted Score: ${calculateWeightedScore()}`}
          </h4>
          <div className={styles.ratingDots}>
            {ratings.map((rating, index) => (
              <div
                key={index}
                className={`${styles.ratingDot} ${
                  rating > 0 ? styles.rated : ""
                }`}
                style={{
                  backgroundColor: getColorForRating(
                    rating,
                    WEIGHTS[index].maxScore
                  ),
                }}
                onClick={() => setCurrentQuestion(index)}
                title={`${QUESTIONS[index]}: ${
                  rating > 0 ? rating : "Not rated"
                }`}
              >
                {rating > 0 ? rating : `${index + 1}`}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className={styles.confirmationOverlay}>
          <div className={styles.confirmationContent}>
            <h3>Confirm Submission</h3>
            <p>
              You are about to submit the following ratings for{" "}
              <strong>{entity.name}</strong>:
            </p>

            <div className={styles.confirmationSummary}>
              <div className={styles.confirmationTable}>
                <div className={styles.confirmationHeader}>
                  <div>Parameter</div>
                  <div>Rating</div>
                </div>
                {ratings.map((rating, index) => (
                  <div key={index} className={styles.confirmationRow}>
                    <div>{QUESTIONS[index]}</div>
                    <div
                      className={styles.confirmationRating}
                      style={{
                        backgroundColor: getColorForRating(
                          rating,
                          WEIGHTS[index].maxScore
                        ),
                        color: rating > 0 ? "white" : "inherit",
                      }}
                    >
                      {rating}
                    </div>
                  </div>
                ))}
                <div className={styles.confirmationTotal}>
                  <div>Total Marks:</div>
                  <div>
                    <strong>{calculateTotalMarks()}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.confirmationButtons}>
              <button className={styles.cancelButton} onClick={cancelSubmit}>
                Cancel
              </button>
              <button className={styles.confirmButton} onClick={confirmSubmit}>
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingModal;
