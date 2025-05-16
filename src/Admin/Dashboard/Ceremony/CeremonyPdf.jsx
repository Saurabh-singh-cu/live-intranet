// "use client";

// import React, { useEffect, useState } from "react";

// import styles from "./CeremonyPdf.module.css";
// import PdfViewer from "./PdfViewer";
// import RatingModal from "./RatingModal";
// import apiClient from "../../../config/apiClient";
// import { FiAlertCircle, FiCheck, FiX, FiEye } from "react-icons/fi";
// import { FaLinkedin, FaInstagram } from "react-icons/fa";

// const Notification = ({ type, message, description, onClose }) => {
//   const getIcon = () => {
//     switch (type) {
//       case "success":
//         return <FiCheck />;
//       case "error":
//         return <FiAlertCircle />;
//       default:
//         return <FiAlertCircle />;
//     }
//   };

//   return (
//     <div className={`${styles.notification} ${styles[`notification-${type}`]}`}>
//       <div className={styles.notificationIcon}>{getIcon()}</div>
//       <div className={styles.notificationContent}>
//         <h4 className={styles.notificationTitle}>{message}</h4>
//         <p className={styles.notificationDescription}>{description}</p>
//       </div>
//       <button className={styles.notificationClose} onClick={onClose}>
//         <FiX />
//       </button>
//     </div>
//   );
// };

// const CeremonyPdf = () => {
//   const [eventsData, setEventsData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedPdf, setSelectedPdf] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterCluster, setFilterCluster] = useState("");
//   const [filterEntity, setFilterEntity] = useState("");
//   const [pdfFilter, setPdfFilter] = useState("all"); // all | uploaded | not_uploaded
//   const [showRatingModal, setShowRatingModal] = useState(false);
//   const [selectedEntity, setSelectedEntity] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [ratedEntities, setRatedEntities] = useState([]);
//   const [entityRatings, setEntityRatings] = useState([]);
//   const [isLoadingRatings, setIsLoadingRatings] = useState(false);
//   const [activeTab, setActiveTab] = useState("giveMarks"); // giveMarks | seeMarks
//   const [editingEntity, setEditingEntity] = useState(null);

//   const [sortConfig, setSortConfig] = useState({
//     key: "created_at",
//     direction: "desc",
//   });

//   useEffect(() => {
//     fetchCeremonyEvents();
//     // If the active tab is "seeMarks", fetch the ratings data
//     if (activeTab === "seeMarks") {
//       fetchEntityRatings();
//     }
//   }, [activeTab]);

//   const openNotification = (type, message, description) => {
//     const id = Date.now();
//     setNotifications((prev) => [...prev, { id, type, message, description }]);

//     // Auto remove after 4 seconds
//     setTimeout(() => {
//       removeNotification(id);
//     }, 4000);
//   };

//   const removeNotification = (id) => {
//     setNotifications((prev) =>
//       prev.filter((notification) => notification.id !== id)
//     );
//   };

//   const fetchCeremonyEvents = async () => {
//     try {
//       setIsLoading(true);
//       const response = await apiClient.get("/ceremony_events_with_pdf");
//       setEventsData(response.data);
//       setError("");
//     } catch (error) {
//       console.error("Error fetching ceremony events:", error);
//       setError("Failed to load ceremony events data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchEntityRatings = async () => {
//     try {
//       setIsLoadingRatings(true);
//       const response = await apiClient.get("/get-all-entity-ratings/");
//       setEntityRatings(response.data);
//     } catch (error) {
//       console.error("Error fetching entity ratings:", error);
//       openNotification(
//         "error",
//         "Failed to load entity ratings",
//         "Please try again later."
//       );
//     } finally {
//       setIsLoadingRatings(false);
//     }
//   };

//   const handlePdfView = (pdfUrl, eventName) => {
//     if (pdfUrl === "Not Uploaded") {
//       openNotification(
//         "error",
//         "PDF not available",
//         "PDF has not been uploaded for this event."
//       );
//       return;
//     }

//     // Open PDF in a new browser tab
//     window.open(pdfUrl, "_blank", "noopener,noreferrer");
//   };

//   const closePdfViewer = () => {
//     setSelectedPdf(null);
//   };

//   const handleDownload = (pdfUrl, eventName) => {
//     if (pdfUrl === "Not Uploaded") {
//       openNotification(
//         "error",
//         "PDF not available",
//         "PDF has not been uploaded for this event."
//       );
//       return;
//     }

//     // Create a temporary anchor element to trigger download
//     const link = document.createElement("a");
//     link.href = pdfUrl;
//     link.download = `${eventName.replace(/\s+/g, "_")}.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   const getUniqueValues = (key) => {
//     return [...new Set(eventsData.map((item) => item[key]))].filter(Boolean);
//   };

