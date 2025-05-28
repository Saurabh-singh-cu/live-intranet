// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Trash2, AlertCircle, Edit, Bell } from 'lucide-react';
// import tableStyles from "./PushNotification.module.css";

// import styles from "./PushNotification.module.css";
// import apiClient from "../../config/apiClient";
// import Toast from "./Toast";
// import PushConfirmModal from "./PushConfirmModal";
// import RichTextEditor from "./RichTextEditor";
// import notificationImage from "../../assets/images/Background.jpg";

// // MultiSelect component defined within the same file
// const MultiSelect = ({
//   options,
//   selectedValues,
//   onChange,
//   displayProperty,
//   placeholder,
//   showSelectAll = true,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleSelect = (option) => {
//     const isSelected = selectedValues.some((item) =>
//       displayProperty
//         ? item[displayProperty] === option[displayProperty]
//         : item === option
//     );

//     let newSelectedValues;

//     if (isSelected) {
//       newSelectedValues = selectedValues.filter((item) =>
//         displayProperty
//           ? item[displayProperty] !== option[displayProperty]
//           : item !== option
//       );
//     } else {
//       newSelectedValues = [...selectedValues, option];
//     }

//     onChange(newSelectedValues);
//   };

//   const handleSelectAll = () => {
//     if (selectedValues.length === options.length) {
//       onChange([]);
//     } else {
//       onChange([...options]);
//     }
//   };

//   const isOptionSelected = (option) => {
//     return selectedValues.some((item) =>
//       displayProperty
//         ? item[displayProperty] === option[displayProperty]
//         : item === option
//     );
//   };

//   // Get display names of selected values
//   const getSelectedNames = () => {
//     return selectedValues
//       .map((item) => (displayProperty ? item[displayProperty] : item))
//       .join(", ");
//   };

//   return (
//     <div className={styles.multiSelectContainer} ref={dropdownRef}>
//       <div className={styles.multiSelectHeader} onClick={toggleDropdown}>
//         {selectedValues.length > 0 ? (
//           <div className={styles.selectedItems}>
//             <span className={styles.selectedNames}>{getSelectedNames()}</span>
//           </div>
//         ) : (
//           <span className={styles.placeholder}>{placeholder}</span>
//         )}
//         <span className={styles.arrow}>
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <polyline
//               points={isOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}
//             ></polyline>
//           </svg>
//         </span>
//       </div>

//       {isOpen && (
//         <div className={styles.dropdownList}>
//           {showSelectAll && (
//             <div
//               className={`${styles.dropdownItem} ${styles.selectAllOption}`}
//               onClick={handleSelectAll}
//             >
//               <input
//                 type="checkbox"
//                 checked={selectedValues.length === options.length}
//                 onChange={handleSelectAll}
//                 className={styles.checkbox}
//               />
//               <span>Select All</span>
//             </div>
//           )}

