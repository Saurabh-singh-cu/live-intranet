"use client"

import { useEffect, useState } from "react"
import { Modal, notification } from "antd"
import { ExclamationCircleOutlined } from "@ant-design/icons"
import axios from "axios"
import styles from "./EntityRegistrationForm.module.css"

const { confirm } = Modal

const EntityRegistrationForm = () => {
  const [entityData, setEntityData] = useState([])
  const [departments, setDepartments] = useState([])
  const [currentSession, setCurrentSession] = useState("")
  const [loading, setLoading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [activeSection, setActiveSection] = useState(1)

  const [formData, setFormData] = useState({
    entity: "",
    registeration_code: "",
    department: "",
    registeration_name: "",
    faculty_advisory_name: "",
    faculty_advisory_empcode: "",
    faculty_advisory_email: "",
    faculty_advisory_mobile: "",
    faculty_co_advisory_name: "",
    faculty_co_advisory_empcode: "",
    faculty_co_advisory_email: "",
    faculty_co_advisory_mobile: "",
    Secretary_name: "",
    Secretary_uid: "",
    Secretary_email: "",
    Secretary_mobile: "",
    Joint_Secretary_name: "",
    Joint_Secretary_uid: "",
    Joint_Secretary_email: "",
    Joint_Secretary_mobile: "",
    remarks: "",
  })

  const apiUrls = {
    "entity-types": "https://api.cuintranet.in/intranetapp/entity-types/",
    departments: "https://api.cuintranet.in/intranetapp/departments/",
    currentSession: "https://api.cuintranet.in/intranetapp/current_session/",
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const showConfirm = () => {
    confirm({
      title: "Confirm Submission",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to submit this registration form? Please verify all information is correct.",
      okText: "Submit",
      okButtonProps: {
        className: styles.confirmButton,
      },
      cancelButtonProps: {
        className: styles.cancelButton,
      },
      onOk() {
        handleSubmit()
      },
    })
  }

  const handleSubmit = async () => {
    setFormSubmitting(true)
    try {
      const response = await axios.post("https://api.cuintranet.in/intranetapp/entity-registration/", {
        ...formData,
        // session_code: currentSession,
      })

      if (response.status === 201) {
        notification.success({
          message: "Registration Successful",
          description: "Your entity registration has been submitted successfully!",
          placement: "topRight",
          duration: 5,
          className: styles.successNotification,
        })

        // Reset form after successful submission
        setFormData({
          entity: "",
          registeration_code: "",
          department: "",
          registeration_name: "",
          faculty_advisory_name: "",
          faculty_advisory_empcode: "",
          faculty_advisory_email: "",
          faculty_advisory_mobile: "",
          faculty_co_advisory_name: "",
          faculty_co_advisory_empcode: "",
          faculty_co_advisory_email: "",
          faculty_co_advisory_mobile: "",
          Secretary_name: "",
          Secretary_uid: "",
          Secretary_email: "",
          Secretary_mobile: "",
          Joint_Secretary_name: "",
          Joint_Secretary_uid: "",
          Joint_Secretary_email: "",
          Joint_Secretary_mobile: "",
          remarks: "",
        })

        setActiveSection(1)
      } else {
        notification.error({
          message: "Submission Failed",
          description: "There was an issue submitting your registration. Please try again.",
          placement: "topRight",
          duration: 5,
          className: styles.errorNotification,
        })
      }
    } catch (error) {
      console.error("Error:", error)
      notification.error({
        message: "Submission Error",
        description: error.response?.data?.message || "An unexpected error occurred. Please try again later.",
        placement: "topRight",
        duration: 5,
        className: styles.errorNotification,
      })
    } finally {
      setFormSubmitting(false)
    }
  }

  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const response = await axios.get(apiUrls.departments)
      setDepartments(response.data)
    } catch (error) {
      console.error("Error fetching departments:", error)
      notification.error({
        message: "Data Loading Error",
        description: "Failed to load departments. Please refresh the page.",
        placement: "topRight",
        className: styles.errorNotification,
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchEntityData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(apiUrls["entity-types"])
      setEntityData(response.data)
    } catch (error) {
      console.error("Error fetching entity data:", error)
      notification.error({
        message: "Data Loading Error",
        description: "Failed to load entity types. Please refresh the page.",
        placement: "topRight",
        className: styles.errorNotification,
      })
    } finally {
      setLoading(false)
    }
  }

  const getCurrentSession = async () => {
    try {
      const response = await axios.get(apiUrls.currentSession)
      setCurrentSession(response.data.session_code)
    } catch (error) {
      console.error("Error fetching current session:", error)
    }
  }

  useEffect(() => {
    fetchDepartments()
    fetchEntityData()
    getCurrentSession()
  }, [])

  const nextSection = () => {
    if (activeSection < 5) {
      setActiveSection(activeSection + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const prevSection = () => {
    if (activeSection > 1) {
      setActiveSection(activeSection - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const validateSection = (section) => {
    switch (section) {
      case 1:
        return formData.entity && formData.registeration_code && formData.department && formData.registeration_name
      case 2:
        return (
          formData.faculty_advisory_name &&
          formData.faculty_advisory_empcode &&
          formData.faculty_advisory_email &&
          formData.faculty_advisory_mobile
        )
      case 3:
        return (
          formData.faculty_co_advisory_name &&
          formData.faculty_co_advisory_empcode &&
          formData.faculty_co_advisory_email &&
          formData.faculty_co_advisory_mobile
        )
      case 4:
        return (
          formData.Secretary_name && formData.Secretary_uid && formData.Secretary_email && formData.Secretary_mobile
        )
      default:
        return true
    }
  }

  return (
    <div className={styles.formWrapper}>
      <div className={styles.formHeader}>
        <h1 className={styles.formTitle}>Entity Registration</h1>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${(activeSection / 5) * 100}%` }}></div>
          </div>
          <div className={styles.progressSteps}>
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`${styles.progressStep} ${activeSection >= step ? styles.activeStep : ""}`}
                onClick={() => validateSection(activeSection) && setActiveSection(step)}
              >
                {step}
              </div>
            ))}
          </div>
          <div className={styles.progressLabels}>
            <span>Basic Info</span>
            <span>Faculty Adv.</span>
            <span>Co-Adv.</span>
            <span>Secretary</span>
            <span>Joint Sec.</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          validateSection(activeSection) && (activeSection === 5 ? showConfirm() : nextSection())
        }}
      >
        <div className={styles.requiredLegend}>* Required Fields</div>

        {/* Section 1: Basic Information */}
        {activeSection === 1 && (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="entity">
                  Entity <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.input}
                  id="entity"
                  name="entity"
                  value={formData.entity}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Entity</option>
                  {entityData.map((entity) => (
                    <option key={entity.entity_id} value={entity.entity_id}>
                      {entity.entity_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="registeration_code">
                  Registration Code <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="registeration_code"
                  name="registeration_code"
                  value={formData.registeration_code}
                  onChange={handleChange}
                  required
                  placeholder="Enter registration code"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="department">
                  Department <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.input}
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.dept_id} value={dept.dept_id}>
                      {dept.dept_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="registeration_name">
                  Registration Name <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="registeration_name"
                  name="registeration_name"
                  value={formData.registeration_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter registration name"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Faculty Advisory Details */}
        {activeSection === 2 && (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Faculty Advisory Details</h2>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="faculty_advisory_name">
                  Name <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="faculty_advisory_name"
                  name="faculty_advisory_name"
                  value={formData.faculty_advisory_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter faculty advisor's name"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="faculty_advisory_empcode">
                  Employee Code <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="faculty_advisory_empcode"
                  name="faculty_advisory_empcode"
                  value={formData.faculty_advisory_empcode}
                  onChange={handleChange}
                  required
                  placeholder="Enter employee code"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="faculty_advisory_email">
                  Email <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="email"
                  id="faculty_advisory_email"
                  name="faculty_advisory_email"
                  value={formData.faculty_advisory_email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="faculty_advisory_mobile">
                  Mobile <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="tel"
                  id="faculty_advisory_mobile"
                  name="faculty_advisory_mobile"
                  value={formData.faculty_advisory_mobile}
                  onChange={handleChange}
                  required
                  placeholder="Enter mobile number"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Faculty Co-Advisory Details */}
        {activeSection === 3 && (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Faculty Co-Advisory Details</h2>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="faculty_co_advisory_name">
                  Name <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="faculty_co_advisory_name"
                  name="faculty_co_advisory_name"
                  value={formData.faculty_co_advisory_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter co-advisor's name"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="faculty_co_advisory_empcode">
                  Employee Code <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="faculty_co_advisory_empcode"
                  name="faculty_co_advisory_empcode"
                  value={formData.faculty_co_advisory_empcode}
                  onChange={handleChange}
                  required
                  placeholder="Enter employee code"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="faculty_co_advisory_email">
                  Email <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="email"
                  id="faculty_co_advisory_email"
                  name="faculty_co_advisory_email"
                  value={formData.faculty_co_advisory_email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="faculty_co_advisory_mobile">
                  Mobile <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="tel"
                  id="faculty_co_advisory_mobile"
                  name="faculty_co_advisory_mobile"
                  value={formData.faculty_co_advisory_mobile}
                  onChange={handleChange}
                  required
                  placeholder="Enter mobile number"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Secretary Details */}
        {activeSection === 4 && (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Secretary Details</h2>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="Secretary_name">
                  Name <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="Secretary_name"
                  name="Secretary_name"
                  value={formData.Secretary_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter secretary's name"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="Secretary_uid">
                  UID <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="Secretary_uid"
                  name="Secretary_uid"
                  value={formData.Secretary_uid}
                  onChange={handleChange}
                  required
                  placeholder="Enter UID"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="Secretary_email">
                  Email <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="email"
                  id="Secretary_email"
                  name="Secretary_email"
                  value={formData.Secretary_email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="Secretary_mobile">
                  Mobile <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="tel"
                  id="Secretary_mobile"
                  name="Secretary_mobile"
                  value={formData.Secretary_mobile}
                  onChange={handleChange}
                  required
                  placeholder="Enter mobile number"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 5: Joint Secretary Details & Remarks */}
        {activeSection === 5 && (
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Joint Secretary Details</h2>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="Joint_Secretary_name">
                  Name <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="Joint_Secretary_name"
                  name="Joint_Secretary_name"
                  value={formData.Joint_Secretary_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter joint secretary's name"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="Joint_Secretary_uid">
                  UID <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="Joint_Secretary_uid"
                  name="Joint_Secretary_uid"
                  value={formData.Joint_Secretary_uid}
                  onChange={handleChange}
                  required
                  placeholder="Enter UID"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="Joint_Secretary_email">
                  Email <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="email"
                  id="Joint_Secretary_email"
                  name="Joint_Secretary_email"
                  value={formData.Joint_Secretary_email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="Joint_Secretary_mobile">
                  Mobile <span className={styles.required}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="tel"
                  id="Joint_Secretary_mobile"
                  name="Joint_Secretary_mobile"
                  value={formData.Joint_Secretary_mobile}
                  onChange={handleChange}
                  required
                  placeholder="Enter mobile number"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label} htmlFor="remarks">
                  Remarks
                </label>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  id="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Add any additional information or comments here..."
                  rows={4}
                ></textarea>
              </div>
            </div>
          </div>
        )}

        <div className={styles.formNavigation}>
          {activeSection > 1 && (
            <button type="button" className={styles.prevButton} onClick={prevSection}>
              Previous
            </button>
          )}

          {activeSection < 5 ? (
            <button type="submit" className={styles.nextButton} disabled={!validateSection(activeSection)}>
              Next
            </button>
          ) : (
            <button
              type="submit"
              className={styles.submitButton}
              disabled={formSubmitting || !validateSection(activeSection)}
            >
              {formSubmitting ? "Submitting..." : "Submit Registration"}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default EntityRegistrationForm

