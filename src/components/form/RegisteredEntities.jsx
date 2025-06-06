"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Drawer, Form, Input, Button, Modal, message, Tag, Select, Popover } from "antd"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import mail from "../../assets/images/mail.png"
import styles from "./RegisteredEntitiesTable.module.css"
import apiClient from "../../config/apiClient"

// Import modern table components
import { useTable, useSortBy, useFilters, usePagination, useGlobalFilter } from "react-table"
import Swal from "sweetalert2"

function RegisteredEntities() {
  const [entities, setEntities] = useState([])
  const [filteredEntities, setFilteredEntities] = useState([])
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [mailDrawerVisible, setMailDrawerVisible] = useState(false)
  const [editingEntity, setEditingEntity] = useState(null)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [mailForm] = Form.useForm()
  const [user, setUser] = useState(null)
  const [emails, setEmails] = useState([])
  const navigate = useNavigate()
  const [viewMoreDrawerVisible, setViewMoreDrawerVisible] = useState(false)
  const [selectedEntityDetails, setSelectedEntityDetails] = useState(null)
  const [departments, setDepartments] = useState([])
  const [entityTypes, setEntityTypes] = useState([])
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [entityNameFilter, setEntityNameFilter] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [registrationCodeFilter, setRegistrationCodeFilter] = useState("")
  const [registrationNameFilter, setRegistrationNameFilter] = useState("")
  const [facultyAdvisorFilter, setFacultyAdvisorFilter] = useState("")
  const [sessionFilter, setSessionFilter] = useState("")

  // Get unique values for filters
  const getUniqueValues = (data, key) => {
    return [...new Set(data.map((item) => item[key]).filter(Boolean))]
  }

  useEffect(() => {
    apiClient
      .get("entity-registration/")
      .then((response) => {
        setEntities(response.data)
        setFilteredEntities(response.data)
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
      })

    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        fetchDepartments()
        fetchEntityTypes()
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("user")
        navigate("/login")
      }
    } else {
      navigate("/login")
    }
  }, [navigate])

  const fetchDepartments = async () => {
    try {
      const response = await apiClient.get("departments/")
      setDepartments(response.data)
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  const fetchEntityTypes = async () => {
    try {
      const response = await apiClient.get("entity-types/")
      setEntityTypes(response.data)
    } catch (error) {
      console.error("Error fetching entity types:", error)
    }
  }

  // Calculate counts for summary cards
  const getTotalCount = () => filteredEntities.length

  const getEntityTypeCount = (entityType) => {
    return entities.filter((entity) => entity.entity_name === entityType).length
  }

  const getDepartmentCount = (department) => {
    return entities.filter((entity) => entity.department_name === department).length
  }

  // Get top entity types and departments for cards
  const getTopEntityTypes = () => {
    const entityTypeCounts = {}
    entities.forEach((entity) => {
      if (entity.entity_name) {
        entityTypeCounts[entity.entity_name] = (entityTypeCounts[entity.entity_name] || 0) + 1
      }
    })
    return Object.entries(entityTypeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name)
  }

  const getTopDepartments = () => {
    const departmentCounts = {}
    entities.forEach((entity) => {
      if (entity.department_name) {
        departmentCounts[entity.department_name] = (departmentCounts[entity.department_name] || 0) + 1
      }
    })
    return Object.entries(departmentCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name)
  }

  const handleEdit = useCallback(
    (row) => {
      setEditingEntity(row.original)
      form.setFieldsValue(row.original)
      setDrawerVisible(true)
    },
    [form],
  )

  const handleDelete = useCallback(async (row) => {
    const entityId = row.original.reg_id
    const entityName = row.original.registeration_name || "this entity"

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${entityName}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    })

    if (result.isConfirmed) {
      try {
        const response = await apiClient.delete(`entity-registration/${entityId}/`)

        if (response.status === 200 || response.status === 204) {
          // Remove the entity from both entities and filteredEntities state
          setEntities((prevEntities) => prevEntities.filter((entity) => entity.reg_id !== entityId))
          setFilteredEntities((prevEntities) => prevEntities.filter((entity) => entity.reg_id !== entityId))

          message.success("Entity deleted successfully")
          Swal.fire({
            title: "Deleted!",
            text: "The entity has been deleted successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          })
        } else {
          message.error("Failed to delete entity")
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the entity. Please try again.",
            icon: "error",
          })
        }
      } catch (error) {
        console.error("Error deleting entity:", error)
        message.error("An error occurred while deleting entity")
        Swal.fire({
          title: "Error!",
          text: "An error occurred while deleting the entity. Please try again.",
          icon: "error",
        })
      }
    }
  }, [])

  const onFinish = async (values) => {
    try {
      // Find the entity and department names for display
      const selectedEntity = entityTypes.find((entity) => entity.entity_id === values.entity_id)
      const selectedDepartment = departments.find((dept) => dept.department === values.department)

      // Store the names for display in the table
      values.entity_name = selectedEntity ? selectedEntity.entity_name : ""
      values.department_name = selectedDepartment ? selectedDepartment.dept_name : ""

      // Send the request
      const response = await apiClient.put(`update-entity/${editingEntity.reg_id}/`, values)

      if (response.status === 200) {
       Swal.fire({
        title:`${response?.data?.message}`,
        icon: "success"
       })

        setEntities((prevEntities) =>
          prevEntities.map((entity) => (entity.reg_id === editingEntity.reg_id ? { ...entity, ...values } : entity)),
        )

        // Update filtered entities as well
        setFilteredEntities((prevEntities) =>
          prevEntities.map((entity) => (entity.reg_id === editingEntity.reg_id ? { ...entity, ...values } : entity)),
        )

        onDrawerClose()
      } else {
        message.error("Failed to update entity")
      }
    } catch (error) {
      console.error("Error updating entity:", error)
      message.error("An error occurred while updating entity")
    }
  }

  const handleSendMail = useCallback(
    (row) => {
      setEditingEntity(row.original)
      mailForm.setFieldsValue({
        entity_request_id: row.original.reg_id,
      })
      setMailDrawerVisible(true)
    },
    [mailForm],
  )

  const onDrawerClose = () => {
    setDrawerVisible(false)
    setEditingEntity(null)
    form.resetFields()
  }

  const onMailDrawerClose = () => {
    setMailDrawerVisible(false)
    mailForm.resetFields()
    setEmails([])
  }

  const onMailFinish = (values) => {
    Modal.confirm({
      title: "Are you sure you want to send emails?",
      onOk() {
        const payload = {
          ...values,
          receiver_emails: emails,
          user_id: user?.user_id || null,
        }
        apiClient
          .post("send-email/", payload)
          .then((response) => {
            message.success("Email sent successfully")
            onMailDrawerClose()
          })
          .catch((error) => {
            console.error("Error sending email:", error)
            message.error("Failed to send email")
          })
      },
    })
  }

  const handleEmailInputChange = (e) => {
    const inputValue = e.target.value
    if (inputValue.endsWith(",") || inputValue.endsWith(" ")) {
      const newEmail = inputValue.slice(0, -1).trim()
      if (isValidEmail(newEmail) && !emails.includes(newEmail)) {
        setEmails([...emails, newEmail])
        e.target.value = ""
      }
    }
  }

  const isValidEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  const removeEmail = (emailToRemove) => {
    setEmails(emails.filter((email) => email !== emailToRemove))
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

  const columns = React.useMemo(
    () => [
      {
        Header: "Entity",
        accessor: "entity_name",
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
            <button className={styles.actionButton} onClick={() => handleSendMail(row)} title="Send Mail">
              <img style={{ width: "16px", marginRight: "4px" }} src={mail || "/placeholder.svg"} alt="mail" />
              Mail
            </button>
            <button className={styles.actionButton} onClick={() => handleViewMore(row)} title="View More">
              Details
            </button>
          </div>
        ),
      },
      {
        Header: "Department",
        accessor: "department_name",
      },
      {
        Header: "Registration Code",
        accessor: "registeration_code",
      },
      {
        Header: "Coordinator",
        accessor: "is_cordinator",
      },
      {
        Header: "Faculty Co Mobile",
        accessor: "faculty_co_advisory_mobile",
      },
      {
        Header: "Registration Name",
        accessor: "registeration_name",
      },
      {
        Header: "Faculty Advisor Name",
        accessor: "faculty_advisory_name",
      },
      {
        Header: "Faculty Advisor Email",
        accessor: "faculty_advisory_email",
      },
      {
        Header: "Faculty Co-Advisor Name",
        accessor: "faculty_co_advisory_name",
      },
      {
        Header: "Faculty Co-Advisor Email",
        accessor: "faculty_co_advisory_email",
      },
      {
        Header: "Secretary Name",
        accessor: "Secretary_name",
      },
      {
        Header: "Secretary Email",
        accessor: "Secretary_email",
      },
      {
        Header: "Joint Secretary Name",
        accessor: "Joint_Secretary_name",
      },
      {
        Header: "Joint Secretary Email",
        accessor: "Joint_Secretary_email",
      },
      {
        Header: "Session",
        accessor: "session_code",
      },
    
    ],
    [handleEdit, handleDelete, handleSendMail],
  )

  // Filter functions
  const applyFilters = (data = entities) => {
    let filtered = [...data]

    // Apply tab filter
    if (activeTab !== "all") {
      if (activeTab.startsWith("entity:")) {
        const entityName = activeTab.replace("entity:", "")
        filtered = filtered.filter((entity) => entity.entity_name === entityName)
      } else if (activeTab.startsWith("dept:")) {
        const deptName = activeTab.replace("dept:", "")
        filtered = filtered.filter((entity) => entity.department_name === deptName)
      }
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (entity) =>
          (entity.entity_name && entity.entity_name.toLowerCase().includes(query)) ||
          (entity.department_name && entity.department_name.toLowerCase().includes(query)) ||
          (entity.registeration_name && entity.registeration_name.toLowerCase().includes(query)) ||
          (entity.registeration_code && entity.registeration_code.toLowerCase().includes(query)) ||
          (entity.faculty_advisory_name && entity.faculty_advisory_name.toLowerCase().includes(query)),
      )
    }

    // Apply dropdown filters
    if (entityNameFilter) {
      filtered = filtered.filter((entity) => entity.entity_name === entityNameFilter)
    }

    if (departmentFilter) {
      filtered = filtered.filter((entity) => entity.department_name === departmentFilter)
    }

    if (registrationCodeFilter) {
      filtered = filtered.filter((entity) => entity.registeration_code === registrationCodeFilter)
    }

    if (registrationNameFilter) {
      filtered = filtered.filter((entity) => entity.registeration_name === registrationNameFilter)
    }

    if (facultyAdvisorFilter) {
      filtered = filtered.filter((entity) => entity.faculty_advisory_name === facultyAdvisorFilter)
    }

    if (sessionFilter) {
      filtered = filtered.filter((entity) => entity.session_code === sessionFilter)
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
    setEntityNameFilter("")
    setDepartmentFilter("")
    setRegistrationCodeFilter("")
    setRegistrationNameFilter("")
    setFacultyAdvisorFilter("")
    setSessionFilter("")
    setFilteredEntities(entities)
  }

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters()
  }, [
    activeTab,
    searchQuery,
    entityNameFilter,
    departmentFilter,
    registrationCodeFilter,
    registrationNameFilter,
    facultyAdvisorFilter,
    sessionFilter,
  ])

  const downloadCSV = () => {
    // Create CSV content
    const headers = columns
      .map((col) => col.Header)
      .filter((header) => header !== undefined && header !== "Actions")
      .join(",")
    const rows = filteredEntities
      .map((entity) => {
        return columns
          .filter((col) => col.accessor)
          .map((col) => {
            const value = entity[col.accessor]
            return value !== undefined ? `"${value}"` : '""'
          })
          .join(",")
      })
      .join("\n")

    const csvContent = `${headers}\n${rows}`

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "registered_entities.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderEntityDetailsTable = () => {
    if (!selectedEntityDetails) return null

    const renderSection = (title, fields) => (
      <>
        <tr className={styles.sectionHeader}>
          <td colSpan="2">{title}</td>
        </tr>
        {fields.map(([label, key]) => (
          <tr key={key}>
            <td>{label}</td>
            <td>{selectedEntityDetails[key] || "N/A"}</td>
          </tr>
        ))}
      </>
    )

    return (
      <table className={styles.entityDetailsTable}>
        <tbody>
          {renderSection("Registration Details", [
            ["Registration Code", "registeration_code"],
            ["Registration Name", "registeration_name"],
            ["Entity", "entity"],
            ["Department", "department"],
            ["Session Code", "session_code"],
            ["Remarks", "remarks"],
          ])}
          {renderSection("Faculty Advisor", [
            ["Name", "faculty_advisory_name"],
            ["Email", "faculty_advisory_email"],
            ["Emp Code", "faculty_advisory_empcode"],
            ["Mobile", "faculty_advisory_mobile"],
          ])}
          {renderSection("Faculty Co-Advisor", [
            ["Name", "faculty_co_advisory_name"],
            ["Email", "faculty_co_advisory_email"],
            ["Emp Code", "faculty_co_advisory_empcode"],
            ["Mobile", "faculty_co_advisory_mobile"],
          ])}
          {renderSection("Secretary", [
            ["Name", "Secretary_name"],
            ["Email", "Secretary_email"],
            ["UID", "Secretary_uid"],
            ["Mobile", "Secretary_mobile"],
          ])}
          {renderSection("Joint Secretary", [
            ["Name", "Joint_Secretary_name"],
            ["Email", "Joint_Secretary_email"],
            ["UID", "Joint_Secretary_uid"],
            ["Mobile", "Joint_Secretary_mobile"],
          ])}
        </tbody>
      </table>
    )
  }

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

  // Get top entity types and departments for cards
  const topEntityTypes = getTopEntityTypes()
  const topDepartments = getTopDepartments()

  const bulkUploadUser = async () => {
    try {
      const response = await apiClient.post("/api/bulk-upload-users/")
      if (response?.status === 201) {
        message.success("User uploaded successfully")
        Swal.fire({
          icon: "success",
          title: "User uploaded successfully",
          text: "User creation process completed",
        })
      } else {
        message.error("Failed to upload user")
        Swal.fire({
          icon: "error",
          title: "Something went wrong!",
          text: "Please try again later.",
        })
      }
    } catch (error) {
      console.error("Error uploading user:", error)
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "Please try again later.",
      })
    }
  }

  return (
    <div className={styles.entityTableContainer}>
      <h3>Registered Entities</h3>


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
          <Popover title="Bulk user creation for registered entities.">
            <button onClick={bulkUploadUser} className={styles.downloadButton}>
              Bulk Upload User
            </button>
          </Popover>
        </div>
      </div>

 

      {showFilters && (
        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <label>Entity:</label>
            <Select
              value={entityNameFilter}
              onChange={(value) => setEntityNameFilter(value)}
              className={styles.filterInput}
              allowClear
              placeholder="Select Entity"
            >
              {getUniqueValues(entities, "entity_name").map((value) => (
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
            <label>Registration Code:</label>
            <Select
              value={registrationCodeFilter}
              onChange={(value) => setRegistrationCodeFilter(value)}
              className={styles.filterInput}
              allowClear
              placeholder="Select Code"
            >
              {getUniqueValues(entities, "registeration_code").map((value) => (
                <Select.Option key={value} value={value}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className={styles.filterGroup}>
            <label>Registration Name:</label>
            <Select
              value={registrationNameFilter}
              onChange={(value) => setRegistrationNameFilter(value)}
              className={styles.filterInput}
              allowClear
              placeholder="Select Name"
            >
              {getUniqueValues(entities, "registeration_name").map((value) => (
                <Select.Option key={value} value={value}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className={styles.filterGroup}>
            <label>Faculty Advisor:</label>
            <Select
              value={facultyAdvisorFilter}
              onChange={(value) => setFacultyAdvisorFilter(value)}
              className={styles.filterInput}
              allowClear
              placeholder="Select Advisor"
            >
              {getUniqueValues(entities, "faculty_advisory_name").map((value) => (
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
              {getUniqueValues(entities, "session_code").map((value) => (
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
                  <tr {...row.getRowProps()} className={styles.tableRow} key={row.id}>
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

      <Drawer title="Edit Entity" placement="right" onClose={onDrawerClose} visible={drawerVisible} width={400}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="entity_name" label="Entity Name">
            <Input />
          </Form.Item>
          <Form.Item name="department" label="Department Name" style={{ flex: 1 }}>
            <Select>
              {departments.map((dept) => (
                <Select.Option key={dept.department} value={dept.department}>
                  {dept.dept_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="registeration_name" label="Registration Name">
            <Input />
          </Form.Item>
          <Form.Item name="is_cordinator" label="Is Coordinator">
            <Input />
          </Form.Item>
          <Form.Item name="registeration_code" label="Registration Code">
            <Input />
          </Form.Item>

          <Form.Item name="faculty_advisory_name" label="Faculty Advisor Name">
            <Input />
          </Form.Item>
          <Form.Item name="faculty_advisory_empcode" label="Faculty Advisor Empcode">
            <Input />
          </Form.Item>
          <Form.Item name="faculty_advisory_email" label="Faculty Advisor Email">
            <Input />
          </Form.Item>
          <Form.Item name="faculty_advisory_mobile" label="Faculty Advisor Mobile">
            <Input />
          </Form.Item>
          <Form.Item name="faculty_co_advisory_name" label="Faculty Co-Advisor Name">
            <Input />
          </Form.Item>
          <Form.Item name="faculty_co_advisory_email" label="Faculty Co-Advisor Email">
            <Input />
          </Form.Item>
          <Form.Item name="faculty_co_advisory_empcode" label="Faculty Co-Advisor Empcode">
            <Input />
          </Form.Item>
          <Form.Item name="faculty_co_advisory_mobile" label="Faculty Co-Advisor Mobile">
            <Input />
          </Form.Item>
          <Form.Item name="Secretary_name" label="Secretary Name">
            <Input />
          </Form.Item>
          <Form.Item name="Secretary_email" label="Secretary Email">
            <Input />
          </Form.Item>
          <Form.Item name="Secretary_mobile" label="Secretary Mobile">
            <Input />
          </Form.Item>
          <Form.Item name="Joint_Secretary_name" label="Joint Secretary Name">
            <Input />
          </Form.Item>
          <Form.Item name="Joint_Secretary_email" label="Joint Secretary Email">
            <Input />
          </Form.Item>
          <Form.Item name="Joint_Secretary_mobile" label="Joint Secretary Mobile">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Entity
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer title="Send Mail" placement="right" onClose={onMailDrawerClose} visible={mailDrawerVisible} width={600}>
        <Form form={mailForm} layout="vertical" onFinish={onMailFinish}>
          <Form.Item label="Receiver Emails" required>
            <div className={styles.emailInputContainer}>
              {emails.map((email, index) => (
                <Tag key={index} closable onClose={() => removeEmail(email)}>
                  {email}
                </Tag>
              ))}
              <Input
                placeholder="Enter email addresses"
                onChange={handleEmailInputChange}
                style={{
                  background: isValidEmail(mailForm.getFieldValue("receiver_emails")) ? "#e6f7e6" : "white",
                }}
              />
            </div>
          </Form.Item>
          <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="body" label="Body" rules={[{ required: true }]}>
            <ReactQuill theme="snow" />
          </Form.Item>
          <Form.Item name="entity_request_id" label="Entity Request ID" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Send Mail
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        title="Entity Details"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={600}
      >
        {editingEntity && (
          <div>
            <p>
              <strong>Registration Code:</strong> {editingEntity.registeration_code}
            </p>
            <p>
              <strong>Registration Name:</strong> {editingEntity.registeration_name}
            </p>
            <p>
              <strong>Faculty Advisor:</strong> {editingEntity.faculty_advisory_name}
            </p>
            <p>
              <strong>Faculty Co-Advisor:</strong> {editingEntity.faculty_co_advisory_name}
            </p>
            <p>
              <strong>Secretary:</strong> {editingEntity.Secretary_name}
            </p>
            <p>
              <strong>Joint Secretary:</strong> {editingEntity.Joint_Secretary_name}
            </p>
            <p>
              <strong>Session:</strong> {editingEntity.session_code}
            </p>
          </div>
        )}
      </Modal>

      <Drawer
        title="Full Entity Details"
        placement="right"
        onClose={onViewMoreDrawerClose}
        visible={viewMoreDrawerVisible}
        width={600}
      >
        <div className={styles.drawerContent}>
          {renderEntityDetailsTable()}
          <button className={styles.closeButton} onClick={onViewMoreDrawerClose}>
            Close
          </button>
        </div>
      </Drawer>
    </div>
  )
}

export default RegisteredEntities