//   // Check if an entity has been rated
//   const isEntityRated = (entityName) => {
//     return ratedEntities.includes(entityName);
//   };

//   const sortedData = React.useMemo(() => {
//     const sortableItems = [...eventsData];

//     // First sort by rated status (rated entities first)
//     sortableItems.sort((a, b) => {
//       const aRated = isEntityRated(a.entity_names);
//       const bRated = isEntityRated(b.entity_names);

//       if (aRated && !bRated) return -1;
//       if (!aRated && bRated) return 1;

//       // Then apply the user's sort configuration
//       if (sortConfig.key) {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === "asc" ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === "asc" ? 1 : -1;
//         }
//       }
//       return 0;
//     });

//     return sortableItems;
//   }, [eventsData, sortConfig, ratedEntities]);

//   const filteredData = React.useMemo(() => {
//     return sortedData.filter((item) => {
//       const matchesSearch = Object.values(item).some(
//         (value) =>
//           value &&
//           value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//       );

//       const matchesCluster = !filterCluster || item.clusters === filterCluster;
//       const matchesEntity = !filterEntity || item.entity_names === filterEntity;
//       const matchesPdfFilter =
//         pdfFilter === "all" ||
//         (pdfFilter === "uploaded" && item.pdf_url !== "Not Uploaded") ||
//         (pdfFilter === "not_uploaded" && item.pdf_url === "Not Uploaded");

//       return (
//         matchesSearch && matchesCluster && matchesEntity && matchesPdfFilter
//       );
//     });
//   }, [sortedData, searchTerm, filterCluster, filterEntity, pdfFilter]);

//   // Group events by entity to handle entity-based operations
//   const entitiesWithPdf = React.useMemo(() => {
//     const entities = {};

//     filteredData.forEach((event) => {
//       const entityName = event.entity_names;
//       if (!entities[entityName]) {
//         entities[entityName] = {
//           name: entityName,
//           hasPdf: event.pdf_url !== "Not Uploaded",
//           events: [],
//         };
//       }

//       // If any event has a PDF, mark the entity as having a PDF
//       if (event.pdf_url !== "Not Uploaded") {
//         entities[entityName].hasPdf = true;
//       }

//       entities[entityName].events.push(event);
//     });

//     return Object.values(entities);
//   }, [filteredData]);

//   const handleOpenRatingModal = (entity) => {
//     setSelectedEntity(entity);
//     setShowRatingModal(true);
//   };

//   const handleCloseRatingModal = () => {
//     setShowRatingModal(false);
//     setSelectedEntity(null);
//   };

//   const handleSubmitRatings = (ratings) => {
//     // Create payload with entity name and ratings
//     const payload = {
//       entity_name: selectedEntity.name,
//       ratings: ratings,
//     };

//     console.log("Submitting ratings:", payload);
//     console.log("Submitting ratings:", JSON.stringify(payload, null, 2));

//     apiClient
//       .post("/submit-entity-rating/", payload)
//       .then((response) => {
//         console.log("Ratings submitted successfully", response);
//         openNotification(
//           "success",
//           "Ratings submitted successfully",
//           "Your ratings have been saved."
//         );
//         // Refresh the ratings data if we're on the See Marks tab
//         if (activeTab === "seeMarks") {
//           fetchEntityRatings();
//         }
//       })
//       .catch((error) => {
//         console.error("Error submitting ratings", error);
//         openNotification(
//           "error",
//           "Error submitting ratings",
//           error.response?.data?.message ||
//             `Error ${
//               error.response?.status || "unknown"
//             }: Something went wrong!`
//         );
//       });

//     // Add the entity to the rated entities list
//     setRatedEntities((prev) => {
//       if (!prev.includes(selectedEntity.name)) {
//         return [...prev, selectedEntity.name];
//       }
//       return prev;
//     });

//     handleCloseRatingModal();
//   };

//   const handleEditRatings = (entity) => {
//     // Find the entity in the entitiesWithPdf list
//     const entityToEdit = entitiesWithPdf.find(
//       (e) => e.name === entity.entity_name
//     );
//     if (entityToEdit) {
//       setSelectedEntity(entityToEdit);
//       setShowRatingModal(true);
//     } else {
//       openNotification(
//         "error",
//         "Cannot edit ratings",
//         "Entity information not found."
//       );
//     }
//   };

//   const getSortIndicator = (key) => {
//     if (sortConfig.key === key) {
//       return sortConfig.direction === "asc" ? " ▲" : " ▼";
//     }
//     return "";
//   };

//   // Calculate total marks for an entity
//   const calculateTotalMarks = (ratingsData) => {
//     return ratingsData.reduce((total, item) => total + item.rating, 0);
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString();
//   };

//   if (isLoading && activeTab === "giveMarks") {
//     return (
//       <div className={styles.loading}>Loading ceremony events data...</div>
//     );
//   }

