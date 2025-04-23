"use client";

import { useEffect, useState } from "react";
import { Calendar, ImageIcon, X, Trash2, AlertCircle, Image } from 'lucide-react';
import styles from "./PushNewsAndViews.module.css";
import tableStyles from "./PushNewsAndViews.module.css";

import apiClient from "../../config/apiClient";

import Toast from "./Toast";
import PushConfirmModal from "./PushConfirmModal";

const PushNewsAndViews = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "News",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(new Date().setDate(new Date().getDate() + 14))
      .toISOString()
      .split("T")[0],
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [newsAndViews, setNewsAndViews] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
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
      formPayload.append("content", formData.content);
      formPayload.append("category", formData.category);
      formPayload.append("start_date", formData.start_date);
      formPayload.append("end_date", formData.end_date);

      if (image) {
        formPayload.append("image", image);
      }

      const response = await apiClient.post("news-and-views/", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("News and Views created:", response.data);
      setToast({
        show: true,
        type: "success",
        message: "News and Views created successfully!",
      });
      setSuccess(true);

      // Refresh the table data
      getFullNewsAndViews();

      // Reset form after successful submission
      setFormData({
        title: "",
        content: "",
        category: "News",
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date(new Date().setDate(new Date().getDate() + 14))
          .toISOString()
          .split("T")[0],
      });
      setImage(null);
      setImagePreview(null);

      // Show success message for 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error creating news and views:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create news and views. Please try again."
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
      itemId: item.news_id,
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
      await apiClient.delete(`delete-news/${deleteModal.itemId}/`);

      // Show success notification
      setNotification({
        show: true,
        type: "success",
        message: "News and Views deleted successfully!",
      });

      // Close the modal
      closeDeleteModal();

      // Refresh the data immediately
      getFullNewsAndViews();

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, type: "", message: "" });
      }, 3000);
      setToast({
        show: true,
        type: "success",
        message: "News and Views deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting News&Views:", error);
      setNotification({
        show: true,
        type: "success",
        message: "Failed to delete News&Views. Please try again.",
      });
      setToast({
        show: true,
        type: "error",
        
      });

      // Close the modal
      closeDeleteModal();

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, type: "", message: "" });
      }, 3000);
    }
  };

  useEffect(() => {
    getFullNewsAndViews();
  }, []);

  const getFullNewsAndViews = async () => {
    try {
      const response = await apiClient.get("news-and-views/all/");
      console.log("Fetched news and views:", response.data);
      setNewsAndViews(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError(
        error.response?.data?.message ||
          "Failed to fetch notifications. Please try again."
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
        <h1>Create News & Views</h1>
        <p>Share important news and views with the community</p>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="category">Category</label>
          <div className={styles.categorySelector}>
            <div
              className={`${styles.categoryOption} ${
                formData.category === "News" ? styles.activeCategory : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({ ...prev, category: "News" }))
              }
            >
              News
            </div>
            <div
              className={`${styles.categoryOption} ${
                formData.category === "Views" ? styles.activeCategory : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({ ...prev, category: "Views" }))
              }
            >
              Views
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
            placeholder="Enter a title for your news/views"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Enter the content of your news/views"
            rows="6"
            required
          ></textarea>
        </div>

        <div className={styles.dateContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="start_date">
              <Calendar size={16} /> Start Date
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="end_date">
              <Calendar size={16} /> End Date
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image">
            <ImageIcon size={16} /> Image (Optional)
          </label>
          <div className={styles.imageUploadContainer}>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className={styles.fileInput}
            />
            <label htmlFor="image" className={styles.uploadButton}>
              Choose Image
            </label>
            <span className={styles.fileName}>
              {image ? image.name : "No file chosen"}
            </span>
          </div>
        </div>

        {imagePreview && (
          <div className={styles.imagePreviewContainer}>
            <div className={styles.imagePreview}>
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" />
              <button
                type="button"
                className={styles.removeImageButton}
                onClick={removeImage}
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
            {loading ? "Creating..." : "Create News & Views"}
          </button>
        </div>
      </form>

      <div className={styles.notificationSection}>
        <div className={styles.notificationHeader}>
          <h2>News & Views History</h2>
          <p>View and manage previously sent News and Views</p>
        </div>

        <div className={tableStyles.tableContainer}>
          {newsAndViews.length > 0 ? (
            <table className={tableStyles.dataTable}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Content</th>
                  <th>Category</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {newsAndViews.map((item) => (
                  <tr key={item.id || item.news_id}>
                    <td className={tableStyles.imageCell}>
                      <div className={tableStyles.thumbnailContainer}>
                        {item?.image_url ? (
                          <img
                            src={item.image_url || "/placeholder.svg"}
                            alt={item.title}
                            className={tableStyles.thumbnail}
                          />
                        ) : (
                          <div className={tableStyles.noImage}>
                            <Image size={20} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={tableStyles.messageCell}>{item.title}</td>
                    <td className={tableStyles.contentCell}>{item.content}</td>
                    <td>
                      <span
                        className={`${tableStyles.categoryBadge} ${
                          item.category === "News"
                            ? tableStyles.newsCategory
                            : tableStyles.viewsCategory
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td>{formatDate(item.start_date)}</td>
                    <td>{formatDate(item.end_date)}</td>
                    <td className={tableStyles.actionCell}>
                      <button
                        className={tableStyles.deleteButton}
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
            <div className={tableStyles.noData}>
              <div className={tableStyles.noDataIcon}>
                <AlertCircle size={36} />
              </div>
              No news and views found. Create your first News & Views above.
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <PushConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${deleteModal.itemTitle}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default PushNewsAndViews;