//           {options.map((option, index) => (
//             <div
//               key={index}
//               className={styles.dropdownItem}
//               onClick={() => handleSelect(option)}
//             >
//               <input
//                 type="checkbox"
//                 checked={isOptionSelected(option)}
//                 onChange={() => handleSelect(option)}
//                 className={styles.checkbox}
//               />
//               <span>{displayProperty ? option[displayProperty] : option}</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // Main AdminDashboard component
// const PushNotification = () => {
//   // State for notification form
//   const [message, setMessage] = useState("");
//   const [selectedRoles, setSelectedRoles] = useState([]);
//   const [selectedEntities, setSelectedEntities] = useState([]);
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [dateErrors, setDateErrors] = useState({
//     startDate: "",
//     endDate: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [notification, setNotification] = useState({
//     show: false,
//     type: "",
//     message: "",
//   });
//   const [toast, setToast] = useState({
//     show: false,
//     type: "",
//     message: "",
//   });

//   // Delete confirmation modal state
//   const [deleteModal, setDeleteModal] = useState({
//     isOpen: false,
//     itemId: null,
//     itemMessage: "",
//   });
//   const [notifications, setNotifications] = useState([]);
//   const [editingId, setEditingId] = useState(null);

//   // Data for dropdowns
//   const [roles, setRoles] = useState([]);
//   const [entities, setEntities] = useState([]);

//   const categories = [
//     { id: "info", name: "Information" },
//     { id: "urgent", name: "Urgent" },
//     { id: "deadline", name: "Deadline" },
//   ];

//   useEffect(() => {
//     // Fetch roles and entities when component mounts
//     const fetchData = async () => {
//       try {
//         const [rolesResponse, entitiesResponse] = await Promise.all([
//           apiClient.get("/roles/"),
//           apiClient.get("/entity_count/"),
//         ]);

//         setRoles(rolesResponse.data);
//         setEntities(entitiesResponse.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//     fetchNotifications();
//   }, []);

//   const showToast = (type, message) => {
//     setToast({
//       show: true,
//       type,
//       message,
//     });

//     // Auto-hide toast after 3 seconds
//     setTimeout(() => {
//       closeToast();
//     }, 3000);
//   };

//   // Close toast notification
//   const closeToast = () => {
//     setToast({
//       show: false,
//       type: "",
//       message: "",
//     });
//   };

//   // Fetch notifications for the table
//   const fetchNotifications = async () => {
//     try {
//       const response = await apiClient.get("get-all-push-notifications/");
//       setNotifications(response.data?.data);
//       console.log(response, "RRRRRRRRRRRRRRRRRRRRRRRRRR")
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       showToast("error", "Failed to fetch notifications. Please try again.");
//     }
//   };
//   const openDeleteModal = (item) => {
//     setDeleteModal({
//       isOpen: true,
//       itemId: item.id,
//       itemMessage: item.message,
//     });
//   };

//   // Close delete confirmation modal
//   const closeDeleteModal = () => {
//     setDeleteModal({
//       isOpen: false,
//       itemId: null,
//       itemMessage: "",
//     });
//   };

//   // Handle delete confirmation
//   const confirmDelete = async () => {
//     try {
//       await apiClient.delete(
//         `push-notifications/${deleteModal.itemId}/delete/`
//       );

//       // Show success toast
//       showToast("success", "Notification deleted successfully!");

//       // Close the modal
//       closeDeleteModal();

//       // Refresh the data immediately
//       fetchNotifications();
//     } catch (error) {
//       console.error("Error deleting notification:", error);
//       showToast("error", "Failed to delete notification. Please try again.");

//       // Close the modal
//       closeDeleteModal();
//     }
//   };
//   // Get today's date in YYYY-MM-DD format for min attribute
//   const today = new Date().toISOString().split("T")[0];

//   // Validate dates when they change
//   useEffect(() => {
//     const newErrors = { startDate: "", endDate: "" };

//     // Validate start date
//     if (startDate) {
//       const startDateObj = new Date(startDate);
//       const todayObj = new Date(today);

//       // Reset time part for accurate date comparison
//       startDateObj.setHours(0, 0, 0, 0);
//       todayObj.setHours(0, 0, 0, 0);

//       if (startDateObj < todayObj) {
//         newErrors.startDate = "Start date cannot be before today";
//       }
//     }

//     // Validate end date
//     if (endDate && startDate) {
//       const startDateObj = new Date(startDate);
//       const endDateObj = new Date(endDate);

//       // Reset time part for accurate date comparison
//       startDateObj.setHours(0, 0, 0, 0);
//       endDateObj.setHours(0, 0, 0, 0);

//       if (endDateObj < startDateObj) {
//         newErrors.endDate = "End date cannot be before start date";
//       }
//     }

//     setDateErrors(newErrors);
//   }, [startDate, endDate, today]);

//   const handleStartDateChange = (e) => {
//     setStartDate(e.target.value);

//     // If end date exists and is now invalid, update end date
//     if (endDate && new Date(endDate) < new Date(e.target.value)) {
//       setEndDate(e.target.value);
//     }
//   };

//   const resetForm = () => {
//     setMessage("");
//     setSelectedRoles([]);
//     setSelectedEntities([]);
//     setSelectedCategories([]);
//     setStartDate("");
//     setEndDate("");
//     setEditingId(null);
//   };

//   const handleSendNotification = async (e) => {
//     e.preventDefault();

//     if (!message.trim()) {
//       setNotification({
//         show: true,
//         type: "error",
//         message: "Please enter a message",
//       });
//       return;
//     }

//     if (selectedRoles.length === 0) {
//       setNotification({
//         show: true,
//         type: "error",
//         message: "Please select at least one role",
//       });
//       return;
//     }

//     if (selectedEntities.length === 0) {
//       setNotification({
//         show: true,
//         type: "error",
//         message: "Please select at least one entity",
//       });
//       return;
//     }

//     if (selectedCategories.length === 0) {
//       setNotification({
//         show: true,
//         type: "error",
//         message: "Please select at least one category",
//       });
//       return;
//     }

//     if (!startDate) {
//       setNotification({
//         show: true,
//         type: "error",
//         message: "Please select a start date",
//       });
//       return;
//     }

//     if (!endDate) {
//       setNotification({
//         show: true,
//         type: "error",
//         message: "Please select an end date",
//       });
//       return;
//     }

//     // Check for date validation errors
//     if (dateErrors.startDate || dateErrors.endDate) {
//       setNotification({
//         show: true,
//         type: "error",
//         message: dateErrors.startDate || dateErrors.endDate,
//       });
//       return;
//     }

//     try {
//       setIsLoading(true);

//       const payload = {
//         message: message,
//         roles: selectedRoles.map((role) => role.role_id),
//         entity: selectedEntities.map((entity) => entity.entity_id),
//         category: selectedCategories.map((category) => category.id).join(","),
//         start_date: startDate,
//         end_date: endDate,
//       };

//       let response;

//       if (editingId) {
//         // Update existing notification
//         response = await apiClient.put(`/edit/${editingId}`, payload);
//       } else {
//         // Create new notification
//         response = await apiClient.post("/notifications/create/", payload);
//       }

//       if (response.status === 201 || response.status === 200) {
//         showToast(
//           "success",
//           editingId
//             ? "Notification updated successfully!"
//             : "Notification sent successfully!"
//         );

//         // Reset form after successful submission
//         resetForm();

//         // Refresh notifications list
//         fetchNotifications();

//         // Hide success message after 3 seconds
//         setTimeout(() => {
//           setNotification({ show: false, type: "", message: "" });
//         }, 3000);
//       }
//     } catch (error) {
//       console.error("Error sending notification:", error);
//       setNotification({
//         show: true,
//         type: "error",
//         message: "Failed to send notification. Please try again.",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString();
//   };

//   return (
//     <div className={styles.dashboardContainer}>

//       <Toast
//         show={toast.show}
//         type={toast.type}
//         message={toast.message}
//         onClose={closeToast}
//       />

//       {/* Confirmation Modal */}
//       <PushConfirmModal
//         isOpen={deleteModal.isOpen}
//         onClose={closeDeleteModal}
//         onConfirm={confirmDelete}
//         title="Confirm Deletion"
//         message={`Are you sure you want to delete this notification: "${deleteModal.itemMessage}"? This action cannot be undone.`}
//       />

//       {/* Main Content */}
//       <div className={styles.mainContent}>
//         <div className={styles.splitLayout}>
//           {/* Form Section - Left Side */}
//           <div className={styles.formSection}>
//             <div className={styles.notificationHeader}>
//               <h2>{editingId ? "Edit Notification" : "Push Notification"}</h2>
//               <p>
//                 {editingId
//                   ? "Update notification details"
//                   : "Send notifications to users based on roles, entities, and categories"}
//               </p>
//             </div>

//             <div className={styles.notificationForm}>
//               <div className={styles.formGroup}>
//                 <label>Select Roles</label>
//                 <MultiSelect
//                   options={roles}
//                   selectedValues={selectedRoles}
//                   onChange={setSelectedRoles}
//                   displayProperty="role_name"
//                   placeholder="Select roles..."
//                 />
//               </div>

//               <div className={styles.formGroup}>
//                 <label>Select Entities</label>
//                 <MultiSelect
//                   className={styles.selectedValuesData}
//                   options={entities}
//                   selectedValues={selectedEntities}
//                   onChange={setSelectedEntities}
//                   displayProperty="entity_name"
//                   placeholder="Select entities..."
//                 />
//               </div>

//               <div className={styles.formGroup}>
//                 <label>Select Categories</label>
//                 <MultiSelect
//                   options={categories}
//                   selectedValues={selectedCategories}
//                   onChange={setSelectedCategories}
//                   displayProperty="name"
//                   placeholder="Select categories..."
//                   showSelectAll={false}
//                 />
//               </div>

//               <div className={styles.formGroup}>
//                 <label>Message</label>
//                 <RichTextEditor
//                   value={message}
//                   onChange={setMessage}
//                   placeholder="Enter your notification message..."
//                 />
//               </div>

//               <div className={styles.dateContainer}>
//                 <div className={styles.formGroup}>
//                   <label>Start Date</label>
//                   <div className={styles.dateInputContainer}>
//                     <input
//                       type="date"
//                       value={startDate}
//                       onChange={handleStartDateChange}
//                       min={today}
//                       className={`${styles.dateInput} ${
//                         dateErrors.startDate ? styles.inputError : ""
//                       }`}
//                     />
//                     {dateErrors.startDate && (
//                       <div className={styles.errorMessage}>
//                         {dateErrors.startDate}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className={styles.formGroup}>
//                   <label>End Date</label>
//                   <div className={styles.dateInputContainer}>
//                     <input
//                       type="date"
//                       value={endDate}
//                       onChange={(e) => setEndDate(e.target.value)}
//                       min={startDate || today}
//                       className={`${styles.dateInput} ${
//                         dateErrors.endDate ? styles.inputError : ""
//                       }`}
//                       disabled={!startDate}
//                     />
//                     {dateErrors.endDate && (
//                       <div className={styles.errorMessage}>
//                         {dateErrors.endDate}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className={styles.formActions}>
//                 {editingId && (
//                   <button
//                     onClick={resetForm}
//                     className={styles.cancelButton}
//                     type="button"
//                   >
//                     Cancel
//                   </button>
//                 )}
//                 <button
//                   onClick={handleSendNotification}
//                   className={styles.sendButton}
//                   disabled={
//                     isLoading || dateErrors.startDate || dateErrors.endDate
//                   }
//                 >
//                   {isLoading ? (
//                     <>
//                       <span className={styles.loadingSpinner}></span>
//                       <span>Sending...</span>
//                     </>
//                   ) : editingId ? (
//                     "Update Notification"
//                   ) : (
//                     "Send Notification"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Image Section - Right Side */}
//           <div className={styles.imageSection}>
//             <div className={styles.imageContainer}>
//               <img src={notificationImage || "/placeholder.svg"} alt="Notification illustration" />
//               <div className={styles.imageOverlay}>
//                 <h3>Keep Your Users Informed</h3>
//                 <p>
//                   Create targeted notifications with rich text formatting to effectively communicate with your audience.
//                 </p>
//                 <div className={styles.featureList}>
//                   <div className={styles.featureItem}>
//                     <Bell size={18} />
//                     <span>Real-time delivery</span>
//                   </div>
//                   <div className={styles.featureItem}>
//                     <AlertCircle size={18} />
//                     <span>Priority settings</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Notifications Table */}
//         <div className={styles.notificationSection}>
//           <div className={styles.notificationHeader}>
//             <h2>Notification History</h2>
//             <p>View and manage previously sent notifications</p>
//           </div>

//           <div className={tableStyles.tableContainer}>
//             {notifications.length > 0 ? (
//               <table className={tableStyles.dataTable}>
//                 <thead>
//                   <tr>
//                     <th>Message</th>
//                     <th>Categories</th>
//                     <th>Start Date</th>
//                     <th>End Date</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {console.log("Notifications:", notifications)}
//                   {notifications.map((item) => (
//                     <tr key={item.id}>
//                       <td className={tableStyles.messageCell}>
//                         <div dangerouslySetInnerHTML={{ __html: item.message }} />
//                       </td>

//                       <td>
//                         {item.category?.split(",").map((cat, index) => (
//                           <span key={index} className={styles.categoryBadge}>
//                             {cat.trim()}
//                           </span>
//                         ))}
//                       </td>

//                       <td>
//                         {item.start_date ? formatDate(item.start_date) : "—"}
//                       </td>
//                       <td>
//                         {item.end_date ? formatDate(item.end_date) : "—"}
//                       </td>

//                       <td className={tableStyles.actionCell}>

//                         <button
//                           className={tableStyles.deleteButton}
//                           onClick={() => openDeleteModal(item)}
//                         >
//                           <Trash2 size={14} /> Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <div className={tableStyles.noData}>
//                 <div className={tableStyles.noDataIcon}>
//                   <AlertCircle size={36} />
//                 </div>
//                 No notifications found. Create your first notification above.
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PushNotification;
"use client";

import { useState, useEffect, useRef } from "react";
import { Trash2, AlertCircle, Bell } from "lucide-react";
import styles from "./PushNotification.module.css";
import apiClient from "../../config/apiClient";
import Toast from "./Toast";
import PushConfirmModal from "./PushConfirmModal";
import RichTextEditor from "./RichTextEditor";
import notificationImage from "../../assets/images/Background.jpg";

// MultiSelect component defined within the same file
const MultiSelect = ({
  options,
  selectedValues,
  onChange,
  displayProperty,
  placeholder,
  showSelectAll = true,
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

  // Get display names of selected values
  const getSelectedNames = () => {
    return selectedValues
      .map((item) => (displayProperty ? item[displayProperty] : item))
      .join(", ");
  };

  return (
    <div className={styles.multiSelectContainer} ref={dropdownRef}>
      <div className={styles.multiSelectHeader} onClick={toggleDropdown}>
        {selectedValues.length > 0 ? (
          <div className={styles.selectedItems}>
            <span className={styles.selectedNames}>{getSelectedNames()}</span>
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
          {showSelectAll && (
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
          )}

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

// Main PushNotification component
const PushNotification = () => {
  // State for notification form
  const [message, setMessage] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedEntities, setSelectedEntities] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateErrors, setDateErrors] = useState({
    startDate: "",
    endDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
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

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
    itemMessage: "",
  });
  const [notifications, setNotifications] = useState([]);
  const [editingId, setEditingId] = useState(null);

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
    fetchNotifications();
  }, []);

  const showToast = (type, message) => {
    setToast({
      show: true,
      type,
      message,
    });

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      closeToast();
    }, 3000);
  };

  // Close toast notification
  const closeToast = () => {
    setToast({
      show: false,
      type: "",
      message: "",
    });
  };

  // Fetch notifications for the table
  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get("get-all-push-notifications/");
      setNotifications(response.data?.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      showToast("error", "Failed to fetch notifications. Please try again.");
    }
  };

  const openDeleteModal = (item) => {
    setDeleteModal({
      isOpen: true,
      itemId: item.id,
      itemMessage: item.message,
    });
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      itemId: null,
      itemMessage: "",
    });
  };

  // Handle delete confirmation
  const confirmDelete = async () => {
    try {
      await apiClient.delete(
        `push-notifications/${deleteModal.itemId}/delete/`
      );

      // Show success toast
      showToast("success", "Notification deleted successfully!");

      // Close the modal
      closeDeleteModal();

      // Refresh the data immediately
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
      showToast("error", "Failed to delete notification. Please try again.");

      // Close the modal
      closeDeleteModal();
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  // Validate dates when they change
  useEffect(() => {
    const newErrors = { startDate: "", endDate: "" };

    // Validate start date
    if (startDate) {
      const startDateObj = new Date(startDate);
      const todayObj = new Date(today);

      // Reset time part for accurate date comparison
      startDateObj.setHours(0, 0, 0, 0);
      todayObj.setHours(0, 0, 0, 0);

      if (startDateObj < todayObj) {
        newErrors.startDate = "Start date cannot be before today";
      }
    }

    // Validate end date
    if (endDate && startDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      // Reset time part for accurate date comparison
      startDateObj.setHours(0, 0, 0, 0);
      endDateObj.setHours(0, 0, 0, 0);

      if (endDateObj < startDateObj) {
        newErrors.endDate = "End date cannot be before start date";
      }
    }

    setDateErrors(newErrors);
  }, [startDate, endDate, today]);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);

    // If end date exists and is now invalid, update end date
    if (endDate && new Date(endDate) < new Date(e.target.value)) {
      setEndDate(e.target.value);
    }
  };

  const resetForm = () => {
    setMessage("");
    setSelectedRoles([]);
    setSelectedEntities([]);
    setSelectedCategories([]);
    setStartDate("");
    setEndDate("");
    setEditingId(null);
  };

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

    if (!startDate) {
      setNotification({
        show: true,
        type: "error",
        message: "Please select a start date",
      });
      return;
    }

    if (!endDate) {
      setNotification({
        show: true,
        type: "error",
        message: "Please select an end date",
      });
      return;
    }

    // Check for date validation errors
    if (dateErrors.startDate || dateErrors.endDate) {
      setNotification({
        show: true,
        type: "error",
        message: dateErrors.startDate || dateErrors.endDate,
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
        start_date: startDate,
        end_date: endDate,
      };

      let response;

      if (editingId) {
        // Update existing notification
        response = await apiClient.put(`/edit/${editingId}`, payload);
      } else {
        // Create new notification
        response = await apiClient.post("/notifications/create/", payload);
      }

      if (response.status === 201 || response.status === 200) {
        showToast(
          "success",
          editingId
            ? "Notification updated successfully!"
            : "Notification sent successfully!"
        );

        // Reset form after successful submission
        resetForm();

        // Refresh notifications list
        fetchNotifications();

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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className={styles.dashboardContainer}>
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={closeToast}
      />

      {/* Confirmation Modal */}
      <PushConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this notification: "${deleteModal.itemMessage}"? This action cannot be undone.`}
      />

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.splitLayout}>
          {/* Form Section - Left Side */}
          <div className={styles.formSection}>
            <div className={styles.notificationHeader}>
              <h2>{editingId ? "Edit Notification" : "Push Notification"}</h2>
              <p>
                {editingId
                  ? "Update notification details"
                  : "Send notifications to users based on roles, entities, and categories"}
              </p>
            </div>

            <div className={styles.notificationForm}>
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

              <div className={styles.formGroup}>
                <label>Select Categories</label>
                <MultiSelect
                  options={categories}
                  selectedValues={selectedCategories}
                  onChange={setSelectedCategories}
                  displayProperty="name"
                  placeholder="Select categories..."
                  showSelectAll={false}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Message</label>
                <RichTextEditor
                  value={message}
                  onChange={setMessage}
                  placeholder="Enter your notification message..."
                />
              </div>

              <div className={styles.dateContainer}>
                <div className={styles.formGroup}>
                  <label>Start Date</label>
                  <div className={styles.dateInputContainer}>
                    <input
                      type="date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      min={today}
                      className={`${styles.dateInput} ${
                        dateErrors.startDate ? styles.inputError : ""
                      }`}
                    />
                    {dateErrors.startDate && (
                      <div className={styles.errorMessage}>
                        {dateErrors.startDate}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>End Date</label>
                  <div className={styles.dateInputContainer}>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || today}
                      className={`${styles.dateInput} ${
                        dateErrors.endDate ? styles.inputError : ""
                      }`}
                      disabled={!startDate}
                    />
                    {dateErrors.endDate && (
                      <div className={styles.errorMessage}>
                        {dateErrors.endDate}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                {editingId && (
                  <button
                    onClick={resetForm}
                    className={styles.cancelButton}
                    type="button"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSendNotification}
                  className={styles.sendButton}
                  disabled={
                    isLoading || dateErrors.startDate || dateErrors.endDate
                  }
                >
                  {isLoading ? (
                    <>
                      <span className={styles.loadingSpinner}></span>
                      <span>Sending...</span>
                    </>
                  ) : editingId ? (
                    "Update Notification"
                  ) : (
                    "Send Notification"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Image Section - Right Side */}
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <img
                src={notificationImage || "/placeholder.svg"}
                alt="Notification illustration"
              />
              <div className={styles.imageOverlay}>
                <h3>Keep Your Users Informed</h3>
                <p>
                  Create targeted notifications with rich text formatting to
                  effectively communicate with your audience.
                </p>
                <div className={styles.featureList}>
                  <div className={styles.featureItem}>
                    <Bell size={18} />
                    <span>Real-time delivery</span>
                  </div>
                  <div className={styles.featureItem}>
                    <AlertCircle size={18} />
                    <span>Priority settings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Table */}
        <div className={styles.notificationSection}>
          <div className={styles.notificationHeader}>
            <h2>Notification History</h2>
            <p>View and manage previously sent notifications</p>
          </div>

          <div className={styles.tableContainer}>
            {notifications.length > 0 ? (
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Message</th>
                    <th>Categories</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((item) => (
                    <tr key={item.id}>
                      <td className={styles.messageCell}>
                        <div
                          dangerouslySetInnerHTML={{ __html: item.message }}
                        />
                      </td>

                      <td>
                        {item.category?.split(",").map((cat, index) => (
                          <span key={index} className={styles.categoryBadge}>
                            {cat.trim()}
                          </span>
                        ))}
                      </td>

                      <td>
                        {item.start_date ? formatDate(item.start_date) : "—"}
                      </td>
                      <td>{item.end_date ? formatDate(item.end_date) : "—"}</td>

                      <td className={styles.actionCell}>
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
                No notifications found. Create your first notification above.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PushNotification;
