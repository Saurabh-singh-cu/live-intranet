"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table"
import { Drawer, Form, Input, DatePicker, Select, Button, Modal, message, Tag } from "antd"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import moment from "moment"
import mail from "../../assets/images/mail.png"
import Swal from "sweetalert2"
import styles from "./EntityTable.module.css"
import apiClient from "../../config/apiClient"


const { TextArea } = Input

function EntityTable() {
  const [entities, setEntities] = useState([])
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
  const [statusModalVisible, setStatusModalVisible] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [remark, setRemark] = useState("")
  const [selectedEntityId, setSelectedEntityId] = useState(null)
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [textAreaValue, setTextAreaValue] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [entityTypes, setEntityTypes] = useState([])
  const [departments, setDepartments] = useState([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [sorting, setSorting] = useState([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [columnFilters, setColumnFilters] = useState({})
  const [activeFilters, setActiveFilters] = useState([])

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      if (parsedUser.access) {
        fetchEntities(parsedUser.access)
        fetchEntityTypes()
        fetchDepartments()
      } else {
        console.error("Access token not found in user data")
        navigate("/login")
      }
    } else {
      navigate("/login")
    }
  }, [navigate])

  const fetchEntities = async () => {
    try {
      const response = await apiClient.get("entity-requests/")
      setEntities(response.data)
    } catch (error) {
      console.error("Error fetching entities:", error)
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

  const fetchDepartments = async () => {
    try {
      const response = await apiClient.get("departments/")
      setDepartments(response.data)
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  // Fetch full entity data for editing
  const fetchEntityForEdit = async (entcrId) => {
    setLoadingEdit(true)
    try {
      const response = await apiClient.put(`update-entity-request-all/${entcrId}/`)
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

        // Find the entity and department IDs based on names
        const entityType = entityTypes.find((entity) => entity.entity_name === fullEntityData.entity_name)
        const department = departments.find((dept) => dept.dept_name === fullEntityData.department_name)

        // Format the date properly and set the IDs
        const formattedData = {
          ...fullEntityData,
          proposed_date: fullEntityData.proposed_date ? moment(fullEntityData.proposed_date) : null,
          entity_id: entityType ? entityType.entity_id : undefined,
          department: department ? department.department : undefined,
        }

        form.setFieldsValue(formattedData)
        setDrawerVisible(true)
      }
    },
    [form, entityTypes, departments],
  )

  const handleDelete = useCallback((row) => {
    console.log("Delete clicked for entity with ID:", row.original.entcr_id)
    setEntities((prevEntities) => prevEntities.filter((entity) => entity.entcr_id !== row.original.entcr_id))
  }, [])

  const handleSendMail = useCallback(
    (row) => {
      setEditingEntity(row.original)
      mailForm.setFieldsValue({
        entity_request_id: row.original.entcr_id,
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

  const onFinish = async (values) => {
    setIsLoading(true)
    try {
      // Ensure the date is in 'YYYY-MM-DD' format before sending
      if (values.proposed_date) {
        values.proposed_date = values.proposed_date.format("YYYY-MM-DD")
      }

      // Find the entity and department names for display
      const selectedEntity = entityTypes.find((entity) => entity.entity_id === values.entity_id)
      const selectedDepartment = departments.find((dept) => dept.department === values.department)

      // Store the names for display in the table
      values.entity_name = selectedEntity ? selectedEntity.entity_name : ""
      values.department_name = selectedDepartment ? selectedDepartment.dept_name : ""

      // Send the request
      const response = await apiClient.put(`update-entity-request-all/${editingEntity.entcr_id}/`, values)

      if (response.status === 200) {
        message.success("Entity updated successfully")

        setEntities((prevEntities) =>
          prevEntities.map((entity) =>
            entity.entcr_id === editingEntity.entcr_id ? { ...entity, ...values } : entity,
          ),
        )

        onDrawerClose()
        fetchEntities()
      } else {
        message.error("Failed to update entity")
      }
    } catch (error) {
      console.error("Error updating entity:", error)
      message.error("An error occurred while updating entity")
    } finally {
      setIsLoading(false)
    }
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
        message.success("Status updated successfully")

        setEntities((prevEntities) =>
          prevEntities.map((entity) =>
            entity.entcr_id === selectedEntityId ? { ...entity, status: selectedStatus } : entity,
          ),
        )
      } else {
        message.error("Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      message.error("An error occurred while updating status")
    }

    setStatusModalVisible(false)
    setRemark("")
  }, [selectedStatus, remark, selectedEntityId])

  const StatusCell = ({ row, getValue }) => {
    const statusOptions = ["Pending", "Approved", "Interview Scheduled", "Rejected", "Request Hold"]
    const currentStatus = getValue()
    
    const getStatusClass = (status) => {
      switch(status) {
        case 'Approved': return styles.statusApproved
        case 'Pending': return styles.statusPending
        case 'Interview Scheduled': return styles.statusScheduled
        case 'Rejected': return styles.statusRejected
        case 'Request Hold': return styles.statusHold
        default: return ''
      }
    }

    return (
      <div className={styles.statusContainer}>
        <div className={`${styles.statusBadge} ${getStatusClass(currentStatus)}`}>
          {currentStatus}
        </div>
        <Select 
          value={currentStatus} 
          onChange={(value) => handleStatusChange(row, value)} 
          className={styles.statusSelect}
          dropdownClassName={styles.statusDropdown}
        >
          {statusOptions.map((status) => (
            <Select.Option key={status} value={status}>
              {status}
            </Select.Option>
          ))}
        </Select>
      </div>
    )
  }

  const handleColumnFilter = (columnId, value) => {
    setColumnFilters(prev => ({
      ...prev,
      [columnId]: value
    }))
    
    if (value) {
      setActiveFilters(prev => {
        if (!prev.includes(columnId)) {
          return [...prev, columnId]
        }
        return prev
      })
    } else {
      setActiveFilters(prev => prev.filter(id => id !== columnId))
    }
  }

  const clearFilters = () => {
    setColumnFilters({})
    setActiveFilters([])
    setGlobalFilter('')
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: "proposed_name",
        header: "Proposed Name",
        enableSorting: true,
        cell: info => <div className={styles.cellContent}>{info.getValue()}</div>,
        footer: (props) => (
          <input
            className={styles.columnFilter}
            placeholder="Filter..."
            value={columnFilters.proposed_name || ''}
            onChange={e => handleColumnFilter('proposed_name', e.target.value)}
          />
        ),
      },
      {
        accessorKey: "proposed_date",
        header: "Proposed Date",
        enableSorting: true,
        cell: info => <div className={styles.cellContent}>{info.getValue()}</div>,
        footer: (props) => (
          <input
            className={styles.columnFilter}
            placeholder="Filter..."
            value={columnFilters.proposed_date || ''}
            onChange={e => handleColumnFilter('proposed_date', e.target.value)}
          />
        ),
      },
      {
        accessorKey: "proposed_by",
        header: "Proposed By",
        enableSorting: true,
        cell: info => <div className={styles.cellContent}>{info.getValue()}</div>,
        footer: (props) => (
          <input
            className={styles.columnFilter}
            placeholder="Filter..."
            value={columnFilters.proposed_by || ''}
            onChange={e => handleColumnFilter('proposed_by', e.target.value)}
          />
        ),
      },
      {
        accessorKey: "proposer_name",
        header: "Proposer Name",
        enableSorting: true,
        cell: info => <div className={styles.cellContent}>{info.getValue()}</div>,
        footer: (props) => (
          <input
            className={styles.columnFilter}
            placeholder="Filter..."
            value={columnFilters.proposer_name || ''}
            onChange={e => handleColumnFilter('proposer_name', e.target.value)}
          />
        ),
      },
      {
        accessorKey: "entity_nature",
        header: "Entity Nature",
        enableSorting: true,
        cell: info => <div className={styles.cellContent}>{info.getValue()}</div>,
        footer: (props) => (
          <input
            className={styles.columnFilter}
            placeholder="Filter..."
            value={columnFilters.entity_nature || ''}
            onChange={e => handleColumnFilter('entity_nature', e.target.value)}
          />
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: true,
        cell: StatusCell,
        footer: (props) => (
          <select
            className={styles.columnFilter}
            value={columnFilters.status || ''}
            onChange={e => handleColumnFilter('status', e.target.value)}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Rejected">Rejected</option>
            <option value="Request Hold">Request Hold</option>
          </select>
        ),
      },
      {
        accessorKey: "entity_name",
        header: "Entity Name",
        enableSorting: true,
        cell: info => <div className={styles.cellContent}>{info.getValue()}</div>,
        footer: (props) => (
          <input
            className={styles.columnFilter}
            placeholder="Filter..."
            value={columnFilters.entity_name || ''}
            onChange={e => handleColumnFilter('entity_name', e.target.value)}
          />
        ),
      },
      {
        accessorKey: "department_name",
        header: "Department",
        enableSorting: true,
        cell: info => <div className={styles.cellContent}>{info.getValue()}</div>,
        footer: (props) => (
          <input
            className={styles.columnFilter}
            placeholder="Filter..."
            value={columnFilters.department_name || ''}
            onChange={e => handleColumnFilter('department_name', e.target.value)}
          />
        ),
      },
      {
        accessorKey: "session",
        header: "Session",
        enableSorting: true,
        cell: info => <div className={styles.cellContent}>{info.getValue()}</div>,
        footer: (props) => (
          <input
            className={styles.columnFilter}
            placeholder="Filter..."
            value={columnFilters.session || ''}
            onChange={e => handleColumnFilter('session', e.target.value)}
          />
        ),
      },
      {
        accessorKey: "proposer_email",
        header: "Proposed By Email",
        enableSorting: true,
        cell: info => <div className={styles.cellContent}>{info.getValue()}</div>,
        footer: (props) => (
          <input
            className={styles.columnFilter}
            placeholder="Filter..."
            value={columnFilters.proposer_email || ''}
            onChange={e => handleColumnFilter('proposer_email', e.target.value)}
          />
        ),
      },
      {
        accessorKey: "mobile",
        header: "Proposer Contact",
        enableSorting: true,
        cell: info => <div className={styles.cellContent}>{info.getValue()}</div>,
        footer: (props) => (
          <input
            className={styles.columnFilter}
            placeholder="Filter..."
            value={columnFilters.mobile || ''}
            onChange={e => handleColumnFilter('mobile', e.target.value)}
          />
        ),
      },
      {
        id: "sendMail",
        header: "Send Mail",
        cell: ({ row }) => (
          <button className={styles.actionButton} onClick={() => handleSendMail(row)} title="Send Mail">
            <img className={styles.actionIcon} src={mail || "/placeholder.svg"} alt="mail" />
            <span>Send Mail</span>
          </button>
        ),
      },
      {
        id: "viewReferal",
        header: "View Referal",
        cell: ({ row }) => (
          <button className={styles.actionButton} onClick={() => handleView(row)} title="View">
            View Referal
          </button>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className={styles.actionButtonGroup}>
            <button className={`${styles.actionButton} ${styles.editButton}`} onClick={() => handleEdit(row)} title="Edit">
              Edit
            </button>
            <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(row)} title="Delete">
              Delete
            </button>
          </div>
        ),
      },
      {
        id: "viewMore",
        header: "Full Result",
        cell: ({ row }) => (
          <button className={`${styles.actionButton} ${styles.viewButton}`} onClick={() => handleViewMore(row)} title="View More">
            View Full Result
          </button>
        ),
      },
    ],
    [handleEdit, handleDelete, handleSendMail, handleStatusChange, columnFilters],
  )

  // Apply column filters
  const getFilteredData = () => {
    let filteredData = [...entities]
    
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value) {
        filteredData = filteredData.filter(item => {
          const itemValue = item[key]
          return itemValue && itemValue.toString().toLowerCase().includes(value.toLowerCase())
        })
      }
    })
    
    return filteredData
  }

  const filteredData = useMemo(() => getFilteredData(), [entities, columnFilters])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const downloadCSV = () => {
    // Create CSV content
    const headers = columns
      .filter((col) => col.accessorKey) // Only include columns with accessorKey
      .map((col) => col.header)

    const csvContent = [
      headers.join(","),
      ...entities.map((entity) =>
        columns
          .filter((col) => col.accessorKey)
          .map((col) => {
            const value = entity[col.accessorKey]
            // Handle values with commas by wrapping in quotes
            return value !== undefined && value !== null
              ? typeof value === "string" && value.includes(",")
                ? `"${value}"`
                : value
              : ""
          })
          .join(","),
      ),
    ].join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "entities.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderSection = (title, fields) => (
    <>
      <tr className={styles.sectionHeader}>
        <td colSpan="2">{title}</td>
      </tr>
      {fields.map(([label, key]) => (
        <tr key={key}>
          <td>{label}</td>
          <td>{selectedEntityDetails?.[key] || "N/A"}</td>
        </tr>
      ))}
    </>
  )

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(email).toLowerCase())
  }

  const processEmails = (text) => {
    const emailList = text.split(/[\n,\s]+/).filter(Boolean)

    const processedEmails = emailList.map((email) => {
      email = email.trim()
      if (!email.includes("@")) {
        email = `${email}@cuchd.in`
      }
      return email
    })

    const uniqueEmails = [...new Set(processedEmails)]
    const validEmails = uniqueEmails.filter((email) => isValidEmail(email))

    setEmails(validEmails)
    return validEmails
  }

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData("text")
    const newValue = textAreaValue + pastedText
    setTextAreaValue(newValue)
    processEmails(newValue)
  }

  const handleEmailInputChange = (e) => {
    const inputValue = e.target.value
    setTextAreaValue(inputValue)
    const validEmails = processEmails(inputValue)
    setIsValid(validEmails.length > 0 && validEmails.length === inputValue.split(/[\n,\s]+/).filter(Boolean).length)
  }

  const removeEmail = (emailToRemove) => {
    const updatedEmails = emails.filter((email) => email !== emailToRemove)
    setEmails(updatedEmails)
    setTextAreaValue(updatedEmails.join("\n"))
  }

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
      <div className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <h2 className={styles.dashboardTitle}>Entities Status</h2>
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{entities.length}</span>
              <span className={styles.statLabel}>Total Entities</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>
                {entities.filter(e => e.status === 'Approved').length}
              </span>
              <span className={styles.statLabel}>Approved</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>
                {entities.filter(e => e.status === 'Pending').length}
              </span>
              <span className={styles.statLabel}>Pending</span>
            </div>
          </div>
        </div>
        <div className={styles.headerButtons}>
          <button className={styles.primaryButton} onClick={downloadCSV}>
            Download CSV
          </button>
          <button onClick={handleApprove} className={styles.successButton}>
            Confirm Approval
          </button>
        </div>
      </div>

      <div className={styles.tableControls}>
        <div className={styles.searchContainer}>
          <input
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search all columns..."
            className={styles.searchInput}
          />
          {(globalFilter || activeFilters.length > 0) && (
            <button onClick={clearFilters} className={styles.clearFiltersButton}>
              Clear Filters
            </button>
          )}
        </div>
        
        <div className={styles.activeFiltersContainer}>
          {activeFilters.length > 0 && (
            <div className={styles.activeFilters}>
              <span className={styles.activeFiltersLabel}>Active Filters:</span>
              {activeFilters.map(filter => (
                <div key={filter} className={styles.filterTag}>
                  {columns.find(col => col.accessorKey === filter)?.header}: {columnFilters[filter]}
                  <button 
                    className={styles.removeFilterButton}
                    onClick={() => handleColumnFilter(filter, '')}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.responsiveTableWrapper}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th 
                      key={header.id} 
                      onClick={header.column.getToggleSortingHandler()} 
                      className={styles.tableHeader}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div className={styles.headerContent}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <span className={styles.sortIndicator}>
                              {{
                                asc: "↑",
                                desc: "↓",
                              }[header.column.getIsSorted()] || ""}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`${styles.tableRow} ${!row.original.session || row.original.session.trim() === null ? styles.errorRow : ""}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={styles.tableCell}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className={styles.noDataCell}>
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map(footerGroup => (
                <tr key={footerGroup.id} className={styles.filterRow}>
                  {footerGroup.headers.map(header => (
                    <th key={header.id} className={styles.filterCell}>
                      {header.column.columnDef.footer && 
                        flexRender(header.column.columnDef.footer, header.getContext())
                      }
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
        </div>
      </div>

      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} entries
        </div>
        <div className={styles.paginationControls}>
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className={styles.paginationButton}
          >
            {"<<"}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={styles.paginationButton}
          >
            {"<"}
          </button>
          
          <div className={styles.pageNumbers}>
            {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
              const pageIndex = table.getState().pagination.pageIndex;
              let pageNumber;
              
              if (table.getPageCount() <= 5) {
                pageNumber = i;
              } else if (pageIndex < 3) {
                pageNumber = i;
              } else if (pageIndex > table.getPageCount() - 3) {
                pageNumber = table.getPageCount() - 5 + i;
              } else {
                pageNumber = pageIndex - 2 + i;
              }
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => table.setPageIndex(pageNumber)}
                  className={`${styles.pageNumberButton} ${
                    pageIndex === pageNumber ? styles.activePage : ''
                  }`}
                >
                  {pageNumber + 1}
                </button>
              );
            })}
          </div>
          
          <button 
            onClick={() => table.nextPage()} 
            disabled={!table.getCanNextPage()} 
            className={styles.paginationButton}
          >
            {">"}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className={styles.paginationButton}
          >
            {">>"}
          </button>
          
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value))
            }}
            className={styles.pageSizeSelect}
          >
            {[10, 20, 30, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} per page
              </option>
            ))}
          </select>
        </div>
      </div>

      <Drawer
        title="Edit Entity"
        placement="right"
        onClose={onDrawerClose}
        visible={drawerVisible}
        width={600}
        destroyOnClose={true}
        className={styles.customDrawer}
      >
        {loadingEdit ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading entity data...</p>
          </div>
        ) : (
          <Form form={form} layout="vertical" onFinish={onFinish} className={styles.entityForm}>
            <Form.Item name="entcr_id" hidden>
              <Input />
            </Form.Item>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Basic Information</h3>
              <div className={styles.formRow}>
                <Form.Item
                  name="proposed_name"
                  label="Proposed Name"
                  className={styles.formItem}
                  rules={[{ required: true, message: "Please enter proposed name" }]}
                >
                  <Input className={styles.formInput} />
                </Form.Item>

                <Form.Item
                  name="proposed_date"
                  label="Proposed Date"
                  className={styles.formItem}
                  rules={[{ required: true, message: "Please select date" }]}
                >
                  <DatePicker className={styles.formDatePicker} style={{ width: "100%" }} />
                </Form.Item>
              </div>

              <div className={styles.formRow}>
                <Form.Item name="proposed_by" label="Proposed By" className={styles.formItem}>
                  <Select className={styles.formSelect}>
                    <Select.Option value="FACULTY">FACULTY</Select.Option>
                    <Select.Option value="STUDENT">STUDENT</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name="proposer_name" label="Proposer Name" className={styles.formItem}>
                  <Input className={styles.formInput} />
                </Form.Item>
              </div>

              <div className={styles.formRow}>
                <Form.Item name="emp_code" label="Employee Code" className={styles.formItem}>
                  <Input className={styles.formInput} />
                </Form.Item>
                
                <Form.Item name="mobile" label="Mobile" className={styles.formItem}>
                  <Input className={styles.formInput} />
                </Form.Item>
              </div>

              <div className={styles.formRow}>
                <Form.Item name="entity_nature" label="Entity Nature" className={styles.formItem}>
                  <Select className={styles.formSelect}>
                    <Select.Option value="Domain specific (field based)">Domain specific (field based)</Select.Option>
                    <Select.Option value="Hackathon & challenge">Hackathon & challenge</Select.Option>
                    <Select.Option value="Social value & outreach">Social value & outreach</Select.Option>
                    <Select.Option value="Innovation & incubation">Innovation & incubation</Select.Option>
                  </Select>
                </Form.Item>
                
                <Form.Item name="status" label="Status" className={styles.formItem}>
                  <Select className={styles.formSelect}>
                    <Select.Option value="Pending">Pending</Select.Option>
                    <Select.Option value="Approved">Approved</Select.Option>
                    <Select.Option value="Interview Scheduled">Interview Scheduled</Select.Option>
                    <Select.Option value="Rejected">Rejected</Select.Option>
                    <Select.Option value="Request Hold">Request Hold</Select.Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={styles.formRow}>
                <Form.Item name="session" label="Session" className={styles.formItem}>
                  <Input className={styles.formInput} />
                </Form.Item>
                
                <Form.Item name="entity_id" label="Entity Name" className={styles.formItem}>
                  <Select className={styles.formSelect}>
                    {entityTypes.map((entity) => (
                      <Select.Option key={entity.entity_id} value={entity.entity_id}>
                        {entity.entity_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className={styles.formRow}>
                <Form.Item name="department" label="Department Name" className={styles.formItem}>
                  <Select className={styles.formSelect}>
                    {departments.map((dept) => (
                      <Select.Option key={dept.department} value={dept.department}>
                        {dept.dept_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Student Section 1</h3>
              <div className={styles.formRow}>
                <Form.Item name="student_sec_1_name" label="Name" className={styles.formItem}>
                  <Input className={styles.formInput} />
                </Form.Item>

                <Form.Item name="student_sec_1_email" label="Email" className={styles.formItem}>
                  <Input className={styles.formInput} />
                </Form.Item>
              </div>

              <div className={styles.formRow}>
                <Form.Item name="student_sec_1_uid" label="UID" className={styles.formItem}>
                  <Input className={styles.formInput} />
                </Form.Item>

                <Form.Item name="student_sec_1_mobile" label="Mobile" className={styles.formItem}>
                  <Input className={styles.formInput} />
                </Form.Item>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Student Section 2</h3>
              <div className={styles.formRow}>
                <Form.Item name="student_sec_2_name" label="Name" className={styles.formItem}>
                  <Input className={styles.formInput} />
                </Form.Item>

                <Form.Item name="student_sec_2_email" label="Email" className={styles.formItem}>
                  <Input className={styles.formInput} />
                </Form.Item>
              </div>

              <div className={styles.formRow}>
                <Form.Item name="student_sec_2_uid" label="UID" className={styles.formItem}>
                  <Input className={styles.formInput} />
                </Form.Item>

                <Form.Item name="student_sec_2_mobile" label="Mobile" className={styles.formItem}>
                  <Input className={styles.formInput} />
                </Form.Item>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Faculty Advisor 1</h3>
              <div className={styles.formRow}>
                <Form.Item name="faculty_adv_1_name" label="Name" className={styles.formItem}>
                  <Input className={styles.formInput} />
                </Form.Item>

                <Form.Item name="faculty_adv_1_email" label="Email" className={styles.formItem}>
                  <Input className={styles.formInput} />
                </Form.Item>
              </div>

              <div className={styles.formRow}>
                <Form.Item name="faculty_adv_1_empcode" label="Emp Code" className={styles.formItem}>
                  <Input className={styles.formInput} />
                </Form.Item>

                <Form.Item name="faculty_adv_1_mobile" label="Mobile" className={styles.formItem}>
                  <Input className={styles.formInput} />
                </Form.Item>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Faculty Co-Advisor 1</h3>
              <div className={styles.formRow}>
                <Form.Item name="faculty_coadv_1_name" label="Name" className={styles.formItem}>
                  <Input className={styles.formInput} />
                </Form.Item>

                <Form.Item name="faculty_coadv_1_email" label="Email" className={styles.formItem}>
                  <Input className={styles.formInput} />
                </Form.Item>
              </div>

              <div className={styles.formRow}>
                <Form.Item name="faculty_coadv_1_empcode" label="Emp Code" className={styles.formItem}>
                  <Input className={styles.formInput} />
                </Form.Item>

                <Form.Item name="faculty_coadv_1_mobile" label="Mobile" className={styles.formItem}>
                  <Input className={styles.formInput} />
                </Form.Item>
              </div>
            </div>

            <Form.Item name="entity_name" hidden>
              <Input />
            </Form.Item>

            <Form.Item name="department_name" hidden>
              <Input />
            </Form.Item>

            <div className={styles.formActions}>
              <Button type="primary" htmlType="submit" loading={isLoading} className={styles.submitButton}>
                Update Entity
              </Button>
              <Button onClick={onDrawerClose} className={styles.cancelButton}>
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Drawer>
      
      <Drawer 
        title="Send Mail" 
        placement="right" 
        onClose={onMailDrawerClose} 
        visible={mailDrawerVisible} 
        width={600}
        className={styles.customDrawer}
      >
        <Form form={mailForm} layout="vertical" onFinish={onMailFinish} className={styles.mailForm}>
          <Form.Item label="Email Addresses" className={styles.emailInputContainer}>
            <TextArea
              value={textAreaValue}
              placeholder="Paste email addresses from Excel or type (domain @cuchd.in will be added automatically if missing)"
              onChange={handleEmailInputChange}
              onPaste={handlePaste}
              className={`${styles.emailTextArea} ${isValid ? styles.validInput : ''}`}
            />
          </Form.Item>
          
          <div className={styles.emailTagsContainer}>
            {emails.map((email, index) => (
              <Tag
                key={index}
                closable
                onClose={() => removeEmail(email)}
                className={styles.emailTag}
              >
                <span>{email}</span>
              </Tag>
            ))}
          </div>
          
          <div className={styles.emailCount}>Total emails: {emails.length}</div>

          <Form.Item name="subject" label="Subject" rules={[{ required: true }]} className={styles.formItem}>
            <Input className={styles.formInput} />
          </Form.Item>
          
          <Form.Item name="body" label="Body" rules={[{ required: true }]} className={styles.formItem}>
            <ReactQuill theme="snow" className={styles.mailEditor} />
          </Form.Item>
          
          <Form.Item
            style={{ display: "none" }}
            name="entity_request_id"
            label="Entity Request ID"
            rules={[{ required: true }]}
          >
            <Input disabled />
          </Form.Item>
          
          <Form.Item className={styles.formActions}>
            <Button type="primary" htmlType="submit" loading={isLoading} className={styles.submitButton}>
              Send Mail
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      
      <Modal
        title="Referral"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={600}
        className={styles.customModal}
      >
        <div className={styles.referralContent} dangerouslySetInnerHTML={{ __html: editingEntity?.referal || "" }} />
      </Modal>
      
      <Drawer
        title="Entity Details"
        placement="right"
        onClose={onViewMoreDrawerClose}
        open={viewMoreDrawerVisible}
        width={600}
        className={styles.customDrawer}
      >
        {viewMoreDrawerVisible && (
          <div className={styles.entityDetailsContainer}>
            <h2 className={styles.detailsTitle}>Entity Details</h2>
            <div className={styles.detailsTableWrapper}>
              <table className={styles.entityDetailsTable}>
                <tbody>
                  {renderSection("Entity Information", [
                    ["Proposed Name", "proposed_name"],
                    ["Proposed Date", "proposed_date"],
                    ["Proposed By", "proposed_by"],
                    ["Proposer Name", "proposer_name"],
                    ["Entity Nature", "entity_nature"],
                    ["Status", "status"],
                    ["Entity Name", "entity_name"],
                    ["Department", "department_name"],
                  ])}

                  {renderSection("Student Section 1", [
                    ["Name", "student_sec_1_name"],
                    ["Email", "student_sec_1_email"],
                    ["UID", "student_sec_1_uid"],
                    ["Mobile", "student_sec_1_mobile"],
                  ])}

                  {renderSection("Student Section 2", [
                    ["Name", "student_sec_2_name"],
                    ["Email", "student_sec_2_email"],
                    ["UID", "student_sec_2_uid"],
                    ["Mobile", "student_sec_2_mobile"],
                  ])}

                  {renderSection("Student Advisor Section 1", [
                    ["Name", "student_advsec_1_name"],
                    ["Email", "student_advsec_1_email"],
                    ["UID", "student_advsec_1_uid"],
                    ["Mobile", "student_advsec_1_mobile"],
                  ])}

                  {renderSection("Student Advisor Section 2", [
                    ["Name", "student_advsec_2_name"],
                    ["Email", "student_advsec_2_email"],
                    ["UID", "student_advsec_2_uid"],
                    ["Mobile", "student_advsec_2_mobile"],
                  ])}

                  {renderSection("Faculty Advisor 1", [
                    ["Name", "faculty_adv_1_name"],
                    ["Email", "faculty_adv_1_email"],
                    ["Emp Code", "faculty_adv_1_empcode"],
                    ["Mobile", "faculty_adv_1_mobile"],
                  ])}

                  {renderSection("Faculty Advisor 2", [
                    ["Name", "faculty_adv_2_name"],
                    ["Email", "faculty_adv_2_email"],
                    ["Emp Code", "faculty_adv_2_empcode"],
                    ["Mobile", "faculty_adv_2_mobile"],
                  ])}

                  {renderSection("Faculty Co-Advisor 1", [
                    ["Name", "faculty_coadv_1_name"],
                    ["Email", "faculty_coadv_1_email"],
                    ["Emp Code", "faculty_coadv_1_empcode"],
                    ["Mobile", "faculty_coadv_1_mobile"],
                  ])}

                  {renderSection("Faculty Co-Advisor 2", [
                    ["Name", "faculty_coadv_2_name"],
                    ["Email", "faculty_coadv_2_email"],
                    ["Emp Code", "faculty_coadv_2_empcode"],
                    ["Mobile", "faculty_coadv_2_mobile"],
                  ])}
                </tbody>
              </table>
            </div>
            <button className={styles.closeButton} onClick={onViewMoreDrawerClose}>
              Close
            </button>
          </div>
        )}
      </Drawer>

      <Modal
        title="Confirm Status Change"
        open={statusModalVisible}
        onOk={handleStatusConfirm}
        onCancel={() => setStatusModalVisible(false)}
        className={styles.customModal}
      >
        <p className={styles.statusConfirmText}>
          Are you sure you want to change the status to <span className={styles.statusHighlight}>{selectedStatus}</span>?
        </p>
        <Form.Item label="Remark" className={styles.remarkInput}>
          <TextArea
            rows={4}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter your remark here"
            className={styles.formTextArea}
          />
        </Form.Item>
      </Modal>
    </div>
  )
}

export default EntityTable