//   if (error && activeTab === "giveMarks") {
//     return <div className={styles.error}>{error}</div>;
//   }

//   const totalCount = filteredData.length;
//   const uploadedCount = filteredData.filter(
//     (event) => event.pdf_url !== "Not Uploaded"
//   ).length;
//   const notUploadedCount = totalCount - uploadedCount;

//   // Count unique rated entities
//   const uniqueRatedEntities = new Set();
//   filteredData.forEach((event) => {
//     if (isEntityRated(event.entity_names)) {
//       uniqueRatedEntities.add(event.entity_names);
//     }
//   });
//   const ratedCount = uniqueRatedEntities.size;

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Ceremony Events PDF Management</h1>

//       {/* Enhanced Notifications Container */}
//       <div className={styles.notificationsContainer}>
//         {notifications.map((notification) => (
//           <Notification
//             key={notification.id}
//             type={notification.type}
//             message={notification.message}
//             description={notification.description}
//             onClose={() => removeNotification(notification.id)}
//           />
//         ))}
//       </div>

//       {/* Tab Navigation */}
//       <div className={styles.tabsContainer}>
//         <button
//           className={`${styles.tabButton} ${
//             activeTab === "giveMarks" ? styles.activeTab : ""
//           }`}
//           onClick={() => setActiveTab("giveMarks")}
//         >
//           Give Marks
//         </button>
//         <button
//           className={`${styles.tabButton} ${
//             activeTab === "seeMarks" ? styles.activeTab : ""
//           }`}
//           onClick={() => setActiveTab("seeMarks")}
//         >
//           See Marks
//         </button>
//       </div>

//       {activeTab === "giveMarks" && (
//         <>
//           <div className={styles.controls}>
//             <div className={styles.search}>
//               <input
//                 type="text"
//                 placeholder="Search events..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className={styles.searchInput}
//               />
//             </div>

//             <div className={styles.filters}>
//               <div className={styles.filterGroup}>
//                 <label>Cluster:</label>
//                 <select
//                   value={filterCluster}
//                   onChange={(e) => setFilterCluster(e.target.value)}
//                   className={styles.filterSelect}
//                 >
//                   <option value="">All Clusters</option>
//                   {getUniqueValues("clusters").map((cluster) => (
//                     <option key={cluster} value={cluster}>
//                       {cluster}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className={styles.filterGroup}>
//                 <label>Entity:</label>
//                 <select
//                   value={filterEntity}
//                   onChange={(e) => setFilterEntity(e.target.value)}
//                   className={styles.filterSelect}
//                 >
//                   <option value="">All Entities</option>
//                   {getUniqueValues("entity_names").map((entity) => (
//                     <option key={entity} value={entity}>
//                       {entity}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className={styles.countSummary}>
//             <button
//               onClick={() => setPdfFilter("all")}
//               className={pdfFilter === "all" ? styles.activeFilter : ""}
//             >
//               Total Events: <strong>{totalCount}</strong>
//             </button>
//             <button
//               onClick={() => setPdfFilter("uploaded")}
//               className={pdfFilter === "uploaded" ? styles.activeFilter : ""}
//             >
//               Uploaded PDFs: <strong>{uploadedCount}</strong>
//             </button>
//             <button
//               onClick={() => setPdfFilter("not_uploaded")}
//               className={
//                 pdfFilter === "not_uploaded" ? styles.activeFilter : ""
//               }
//             >
//               Not Uploaded PDFs: <strong>{notUploadedCount}</strong>
//             </button>
//             <button className={ratedCount > 0 ? styles.ratedFilter : ""}>
//               Rated Entities: <strong>{ratedCount > 0 ? ratedCount : 0}</strong>
//             </button>
//           </div>

