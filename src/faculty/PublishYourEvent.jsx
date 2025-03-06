"use client";

import React, { useEffect, useState } from "react";
import styles from "./PublishYourEvent.module.css";
import {
  MdSearch,
  MdError,
  MdCheckCircle,
  MdWarning,
  MdClose,
} from "react-icons/md";
import apiClient from "../config/apiClient";

const PublishYourEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regIds, setRegIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [posterPreview, setPosterPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "", // success, error, warning
    message: "",
  });
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    limit: "",
    remark: "",
    poster: null,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const getUserData = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          // Check if faculty_advisory_details is an array
          if (
            parsedUserData &&
            parsedUserData.faculty_advisory_details &&
            Array.isArray(parsedUserData.faculty_advisory_details)
          ) {
            // Extract all reg_ids from the array
            const ids = parsedUserData.faculty_advisory_details.map(
              (item) => item.reg_id
            );
            if (ids.length > 0) {
              setRegIds(ids);
            } else {
              throw new Error("No reg_ids found in user data");
            }
          } 
          // Check if faculty_advisory_details is an object with reg_id
          else if (
            parsedUserData &&
            parsedUserData.faculty_advisory_details &&
            parsedUserData.faculty_advisory_details.reg_id
          ) {
            setRegIds([parsedUserData.faculty_advisory_details.reg_id]);
          } else {
            throw new Error("reg_id not found in user data");
          }
        } else {
          throw new Error("User data not found in localStorage");
        }
      } catch (err) {
        setError(`Failed to get user data: ${err.message}`);
        showNotification("error", `Failed to get user data: ${err.message}`);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    if (regIds.length > 0) {
      fetchEvents();
    }
  }, [regIds]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setEvents([]); // Reset events when fetching new data
      
      for (const regId of regIds) {
        try {
          console.log(`Fetching events for reg_id: ${regId}`);
          const response = await apiClient.get(
            `event_entry_request_list_for_faculty/?reg_id=${regId}`
          );
          
          if (response?.data) {
            const dataArray = Array.isArray(response.data)
              ? response.data
              : [response.data];
              
            // Append new events to existing ones
            setEvents(prevEvents => [...prevEvents, ...dataArray]);
          }
        } catch (error) {
          console.error(`Error fetching events for reg_id ${regId}:`, error);
        }
      }
    } catch (error) {
      const errorMessage = `Error fetching event data: ${
        error.response?.data?.detail || error.message
      }`;
      setError(errorMessage);
      showNotification("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message,
    });

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.start_date) {
      errors.start_date = "Start date is required";
    }

    if (!formData.end_date) {
      errors.end_date = "End date is required";
    } else if (
      formData.start_date &&
      new Date(formData.end_date) < new Date(formData.start_date)
    ) {
      errors.end_date = "End date cannot be before start date";
    }

    if (!formData.start_time) {
      errors.start_time = "Start time is required";
    }

    if (!formData.end_time) {
      errors.end_time = "End time is required";
    }

    if (!formData.limit) {
      errors.limit = "Participant limit is required";
    } else if (Number.parseInt(formData.limit) <= 0) {
      errors.limit = "Limit must be greater than zero";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        showNotification(
          "error",
          "Please upload a valid image file (JPEG, PNG)"
        );
        e.target.value = null;
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification("error", "File size should not exceed 5MB");
        e.target.value = null;
        return;
      }

      setFormData((prev) => ({ ...prev, poster: file }));

      // Preview the selected poster
      const reader = new FileReader();
      reader.onload = () => setPosterPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPosterPreview(null);
      setFormData((prev) => ({ ...prev, poster: null }));
    }
  };

  const handleSubmit = async (erId, regId) => {
    if (!validateForm()) {
      showNotification(
        "warning",
        "Please fix the errors in the form before submitting"
      );
      return;
    }

    try {
      setSubmitting(true);

      const payload = new FormData();
      payload.append("start_date", formData.start_date);
      payload.append("end_date", formData.end_date);
      payload.append("start_time", formData.start_time);
      payload.append("end_time", formData.end_time);
      payload.append("limit", formData.limit);
      payload.append("remark", formData.remark || "");
      if (formData.poster) {
        payload.append("poster", formData.poster);
      }

      const apiUrl = `event-request/${erId}/${regId}/`;
      const response = await apiClient.put(apiUrl, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showNotification("success", "Event published successfully!");
      console.log("Update successful:", response.data);

      // Reset form after successful submission
      setFormData({
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
        limit: "",
        remark: "",
        poster: null,
      });
      setPosterPreview(null);

      // Refresh events list
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);

      let errorMessage = "Failed to publish event.";
      showNotification("error", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmSubmit = (erId, regId) => {
    if (!validateForm()) {
      return;
    }

    const confirmDialog = document.createElement("div");
    confirmDialog.className = styles.confirmDialog;
    confirmDialog.innerHTML = `
      <div class="${styles.confirmDialogContent}">
        <h3>Confirm Event Publication</h3>
        <p>Are you sure you want to publish this event? This action cannot be undone.</p>
        <div class="${styles.confirmDialogButtons}">
          <button id="cancelBtn" class="${styles.cancelButton}">Cancel</button>
          <button id="confirmBtn" class="${styles.confirmButton}">Publish Event</button>
        </div>
      </div>
    `;

    document.body.appendChild(confirmDialog);

    document.getElementById("cancelBtn").addEventListener("click", () => {
      document.body.removeChild(confirmDialog);
    });

    document.getElementById("confirmBtn").addEventListener("click", () => {
      document.body.removeChild(confirmDialog);
      handleSubmit(erId, regId);
    });
  };

  const filteredEvents = events.filter(
    (event) =>
      event.event_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.activity_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.pageContainer}>
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          <div className={styles.notificationContent}>
            <span className={styles.notificationIcon}>
              {notification.type === "success" && <MdCheckCircle />}
              {notification.type === "error" && <MdError />}
              {notification.type === "warning" && <MdWarning />}
            </span>
            <span className={styles.notificationMessage}>
              {notification.message}
            </span>
          </div>
          <button
            className={styles.notificationClose}
            onClick={closeNotification}
          >
            <MdClose />
          </button>
        </div>
      )}

      <div className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.mainTitle}>Event Status</h1>
          <p className={styles.subtitle}>
            Review and manage event entry requests
          </p>
        </div>
      </div>

      <div className={styles.controlsSection}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>
            <MdSearch />
          </span>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingPulse}>
          <div className={styles.pulseDot}></div>
          <div className={styles.pulseDot}></div>
          <div className={styles.pulseDot}></div>
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>!</div>
          <h3>Error Loading Events</h3>
          <p>{error}</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.modernTable}>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Event Details</th>
                <th>Activity & Organizer</th>
                <th>Budget</th>
                <th>Received On</th>
                <th>Collected On</th>
                <th>Collected By</th>
                <th>File Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className={styles.emptyState}>
                      <span className={styles.emptyIcon}>📋</span>
                      <h3>No events found</h3>
                      <p>There are no events matching your search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event, index) => (
                  <React.Fragment key={event.er_id}>
                    <tr className={styles.tableRowHover}>
                      <td className={styles.idColumn}>{index + 1}</td>
                      <td className={styles.eventDetails}>
                        <div className={styles.eventName}>
                          {event.event_name || "Unnamed Event"}
                        </div>
                        <div className={styles.eventDate}>
                          {`SDP: ${event.start_date_proposed || "No date specified"}`}
                        </div>
                        <div className={styles.eventDate}>
                          {`EDP: ${event.end_date_proposed || "No date specified"}`}
                        </div>
                      </td>
                      <td>
                        <div className={styles.activityType}>
                          {event.activity_type || "Not specified"}
                        </div>
                        <div className={styles.organizer}>
                          {`Limit: ${event.limit || "Not set"}`}
                        </div>
                      </td>
                      <td className={styles.budgetColumn}>
                        <div className={styles.budgetAmount}>
                          {event.budget ? `₹${event.budget}` : "N/A"}
                        </div>
                      </td>
                      <td>{event.received_on || "N/A"}</td>
                      <td>{event.collected_on || "N/A"}</td>
                      <td>{event.collected_by || "N/A"}</td>
                      <td>
                        <span
                          className={`${styles.statusPill} ${
                            event.file_status === "Submitted To Department"
                              ? styles.statusApproved
                              : event.file_status === "Rejected"
                              ? styles.statusRejected
                              : styles.statusPending
                          }`}
                        >
                          {event.file_status || "Pending"}
                        </span>
                      </td>
                    </tr>
                    {event.file_status === "Submitted To Department" && (
                      <tr className={styles.expandedRow}>
                        <td colSpan="8">
                          <div className={styles.formContainer}>
                            <h3 className={styles.formTitle}>
                              Publish Event Details
                            </h3>
                            <div className={styles.formGrid}>
                              <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                  Start Date{" "}
                                  <span className={styles.required}>*</span>
                                </label>
                                <input
                                  type="date"
                                  name="start_date"
                                  value={formData.start_date}
                                  onChange={handleChange}
                                  className={`${styles.inputField} ${
                                    formErrors.start_date
                                      ? styles.inputError
                                      : ""
                                  }`}
                                />
                                {formErrors.start_date && (
                                  <div className={styles.errorText}>
                                    {formErrors.start_date}
                                  </div>
                                )}
                              </div>

                              <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                  End Date{" "}
                                  <span className={styles.required}>*</span>
                                </label>
                                <input
                                  type="date"
                                  name="end_date"
                                  value={formData.end_date}
                                  onChange={handleChange}
                                  className={`${styles.inputField} ${
                                    formErrors.end_date ? styles.inputError : ""
                                  }`}
                                />
                                {formErrors.end_date && (
                                  <div className={styles.errorText}>
                                    {formErrors.end_date}
                                  </div>
                                )}
                              </div>

                              <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                  Start Time{" "}
                                  <span className={styles.required}>*</span>
                                </label>
                                <input
                                  type="time"
                                  name="start_time"
                                  value={formData.start_time}
                                  onChange={handleChange}
                                  className={`${styles.inputField} ${
                                    formErrors.start_time
                                      ? styles.inputError
                                      : ""
                                  }`}
                                />
                                {formErrors.start_time && (
                                  <div className={styles.errorText}>
                                    {formErrors.start_time}
                                  </div>
                                )}
                              </div>

                              <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                  End Time{" "}
                                  <span className={styles.required}>*</span>
                                </label>
                                <input
                                  type="time"
                                  name="end_time"
                                  value={formData.end_time}
                                  onChange={handleChange}
                                  className={`${styles.inputField} ${
                                    formErrors.end_time ? styles.inputError : ""
                                  }`}
                                />
                                {formErrors.end_time && (
                                  <div className={styles.errorText}>
                                    {formErrors.end_time}
                                  </div>
                                )}
                              </div>

                              <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                  Participant Limit{" "}
                                  <span className={styles.required}>*</span>
                                </label>
                                <input
                                  type="number"
                                  name="limit"
                                  value={formData.limit}
                                  onChange={handleChange}
                                  placeholder="Maximum number of participants"
                                  className={`${styles.inputField} ${
                                    formErrors.limit ? styles.inputError : ""
                                  }`}
                                />
                                {formErrors.limit && (
                                  <div className={styles.errorText}>
                                    {formErrors.limit}
                                  </div>
                                )}
                              </div>

                              <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                  Remarks
                                </label>
                                <textarea
                                  name="remark"
                                  value={formData.remark}
                                  onChange={handleChange}
                                  placeholder="Additional information about the event"
                                  className={styles.inputField}
                                  rows="3"
                                />
                              </div>

                              <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                  Event Poster
                                </label>
                                <input
                                  type="file"
                                  name="poster"
                                  onChange={handleFileChange}
                                  accept="image/jpeg,image/png,image/jpg"
                                  className={styles.fileInput}
                                />
                                <div className={styles.fileHelp}>
                                  Accepted formats: JPG, PNG. Max size: 5MB
                                </div>
                              </div>

                              {posterPreview && (
                                <div className={styles.posterPreviewContainer}>
                                  <img
                                    src={posterPreview || "/placeholder.svg"}
                                    alt="Poster Preview"
                                    className={styles.posterPreview}
                                  />
                                </div>
                              )}
                              <div className={styles.formActions}>
                                <button
                                  className={styles.submitButton}
                                  onClick={() => confirmSubmit(event.er_id, event.reg_id)}
                                  disabled={submitting}
                                >
                                  {submitting ? "Publishing..." : "Publish Event"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PublishYourEvent;