"use client"

import { useState, useEffect } from "react"
import { message, Modal, notification, Select, Spin, Switch } from "antd"
import { MdDelete } from "react-icons/md"
import { Drawer } from "antd"
import { IoMdEye } from "react-icons/io"
import { BiSolidEdit } from "react-icons/bi"

import styles from "./Users.module.css"
import apiClient from "../config/apiClient"

const Users = () => {
  const [selectedValue, setSelectedValue] = useState("")
  const [inputData, setInputData] = useState({})
  const [tableData, setTableData] = useState([])
  const [entityData, setEntityData] = useState([])
  const [permissionData, setPermissionData] = useState([])
  const [editMode, setEditMode] = useState(null)
  const [roles, setRoles] = useState([])
  const [designations, setDesignations] = useState([])
  const [titles, setTitles] = useState([])
  const [genders, setGenders] = useState([])
  const [departments, setDepartments] = useState([])
  const [users, setUsers] = useState([])
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userToDelete, setUserToDelete] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalVisibleSession, setIsModalVisibleSession] = useState(false)
  const [loading, setloading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [switchState, setSwitchState] = useState(false)
  const [copyEmail, setCopyEmil] = useState([])

  const configOptions = [
    { value: "entity-types", label: "Entity Name", icon: "🏢" },
    { value: "roles_permissions", label: "Roles & Permissions", icon: "🔐" },
    { value: "roles", label: "Roles", icon: "👥" },
    { value: "departments", label: "Departments", icon: "🏫" },
    { value: "sessions", label: "Sessions", icon: "🕒" },
    { value: "genders", label: "Genders", icon: "⚧️" },
    { value: "title", label: "Title", icon: "📝" },
    { value: "designation", label: "Designation", icon: "🏅" },
    { value: "user_create", label: "Create User", icon: "👤" },
  ]

  const apiUrls = {
    "entity-types": "entity-types/",
    roles_permissions: "roles_permissions/",
    roles: "roles/",
    departments: "departments/",
    sessions: "sessions/",
    genders: "genders/",
    title: "title/",
    designation: "designation/",
    user_create: "user_create/",
    user_table: "user_table/",
    current_session: "current_session/",
  }

  useEffect(() => {
    setInputData({})

    if (selectedValue === "roles_permissions") {
      fetchEntityData()
      fetchPermissionData()
    } else if (selectedValue === "roles") {
      fetchEntityData()
      fetchPermissionData()
    }
  }, [selectedValue])

  useEffect(() => {
    if (selectedValue === "user_create") {
      fetchRoles()
      fetchDesignations()
      fetchTitles()
      fetchGenders()
      fetchDepartments()
      fetchUser()
    }
  }, [selectedValue])

  useEffect(() => {
    fetchPermissionData()
  }, [])

  const fetchRoles = async () => {
    setloading(true)
    try {
      const response = await apiClient.get(apiUrls["roles"])
      setRoles(response.data)
    } catch (error) {
      console.error("Error fetching roles:", error)
    } finally {
      setloading(false)
    }
  }

  const fetchDesignations = async () => {
    setloading(true)
    try {
      const response = await apiClient.get(apiUrls["designation"])
      setDesignations(response.data)
    } catch (error) {
      console.error("Error fetching designations:", error)
    } finally {
      setloading(false)
    }
  }

  const fetchTitles = async () => {
    setloading(true)
    try {
      const response = await apiClient.get(apiUrls["title"])
      setTitles(response.data)
    } catch (error) {
      console.error("Error fetching titles:", error)
    } finally {
      setloading(false)
    }
  }

  const fetchGenders = async () => {
    setloading(true)
    try {
      const response = await apiClient.get(apiUrls["genders"])
      setGenders(response.data)
    } catch (error) {
      console.error("Error fetching genders:", error)
    } finally {
      setloading(false)
    }
  }

  const fetchDepartments = async () => {
    setloading(true)
    try {
      const response = await apiClient.get(apiUrls["departments"])
      setDepartments(response.data)
    } catch (error) {
      console.error("Error fetching departments:", error)
    } finally {
      setloading(false)
    }
  }

  const fetchEntityData = async () => {
    setloading(true)
    try {
      const response = await apiClient.get(apiUrls["entity-types"])
      setEntityData(response.data)
    } catch (error) {
      console.error("Error fetching entity data:", error)
    } finally {
      setloading(false)
    }
  }

  const fetchPermissionData = async () => {
    setloading(true)
    try {
      const response = await apiClient.get(apiUrls["roles_permissions"])
      setPermissionData(response.data)
    } catch (error) {
      console.error("Error fetching permission data:", error)
    } finally {
      setloading(false)
    }
  }

  const fetchUser = async () => {
    setloading(true)
    try {
      const response = await apiClient.get(apiUrls["user_create"])
      setUsers(response.data)
      setCopyEmil(response?.data)
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setloading(false)
    }
  }

  const copyToCLipBoard = (email) => {
    navigator.clipboard
      .writeText(email)
      .then(() => {
        message.success("Copied!")
      })
      .catch((error) => {
        message.error("Something Wrong!")
      })
  }

  const handleCardSelect = (value) => {
    setSelectedValue(value)
    setInputData({})
    fetchTableData(value)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setInputData({ ...inputData, [name]: value })
  }

  const handleInputChange1 = (name, value) => {
    setInputData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const apiUrl = apiUrls[selectedValue]
      const payload = { ...inputData }

      if (selectedValue === "roles" && payload.roles_permissions) {
        payload.permission_id = payload.roles_permissions
        delete payload.roles_permissions
      }

      if (editMode !== null) {
        await apiClient.put(`${apiUrl}${editMode}/`, inputData)
        notification.success({
          message: "Success",
          description: "Data updated successfully!",
          style: { backgroundColor: "#88C273" },
        })
      } else {
        await apiClient.post(apiUrl, inputData)
        notification.success({
          message: "Success",
          description: "Data submitted successfully!",
          style: { backgroundColor: "#88C273" },
        })
      }
      fetchTableData(selectedValue)
      setEditMode(null)
      setInputData({})
    } catch (error) {
      console.error("Error submitting data:", error)
      notification.error({
        message: "Error",
        description: `${error?.message}`,
      })
    }
  }

  const handleRolesSubmit = async (e) => {
    e.preventDefault()
    try {
      const apiUrl = apiUrls.roles
      const payload = {
        role_name: inputData.role_name,
        permission_id: inputData.roles_permissions,
        status: inputData.status,
      }

      if (editMode !== null) {
        await apiClient.put(`${apiUrl}${editMode}/`, payload)
        notification.success({
          message: "Success",
          description: "Role updated successfully!",
          style: { backgroundColor: "#88C273" },
        })
      } else {
        await apiClient.post(apiUrl, payload)
        notification.success({
          message: "Success",
          description: "Role created successfully!",
          style: { backgroundColor: "#88C273" },
        })
      }
      fetchTableData("roles")
      setEditMode(null)
      setInputData({})
    } catch (error) {
      console.error("Error submitting role data:", error)
      notification.error({
        message: "Error",
        description: `${error?.message}`,
      })
    }
  }

  const fetchTableData = async (value) => {
    setloading(true)
    try {
      const apiUrl = apiUrls[value]
      const response = await apiClient.get(apiUrl)
      setTableData(response.data)
    } catch (error) {
      console.error("Error fetching table data:", error)
    } finally {
      setloading(false)
    }
  }

  const handleEdit = (item) => {
    const idField = getIdFieldName()
    if (item[idField]) {
      setEditMode(item[idField])
      setInputData(item)
    } else {
      console.error(`No ${idField} found for this item.`)
    }
    if (selectedValue === "user_create") {
      setInputData({
        user_role: item.user_role,
        desig_id: item.designation_name,
        title_id: item.title_name,
        department: item.department_name,
        is_cordinator: item.cordinator,
        user_name: item.user_name,
        username: item.username,
        user_email: item.user_email,
        emp_code: item.emp_code,
        user_mobile: item.user_mobile,
        gender: item.gender_name,
        password: item.password,
      })
      setEditMode(item.id)
    }
  }

  const handleDelete = async (item) => {
    const idField = getIdFieldName()
    if (item[idField]) {
      try {
        const apiUrl = apiUrls[selectedValue]
        await apiClient.delete(`${apiUrl}${item[idField]}/`)
        fetchTableData(selectedValue)
        notification.success({
          message: "Success",
          description: "Data deleted successfully!",
          style: { backgroundColor: "#E85C0D" },
        })
      } catch (error) {
        console.error(`Error deleting ${selectedValue}:`, error)
        notification.error({
          message: "Error",
          description: "Failed to delete the data. Please try again.",
        })
      }
    } else {
      console.error(`No ${idField} found for this item.`)
      notification.error({
        message: "Error",
        description: "Invalid ID. Could not delete the data.",
      })
    }
  }

  const getFieldName = () => {
    switch (selectedValue) {
      case "entity-types":
        return {
          field1: "entity_name",
          field2: "status",
          extraField1: "entity_guide",
        }
      case "roles_permissions":
        return { field1: "permission_name", field2: "status" }
      case "roles":
        return { field1: "role_name", field2: "status" }
      case "departments":
        return { field1: "dept_name", field2: "dept_status" }
      case "genders":
        return { field1: "gender_name", field2: "gender_status" }
      case "title":
        return { field1: "title_name", field2: "title_status" }
      case "designation":
        return { field1: "desig_name", field2: "desig_status" }
      case "user_create":
        return { field2: "status" }
      case "sessions":
        return {
          field1: "start_year",
          field2: "end_year",
          extraField1: "start_month",
          extraField2: "end_month",
        }
      default:
        return {}
    }
  }

  const getIdFieldName = () => {
    switch (selectedValue) {
      case "entity-types":
        return "entity_id"
      case "roles_permissions":
        return "permission_id"
      case "roles":
        return "role_id"
      case "departments":
        return "dept_id"
      case "genders":
        return "gender_id"
      case "title":
        return "title_id"
      case "designation":
        return "desig_id"
      case "sessions":
        return "session_id"
      case "create_user":
        return "id"
      case "user_table":
        return "id"
      default:
        return ""
    }
  }

  const { field1, field2, extraField1, extraField2 } = getFieldName()

  const showDrawer = (user) => {
    setSelectedUser(user)
    setDrawerVisible(true)
  }

  const onClose = () => {
    setDrawerVisible(false)
  }

  const showDeleteConfirm = (userId) => {
    setUserToDelete(userId)
    setIsModalVisible(true)
  }

  const handleEditUser = async (e) => {
    e.preventDefault()
    if (editMode) {
      const apiUrl = apiUrls["user_table"]
      try {
        await apiClient.put(`${apiUrl}${editMode}/`, inputData)
        notification.success({
          message: "Success",
          description: "User updated successfully!",
          style: { backgroundColor: "#88C273" },
        })
        fetchTableData("user_create")
        setEditMode(null)
        setInputData({})
      } catch (error) {
        console.error("Error updating user:", error)
        notification.error({
          message: "Error",
          description: `Failed to update user: ${error.message}`,
        })
      }
    } else {
      console.log("Not in edit mode")
    }
  }

  const handleDeleteUser = async () => {
    if (userToDelete) {
      const apiUrl = apiUrls["user_table"]
      try {
        await apiClient.delete(`${apiUrl}${userToDelete}/`)
        notification.success({
          message: "Success",
          description: "User deleted successfully!",
          style: { backgroundColor: "#88C273" },
        })
        fetchTableData("user_create")
        setUserToDelete(null)
        setIsModalVisible(false)
      } catch (error) {
        console.error("Error deleting user:", error)
        notification.error({
          message: "Error",
          description: `Failed to delete user: ${error.message}`,
        })
      }
    }
  }

  const handleSwitchClick = (item) => {
    setSelectedItem(item)
    setIsModalVisibleSession(true)
  }

  const confirmActivation = async () => {
    if (selectedItem) {
      try {
        const data = {
          session_code: selectedItem?.session_code,
        }
        const config = {
          method: "POST",
          url: "current_session/",
          data,
        }
        const response = await apiClient(config)
        notification.success({
          message: "Success",
          description: response?.data?.message,
        })
      } catch (error) {
        console.error("Error activating session:", error)
      } finally {
        setIsModalVisibleSession(false)
        setSelectedItem(null)
      }
    }
  }

  const handleCancelActivation = () => {
    setIsModalVisibleSession(false)
    setSwitchState(false)
  }

  const renderForm = () => {
    if (!selectedValue) return null

    return (
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>{configOptions.find((opt) => opt.value === selectedValue)?.label} Form</h2>

        <form className={styles.configForm}>
          {selectedValue === "sessions"
            ? null
            : field1 && (
                <input
                  type="text"
                  name={field1}
                  value={inputData[field1] || ""}
                  onChange={handleInputChange}
                  placeholder={`Enter ${field1}`}
                  className={styles.textInput}
                />
              )}

          {selectedValue === "entity-types" && (
            <textarea
              name={extraField1}
              value={inputData[extraField1] || ""}
              onChange={handleInputChange}
              placeholder={`Enter ${extraField1}`}
              className={styles.textInput}
            />
          )}

          {selectedValue === "roles_permissions" && (
            <select
              name="entity"
              value={inputData["entity"] || ""}
              onChange={handleInputChange}
              className={styles.selectInput}
            >
              <option value="">Select Entity</option>
              {entityData.map((entity) => (
                <option key={entity.entity_id} value={entity.entity_id}>
                  {entity.entity_name}
                </option>
              ))}
            </select>
          )}

          {selectedValue === "roles" && (
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select Permissions"
              value={inputData.roles_permissions || []}
              onChange={(value) => handleInputChange1("roles_permissions", value)}
              optionFilterProp="children"
              className={styles.selectInput}
            >
              {permissionData.map((entity) => (
                <Select.Option key={entity.permission_id} value={entity.permission_id}>
                  {entity.permission_name} || {entity.entity_name}
                </Select.Option>
              ))}
            </Select>
          )}

          {field2 && selectedValue !== "sessions" && (
            <select
              name={field2}
              value={inputData[field2] || ""}
              onChange={handleInputChange}
              className={styles.selectInput}
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          )}

          {selectedValue === "sessions" && (
            <>
              <div className={styles.formRow}>
                <select
                  name="start_year"
                  value={inputData.start_year || ""}
                  onChange={handleInputChange}
                  className={styles.selectInput}
                >
                  <option value="">Select Start Year</option>
                  {Array.from({ length: 9 }, (_, i) => 2020 + i).map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>

                <select
                  name="end_year"
                  value={inputData.end_year || ""}
                  onChange={handleInputChange}
                  className={styles.selectInput}
                >
                  <option value="">Select End Year</option>
                  {Array.from({ length: 9 }, (_, i) => 2020 + i).map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formRow}>
                <select
                  name="start_month"
                  value={inputData.start_month || ""}
                  onChange={handleInputChange}
                  className={styles.selectInput}
                >
                  <option value="">Select Start Month</option>
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((month, index) => (
                    <option key={month} value={(index + 1).toString().padStart(2, "0")}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  name="end_month"
                  value={inputData.end_month || ""}
                  onChange={handleInputChange}
                  className={styles.selectInput}
                >
                  <option value="">Select End Month</option>
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((month, index) => (
                    <option key={month} value={(index + 1).toString().padStart(2, "0")}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {selectedValue === "user_create" && (
            <div className={styles.userForm}>
              <div className={styles.formRow}>
                <select
                  name="user_role"
                  value={inputData["user_role"] || ""}
                  onChange={handleInputChange}
                  className={styles.selectInput}
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.role_id} value={role.role_id}>
                      {role.role_name}
                    </option>
                  ))}
                </select>

                <select
                  name="desig_id"
                  value={inputData["desig_id"] || ""}
                  onChange={handleInputChange}
                  className={styles.selectInput}
                >
                  <option value="">Select Designation</option>
                  {designations.map((desig) => (
                    <option key={desig.desig_id} value={desig.desig_id}>
                      {desig.desig_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formRow}>
                <select
                  name="title_id"
                  value={inputData["title_id"] || ""}
                  onChange={handleInputChange}
                  className={styles.selectInput}
                >
                  <option value="">Select Title</option>
                  {titles.map((title) => (
                    <option key={title.title_id} value={title.title_id}>
                      {title.title_name}
                    </option>
                  ))}
                </select>

                <select
                  name="dept_id"
                  value={inputData["dept_id"] || ""}
                  onChange={handleInputChange}
                  className={styles.selectInput}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.dept_id} value={dept.dept_id}>
                      {dept.dept_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formRow}>
                <select
                  name="is_cordinator"
                  value={inputData["is_cordinator"] || ""}
                  onChange={handleInputChange}
                  className={styles.selectInput}
                >
                  <option value="">Is Coordinator</option>
                  <option value="active">Yes</option>
                  <option value="inactive">No</option>
                </select>

                <input
                  type="text"
                  name="user_name"
                  value={inputData["user_name"] || ""}
                  onChange={handleInputChange}
                  placeholder="Enter Full Name"
                  className={styles.textInput}
                />
              </div>

              <div className={styles.formRow}>
                <input
                  type="text"
                  name="username"
                  value={inputData["username"] || ""}
                  onChange={handleInputChange}
                  placeholder="Enter Unique Name"
                  className={styles.textInput}
                />

                <input
                  type="email"
                  name="user_email"
                  value={inputData["user_email"] || ""}
                  onChange={handleInputChange}
                  placeholder="Enter Email"
                  className={styles.textInput}
                />
              </div>

              <div className={styles.formRow}>
                <input
                  type="text"
                  name="emp_code"
                  value={inputData["emp_code"] || ""}
                  onChange={handleInputChange}
                  placeholder="Enter Employee Code"
                  className={styles.textInput}
                />

                <input
                  type="text"
                  name="user_mobile"
                  value={inputData["user_mobile"] || ""}
                  onChange={handleInputChange}
                  placeholder="Enter Mobile Number"
                  className={styles.textInput}
                />
              </div>

              <div className={styles.formRow}>
                <select
                  name="gender"
                  value={inputData["gender"] || ""}
                  onChange={handleInputChange}
                  className={styles.selectInput}
                >
                  <option value="">Select Gender</option>
                  {genders.map((gender) => (
                    <option key={gender.gender_id} value={gender.gender_id}>
                      {gender.gender_name}
                    </option>
                  ))}
                </select>

                <input
                  type="password"
                  name="password"
                  value={inputData["password"] || ""}
                  onChange={handleInputChange}
                  placeholder="Enter Password"
                  className={styles.textInput}
                />
              </div>
            </div>
          )}

          <div className={styles.formActions}>
            {editMode && selectedValue === "user_create" ? (
              <button onClick={handleEditUser} type="button" className={styles.submitButton}>
                Update
              </button>
            ) : selectedValue === "roles" ? (
              <button onClick={handleRolesSubmit} type="button" className={styles.submitButton}>
                {editMode ? "Update Role" : "Create Role"}
              </button>
            ) : (
              <button onClick={handleSubmit} type="button" className={styles.submitButton}>
                {editMode ? "Update" : "Submit"}
              </button>
            )}

            {editMode && (
              <button
                onClick={() => {
                  setEditMode(null)
                  setInputData({})
                }}
                type="button"
                className={styles.cancelButton}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    )
  }

  const renderTable = () => {
    if (!selectedValue || tableData.length === 0) return null

    return (
      <div className={styles.tableContainer}>
        <h2 className={styles.tableTitle}>{configOptions.find((opt) => opt.value === selectedValue)?.label} Data</h2>

        {loading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : (
          <table className={styles.configTable}>
            <thead>
              <tr>
                {selectedValue === "user_create" && <th>Name</th>}
                {field1 && <th>{field1}</th>}
                {selectedValue === "roles_permissions" && <th>Entity Name</th>}
                {field2 && <th>{field2}</th>}
                <th>Actions</th>
                {selectedValue === "sessions" && <th>Status</th>}
                {selectedValue === "user_create" && <th>Coordinator</th>}
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr key={index}>
                  {selectedValue === "user_create" && <td>{item?.user_name}</td>}
                  {field1 && <td>{item[field1]}</td>}
                  {selectedValue === "roles_permissions" && <td>{item?.entity_name}</td>}
                  {field2 && <td>{item[field2]}</td>}

                  <td className={styles.actionButtons}>
                    {selectedValue === "user_create" ? (
                      <button onClick={() => showDrawer(item)} className={styles.viewButton}>
                        <IoMdEye />
                      </button>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(item)} className={styles.editButton}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(item)} className={styles.deleteButton}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>

                  {selectedValue === "sessions" && (
                    <td>
                      <Switch
                        checked={item.isActive}
                        onChange={() => handleSwitchClick(item)}
                        checkedChildren="ON"
                        unCheckedChildren="OFF"
                      />
                    </td>
                  )}

                  {selectedValue === "user_create" && (
                    <td>
                      {item?.is_cordinator && item?.is_cordinator === "active" ? (
                        <span className={styles.statusActive}>Active</span>
                      ) : (
                        <span className={styles.statusInactive}>Inactive</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )
  }

  return (
    <div className={styles.userConfigInterface}>
      <header className={styles.header}>
        <h3>Admin Configuration</h3>
      </header>

      <div className={styles.cardGrid}>
        {configOptions.map((option) => (
          <div
            key={option.value}
            className={`${styles.optionCard} ${selectedValue === option.value ? styles.activeCard : ""}`}
            onClick={() => handleCardSelect(option.value)}
          >
            <div className={styles.cardIcon}>{option.icon}</div>
            <h3>{option.label}</h3>
          </div>
        ))}
      </div>

      {selectedValue && (
        <div className={styles.contentContainer}>
          {renderForm()}
          {renderTable()}
        </div>
      )}

      <Drawer title="User Details" placement="right" onClose={onClose} visible={drawerVisible} width={400}>
        {selectedUser && (
          <div className={styles.userDetails}>
            <table className={styles.userDetailsTable}>
              <tbody>
                <tr>
                  <td>
                    <strong>Full Name:</strong>
                  </td>
                  <td>{selectedUser.user_name}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Email:</strong>
                  </td>
                  <td>{selectedUser.user_email}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Mobile:</strong>
                  </td>
                  <td>{selectedUser.user_mobile}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Department:</strong>
                  </td>
                  <td>{selectedUser.department_name}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Designation:</strong>
                  </td>
                  <td>{selectedUser.designation_name}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Role:</strong>
                  </td>
                  <td>{selectedUser.user_role}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Employee Code:</strong>
                  </td>
                  <td>{selectedUser.emp_code}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Status:</strong>
                  </td>
                  <td>{selectedUser.status}</td>
                </tr>
              </tbody>
            </table>

            <div className={styles.userActions}>
              <button
                className={styles.editButton}
                onClick={() => {
                  handleEdit(selectedUser)
                  onClose()
                }}
              >
                <BiSolidEdit /> Edit
              </button>
              <button className={styles.deleteButton} onClick={() => showDeleteConfirm(selectedUser.id)}>
                <MdDelete /> Delete
              </button>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        title="Confirm Deletion"
        visible={isModalVisible}
        onOk={handleDeleteUser}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>

      <Modal
        title="Confirm Activation"
        visible={isModalVisibleSession}
        onOk={confirmActivation}
        onCancel={handleCancelActivation}
      >
        <p>Are you sure you want to make this session active?</p>
      </Modal>
    </div>
  )
}

export default Users

