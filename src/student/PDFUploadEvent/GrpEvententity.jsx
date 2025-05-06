import React, { useEffect, useState } from "react";
import apiClient from "../../config/apiClient";
import styles from "./GrpEvententity.module.css";
import ConfirmationDialog from "./ConfirmationDialog";
import FileUploadArea from "./FileUploadArea";
import FilePreview from "./FilePreview";
import { FiAlertCircle, FiCheck, FiX, FiInfo, FiLink } from "react-icons/fi";
import {
  MdEmojiEvents,
  MdOutlinedFlag,
  MdUpload,
  MdFilePresent,
} from "react-icons/md";

const Notification = ({ type, message, description, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheck />;
      case "error":
        return <FiAlertCircle />;
      default:
        return <FiAlertCircle />;
    }
  };

  return (
    <div className={`${styles.notification} ${styles[`notification-${type}`]}`}>
      <div className={styles.notificationIcon}>{getIcon()}</div>
      <div className={styles.notificationContent}>
        <h4 className={styles.notificationTitle}>{message}</h4>
        <p className={styles.notificationDescription}>{description}</p>
      </div>
      <button className={styles.notificationClose} onClick={onClose}>
        <FiX />
      </button>
    </div>
  );
};

const GrpEvententity = () => {
  const [eventsData, setEventsData] = useState({});
  const [selectedClub, setSelectedClub] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [urlErrors, setUrlErrors] = useState({ instagram: "", linkedin: "" });
  const [uploadedPdfs, setUploadedPdfs] = useState([]);
  const [isLoadingPdfs, setIsLoadingPdfs] = useState(false);

  useEffect(() => {
    getGrpEvent();
    getPdfResponse();
  }, []);

  // Auto-select the first club when data is loaded
  useEffect(() => {
    if (Object.keys(eventsData).length > 0) {
      const firstClub = Object.keys(eventsData)[0];
      setSelectedClub(firstClub);
    }
  }, [eventsData]);

  // Check if there are social media URLs in the uploaded PDFs and pre-fill them
  useEffect(() => {
    if (uploadedPdfs.length > 0) {
      const latestPdf = uploadedPdfs[0]; // Assuming the first one is the latest

      if (latestPdf.instagram_url && !instagramUrl) {
        setInstagramUrl(latestPdf.instagram_url);
      }

      if (latestPdf.linkedin_url && !linkedinUrl) {
        setLinkedinUrl(latestPdf.linkedin_url);
      }
    }
  }, [uploadedPdfs]);

  const openNotification = (type, message, description) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, message, description }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const getGrpEvent = async () => {
    try {
      setIsLoading(true);
      const userDetail = JSON.parse(localStorage.getItem("user") || "{}");
      const regId = userDetail?.secretary_details?.[0]?.reg_id;
      const response = await apiClient.get(
        `/grouped-events-by-entity/${regId}`
      );
      setEventsData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to load clubs and events");
      setIsLoading(false);
    }
  };

  const getPdfResponse = async () => {
    try {
      setIsLoadingPdfs(true);
      const userDetail = JSON.parse(localStorage.getItem("user") || "{}");
      const regId = userDetail?.secretary_details?.[0]?.reg_id;
      const response = await apiClient.get(
        `/detailed-ceremony-event-by-registration/${regId}`
      );
      setUploadedPdfs(response.data || []);
      setIsLoadingPdfs(false);
    } catch (error) {
      console.log("Error fetching uploaded PDFs:", error);
      setIsLoadingPdfs(false);
    }
  };

  const handleEventChange = (e) => {
    const eventId = parseInt(e.target.value);
    const selectedEventObj = eventsData[selectedClub].find(
      (event) => event.rec_cer_id === eventId
    );
    setSelectedEvent(selectedEventObj);
  };

  const handleFileChange = (file) => {
    setPdfFile(file);
  };

  const validateUrl = (url, type) => {
    let isValid = true;
    let errorMessage = "";

    if (url.trim() === "") {
      return { isValid, errorMessage };
    }

    if (type === "instagram") {
      const instagramRegex =
        /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_\.]+\/?$/;
      if (!instagramRegex.test(url)) {
        isValid = false;
        errorMessage =
          "Please enter a valid Instagram URL (e.g., https://www.instagram.com/username)";
      }
    } else if (type === "linkedin") {
      const linkedinRegex =
        /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9_\-\.]+\/?$/;
      if (!linkedinRegex.test(url)) {
        isValid = false;
        errorMessage =
          "Please enter a valid LinkedIn URL (e.g., https://www.linkedin.com/in/username)";
      }
    }

    return { isValid, errorMessage };
  };

  const handleInstagramChange = (e) => {
    const url = e.target.value;
    setInstagramUrl(url);
    const { isValid, errorMessage } = validateUrl(url, "instagram");
    setUrlErrors((prev) => ({ ...prev, instagram: errorMessage }));
  };

  const handleLinkedinChange = (e) => {
    const url = e.target.value;
    setLinkedinUrl(url);
    const { isValid, errorMessage } = validateUrl(url, "linkedin");
    setUrlErrors((prev) => ({ ...prev, linkedin: errorMessage }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedClub) {
      setError("Please select a club");
      return;
    }

    if (!selectedEvent) {
      setError("Please select an event");
      return;
    }

    if (!pdfFile) {
      setError("Please upload a PDF file");
      return;
    }

    // Validate URLs if provided
    const instagramValidation = validateUrl(instagramUrl, "instagram");
    const linkedinValidation = validateUrl(linkedinUrl, "linkedin");

    if (!instagramValidation.isValid || !linkedinValidation.isValid) {
      setUrlErrors({
        instagram: instagramValidation.errorMessage,
        linkedin: linkedinValidation.errorMessage,
      });
      return;
    }

    setShowConfirmation(true);
  };

  const confirmUpload = async () => {
    try {
      setIsLoading(true);
      const userDetail = JSON.parse(localStorage.getItem("user") || "{}");
      const regId = userDetail?.secretary_details?.[0]?.reg_id;
      const formData = new FormData();
      formData.append("pdf_file", pdfFile);

      // Add social media URLs to payload if provided
      if (instagramUrl) formData.append("instagram_url", instagramUrl);
      if (linkedinUrl) formData.append("linkedin_url", linkedinUrl);

      await apiClient.put(
        `/ceremony-upload-pdf/${regId}/${selectedEvent?.rec_cer_id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Certificate uploaded successfully!");
      openNotification(
        "success",
        "Certificate Uploaded Successfully!",
        "Sent to admin"
      );
      // Refresh the uploaded PDFs list
      getPdfResponse();
      resetForm();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to upload certificate");
      openNotification(
        "error",
        "Upload Failed",
        error.response?.data?.message ||
          `Error ${error.response?.status || "unknown"}: Something went wrong!`
      );
      setIsLoading(false);
    } finally {
      setShowConfirmation(false);
    }
  };

  const cancelUpload = () => {
    setShowConfirmation(false);
  };

  const resetForm = () => {
    // Don't reset the club since we're auto-selecting it
    setSelectedEvent(null);
    setPdfFile(null);
    // Don't reset social media URLs since we want to keep them
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const openPdf = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.notificationsContainer}>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            type={notification.type}
            message={notification.message}
            description={notification.description}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

     <h2 className={styles.sectionTitle} > <MdUpload className={styles.sectionIcon} />Club Nomination Form</h2>

      <div className={styles.mainContent}>
        {/* Important Message Alert */}
        <div className={styles.alertBox}>
          <div className={styles.alertIconWrapper}>
            <FiAlertCircle className={styles.alertIcon} />
          </div>
          <div className={styles.alertContent}>
            <h3 className={styles.alertTitle}>Important Information</h3>
            <p>
              <strong>Important:</strong> Proofs Required: 1. Minutes to Minute 2. Approval Form 3. Post
              Activity Report 4. Feedback 5. Attendance 6. Circular [HOD Notice]
              7. Guest Profile 8. Event Glimpses 8.Any Sponsorship /MOU 9.
              Rewards and Recognition. 11. CUIMS Punching
            </p>
            <p>
            Upload size must be less than 5MB.
            </p>
           
            <p>
              Only PDF files are accepted. Make sure your certificate is clearly
              visible and properly formatted.
            </p>
            <p>
              Social media links are recommended for better visibility of your
              event.
            </p>
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <FiAlertCircle className={styles.errorIcon} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className={styles.successMessage}>
            <FiCheck className={styles.successIcon} />
            <span>{success}</span>
          </div>
        )}

        {isLoading && !showConfirmation ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading...</p>
          </div>
        ) : (
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formSection}>
                <h2 className={styles.sectionTitle}>
                  <MdEmojiEvents className={styles.sectionIcon} />
                  Event Details
                </h2>

                {/* Club is auto-selected but hidden */}
                <input type="hidden" value={selectedClub} />

                {selectedClub && (
                  <div className={styles.formField}>
                    <label htmlFor="event" className={styles.formLabel}>
                      Select Event
                    </label>
                    <div className={styles.selectWrapper}>
                      <select
                        id="event"
                        value={selectedEvent ? selectedEvent.rec_cer_id : ""}
                        onChange={handleEventChange}
                        className={styles.formSelect}
                        required
                      >
                        <option value="">-- Select Event --</option>
                        {eventsData[selectedClub]?.map((event) => (
                          <option
                            key={event.rec_cer_id}
                            value={event.rec_cer_id}
                          >
                            {event.activity_event_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className={styles.formField}>
                  <label htmlFor="instagram" className={styles.formLabel}>
                    Instagram URL
                  </label>
                  <div className={styles.inputWithIcon}>
                    <input
                      id="instagram"
                      type="text"
                      value={instagramUrl}
                      onChange={handleInstagramChange}
                      placeholder={
                        instagramUrl
                          ? ""
                          : "No Instagram URL found. Please add one."
                      }
                      className={`${styles.formInput} ${
                        urlErrors.instagram ? styles.inputError : ""
                      }`}
                    />
                    <FiLink className={styles.inputIcon} />
                  </div>
                  {urlErrors.instagram && (
                    <div className={styles.fieldError}>
                      {urlErrors.instagram}
                    </div>
                  )}
                </div>

                <div className={styles.formField}>
                  <label htmlFor="linkedin" className={styles.formLabel}>
                    LinkedIn URL
                  </label>
                  <div className={styles.inputWithIcon}>
                    <input
                      id="linkedin"
                      type="text"
                      value={linkedinUrl}
                      onChange={handleLinkedinChange}
                      placeholder={
                        linkedinUrl
                          ? ""
                          : "No LinkedIn URL found. Please add one."
                      }
                      className={`${styles.formInput} ${
                        urlErrors.linkedin ? styles.inputError : ""
                      }`}
                    />
                    <FiLink className={styles.inputIcon} />
                  </div>
                  {urlErrors.linkedin && (
                    <div className={styles.fieldError}>
                      {urlErrors.linkedin}
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Section - Now below the form */}
              {selectedEvent && (
                <div className={styles.formSection}>
                  <h2 className={styles.sectionTitle}>
                    <MdUpload className={styles.sectionIcon} />
                    Upload Documents
                  </h2>
                  <div className={styles.uploadContainer}>
                    <FileUploadArea
                      onFileChange={handleFileChange}
                      file={pdfFile}
                    />
                  </div>

                  {pdfFile && (
                    <div className={styles.previewContainer}>
                      <h3 className={styles.previewTitle}>
                        <MdFilePresent className={styles.previewIcon} />
                        Document Preview
                      </h3>
                      <FilePreview file={pdfFile} />
                    </div>
                  )}
                </div>
              )}

              {pdfFile && (
                <div className={styles.formActions}>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className={styles.buttonSpinner}></span>
                        Processing...
                      </>
                    ) : (
                      <>Submit Nomination</>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Uploaded PDFs Table Section */}
        <div className={styles.tableSection}>
          <h2 className={styles.sectionTitle}>
            <MdFilePresent className={styles.sectionIcon} />
            Status of Nominations
          </h2>

          {isLoadingPdfs ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>Loading your certificates...</p>
            </div>
          ) : uploadedPdfs.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>
                <MdFilePresent />
              </div>
              <p className={styles.emptyStateText}>
                You haven't uploaded any certificates yet.
              </p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Activity Event Name</th>
                    <th>Activity Types</th>
                    <th>Level Of Activitys</th>
                    <th>Entity Name</th>
                    <th>Upload Date</th>
                    <th>Social Links</th>
                    <th>Certificate</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedPdfs.map((pdf, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0 ? styles.evenRow : styles.oddRow
                      }
                    >
                      <td className={styles.eventNameCell}>
                        {pdf.activity_event_names || "N/A"}
                      </td>
                      <td>{pdf.activity_types || "N/A"}</td>
                      <td>{pdf.level_of_activitys || "N/A"}</td>
                      <td>{pdf.entity_names || "N/A"}</td>
                      <td>{formatDate(pdf.upload_date)}</td>
                      <td className={styles.socialLinksCell}>
                        {pdf.instagram_url && (
                          <a
                            href={pdf.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                x="2"
                                y="2"
                                width="20"
                                height="20"
                                rx="5"
                                ry="5"
                              ></rect>
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                              <line
                                x1="17.5"
                                y1="6.5"
                                x2="17.51"
                                y2="6.5"
                              ></line>
                            </svg>
                          </a>
                        )}
                        {pdf.linkedin_url && (
                          <a
                            href={pdf.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                              <rect x="2" y="9" width="4" height="12"></rect>
                              <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                          </a>
                        )}
                        {!pdf.instagram_url && !pdf.linkedin_url && "None"}
                      </td>
                      <td>
                        <button
                          className={styles.viewButton}
                          onClick={() => openPdf(pdf.pdf_url)}
                          disabled={!pdf.pdf_url}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showConfirmation && (
        <ConfirmationDialog
          club={selectedClub}
          event={selectedEvent?.activity_event_name}
          fileName={pdfFile?.name}
          instagram={instagramUrl}
          linkedin={linkedinUrl}
          onConfirm={confirmUpload}
          onCancel={cancelUpload}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default GrpEvententity;
