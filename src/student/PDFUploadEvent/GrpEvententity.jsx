import React, { useEffect, useState, useRef } from "react";
import apiClient from "../../config/apiClient";
import styles from "./GrpEvententity.module.css";
import ConfirmationDialog from "./ConfirmationDialog";
import FileUploadArea from "./FileUploadArea";

const GrpEvententity = () => {
  const [eventsData, setEventsData] = useState({});
  const [selectedClub, setSelectedClub] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getGrpEvent();
  }, []);

  const getGrpEvent = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/grouped-events-by-entity");
      setEventsData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to load clubs and events");
      setIsLoading(false);
    }
  };

  const handleClubChange = (e) => {
    setSelectedClub(e.target.value);
    setSelectedEvent(null);
    setPdfFile(null);
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

    setShowConfirmation(true);
  };

  const confirmUpload = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("pdf_file", pdfFile);
      // formData.append('rec_cer_id', selectedEvent.rec_cer_id);

      // Replace with your actual upload endpoint
      await apiClient.put(
        `/ceremony-upload-pdf/${selectedEvent?.rec_cer_id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("PDF uploaded successfully!");
      resetForm();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to upload PDF");
      setIsLoading(false);
    } finally {
      setShowConfirmation(false);
    }
  };

  const cancelUpload = () => {
    setShowConfirmation(false);
  };

  const resetForm = () => {
    setSelectedClub("");
    setSelectedEvent(null);
    setPdfFile(null);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Upload Event Certificate</h2>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {isLoading && !showConfirmation ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="club" className={styles.label}>
              Select Club:
            </label>
            <select
              id="club"
              value={selectedClub}
              onChange={handleClubChange}
              className={styles.select}
              required
            >
              <option value="">-- Select Club --</option>
              {Object.keys(eventsData).map((club) => (
                <option key={club} value={club}>
                  {club}
                </option>
              ))}
            </select>
          </div>

          {selectedClub && (
            <div className={styles.formGroup}>
              <label htmlFor="event" className={styles.label}>
                Select Event:
              </label>
              <select
                id="event"
                value={selectedEvent ? selectedEvent.rec_cer_id : ""}
                onChange={handleEventChange}
                className={styles.select}
                required
              >
                <option value="">-- Select Event --</option>
                {eventsData[selectedClub]?.map((event) => (
                  <option key={event.rec_cer_id} value={event.rec_cer_id}>
                    {event.activity_event_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedEvent && (
            <FileUploadArea onFileChange={handleFileChange} file={pdfFile} />
          )}

          {pdfFile && (
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              Upload Certificate
            </button>
          )}
        </form>
      )}

      {showConfirmation && (
        <ConfirmationDialog
          club={selectedClub}
          event={selectedEvent?.activity_event_name}
          fileName={pdfFile?.name}
          onConfirm={confirmUpload}
          onCancel={cancelUpload}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default GrpEvententity;
