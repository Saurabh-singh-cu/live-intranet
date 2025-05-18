"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./RegisterNewEntity.module.css";
import apiClient from "../../config/apiClient";
import HelpGuide from "./HelpGuide";
import ModalGuide from "./ModalGuide";
import AlertPopup from "./AlertPopup";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logoImage from "../../assets/images/cuimg.png";
import logoImage2 from "../../assets/images/naac.png";
import logo1 from "../../assets/sdgs/1.png";
import logo2 from "../../assets/sdgs/2.png";
import logo3 from "../../assets/sdgs/3.png";
import logo4 from "../../assets/sdgs/4.png";
import logo5 from "../../assets/sdgs/5.png";
import logo6 from "../../assets/sdgs/6.png";
import logo7 from "../../assets/sdgs/7.png";
import logo8 from "../../assets/sdgs/8.png";
import logo9 from "../../assets/sdgs/9.png";
import logo10 from "../../assets/sdgs/10.png";
import logo11 from "../../assets/sdgs/11.png";
import logo12 from "../../assets/sdgs/12.png";
import logo13 from "../../assets/sdgs/13.png";
import logo14 from "../../assets/sdgs/14.png";
import logo15 from "../../assets/sdgs/15.png";
import logo16 from "../../assets/sdgs/16.png";
import logo17 from "../../assets/sdgs/17.png";
import { Check, X, Download, Clock } from "lucide-react";

// SDG logos - replace these URLs with your actual SDG logo URLs
const sdgLogos = {
  1: logo1,
  2: logo2,
  3: logo3,
  4: logo4,
  5: logo5,
  6: logo6,
  7: logo7,
  8: logo8,
  9: logo9,
  10: logo10,
  11: logo11,
  12: logo12,
  13: logo13,
  14: logo14,
  15: logo15,
  16: logo16,
  17: logo17,
};

