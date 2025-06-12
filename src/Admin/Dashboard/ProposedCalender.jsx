import React, { useEffect, useState } from "react";
import apiClient from "../../config/apiClient";
import styles from "./Proposed.module.css";


const ProposedCalender = () => {
  const [proposedCalender, setProposedCalendar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);


    const formatDate = (dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }


  const fetchAdminCalendar = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/all-proposed-calendar/");
      console.log(response, "ADMIN CALENDAR RESPONSE");
      setProposedCalendar(response?.data || []);
    } catch (error) {
      console.log("Error fetching calendar:", error);
      setProposedCalendar([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteProposedCalendar = async (pcId) => {
    if (
      !window.confirm("Are you sure you want to delete this calendar item?")
    ) {
      return;
    }

    try {
      setDeleting(pcId);
      const response = await apiClient.delete(
        `/delete-proposed-calendar/${pcId}/`
      );

      if (response.data.success) {
        setProposedCalendar((prev) =>
          prev.filter((item) => item.pc_id !== pcId)
        );
        alert("Calendar item deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting calendar:", error);
      alert("Failed to delete calendar item. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchAdminCalendar();
  }, []);

    const downloadCSV = () => {
    // Define all fields that are shown in the detail drawer
    const allDetailFields = [
      // Basic Information
      { header: "Request Number", accessor: "req_no" },
      { header: "Proposed Name", accessor: "proposed_name" },
      { header: "Proposed Date", accessor: "proposed_date" },
      { header: "Proposed By", accessor: "proposed_by" },
      { header: "Proposer Name", accessor: "proposer_name" },
      { header: "Proposer Email", accessor: "proposer_email" },
      { header: "Employee Code", accessor: "emp_code" },
      { header: "Mobile", accessor: "mobile" },
      { header: "Status", accessor: "status" },
      { header: "Session", accessor: "session" },
      { header: "Is Coordinator", accessor: "is_cordinator" }, // Use is_cordinator for consistency
      // Entity Information
      { header: "Entity ID", accessor: "entity_id" },
      { header: "Entity Name", accessor: "entity_name" },
      { header: "Department ID", accessor: "dept_id" },
      { header: "Department Name", accessor: "department_name" },
      // Mission & Vision
      { header: "Mission", accessor: "mission" },
      { header: "Vision", accessor: "vision" },
      { header: "Objectives", accessor: "objective" },
      // SDG Information
      { header: "SDG", accessor: "sdg" },
      { header: "SDG ID", accessor: "sdg_id" },
      // Student Section 1
      { header: "Student Sec 1 Name", accessor: "student_sec_1_name" },
      { header: "Student Sec 1 Email", accessor: "student_sec_1_email" },
      { header: "Student Sec 1 UID", accessor: "student_sec_1_uid" },
      { header: "Student Sec 1 Mobile", accessor: "student_sec_1_mobile" },
      { header: "Student Sec 1 Department", accessor: "student_sec_1_dept" },
      {
        header: "Student Sec 1 Department ID",
        accessor: "student_sec_1_dept_id",
      },
      // Student Advisor Section 1
      { header: "Student Adv Sec 1 Name", accessor: "student_advsec_1_name" },
      { header: "Student Adv Sec 1 Email", accessor: "student_advsec_1_email" },
      { header: "Student Adv Sec 1 UID", accessor: "student_advsec_1_uid" },
      {
        header: "Student Adv Sec 1 Mobile",
        accessor: "student_advsec_1_mobile",
      },
      {
        header: "Student Adv Sec 1 Department",
        accessor: "student_advsec_1_dept",
      },
      {
        header: "Student Adv Sec 1 Department ID",
        accessor: "student_advsec_1_dept_id",
      },
      // Faculty Advisor 1
      { header: "Faculty Adv 1 Name", accessor: "faculty_adv_1_name" },
      { header: "Faculty Adv 1 Email", accessor: "faculty_adv_1_email" },
      { header: "Faculty Adv 1 Emp Code", accessor: "faculty_adv_1_empcode" },
      { header: "Faculty Adv 1 Mobile", accessor: "faculty_adv_1_mobile" },
      { header: "Faculty Adv 1 Department", accessor: "faculty_adv_1_dept" },
      {
        header: "Faculty Adv 1 Department ID",
        accessor: "faculty_adv_1_dept_id",
      },
      // Faculty Co-Advisor 1
      { header: "Faculty Co-Adv 1 Name", accessor: "faculty_coadv_1_name" },
      { header: "Faculty Co-Adv 1 Email", accessor: "faculty_coadv_1_email" },
      {
        header: "Faculty Co-Adv 1 Emp Code",
        accessor: "faculty_coadv_1_empcode",
      },
      { header: "Faculty Co-Adv 1 Mobile", accessor: "faculty_coadv_1_mobile" },
      {
        header: "Faculty Co-Adv 1 Department",
        accessor: "faculty_coadv_1_dept",
      },
      {
        header: "Faculty Co-Adv 1 Department ID",
        accessor: "faculty_coadv_1_dept_id",
      },
    ]

    // Create CSV headers
    const headers = allDetailFields.map((field) => field.header).join(",")

    // Create CSV rows with all detail fields
    const rows = filteredEntities
      .map((entity) => {
        return allDetailFields
          .map((field) => {
            let value = entity[field.accessor]

     

            // Handle null/undefined values and escape quotes
            if (value === null || value === undefined) {
              value = ""
            } else {
              value = String(value).replace(/"/g, '""') // Escape quotes
            }

            return `"${value}"`
          })
          .join(",")
      })
      .join("\n")

    const csvContent = `${headers}\n${rows}`

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "proposed_calender.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Show success message
    // message.success(`Downloaded ${filteredEntities.length} entities with complete details`)
  }

  return (
    <>
      {loading === true ? (
        <h3>Loading Data...</h3>
      ) : (
       <div className={styles.propo}>
         <div className={styles.columnCard}>
          <div className={styles.chartHeader}>
            <h3>Proposed Calendar</h3>
          </div>
          <div>
            <div className={styles.tableContainer}>
              <table className={styles.calendarDataTable}>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Event Name</th>
                    <th>Activity Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Budget</th>
                    <th>Status</th>
                    <th>Entity</th>
                    <th>Department</th>
                    <th>Secretary</th>
                    <th>Faculty Advisory</th>
                    <th>SDG</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {proposedCalender &&
                    proposedCalender.map((event, index) => (
                      <tr key={event.pc_id || index}>
                        <td className={styles.idCell}>{index + 1}</td>
                        <td className={styles.eventTitleCell}>
                          <div className={styles.eventTitle}>
                            {event.event_name || "Untitled Event"}
                          </div>
                          {event.description && (
                            <div className={styles.eventDescription}>
                              {event.description.length > 80
                                ? `${event.description.substring(0, 80)}...`
                                : event.description}
                            </div>
                          )}
                        </td>
                        <td className={styles.activityTypeCell}>
                          <span
                            className={`${styles.activityBadge} ${
                              styles[
                                `activity${event.activity_type?.toLowerCase()}`
                              ]
                            }`}
                          >
                            {event.activity_type || "N/A"}
                          </span>
                        </td>
                        <td className={styles.dateCell}>
                          {formatDate(event.start_date)}
                        </td>
                        <td className={styles.dateCell}>
                          {formatDate(event.end_date)}
                        </td>
                        <td className={styles.budgetCell}>
                          {event.proposed_budget}
                        </td>
                        <td className={styles.statusCell}>
                          <span
                            className={`${styles.statusBadge} ${
                              styles[
                                `status${(
                                  event.status || "pending"
                                ).toLowerCase()}`
                              ]
                            }`}
                          >
                            {event.status || "Pending"}
                          </span>
                        </td>
                        <td className={styles.entityCell}>
                          <div className={styles.entityInfo}>
                            <div className={styles.entityName}>
                              {event.entity_name || "N/A"}
                            </div>
                            <div className={styles.registrationName}>
                              {event.registeration_name || ""}
                            </div>
                          </div>
                        </td>
                        <td className={styles.departmentCell}>
                          <div className={styles.departmentInfo}>
                            <div className={styles.departmentName}>
                              {event.department_name || "N/A"}
                            </div>
                            <div className={styles.clusterName}>
                              {event.cluster_name || ""}
                            </div>
                          </div>
                        </td>
                        <td className={styles.contactCell}>
                          <div className={styles.contactInfo}>
                            <div className={styles.contactName}>
                              {event.Secretary_Name || "N/A"}
                            </div>
                            <div className={styles.contactEmail}>
                              {event.Secretary_Email || ""}
                            </div>
                            <div className={styles.contactMobile}>
                              {event.Secretary_Mobile || ""}
                            </div>
                          </div>
                        </td>
                        <td className={styles.contactCell}>
                          <div className={styles.contactInfo}>
                            <div className={styles.contactName}>
                              {event.Faculty_Advisory_Name || "N/A"}
                            </div>
                            <div className={styles.contactEmail}>
                              {event.Faculty_Advisory_Email || ""}
                            </div>
                            <div className={styles.contactMobile}>
                              {event.Faculty_Advisory_Mobile || ""}
                            </div>
                            {event.Faculty_Advisory_Empcode && (
                              <div className={styles.empCode}>
                                Emp: {event.Faculty_Advisory_Empcode}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className={styles.sdgCell}>
                          <div className={styles.sdgInfo}>
                            <div className={styles.sdgName}>
                              {event.sdg_name || "N/A"}
                            </div>
                            <div className={styles.actedName}>
                              {event.acted_name
                                ? `${event.acted_name} - ${event.acted_fullform}`
                                : ""}
                            </div>
                            <div className={styles.nsqfName}>
                              {event.nsqf_name || ""}
                            </div>
                          </div>
                        </td>
                        <td className={styles.actionsCell}>
                          <div className={styles.tableActions}>
                            <button
                              className={styles.viewButton}
                              onClick={() => handleViewEvent(event)}
                              title="View Event Details"
                            >
                              👁️ View
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() =>
                                deleteProposedCalendar(event.pc_id)
                              }
                              disabled={deleting === event.pc_id}
                              title="Delete Event"
                            >
                              {deleting === event.pc_id ? "..." : "🗑️ Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
       </div>
      )}
    </>
  );
};

export default ProposedCalender;
