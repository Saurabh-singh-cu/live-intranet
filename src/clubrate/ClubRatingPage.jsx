"use client";

import { useState, useEffect } from "react";
import styles from "./ClubRatingPage.module.css";
import { FaStar, FaCheckCircle, FaTimes } from "react-icons/fa";
import PopupMessage from "./PopupMessage";

const ClubRatingPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ratings, setRatings] = useState(Array(10).fill(0));
  const [feedback, setFeedback] = useState("");
  const [hoveredStars, setHoveredStars] = useState(Array(10).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Questions for the rating modal
  const questions = [
    "How would you rate the overall experience of the club?",
    "How satisfied are you with the communication from the club's leadership?",
    "How do you feel about the variety of events and activities organized by the club?",
    "How well do you think the club is supporting its members?",
    "How likely are you to recommend the club to others?",
    "How satisfied are you with the club's resources and facilities?",
    "How welcoming is the club environment to new members?",
    "How would you rate the club's leadership in terms of responsiveness to your concerns?",
    "How beneficial do you find the club's networking opportunities?",
    "How would you rate the club's overall impact on your personal or professional development?",
  ];

  useEffect(() => {
    // Fetch clubs data from API
    fetch(
      "http://172.17.2.247:8080/intranetapp/entity-registration-summary/?entity_id=1"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load clubs data");
        }
        return response.json();
      })
      .then((data) => {
        setClubs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching clubs:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleRateClub = (club) => {
    setSelectedClub(club);
    setShowModal(true);
    setRatings(Array(10).fill(0));
    setFeedback("");
    setSubmitted(false);
    setEmail("");
    setEmailError("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClub(null);
  };

  const handleStarClick = (questionIndex, rating) => {
    const newRatings = [...ratings];
    newRatings[questionIndex] = rating;
    setRatings(newRatings);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async () => {
    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");
    setSubmitting(true);

    // Prepare payload according to the required format
    const payload = {
      reg_id: selectedClub?.reg_id || 1,
      email: email,
      ques_1: ratings[0],
      ques_2: ratings[1],
      ques_3: ratings[2],
      ques_4: ratings[3],
      ques_5: ratings[4],
      ques_6: ratings[5],
      ques_7: ratings[6],
      ques_8: ratings[7],
      ques_9: ratings[8],
      ques_10: ratings[9],
    };

    try {
      // Send the rating data to the API
      const response = await fetch(
        "http://172.17.2.247:8080/intranetapp/overall-rating/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit rating");
      }

      // Add to local feedbacks for display
      const newFeedback = {
        id: Date.now(),
        clubId: selectedClub.reg_id,
        clubName: selectedClub.registration_name,
        rating: ratings,
        feedback,
        userName: email.split("@")[0],
        date: new Date().toLocaleDateString(),
      };

      setFeedbacks([newFeedback, ...feedbacks]);
      setSubmitted(true);

      // Show success popup after a short delay
      setTimeout(() => {
        setShowSuccessPopup(true);
      }, 1000);
    } catch (error) {
      console.error("Error submitting rating:", error);

      alert("Failed to submit rating. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const calculateAverageRating = () => {
    const validRatings = ratings.filter((r) => r > 0);
    if (validRatings.length === 0) return 0;
    return validRatings.reduce((a, b) => a + b, 0) / validRatings.length;
  };

  const areAllQuestionsRated = () => {
    return ratings.every((rating) => rating > 0);
  };

  const getRatingLabel = (rating) => {
    const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
    return labels[rating];
  };

  return (
    <div className={styles.clubRatingPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>University Clubs Rating</h1>
        <p className={styles.pageSubtitle}>
          Rate and review your favorite university clubs
        </p>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading clubs...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>Error: {error}</p>
          <button
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className={styles.clubsGrid}>
          {clubs.map((club) => (
            <div key={club.reg_id} className={styles.clubCard}>
              <div className={styles.clubInfo}>
                <h3 className={styles.clubName}>{club.registration_name}</h3>
                <p className={styles.clubDescription}>
                  {club.description ||
                    "Join this amazing club and participate in exciting activities!"}
                </p>

                <div className={styles.clubStats}></div>

                <div className={styles.ratingContainer}>
                  <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`${styles.star} ${styles.starIcon}`}
                        onClick={() => handleRateClub(club)}
                      >
                        <FaStar />
                      </span>
                    ))}
                  </div>
                  <button
                    className={styles.rateNowButton}
                    onClick={() => handleRateClub(club)}
                  >
                    Rate Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {feedbacks.length > 0 && (
        <div className={styles.feedbackSection}>
          <h2 className={styles.feedbackTitle}>What People Say</h2>
          <p className={styles.feedbackSubtitle}>
            Your feedback helps clubs improve their activities and events
          </p>
          <div className={styles.feedbackList}>
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className={styles.feedbackCard}>
                <div className={styles.feedbackHeader}>
                  <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>
                      {feedback.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className={styles.userName}>{feedback.userName}</div>
                      <div className={styles.feedbackDate}>{feedback.date}</div>
                    </div>
                  </div>
                  <div className={styles.clubName}>{feedback.clubName}</div>
                </div>

                <div className={styles.ratingStars}>
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <span
                        key={i}
                        className={`${styles.star} ${
                          i <
                          Math.round(
                            feedback.rating.reduce((a, b) => a + b, 0) /
                              feedback.rating.length
                          )
                            ? styles.filled
                            : ""
                        }`}
                      >
                        <FaStar />
                      </span>
                    ))}
                  <span className={styles.ratingValue}>
                    {(
                      feedback.rating.reduce((a, b) => a + b, 0) /
                      feedback.rating.length
                    ).toFixed(1)}
                  </span>
                </div>

                {feedback.feedback && (
                  <div className={styles.feedbackText}>{feedback.feedback}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showModal && selectedClub && (
        <div className={styles.modalOverlay}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {!submitted ? (
              <>
                <div className={styles.modalHeader}>
                  <h2>Rate {selectedClub.registration_name}</h2>
                  <button
                    className={styles.closeButton}
                    onClick={handleCloseModal}
                    aria-label="Close"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className={styles.allQuestionsContainer}>
                  {questions.map((question, index) => (
                    <div key={index} className={styles.questionBlock}>
                      <h4 className={styles.question}>{question}</h4>
                      <div className={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`${styles.ratingStar} ${
                              hoveredStars[index] >= star ||
                              ratings[index] >= star
                                ? styles.active
                                : ""
                            }`}
                            onClick={() => handleStarClick(index, star)}
                            onMouseEnter={() => {
                              const newHoveredStars = [...hoveredStars];
                              newHoveredStars[index] = star;
                              setHoveredStars(newHoveredStars);
                            }}
                            onMouseLeave={() => {
                              const newHoveredStars = [...hoveredStars];
                              newHoveredStars[index] = null;
                              setHoveredStars(newHoveredStars);
                            }}
                          >
                            <FaStar />
                          </span>
                        ))}
                      </div>
                      <div className={styles.ratingText}>
                        {ratings[index] > 0
                          ? getRatingLabel(ratings[index])
                          : ""}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.emailContainer}>
                  <label htmlFor="email" className={styles.emailLabel}>
                    Your Email <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={styles.emailInput}
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    required
                  />
                  {emailError && (
                    <p className={styles.emailError}>{emailError}</p>
                  )}
                </div>

                <div className={styles.feedbackContainer}>
                  <h3>Additional Feedback (Optional)</h3>
                  <textarea
                    className={styles.feedbackInput}
                    placeholder="Share your thoughts about this club..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  ></textarea>
                </div>

                <div className={styles.navigationButtons}>
                  <button
                    className={styles.submitButton}
                    onClick={handleSubmit}
                    disabled={!areAllQuestionsRated() || submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Rating"}
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.thankYouContainer}>
                <div className={styles.checkmarkCircle}>
                  <FaCheckCircle />
                </div>
                <h2>Thank You!</h2>
                <p>
                  Your rating for {selectedClub.registration_name} has been
                  submitted successfully.
                </p>
                <div className={styles.finalRating}>
                  <div className={styles.averageRating}>
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <span
                          key={i}
                          className={`${styles.ratingStar} ${
                            i < Math.round(calculateAverageRating())
                              ? styles.active
                              : ""
                          }`}
                        >
                          <FaStar />
                        </span>
                      ))}
                  </div>
                  <p>Average Rating: {calculateAverageRating().toFixed(1)}/5</p>
                </div>
                <button
                  className={styles.closeModalButton}
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Popup Message */}
      <PopupMessage
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        title="Awesome Achievement!"
        message={`Thank you for rating ${
          selectedClub?.registration_name || "this club"
        }! Your feedback helps make our university community better.`}
        type="achievement"
      />
    </div>
  );
};

export default ClubRatingPage;
