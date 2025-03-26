"use client";

import { useEffect, useState } from "react";
import { Spin } from "antd";
import styles from "./JoinNow.module.css";
import { useNavigate } from "react-router-dom";
import apiClient from "../../config/apiClient";
import verified from "../../assets/images/verified.png";
import barcode from "../../assets/images/barcode.png";
import { LoadingOutlined } from "@ant-design/icons";

// Custom Alert Component
const CustomAlert = ({ type, message, onClose }) => {
  return (
    <div className={`${styles.customAlert} ${styles[type]}`}>
      <div className={styles.alertContent}>
        <div className={styles.alertIcon}>
          {type === "success" && "✓"}
          {type === "error" && "✕"}
          {type === "warning" && "!"}
          {type === "info" && "i"}
        </div>
        <div className={styles.alertMessage}>{message}</div>
      </div>
      <button className={styles.alertClose} onClick={onClose}>
        ×
      </button>
    </div>
  );
};

const JoinNow = () => {
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [transactionId, setTransactionId] = useState("");
  const [confirmTransactionId, setConfirmTransactionId] = useState("");
  const [transactionIdError, setTransactionIdError] = useState("");
  const [submitTimer, setSubmitTimer] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [acknowledgeTerms, setAcknowledgeTerms] = useState(false);

  const [entity, setEntity] = useState("");
  const [entityType, setEntityType] = useState("");
  const [name, setName] = useState("");
  const [uid, setUid] = useState("");
  const [department, setDepartment] = useState("");
  const [otp, setOtp] = useState("");
  const [membershipId, setMembershipId] = useState("");

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const [entityData, setEntityData] = useState([]);
  const [entityListData, setEntityListData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [mobileNumber, setMobileNumber] = useState("");
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const [timeLeft, setTimeLeft] = useState(800);

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const navigate = useNavigate();

  // Show custom alert with 10 second duration
  const showAlert = (type, message, duration = 10000) => {
    setAlert({ type, message });
    if (duration) {
      setTimeout(() => {
        setAlert(null);
      }, duration);
    }
  };



  const formateTimer = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return (
      <span className={styles.timer}>
        {min}:{sec < 10 ? "0" : ""}
        {sec}
      </span>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (entity === "1") {
      // Validate transaction IDs match
      if (transactionId !== confirmTransactionId) {
        setTransactionIdError(
          "Transaction IDs do not match. Please verify and try again."
        );
        return;
      }
    }

    handleFinalSubmit();
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post("final_submit/", {
        membership_id: membershipId,
        transaction_id: entity === "1" ? transactionId : "No Payment Required",
      });
      showAlert(
        "success",
        entity === "1"
          ? "Membership registration successfull, Membership activation upon approval"
          : "Membership registration successfull, Membership activation upon approval"
      );
      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Final submission failed:", error);
      showAlert(
        "error",
        `Final submission failed: ${error.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value.trim());
  };

  const handleSendOTP = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      showAlert("error", "Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoadingOtp(true);
    try {
      setIsFormDisabled(true);
      const response = await apiClient.post("send_otp_email/", {
        member_name: name,
        member_email: `${email.toLowerCase()}@cumail.in`,
        dept_id: department,
        entity_id: entity,
        reg_id: entityType,
        member_mobile: `+91${mobileNumber}`,
        member_uid: uid?.toLowerCase(),
      });
      setIsOtpSent(true);
      console.log("Email sent ", response?.data);
      showAlert("success", "OTP sent to your email");
      setOtpTimer(120);
      setMembershipId(response?.data?.member_id);
      const timer = setInterval(() => {
        setOtpTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsFormDisabled(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Failed to send OTP:", error);
      showAlert(
        "error",
        `Failed to send OTP: ${error?.response?.data?.error || "Unknown error"}`
      );
      setIsFormDisabled(false);
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post("verify_otp/", {
        membership_id: membershipId,
        otp: otp,
      });
      console.log("OTP verified successfully");
      setIsVerified(true);
      showAlert("success", "OTP verified successfully");

      // If entity is 1, show payment section
      if (entity === "1") {
        setShowPayment(true);
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      showAlert(
        "error",
        `OTP verification failed: ${
          error?.response?.data?.error || "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBeforeUnload = (e) => {
    if (isOtpSent) {
      e.preventDefault();
      e.returnValue = "";
    }
  };

  useEffect(() => {
    if (isOtpSent) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isOtpSent]);

  const validateForm = () => {
    const newErrors = {};
    if (!entity) newErrors.entity = "Please select an entity";
    if (!entityType) newErrors.entityType = "Please select an entity type";
    if (!name) newErrors.name = "Please enter your name";
    if (!uid) newErrors.uid = "Please enter your UID";
    if (!department) newErrors.department = "Please select a department";
    if (!email) newErrors.email = "Please enter your email";
    if (!isVerified) newErrors.otp = "Please verify your OTP";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextPage = () => {
    if (validateForm() && isVerified) {
      if (entity === "1") {
        setShowPayment(true);
      } else {
        // For non-CLUB entities, directly call handleFinalSubmit instead of redirecting
        handleFinalSubmit();
      }
    } else {
      showAlert(
        "warning",
        "Please fill all fields and verify your email before proceeding."
      );
    }
  };

  const apiUrls = {
    "entity-types": "entity-types/",
    departments: "departments/",
    currentSession: "current_session/",
  };

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(apiUrls.departments);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      showAlert("error", "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const fetchEntityData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(apiUrls["entity-types"]);
      setEntityData(response.data);
    } catch (error) {
      console.error("Error fetching entity data:", error);
      showAlert("error", "Failed to load entity types");
    } finally {
      setLoading(false);
    }
  };

  const fetchEntityList = async (entity) => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `entity-registration-name/?entity_id=${entity}`
      );
      setEntityListData(response.data);
      console.log(response.data, "Updated entity list");
    } catch (error) {
      console.error("Error fetching entity list:", error);
      showAlert("error", "Failed to load entity categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntityData();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (entity) {
      fetchEntityList(entity);
    } else {
      setEntityListData([]);
    }
    setEntityType("");
  }, [entity]);

  useEffect(() => {
    if (uid) {
      setEmail(uid.toLowerCase());
    }
  }, [uid]);

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;

    if (name === "uid") {
      // Trim whitespace for UID field
      const trimmedValue = value.trim();

      if (trimmedValue.length >= 9) {
        const uidPattern = /^\d{2}[A-Za-z]{3}\d{4,5}$/;
        if (!uidPattern.test(trimmedValue)) {
          setErrors((prev) => ({
            ...prev,
            uid: "UID must start with 2 digits, followed by 3 letters, and end with 4 to 7 digits",
          }));

          showAlert(
            "warning",
            "UID must start with 2 digits, followed by 3 letters, and end with 4 to 7 digits"
          );
        } else {
          setErrors((prev) => ({ ...prev, uid: "" }));
        }
      } else {
        setErrors((prev) => ({ ...prev, uid: "" }));
      }
      setter(trimmedValue);
    } else {
      setter(value);
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  if (showSuccessMessage) {
    return (
      <div className={styles.successMessage}>
        <div className={styles.successIcon}>✓</div>
        <h2>Registration Successful!</h2>
        <p>
          Membership registration successful, Membership activation upon approval.
          Thank you for joining CU-Intranet.
        </p>
        <div className={styles.progressBar}>
          <div className={styles.progressFill}></div>
        </div>
        <button style={{marginTop:"13px"}} className={styles.actionButton} onClick={() => navigate("/")}>
          Go To Home
        </button>
      </div>
    );
  }

  return (
    <div className={styles.registrationContainer}>
      {alert && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h1>Join as a new member</h1>

          <div className={styles.progressSteps}>
            <div
              className={`${styles.step} ${
                activeStep >= 1 ? styles.active : ""
              }`}
            >
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepLabel}>Personal Info</div>
            </div>
            <div className={styles.stepConnector}></div>
            <div
              className={`${styles.step} ${
                activeStep >= 2 ? styles.active : ""
              }`}
            >
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepLabel}>Verification</div>
            </div>
            <div className={styles.stepConnector}></div>
            <div
              className={`${styles.step} ${
                activeStep >= 3 ? styles.active : ""
              }`}
            >
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepLabel}>Completion</div>
            </div>
          </div>
        </div>

        <div className={styles.formContent}>
          <div className={styles.formSidebar}>
            <div className={styles.sidebarContent}>
              <h3>Membership Requirements</h3>
              <ul className={styles.requirementsList}>
                <li>
                  <span className={styles.bulletPoint}></span>
                  Please complete all required fields.
                </li>
                <li>
                  <span className={styles.bulletPoint}></span>
                  Memberships will be issued to your university-registered
                  email.
                </li>
                <li>
                  <span className={styles.bulletPoint}></span>
                  Membership activates upon approval through your secretary.
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.formMain}>
            {!showPayment ? (
              <form>
                <section className={styles.formSection}>
                  <h3 className={styles.formHeaderTwo}>
                    Join as a new member{" "}
                  </h3>
                  <h3>Personal Information</h3>
                  <div className={styles.inputGrid}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => handleInputChange(e, setName)}
                        placeholder="Enter your full name"
                        className={styles.formInput}
                        disabled={isOtpSent}
                        required
                      />
                      {errors.name && (
                        <span className={styles.error}>{errors.name}</span>
                      )}
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="uid">UID</label>
                      <input
                        type="text"
                        id="uid"
                        name="uid"
                        value={uid}
                        onChange={(e) => handleInputChange(e, setUid)}
                        placeholder="Enter your UID"
                        className={styles.formInput}
                        disabled={isOtpSent}
                        required
                      />
                      {errors.uid && (
                        <span className={styles.error}>{errors.uid}</span>
                      )}
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="department">Department</label>
                      <select
                        id="department"
                        name="department"
                        value={department}
                        onChange={(e) => handleInputChange(e, setDepartment)}
                        className={styles.formSelect}
                        disabled={isOtpSent}
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept.dept_id} value={dept.dept_id}>
                            {dept.dept_name}
                          </option>
                        ))}
                      </select>
                      {errors.department && (
                        <span className={styles.error}>
                          {errors.department}
                        </span>
                      )}
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="mobileNumber">Mobile Number</label>
                      <div className={styles.phoneInput}>
                        <span className={styles.countryCode}>+91</span>
                        <input
                          type="text"
                          id="mobileNumber"
                          name="mobileNumber"
                          value={mobileNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 10) {
                              handleInputChange(
                                { target: { name: "mobileNumber", value } },
                                setMobileNumber
                              );
                            }
                          }}
                          placeholder="Enter 10-digit number"
                          className={styles.formInput}
                          disabled={isOtpSent}
                          maxLength={10}
                          required
                        />
                      </div>
                      {mobileNumber && mobileNumber.length !== 10 && (
                        <span className={styles.error}>
                          Mobile number must be 10 digits
                        </span>
                      )}
                    </div>
                  </div>
                </section>

                <section className={styles.formSection}>
                  <h3>Select Entity & Category</h3>
                  <div className={styles.inputGrid}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="entity">Entity Type</label>
                      <select
                        id="entity"
                        name="entity"
                        value={entity}
                        onChange={(e) => handleInputChange(e, setEntity)}
                        className={styles.formSelect}
                        disabled={isOtpSent}
                        required
                      >
                        <option value="">Select Entity Type</option>
                        {entityData.map((entity) => (
                          <option
                            key={entity.entity_id}
                            value={entity.entity_id}
                          >
                            {entity.entity_name}
                          </option>
                        ))}
                      </select>
                      {errors.entity && (
                        <span className={styles.error}>{errors.entity}</span>
                      )}
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="entityType">Entity Category</label>
                      <select
                        id="entityType"
                        name="entityType"
                        value={entityType}
                        onChange={(e) => handleInputChange(e, setEntityType)}
                        className={styles.formSelect}
                        disabled={isOtpSent}
                        required
                      >
                        <option value="">Select Entity Category</option>
                        {entityListData.map((entity, index) => (
                          <option
                            key={`${entity.reg_id}-${index}`}
                            value={entity.reg_id}
                          >
                            {entity.registration_name}
                          </option>
                        ))}
                      </select>
                      {errors.entityType && (
                        <span className={styles.error}>
                          {errors.entityType}
                        </span>
                      )}
                    </div>
                  </div>
                </section>

                <section className={styles.formSection}>
                  <h3>Email Verification</h3>
                  <div className={styles.verificationRow}>
                    <div className={styles.verificationCol}>
                      <label>Your Email  {isVerified && (
                          <span className={styles.verifiedBadge}>
                            <img
                              src={verified || "/placeholder.svg"}
                              alt="Verified"
                            />
                          </span>
                        )}</label>
                      <div className={styles.emailField}>
                        <input
                          type="text"
                          value={email}
                          readOnly
                          className={styles.formInput}
                          disabled
                        />
                        <span className={styles.domain}>@cumail.in</span>
                       
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      className={`${styles.actionButton} ${styles.otpButton}`}
                      disabled={otpTimer > 0 || isFormDisabled || !email}
                    >
                      {loadingOtp ? (
                        <Spin indicator={<LoadingOutlined spin />} />
                      ) : otpTimer > 0 ? (
                        `${otpTimer}s`
                      ) : (
                        "Send OTP"
                      )}
                    </button>

                    <div className={styles.verificationCol}>
                      <label htmlFor="otp">Enter OTP</label>
                      <div className={styles.otpField}>
                        <input
                          type="text"
                          id="otp"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter OTP"
                          className={styles.formInput}
                        />
                      </div>
                    </div>

                    <div className={styles.verificationButtons}>
                      <button
                        type="button"
                        onClick={handleVerifyOTP}
                        className={`${styles.actionButton} ${styles.verifyButton}`}
                        disabled={!otp || otp.length < 4}
                      >
                        {loading ? <Spin size="small" /> : "Verify"}
                      </button>
                    </div>
                  </div>
                </section>

                {!isVerified && (
                  <div className={styles.formActions}>
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className={styles.primaryButton}
                      disabled={
                        !name ||
                        !uid ||
                        !department ||
                        !mobileNumber ||
                        !entity ||
                        !entityType ||
                        !otp
                      }
                    >
                      Continue to Verification
                    </button>
                  </div>
                )}

                {isVerified && !showPayment && entity !== "1" && (
                  <div className={styles.formActions}>
                    <div className={styles.acknowledgement}>
                      <input
                        type="checkbox"
                        id="acknowledge"
                        checked={acknowledgeTerms}
                        onChange={(e) => setAcknowledgeTerms(e.target.checked)}
                      />
                      <label htmlFor="acknowledge">
                        I acknowledge that all the information provided is
                        correct and complete
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={handleNextPage}
                      className={styles.primaryButton}
                      disabled={!acknowledgeTerms}
                    >
                      {loading ? (
                        <Spin size="small" />
                      ) : (
                        "Complete Registration"
                      )}
                    </button>
                  </div>
                )}
              </form>
            ) : (
              <div className={styles.paymentSection}>
                <h3>Complete Your Payment</h3>
                <p>
                  Scan the QR code below and enter the transaction details to
                  complete your registration
                </p>

         

                <div className={styles.qrCodeWrapper}>
                  <img
                    src={barcode || "/placeholder.svg?height=200&width=200"}
                    alt="Payment QR Code"
                    className={styles.qrCode}
                  />
                </div>


                <form className={styles.paymentForm} onSubmit={handleSubmit}>
                  <div className={styles.paymentRow}>
                    <div className={styles.paymentCol}>
                      <label htmlFor="transaction-id">Transaction ID</label>
                      <input
                        id="transaction-id"
                        name="transaction-id"
                        type="password"
                        required
                        className={styles.formInput}
                        value={transactionId}
                        onChange={(e) => {
                          setTransactionId(e.target.value);
                          setTransactionIdError("");
                        }}
                        placeholder="Enter Transaction ID"
                        
                      />
                    </div>

                    <div className={styles.paymentCol}>
                      <label htmlFor="confirm-transaction-id">
                        Confirm Transaction ID
                      </label>
                      <input
                        id="confirm-transaction-id"
                        name="confirm-transaction-id"
                        type="text"
                        required
                        className={styles.formInput}
                        value={confirmTransactionId}
                        onChange={(e) => {
                          setConfirmTransactionId(e.target.value);
                          setTransactionIdError("");
                        }}
                        placeholder="Confirm the Transaction ID"
                      />
                    </div>

                  
                  </div>

                  {transactionIdError && (
                    <div className={styles.transactionError}>
                      <span className={styles.errorIcon}>⚠️</span>
                      {transactionIdError}
                    </div>
                  )}

                  {confirmTransactionId &&
                    transactionId === confirmTransactionId &&
                    confirmTransactionId.length > 3 && (
                      <div className={styles.transactionSuccess}>
                        <span className={styles.successIcon}>✓</span>
                        Transaction IDs match!
                      </div>
                    )}

                  <div className={styles.acknowledgement}>
                    <input
                      type="checkbox"
                      id="acknowledge"
                      checked={acknowledgeTerms}
                      onChange={(e) => setAcknowledgeTerms(e.target.checked)}
                    />
                    <label htmlFor="acknowledge">
                      I acknowledge that all the information provided is correct
                      and complete
                    </label>
                  </div>
                  <div className={styles.paymentCol}>
                      <label>&nbsp;</label>
                      <button
                        type="submit"
                        className={styles.paymentSubmitButton}
                        disabled={
                          timeLeft <= 0 ||
                          loading ||
                          !acknowledgeTerms ||
                          !transactionId ||
                          !confirmTransactionId
                        }
                      >
                        {loading ? <Spin size="small" /> : "Submit"}
                      </button>
                    </div>
                </form>

                <div className={styles.securePayment}>
                  <div className={styles.secureIcon}>🔒</div>
                  <p>Secure payment processing • 256-bit encryption</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinNow;
