"use client";

import { useState, useEffect } from "react";
import { ImageIcon, X, Trash2, AlertCircle } from "lucide-react";
import styles from "./PushFeatureEvent.module.css";

import apiClient from "../../config/apiClient";
import Toast from "./Toast";
import ConfirmModal from "./ConfirmModal";

const PushFeatureEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active",
  });
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [featureEvents, setFeatureEvents] = useState([]);

  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  // Modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
    itemTitle: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBanner(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBanner = () => {
    setBanner(null);
    setBannerPreview(null);
  };

  const closeToast = () => {
    setToast({ show: false, type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("description", formData.description);
      formPayload.append("status", formData.status);

      if (banner) {
        formPayload.append("banner", banner);
      }

      const response = await apiClient.post(
        "create/feature-event/",
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Feature Event created:", response.data);
      setToast({
        show: true,
        type: "success",
        message: "Feature Event created successfully!",
      });
      setSuccess(true);

      // Refresh the table data
      getFeatureEvents();

      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        status: "active",
      });
      setBanner(null);
      setBannerPreview(null);

      // Show success message for 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error creating feature event:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create feature event. Please try again."
      );
      setToast({
        show: true,
        type: "error",
        message: err.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (item) => {
    setDeleteModal({
      isOpen: true,
      itemId: item.feature_id,
      itemTitle: item.title,
    });
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      itemId: null,
      itemTitle: "",
    });
  };

  // Handle delete confirmation
  const confirmDelete = async () => {
    try {
      await apiClient.delete(`feature-event/${deleteModal.itemId}/delete/`);

      // Show success notification
      setToast({
        show: true,
        type: "success",
        message: "Feature Event deleted successfully!",
      });

      // Close the modal
      closeDeleteModal();

      // Refresh the data immediately
      getFeatureEvents();
    } catch (error) {
      console.error("Error deleting Feature Event:", error);
      setToast({
        show: true,
        type: "error",
        message: "Failed to delete Feature Event. Please try again.",
      });

      // Close the modal
      closeDeleteModal();
    }
  };

  // Toggle event status
  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      await apiClient.patch(`feature-event/${id}/status/`, {
        status: newStatus,
      });

      setToast({
        show: true,
        type: "success",
        message: `Feature Event status changed to ${newStatus}!`,
      });

      // Refresh the data
      getFeatureEvents();
    } catch (error) {
      console.error("Error updating status:", error);
      setToast({
        show: true,
        type: "error",
        message: "Failed to update status. Please try again.",
      });
    }
  };

  useEffect(() => {
    getFeatureEvents();
  }, []);

  const getFeatureEvents = async () => {
    try {
      const response = await apiClient.get("feature-event/all/");
      console.log("Fetched feature events:", response.data);
      setFeatureEvents(response.data);
    } catch (error) {
      console.error("Error fetching feature events:", error);
      setError(
        error.response?.data?.message ||
          "Failed to fetch feature events. Please try again."
      );
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={closeToast}
      />

      <div className={styles.header}>
        <h1>Create Feature Event</h1>
        <p>Add featured events to showcase on the platform</p>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="status">Status</label>
          <div className={styles.statusSelector}>
            <div
              className={`${styles.statusOption} ${
                formData.status === "active" ? styles.activeStatus : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({ ...prev, status: "active" }))
              }
            >
              Active
            </div>
            <div
              className={`${styles.statusOption} ${
                formData.status === "inactive" ? styles.activeStatus : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({ ...prev, status: "inactive" }))
              }
            >
              Inactive
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a title for your feature event"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter the description of your feature event"
            rows="6"
            required
          ></textarea>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="banner">
            <ImageIcon size={16} /> Banner Image
          </label>
          <div className={styles.imageUploadContainer}>
            <input
              type="file"
              id="banner"
              name="banner"
              onChange={handleBannerChange}
              accept="image/*"
              className={styles.fileInput}
              required={!banner}
            />
            <label htmlFor="banner" className={styles.uploadButton}>
              Choose Image
            </label>
            <span className={styles.fileName}>
              {banner ? banner.name : "No file chosen"}
            </span>
          </div>
        </div>

        {bannerPreview && (
          <div className={styles.imagePreviewContainer}>
            <div className={styles.imagePreview}>
              <img src={bannerPreview || "/placeholder.svg"} alt="Preview" />
              <button
                type="button"
                className={styles.removeImageButton}
                onClick={removeBanner}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Feature Event"}
          </button>
        </div>
      </form>

      <div className={styles.eventsSection}>
        <div className={styles.eventsHeader}>
          <h2>Feature Events History</h2>
          <p>View and manage previously created feature events</p>
        </div>

        <div className={styles.tableContainer}>
          {featureEvents.length > 0 ? (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Banner</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {featureEvents.map((item) => (
                  <tr key={item.feature_id}>
                    <td className={styles.imageCell}>
                      <div className={styles.thumbnailContainer}>
                        {item?.banner ? (
                          <img
                            src={item.banner || "/placeholder.svg"}
                            alt={item.title}
                            className={styles.thumbnail}
                          />
                        ) : (
                          <div className={styles.noImage}>
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={styles.titleCell}>{item.title}</td>
                    <td className={styles.descriptionCell}>
                      {item.description}
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          item.status === "active"
                            ? styles.activeStatus
                            : styles.inactiveStatus
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>{formatDate(item.date)}</td>
                    <td className={styles.actionCell}>
                      <button
                        className={styles.statusToggleButton}
                        onClick={() =>
                          toggleStatus(item.feature_id, item.status)
                        }
                      >
                        {item.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => openDeleteModal(item)}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.noData}>
              <div className={styles.noDataIcon}>
                <AlertCircle size={36} />
              </div>
              No feature events found. Create your first Feature Event above.
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${deleteModal.itemTitle}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default PushFeatureEvent;