//           <div className={styles.tableContainer}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th onClick={() => handleSort("rec_cer_id")}>
//                     S.No. {getSortIndicator("index")}
//                   </th>
//                   <th onClick={() => handleSort("clusters")}>
//                     Cluster {getSortIndicator("clusters")}
//                   </th>
//                   <th onClick={() => handleSort("departments")}>
//                     Department {getSortIndicator("departments")}
//                   </th>
//                   <th onClick={() => handleSort("entity_names")}>
//                     Entity {getSortIndicator("entity_names")}
//                   </th>
//                   <th onClick={() => handleSort("level_of_activitys")}>
//                     Level of Activity {getSortIndicator("level_of_activitys")}
//                   </th>
//                   <th>LinkedIn </th>
//                   <th>Instagram </th>
//                   <th onClick={() => handleSort("activity_event_names")}>
//                     Event Name {getSortIndicator("activity_event_names")}
//                   </th>
//                   <th>PDF Actions</th>
//                   <th>Rating</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.length > 0 ? (
//                   filteredData.map((event, index) => (
//                     <tr
//                       key={event.rec_cer_id}
//                       className={
//                         isEntityRated(event.entity_names) ? styles.ratedRow : ""
//                       }
//                     >
//                       <td>{index + 1}</td>
//                       <td>{event.clusters}</td>
//                       <td>{event.departments}</td>
//                       <td>{event.entity_names}</td>
//                       <td>{event.level_of_activitys}</td>
//                       <td>
//                         {/* {event.linkedin_url && (
//                           <a
//                             href={event.linkedin_url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className={styles.socialIcon}
//                             title="Open LinkedIn"
//                           >
//                             <FaLinkedin size={20} color="#0077b5" />
//                           </a>
//                         )} */}
//                         {event?.linkedin_url ? <> <a
//                             href={event.linkedin_url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className={styles.socialIcon}
//                             title="Open LinkedIn"
//                           >
//                             <FaLinkedin size={20} color="#0077b5" />
//                           </a></> : "N/A"}
//                       </td>
//                       <td>
//                         {event.instagram_url ? (
//                           <a
//                             href={event.instagram_url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className={styles.socialIcon}
//                             title="Open Instagram"
//                           >
//                             <FaInstagram size={20} color="#e1306c" />
//                           </a>
//                         ) : "N/A"}
//                       </td>
//                       <td>{event.activity_event_names}</td>
//                       <td>
//                         <div className={styles.actions}>
//                           <button
//                             className={`${styles.actionButton} ${
//                               styles.viewButton
//                             } ${
//                               event.pdf_url === "Not Uploaded"
//                                 ? styles.disabled
//                                 : ""
//                             }`}
//                             onClick={() =>
//                               handlePdfView(
//                                 event.pdf_url,
//                                 event.activity_event_names
//                               )
//                             }
//                             disabled={event.pdf_url === "Not Uploaded"}
//                           >
//                             View
//                           </button>
//                           <button
//                             className={`${styles.actionButton} ${
//                               styles.downloadButton
//                             } ${
//                               event.pdf_url === "Not Uploaded"
//                                 ? styles.disabled
//                                 : ""
//                             }`}
//                             onClick={() =>
//                               handleDownload(
//                                 event.pdf_url,
//                                 event.activity_event_names
//                               )
//                             }
//                             disabled={event.pdf_url === "Not Uploaded"}
//                           >
//                             Download
//                           </button>
//                           <span className={styles.pdfStatus}>
//                             {event.pdf_url === "Not Uploaded" ? (
//                               <span className={styles.notUploaded}>
//                                 Not Uploaded
//                               </span>
//                             ) : (
//                               <span className={styles.uploaded}>Uploaded</span>
//                             )}
//                           </span>
//                         </div>
//                       </td>
//                       <td>
//                         {event.pdf_url !== "Not Uploaded" &&
//                           (isEntityRated(event.entity_names) ? (
//                             <div className={styles.marksSubmitted}>
//                               <span className={styles.checkmark}>✓</span> Marks
//                               Submitted
//                             </div>
//                           ) : (
//                             <button
//                               className={`${styles.actionButton} ${styles.rateButton}`}
//                               onClick={() => {
//                                 const entity = entitiesWithPdf.find(
//                                   (e) => e.name === event.entity_names
//                                 );
//                                 if (entity) {
//                                   handleOpenRatingModal(entity);
//                                 }
//                               }}
//                             >
//                               Send Marks
//                             </button>
//                           ))}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className={styles.noData}>
//                       No events found matching your criteria
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}

//       {activeTab === "seeMarks" && (
//         <div className={styles.ratingsContainer}>
//           {isLoadingRatings ? (
//             <div className={styles.loading}>Loading entity ratings data...</div>
//           ) : entityRatings.length > 0 ? (
//             <>
//               <div className={styles.ratingsHeader}>
//                 <h2>Entity Ratings</h2>
//                 <button
//                   className={styles.refreshButton}
//                   onClick={fetchEntityRatings}
//                 >
//                   Refresh Data
//                 </button>
//               </div>

