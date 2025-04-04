"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./PushNotification.module.css";
import apiClient from "../config/apiClient";

// MultiSelect component defined within the same file
const MultiSelect = ({
  options,
  selectedValues,
  onChange,
  displayProperty,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    const isSelected = selectedValues.some((item) =>
      displayProperty
        ? item[displayProperty] === option[displayProperty]
        : item === option
    );

    let newSelectedValues;

    if (isSelected) {
      newSelectedValues = selectedValues.filter((item) =>
        displayProperty
          ? item[displayProperty] !== option[displayProperty]
          : item !== option
      );
    } else {
      newSelectedValues = [...selectedValues, option];
    }

    onChange(newSelectedValues);
  };

  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      onChange([]);
    } else {
      onChange([...options]);
    }
  };

  const isOptionSelected = (option) => {
    return selectedValues.some((item) =>
      displayProperty
        ? item[displayProperty] === option[displayProperty]
        : item === option
    );
  };

  return (
    <div className={styles.multiSelectContainer} ref={dropdownRef}>
      <div className={styles.multiSelectHeader} onClick={toggleDropdown}>
        {selectedValues.length > 0 ? (
          <div className={styles.selectedItems}>
            {selectedValues.length === options.length ? (
              <span>All selected</span>
            ) : (
              <span>{selectedValues.length} selected</span>
            )}
          </div>
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
        <span className={styles.arrow}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline
              points={isOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}
            ></polyline>
          </svg>
        </span>
      </div>

      {isOpen && (
        <div className={styles.dropdownList}>
          <div
            className={`${styles.dropdownItem} ${styles.selectAllOption}`}
            onClick={handleSelectAll}
          >
            <input
              type="checkbox"
              checked={selectedValues.length === options.length}
              onChange={handleSelectAll}
              className={styles.checkbox}
            />
            <span>Select All</span>
          </div>

          {options.map((option, index) => (
            <div
              key={index}
              className={styles.dropdownItem}
              onClick={() => handleSelect(option)}
            >
              <input
                type="checkbox"
                checked={isOptionSelected(option)}
                onChange={() => handleSelect(option)}
                className={styles.checkbox}
              />
              <span>{displayProperty ? option[displayProperty] : option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main AdminDashboard component
const PushNotification = () => {
  // State for notification form
  const [message, setMessage] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedEntities, setSelectedEntities] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  // Data for dropdowns
  const [roles, setRoles] = useState([]);
  const [entities, setEntities] = useState([]);

  const categories = [
    { id: "info", name: "Information" },
    { id: "urgent", name: "Urgent" },
    { id: "deadline", name: "Deadline" },
  ];

  useEffect(() => {
    // Fetch roles and entities when component mounts
    const fetchData = async () => {
      try {
        const [rolesResponse, entitiesResponse] = await Promise.all([
          apiClient.get("/roles/"),
          apiClient.get("/entity_count/"),
        ]);

        setRoles(rolesResponse.data);
        setEntities(entitiesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSendNotification = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setNotification({
        show: true,
        type: "error",
        message: "Please enter a message",
      });
      return;
    }

    if (selectedRoles.length === 0) {
      setNotification({
        show: true,
        type: "error",
        message: "Please select at least one role",
      });
      return;
    }

    if (selectedEntities.length === 0) {
      setNotification({
        show: true,
        type: "error",
        message: "Please select at least one entity",
      });
      return;
    }

    if (selectedCategories.length === 0) {
      setNotification({
        show: true,
        type: "error",
        message: "Please select at least one category",
      });
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        message: message,
        roles: selectedRoles.map((role) => role.role_id),
        entity: selectedEntities.map((entity) => entity.entity_id),
        category: selectedCategories.map((category) => category.id).join(","),
      };

      const response = await apiClient.post("/notifications/create/", payload);

      if (response.status === 201 || response.status === 200) {
        setNotification({
          show: true,
          type: "success",
          message: "Notification sent successfully!",
        });

        // Reset form after successful submission
        setMessage("");
        setSelectedRoles([]);
        setSelectedEntities([]);
        setSelectedCategories([]);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setNotification({ show: false, type: "", message: "" });
        }, 3000);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      setNotification({
        show: true,
        type: "error",
        message: "Failed to send notification. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.dashboardContent}>
          {/* Push Notification Section */}
          <div className={styles.notificationSection}>
            <div className={styles.notificationHeader}>
              <h2>Push Notification</h2>
              <p>
                Send notifications to users based on roles, entities, and
                categories
              </p>
            </div>

            {notification.show && (
              <div
                className={`${styles.notificationAlert} ${
                  styles[notification.type]
                }`}
              >
                {notification.message}
              </div>
            )}

            <div className={styles.notificationForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Select Roles</label>
                  <MultiSelect
                    options={roles}
                    selectedValues={selectedRoles}
                    onChange={setSelectedRoles}
                    displayProperty="role_name"
                    placeholder="Select roles..."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Select Entities</label>
                  <MultiSelect
                    className={styles.selectedValuesData}
                    options={entities}
                    selectedValues={selectedEntities}
                    onChange={setSelectedEntities}
                    displayProperty="entity_name"
                    placeholder="Select entities..."
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Select Categories</label>
                  <MultiSelect
                    options={categories}
                    selectedValues={selectedCategories}
                    onChange={setSelectedCategories}
                    displayProperty="name"
                    placeholder="Select categories..."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your notification message..."
                    rows={3}
                    className={styles.messageInput}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  onClick={handleSendNotification}
                  className={styles.sendButton}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className={styles.loadingSpinner}></span>
                      <span>Sending...</span>
                    </>
                  ) : (
                    "Send Notification"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PushNotification;
