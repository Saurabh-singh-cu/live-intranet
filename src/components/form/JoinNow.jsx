"use client"

import { useEffect, useState } from "react"
import { message, Spin, Popover } from "antd"
import "./JoinNow.css"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import apiClient from "../../config/apiClient"
import verified from "../../assets/images/verified.png"
import barcode from "../../assets/images/barcode.png"
import { LoadingOutlined } from "@ant-design/icons"

const JoinNow = () => {
  const [email, setEmail] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [transactionId, setTransactionId] = useState("")
  const [confirmTransactionId, setConfirmTransactionId] = useState("")
  const [transactionIdError, setTransactionIdError] = useState("")
  const [submitTimer, setSubmitTimer] = useState(0)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const [entity, setEntity] = useState("")
  const [entityType, setEntityType] = useState("")
  const [name, setName] = useState("")
  const [uid, setUid] = useState("")
  const [department, setDepartment] = useState("")
  const [otp, setOtp] = useState("")
  const [membershipId, setMembershipId] = useState("")

  const [errors, setErrors] = useState({})

  const [entityData, setEntityData] = useState([])
  const [entityListData, setEntityListData] = useState([])
  const [departments, setDepartments] = useState([])
  const [mobileNumber, setMobileNumber] = useState("")
  const [isFormDisabled, setIsFormDisabled] = useState(false)

  const [timeLeft, setTimeLeft] = useState(800)

  const [isOtpSent, setIsOtpSent] = useState(false)
  const [loadingOtp, setLoadingOtp] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formateTimer = (seconds) => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return (
      <p style={{ color: "red" }}>
        {min} : {sec < 10 ? "0" : ""} {sec}
      </p>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (entity === "1") {
      // Validate transaction IDs match
      if (transactionId !== confirmTransactionId) {
        setTransactionIdError("Transaction IDs do not match. Please verify and try again.")
        return
      }
    }

    handleFinalSubmit()
  }

  const handleFinalSubmit = async () => {
    setLoading(true)
    try {
      const response = await apiClient.post("final_submit/", {
        membership_id: membershipId,
        transaction_id: entity === "1" ? transactionId : "No Payment Required",
      })
      Swal.fire({
        title: entity === "1" ? "Payment Success" : "Registration Success",
        text: "We will be in touch ",
        icon: "success",
      })
      setShowSuccessMessage(true)
      navigate("/")
    } catch (error) {
      console.error("Final submission failed:", error)
      Swal.fire({
        title: "Failed",
        text: `Final submission failed: ${error}`,
        icon: "error",
      })
    } finally {
      setLoading(false) // End loading
    }
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
  }

  const handleSendOTP = async () => {
    setLoadingOtp(true)
    try {
      setIsFormDisabled(true)
      const response = await apiClient.post("send_otp_email/", {
        member_name: name,
        member_email: `${email.toLowerCase()}@cuchd.in`,
        dept_id: department,
        entity_id: entity,
        reg_id: entityType,
        member_mobile: `+91${mobileNumber}`,
        member_uid: uid?.toLowerCase(),
      })
      setIsOtpSent(true)
      console.log("Email sent ", response?.data)
      Swal.fire({
        title: "OTP sent!",
        text: "OTP sent to your email",
        icon: "success",
      })
      setOtpTimer(120)
      setMembershipId(response?.data?.member_id)
      const timer = setInterval(() => {
        setOtpTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            setIsFormDisabled(false)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    } catch (error) {
      console.error("Failed to send OTP:", error)
      Swal.fire({
        title: "Failed to send OTP",
        text: ` ${error?.response?.data?.error}`,
        icon: "warning",
      })
      setIsFormDisabled(false)
    } finally {
      setLoadingOtp(false) // End loading
    }
  }

  const handleVerifyOTP = async () => {
    setLoading(true)
    try {
      const response = await apiClient.post("verify_otp/", {
        membership_id: membershipId,
        otp: otp,
      })
      console.log("OTP verified successfully")
      setIsVerified(true)
      Swal.fire({
        title: "You are genuine",
        text: "OTP verified successfully",
        icon: "success",
      })
    } catch (error) {
      console.error("OTP verification failed:", error)
      Swal.fire({
        title: "Went Wrong",
        text: `${error?.response?.data?.error}`,
        icon: "error",
      })
    } finally {
      setLoading(false) // End loading
    }
  }

  const handleBeforeUnload = (e) => {
    if (isOtpSent) {
      e.preventDefault()
      e.returnValue = ""
    }
  }

  useEffect(() => {
    if (isOtpSent) {
      window.addEventListener("beforeunload", handleBeforeUnload)
    }
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [isOtpSent])

  const validateForm = () => {
    const newErrors = {}
    if (!entity) newErrors.entity = "Please select an entity"
    if (!entityType) newErrors.entityType = "Please select an entity type"
    if (!name) newErrors.name = "Please enter your name"
    if (!uid) newErrors.uid = "Please enter your UID"
    if (!department) newErrors.department = "Please select a department"
    if (!email) newErrors.email = "Please enter your email"
    if (!isVerified) newErrors.otp = "Please verify your OTP"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextPage = () => {
    if (validateForm() && isVerified) {
      if (entity === "1") {
        setShowPayment(true)
      } else {
        // For non-CLUB entities, directly call handleFinalSubmit instead of redirecting
        handleFinalSubmit()
      }
    } else {
      message.error("Please fill all fields and verify your email before proceeding.")
    }
  }

  const apiUrls = {
    "entity-types": "entity-types/",
    departments: "departments/",
    currentSession: "current_session/",
  }

  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get(apiUrls.departments)
      setDepartments(response.data)
    } catch (error) {
      console.error("Error fetching departments:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEntityData = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get(apiUrls["entity-types"])
      setEntityData(response.data)
    } catch (error) {
      console.error("Error fetching entity data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEntityList = async (entity) => {
    setLoading(true)
    try {
      const response = await apiClient.get(`entity-registration-name/?entity_id=${entity}`)
      setEntityListData(response.data)
      console.log(response.data, "Updated entity list")
    } catch (error) {
      console.error("Error fetching entity list:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEntityData()
    fetchDepartments()
  }, [])

  useEffect(() => {
    if (entity) {
      fetchEntityList(entity)
    } else {
      setEntityListData([])
    }
    setEntityType("")
  }, [entity])

  useEffect(() => {
    if (uid) {
      setEmail(uid.toLowerCase())
    }
  }, [uid])

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target

    if (name === "uid") {
      if (value.length >= 9) {
        const uidPattern = /^\d{2}[A-Za-z]{3}\d{4,5}$/
        if (!uidPattern.test(value)) {
          setErrors((prev) => ({
            ...prev,
            uid: "UID must start with 2 digits, followed by 3 letters, and end with 4 to 7 digits",
          }))

          Swal.fire({
            title: "Wrong Email",
            text: "UID must start with 2 digits, followed by 3 letters, and end with 4 to 7 digits ",
            icon: "warning",
          })
        } else {
          setErrors((prev) => ({ ...prev, uid: "" }))
        }
      } else {
        setErrors((prev) => ({ ...prev, uid: "" }))
      }
    }
    setter(value)
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  if (showPayment) {
    return (
      <>
        {entity === "1" ? (
          <div className="payment-container">
            <div className="payment-form-wrapper">
              <h2>Complete Your Payment</h2>
              <p>Scan the QR code and enter the transaction ID to confirm</p>

              <div className="timer-display">
                <span role="img" aria-label="timer">
                  ⏱️
                </span>
                <p>Time remaining: {formateTimer(timeLeft)}</p>
              </div>

              <div className="qr-code-container">
                <img src={barcode || "/placeholder.svg?height=200&width=200"} alt="Payment QR Code" />
              </div>

              {timeLeft <= 0 && (
                <p className="time-expired">Time has expired. Please go back and fill the form again.</p>
              )}

              <form className="payment-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="transaction-id" className="form-label">
                    Transaction ID
                  </label>
                  <input
                    id="transaction-id"
                    name="transaction-id"
                    type="text"
                    required
                    className="form-input"
                    value={transactionId}
                    onChange={(e) => {
                      setTransactionId(e.target.value)
                      setTransactionIdError("")
                    }}
                    placeholder="Enter Transaction ID"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-transaction-id" className="form-label">
                    Enter Transaction ID
                  </label>
                  <input
                    id="confirm-transaction-id"
                    name="confirm-transaction-id"
                    type="text"
                    required
                    className="form-input"
                    value={confirmTransactionId}
                    onChange={(e) => {
                      setConfirmTransactionId(e.target.value)
                      setTransactionIdError("") // Clear previous error
                    }}
                    placeholder="Confirm the Transaction ID"
                  />
                </div>

                {transactionIdError && (
                  <div className="transaction-error">
                    <span role="img" aria-label="error">
                      ❌
                    </span>
                    {transactionIdError}
                  </div>
                )}

                {confirmTransactionId && transactionId === confirmTransactionId && confirmTransactionId.length > 5 && (
                  <div className="transaction-success">
                    <span role="img" aria-label="success">
                      ✅
                    </span>
                    Transaction ID verified successfully!
                  </div>
                )}

                <button type="submit" className="pay-button" disabled={timeLeft <= 0 || loading}>
                  <span className="lock-icon">🔒</span>
                  {loading ? <Spin size="small" /> : "Complete Payment"}
                </button>
              </form>
              <div className="secure-payment-info">
                <span className="credit-card-icon">💳</span>
                <p>Secure payment processing • 256-bit encryption</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-payment-container">
            <div className="no-payment-content">
              <h2>Complete Your Registration</h2>
              <p>You're almost there! No payment is required for this entity type.</p>

              <div className="free-features">
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <p>Free Membership</p>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <p>Full Access to Activities</p>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <p>Official Recognition</p>
                </div>
              </div>

              <button onClick={handleFinalSubmit} className="submit-button" disabled={loading}>
                <span className="check-icon">✓</span>
                {loading ? <Spin size="small" /> : "Complete Registration"}
              </button>

              <div className="welcome-message">
                <p>Welcome to our community! We're excited to have you join us.</p>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  if (showSuccessMessage) {
    return (
      <div className="success-message">
        <h2>Registration Successful!</h2>
        <p>Thank you for joining CU-Intranet. Your account has been created successfully.</p>
      </div>
    )
  }

  return (
    <div className="registration-container">
      <div className="border-line">
        <div className="sidebar-joinnow">
          <h2>Join As a New Member</h2>
          <p className="subtitle">
            Fill out the form below to create your profile and become a part of our amazing community.
          </p>
          <ul className="requirements-list">
            <li>Membership: 1 Club and 1 Prof. Soc./Dept. Soc./ Comm./Ind.Tech Comm.</li>
            <li>Participation: 2 Activities/Events per year (minimum 25 hours in a year)</li>
            <li>Academic Credits: Minimum Earn at least 1 GP Credit in AY.</li>
            <li>Mandatory All Fields to become member of any entity.</li>
            <li>A student can be member of multiple entity</li>
            <li>There is a membership fee for Club as per university norms</li>
            <li>The membership fee for professional society / Student chapter is as per governed outside bodies.</li>
            <li>After successfully Registration a E-Membership card is generated on official mail id.</li>
          </ul>
        </div>

        <div className="main-content">
          <form>
            <section className="form-section">
              <h3>Personal Information</h3>
              <div className="input-grid">
                <div className="input-group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => handleInputChange(e, setName)}
                    placeholder="Name"
                    className="form-input"
                    disabled={isOtpSent}
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div className="input-group">
                  <input
                    type="text"
                    id="uid"
                    name="uid"
                    value={uid}
                    onChange={(e) => handleInputChange(e, setUid)}
                    placeholder="UID"
                    className="form-input"
                    disabled={isOtpSent}
                  />
                  {errors.uid && <span className="error">{errors.uid}</span>}
                </div>

                <div className="input-group">
                  <select
                    id="department"
                    name="department"
                    value={department}
                    onChange={(e) => handleInputChange(e, setDepartment)}
                    className="form-select"
                    disabled={isOtpSent}
                  >
                    <option value="">Department</option>
                    {departments.map((dept) => (
                      <option key={dept.dept_id} value={dept.dept_id}>
                        {dept.dept_name}
                      </option>
                    ))}
                  </select>
                  {errors.department && <span className="error">{errors.department}</span>}
                </div>

                <div className="input-group">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ marginRight: "8px", fontWeight: "bold" }}>+91</span>
                    <input
                      type="text"
                      id="mobileNumber"
                      name="mobileNumber"
                      value={mobileNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "")
                        if (value.length <= 10) {
                          handleInputChange({ target: { name: "mobileNumber", value } }, setMobileNumber)
                        }
                      }}
                      placeholder="Phone Number (10 digits)"
                      className="form-input"
                      disabled={isOtpSent}
                      style={{ flex: 1 }}
                      maxLength={10}
                    />
                  </div>
                  {mobileNumber && mobileNumber.length !== 10 && (
                    <span className="error">Mobile number must be 10 digits</span>
                  )}
                </div>
              </div>
            </section>

            <section className="form-section">
              <h3>Select Entity & Department</h3>
              <div className="input-grid">
                <div className="input-group">
                  <select
                    id="entity"
                    name="entity"
                    value={entity}
                    onChange={(e) => handleInputChange(e, setEntity)}
                    className="form-select"
                    disabled={isOtpSent}
                  >
                    <option value="">Entity Type</option>
                    {entityData.map((entity) => (
                      <option key={entity.entity_id} value={entity.entity_id}>
                        {entity.entity_name}
                      </option>
                    ))}
                  </select>
                  {errors.entity && <span className="error">{errors.entity}</span>}
                </div>

                <div className="input-group">
                  <select
                    id="entityType"
                    name="entityType"
                    value={entityType}
                    onChange={(e) => handleInputChange(e, setEntityType)}
                    className="form-select"
                    disabled={isOtpSent}
                  >
                    <option value="">Select Entity Category</option>
                    {entityListData.map((entity, index) => (
                      <option key={`${entity.reg_id}-${index}`} value={entity.reg_id}>
                        {entity.registration_name}
                      </option>
                    ))}
                  </select>
                  {errors.entityType && <span className="error">{errors.entityType}</span>}
                </div>
              </div>
            </section>

            <section className="form-section">
              <h3>Verification</h3>
              <div className="verification-grid">
                <div className="email-group">
                  <div className="email-input-container">
                    <input
                      type="text"
                      value={email}
                      readOnly
                      placeholder="Email ID (auto-filled from UID)"
                      className="form-input"
                      disabled
                     
                    />
                    <span className="domain">@cuchd.in</span>
                    {isVerified && (
                      <span className="verified-badge">
                        <img style={{ width: "26px" }} src={verified || "/placeholder.svg"} alt="vef" />
                      </span>
                    )}
                  </div>
                  <Popover
                    content={`Email: ${email.toLowerCase()}@cuchd.in`}
                    title="Verification Email"
                    trigger="hover"
                  >
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      className="otp-button"
                      disabled={otpTimer > 0 || isFormDisabled || !email}
                    >
                      {loadingOtp ? (
                        <Spin indicator={<LoadingOutlined spin />} size="large" />
                      ) : otpTimer > 0 ? (
                        `Resend OTP (${otpTimer}s)`
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  </Popover>
                </div>

                <div className="otp-group">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="OTP"
                    className="form-input"
                  />
                  <button type="button" onClick={handleVerifyOTP} className="verify-button">
                    {loading ? <Spin size="small" /> : "Verify"}
                  </button>
                </div>
              </div>
            </section>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button type="button" onClick={handleNextPage} className="register-button-joinnow" disabled={!isVerified}>
                {loading ? <Spin size="small" /> : entity === "1" ? "Make Payment" : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default JoinNow

