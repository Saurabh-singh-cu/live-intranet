"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Drawer, Form, Input, DatePicker, Select, Button, Modal, message, Popover } from "antd"
import "react-quill/dist/quill.snow.css"
import moment from "moment"
import styles from "./Entitytable.module.css"
import apiClient from "../../config/apiClient"

// Import modern table components
import { useTable, useSortBy, useFilters, usePagination, useGlobalFilter } from "react-table"
import Swal from "sweetalert2"

const { TextArea } = Input

function EntityTable() {
  const [entities, setEntities] = useState([])
  const [filteredEntities, setFilteredEntities] = useState([])
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [editingEntity, setEditingEntity] = useState(null)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const [viewMoreDrawerVisible, setViewMoreDrawerVisible] = useState(false)
  const [selectedEntityDetails, setSelectedEntityDetails] = useState(null)
  const [statusModalVisible, setStatusModalVisible] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [remark, setRemark] = useState("")
  const [selectedEntityId, setSelectedEntityId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // New states for dropdown options
  const [departments, setDepartments] = useState([])
  const [sdgOptions, setSdgOptions] = useState([])

  // Filter states
  const [proposedDateFilter, setProposedDateFilter] = useState(null)
  const [proposeNameFilter, setProposeNameFilter] = useState("")
  const [proposedByFilter, setProposedByFilter] = useState("")
  const [proposerNameFilter, setProposerNameFilter] = useState("")
  const [entityNatureFilter, setEntityNatureFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [entityNameFilter, setEntityNameFilter] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [sessionFilter, setSessionFilter] = useState("")

  // Store tab counts to keep them fixed
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    Approved: 0,
    Pending: 0,
    "Interview Scheduled": 0,
    Rejected: 0,
    "Request Hold": 0
  })

  // Get unique values for filters
  const getUniqueValues = (data, key) => {
    return [...new Set(data.map((item) => item[key]).filter(Boolean))]
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      if (parsedUser.access) {
        fetchEntities(parsedUser.access)
        fetchDepartments()
        fetchSDGs()
      } else {
        console.error("Access token not found in user data")
        navigate("/login")
      }
    } else {
      navigate("/login")
    }
  }, [navigate])

  const fetchEntities = async (access) => {
    try {
      const response = await apiClient.get("entity-requests/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      })
      setEntities(response.data)
      setFilteredEntities(response.data)
      
      // Calculate and store tab counts when data is first loaded
      const counts = {
        all: response.data.length,
        Approved: response.data.filter(entity => entity.status === "Approved").length,
        Pending: response.data.filter(entity => entity.status === "Pending").length,
        "Interview Scheduled": response.data.filter(entity => entity.status === "Interview Scheduled").length,
        Rejected: response.data.filter(entity => entity.status === "Rejected").length,
        "Request Hold": response.data.filter(entity => entity.status === "Request Hold").length
      }
      setTabCounts(counts)
    } catch (error) {
      console.error("Error fetching entities:", error)
    }
  }

  // Fetch departments from backend
  const fetchDepartments = async () => {
    try {
      const response = await apiClient.get("departments/")
      setDepartments(response.data)
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  // Fetch SDGs from backend
  const fetchSDGs = async () => {
    try {
      const response = await apiClient.get("sdgs/")
      setSdgOptions(response.data)
    } catch (error) {
      console.error("Error fetching SDGs:", error)
    }
  }

  // Use the fixed tab counts instead of recalculating
  const getTotalCount = () => tabCounts.all
  const getStatusCount = (status) => tabCounts[status] || 0

  // Fetch full entity data for editing
  const fetchEntityForEdit = async (entcrId) => {
    setLoadingEdit(true)
    try {
      const response = await apiClient.patch(`update-entity-request-all/${entcrId}/`)
      return response.data
    } catch (error) {
      console.error("Error fetching entity details:", error)
      message.error("Failed to fetch entity details")
      return null
    } finally {
      setLoadingEdit(false)
    }
  }

  const handleEdit = useCallback(
    async (row) => {
      const entcrId = row.original.entcr_id

      // Fetch complete entity data
      const fullEntityData = await fetchEntityForEdit(entcrId)

      if (fullEntityData) {
        setEditingEntity(fullEntityData)

        // Helper function to convert array to string for TextArea
        const formatObjectiveForDisplay = (objective) => {
          if (Array.isArray(objective)) {
            return objective.filter((item) => item && item.trim()).join("\n")
          }
          return objective || ""
        }

        // Helper function to format is_cordinator for display
        const formatis_cordinatorForDisplay = (entityData) => {
          // Check both possible field names
          const coordinatorValue = entityData.is_cordinator || entityData.is_cordinator

          if (typeof coordinatorValue === "boolean") {
            return coordinatorValue ? "active" : "inactive"
          }
          if (coordinatorValue === "true" || coordinatorValue === true) {
            return "active"
          }
          if (coordinatorValue === "false" || coordinatorValue === false) {
            return "inactive"
          }
          return coordinatorValue || ""
        }

        // Map all editable fields for the form
        const editableData = {
          entity_name: fullEntityData.entity_name || "",
          is_cordinator: formatis_cordinatorForDisplay(fullEntityData),
          mission: fullEntityData.mission || "",
          vision: fullEntityData.vision || "",
          objective: formatObjectiveForDisplay(fullEntityData.objective),
        }

        console.log("Full entity data:", fullEntityData) // Debug log
        console.log("Setting form values:", editableData) // Debug log

        form.setFieldsValue(editableData)
        setDrawerVisible(true)
      }
    },
    [form],
  )

  const handleDelete = useCallback(async (row) => {
    const entcrId = row.original.entcr_id

    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      })

      if (result.isConfirmed) {
        const response = await apiClient.delete(`delete_entity_request/${entcrId}/`)

        if (response.status === 200 || response.status === 204) {
          // Remove from local state
          setEntities((prevEntities) => prevEntities.filter((entity) => entity.entcr_id !== entcrId))
          setFilteredEntities((prevEntities) => prevEntities.filter((entity) => entity.entcr_id !== entcrId))

          // Show success message
          Swal.fire("Deleted!", "Entity has been deleted.", "success")
        } else {
          throw new Error("Delete failed")
        }
      }
    } catch (error) {
      console.error("Error deleting entity:", error)
      Swal.fire("Error!", "Failed to delete entity. Please try again.", "error")
    }
  }, [])

  const onDrawerClose = () => {
    setDrawerVisible(false)
    setEditingEntity(null)
    form.resetFields()
  }

  const onFinish = async (values) => {
    setIsLoading(true)
    try {
      // Helper function to convert string to string (not array) for objective
      const formatObjectiveForSubmission = (objective) => {
        if (typeof objective === "string") {
          // Keep as string, just clean up extra whitespace
          return objective.trim()
        }
        if (Array.isArray(objective)) {
          // Convert array to string
          return objective.filter((item) => item && item.trim()).join("\n")
        }
        return objective || ""
      }

      // Helper function to convert is_cordinator to the format expected by backend
      const formatis_cordinatorForSubmission = (is_cordinator) => {
        if (is_cordinator === "active") return "active"
        if (is_cordinator === "inactive") return "inactive"
        return is_cordinator
      }

      // Prepare payload with only editable fields
      const payload = {
        entity_name: values.entity_name,
        is_cordinator: formatis_cordinatorForSubmission(values.is_cordinator), // Use is_cordinator for backend
        mission: values.mission || "",
        vision: values.vision || "",
        objective: formatObjectiveForSubmission(values.objective), // Send as string, not array
        dept_id: values.dept_id,
        sdg_id: values.sdg_id,
      }

      console.log("Submitting payload:", payload) // Debug log

      const response = await apiClient.put(`update-entity-request-all/${editingEntity.entcr_id}/`, payload)

      if (response.status === 200) {
        // Show success popup
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Entity updated successfully",
          timer: 2000,
          showConfirmButton: false,
        })

        // Refresh the entire entities list from server
        await fetchEntities(user.access)

        onDrawerClose()
      } else {
        throw new Error("Update failed")
      }
    } catch (error) {
      console.error("Error updating entity:", error)

      // Show error popup with more details
      let errorMessage = "An error occurred while updating entity. Please try again."
      if (error.response && error.response.data) {
        errorMessage = JSON.stringify(error.response.data)
      }

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleView = (row) => {
    setEditingEntity(row.original)
    setViewModalVisible(true)
  }

  const handleViewMore = (row) => {
    setSelectedEntityDetails(row.original)
    setViewMoreDrawerVisible(true)
  }

  const onViewMoreDrawerClose = () => {
    setViewMoreDrawerVisible(false)
    setSelectedEntityDetails(null)
  }

  const handleStatusChange = useCallback((row, value) => {
    // Don't allow status change if already approved
    if (row.original.status === "Approved") {
      return
    }
    
    setSelectedEntityId(row.original.entcr_id)
    setSelectedStatus(value)
    setStatusModalVisible(true)
  }, [])

  const handleStatusConfirm = useCallback(async () => {
    try {
      const payload = {
        status: selectedStatus,
        remark: remark,
      }

      const response = await apiClient.put(`entity-request/${selectedEntityId}/`, payload)

      if (response.status === 200) {
        Swal.fire({
          title:"Status updated successfully",
          icon:"success"
        })

        const updatedEntities = entities.map((entity) =>
          entity.entcr_id === selectedEntityId ? { ...entity, status: selectedStatus } : entity,
        )

        setEntities(updatedEntities)
        applyFilters(updatedEntities)
      } else {
        message.error("Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      message.error("An error occurred while updating status")
    }

    setStatusModalVisible(false)
    setRemark("")
  }, [selectedStatus, remark, selectedEntityId, entities])

  const handleRegisterNow = useCallback(
    async (entityId) => {
      try {
        const payload = {
          entcr_id : entityId
        }
        const response = await apiClient.post(`register_request/`, payload)

        console.log(response, "RESSSSSSS")

        if (response.status === 200) {
          Swal.fire({
            title: `${response?.data?.message}`,
            icon:"success"
          })
          fetchEntities(user.access)
        } else {
          message.error("Failed to register entity")
            Swal.fire({
            title: "Failed to register entity",
            icon:"error"
          })
        }
      } catch (error) {
        console.error("Error registering entity:", error)
        message.error("An error occurred while registering entity")
      }
    },
    [user],
  )

  const StatusCellRenderer = ({ row, value }) => {
   
    if (value === "Approved") {
      return (
        <div>
         
          <button
            className={styles.registerButton}
            onClick={(e) => {
              e.stopPropagation()
              handleRegisterNow(row.original.entcr_id)
            }}
            style={{ marginTop: "8px", width: "100%" }}
          >
            Register Now
          </button>
        </div>
      )
    }
    
    // For other statuses, show the dropdown
    const statusOptions = ["Pending", "Approved", "Interview Scheduled", "Rejected", "Request Hold"]

    return (
      <div>
        <Select value={value} onChange={(value) => handleStatusChange(row, value)} style={{ width: "100%" }}>
          {statusOptions.map((status) => (
            <Select.Option key={status} value={status}>
              {status}
            </Select.Option>
          ))}
        </Select>
      </div>
    )
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, i) => i + 1,
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: "Request No",
        accessor: "req_no",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className={styles.actionButtons}>
            <button className={styles.actionButton} onClick={() => handleEdit(row)} title="Edit">
              Edit
            </button>
            <button className={styles.actionButton} onClick={() => handleDelete(row)} title="Delete">
              Delete
            </button>
            <button className={styles.actionButton} onClick={() => handleViewMore(row)} title="View More">
              View Details
            </button>
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: StatusCellRenderer,
      },
      {
        Header: "Proposed Name",
        accessor: "proposed_name",
      },

      {
        Header: "Proposed By",
        accessor: "proposed_by",
      },
      {
        Header: "Proposer Name",
        accessor: "proposer_name",
      },

      {
        Header: "Entity Name",
        accessor: "entity_name",
      },
      {
        Header: "Department",
        accessor: "department_name",
      },

      {
        Header: "Is Coordinator",
        accessor: "is_cordinator", // Keep as is_cordinator for table display consistency
      },
    ],
    [handleEdit, handleDelete, handleStatusChange],
  )

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

            // Handle special cases
            if (field.accessor === "sdg" && Array.isArray(value)) {
              value = value.join("; ")
            }

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
    link.setAttribute("download", "entities_complete_details.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Show success message
    message.success(`Downloaded ${filteredEntities.length} entities with complete details`)
  }

  const renderSection = (title, fields) => (
    <>
      <tr className={styles.sectionHeader}>
        <td colSpan="2">{title}</td>
      </tr>
      {fields.map(([label, key]) => (
        <tr key={key}>
          <td>{label}</td>
          <td>
            {key === "sdg" && Array.isArray(selectedEntityDetails?.[key])
              ? selectedEntityDetails[key].join(", ")
              : key === "objective" && Array.isArray(selectedEntityDetails?.[key])
                ? selectedEntityDetails[key].join(", ")
                : selectedEntityDetails?.[key] || "N/A"}
          </td>
        </tr>
      ))}
    </>
  )

  // Filter functions
  const applyFilters = (data = entities) => {
    let filtered = [...data]

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter((entity) => entity.status === activeTab)
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (entity) =>
          (entity.proposed_name && entity.proposed_name.toLowerCase().includes(query)) ||
          (entity.proposer_name && entity.proposer_name.toLowerCase().includes(query)) ||
          (entity.entity_name && entity.entity_name.toLowerCase().includes(query)) ||
          (entity.department_name && entity.department_name.toLowerCase().includes(query)),
      )
    }

    // Apply dropdown filters
    if (proposedByFilter) {
      filtered = filtered.filter((entity) => entity.proposed_by === proposedByFilter)
    }

    if (proposeNameFilter) {
      filtered = filtered.filter((entity) => entity.proposed_name === proposeNameFilter)
    }

    if (proposerNameFilter) {
      filtered = filtered.filter((entity) => entity.proposer_name === proposerNameFilter)
    }

    if (entityNatureFilter) {
      filtered = filtered.filter((entity) => entity.entity_nature === entityNatureFilter)
    }

    if (statusFilter) {
      filtered = filtered.filter((entity) => entity.status === statusFilter)
    }

    if (entityNameFilter) {
      filtered = filtered.filter((entity) => entity.entity_name === entityNameFilter)
    }

    if (departmentFilter) {
      filtered = filtered.filter((entity) => entity.department_name === departmentFilter)
    }

    if (sessionFilter) {
      filtered = filtered.filter((entity) => entity.session === sessionFilter)
    }

    if (proposedDateFilter) {
      const filterDate = moment(proposedDateFilter).format("YYYY-MM-DD")
      filtered = filtered.filter((entity) => {
        if (!entity.proposed_date) return false
        return moment(entity.proposed_date).format("YYYY-MM-DD") === filterDate
      })
    }

    setFilteredEntities(filtered)
  }

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    // Reset other filters when changing tabs
    resetFilters(false)
  }

  // Reset all filters
  const resetFilters = (resetTab = true) => {
    if (resetTab) setActiveTab("all")
    setSearchQuery("")
    setProposedDateFilter(null)
    setProposedByFilter("")
    setProposerNameFilter("")
    setProposeNameFilter("")
    setEntityNatureFilter("")
    setStatusFilter("")
    setEntityNameFilter("")
    setDepartmentFilter("")
    setSessionFilter("")
    setFilteredEntities(entities)
  }

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters()
  }, [
    activeTab,
    searchQuery,
    proposedDateFilter,
    proposedByFilter,
    proposerNameFilter,
    proposeNameFilter,
    entityNatureFilter,
    statusFilter,
    entityNameFilter,
    departmentFilter,
    sessionFilter,
  ])

  // Setup react-table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
  } = useTable(
    {
      columns,
      data: filteredEntities,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  const handleApprove = async () => {
    try {
      const response = await apiClient.post("convert-json/")
      if (response?.status === 201) {
        message.success("Approved Request will be regestered.")
        Swal.fire({
          icon: "success",
          title: "Requests Approved",
          text: "Approved Request will be regestered.",
        })
      }
    } catch (error) {
      console.error("Error approving request:", error)
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "Please try again later.",
      })
    }
  }

  return (
    <div className={styles.entityTableContainer}>
      <h3>Entity Request</h3>
      <div className={styles.tabsContainer}>
        <div
          className={`${styles.tab} ${activeTab === "all" ? styles.activeTab : ""}`}
          onClick={() => handleTabChange("all")}
        >
          All Entities ({tabCounts.all})
        </div>
        <div
          className={`${styles.tab} ${activeTab === "Approved" ? styles.activeTab : ""}`}
          onClick={() => handleTabChange("Approved")}
        >
          Approved ({tabCounts["Approved"]})
        </div>
        <div
          className={`${styles.tab} ${activeTab === "Pending" ? styles.activeTab : ""}`}
          onClick={() => handleTabChange("Pending")}
        >
          Pending ({tabCounts["Pending"]})
        </div>
        <div
          className={`${styles.tab} ${activeTab === "Interview Scheduled" ? styles.activeTab : ""}`}
          onClick={() => handleTabChange("Interview Scheduled")}
        >
          Interview Scheduled ({tabCounts["Interview Scheduled"]})
        </div>
        <div
          className={`${styles.tab} ${activeTab === "Rejected" ? styles.activeTab : ""}`}
          onClick={() => handleTabChange("Rejected")}
        >
          Rejected ({tabCounts["Rejected"]})
        </div>
        <div
          className={`${styles.tab} ${activeTab === "Request Hold" ? styles.activeTab : ""}`}
          onClick={() => handleTabChange("Request Hold")}
        >
          Request Hold ({tabCounts["Request Hold"]})
        </div>
      </div>

      <div className={styles.searchAndFilterContainer}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entities..."
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterButtons}>
          <button className={styles.filterToggleButton} onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <button className={styles.resetButton} onClick={() => resetFilters()}>
            Reset Filters
          </button>
          <button className={styles.downloadButton} onClick={downloadCSV}>
            Download CSV
          </button>
          <Popover title="Register all entity with single click!">
            <button onClick={handleApprove} className={styles.downloadButton}>
              Confirm Approval
            </button>
          </Popover>
        </div>
      </div>

      {showFilters && (
        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <label>Proposed Date:</label>
            <DatePicker
              value={proposedDateFilter ? moment(proposedDateFilter) : null}
              onChange={(date) => setProposedDateFilter(date)}
              className={styles.filterInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>Proposed By:</label>
            <Select
              value={proposedByFilter}
              onChange={(value) => setProposedByFilter(value)}
              className={styles.filterInput}
              allowClear
              placeholder="Select Proposer"
            >
              {getUniqueValues(entities, "proposed_by").map((value) => (
                <Select.Option key={value} value={value}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className={styles.filterGroup}>
            <label>Proposer Name:</label>
            <Select
              value={proposerNameFilter}
              onChange={(value) => setProposerNameFilter(value)}
              className={styles.filterInput}
              allowClear
              placeholder="Select Name"
            >
              {getUniqueValues(entities, "proposer_name").map((value) => (
                <Select.Option key={value} value={value}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className={styles.filterGroup}>
            <label>Status:</label>
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              className={styles.filterInput}
              allowClear
              placeholder="Select Status"
            >
              {["Pending", "Approved", "Interview Scheduled", "Rejected", "Request Hold"].map((value) => (
                <Select.Option key={value} value={value}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className={styles.filterGroup}>
            <label>Entity Name:</label>
            <Select
              value={proposeNameFilter}
              onChange={(value) => setProposeNameFilter(value)}
              className={styles.filterInput}
              allowClear
              placeholder="Select Entity"
            >
              {getUniqueValues(entities, "proposed_name").map((value) => (
                <Select.Option key={value} value={value}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className={styles.filterGroup}>
            <label>Department:</label>
            <Select
              value={departmentFilter}
              onChange={(value) => setDepartmentFilter(value)}
              className={styles.filterInput}
              allowClear
              placeholder="Select Department"
            >
              {getUniqueValues(entities, "department_name").map((value) => (
                <Select.Option key={value} value={value}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className={styles.filterGroup}>
            <label>Session:</label>
            <Select
              value={sessionFilter}
              onChange={(value) => setSessionFilter(value)}
              className={styles.filterInput}
              allowClear
              placeholder="Select Session"
            >
              {getUniqueValues(entities, "session").map((value) => (
                <Select.Option key={value} value={value}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table {...getTableProps()} className={styles.table}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={styles.tableHeader}
                    key={column.id}
                  >
                    {column.render("Header")}
                    <span className={styles.sortIcon}>
                      {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.length > 0 ? (
              page.map((row) => {
                prepareRow(row)
                return (
                  <tr
                    {...row.getRowProps()}
                    className={`${styles.tableRow} ${
                      !row.original.session || row.original.session.trim() === null ? styles.errorRow : ""
                    }`}
                    key={row.id}
                  >
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className={styles.tableCell} key={cell.column.id}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className={styles.noDataMessage}>
                  No entities found matching the current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className={styles.paginationButton}>
          {"<<"}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage} className={styles.paginationButton}>
          {"<"}
        </button>
        <span className={styles.pageInfo}>
          Page{" "}
          <strong>
            {state.pageIndex + 1} of {pageOptions.length || 1}
          </strong>
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage} className={styles.paginationButton}>
          {">"}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className={styles.paginationButton}>
          {">>"}
        </button>
        <select
          value={state.pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
          }}
          className={styles.pageSizeSelect}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      {/* Modified Edit Drawer - Only Editable Fields */}
      <Drawer
        title="Edit Entity"
        placement="right"
        onClose={onDrawerClose}
        visible={drawerVisible}
        width={600}
        destroyOnClose={true}
      >
        {loadingEdit ? (
          <div style={{ textAlign: "center", padding: "20px" }}>Loading entity data...</div>
        ) : (
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="entcr_id" hidden>
              <Input />
            </Form.Item>

            {/* Display Non-Editable Reference Information */}
            <div
              style={{
                marginBottom: "24px",
                padding: "16px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                border: "1px solid #e9ecef",
              }}
            >
              <h3
                style={{
                  marginBottom: "16px",
                  color: "#333",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                Reference Information (Non-Editable)
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <label
                    style={{
                      fontWeight: "600",
                      color: "#666",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Proposer Name:
                  </label>
                  <span
                    style={{
                      color: "#333",
                      fontSize: "14px",
                      padding: "6px 8px",
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontFamily: "monospace",
                    }}
                  >
                    {editingEntity?.proposer_name}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <label
                    style={{
                      fontWeight: "600",
                      color: "#666",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Current Is Coordinator:
                  </label>
                  <span
                    style={{
                      color: "#333",
                      fontSize: "14px",
                      padding: "6px 8px",
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontFamily: "monospace",
                    }}
                  >
                    {editingEntity?.is_cordinator || editingEntity?.is_cordinator || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Editable Fields Section */}
            <div style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  marginBottom: "20px",
                  color: "#333",
                  fontSize: "16px",
                  fontWeight: "600",
                  borderBottom: "2px solid #1890ff",
                  paddingBottom: "8px",
                }}
              >
                Editable Information
              </h3>

              <Form.Item
                name="entity_name"
                label="Entity Name"
                rules={[{ required: true, message: "Please enter entity name" }]}
              >
                <Input placeholder="Enter entity name" />
              </Form.Item>

              <Form.Item
                name="is_cordinator"
                label="Coordinator Status"
                rules={[
                  {
                    required: true,
                    message: "Please select coordinator status",
                  },
                ]}
              >
                <Select placeholder="Select coordinator status">
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="inactive">Inactive</Select.Option>
                </Select>
              </Form.Item>

              {/* Mission Field */}
              <Form.Item name="mission" label="Mission">
                <TextArea rows={4} placeholder="Enter mission statement" />
              </Form.Item>

              {/* Vision Field */}
              <Form.Item name="vision" label="Vision">
                <TextArea rows={4} placeholder="Enter vision statement" />
              </Form.Item>

              {/* Single Objective Field */}
              <Form.Item name="objective" label="Objectives">
                <TextArea rows={6} placeholder="Enter objectives (one per line)" style={{ resize: "vertical" }} />
              </Form.Item>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
                paddingTop: "20px",
                borderTop: "1px solid #e9ecef",
                marginTop: "20px",
              }}
            >
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Update Entity
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={onDrawerClose}>
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Drawer>

      <Modal
        title="Referral"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={600}
      >
        <div dangerouslySetInnerHTML={{ __html: editingEntity?.referal || "" }} />
      </Modal>

      <Drawer
        title="Entity Details"
        placement="right"
        onClose={onViewMoreDrawerClose}
        visible={viewMoreDrawerVisible}
        width={800}
      >
        {viewMoreDrawerVisible && (
          <div className={styles.drawerContent}>
            <h2>Entity Details</h2>
            <table className={styles.entityDetailsTable}>
              <tbody>
                {renderSection("Basic Information", [
                  ["Request Number", "req_no"],
                  ["Proposed Name", "proposed_name"],
                  ["Proposed Date", "proposed_date"],
                  ["Proposed By", "proposed_by"],
                  ["Proposer Name", "proposer_name"],
                  ["Proposer Email", "proposer_email"],
                  ["Employee Code", "emp_code"],
                  ["Mobile", "mobile"],
                  ["Status", "status"],
                  ["Session", "session"],
                  ["Is Coordinator", "is_cordinator"], // Use is_cordinator for consistency
                ])}

                {renderSection("Entity Information", [
                  ["Entity ID", "entity_id"],
                  ["Entity Name", "entity_name"],
                  ["Department ID", "dept_id"],
                  ["Department Name", "department_name"],
                ])}

                {renderSection("Mission Vision & Objective", [
                  ["Mission", "mission"],
                  ["Vision", "vision"],
                  ["Objectives", "objective"],
                ])}

                {renderSection("SDG Information", [
                  ["SDG", "sdg"],
                  ["SDG ID", "sdg_id"],
                ])}

                {renderSection("Student Section 1", [
                  ["Name", "student_sec_1_name"],
                  ["Email", "student_sec_1_email"],
                  ["UID", "student_sec_1_uid"],
                  ["Mobile", "student_sec_1_mobile"],
                  ["Department", "student_sec_1_dept"],
                  ["Department ID", "student_sec_1_dept_id"],
                ])}

                {renderSection("Student Advisor Section 1", [
                  ["Name", "student_advsec_1_name"],
                  ["Email", "student_advsec_1_email"],
                  ["UID", "student_advsec_1_uid"],
                  ["Mobile", "student_advsec_1_mobile"],
                  ["Department", "student_advsec_1_dept"],
                  ["Department ID", "student_advsec_1_dept_id"],
                ])}

                {renderSection("Faculty Advisor 1", [
                  ["Name", "faculty_adv_1_name"],
                  ["Email", "faculty_adv_1_email"],
                  ["Emp Code", "faculty_adv_1_empcode"],
                  ["Mobile", "faculty_adv_1_mobile"],
                  ["Department", "faculty_adv_1_dept"],
                  ["Department ID", "faculty_adv_1_dept_id"],
                ])}

                {renderSection("Faculty Co-Advisor 1", [
                  ["Name", "faculty_coadv_1_name"],
                  ["Email", "faculty_coadv_1_email"],
                  ["Emp Code", "faculty_coadv_1_empcode"],
                  ["Mobile", "faculty_coadv_1_mobile"],
                  ["Department", "faculty_coadv_1_dept"],
                  ["Department ID", "faculty_coadv_1_dept_id"],
                ])}
              </tbody>
            </table>
            <button className={styles.closeButton} onClick={onViewMoreDrawerClose}>
              Close
            </button>
          </div>
        )}
      </Drawer>

      <Modal
        title="Confirm Status Change"
        visible={statusModalVisible}
        onOk={handleStatusConfirm}
        onCancel={() => setStatusModalVisible(false)}
      >
        <p>Are you sure you want to change the status to {selectedStatus}?</p>
        <Form.Item label="Remark">
          <TextArea
            rows={4}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter your remark here"
          />
        </Form.Item>
      </Modal>
    </div>
  )
}

export default EntityTable