const RegisterNewEntity = () => {
  const formRef = useRef(null);
  const [currentSession, setCurrentSession] = useState([]);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [registrationNames, setRegistrationNames] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submittedData, setSubmittedData] = useState(null);
  const [sdgData, setSdgData] = useState([]);
  const [isLoadingRegistrationNames, setIsLoadingRegistrationNames] =
    useState(false);

  // Alert popup state
  const [alertPopup, setAlertPopup] = useState({
    isOpen: false,
    type: "success",
    message: "",
    countdownTime: 0,
    downloadInfo: null,
  });

  // SDGs state with all 17 goals
  const [sdgs, setSDGs] = useState([
    { id: 1, name: "No Poverty", selected: false },
    { id: 2, name: "Zero Hunger", selected: false },
    { id: 3, name: "Good Health and Well-being", selected: false },
    { id: 4, name: "Quality Education", selected: false },
    { id: 5, name: "Gender Equality", selected: false },
    { id: 6, name: "Clean Water and Sanitation", selected: false },
    { id: 7, name: "Affordable and Clean Energy", selected: false },
    { id: 8, name: "Decent Work and Economic Growth", selected: false },
    {
      id: 9,
      name: "Industry, Innovation, and Infrastructure",
      selected: false,
    },
    { id: 10, name: "Reduced Inequalities", selected: false },
    { id: 11, name: "Sustainable Cities and Communities", selected: false },
    { id: 12, name: "Responsible Consumption and Production", selected: false },
    { id: 13, name: "Climate Action", selected: false },
    { id: 14, name: "Life Below Water", selected: false },
    { id: 15, name: "Life on Land", selected: false },
    {
      id: 16,
      name: "Peace, Justice, and Strong Institutions",
      selected: false,
    },
    { id: 17, name: "Partnerships for the Goals", selected: false },
  ]);

  // Objectives points state
  const [objectivePoints, setObjectivePoints] = useState(["", "", "", ""]);

  const [formData, setFormData] = useState({
    entity: "",
    registration_id: "",
    registration_name: "",
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
    student_sec_1_dept: "",
    student_advsec_1_name: "",
    student_advsec_1_email: "",
    student_advsec_1_uid: "",
    student_advsec_1_mobile: "",
    student_advsec_1_dept: "",
    faculty_adv_1_name: "",
    faculty_adv_1_email: "",
    faculty_adv_1_empcode: "",
    faculty_adv_1_mobile: "",
    faculty_adv_1_dept: "",
    faculty_coadv_1_name: "",
    faculty_coadv_1_email: "",
    faculty_coadv_1_empcode: "",
    faculty_coadv_1_mobile: "",
    faculty_coadv_1_dept: "",
    department: "",
    selected_sdg: null,
    mission: "",
    vision: "",
    objectives: [],
  });

  const [acknowledgement, setAcknowledgement] = useState({
    agreed: false,
  });

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

  const handleMissionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 300) {
      setFormData((prevState) => ({ ...prevState, mission: value }));

      // Mark field as touched
      setTouched((prev) => ({ ...prev, mission: true }));

      // Clear error for this field when user types
      if (errors.mission) {
        setErrors((prev) => ({ ...prev, mission: "" }));
      }
    }
  };

  const handleVisionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setFormData((prevState) => ({ ...prevState, vision: value }));

      // Mark field as touched
      setTouched((prev) => ({ ...prev, vision: true }));

      // Clear error for this field when user types
      if (errors.vision) {
        setErrors((prev) => ({ ...prev, vision: "" }));
      }
    }
  };

  const handleObjectivePointChange = (index, value) => {
    if (value.length <= 100) {
      const newObjectivePoints = [...objectivePoints];
      newObjectivePoints[index] = value;
      setObjectivePoints(newObjectivePoints);

      // Update formData with non-empty objective points
      setFormData((prevState) => ({
        ...prevState,
        objectives: newObjectivePoints.filter((point) => point.trim() !== ""),
      }));

      // Mark field as touched
      setTouched((prev) => ({ ...prev, objectives: true }));

      // Clear error for this field when user types
      if (errors.objectives) {
        setErrors((prev) => ({ ...prev, objectives: "" }));
      }
    }
  };

  const handleEntityChange = async (e) => {
    const entityId = e.target.value;

    // Update form data with selected entity
    setFormData((prevState) => ({
      ...prevState,
      entity: entityId,
      registration_id: "", // Reset registration when entity changes
      registration_name: "",
    }));

    // Clear entity error
    if (errors.entity) {
      setErrors((prev) => ({ ...prev, entity: "" }));
    }

    // Mark as touched
    setTouched((prev) => ({ ...prev, entity: true }));

    // Fetch registration names if entity is selected
    if (entityId) {
      try {
        setIsLoadingRegistrationNames(true);
        const response = await apiClient.get(
          `entity-registration-name/?entity_id=${entityId}`
        );
        setRegistrationNames(response.data || []);
      } catch (error) {
        console.error("Error fetching registration names:", error);
        setErrors((prev) => ({
          ...prev,
          entity: "Failed to load categories for this entity type",
        }));
      } finally {
        setIsLoadingRegistrationNames(false);
      }
    } else {
      setRegistrationNames([]);
    }
  };

  const handleRegistrationNameChange = (e) => {
    const regId = e.target.value;

    // Find the selected registration name
    const selectedReg = registrationNames.find(
      (reg) => reg.reg_id.toString() === regId
    );

    setFormData((prevState) => ({
      ...prevState,
      registration_id: regId,
      registration_name: selectedReg ? selectedReg.registration_name : "",
    }));

    // Clear registration error
    if (errors.registration_id) {
      setErrors((prev) => ({ ...prev, registration_id: "" }));
    }

    // Mark as touched
    setTouched((prev) => ({ ...prev, registration_id: true }));
  };

  const handleSDGSelect = (sdg_id) => {
    // Update the SDGs state - only one can be selected
    setSdgData((prevSDGs) =>
      prevSDGs.map((sdg) => ({
        ...sdg,
        selected: sdg.sdg_id === sdg_id,
      }))
    );

    // Update the formData with selected SDG
    setFormData((prevFormData) => ({
      ...prevFormData,
      selected_sdg: sdg_id,
    }));

    // Clear any SDG-related errors
    if (errors.selected_sdg) {
      setErrors((prev) => ({ ...prev, selected_sdg: "" }));
    }

    // Mark as touched
    setTouched((prev) => ({ ...prev, selected_sdg: true }));
  };

  const handleAcknowledgementChange = (e) => {
    setAcknowledgement((prev) => ({ ...prev, agreed: e.target.checked }));

    // Clear acknowledgement error when checked
    if (e.target.checked && errors.acknowledgement) {
      setErrors((prev) => ({ ...prev, acknowledgement: "" }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field) => {
    const newErrors = { ...errors };

    switch (field) {
      case "entity":
        newErrors.entity = formData.entity
          ? ""
          : "Please select an entity type";
        break;

      case "registration_id":
        newErrors.registration_id =
          !formData.registration_id && formData.entity
            ? "Please select a category"
            : "";
        break;

      case "proposed_name":
        if (!formData.proposed_name) {
          newErrors.proposed_name = "Proposed name is required";
        } else if (formData.proposed_name.length < 3) {
          newErrors.proposed_name =
            "Proposed name must be at least 3 characters";
        } else {
          newErrors.proposed_name = "";
        }
        break;

      case "proposed_date":
        if (!formData.proposed_date) {
          newErrors.proposed_date = "Proposed date is required";
        } else {
          const selected = new Date(formData.proposed_date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selected < today) {
            newErrors.proposed_date = "Proposed date cannot be in the past";
          } else {
            newErrors.proposed_date = "";
          }
        }
        break;

      case "entity_nature":
        newErrors.entity_nature = formData.entity_nature
          ? ""
          : "Nature of entity is required";
        break;

      case "proposed_by":
        newErrors.proposed_by = formData.proposed_by
          ? ""
          : "Please select who is proposing";
        break;

      case "proposer_name":
        if (!formData.proposer_name) {
          newErrors.proposer_name = `${
            formData.proposed_by === "STUDENT" ? "Student" : "Faculty"
          } name is required`;
        } else if (formData.proposer_name.length < 3) {
          newErrors.proposer_name = "Name must be at least 3 characters";
        } else if (!/^[a-zA-Z\s.]+$/.test(formData.proposer_name)) {
          newErrors.proposer_name =
            "Name should contain only letters, spaces, and periods";
        } else {
          newErrors.proposer_name = "";
        }
        break;

      case "emp_code":
        if (!formData.emp_code) {
          newErrors.emp_code =
            formData.proposed_by === "STUDENT"
              ? "Student UID is required"
              : "Employee code is required";
        } else if (
          formData.proposed_by === "STUDENT" &&
          !/^[a-zA-Z0-9]{5,}$/.test(formData.emp_code)
        ) {
          newErrors.emp_code = "UID must be at least 5 digits";
        } else if (
          formData.proposed_by === "FACULTY" &&
          !/^[a-zA-Z0-9-]+$/.test(formData.emp_code)
        ) {
          newErrors.emp_code = "Employee code format is invalid";
        } else {
          newErrors.emp_code = "";
        }
        break;

      case "proposer_email":
        if (!formData.proposer_email) {
          newErrors.proposer_email = "Email is required";
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.proposer_email)) {
            newErrors.proposer_email = "Please enter a valid email address";
          } else {
            newErrors.proposer_email = "";
          }
        }
        break;

      case "mobile":
        const mobileVal = formData.mobile?.replace(/^\+91/, "") || "";
        if (!mobileVal) {
          newErrors.mobile = "Mobile number is required";
        } else if (mobileVal.length !== 10 || !/^\d+$/.test(mobileVal)) {
          newErrors.mobile = "Mobile number must be 10 digits";
        } else if (!["6", "7", "8", "9"].includes(mobileVal.charAt(0))) {
          newErrors.mobile = "Mobile number must start with 6, 7, 8, or 9";
        } else {
          newErrors.mobile = "";
        }
        break;

      case "department":
        newErrors.department = formData.department
          ? ""
          : "Please select a department";
        break;

      case "selected_sdg":
        newErrors.selected_sdg =
          formData.selected_sdg === null ? "Please select one SDG" : "";
        break;

      case "mission":
        if (!formData.mission) {
          newErrors.mission = "Mission statement is required";
        } else if (formData.mission.length < 10) {
          newErrors.mission =
            "Mission statement must be at least 10 characters";
        } else if (formData.mission.length > 300) {
          newErrors.mission = "Mission statement cannot exceed 300 characters";
        } else {
          newErrors.mission = "";
        }
        break;

      case "vision":
        if (!formData.vision) {
          newErrors.vision = "Vision statement is required";
        } else if (formData.vision.length < 10) {
          newErrors.vision = "Vision statement must be at least 10 characters";
        } else if (formData.vision.length > 100) {
          newErrors.vision = "Vision statement cannot exceed 100 characters";
        } else {
          newErrors.vision = "";
        }
        break;

      case "objectives":
        const nonEmpty = objectivePoints.filter((p) => p.trim() !== "");
        if (nonEmpty.length < 3) {
          newErrors.objectives = "Please provide at least 3 objective points";
        } else if (nonEmpty.some((p) => p.length < 5)) {
          newErrors.objectives =
            "Each objective point must be at least 5 characters";
        } else {
          newErrors.objectives = "";
        }
        break;

      // Student secretary validations (UID removed)
      case "student_sec_1_name":
        if (!formData.student_sec_1_name) {
          newErrors.student_sec_1_name = "Student secretary name is required";
        } else if (formData.student_sec_1_name.length < 3) {
          newErrors.student_sec_1_name = "Name must be at least 3 characters";
        } else if (!/^[a-zA-Z\s.]+$/.test(formData.student_sec_1_name)) {
          newErrors.student_sec_1_name =
            "Name should contain only letters, spaces, and periods";
        } else {
          newErrors.student_sec_1_name = "";
        }
        break;

      case "student_sec_1_email":
        if (!formData.student_sec_1_email) {
          newErrors.student_sec_1_email = "Student secretary email is required";
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.student_sec_1_email)) {
            newErrors.student_sec_1_email =
              "Please enter a valid email address";
          } else {
            newErrors.student_sec_1_email = "";
          }
        }
        break;

      case "student_sec_1_mobile":
        const m1 = formData.student_sec_1_mobile?.replace(/^\+91/, "") || "";
        if (!m1) {
          newErrors.student_sec_1_mobile =
            "Student secretary mobile is required";
        } else if (m1.length !== 10 || !/^\d+$/.test(m1)) {
          newErrors.student_sec_1_mobile = "Mobile number must be 10 digits";
        } else if (!["6", "7", "8", "9"].includes(m1.charAt(0))) {
          newErrors.student_sec_1_mobile =
            "Mobile number must start with 6, 7, 8, or 9";
        } else {
          newErrors.student_sec_1_mobile = "";
        }
        break;

      // Optional UID validation removed: student_advsec_1_uid

      default:
        if (
          [
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
            "student_sec_1_name",
            "student_sec_1_email",
            "student_sec_1_mobile",
            "faculty_adv_1_name",
            "faculty_adv_1_email",
            "faculty_adv_1_empcode",
            "faculty_adv_1_mobile",
            "mission",
            "vision",
          ].includes(field) &&
          !formData[field]
        ) {
          newErrors[field] = "This field is required";
        } else {
          newErrors[field] = "";
        }
    }

    setErrors(newErrors);
    return !newErrors[field];
  };

  const validateForm = () => {
    const requiredFields = [
      "entity",
      "registration_id",
      "proposed_name",
      "proposed_date",
      "proposed_by",
      "proposer_name",
      "emp_code",
      "proposer_email",
      "mobile",
      "entity_nature",
      "department",
      "student_sec_1_name",
      "student_sec_1_email",
      "student_sec_1_uid",
      "student_sec_1_mobile",
      "student_sec_1_dept",
      "faculty_adv_1_name",
      "faculty_adv_1_email",
      "faculty_adv_1_empcode",
      "faculty_adv_1_mobile",
      "faculty_adv_1_dept",
      "selected_sdg",
      "mission",
      "vision",
      "objectives",
    ];

    // Mark all required fields as touched
    const newTouched = { ...touched };
    requiredFields.forEach((field) => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    // Validate all fields
    let isValid = true;
    requiredFields.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    // Validate acknowledgement
    if (!acknowledgement.agreed) {
      setErrors((prev) => ({
        ...prev,
        acknowledgement: "You must acknowledge the statement to proceed",
      }));
      isValid = false;
    }

    return isValid;
  };

  const handleClear = () => {
    setFormData({
      entity: "",
      registration_id: "",
      registration_name: "",
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
      student_sec_1_dept: "",
      student_advsec_1_name: "",
      student_advsec_1_email: "",
      student_advsec_1_uid: "",
      student_advsec_1_mobile: "",
      student_advsec_1_dept: "",
      faculty_adv_1_name: "",
      faculty_adv_1_email: "",
      faculty_adv_1_empcode: "",
      faculty_adv_1_mobile: "",
      faculty_adv_1_dept: "",
      faculty_coadv_1_name: "",
      faculty_coadv_1_email: "",
      faculty_coadv_1_empcode: "",
      faculty_coadv_1_mobile: "",
      faculty_coadv_1_dept: "",
      department: "",
      selected_sdg: null,
      mission: "",
      vision: "",
      objectives: [],
    });

    // Reset SDGs
    setSDGs((prevSDGs) => prevSDGs.map((sdg) => ({ ...sdg, selected: false })));
    setSdgData((prevSDGs) =>
      prevSDGs.map((sdg) => ({ ...sdg, selected: false }))
    );

    // Reset Objective points
    setObjectivePoints(["", "", "", ""]);

    setAcknowledgement({ agreed: false });
    setErrors({});
    setTouched({});
    setSubmittedData(null);
    setRegistrationNames([]);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Smaller logos
    try {
      doc.addImage(logoImage, "PNG", 15, 10, 30, 10); // Left
      doc.addImage(logoImage2, "PNG", 165, 10, 30, 10); // Right
    } catch (error) {
      console.error("Error adding logo to PDF:", error);
    }

    // Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Entity Registration Form", 105, 30, { align: "center" });

    const lineHeight = 5;
    let currentY = 35;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const addField = (label, value) => {
      doc.setFont("helvetica", "normal");
      doc.text(`${label}: `, 15, currentY);
      doc.setFont("helvetica", "bold");
      doc.text(value || "N/A", 60, currentY);
      currentY += lineHeight;
    };

    doc.setFont("helvetica", "bold");
    doc.text("University Body Details", 15, currentY);
    currentY += lineHeight;

    const entityName =
      entityData?.find(
        (e) => e.entity_id.toString() === formData.entity?.toString()
      )?.entity_name || "N/A";

    addField("1. Type", entityName);
    addField("2. Category", formData.registration_name || "N/A");
    addField("3. Nature of Entity", formData.entity_nature);

    const selectedSDGName =
      sdgData?.find(
        (s) => s.sdg_id.toString() === formData.selected_sdg?.toString()
      )?.sdg_name || "None";
    addField("4. Selected SDG", selectedSDGName);

    addField("5. Proposed By", formData.proposed_by);
    addField("6. Proposer Name", formData.proposer_name);
    addField("7. Proposed Date", formData.proposed_date);
    addField("8. Email", formData.proposer_email);
    addField("9. Emp Code/UID", formData.emp_code);
    addField("10. Mobile", formData.mobile);

    const departmentName =
      departments?.find(
        (d) => d.dept_id.toString() === formData.department?.toString()
      )?.dept_name || "N/A";

    addField("Department", departmentName);
    currentY += 2;

    doc.setFont("helvetica", "bold");
    doc.text("Mission, Vision & Objectives", 15, currentY);
    currentY += lineHeight;

    const wrapText = (label, content) => {
      doc.setFont("helvetica", "normal");
      doc.text(`${label}:`, 15, currentY);
      currentY += lineHeight;
      const lines = doc.splitTextToSize(content || "N/A", 180);
      doc.setFont("helvetica", "bold");
      doc.text(lines, 15, currentY);
      currentY += (lines.length + 1) * lineHeight;
    };

    wrapText("Mission", formData.mission);
    wrapText("Vision", formData.vision);

    doc.setFont("helvetica", "normal");
    doc.text("Objectives:", 15, currentY);
    currentY += lineHeight;

    doc.setFont("helvetica", "bold");
    formData.objectives.forEach((point, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${point}`, 180);
      doc.text(lines, 15, currentY);
      currentY += lines.length * lineHeight;
    });

    currentY += 2;

    // Advisory sections
    const leftColX = 15;
    const rightColX = 120;
    let leftColY = currentY;
    let rightColY = currentY;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Student Advisory  ", leftColX, leftColY);
    doc.text("Faculty Advisory  ", rightColX, rightColY);
    leftColY += lineHeight;
    rightColY += lineHeight;
    doc.setFontSize(8);

    const addLeft = (label, value) => {
      doc.setFont("helvetica", "normal");
      doc.text(label, leftColX, leftColY);
      doc.setFont("helvetica", "bold");
      doc.text(value || "N/A", leftColX + 35, leftColY);
      leftColY += lineHeight;
    };

    const addRight = (label, value) => {
      doc.setFont("helvetica", "normal");
      doc.text(label, rightColX, rightColY);
      doc.setFont("helvetica", "bold");
      doc.text(value || "N/A", rightColX + 35, rightColY);
      rightColY += lineHeight;
    };

    // Secretary
    addLeft("Secretary Name:", formData.student_sec_1_name);
    addLeft("Secretary Email:", formData.student_sec_1_email);
    addLeft("Secretary UID:", formData.student_sec_1_uid);
    addLeft("Secretary Mobile:", formData.student_sec_1_mobile);
    const studentDeptName =
      departments?.find(
        (d) => d.dept_id.toString() === formData.student_sec_1_dept?.toString()
      )?.dept_name || "N/A";
    addLeft("Secretary Department:", studentDeptName);
    leftColY += 2;

    // Joint Secretary
    addLeft("Joint Secretary:", formData.student_advsec_1_name);
    addLeft("Joint Sec Email:", formData.student_advsec_1_email);
    addLeft("Joint Sec UID:", formData.student_advsec_1_uid);
    addLeft("Joint Sec Mobile:", formData.student_advsec_1_mobile);
    const jointDeptName =
      departments?.find(
        (d) =>
          d.dept_id.toString() === formData.student_advsec_1_dept?.toString()
      )?.dept_name || "N/A";
    addLeft("Joint Sec Department:", jointDeptName);

    // Advisor
    addRight("Advisor Name:", formData.faculty_adv_1_name);
    addRight("Advisor Email:", formData.faculty_adv_1_email);
    addRight("Advisor Emp Code:", formData.faculty_adv_1_empcode);
    addRight("Advisor Mobile:", formData.faculty_adv_1_mobile);
    const facultyDeptName =
      departments?.find(
        (d) => d.dept_id.toString() === formData.faculty_adv_1_dept?.toString()
      )?.dept_name || "N/A";
    addRight("Advisor Department:", facultyDeptName);
    rightColY += 2;

    // Co-Advisor
    addRight("Co-Advisor:", formData.faculty_coadv_1_name);
    addRight("Co-Advisor Email:", formData.faculty_coadv_1_email);
    addRight("Co-Advisor Emp Code:", formData.faculty_coadv_1_empcode);
    addRight("Co-Advisor Mobile:", formData.faculty_coadv_1_mobile);
    const coAdvisorDeptName =
      departments?.find(
        (d) =>
          d.dept_id.toString() === formData.faculty_coadv_1_dept?.toString()
      )?.dept_name || "N/A";
    addRight("Co-Advisor Dept:", coAdvisorDeptName);
    // doc.line(110, currentY - 100, 110, Math.max(leftColY, rightColY));

    currentY = Math.max(leftColY, rightColY) + 5;

    // Move signature section to the bottom of the page
    const pageHeight = doc.internal.pageSize.height;
    const signatureStartY = pageHeight - 40;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Signatures:", 15, signatureStartY);

    const signatureRoles = [
      "Faculty Advisor",
      "Co-Curricular",
      "HOD",
      "Director/ED",
      "Assistant Dean",
      "PVC-AA",
    ];

    const signatureWidth = 35;
    const signaturesPerRow = 3;
    const signatureMargin = 30; // increased horizontal gap
    const rowGap = 20; // increased vertical gap

    for (let i = 0; i < signatureRoles.length; i++) {
      const row = Math.floor(i / signaturesPerRow);
      const col = i % signaturesPerRow;

      const x = 15 + col * (signatureWidth + signatureMargin);
      const y = signatureStartY + 8 + row * rowGap;

      doc.line(x, y, x + signatureWidth, y);
      doc.setFontSize(7);
      doc.text(signatureRoles[i], x, y + 5);
    }

    const filename = `entity-registration-${new Date().getTime()}.pdf`;

    try {
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return filename;
    } catch (err) {
      console.error("Error downloading PDF:", err);
      doc.save(filename);
      return filename;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setIsLoading(true);

        // Create a modified payload with the requested changes
        const modifiedPayload = {
          ...formData,
          // Change selected_sdg to sdg
          sdg: formData.selected_sdg,
          // Change objectives array to comma-separated string
          objective: formData.objectives.join(", "),
          // Include registration_id
          reg_id: formData.registration_id,
        };

        // Remove the original fields that we've replaced
        delete modifiedPayload.selected_sdg;
        delete modifiedPayload.objectives;
        delete modifiedPayload.registration_id;

        // Store the submitted data for display
        setSubmittedData(JSON.stringify(modifiedPayload, null, 2));

        // Make the API call with the modified payload
        const response = await apiClient.post(
          "entity-requests/",
          modifiedPayload
        );

        if (response.status !== 201 && response.status !== 200) {
          throw new Error("Submission failed");
        }

        // Generate and download PDF
        const filename = generatePDF();

        // Show success popup
        setAlertPopup({
          isOpen: true,
          type: "success",
          message: "Your form has been successfully submitted and downloaded.",
          countdownTime: 30,
          downloadInfo: filename,
        });
      } catch (error) {
        // Show error popup
        setAlertPopup({
          isOpen: true,
          type: "error",
          message: "There was an error submitting your form. Please try again.",
          countdownTime: 10,
          downloadInfo: null,
        });
        console.error("Form submission error:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors).find((key) => errors[key]);
      if (firstErrorField && formRef.current) {
        const errorElement = formRef.current.querySelector(
          `[name="${firstErrorField}"]`
        );
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }

      // Show validation error popup
      setAlertPopup({
        isOpen: true,
        type: "error",
        message:
          "Please fill in all required fields correctly before submitting.",
        countdownTime: 10,
        downloadInfo: null,
      });
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
    const getAllSdgs = async () => {
      try {
        const response = await apiClient.get("/get/all/sdg");
        console.log(response?.data, "SDGS");
        setSdgData(response?.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEntityData();
    fetchDepartments();
    getCurrentSession();
    getAllSdgs();
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
    <div className={styles.registrationContainer}>
      <div className={styles.registrationCard}>
        <h1 className={styles.registrationTitle}>Register New Entity</h1>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className={styles.registrationForm}
        >
          {/* University Body Details Section */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>University Details</h2>

            <div className={styles.formTripleRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Type<span className={styles.requiredStar}>*</span>
                </label>
                <select
                  className={`${styles.formSelect} ${
                    errors.entity && touched.entity ? styles.inputError : ""
                  }`}
                  name="entity"
                  value={formData.entity}
                  onChange={handleEntityChange}
                  onBlur={() => handleBlur("entity")}
                >
                  <option value="">Select Type</option>
                  {entityData &&
                    entityData.map((entity) => (
                      <option key={entity.entity_id} value={entity.entity_id}>
                        {entity.entity_name}
                      </option>
                    ))}
                </select>
                {errors.entity && touched.entity && (
                  <div className={styles.errorMessage}>{errors.entity}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Category<span className={styles.requiredStar}>*</span>
                </label>
                <select
                  className={`${styles.formSelect} ${
                    errors.registration_id && touched.registration_id
                      ? styles.inputError
                      : ""
                  }`}
                  name="registration_id"
                  value={formData.registration_id}
                  onChange={handleRegistrationNameChange}
                  onBlur={() => handleBlur("registration_id")}
                  disabled={!formData.entity || isLoadingRegistrationNames}
                >
                  <option value="">
                    {isLoadingRegistrationNames
                      ? "Loading categories..."
                      : formData.entity
                      ? "Select Category"
                      : "Select Type first"}
                  </option>
                  {registrationNames &&
                    registrationNames.map((reg) => (
                      <option key={reg.reg_id} value={reg.reg_id}>
                        {reg.registration_name}
                      </option>
                    ))}
                </select>
                {errors.registration_id && touched.registration_id && (
                  <div className={styles.errorMessage}>
                    {errors.registration_id}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="proposed_name">
                  Proposed Name <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  className={`${styles.formInput} ${
                    errors.proposed_name && touched.proposed_name
                      ? styles.inputError
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
                  <div className={styles.errorMessage}>
                    {errors.proposed_name}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formTripleRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="proposed_date">
                  Proposed Date <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  className={`${styles.formInput} ${
                    errors.proposed_date && touched.proposed_date
                      ? styles.inputError
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
                  <div className={styles.errorMessage}>
                    {errors.proposed_date}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Nature of Entity<span className={styles.requiredStar}>*</span>
                </label>
                <select
                  className={`${styles.formSelect} ${
                    errors.entity_nature && touched.entity_nature
                      ? styles.inputError
                      : ""
                  }`}
                  name="entity_nature"
                  value={formData.entity_nature}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("entity_nature")}
                >
                  <option value="">Select Nature of Entity</option>
                  {[
                    "Domain specific (field based)",
                    "Hackathon & challenge",
                    "Social value & outreach",
                    "Innovation & incubation",
                  ].map((nature) => (
                    <option key={nature} value={nature}>
                      {nature}
                    </option>
                  ))}
                </select>
                {errors.entity_nature && touched.entity_nature && (
                  <div className={styles.errorMessage}>
                    {errors.entity_nature}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Proposed by<span className={styles.requiredStar}>*</span>
                </label>
                <select
                  className={`${styles.formSelect} ${
                    errors.proposed_by && touched.proposed_by
                      ? styles.inputError
                      : ""
                  }`}
                  name="proposed_by"
                  value={formData.proposed_by}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("proposed_by")}
                >
                  <option value="">Select Proposer</option>
                  <option value="STUDENT">STUDENT</option>
                  <option value="FACULTY">FACULTY</option>
                </select>
                {errors.proposed_by && touched.proposed_by && (
                  <div className={styles.errorMessage}>
                    {errors.proposed_by}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formTripleRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="department">
                  Owner Of The Entity{" "}
                  <span className={styles.requiredStar}>*</span>
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("department")}
                  className={`${styles.formSelect} ${
                    errors.department && touched.department
                      ? styles.inputError
                      : ""
                  }`}
                >
                  <option value="">Select Owner Of The Entity</option>
                  {departments.map((dep) => (
                    <option key={dep.dept_id} value={dep.dept_id}>
                      {dep.dept_name}
                    </option>
                  ))}
                </select>
                {errors.department && touched.department && (
                  <div className={styles.errorMessage}>{errors.department}</div>
                )}
              </div>
            </div>

            {formData.proposed_by && (
              <div className={styles.formTripleRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="proposer_name">
                    {formData.proposed_by === "STUDENT" ? "Student" : "Faculty"}{" "}
                    Name <span className={styles.requiredStar}>*</span>
                  </label>
                  <input
                    className={`${styles.formInput} ${
                      errors.proposer_name && touched.proposer_name
                        ? styles.inputError
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
                    <div className={styles.errorMessage}>
                      {errors.proposer_name}
                    </div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="proposer_email">
                    {formData.proposed_by === "STUDENT" ? "Student" : "Faculty"}{" "}
                    Email <span className={styles.requiredStar}>*</span>
                  </label>
                  <input
                    className={`${styles.formInput} ${
                      errors.proposer_email && touched.proposer_email
                        ? styles.inputError
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
                    <div className={styles.errorMessage}>
                      {errors.proposer_email}
                    </div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="emp_code">
                    {formData.proposed_by === "STUDENT"
                      ? "Student UID"
                      : "Employee Code"}{" "}
                    <span className={styles.requiredStar}>*</span>
                  </label>
                  <input
                    className={`${styles.formInput} ${
                      errors.emp_code && touched.emp_code
                        ? styles.inputError
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
                    <div className={styles.errorMessage}>{errors.emp_code}</div>
                  )}
                </div>
              </div>
            )}

            {formData.proposed_by && (
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="mobile">
                  {formData.proposed_by === "STUDENT" ? "Student" : "Faculty"}{" "}
                  Mobile Number <span className={styles.requiredStar}>*</span>
                </label>
                <div className={styles.phoneInput}>
                  <span className={styles.phonePrefix}>+91</span>
                  <input
                    className={`${styles.formInput} ${
                      errors.mobile && touched.mobile ? styles.inputError : ""
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
                  <div className={styles.errorMessage}>{errors.mobile}</div>
                )}
              </div>
            )}
          </div>

          {/* SDGs Section */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Select SDGs</h2>
            <div className={styles.sdgGrid}>
              {sdgData &&
                sdgData.map((sdg) => (
                  <div
                    key={sdg.sdg_id}
                    className={`${styles.sdgCard} ${
                      sdg.selected ? styles.sdgSelected : ""
                    }`}
                    onClick={() => handleSDGSelect(sdg.sdg_id)}
                  >
                    <div className={styles.sdgHeader}>
                      <div className={styles.sdgNumber}>{sdg.sdg_id}</div>
                      {sdg.selected && (
                        <Check className={styles.sdgCheckIcon} size={16} />
                      )}
                    </div>
                    <div className={styles.sdgLogo}>
                      <img
                        src={sdgLogos[sdg.sdg_id] || "/placeholder.svg"}
                        alt={`SDG ${sdg.sdg_id}`}
                        className={styles.sdgLogoImage}
                      />
                    </div>
                    <div className={styles.sdgName}>{sdg.sdg_name}</div>
                  </div>
                ))}
            </div>
            {errors.selected_sdg && touched.selected_sdg && (
              <div className={styles.errorMessage}>{errors.selected_sdg}</div>
            )}
          </div>

          {/* Mission & Vision Section */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>
              Mission, Vision & Objectives
            </h2>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="mission">
                Mission Statement <span className={styles.requiredStar}>*</span>
                <span className={styles.charCounter}>
                  {formData.mission.length}/300 characters
                </span>
              </label>
              <textarea
                className={`${styles.formTextarea} ${
                  errors.mission && touched.mission ? styles.inputError : ""
                }`}
                id="mission"
                name="mission"
                value={formData.mission}
                onChange={handleMissionChange}
                onBlur={() => handleBlur("mission")}
                placeholder="Enter your mission statement (max 300 characters)"
                maxLength={300}
                rows={4}
              />
              {errors.mission && touched.mission && (
                <div className={styles.errorMessage}>{errors.mission}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="vision">
                Vision <span className={styles.requiredStar}>*</span>
                <span className={styles.charCounter}>
                  {formData.vision.length}/100 characters
                </span>
              </label>
              <textarea
                className={`${styles.formTextarea} ${
                  errors.vision && touched.vision ? styles.inputError : ""
                }`}
                id="vision"
                name="vision"
                value={formData.vision}
                onChange={handleVisionChange}
                onBlur={() => handleBlur("vision")}
                placeholder="Enter your vision statement (max 100 characters)"
                maxLength={100}
                rows={2}
              />
              {errors.vision && touched.vision && (
                <div className={styles.errorMessage}>{errors.vision}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Objectives <span className={styles.requiredStar}>*</span>
                <span className={styles.helperText}>
                  (Minimum 3, Maximum 4 points)
                </span>
              </label>

              {objectivePoints.map((point, index) => (
                <div key={index} className={styles.objectivePointContainer}>
                  <div className={styles.objectivePointNumber}>{index + 1}</div>
                  <div className={styles.objectivePointInputWrapper}>
                    <input
                      className={`${styles.formInput} ${
                        errors.objectives && touched.objectives && index < 3
                          ? styles.inputError
                          : ""
                      }`}
                      type="text"
                      value={point}
                      onChange={(e) =>
                        handleObjectivePointChange(index, e.target.value)
                      }
                      onBlur={() => handleBlur("objectives")}
                      placeholder={`Enter objective ${
                        index + 1
                      } (max 100 characters)`}
                      maxLength={100}
                      disabled={index === 3 && objectivePoints[2].trim() === ""}
                    />
                    <span className={styles.charCounter}>
                      {point.length}/100
                    </span>
                  </div>
                </div>
              ))}

              {errors.objectives && touched.objectives && (
                <div className={styles.errorMessage}>{errors.objectives}</div>
              )}
            </div>
          </div>

          {/* Student Advisory   Section */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Student Advisory Details</h2>

            <div className={styles.formCard}>
              <h3 className={styles.cardTitle}>Student Secretary</h3>
              <div className={styles.formTripleRow}>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="student_sec_1_name"
                  >
                    Name <span className={styles.requiredStar}>*</span>
                  </label>
                  <input
                    className={`${styles.formInput} ${
                      errors.student_sec_1_name && touched.student_sec_1_name
                        ? styles.inputError
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
                  {errors.student_sec_1_name && touched.student_sec_1_name && (
                    <div className={styles.errorMessage}>
                      {errors.student_sec_1_name}
                    </div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="student_sec_1_email"
                  >
                    Email <span className={styles.requiredStar}>*</span>
                  </label>
                  <input
                    className={`${styles.formInput} ${
                      errors.student_sec_1_email && touched.student_sec_1_email
                        ? styles.inputError
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
                      <div className={styles.errorMessage}>
                        {errors.student_sec_1_email}
                      </div>
                    )}
                </div>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="student_sec_1_uid"
                  >
                    UID <span className={styles.requiredStar}>*</span>
                  </label>
                  <input
                    className={`${styles.formInput} ${
                      errors.student_sec_1_uid && touched.student_sec_1_uid
                        ? styles.inputError
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
                  {errors.student_sec_1_uid && touched.student_sec_1_uid && (
                    <div className={styles.errorMessage}>
                      {errors.student_sec_1_uid}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.formTripleRow}>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="student_sec_1_mobile"
                  >
                    Mobile <span className={styles.requiredStar}>*</span>
                  </label>
                  <div className={styles.phoneInput}>
                    <span className={styles.phonePrefix}>+91</span>
                    <input
                      className={`${styles.formInput} ${
                        errors.student_sec_1_mobile &&
                        touched.student_sec_1_mobile
                          ? styles.inputError
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
                      <div className={styles.errorMessage}>
                        {errors.student_sec_1_mobile}
                      </div>
                    )}
                </div>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="student_sec_1_dept"
                  >
                    Department <span className={styles.requiredStar}>*</span>
                  </label>
                  <select
                    id="student_sec_1_dept"
                    name="student_sec_1_dept"
                    value={formData.student_sec_1_dept}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("student_sec_1_dept")}
                    className={`${styles.formSelect} ${
                      errors.student_sec_1_dept && touched.student_sec_1_dept
                        ? styles.inputError
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
                  {errors.student_sec_1_dept && touched.student_sec_1_dept && (
                    <div className={styles.errorMessage}>
                      {errors.student_sec_1_dept}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.formCard}>
              <h3 className={styles.cardTitle}>
                Student Joint Secretary (Optional)
              </h3>
              <div className={styles.formTripleRow}>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="student_advsec_1_name"
                  >
                    Name
                  </label>
                  <input
                    className={`${styles.formInput} ${
                      errors.student_advsec_1_name &&
                      touched.student_advsec_1_name
                        ? styles.inputError
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
                      <div className={styles.errorMessage}>
                        {errors.student_advsec_1_name}
                      </div>
                    )}
                </div>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="student_advsec_1_email"
                  >
                    Email
                  </label>
                  <input
                    className={`${styles.formInput} ${
                      errors.student_advsec_1_email &&
                      touched.student_advsec_1_email
                        ? styles.inputError
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
                      <div className={styles.errorMessage}>
                        {errors.student_advsec_1_email}
                      </div>
                    )}
                </div>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="student_advsec_1_uid"
                  >
                    UID
                  </label>
                  <input
                    className={`${styles.formInput} ${
                      errors.student_advsec_1_uid &&
                      touched.student_advsec_1_uid
                        ? styles.inputError
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
                      <div className={styles.errorMessage}>
                        {errors.student_advsec_1_uid}
                      </div>
                    )}
                </div>
              </div>
              <div className={styles.formTripleRow}>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="student_advsec_1_mobile"
                  >
                    Mobile
                  </label>
                  <div className={styles.phoneInput}>
                    <span className={styles.phonePrefix}>+91</span>
                    <input
                      className={`${styles.formInput} ${
                        errors.student_advsec_1_mobile &&
                        touched.student_advsec_1_mobile
                          ? styles.inputError
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
                      <div className={styles.errorMessage}>
                        {errors.student_advsec_1_mobile}
                      </div>
                    )}
                </div>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="student_advsec_1_dept"
                  >
                    Department
                  </label>
                  <select
                    id="student_advsec_1_dept"
                    name="student_advsec_1_dept"
                    value={formData.student_advsec_1_dept}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("student_advsec_1_dept")}
                    className={`${styles.formSelect} ${
                      errors.student_advsec_1_dept &&
                      touched.student_advsec_1_dept
                        ? styles.inputError
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
                  {errors.student_advsec_1_dept &&
                    touched.student_advsec_1_dept && (
                      <div className={styles.errorMessage}>
                        {errors.student_advsec_1_dept}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Faculty Advisory   Section */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Faculty Advisory Details</h2>

            <div className={styles.formCard}>
              <h3 className={styles.cardTitle}>Faculty Advisor</h3>
              <div className={styles.formTripleRow}>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="faculty_adv_1_name"
                  >
                    Name <span className={styles.requiredStar}>*</span>
                  </label>
                  <input
                    className={`${styles.formInput} ${
                      errors.faculty_adv_1_name && touched.faculty_adv_1_name
                        ? styles.inputError
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
                  {errors.faculty_adv_1_name && touched.faculty_adv_1_name && (
                    <div className={styles.errorMessage}>
                      {errors.faculty_adv_1_name}
                    </div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="faculty_adv_1_email"
                  >
                    Email <span className={styles.requiredStar}>*</span>
                  </label>
                  <input
                    className={`${styles.formInput} ${
                      errors.faculty_adv_1_email && touched.faculty_adv_1_email
                        ? styles.inputError
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
                      <div className={styles.errorMessage}>
                        {errors.faculty_adv_1_email}
                      </div>
                    )}
                </div>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="faculty_adv_1_empcode"
                  >
                    Employee Code <span className={styles.requiredStar}>*</span>
                  </label>
                  <input
                    className={`${styles.formInput} ${
                      errors.faculty_adv_1_empcode &&
                      touched.faculty_adv_1_empcode
                        ? styles.inputError
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
                      <div className={styles.errorMessage}>
                        {errors.faculty_adv_1_empcode}
                      </div>
                    )}
                </div>
              </div>
              <div className={styles.formTripleRow}>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="faculty_adv_1_mobile"
                  >
                    Mobile <span className={styles.requiredStar}>*</span>
                  </label>
                  <div className={styles.phoneInput}>
                    <span className={styles.phonePrefix}>+91</span>
                    <input
                      className={`${styles.formInput} ${
                        errors.faculty_adv_1_mobile &&
                        touched.faculty_adv_1_mobile
                          ? styles.inputError
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
                      <div className={styles.errorMessage}>
                        {errors.faculty_adv_1_mobile}
                      </div>
                    )}
                </div>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="faculty_adv_1_dept"
                  >
                    Department <span className={styles.requiredStar}>*</span>
                  </label>
                  <select
                    id="faculty_adv_1_dept"
                    name="faculty_adv_1_dept"
                    value={formData.faculty_adv_1_dept}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("faculty_adv_1_dept")}
                    className={`${styles.formSelect} ${
                      errors.faculty_adv_1_dept && touched.faculty_adv_1_dept
                        ? styles.inputError
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
                  {errors.faculty_adv_1_dept && touched.faculty_adv_1_dept && (
                    <div className={styles.errorMessage}>
                      {errors.faculty_adv_1_dept}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.formCard}>
              <h3 className={styles.cardTitle}>
                Faculty Co-Advisor (Optional)
              </h3>
              <div className={styles.formTripleRow}>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="faculty_coadv_1_name"
                  >
                    Name
                  </label>
                  <input
                    className={`${styles.formInput} ${
                      errors.faculty_coadv_1_name &&
                      touched.faculty_coadv_1_name
                        ? styles.inputError
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
                      <div className={styles.errorMessage}>
                        {errors.faculty_coadv_1_name}
                      </div>
                    )}
                </div>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="faculty_coadv_1_email"
                  >
                    Email
                  </label>
                  <input
                    className={`${styles.formInput} ${
                      errors.faculty_coadv_1_email &&
                      touched.faculty_coadv_1_email
                        ? styles.inputError
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
                      <div className={styles.errorMessage}>
                        {errors.faculty_coadv_1_email}
                      </div>
                    )}
                </div>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="faculty_coadv_1_empcode"
                  >
                    Employee Code
                  </label>
                  <input
                    className={`${styles.formInput} ${
                      errors.faculty_coadv_1_empcode &&
                      touched.faculty_coadv_1_empcode
                        ? styles.inputError
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
                      <div className={styles.errorMessage}>
                        {errors.faculty_coadv_1_empcode}
                      </div>
                    )}
                </div>
              </div>
              <div className={styles.formTripleRow}>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="faculty_coadv_1_mobile"
                  >
                    Mobile
                  </label>
                  <div className={styles.phoneInput}>
                    <span className={styles.phonePrefix}>+91</span>
                    <input
                      className={`${styles.formInput} ${
                        errors.faculty_coadv_1_mobile &&
                        touched.faculty_coadv_1_mobile
                          ? styles.inputError
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
                      <div className={styles.errorMessage}>
                        {errors.faculty_coadv_1_mobile}
                      </div>
                    )}
                </div>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="faculty_coadv_1_dept"
                  >
                    Department
                  </label>
                  <select
                    id="faculty_coadv_1_dept"
                    name="faculty_coadv_1_dept"
                    value={formData.faculty_coadv_1_dept}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("faculty_coadv_1_dept")}
                    className={`${styles.formSelect} ${
                      errors.faculty_coadv_1_dept &&
                      touched.faculty_coadv_1_dept
                        ? styles.inputError
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
                  {errors.faculty_coadv_1_dept &&
                    touched.faculty_coadv_1_dept && (
                      <div className={styles.errorMessage}>
                        {errors.faculty_coadv_1_dept}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Acknowledgement Section */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Acknowledgement</h2>

            <div className={styles.acknowledgementBox}>
              <p className={styles.acknowledgementText}>
                I acknowledge that the information provided in this form is
                accurate and complete to the best of my knowledge. I understand
                that submitting false or misleading information may result in
                the rejection of this proposal or other appropriate actions.
              </p>
            </div>

            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="acknowledge"
                checked={acknowledgement.agreed}
                onChange={handleAcknowledgementChange}
              />
              <label htmlFor="acknowledge" className={styles.checkboxLabel}>
                I acknowledge and agree to the above statement
              </label>
              {errors.acknowledgement && (
                <div className={styles.errorMessage}>
                  {errors.acknowledgement}
                </div>
              )}
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.btnOutline}
              onClick={handleClear}
            >
              Clear all
            </button>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* Alert Popup */}
      <AlertPopup
        isOpen={alertPopup.isOpen}
        type={alertPopup.type}
        message={alertPopup.message}
        countdownTime={alertPopup.countdownTime}
        downloadInfo={alertPopup.downloadInfo}
        onClose={() => setAlertPopup({ ...alertPopup, isOpen: false })}
      />

      <button
        className={styles.helpButton}
        onClick={() => setIsHelpModalOpen(true)}
      >
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