//               <div className={styles.compactTableContainer}>
//                 <table className={styles.compactRatingsTable}>
//                   <thead>
//                     <tr>
//                       <th className={styles.entityNameColumn}>Entity Name</th>
//                       {entityRatings[0].ratings_data.map((rating, index) => (
//                         <th key={index} className={styles.questionColumn}>
//                           {rating.question}
//                         </th>
//                       ))}
//                       <th className={styles.totalColumn}>Total</th>
//                       <th className={styles.actionsColumn}>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {entityRatings.map((entity, entityIndex) => (
//                       <tr key={entityIndex}>
//                         <td className={styles.entityNameCell}>
//                           <div className={styles.entityNameWrapper}>
//                             <span className={styles.entityName}>
//                               {entity.entity_name}
//                             </span>
//                             <span className={styles.submissionTime}>
//                               Submitted: {formatDate(entity.submitted_at)}
//                             </span>
//                           </div>
//                         </td>
//                         {entity.ratings_data.map((rating, ratingIndex) => (
//                           <td key={ratingIndex} className={styles.ratingCell}>
//                             {rating.rating}
//                           </td>
//                         ))}
//                         <td className={styles.totalCell}>
//                           <strong>
//                             {calculateTotalMarks(entity.ratings_data)}
//                           </strong>
//                         </td>
//                         <td className={styles.actionsCell}>
//                           {/* <button className={styles.editButton} onClick={() => handleEditRatings(entity)}>
//                             Edit
//                           </button> */}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           ) : (
//             <div className={styles.noRatings}>
//               <p>
//                 No ratings data available. Rate some entities to see them here.
//               </p>
//               <button
//                 className={styles.switchTabButton}
//                 onClick={() => setActiveTab("giveMarks")}
//               >
//                 Go to Give Marks
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {selectedPdf && (
//         <PdfViewer
//           pdfUrl={selectedPdf.url}
//           eventName={selectedPdf.name}
//           onClose={closePdfViewer}
//         />
//       )}

//       {showRatingModal && selectedEntity && (
//         <RatingModal
//           entity={selectedEntity}
//           onClose={handleCloseRatingModal}
//           onSubmit={handleSubmitRatings}
//         />
//       )}
//     </div>
//   );
// };
// export default CeremonyPdf;
"use client";

import React, { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiCheck,
  FiX,
  FiEye,
  FiFilter,
  FiSearch,
} from "react-icons/fi";
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import styles from "./CeremonyPdf.module.css";
import PdfViewer from "./PdfViewer";
import RatingModal from "./RatingModal";
import apiClient from "../../../config/apiClient";

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

const CeremonyPdf = () => {
  const [eventsData, setEventsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCluster, setFilterCluster] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterEntityType, setFilterEntityType] = useState("");
  const [filterEntityName, setFilterEntityName] = useState("");
  const [filterActivityType, setFilterActivityType] = useState("");
  const [filterLevelOfActivity, setFilterLevelOfActivity] = useState("");
  const [pdfFilter, setPdfFilter] = useState("all"); // all | uploaded | not_uploaded
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [ratedEntities, setRatedEntities] = useState([]);
  const [entityRatings, setEntityRatings] = useState([]);
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);
  const [activeTab, setActiveTab] = useState("giveMarks"); // giveMarks | seeMarks
  const [showFilters, setShowFilters] = useState(false);

  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });

  useEffect(() => {
    fetchCeremonyEvents();
    // If the active tab is "seeMarks", fetch the ratings data
    if (activeTab === "seeMarks") {
      fetchEntityRatings();
    }
  }, [activeTab]);

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

  const fetchCeremonyEvents = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/ceremony_events_with_pdf");
      setEventsData(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching ceremony events:", error);
      setError("Failed to load ceremony events data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEntityRatings = async () => {
    try {
      setIsLoadingRatings(true);
      const response = await apiClient.get("/get-all-entity-ratings/");
      setEntityRatings(response.data);
    } catch (error) {
      console.error("Error fetching entity ratings:", error);
      openNotification(
        "error",
        "Failed to load entity ratings",
        "Please try again later."
      );
    } finally {
      setIsLoadingRatings(false);
    }
  };

  const handlePdfView = (pdfUrl, eventName) => {
    if (pdfUrl === "Not Uploaded") {
      openNotification(
        "error",
        "PDF not available",
        "PDF has not been uploaded for this event."
      );
      return;
    }

    // Open PDF in a new browser tab
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  const closePdfViewer = () => {
    setSelectedPdf(null);
  };

  const handleDownload = (pdfUrl, eventName) => {
    if (pdfUrl === "Not Uploaded") {
      openNotification(
        "error",
        "PDF not available",
        "PDF has not been uploaded for this event."
      );
      return;
    }

    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${eventName.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getUniqueValues = (key) => {
    return [...new Set(eventsData.map((item) => item[key]))].filter(Boolean);
  };

  // Check if an entity has been rated
  const isEntityRated = (entityName) => {
    return ratedEntities.includes(entityName);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterCluster("");
    setFilterDepartment("");
    setFilterEntityType("");
    setFilterEntityName("");
    setFilterActivityType("");
    setFilterLevelOfActivity("");
    setPdfFilter("all");
  };

  const sortedData = React.useMemo(() => {
    const sortableItems = [...eventsData];

    // First sort by rated status (rated entities first)
    sortableItems.sort((a, b) => {
      const aRated = isEntityRated(a.entity_names);
      const bRated = isEntityRated(b.entity_names);

      if (aRated && !bRated) return -1;
      if (!aRated && bRated) return 1;

      // Then apply the user's sort configuration
      if (sortConfig.key) {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
      }
      return 0;
    });

    return sortableItems;
  }, [eventsData, sortConfig, ratedEntities]);

  const filteredData = React.useMemo(() => {
    return sortedData.filter((item) => {
      const matchesSearch = Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesCluster = !filterCluster || item.clusters === filterCluster;
      const matchesDepartment =
        !filterDepartment || item.departments === filterDepartment;
      const matchesEntityType =
        !filterEntityType || item.entity_types === filterEntityType;
      const matchesEntityName =
        !filterEntityName || item.entity_names === filterEntityName;
      const matchesActivityType =
        !filterActivityType || item.activity_types === filterActivityType;
      const matchesLevelOfActivity =
        !filterLevelOfActivity ||
        item.level_of_activitys === filterLevelOfActivity;
      const matchesPdfFilter =
        pdfFilter === "all" ||
        (pdfFilter === "uploaded" && item.pdf_url !== "Not Uploaded") ||
        (pdfFilter === "not_uploaded" && item.pdf_url === "Not Uploaded");

      return (
        matchesSearch &&
        matchesCluster &&
        matchesDepartment &&
        matchesEntityType &&
        matchesEntityName &&
        matchesActivityType &&
        matchesLevelOfActivity &&
        matchesPdfFilter
      );
    });
  }, [
    sortedData,
    searchTerm,
    filterCluster,
    filterDepartment,
    filterEntityType,
    filterEntityName,
    filterActivityType,
    filterLevelOfActivity,
    pdfFilter,
  ]);

  // Group events by entity to handle entity-based operations
  const entitiesWithPdf = React.useMemo(() => {
    const entities = {};

    filteredData.forEach((event) => {
      const entityName = event.entity_names;
      if (!entities[entityName]) {
        entities[entityName] = {
          name: entityName,
          hasPdf: event.pdf_url !== "Not Uploaded",
          events: [],
        };
      }

      // If any event has a PDF, mark the entity as having a PDF
      if (event.pdf_url !== "Not Uploaded") {
        entities[entityName].hasPdf = true;
      }

      entities[entityName].events.push(event);
    });

    return Object.values(entities);
  }, [filteredData]);

  const handleOpenRatingModal = (entity) => {
    setSelectedEntity(entity);
    setShowRatingModal(true);
  };

  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setSelectedEntity(null);
  };

  const handleSubmitRatings = (ratings) => {
    // Create payload with entity name and ratings
    const payload = {
      entity_name: selectedEntity.name,
      ratings: ratings,
    };

    apiClient
      .post("/submit-entity-rating/", payload)
      .then((response) => {
        openNotification(
          "success",
          "Ratings submitted successfully",
          "Your ratings have been saved."
        );
        // Refresh the ratings data if we're on the See Marks tab
        if (activeTab === "seeMarks") {
          fetchEntityRatings();
        }
      })
      .catch((error) => {
        openNotification(
          "error",
          "Error submitting ratings",
          error.response?.data?.message ||
            `Error ${
              error.response?.status || "unknown"
            }: Something went wrong!`
        );
      });

    // Add the entity to the rated entities list
    setRatedEntities((prev) => {
      if (!prev.includes(selectedEntity.name)) {
        return [...prev, selectedEntity.name];
      }
      return prev;
    });

    handleCloseRatingModal();
  };

  const handleEditRatings = (entity) => {
    // Find the entity in the entitiesWithPdf list
    const entityToEdit = entitiesWithPdf.find(
      (e) => e.name === entity.entity_name
    );
    if (entityToEdit) {
      setSelectedEntity(entityToEdit);
      setShowRatingModal(true);
    } else {
      openNotification(
        "error",
        "Cannot edit ratings",
        "Entity information not found."
      );
    }
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? " ▲" : " ▼";
    }
    return "";
  };

  // Calculate total marks for an entity
  const calculateTotalMarks = (ratingsData) => {
    return ratingsData.reduce((total, item) => total + item.rating, 0);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading && activeTab === "giveMarks") {
    return (
      <div className={styles.loading}>Loading ceremony events data...</div>
    );
  }

  if (error && activeTab === "giveMarks") {
    return <div className={styles.error}>{error}</div>;
  }

  const totalCount = filteredData.length;
  const uploadedCount = filteredData.filter(
    (event) => event.pdf_url !== "Not Uploaded"
  ).length;
  const notUploadedCount = totalCount - uploadedCount;

  // Count unique rated entities
  const uniqueRatedEntities = new Set();
  filteredData.forEach((event) => {
    if (isEntityRated(event.entity_names)) {
      uniqueRatedEntities.add(event.entity_names);
    }
  });
  const ratedCount = uniqueRatedEntities.size;

  const totalCountRate = filteredData.length;
  const uploadedCountrate = filteredData.filter(
    (event) => event.average_rating !== "No Rating"
  ).length;
  const notUploadedCountRating = totalCountRate - uploadedCountrate;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ceremony Events PDF Management</h1>

      {/* Enhanced Notifications Container */}
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

      {/* Tab Navigation */}
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "giveMarks" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("giveMarks")}
        >
          Give Marks
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "seeMarks" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("seeMarks")}
        >
          See Marks
        </button>
      </div>

      {activeTab === "giveMarks" && (
        <>
          <div className={styles.controls}>
            <div className={styles.search}>
              <div className={styles.searchInputWrapper}>
                <FiSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            <div className={styles.filterToggle}>
              <button
                className={styles.filterToggleButton}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              {showFilters && (
                <button
                  className={styles.resetFiltersButton}
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Enhanced Count Summary */}
          <div className={styles.enhancedCountSummary}>
            <div
              className={`${styles.countCard} ${
                pdfFilter === "all" ? styles.activeCountCard : ""
              }`}
              onClick={() => setPdfFilter("all")}
            >
              <div className={styles.countValue}>{totalCount}</div>
              <div className={styles.countLabel}>Total Events</div>
            </div>
            <div
              className={`${styles.countCard} ${
                pdfFilter === "uploaded" ? styles.activeCountCard : ""
              }`}
              onClick={() => setPdfFilter("uploaded")}
            >
              <div className={styles.countValue}>{uploadedCount}</div>
              <div className={styles.countLabel}>Uploaded PDFs</div>
            </div>
            <div
              className={`${styles.countCard} ${
                pdfFilter === "not_uploaded" ? styles.activeCountCard : ""
              }`}
              onClick={() => setPdfFilter("not_uploaded")}
            >
              <div className={styles.countValue}>{notUploadedCount}</div>
              <div className={styles.countLabel}>Not Uploaded</div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className={styles.advancedFilters}>
              <div className={styles.filtersGrid}>
                <div className={styles.filterGroup}>
                  <label>Cluster:</label>
                  <select
                    value={filterCluster}
                    onChange={(e) => setFilterCluster(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="">All Clusters</option>
                    {getUniqueValues("clusters").map((cluster) => (
                      <option key={cluster} value={cluster}>
                        {cluster}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Department:</label>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="">All Departments</option>
                    {getUniqueValues("departments").map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Entity Type:</label>
                  <select
                    value={filterEntityType}
                    onChange={(e) => setFilterEntityType(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="">All Entity Types</option>
                    {getUniqueValues("entity_types").map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Entity Name:</label>
                  <select
                    value={filterEntityName}
                    onChange={(e) => setFilterEntityName(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="">All Entities</option>
                    {getUniqueValues("entity_names").map((entity) => (
                      <option key={entity} value={entity}>
                        {entity}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Activity Type:</label>
                  <select
                    value={filterActivityType}
                    onChange={(e) => setFilterActivityType(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="">All Activity Types</option>
                    {getUniqueValues("activity_types").map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Level of Activity:</label>
                  <select
                    value={filterLevelOfActivity}
                    onChange={(e) => setFilterLevelOfActivity(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="">All Levels</option>
                    {getUniqueValues("level_of_activitys").map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th onClick={() => handleSort("rec_cer_id")}>
                    S.No. {getSortIndicator("index")}
                  </th>
                  <th onClick={() => handleSort("clusters")}>
                    Cluster {getSortIndicator("clusters")}
                  </th>
                  <th onClick={() => handleSort("departments")}>
                    Department {getSortIndicator("departments")}
                  </th>
                  <th onClick={() => handleSort("entity_names")}>
                    Entity {getSortIndicator("entity_names")}
                  </th>
                  <th onClick={() => handleSort("level_of_activitys")}>
                    Level of Activity {getSortIndicator("level_of_activitys")}
                  </th>
                  <th>LinkedIn </th>
                  <th>Instagram </th>
                  <th onClick={() => handleSort("activity_event_names")}>
                    Event Name {getSortIndicator("activity_event_names")}
                  </th>
                  <th>PDF Actions</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((event, index) => (
                    <tr
                      key={event.rec_cer_id}
                      className={
                        isEntityRated(event.entity_names) ? styles.ratedRow : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{event.clusters}</td>
                      <td>{event.departments}</td>
                      <td>{event.entity_names}</td>
                      <td>{event.level_of_activitys}</td>
                      <td>
                        {event?.linkedin_url ? (
                          <a
                            href={event.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialIcon}
                            title="Open LinkedIn"
                          >
                            <FaLinkedin size={20} color="#0077b5" />
                          </a>
                        ) : (
                          <span className={styles.naText}>N/A</span>
                        )}
                      </td>
                      <td>
                        {event?.instagram_url ? (
                          <a
                            href={event.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialIcon}
                            title="Open Instagram"
                          >
                            <FaInstagram size={20} color="#e1306c" />
                          </a>
                        ) : (
                          <span className={styles.naText}>N/A</span>
                        )}
                      </td>
                      <td>{event.activity_event_names}</td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={`${styles.actionButton} ${
                              styles.viewButton
                            } ${
                              event.pdf_url === "Not Uploaded"
                                ? styles.disabled
                                : ""
                            }`}
                            onClick={() =>
                              handlePdfView(
                                event.pdf_url,
                                event.activity_event_names
                              )
                            }
                            disabled={event.pdf_url === "Not Uploaded"}
                          >
                            <FiEye className={styles.buttonIcon} />
                            View
                          </button>
                          <button
                            className={`${styles.actionButton} ${
                              styles.downloadButton
                            } ${
                              event.pdf_url === "Not Uploaded"
                                ? styles.disabled
                                : ""
                            }`}
                            onClick={() =>
                              handleDownload(
                                event.pdf_url,
                                event.activity_event_names
                              )
                            }
                            disabled={event.pdf_url === "Not Uploaded"}
                          >
                            Download
                          </button>
                          <span className={styles.pdfStatus}>
                            {event.pdf_url === "Not Uploaded" ? (
                              <span className={styles.notUploaded}>
                                Not Uploaded
                              </span>
                            ) : (
                              <span className={styles.uploaded}>Uploaded</span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td>
                        {event.pdf_url !== "Not Uploaded" &&
                          (isEntityRated(event.entity_names) ? (
                            <div className={styles.marksSubmitted}>
                              <span className={styles.checkmark}>✓</span> Marks
                              Submitted
                            </div>
                          ) : (
                            <button
                              className={`${styles.actionButton} ${styles.rateButton}`}
                              onClick={() => {
                                const entity = entitiesWithPdf.find(
                                  (e) => e.name === event.entity_names
                                );
                                if (entity) {
                                  handleOpenRatingModal(entity);
                                }
                              }}
                            >
                              Send Marks
                            </button>
                          ))}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className={styles.noData}>
                      No events found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "seeMarks" && (
        <div className={styles.ratingsContainer}>
          {isLoadingRatings ? (
            <div className={styles.loading}>Loading entity ratings data...</div>
          ) : entityRatings.length > 0 ? (
            <>
              <div className={styles.ratingsHeader}>
                <h2>Entity Ratings</h2>
                <button
                  className={styles.refreshButton}
                  onClick={fetchEntityRatings}
                >
                  Refresh Data
                </button>
              </div>

              <div className={styles.compactTableContainer}>
                <table className={styles.compactRatingsTable}>
                  <thead>
                    <tr>
                      <th className={styles.entityNameColumn}>Entity Name</th>
                      {entityRatings[0].ratings_data.map((rating, index) => (
                        <th key={index} className={styles.questionColumn}>
                          <span>{rating.question}</span>
                        </th>
                      ))}
                      <th className={styles.totalColumn}>Total</th>
                      <th className={styles.actionsColumn}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entityRatings.map((entity, entityIndex) => (
                      <tr key={entityIndex}>
                        <td className={styles.entityNameCell}>
                          <div className={styles.entityNameWrapper}>
                            <span className={styles.entityName}>
                              {entity.entity_name}
                            </span>
                            <span className={styles.submissionTime}>
                              Submitted: {formatDate(entity.submitted_at)}
                            </span>
                          </div>
                        </td>
                        {entity.ratings_data.map((rating, ratingIndex) => (
                          <td key={ratingIndex} className={styles.ratingCell}>
                            {rating.rating}
                          </td>
                        ))}
                        <td className={styles.totalCell}>
                          <strong>
                            {calculateTotalMarks(entity.ratings_data)}
                          </strong>
                        </td>
                        <td className={styles.actionsCell}>
                          {/* <button className={styles.editButton} onClick={() => handleEditRatings(entity)}>
                            Edit
                          </button> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className={styles.noRatings}>
              <p>
                No ratings data available. Rate some entities to see them here.
              </p>
              <button
                className={styles.switchTabButton}
                onClick={() => setActiveTab("giveMarks")}
              >
                Go to Give Marks
              </button>
            </div>
          )}
        </div>
      )}

      {selectedPdf && (
        <PdfViewer
          pdfUrl={selectedPdf.url}
          eventName={selectedPdf.name}
          onClose={closePdfViewer}
        />
      )}

      {showRatingModal && selectedEntity && (
        <RatingModal
          entity={selectedEntity}
          onClose={handleCloseRatingModal}
          onSubmit={handleSubmitRatings}
        />
      )}
    </div>
  );
};

export default CeremonyPdf;
