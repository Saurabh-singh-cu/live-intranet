

"use client";

import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./RegisterNewEntity.css";
import HelpGuide from "./HelpGuide";
import ModalGuide from "./ModalGuide";
import Swal from "sweetalert2";
import apiClient from "../../config/apiClient";

const RegisterNewEntity = () => {
  const [activeTab, setActiveTab] = useState("universityBody");
  const [currentSession, setCurrentSession] = useState([]);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    entity: "",
    proposed_name: "",
    proposed_date: "",
    proposed_by: "",
    proposer_name: "",
    emp_code: "",
    proposer_email: "",
    mobile: "",
    entity_nature: "",
    session_code: "",
    student_sec_1_name: "",
    student_sec_1_email: "",
    student_sec_1_uid: "",
    student_sec_1_mobile: "",
    student_sec_2_name: "",
    student_sec_2_email: "",
    student_sec_2_uid: "",
    student_sec_2_mobile: "",
    student_advsec_1_name: "",
    student_advsec_1_email: "",
    student_advsec_1_uid: "",
    student_advsec_1_mobile: "",
    student_advsec_2_name: "",
    student_advsec_2_email: "",
    student_advsec_2_uid: "",
    student_advsec_2_mobile: "",
    faculty_adv_1_name: "",
    faculty_adv_1_email: "",
    faculty_adv_1_empcode: "",
    faculty_adv_1_mobile: "",
    faculty_adv_2_name: "",
    faculty_adv_2_email: "",
    faculty_adv_2_empcode: "",
    faculty_adv_2_mobile: "",
    faculty_coadv_1_name: "",
    faculty_coadv_1_email: "",
    faculty_coadv_1_empcode: "",
    faculty_coadv_1_mobile: "",
    faculty_coadv_2_name: "",
    faculty_coadv_2_email: "",
    faculty_coadv_2_empcode: "",
    faculty_coadv_2_mobile: "",
    department: "",
    referal: "",
  });

  const [acknowledgement, setAcknowledgement] = useState({
    agreed: false,
  });

  const isTabValid = (tab) => {
    switch (tab) {
      case "universityBody":
        return validateUniversityBody(false);
      case "advisoryBoardStudent":
        return validateAdvisoryBoardStudent(false);
      case "advisoryBoardFaculty":
        return validateAdvisoryBoardFaculty(false);
      case "acknowledgement":
        return true; // No validation needed to view acknowledgement
      default:
        return true;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEntityClick = (entity) => {
    setFormData((prevState) => ({
      ...prevState,
      entity: entity.entity_id,
      type: entity.entity_name,
    }));

    // Clear entity error
    if (errors.entity) {
      setErrors((prev) => ({ ...prev, entity: "" }));
    }

    // Mark as touched
    setTouched((prev) => ({ ...prev, entity: true }));
  };

  const handleQuillChange = (value) => {
    setFormData((prevState) => ({ ...prevState, referal: value }));
  };

  const handleTabClick = (tab) => {
    if (isTabValid(activeTab)) {
      setActiveTab(tab);
    } else {
      // Show an error message or highlight invalid fields
      const invalidFields = Object.keys(errors).filter((key) => errors[key]);
      Swal.fire({
        title: "Validation Error",
        text: `Please fill in all required fields in the current tab before proceeding: ${invalidFields.join(
          ", "
        )}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const validateUniversityBody = (markTouched = true) => {
    const requiredFields = [
      "entity",
      "proposed_name",
      "proposed_date",
      "proposed_by",
      "proposer_name",
      "emp_code",
      "proposer_email",
      "mobile",
      "entity_nature",
      "department",
    ];

    const newErrors = { ...errors };
    let isValid = true;
    const newTouched = { ...touched };

    requiredFields.forEach((field) => {
      if (markTouched) {
        newTouched[field] = true;
      }

      if (!formData[field] && newTouched[field]) {
        newErrors[field] = `This field is required`;
        isValid = false;
      }
    });

    // Email validation
    if (formData.proposer_email && newTouched.proposer_email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.proposer_email)) {
        newErrors.proposer_email = "Please enter a valid email address";
        isValid = false;
      }
    }

    // Mobile validation
    if (formData.mobile && newTouched.mobile) {
      const mobileValue = formData.mobile.replace(/^\+91/, "");
      if (mobileValue.length !== 10 || !/^\d+$/.test(mobileValue)) {
        newErrors.mobile = "Please enter a valid 10-digit mobile number";
        isValid = false;
      }
    }

    setErrors(newErrors);
    if (markTouched) {
      setTouched(newTouched);
    }

    return isValid;
  };

  const validateAdvisoryBoardStudent = (markTouched = true) => {
    const requiredFields = [
      "student_sec_1_name",
      "student_sec_1_email",
      "student_sec_1_uid",
      "student_sec_1_mobile",
      "student_advsec_1_name",
      "student_advsec_1_email",
      "student_advsec_1_uid",
      "student_advsec_1_mobile",
    ];

    const newErrors = { ...errors };
    let isValid = true;
    const newTouched = { ...touched };

    requiredFields.forEach((field) => {
      if (markTouched) {
        newTouched[field] = true;
      }

      if (!formData[field] && newTouched[field]) {
        newErrors[field] = `This field is required`;
        isValid = false;
      }
    });

    // Email validation
    if (formData.student_sec_1_email && newTouched.student_sec_1_email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.student_sec_1_email)) {
        newErrors.student_sec_1_email = "Please enter a valid email address";
        isValid = false;
      }
    }

    // Mobile validation
    if (formData.student_sec_1_mobile && newTouched.student_sec_1_mobile) {
      const mobileValue = formData.student_sec_1_mobile.replace(/^\+91/, "");
      if (mobileValue.length !== 10 || !/^\d+$/.test(mobileValue)) {
        newErrors.student_sec_1_mobile =
          "Please enter a valid 10-digit mobile number";
        isValid = false;
      }
    }

    // Optional fields validation
    if (formData.student_advsec_1_email && newTouched.student_advsec_1_email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.student_advsec_1_email)) {
        newErrors.student_advsec_1_email = "Please enter a valid email address";
        isValid = false;
      }
    }

    if (
      formData.student_advsec_1_mobile &&
      newTouched.student_advsec_1_mobile
    ) {
      const mobileValue = formData.student_advsec_1_mobile.replace(/^\+91/, "");
      if (mobileValue.length !== 10 || !/^\d+$/.test(mobileValue)) {
        newErrors.student_advsec_1_mobile =
          "Please enter a valid 10-digit mobile number";
        isValid = false;
      }
    }

    setErrors(newErrors);
    if (markTouched) {
      setTouched(newTouched);
    }

    return isValid;
  };

  const validateAdvisoryBoardFaculty = (markTouched = true) => {
    const requiredFields = [
      "faculty_adv_1_name",
      "faculty_adv_1_email",
      "faculty_adv_1_empcode",
      "faculty_adv_1_mobile",
      "faculty_coadv_1_name",
      "faculty_coadv_1_email",
      "faculty_coadv_1_empcode",
      "faculty_coadv_1_mobile",
    ];

    const newErrors = { ...errors };
    let isValid = true;
    const newTouched = { ...touched };

    requiredFields.forEach((field) => {
      if (markTouched) {
        newTouched[field] = true;
      }

      if (!formData[field] && newTouched[field]) {
        newErrors[field] = `This field is required`;
        isValid = false;
      }
    });

    // Email validation
    if (formData.faculty_adv_1_email && newTouched.faculty_adv_1_email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.faculty_adv_1_email)) {
        newErrors.faculty_adv_1_email = "Please enter a valid email address";
        isValid = false;
      }
    }

    // Mobile validation
    if (formData.faculty_adv_1_mobile && newTouched.faculty_adv_1_mobile) {
      const mobileValue = formData.faculty_adv_1_mobile.replace(/^\+91/, "");
      if (mobileValue.length !== 10 || !/^\d+$/.test(mobileValue)) {
        newErrors.faculty_adv_1_mobile =
          "Please enter a valid 10-digit mobile number";
        isValid = false;
      }
    }

    // Optional fields validation
    if (formData.faculty_coadv_1_email && newTouched.faculty_coadv_1_email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.faculty_coadv_1_email)) {
        newErrors.faculty_coadv_1_email = "Please enter a valid email address";
        isValid = false;
      }
    }

    if (formData.faculty_coadv_1_mobile && newTouched.faculty_coadv_1_mobile) {
      const mobileValue = formData.faculty_coadv_1_mobile.replace(/^\+91/, "");
      if (mobileValue.length !== 10 || !/^\d+$/.test(mobileValue)) {
        newErrors.faculty_coadv_1_mobile =
          "Please enter a valid 10-digit mobile number";
        isValid = false;
      }
    }

    setErrors(newErrors);
    if (markTouched) {
      setTouched(newTouched);
    }

    return isValid;
  };

  const validateAcknowledgement = () => {
    const newErrors = { ...errors };
    let isValid = true;

    if (!acknowledgement.agreed) {
      newErrors.acknowledgement =
        "You must acknowledge the statement to proceed";
      isValid = false;
    } else {
      newErrors.acknowledgement = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (
      validateUniversityBody() &&
      validateAdvisoryBoardStudent() &&
      validateAdvisoryBoardFaculty() &&
      validateAcknowledgement()
    ) {
      try {
        setIsLoading(true);
        const response = await apiClient.post("entity-requests/", formData);

        if (response.status === 201 || response.status === 200) {
          Swal.fire({
            title: "Success",
            text: "Your form has been successfully submitted.",
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              // Reset form
              setFormData({
                entity: "",
                proposed_name: "",
                proposed_date: "",
                proposed_by: "",
                proposer_name: "",
                emp_code: "",
                proposer_email: "",
                mobile: "",
                entity_nature: "",
                session_code: currentSession,
                student_sec_1_name: "",
                student_sec_1_email: "",
                student_sec_1_uid: "",
                student_sec_1_mobile: "",
                student_sec_2_name: "",
                student_sec_2_email: "",
                student_sec_2_uid: "",
                student_sec_2_mobile: "",
                student_advsec_1_name: "",
                student_advsec_1_email: "",
                student_advsec_1_uid: "",
                student_advsec_1_mobile: "",
                student_advsec_2_name: "",
                student_advsec_2_email: "",
                student_advsec_2_uid: "",
                student_advsec_2_mobile: "",
                faculty_adv_1_name: "",
                faculty_adv_1_email: "",
                faculty_adv_1_empcode: "",
                faculty_adv_1_mobile: "",
                faculty_adv_2_name: "",
                faculty_adv_2_email: "",
                faculty_adv_2_empcode: "",
                faculty_adv_2_mobile: "",
                faculty_coadv_1_name: "",
                faculty_coadv_1_email: "",
                faculty_coadv_1_empcode: "",
                faculty_coadv_1_mobile: "",
                faculty_coadv_2_name: "",
                faculty_coadv_2_email: "",
                faculty_coadv_2_empcode: "",
                faculty_coadv_2_mobile: "",
                department: "",
                referal: "",
              });
              setActiveTab("universityBody");
              setAcknowledgement({
                agreed: false,
              });
              setErrors({});
              setTouched({});
            }
          });
        } else {
          throw new Error("Submission failed");
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "There was an error submitting your form. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Form submission error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNext = () => {
    let isValid = false;

    switch (activeTab) {
      case "universityBody":
        isValid = validateUniversityBody();
        break;
      case "advisoryBoardStudent":
        isValid = validateAdvisoryBoardStudent();
        break;
      case "advisoryBoardFaculty":
        isValid = validateAdvisoryBoardFaculty();
        break;
      case "acknowledgement":
        isValid = validateAcknowledgement();
        if (isValid) {
          // If acknowledged, proceed to form submission
          handleSubmit();
          return;
        }
        return;
      default:
        isValid = true;
    }

    if (isValid) {
      const tabs = [
        "universityBody",
        "advisoryBoardStudent",
        "advisoryBoardFaculty",
        "acknowledgement",
      ];
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
      }
    }
  };

  const handleAcknowledgementChange = (e) => {
    setAcknowledgement((prev) => ({ ...prev, agreed: e.target.checked }));

    // Clear acknowledgement error when checked
    if (e.target.checked && errors.acknowledgement) {
      setErrors((prev) => ({ ...prev, acknowledgement: "" }));
    }
  };

  const handleClear = () => {
    setFormData({
      entity: "",
      proposed_name: "",
      proposed_date: "",
      proposed_by: "",
      proposer_name: "",
      emp_code: "",
      proposer_email: "",
      mobile: "",
      entity_nature: "",
      session_code: currentSession,
      student_sec_1_name: "",
      student_sec_1_email: "",
      student_sec_1_uid: "",
      student_sec_1_mobile: "",
      student_sec_2_name: "",
      student_sec_2_email: "",
      student_sec_2_uid: "",
      student_sec_2_mobile: "",
      student_advsec_1_name: "",
      student_advsec_1_email: "",
      student_advsec_1_uid: "",
      student_advsec_1_mobile: "",
      student_advsec_2_name: "",
      student_advsec_2_email: "",
      student_advsec_2_uid: "",
      student_advsec_2_mobile: "",
      faculty_adv_1_name: "",
      faculty_adv_1_email: "",
      faculty_adv_1_empcode: "",
      faculty_adv_1_mobile: "",
      faculty_adv_2_name: "",
      faculty_adv_2_email: "",
      faculty_adv_2_empcode: "",
      faculty_adv_2_mobile: "",
      faculty_coadv_1_name: "",
      faculty_coadv_1_email: "",
      faculty_coadv_1_empcode: "",
      faculty_coadv_1_mobile: "",
      faculty_coadv_2_name: "",
      faculty_coadv_2_email: "",
      faculty_coadv_2_empcode: "",
      faculty_coadv_2_mobile: "",
      department: "",
      referal: "",
    });
    setErrors({});
    setTouched({});
  };

  const handleBack = () => {
    const tabs = [
      "universityBody",
      "advisoryBoardStudent",
      "advisoryBoardFaculty",
      "acknowledgement",
    ];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate the field on blur
    switch (activeTab) {
      case "universityBody":
        validateUniversityBody(false);
        break;
      case "advisoryBoardStudent":
        validateAdvisoryBoardStudent(false);
        break;
      case "advisoryBoardFaculty":
        validateAdvisoryBoardFaculty(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const fetchEntityData = async () => {
      try {
        const response = await apiClient.get("entity-types/");
        setEntityData(response.data);
      } catch (error) {
        console.error("Error fetching entity data:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await apiClient.get("departments/");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    const getCurrentSession = async () => {
      try {
        const response = await apiClient.get("current_session/");
        setCurrentSession(response.data.session_code);
      } catch (error) {
        console.error("Error fetching current session:", error);
      }
    };

    fetchEntityData();
    fetchDepartments();
    getCurrentSession();
  }, []);

  useEffect(() => {
    if (currentSession) {
      setFormData((prevState) => ({
        ...prevState,
        session_code: currentSession,
      }));
    }
  }, [currentSession]);

  return (
    <div className="registration-container-1">
      <div className="registration-card">
        <div className="registration-sidebar-1">
          <h1 className="registration-title">Register New Entity</h1>
          <div className="tab-navigation">
            <button
              className={`tab-button ${
                activeTab === "universityBody" ? "active" : ""
              }`}
              onClick={() => handleTabClick("universityBody")}
            >
              <span className="tab-number">1</span>
              <span className="tab-text">University Body Details</span>
            </button>
            <button
              className={`tab-button ${
                activeTab === "advisoryBoardStudent" ? "active" : ""
              }`}
              onClick={() => handleTabClick("advisoryBoardStudent")}
            >
              <span className="tab-number">2</span>
              <span className="tab-text">Advisory Board (Student)</span>
            </button>
            <button
              className={`tab-button ${
                activeTab === "advisoryBoardFaculty" ? "active" : ""
              }`}
              onClick={() => handleTabClick("advisoryBoardFaculty")}
            >
              <span className="tab-number">3</span>
              <span className="tab-text">Advisory Board (Faculty)</span>
            </button>
            <button
              className={`tab-button ${
                activeTab === "acknowledgement" ? "active" : ""
              }`}
              onClick={() => handleTabClick("acknowledgement")}
            >
              <span className="tab-number">4</span>
              <span className="tab-text">Acknowledgement</span>
            </button>
          </div>
        </div>

        <div className="registration-content">
          <form onSubmit={(e) => e.preventDefault()}>
            {activeTab === "universityBody" && (
              <div className="form-section">
                <h2 className="section-title">University Body Details</h2>

                <div className="form-group">
                  <label className="form-label">
                    Type<span className="required-star">*</span>
                  </label>
                  <div className="option-buttons">
                    {entityData &&
                      entityData.map((entity) => (
                        <button
                          type="button"
                          key={entity.entity_id}
                          className={`option-button ${
                            formData.entity === entity.entity_id
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => handleEntityClick(entity)}
                        >
                          {entity.entity_name}
                        </button>
                      ))}
                  </div>
                  {errors.entity && touched.entity && (
                    <div className="error-message">{errors.entity}</div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="proposed_name">
                      Proposed Name <span className="required-star">*</span>
                    </label>
                    <input
                      className={`form-input ${
                        errors.proposed_name && touched.proposed_name
                          ? "input-error"
                          : ""
                      }`}
                      type="text"
                      id="proposed_name"
                      name="proposed_name"
                      value={formData.proposed_name}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("proposed_name")}
                      placeholder="Enter proposed name"
                    />
                    {errors.proposed_name && touched.proposed_name && (
                      <div className="error-message">
                        {errors.proposed_name}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="proposed_date">
                      Proposed Date <span className="required-star">*</span>
                    </label>
                    <input
                      className={`form-input ${
                        errors.proposed_date && touched.proposed_date
                          ? "input-error"
                          : ""
                      }`}
                      type="date"
                      id="proposed_date"
                      name="proposed_date"
                      value={formData.proposed_date}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("proposed_date")}
                    />
                    {errors.proposed_date && touched.proposed_date && (
                      <div className="error-message">
                        {errors.proposed_date}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Nature of Entity<span className="required-star">*</span>
                  </label>
                  <div className="option-buttons">
                    {[
                      "Domain specific (field based)",
                      "Hackathon & challenge",
                      "Social value & outreach",
                      "Innovation & incubation",
                    ].map((nature) => (
                      <button
                        type="button"
                        key={nature}
                        className={`option-button ${
                          formData.entity_nature === nature ? "selected" : ""
                        }`}
                        onClick={() =>
                          handleInputChange({
                            target: { name: "entity_nature", value: nature },
                          })
                        }
                      >
                        {nature}
                      </button>
                    ))}
                  </div>
                  {errors.entity_nature && touched.entity_nature && (
                    <div className="error-message">{errors.entity_nature}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Proposed by<span className="required-star">*</span>
                  </label>
                  <div className="option-buttons">
                    {["STUDENT", "FACULTY"].map((proposer) => (
                      <button
                        type="button"
                        key={proposer}
                        className={`option-button ${
                          formData.proposed_by === proposer ? "selected" : ""
                        }`}
                        onClick={() =>
                          handleInputChange({
                            target: { name: "proposed_by", value: proposer },
                          })
                        }
                      >
                        {proposer}
                      </button>
                    ))}
                  </div>
                  {errors.proposed_by && touched.proposed_by && (
                    <div className="error-message">{errors.proposed_by}</div>
                  )}
                </div>

                {formData.proposed_by && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="proposer_name">
                        {formData.proposed_by === "STUDENT"
                          ? "Student"
                          : "Faculty"}{" "}
                        Name <span className="required-star">*</span>
                      </label>
                      <input
                        className={`form-input ${
                          errors.proposer_name && touched.proposer_name
                            ? "input-error"
                            : ""
                        }`}
                        type="text"
                        id="proposer_name"
                        name="proposer_name"
                        value={formData.proposer_name}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("proposer_name")}
                        placeholder={`Enter ${formData.proposed_by.toLowerCase()} name`}
                      />
                      {errors.proposer_name && touched.proposer_name && (
                        <div className="error-message">
                          {errors.proposer_name}
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="proposer_email">
                        {formData.proposed_by === "STUDENT"
                          ? "Student"
                          : "Faculty"}{" "}
                        Email <span className="required-star">*</span>
                      </label>
                      <input
                        className={`form-input ${
                          errors.proposer_email && touched.proposer_email
                            ? "input-error"
                            : ""
                        }`}
                        type="email"
                        id="proposer_email"
                        name="proposer_email"
                        value={formData.proposer_email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("proposer_email")}
                        placeholder={`Enter ${formData.proposed_by.toLowerCase()} email`}
                      />
                      {errors.proposer_email && touched.proposer_email && (
                        <div className="error-message">
                          {errors.proposer_email}
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="emp_code">
                        {formData.proposed_by === "STUDENT"
                          ? "Student UID"
                          : "Employee Code"}{" "}
                        <span className="required-star">*</span>
                      </label>
                      <input
                        className={`form-input ${
                          errors.emp_code && touched.emp_code
                            ? "input-error"
                            : ""
                        }`}
                        type="text"
                        id="emp_code"
                        name="emp_code"
                        value={formData.emp_code}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("emp_code")}
                        placeholder={`Enter ${
                          formData.proposed_by === "STUDENT"
                            ? "student UID"
                            : "employee code"
                        }`}
                      />
                      {errors.emp_code && touched.emp_code && (
                        <div className="error-message">{errors.emp_code}</div>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="mobile">
                        {formData.proposed_by === "STUDENT"
                          ? "Student"
                          : "Faculty"}{" "}
                        Mobile Number <span className="required-star">*</span>
                      </label>
                      <div className="phone-input">
                        <span className="phone-prefix">+91</span>
                        <input
                          className={`form-input ${
                            errors.mobile && touched.mobile ? "input-error" : ""
                          }`}
                          type="tel"
                          id="mobile"
                          name="mobile"
                          value={formData.mobile?.replace(/^\+91/, "")}
                          onChange={(e) => {
                            let newValue = e.target.value.replace(/\D/g, "");
                            if (newValue.length > 10)
                              newValue = newValue.slice(0, 10);
                            handleInputChange({
                              target: {
                                name: "mobile",
                                value: `+91${newValue}`,
                              },
                            });
                          }}
                          onBlur={() => handleBlur("mobile")}
                          maxLength={10}
                          placeholder="Enter 10-digit mobile number"
                        />
                      </div>
                      {errors.mobile && touched.mobile && (
                        <div className="error-message">{errors.mobile}</div>
                      )}
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="department">
                    Department of proposer{" "}
                    <span className="required-star">*</span>
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("department")}
                    className={`form-select ${
                      errors.department && touched.department
                        ? "input-error"
                        : ""
                    }`}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dep) => (
                      <option key={dep.dept_id} value={dep.dept_id}>
                        {dep.dept_name}
                      </option>
                    ))}
                  </select>
                  {errors.department && touched.department && (
                    <div className="error-message">{errors.department}</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "advisoryBoardStudent" && (
              <div className="form-section">
                <h2 className="section-title">
                  Student Advisory Board Details
                </h2>

                <div className="form-card">
                  <h3 className="card-title">Student Secretary</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="student_sec_1_name"
                      >
                        Name <span className="required-star">*</span>
                      </label>
                      <input
                        className={`form-input ${
                          errors.student_sec_1_name &&
                          touched.student_sec_1_name
                            ? "input-error"
                            : ""
                        }`}
                        type="text"
                        id="student_sec_1_name"
                        name="student_sec_1_name"
                        value={formData.student_sec_1_name}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("student_sec_1_name")}
                        placeholder="Enter student secretary name"
                      />
                      {errors.student_sec_1_name &&
                        touched.student_sec_1_name && (
                          <div className="error-message">
                            {errors.student_sec_1_name}
                          </div>
                        )}
                    </div>
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="student_sec_1_email"
                      >
                        Email <span className="required-star">*</span>
                      </label>
                      <input
                        className={`form-input ${
                          errors.student_sec_1_email &&
                          touched.student_sec_1_email
                            ? "input-error"
                            : ""
                        }`}
                        type="email"
                        id="student_sec_1_email"
                        name="student_sec_1_email"
                        value={formData.student_sec_1_email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("student_sec_1_email")}
                        placeholder="Enter student secretary email"
                      />
                      {errors.student_sec_1_email &&
                        touched.student_sec_1_email && (
                          <div className="error-message">
                            {errors.student_sec_1_email}
                          </div>
                        )}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="student_sec_1_uid">
                        UID <span className="required-star">*</span>
                      </label>
                      <input
                        className={`form-input ${
                          errors.student_sec_1_uid && touched.student_sec_1_uid
                            ? "input-error"
                            : ""
                        }`}
                        type="text"
                        id="student_sec_1_uid"
                        name="student_sec_1_uid"
                        value={formData.student_sec_1_uid}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("student_sec_1_uid")}
                        placeholder="Enter student secretary UID"
                      />
                      {errors.student_sec_1_uid &&
                        touched.student_sec_1_uid && (
                          <div className="error-message">
                            {errors.student_sec_1_uid}
                          </div>
                        )}
                    </div>
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="student_sec_1_mobile"
                      >
                        Mobile <span className="required-star">*</span>
                      </label>
                      <div className="phone-input">
                        <span className="phone-prefix">+91</span>
                        <input
                          className={`form-input ${
                            errors.student_sec_1_mobile &&
                            touched.student_sec_1_mobile
                              ? "input-error"
                              : ""
                          }`}
                          type="tel"
                          id="student_sec_1_mobile"
                          name="student_sec_1_mobile"
                          value={formData.student_sec_1_mobile?.replace(
                            /^\+91/,
                            ""
                          )}
                          onChange={(e) => {
                            let newValue = e.target.value.replace(/\D/g, "");
                            if (newValue.length > 10)
                              newValue = newValue.slice(0, 10);
                            handleInputChange({
                              target: {
                                name: "student_sec_1_mobile",
                                value: `+91${newValue}`,
                              },
                            });
                          }}
                          onBlur={() => handleBlur("student_sec_1_mobile")}
                          maxLength={10}
                          placeholder="Enter 10-digit mobile number"
                        />
                      </div>
                      {errors.student_sec_1_mobile &&
                        touched.student_sec_1_mobile && (
                          <div className="error-message">
                            {errors.student_sec_1_mobile}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="form-card">
                  <h3 className="card-title">Student Joint Secretary</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="student_advsec_1_name"
                      >
                        Name
                      </label>
                      <input
                        className={`form-input ${
                          errors.student_advsec_1_name &&
                          touched.student_advsec_1_name
                            ? "input-error"
                            : ""
                        }`}
                        type="text"
                        id="student_advsec_1_name"
                        name="student_advsec_1_name"
                        value={formData.student_advsec_1_name}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("student_advsec_1_name")}
                        placeholder="Enter joint secretary name"
                      />
                      {errors.student_advsec_1_name &&
                        touched.student_advsec_1_name && (
                          <div className="error-message">
                            {errors.student_advsec_1_name}
                          </div>
                        )}
                    </div>
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="student_advsec_1_email"
                      >
                        Email
                      </label>
                      <input
                        className={`form-input ${
                          errors.student_advsec_1_email &&
                          touched.student_advsec_1_email
                            ? "input-error"
                            : ""
                        }`}
                        type="email"
                        id="student_advsec_1_email"
                        name="student_advsec_1_email"
                        value={formData.student_advsec_1_email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("student_advsec_1_email")}
                        placeholder="Enter joint secretary email"
                      />
                      {errors.student_advsec_1_email &&
                        touched.student_advsec_1_email && (
                          <div className="error-message">
                            {errors.student_advsec_1_email}
                          </div>
                        )}
                    </div>
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="student_advsec_1_uid"
                      >
                        UID
                      </label>
                      <input
                        className={`form-input ${
                          errors.student_advsec_1_uid &&
                          touched.student_advsec_1_uid
                            ? "input-error"
                            : ""
                        }`}
                        type="text"
                        id="student_advsec_1_uid"
                        name="student_advsec_1_uid"
                        value={formData.student_advsec_1_uid}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("student_advsec_1_uid")}
                        placeholder="Enter joint secretary UID"
                      />
                      {errors.student_advsec_1_uid &&
                        touched.student_advsec_1_uid && (
                          <div className="error-message">
                            {errors.student_advsec_1_uid}
                          </div>
                        )}
                    </div>
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="student_advsec_1_mobile"
                      >
                        Mobile
                      </label>
                      <div className="phone-input">
                        <span className="phone-prefix">+91</span>
                        <input
                          className={`form-input ${
                            errors.student_advsec_1_mobile &&
                            touched.student_advsec_1_mobile
                              ? "input-error"
                              : ""
                          }`}
                          type="tel"
                          id="student_advsec_1_mobile"
                          name="student_advsec_1_mobile"
                          value={formData.student_advsec_1_mobile?.replace(
                            /^\+91/,
                            ""
                          )}
                          onChange={(e) => {
                            let newValue = e.target.value.replace(/\D/g, "");
                            if (newValue.length > 10)
                              newValue = newValue.slice(0, 10);
                            handleInputChange({
                              target: {
                                name: "student_advsec_1_mobile",
                                value: `+91${newValue}`,
                              },
                            });
                          }}
                          onBlur={() => handleBlur("student_advsec_1_mobile")}
                          maxLength={10}
                          placeholder="Enter 10-digit mobile number"
                        />
                      </div>
                      {errors.student_advsec_1_mobile &&
                        touched.student_advsec_1_mobile && (
                          <div className="error-message">
                            {errors.student_advsec_1_mobile}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "advisoryBoardFaculty" && (
              <div className="form-section">
                <h2 className="section-title">
                  Faculty Advisory Board Details
                </h2>

                <div className="form-card">
                  <h3 className="card-title">Faculty Advisor</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="faculty_adv_1_name"
                      >
                        Name <span className="required-star">*</span>
                      </label>
                      <input
                        className={`form-input ${
                          errors.faculty_adv_1_name &&
                          touched.faculty_adv_1_name
                            ? "input-error"
                            : ""
                        }`}
                        type="text"
                        id="faculty_adv_1_name"
                        name="faculty_adv_1_name"
                        value={formData.faculty_adv_1_name}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("faculty_adv_1_name")}
                        placeholder="Enter faculty advisor name"
                      />
                      {errors.faculty_adv_1_name &&
                        touched.faculty_adv_1_name && (
                          <div className="error-message">
                            {errors.faculty_adv_1_name}
                          </div>
                        )}
                    </div>
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="faculty_adv_1_email"
                      >
                        Email <span className="required-star">*</span>
                      </label>
                      <input
                        className={`form-input ${
                          errors.faculty_adv_1_email &&
                          touched.faculty_adv_1_email
                            ? "input-error"
                            : ""
                        }`}
                        type="email"
                        id="faculty_adv_1_email"
                        name="faculty_adv_1_email"
                        value={formData.faculty_adv_1_email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("faculty_adv_1_email")}
                        placeholder="Enter faculty advisor email"
                      />
                      {errors.faculty_adv_1_email &&
                        touched.faculty_adv_1_email && (
                          <div className="error-message">
                            {errors.faculty_adv_1_email}
                          </div>
                        )}
                    </div>
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="faculty_adv_1_empcode"
                      >
                        Employee Code <span className="required-star">*</span>
                      </label>
                      <input
                        className={`form-input ${
                          errors.faculty_adv_1_empcode &&
                          touched.faculty_adv_1_empcode
                            ? "input-error"
                            : ""
                        }`}
                        type="text"
                        id="faculty_adv_1_empcode"
                        name="faculty_adv_1_empcode"
                        value={formData.faculty_adv_1_empcode}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("faculty_adv_1_empcode")}
                        placeholder="Enter employee code"
                      />
                      {errors.faculty_adv_1_empcode &&
                        touched.faculty_adv_1_empcode && (
                          <div className="error-message">
                            {errors.faculty_adv_1_empcode}
                          </div>
                        )}
                    </div>
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="faculty_adv_1_mobile"
                      >
                        Mobile <span className="required-star">*</span>
                      </label>
                      <div className="phone-input">
                        <span className="phone-prefix">+91</span>
                        <input
                          className={`form-input ${
                            errors.faculty_adv_1_mobile &&
                            touched.faculty_adv_1_mobile
                              ? "input-error"
                              : ""
                          }`}
                          type="tel"
                          id="faculty_adv_1_mobile"
                          name="faculty_adv_1_mobile"
                          value={formData.faculty_adv_1_mobile?.replace(
                            /^\+91/,
                            ""
                          )}
                          onChange={(e) => {
                            let newValue = e.target.value.replace(/\D/g, "");
                            if (newValue.length > 10)
                              newValue = newValue.slice(0, 10);
                            handleInputChange({
                              target: {
                                name: "faculty_adv_1_mobile",
                                value: `+91${newValue}`,
                              },
                            });
                          }}
                          onBlur={() => handleBlur("faculty_adv_1_mobile")}
                          maxLength={10}
                          placeholder="Enter 10-digit mobile number"
                        />
                      </div>
                      {errors.faculty_adv_1_mobile &&
                        touched.faculty_adv_1_mobile && (
                          <div className="error-message">
                            {errors.faculty_adv_1_mobile}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="form-card">
                  <h3 className="card-title">Faculty Co-Advisor</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="faculty_coadv_1_name"
                      >
                        Name
                      </label>
                      <input
                        className={`form-input ${
                          errors.faculty_coadv_1_name &&
                          touched.faculty_coadv_1_name
                            ? "input-error"
                            : ""
                        }`}
                        type="text"
                        id="faculty_coadv_1_name"
                        name="faculty_coadv_1_name"
                        value={formData.faculty_coadv_1_name}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("faculty_coadv_1_name")}
                        placeholder="Enter faculty co-advisor name"
                      />
                      {errors.faculty_coadv_1_name &&
                        touched.faculty_coadv_1_name && (
                          <div className="error-message">
                            {errors.faculty_coadv_1_name}
                          </div>
                        )}
                    </div>
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="faculty_coadv_1_email"
                      >
                        Email
                      </label>
                      <input
                        className={`form-input ${
                          errors.faculty_coadv_1_email &&
                          touched.faculty_coadv_1_email
                            ? "input-error"
                            : ""
                        }`}
                        type="email"
                        id="faculty_coadv_1_email"
                        name="faculty_coadv_1_email"
                        value={formData.faculty_coadv_1_email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("faculty_coadv_1_email")}
                        placeholder="Enter faculty co-advisor email"
                      />
                      {errors.faculty_coadv_1_email &&
                        touched.faculty_coadv_1_email && (
                          <div className="error-message">
                            {errors.faculty_coadv_1_email}
                          </div>
                        )}
                    </div>
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="faculty_coadv_1_empcode"
                      >
                        Employee Code
                      </label>
                      <input
                        className={`form-input ${
                          errors.faculty_coadv_1_empcode &&
                          touched.faculty_coadv_1_empcode
                            ? "input-error"
                            : ""
                        }`}
                        type="text"
                        id="faculty_coadv_1_empcode"
                        name="faculty_coadv_1_empcode"
                        value={formData.faculty_coadv_1_empcode}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("faculty_coadv_1_empcode")}
                        placeholder="Enter employee code"
                      />
                      {errors.faculty_coadv_1_empcode &&
                        touched.faculty_coadv_1_empcode && (
                          <div className="error-message">
                            {errors.faculty_coadv_1_empcode}
                          </div>
                        )}
                    </div>
                    <div className="form-group">
                      <label
                        className="form-label"
                        htmlFor="faculty_coadv_1_mobile"
                      >
                        Mobile
                      </label>
                      <div className="phone-input">
                        <span className="phone-prefix">+91</span>
                        <input
                          className={`form-input ${
                            errors.faculty_coadv_1_mobile &&
                            touched.faculty_coadv_1_mobile
                              ? "input-error"
                              : ""
                          }`}
                          type="tel"
                          id="faculty_coadv_1_mobile"
                          name="faculty_coadv_1_mobile"
                          value={formData.faculty_coadv_1_mobile?.replace(
                            /^\+91/,
                            ""
                          )}
                          onChange={(e) => {
                            let newValue = e.target.value.replace(/\D/g, "");
                            if (newValue.length > 10)
                              newValue = newValue.slice(0, 10);
                            handleInputChange({
                              target: {
                                name: "faculty_coadv_1_mobile",
                                value: `+91${newValue}`,
                              },
                            });
                          }}
                          onBlur={() => handleBlur("faculty_coadv_1_mobile")}
                          maxLength={10}
                          placeholder="Enter 10-digit mobile number"
                        />
                      </div>
                      {errors.faculty_coadv_1_mobile &&
                        touched.faculty_coadv_1_mobile && (
                          <div className="error-message">
                            {errors.faculty_coadv_1_mobile}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "acknowledgement" && (
              <div className="form-section">
                <h2 className="section-title">Acknowledgement</h2>

                <div className="acknowledgement-box">
                  <p className="acknowledgement-text">
                    I acknowledge that the information provided in this form is
                    accurate and complete to the best of my knowledge. I
                    understand that submitting false or misleading information
                    may result in the rejection of this proposal or other
                    appropriate actions.
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">Have referral?</label>
                  <div className="quill-container">
                    <ReactQuill
                      theme="snow"
                      value={formData.referal}
                      onChange={handleQuillChange}
                    />
                  </div>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="acknowledge"
                    checked={acknowledgement.agreed}
                    onChange={handleAcknowledgementChange}
                  />
                  <label htmlFor="acknowledge" className="checkbox-label">
                    I acknowledge and agree to the above statement
                  </label>
                  {errors.acknowledgement && (
                    <div className="error-message">
                      {errors.acknowledgement}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="form-actions">
              {activeTab !== "universityBody" && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleBack}
                >
                  Back
                </button>
              )}
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleClear}
              >
                Clear all
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
                disabled={isLoading}
              >
                {isLoading
                  ? "Processing..."
                  : activeTab === "acknowledgement"
                  ? "Submit"
                  : "Next"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <button className="help-button" onClick={() => setIsHelpModalOpen(true)}>
        Need Help?
      </button>

      <ModalGuide
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      >
        <HelpGuide />
      </ModalGuide>
    </div>
  );
};

export default RegisterNewEntity;
