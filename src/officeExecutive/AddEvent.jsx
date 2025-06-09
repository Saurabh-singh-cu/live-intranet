"use client"

import { useState, useEffect, useMemo } from "react"
import styles from "./AddEvent.module.css"
import apiClient from "../config/apiClient"
import Swal from "sweetalert2"
import { Button, Drawer, Popover } from "antd"
import { FaEye } from "react-icons/fa"

const AddEvent = () => {
  const [formData, setFormData] = useState({
    entityType: "",
    entityName: "",
    activityType: "",
    eventName: "",
    status: "Pending",
    startDateProposed: "",
    startTimeProposed: "",
    endDateProposed: "",
    endTimeProposed: "",
    limit: "",
    description: "",
    organiserGuestName: "",
    budget: "",
    receivedOn: "",
    levelActivity: "",
  })

  const [entityTypes, setEntityTypes] = useState([])
  const [entityNames, setEntityNames] = useState([])
  const [activityTypes, setActivityTypes] = useState([])
  const [proposedEvents, setProposedEvents] = useState([]) // New state for proposed events
  const [isCustomEvent, setIsCustomEvent] = useState(false) // Track if "Other" is selected
  const [descriptionCount, setDescriptionCount] = useState(0)
  const [errors, setErrors] = useState({})
  const [eventList, setEventList] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [collectedOn, setCollectedOn] = useState("")
  const [collectedBy, setCollectedBy] = useState("")
  const [comment, setComment] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [statusOptions, setStatusOptions] = useState([])

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  })
  const itemsPerPage = 10

  useEffect(() => {
    fetchEntityTypes()
  }, [])

  const fetchEntityTypes = async () => {
    try {
      const response = await apiClient.get("entity-types/")
      setEntityTypes(response.data)
    } catch (error) {
      console.error("Error fetching entity types:", error)
    }
  }

  const fetchEntityNames = async (entityId) => {
    try {
      const response = await apiClient.get(`entity-registration-name/?entity_id=${entityId}`)
      setEntityNames(response.data)
    } catch (error) {
      console.error("Error fetching entity names:", error)
    }
  }

  const fetchActivityTypes = async (entityId) => {
    try {
      const response = await apiClient.get(`entity-activities/?entity_id=${entityId}`)
      setActivityTypes(response.data)
    } catch (error) {
      console.error("Error fetching activity types:", error)
    }
  }

  const fetchProposedCalender = async (regId) => {
    try {
      const response = await apiClient.get(`proposed-events/${regId}/`)
      console.log(response, "PROPOSED CAL")
      setProposedEvents(response.data || [])
    } catch (error) {
      console.log(error)
      setProposedEvents([])
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.entityType) newErrors.entityType = "Entity Type is required"
    if (!formData.entityName) newErrors.entityName = "Entity Name is required"
    if (!formData.activityType) newErrors.activityType = "Activity Type is required"
    if (!formData.eventName) newErrors.eventName = "Event Name is required"
    if (!formData.startDateProposed) newErrors.startDateProposed = "Start Date is required"
    if (!formData.startTimeProposed) newErrors.startTimeProposed = "Start Time is required"
    if (!formData.endDateProposed) newErrors.endDateProposed = "End Date is required"
    if (!formData.endTimeProposed) newErrors.endTimeProposed = "End Time is required"
    if (!formData.limit) newErrors.limit = "Expected Participation is required"
    if (!formData.description) newErrors.description = "Description is required"
    if (!formData.levelActivity) newErrors.levelActivity = "level Of Activity is required"
    if (!formData.organiserGuestName) newErrors.organiserGuestName = "Organizer/Guest Name is required"
    if (!formData.budget) newErrors.budget = "Budget is required"
    if (!formData.receivedOn) newErrors.receivedOn = "Received On date is required"

    // Date validation
    if (formData.startDateProposed && formData.endDateProposed) {
      const startDate = new Date(formData.startDateProposed)
      const endDate = new Date(formData.endDateProposed)
      if (endDate < startDate) {
        newErrors.endDateProposed = "End Date cannot be earlier than Start Date"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === "description") {
      const words = value.trim().split(/\s+/).length
      if (words <= 200) {
        setDescriptionCount(words)
        setFormData((prev) => ({ ...prev, [name]: value }))
      }
    } else if (name === "entityType") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        entityName: "",
        activityType: "",
        eventName: "",
      }))
      setProposedEvents([])
      setIsCustomEvent(false)
      fetchEntityNames(value)
      fetchActivityTypes(value)
    } else if (name === "entityName") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        eventName: "",
      }))
      setIsCustomEvent(false)
      if (value) {
        fetchProposedCalender(value)
      } else {
        setProposedEvents([])
      }
    } else if (name === "eventName") {
      if (value === "other") {
        setIsCustomEvent(true)
        setFormData((prev) => ({ ...prev, [name]: "" })) // Clear the event name to accept custom input
      } else if (isCustomEvent) {
        // When in custom mode, allow typing
        setFormData((prev) => ({ ...prev, [name]: value }))
      } else {
        setIsCustomEvent(false)
        setFormData((prev) => ({ ...prev, [name]: value }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Clear the error for the field being edited
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const userId = JSON.parse(localStorage.getItem("user"))?.user_id

    const payload = {
      user_id: userId,
      act_id: formData.activityType,
      event_name: formData.eventName,
      levelActivity: formData.levelActivity,
      status: formData.status,
      start_date_proposed: formData.startDateProposed,
      start_time_proposed: formData.startTimeProposed,
      end_date_proposed: formData.endDateProposed,
      end_time_proposed: formData.endTimeProposed,
      limit: formData.limit,
      description: formData.description,
      organiser_guest_name: formData.organiserGuestName,
      budget: formData.budget,
      received_on: formData.receivedOn,
      reg_id: formData.entityName,
    }

    try {
      const response = await apiClient.post("event_entry_create/", payload)
      console.log("Event created:", response)

      Swal.fire({
        title: "Success!",
        text: "Event has been successfully created.",
        icon: "success",
        confirmButtonText: "OK",
      })

      setFormData({
        entityType: "",
        entityName: "",
        activityType: "",
        eventName: "",
        status: "Pending",
        startDateProposed: "",
        startTimeProposed: "",
        endDateProposed: "",
        endTimeProposed: "",
        limit: "",
        description: "",
        organiserGuestName: "",
        budget: "",
        receivedOn: "",
        levelActivity: "",
      })
      setDescriptionCount(0)
      setProposedEvents([])
      setIsCustomEvent(false)
      fetchEventList()
    } catch (error) {
      console.error("Error creating event:", error)
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while creating the event. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      })
    }
  }

  const fetchEventList = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user"))?.user_id
      const response = await apiClient.get(`event_entry_request_list/?user_id=${userId}`)
      setEventList(response.data)
    } catch (error) {
      console.error("Error fetching event list:", error)
    }
  }

  useEffect(() => {
    fetchEventList()
  }, [])

  const filteredEvents = eventList.filter((event) =>
    Object.values(event).some((value) =>
      value ? value.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false,
    ),
  )

  const sortedEvents = useMemo(() => {
    const sortableEvents = [...filteredEvents]
    if (sortConfig.key !== null) {
      sortableEvents.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }
    return sortableEvents
  }, [filteredEvents, sortConfig])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedEvents = sortedEvents.slice(startIndex, endIndex)

  console.log(eventList, "LOST")

  const handleStatusChange = async (er_id, newStatus) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to change the status to "${newStatus}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!",
      })

      if (result.isConfirmed) {
        await apiClient.put(`event-request/${er_id}/update-file-status/`, {
          file_status: newStatus,
        })
        setEventList((prevList) =>
          prevList.map((item) => (item.er_id === er_id ? { ...item, status: newStatus } : item)),
        )

        Swal.fire("Updated!", "The event status has been updated.", "success")

        if (newStatus === "Submitted To Department") {
          setSelectedEvent(eventList.find((item) => item.er_id === er_id))
        }
      }
    } catch (error) {
      console.error("Error updating status:", error)
      Swal.fire({
        title: "Error!",
        text: `${error?.response?.data?.error}`,
        icon: "error",
        confirmButtonText: "OK",
      })
    }
  }

  const handleCollectedDetails = async (er_id) => {
    try {
      const payload = {
        file_status: "Submitted To Department",
        collected_on: collectedOn,
        collected_by: collectedBy,
        comment: comment,
      }
      await apiClient.put(`event-request/${er_id}/update-file-status/`, payload)
      Swal.fire({
        title: "Success!",
        text: "Collected details have been updated.",
        icon: "success",
        confirmButtonText: "OK",
      })
      setCollectedOn("")
      setCollectedBy("")
      setComment("")
      fetchEventList()
    } catch (error) {
      console.error("Error updating collected details:", error)
      Swal.fire({
        title: "Error!",
        text: "Failed to update collected details. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      })
    }
  }

  const handleViewMore = (event) => {
    setSelectedEvent(event)
    setOpenDrawer(true)
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Add New Events</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Entity Type</label>
            <select
              name="entityType"
              value={formData.entityType}
              onChange={handleInputChange}
              className={errors.entityType ? styles.errorInput : ""}
            >
              <option value="">Select Type</option>
              {entityTypes?.map((type) => (
                <option key={type.entity_id} value={type.entity_id}>
                  {type.entity_name}
                </option>
              ))}
            </select>
            {errors.entityType && <span className={styles.errorText}>{errors.entityType}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Entity Name</label>
            <select
              name="entityName"
              value={formData.entityName}
              onChange={handleInputChange}
              className={errors.entityName ? styles.errorInput : ""}
            >
              <option value="">Select Entity</option>
              {entityNames.map((entity) => (
                <option key={entity.reg_id} value={entity.reg_id}>
                  {entity.registration_name}
                </option>
              ))}
            </select>
            {errors.entityName && <span className={styles.errorText}>{errors.entityName}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Level Of Activity</label>
            <select
              name="levelActivity"
              value={formData.levelActivity}
              onChange={handleInputChange}
              className={errors.levelActivity ? styles.errorInput : ""}
            >
              <option value="">Select Level</option>
              <option value="Flagship">Flagship</option>
              <option value="Monthly">Monthly</option>
              <option value="Regularly">Regularly</option>
            </select>
            {errors.levelActivity && <span className={styles.errorText}>{errors.levelActivity}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Activity Type</label>
            <select
              name="activityType"
              value={formData.activityType}
              onChange={handleInputChange}
              className={errors.activityType ? styles.errorInput : ""}
            >
              <option value="">Select Activity</option>
              {activityTypes.map((activity) => (
                <option key={activity.act_id} value={activity.act_id}>
                  {activity.activity_name}
                </option>
              ))}
            </select>
            {errors.activityType && <span className={styles.errorText}>{errors.activityType}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Event Name</label>
            {!isCustomEvent ? (
              <select
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                className={errors.eventName ? styles.errorInput : ""}
                disabled={!formData.entityName}
              >
                <option value="">Select Event</option>
                {proposedEvents.map((event, index) => (
                  <option key={index} value={event.event_name}>
                    {event.event_name}
                  </option>
                ))}
                <option value="other">Other</option>
              </select>
            ) : (
              <input
                type="text"
                name="eventName"
                placeholder="Enter event name"
                value={formData.eventName}
                onChange={handleInputChange}
                className={errors.eventName ? styles.errorInput : ""}
              />
            )}
            {isCustomEvent && (
              <button
                type="button"
                className={styles.backToSelectBtn}
                onClick={() => {
                  setIsCustomEvent(false)
                  setFormData((prev) => ({ ...prev, eventName: "" }))
                }}
              >
                Back to select
              </button>
            )}
            {errors.eventName && <span className={styles.errorText}>{errors.eventName}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Start Date</label>
            <input
              type="date"
              name="startDateProposed"
              placeholder="Start Date"
              value={formData.startDateProposed}
              onChange={handleInputChange}
              className={errors.startDateProposed ? styles.errorInput : ""}
            />
            {errors.startDateProposed && <span className={styles.errorText}>{errors.startDateProposed}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Start Time</label>
            <input
              type="time"
              name="startTimeProposed"
              placeholder="Start Time"
              value={formData.startTimeProposed}
              onChange={handleInputChange}
              className={errors.startTimeProposed ? styles.errorInput : ""}
            />
            {errors.startTimeProposed && <span className={styles.errorText}>{errors.startTimeProposed}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>End Date</label>
            <input
              type="date"
              name="endDateProposed"
              placeholder="End Date"
              value={formData.endDateProposed}
              onChange={handleInputChange}
              className={errors.endDateProposed ? styles.errorInput : ""}
            />
            {errors.endDateProposed && <span className={styles.errorText}>{errors.endDateProposed}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>End Time</label>
            <input
              type="time"
              name="endTimeProposed"
              placeholder="End Time"
              value={formData.endTimeProposed}
              onChange={handleInputChange}
              className={errors.endTimeProposed ? styles.errorInput : ""}
            />
            {errors.endTimeProposed && <span className={styles.errorText}>{errors.endTimeProposed}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Organizer/Guest Name</label>
            <input
              type="text"
              name="organiserGuestName"
              placeholder="Guest Name"
              value={formData.organiserGuestName}
              onChange={handleInputChange}
              className={errors.organiserGuestName ? styles.errorInput : ""}
            />
            {errors.organiserGuestName && <span className={styles.errorText}>{errors.organiserGuestName}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Expected Participation</label>
            <input
              type="number"
              name="limit"
              placeholder="Participation count e.g. 3000"
              value={formData.limit}
              onChange={handleInputChange}
              min="1"
              className={errors.limit ? styles.errorInput : ""}
            />
            {errors.limit && <span className={styles.errorText}>{errors.limit}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Budget Required</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              placeholder="Budget Required"
              onChange={handleInputChange}
              min="0"
              className={errors.budget ? styles.errorInput : ""}
            />
            {errors.budget && <span className={styles.errorText}>{errors.budget}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Received On</label>
            <input
              type="date"
              name="receivedOn"
              value={formData.receivedOn}
              placeholder="Received On"
              onChange={handleInputChange}
              className={errors.receivedOn ? styles.errorInput : ""}
            />
            {errors.receivedOn && <span className={styles.errorText}>{errors.receivedOn}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe in between 200 words..."
              maxLength="1000"
              className={errors.description ? styles.errorInput : ""}
            />
            <div className={styles.wordCount}>{descriptionCount}/200 words</div>
            {errors.description && <span className={styles.errorText}>{errors.description}</span>}
          </div>

          <div className={styles.formGroup}>
            <button type="submit" className={styles.submitButton}>
              Add New Event
            </button>
          </div>
        </div>
      </form>

      <div className={styles.tableContainer}>
        <span className={styles.headingspan}>
          <h2 style={{ margin: "20px" }}>Event List</h2>
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </span>
        <div className={styles.tableWrapper}>
          <table className={styles.eventTable}>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Status</th>
                <th>Department</th>
                <th>Start Date Prop</th>
                <th>End Date Prop</th>
                <th>Organizer</th>
                <th>Budget</th>
                <th>Registeration Name</th>
                <th>Priority</th>
                <th>Entity Name</th>
                <th> View</th>
                <th>Collected Details</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEvents.map((event) => (
                <tr key={event.er_id}>
                  <td>
                    <Popover title={event?.event_name}>{event.event_name && event?.event_name.slice(0, 30)}...</Popover>
                  </td>
                  <td>
                    <select
                      className={
                        event?.file_status === "In Progress"
                          ? styles.partselect
                          : event?.file_status === "Pending With PVC"
                            ? styles.partselect1
                            : styles.partselect2
                      }
                      value={event.status}
                      onChange={(e) => handleStatusChange(event.er_id, e.target.value)}
                    >
                      <option value="">{event?.file_status}</option>
                      <option style={{ color: "#007BFF " }} value="In Progress">
                        In Progress
                      </option>
                      <option style={{ color: "#FFA500  " }} value="Pending With PVC">
                        Pending With PVC
                      </option>
                      <option style={{ color: "#00FF00" }} value="Submitted To Department">
                        Submitted To Department
                      </option>
                    </select>
                  </td>
                  <td>{event.department_name}</td>
                  <td>{event.start_date_proposed}</td>
                  <td>{event.end_date_proposed}</td>
                  <td>{event.organiser_guest_name}</td>
                  <td>{event.budget}</td>
                  <td>{event.registeration_name}</td>
                  <td>{event.priority}</td>
                  <td>{event.entity_name}</td>
                  <td>
                    <p type="primary" onClick={() => handleViewMore(event)}>
                      <FaEye />
                    </p>
                  </td>
                  <td>
                    {event.status === "Submitted To Department" && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <input
                          type="date"
                          value={collectedOn}
                          onChange={(e) => setCollectedOn(e.target.value)}
                          placeholder="Collected On"
                          className={styles.partselect}
                        />
                        <input
                          type="text"
                          value={collectedBy}
                          onChange={(e) => setCollectedBy(e.target.value)}
                          placeholder="Collected By"
                          className={styles.partselect}
                        />
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Comment"
                          className={styles.partselect}
                        />
                        <Button onClick={() => handleCollectedDetails(event.er_id)}>Send</Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sortedEvents.length > itemsPerPage && (
            <div className={styles.pagination}>
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className={styles.paginationInfo}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className={styles.paginationButton}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>

        <Drawer
          title={<div className={styles.drawerTitle}>Event Details</div>}
          placement="right"
          width={500}
          onClose={() => setOpenDrawer(false)}
          open={openDrawer}
          className={styles.drawer}
        >
          {selectedEvent && (
            <div className={styles.drawerContent}>
              <div className={styles.eventDetail}>
                <span className={styles.label}>Event Name:</span>
                <span className={styles.value}>{selectedEvent.event_name}</span>
              </div>
              <div className={styles.eventDetail}>
                <span className={styles.label}>Status:</span>
                <span className={styles.value}>{selectedEvent.status}</span>
              </div>
              <div className={styles.eventDetail}>
                <span className={styles.label}>Start Date:</span>
                <span className={styles.value}>
                  {selectedEvent.start_date_proposed} {selectedEvent.start_time_proposed}
                </span>
              </div>
              <div className={styles.eventDetail}>
                <span className={styles.label}>End Date:</span>
                <span className={styles.value}>
                  {selectedEvent.end_date_proposed} {selectedEvent.end_time_proposed}
                </span>
              </div>
              <div className={styles.eventDetail}>
                <span className={styles.label}>Organizer:</span>
                <span className={styles.value}>{selectedEvent.organiser_guest_name}</span>
              </div>
              <div className={styles.eventDetail}>
                <span className={styles.label}>Budget:</span>
                <span className={styles.value}>{selectedEvent.budget}</span>
              </div>
              <div className={styles.eventDetail}>
                <span className={styles.label}>Received On:</span>
                <span className={styles.value}>{selectedEvent.receivedOn}</span>
              </div>
              <div className={styles.eventDetail}>
                <span className={styles.label}>Expected Participation:</span>
                <span className={styles.value}>{selectedEvent.limit}</span>
              </div>
              <div className={styles.description}>
                <div className={styles.descriptionLabel}>Description:</div>
                <div className={styles.descriptionText}>{selectedEvent.description}</div>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </div>
  )
}

export default AddEvent
