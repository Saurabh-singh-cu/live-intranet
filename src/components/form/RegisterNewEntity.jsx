"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./RegisterNewEntity.module.css";
import apiClient from "../../config/apiClient";
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
import { Check, AlertTriangle, Eye, Copy } from "lucide-react";
import { BsPersonSquare } from "react-icons/bs";
import { FaCheck } from "react-icons/fa6";

// SDG logos mapping
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

// Guidelines Content Component
const GuidelinesContent = () => (
  <div className={styles.instructionContent}>
    <h2>Guidelines for Renewal/ New Entity Registration</h2>
    <h3>University Skill Enhancement Entities</h3>
    <p>
      <strong>
        [Registration Start: The process will open every year in the last week
        May till 2nd Weeks of June]
      </strong>
    </p>
    <p>
      The entity acts as a catalyst for employability, entrepreneurship, and
      continuous skill upgradation, supporting the broader mission of Skill
      India and university curriculum.
    </p>

    <div className={styles.instructionSection}>
      <h3>STEP 1: Naming Rules for Entities:</h3>
      <p>
        <strong>[Applicable to both Existing and New Entities]</strong>
      </p>
      <ul>
        <li>
          All entities must follow this naming format: [Domain Name] –
          Chandigarh University [Club/Departmental Society/Community]
        </li>
        <li>
          The prefix should clearly reflect the domain or theme of the entity
          (e.g., Blockchain, Cybersecurity, Filmmaking, Mathematics).
        </li>
        <li>
          Example: If your entity is related to filmmaking, your entity name
          should be Filmmaking Chandigarh University Club/ Department Society/
          Community.
        </li>
        <li>Two different entities cannot take the same prefix name.</li>
        <li>
          <strong>SDG Alignment:</strong> Each entity must align its vision,
          objectives, and activities with at least one and at most four of the
          United Nations Sustainable Development Goals (SDGs). Check the SDG:
          https://sdgs.un.org/goals
        </li>
      </ul>
    </div>

    <div className={styles.instructionSection}>
      <h3>STEP 2: Define Mission Vision and Objectives of Entity:</h3>
      <h4>2.1 Mission Statement (Aligned with SDGs):</h4>
      <ul>
        <li>
          Developing a mission statement is the first step in establishing your
          team's identity.
        </li>
        <li>
          The mission should reflect your domain and the SDGs you are aligned
          with.
        </li>
        <li>It must communicate the team's purpose and inspire commitment.</li>
      </ul>
      <p>
        <strong>Sample Mission Statements:</strong>
      </p>
      <ul>
        <li>
          "To engage the students of [Entity Name] to use entrepreneurship and
          innovation to improve the world through experiential learning,
          fostering personal and professional development."
        </li>
        <li>
          "To improve the lives of people in our community by partnering with
          them on innovative initiatives to create a better, more sustainable
          impact on people, planet, and prosperity."
        </li>
      </ul>

      <h4>2.2 Vision, Objectives, and Strategy:</h4>
      <ul>
        <li>
          <strong>Vision:</strong> Vision is the end result that you want to
          achieve. It is typically a general and overarching idea expressed
          clearly and concisely.
        </li>
        <li>
          <strong>Objectives:</strong> Objectives help understand WHAT needs to
          be done to achieve the goals. Objectives help team members maintain a
          focus and keep the momentum towards the goals.
        </li>
        <li>
          <strong>Strategy:</strong> A Strategy is a plan of action that
          outlines HOW each individual or team will work toward the clearly
          defined goals and objectives. Strategies are dynamic and can change
          over time.
        </li>
      </ul>
    </div>

    <div className={styles.instructionSection}>
      <h3>Step 3: Guidelines for Appointment Holders:</h3>
      <p>Each entity must appoint the following office bearers:</p>
      <ul>
        <li>
          <strong>Student Secretary:</strong> Must be in the final or pre-final
          year of study.
        </li>
        <li>
          <strong>Student Joint Secretary:</strong> Must be in the second year
          or above.
        </li>
        <li>
          <strong>Faculty Advisor:</strong> [Faculty Advisor can be
          Co-Curricular coordinator and adopt any one entity but cannot be a
          advisor for both entity simultaneously]
          <ul>
            <li>
              The advisor's domain knowledge should align with the domain of the
              entity.
            </li>
            <li>
              Must be from the department to which the entity is affiliated.
            </li>
            <li>
              Must have served at Chandigarh University for at least 6 months.
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div className={styles.instructionSection}>
      <h3>Step 4: Submit the Form in the DAA Office [Room No 317 Block B1]:</h3>
      <ul>
        <li>
          <strong>For Renewal Process:</strong> Download the form and take
          signatures from authorities and submit it in the DAA Office.
        </li>
        <li>
          <strong>For New Entity Registration Process:</strong> Download the
          form and then submit it in the DAA Office then the interview will
          schedule if the club meets the university mission and vision then the
          same form needs to be signed by each authority.
        </li>
      </ul>
      <p>
        <strong>Note:</strong> When registering a new entity or renewing an
        existing one, the form will be automatically downloaded after clicking
        the submit button on the CU Intranet portal. A popup will appear while
        submitting the form, allow it otherwise the form will not be downloaded.
      </p>
      <p>
        <strong>
          Once submitted for approval, re-application will not be allowed for
          one academic year.
        </strong>
      </p>
    </div>

    <div className={styles.instructionSection}>
      <h3>Step 5: After Approval Process</h3>
      <p>
        Once the entity is approved, the secretary and faculty advisor will
        receive the intranet portal rights on their emails for further
        processes.
      </p>
    </div>

    <div className={styles.responsibilityTable}>
      <h4>Responsibility Matrix:</h4>
      <table>
        <thead>
          <tr>
            <th>Entity Type</th>
            <th>Level</th>
            <th>Responsible Authority</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Club</td>
            <td>University</td>
            <td>Directors</td>
          </tr>
          <tr>
            <td>Department Society</td>
            <td>Department</td>
            <td>HODs</td>
          </tr>
          <tr>
            <td>Community</td>
            <td>Cluster</td>
            <td>EDs</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p className={styles.dateFooter}>
      <strong>Department of Academic Affairs - 24/05/2025</strong>
    </p>
  </div>
);

const RegisterNewEntity = () => {
  const formRef = useRef(null);
  const [currentSession, setCurrentSession] = useState("");
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
  const [isPayloadModalOpen, setIsPayloadModalOpen] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submittedData, setSubmittedData] = useState(null);
  const [sdgData, setSdgData] = useState([]);
  const [showEntityNamePopover, setShowEntityNamePopover] = useState(false);

  // Alert popup state
  const [alertPopup, setAlertPopup] = useState({
    isOpen: false,
    type: "success",
    message: "",
    countdownTime: 0,
    downloadInfo: null,
  });

  // SDGs state with Quality Education (SDG 4) selected by default - now allows 4 total
  const [selectedSDGs, setSelectedSDGs] = useState([4]);

  // Objectives points state
  const [objectivePoints, setObjectivePoints] = useState(["", "", "", ""]);

  // Co-curricular coordinator state - now using "active"/"inactive"
  const [isCoCurricularCoordinator, setIsCoCurricularCoordinator] =
    useState("inactive");

  const [formData, setFormData] = useState({
    entity: "",
    entity_name: "",
    proposed_date: "",
    proposed_by: "",
    proposer_name: "",
    emp_code: "",
    proposer_email: "",
    mobile: "",
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
    department: "", // This will be the primary key - never empty
    selected_sdgs: [4],
    mission: "",
    vision: "",
    objectives: [],
    is_cordinator: "inactive", // Changed from boolean to string
  });

  const [acknowledgement, setAcknowledgement] = useState({
    agreed: false,
  });

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // UID validation (no special characters)
  const validateUID = (uid) => {
    const uidRegex = /^[a-zA-Z0-9]+$/;
    return uidRegex.test(uid);
  };

  // Mobile validation (exactly 10 digits)
  const validateMobile = (mobile) => {
    const cleanMobile = mobile.replace(/^\+91/, "");
    return (
      /^\d{10}$/.test(cleanMobile) &&
      ["6", "7", "8", "9"].includes(cleanMobile.charAt(0))
    );
  };

  // Entity name validation (only one word)
  const validateEntityName = (name) => {
    const trimmedName = name.trim();
    const words = trimmedName.split(/\s+/);
    return words.length === 1 && trimmedName.length > 0;
  };

  // Check for duplicate values across ONLY the last four form fields (excluding proposer details)
  const checkDuplicates = (fieldName, value, currentField) => {
    if (!value || value.trim() === "") return false;

    const cleanValue = value.toLowerCase().trim();
    const fieldsToCheck = [];

    // Define which fields to check based on field type - ONLY last four forms
    if (fieldName.includes("email")) {
      fieldsToCheck.push(
        "student_sec_1_email",
        "student_advsec_1_email",
        "faculty_adv_1_email",
        "faculty_coadv_1_email"
      );
    } else if (fieldName.includes("mobile")) {
      fieldsToCheck.push(
        "student_sec_1_mobile",
        "student_advsec_1_mobile",
        "faculty_adv_1_mobile",
        "faculty_coadv_1_mobile"
      );
    } else if (fieldName.includes("name")) {
      fieldsToCheck.push(
        "student_sec_1_name",
        "student_advsec_1_name",
        "faculty_adv_1_name",
        "faculty_coadv_1_name"
      );
    } else if (fieldName.includes("uid") || fieldName.includes("empcode")) {
      fieldsToCheck.push(
        "student_sec_1_uid",
        "student_advsec_1_uid",
        "faculty_adv_1_empcode",
        "faculty_coadv_1_empcode"
      );
    }

    // Check for duplicates
    for (const field of fieldsToCheck) {
      if (field !== currentField && formData[field]) {
        const compareValue = formData[field].toLowerCase().trim();
        if (fieldName.includes("mobile")) {
          // For mobile numbers, compare without +91 prefix
          const cleanCompareValue = compareValue.replace(/^\+91/, "");
          const cleanCurrentValue = cleanValue.replace(/^\+91/, "");
          if (cleanCompareValue === cleanCurrentValue) {
            return true;
          }
        } else if (compareValue === cleanValue) {
          return true;
        }
      }
    }
    return false;
  };

  // Function to convert text to uppercase for specific fields
  const shouldConvertToUppercase = (fieldName) => {
    const uppercaseFields = [
      "proposer_name",
      "emp_code",
      "proposer_email",
      "entity_name",
      "student_sec_1_name",
      "student_sec_1_email",
      "student_sec_1_uid",
      "student_advsec_1_name",
      "student_advsec_1_email",
      "student_advsec_1_uid",
      "faculty_adv_1_name",
      "faculty_adv_1_email",
      "faculty_adv_1_empcode",
      "faculty_coadv_1_name",
      "faculty_coadv_1_email",
      "faculty_coadv_1_empcode",
    ];
    return uppercaseFields.includes(fieldName);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);

    // Convert to uppercase for specific fields
    const finalValue = shouldConvertToUppercase(name)
      ? value.toUpperCase()
      : value;

    setFormData((prevState) => ({ ...prevState, [name]: finalValue }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEntityNameChange = (e) => {
    const value = e.target.value.toUpperCase(); // Convert to uppercase
    const words = value.trim().split(/\s+/);
    if (words.length > 1 && value.trim().length > 0) {
      setShowEntityNamePopover(true);
      const firstWord = words[0];
      setFormData((prevState) => ({ ...prevState, entity_name: firstWord }));
    } else {
      setShowEntityNamePopover(false);
      setFormData((prevState) => ({ ...prevState, entity_name: value }));
    }

    setTouched((prev) => ({ ...prev, entity_name: true }));
    if (errors.entity_name) {
      setErrors((prev) => ({ ...prev, entity_name: "" }));
    }
  };

  const handleEntityNameBlur = () => {
    const selectedEntity = entityData.find(
      (entity) => entity.entity_id.toString() === formData.entity
    );

    if (
      selectedEntity &&
      formData.entity_name &&
      !formData.entity_name.includes("CHANDIGARH UNIVERSITY")
    ) {
      let suffix = "";
      const entityName = selectedEntity.entity_name.toLowerCase();

      if (entityName.includes("club")) {
        suffix = " CHANDIGARH UNIVERSITY CLUB";
      } else if (entityName.includes("department")) {
        suffix = " CHANDIGARH UNIVERSITY DEPARTMENT";
      } else {
        suffix = ` CHANDIGARH UNIVERSITY ${selectedEntity.entity_name.toUpperCase()}`;
      }

      const finalName = formData.entity_name + suffix;
      setFormData((prevState) => ({ ...prevState, entity_name: finalName }));
    }

    setTimeout(() => {
      setShowEntityNamePopover(false);
    }, 3000);

    handleBlur("entity_name");
  };

  const clearEntityName = () => {
    setFormData((prevState) => ({ ...prevState, entity_name: "" }));
    setTouched((prev) => ({ ...prev, entity_name: false }));
    setShowEntityNamePopover(false);
    if (errors.entity_name) {
      setErrors((prev) => ({ ...prev, entity_name: "" }));
    }
  };

  const handleMissionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 300) {
      setFormData((prevState) => ({ ...prevState, mission: value }));
      setTouched((prev) => ({ ...prev, mission: true }));
      if (errors.mission) {
        setErrors((prev) => ({ ...prev, mission: "" }));
      }
    }
  };

  const handleVisionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setFormData((prevState) => ({ ...prevState, vision: value }));
      setTouched((prev) => ({ ...prev, vision: true }));
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

      setFormData((prevState) => ({
        ...prevState,
        objectives: newObjectivePoints.filter((point) => point.trim() !== ""),
      }));

      setTouched((prev) => ({ ...prev, objectives: true }));
      if (errors.objectives) {
        setErrors((prev) => ({ ...prev, objectives: "" }));
      }
    }
  };

  const handleSDGSelect = (sdg_id) => {
    setSelectedSDGs((prevSelected) => {
      let newSelected = [...prevSelected];

      if (sdg_id === 4) {
        return newSelected; // Don't allow deselecting SDG 4
      }

      if (newSelected.includes(sdg_id)) {
        newSelected = newSelected.filter((id) => id !== sdg_id);
      } else {
        if (newSelected.length < 4) {
          // Now allows 4 total SDGs
          newSelected.push(sdg_id);
        }
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        selected_sdgs: newSelected,
      }));

      if (errors.selected_sdgs) {
        setErrors((prev) => ({ ...prev, selected_sdgs: "" }));
      }

      setTouched((prev) => ({ ...prev, selected_sdgs: true }));
      return newSelected;
    });
  };

  const handleCoCurricularToggle = () => {
    const newValue =
      isCoCurricularCoordinator === "active" ? "inactive" : "active";
    setIsCoCurricularCoordinator(newValue);
    setFormData((prevState) => ({
      ...prevState,
      is_cordinator: newValue,
    }));
  };

  const handleAcknowledgementChange = (e) => {
    setAcknowledgement((prev) => ({ ...prev, agreed: e.target.checked }));
    if (e.target.checked && errors.acknowledgement) {
      setErrors((prev) => ({ ...prev, acknowledgement: "" }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  // Synchronous validation function that returns error message
  const getFieldError = (field) => {
    switch (field) {
      case "entity":
        return formData.entity ? "" : "Please select an entity type";

      case "entity_name":
        if (!formData.entity_name) {
          return "Entity name is required";
        } else if (!validateEntityName(formData.entity_name.split(" ")[0])) {
          return "Entity name must be a single word";
        } else if (formData.entity_name.split(" ")[0].length < 3) {
          return "Entity name must be at least 3 characters";
        }
        return "";

      case "proposed_date":
        if (!formData.proposed_date) {
          return "Proposed date is required";
        } else {
          const selected = new Date(formData.proposed_date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selected < today) {
            return "Proposed date cannot be in the past";
          }
        }
        return "";

      case "proposed_by":
        return formData.proposed_by ? "" : "Please select who is proposing";

      case "proposer_name":
        if (!formData.proposer_name) {
          return `${
            formData.proposed_by === "STUDENT" ? "Student" : "Faculty"
          } name is required`;
        } else if (formData.proposer_name.length < 3) {
          return "Name must be at least 3 characters";
        } else if (!/^[a-zA-Z\s.]+$/.test(formData.proposer_name)) {
          return "Name should contain only letters, spaces, and periods";
        }
        return "";

      case "emp_code":
        if (!formData.emp_code) {
          return formData.proposed_by === "STUDENT"
            ? "Student UID is required"
            : "Employee code is required";
        } else if (
          formData.proposed_by === "STUDENT" &&
          !validateUID(formData.emp_code)
        ) {
          return "UID must not contain special characters";
        } else if (
          formData.proposed_by === "STUDENT" &&
          formData.emp_code.length < 5
        ) {
          return "UID must be at least 5 characters";
        } else if (
          formData.proposed_by === "FACULTY" &&
          !/^[a-zA-Z0-9-]+$/.test(formData.emp_code)
        ) {
          return "Employee code format is invalid";
        }
        return "";

      case "proposer_email":
        if (!formData.proposer_email) {
          return "Email is required";
        } else if (!validateEmail(formData.proposer_email)) {
          return "Please enter a valid email address";
        }
        return "";

      case "mobile":
        if (!formData.mobile) {
          return "Mobile number is required";
        } else if (!validateMobile(formData.mobile)) {
          return "Mobile number must be exactly 10 digits and start with 6, 7, 8, or 9";
        }
        return "";

      case "department":
        return formData.department
          ? ""
          : "Please select responsible department";

      case "selected_sdgs":
        if (selectedSDGs.length < 1) {
          return "Please select at least 1 SDG";
        } else if (selectedSDGs.length > 4) {
          return "Please select maximum 4 SDGs";
        }
        return "";

      case "mission":
        if (!formData.mission) {
          return "Mission statement is required";
        } else if (formData.mission.length < 10) {
          return "Mission statement must be at least 10 characters";
        } else if (formData.mission.length > 300) {
          return "Mission statement cannot exceed 300 characters";
        }
        return "";

      case "vision":
        if (!formData.vision) {
          return "Vision statement is required";
        } else if (formData.vision.length < 10) {
          return "Vision statement must be at least 10 characters";
        } else if (formData.vision.length > 100) {
          return "Vision statement cannot exceed 100 characters";
        }
        return "";

      case "objectives":
        const nonEmpty = objectivePoints.filter((p) => p.trim() !== "");
        if (nonEmpty.length < 3) {
          return "Please provide at least 3 objective points";
        } else if (nonEmpty.some((p) => p.length < 5)) {
          return "Each objective point must be at least 5 characters";
        }
        return "";

      // Student secretary validations with duplicate checks
      case "student_sec_1_name":
        if (!formData.student_sec_1_name) {
          return "Student secretary name is required";
        } else if (formData.student_sec_1_name.length < 3) {
          return "Name must be at least 3 characters";
        } else if (!/^[a-zA-Z\s.]+$/.test(formData.student_sec_1_name)) {
          return "Name should contain only letters, spaces, and periods";
        } else if (
          checkDuplicates(
            "name",
            formData.student_sec_1_name,
            "student_sec_1_name"
          )
        ) {
          return "This name is already used in another field";
        }
        return "";

      case "student_sec_1_email":
        if (!formData.student_sec_1_email) {
          return "Student secretary email is required";
        } else if (!validateEmail(formData.student_sec_1_email)) {
          return "Please enter a valid email address";
        } else if (
          checkDuplicates(
            "email",
            formData.student_sec_1_email,
            "student_sec_1_email"
          )
        ) {
          return "This email is already used in another field";
        }
        return "";

      case "student_sec_1_uid":
        if (!formData.student_sec_1_uid) {
          return "Student secretary UID is required";
        } else if (!validateUID(formData.student_sec_1_uid)) {
          return "UID must not contain special characters";
        } else if (
          checkDuplicates(
            "uid",
            formData.student_sec_1_uid,
            "student_sec_1_uid"
          )
        ) {
          return "This UID is already used in another field";
        }
        return "";

      case "student_sec_1_mobile":
        if (!formData.student_sec_1_mobile) {
          return "Student secretary mobile is required";
        } else if (!validateMobile(formData.student_sec_1_mobile)) {
          return "Mobile number must be exactly 10 digits and start with 6, 7, 8, or 9";
        } else if (
          checkDuplicates(
            "mobile",
            formData.student_sec_1_mobile,
            "student_sec_1_mobile"
          )
        ) {
          return "This mobile number is already used in another field";
        }
        return "";

      case "student_sec_1_dept":
        return formData.student_sec_1_dept
          ? ""
          : "Student secretary department is required";

      // Student joint secretary validations with duplicate checks
      case "student_advsec_1_name":
        if (
          formData.student_advsec_1_name &&
          checkDuplicates(
            "name",
            formData.student_advsec_1_name,
            "student_advsec_1_name"
          )
        ) {
          return "This name is already used in another field";
        }
        return "";

      case "student_advsec_1_email":
        if (
          formData.student_advsec_1_email &&
          !validateEmail(formData.student_advsec_1_email)
        ) {
          return "Please enter a valid email address";
        } else if (
          formData.student_advsec_1_email &&
          checkDuplicates(
            "email",
            formData.student_advsec_1_email,
            "student_advsec_1_email"
          )
        ) {
          return "This email is already used in another field";
        }
        return "";

      case "student_advsec_1_uid":
        if (
          formData.student_advsec_1_uid &&
          !validateUID(formData.student_advsec_1_uid)
        ) {
          return "UID must not contain special characters";
        } else if (
          formData.student_advsec_1_uid &&
          checkDuplicates(
            "uid",
            formData.student_advsec_1_uid,
            "student_advsec_1_uid"
          )
        ) {
          return "This UID is already used in another field";
        }
        return "";

      case "student_advsec_1_mobile":
        if (
          formData.student_advsec_1_mobile &&
          !validateMobile(formData.student_advsec_1_mobile)
        ) {
          return "Mobile number must be exactly 10 digits and start with 6, 7, 8, or 9";
        } else if (
          formData.student_advsec_1_mobile &&
          checkDuplicates(
            "mobile",
            formData.student_advsec_1_mobile,
            "student_advsec_1_mobile"
          )
        ) {
          return "This mobile number is already used in another field";
        }
        return "";

      // Faculty advisor validations with duplicate checks
      case "faculty_adv_1_name":
        if (!formData.faculty_adv_1_name) {
          return "Faculty advisor name is required";
        } else if (
          checkDuplicates(
            "name",
            formData.faculty_adv_1_name,
            "faculty_adv_1_name"
          )
        ) {
          return "This name is already used in another field";
        }
        return "";

      case "faculty_adv_1_email":
        if (!formData.faculty_adv_1_email) {
          return "Faculty advisor email is required";
        } else if (!validateEmail(formData.faculty_adv_1_email)) {
          return "Please enter a valid email address";
        } else if (
          checkDuplicates(
            "email",
            formData.faculty_adv_1_email,
            "faculty_adv_1_email"
          )
        ) {
          return "This email is already used in another field";
        }
        return "";

      case "faculty_adv_1_empcode":
        if (!formData.faculty_adv_1_empcode) {
          return "Employee code is required";
        } else if (
          checkDuplicates(
            "uid",
            formData.faculty_adv_1_empcode,
            "faculty_adv_1_empcode"
          )
        ) {
          return "This employee code is already used in another field";
        }
        return "";

      case "faculty_adv_1_mobile":
        if (!formData.faculty_adv_1_mobile) {
          return "Faculty advisor mobile is required";
        } else if (!validateMobile(formData.faculty_adv_1_mobile)) {
          return "Mobile number must be exactly 10 digits and start with 6, 7, 8, or 9";
        } else if (
          checkDuplicates(
            "mobile",
            formData.faculty_adv_1_mobile,
            "faculty_adv_1_mobile"
          )
        ) {
          return "This mobile number is already used in another field";
        }
        return "";

      case "faculty_adv_1_dept":
        return formData.faculty_adv_1_dept
          ? ""
          : "Faculty advisor department is required";

      // Faculty co-advisor validations with duplicate checks
      case "faculty_coadv_1_name":
        if (
          formData.faculty_coadv_1_name &&
          checkDuplicates(
            "name",
            formData.faculty_coadv_1_name,
            "faculty_coadv_1_name"
          )
        ) {
          return "This name is already used in another field";
        }
        return "";

      case "faculty_coadv_1_email":
        if (
          formData.faculty_coadv_1_email &&
          !validateEmail(formData.faculty_coadv_1_email)
        ) {
          return "Please enter a valid email address";
        } else if (
          formData.faculty_coadv_1_email &&
          checkDuplicates(
            "email",
            formData.faculty_coadv_1_email,
            "faculty_coadv_1_email"
          )
        ) {
          return "This email is already used in another field";
        }
        return "";

      case "faculty_coadv_1_empcode":
        if (
          formData.faculty_coadv_1_empcode &&
          checkDuplicates(
            "uid",
            formData.faculty_coadv_1_empcode,
            "faculty_coadv_1_empcode"
          )
        ) {
          return "This employee code is already used in another field";
        }
        return "";

      case "faculty_coadv_1_mobile":
        if (
          formData.faculty_coadv_1_mobile &&
          !validateMobile(formData.faculty_coadv_1_mobile)
        ) {
          return "Mobile number must be exactly 10 digits and start with 6, 7, 8, or 9";
        } else if (
          formData.faculty_coadv_1_mobile &&
          checkDuplicates(
            "mobile",
            formData.faculty_coadv_1_mobile,
            "faculty_coadv_1_mobile"
          )
        ) {
          return "This mobile number is already used in another field";
        }
        return "";

      default:
        return "";
    }
  };

  const validateField = (field) => {
    const errorMessage = getFieldError(field);
    setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    return !errorMessage;
  };

  const validateForm = () => {
    console.log("🔍 Starting form validation...");

    const requiredFields = [
      "entity",
      "entity_name",
      "proposed_date",
      "proposed_by",
      "proposer_name",
      "emp_code",
      "proposer_email",
      "mobile",
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
      "selected_sdgs",
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

    // Validate all fields and collect errors
    const validationErrors = {};
    let isValid = true;

    requiredFields.forEach((field) => {
      const errorMessage = getFieldError(field);
      if (errorMessage) {
        validationErrors[field] = errorMessage;
        isValid = false;
        console.log(`❌ Field ${field} is invalid: ${errorMessage}`);
      } else {
        console.log(`✅ Field ${field} is valid`);
      }
    });

    // Check acknowledgement
    if (!acknowledgement.agreed) {
      validationErrors.acknowledgement =
        "You must acknowledge the statement to proceed";
      isValid = false;
      console.log("❌ Acknowledgement not agreed");
    } else {
      console.log("✅ Acknowledgement agreed");
    }

    // Update errors state
    setErrors(validationErrors);

    console.log("📋 Form validation result:", {
      isValid,
      errors: validationErrors,
    });
    console.log("📊 Current form data:", formData);

    return isValid;
  };

  const handleClear = () => {
    console.log("🧹 Clearing form...");
    setFormData({
      entity: "",
      entity_name: "",
      proposed_date: "",
      proposed_by: "",
      proposer_name: "",
      emp_code: "",
      proposer_email: "",
      mobile: "",
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
      selected_sdgs: [4],
      mission: "",
      vision: "",
      objectives: [],
      is_cordinator: "inactive",
    });

    setSelectedSDGs([4]);
    setObjectivePoints(["", "", "", ""]);
    setIsCoCurricularCoordinator("inactive");
    setAcknowledgement({ agreed: false });
    setErrors({});
    setTouched({});
    setSubmittedData(null);
    setShowEntityNamePopover(false);
  };

  // Modified PDF generation function to accept entcr_id parameter
  const generatePDF = (entcrId) => {
    console.log("📄 Generating PDF with entcr_id:", entcrId);
    const doc = new jsPDF();

    // Use entcr_id from API response as reference number
    const referenceNumber = entcrId || "N/A";

    // Add reference number at top
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Reference No: ${referenceNumber}`, 15, 15);

    // Add logos
    try {
      doc.addImage(logoImage, "PNG", 15, 20, 30, 10);
      doc.addImage(logoImage2, "PNG", 165, 20, 30, 10);
    } catch (error) {
      console.error("Error adding logo to PDF:", error);
    }

    // Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Entity Registration Form", 105, 40, { align: "center" });

    const lineHeight = 5;
    let currentY = 50;

    doc.setFontSize(9);

    const addSectionHeading = (letter, title) => {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bolditalic");
      doc.text(`${letter}. ${title.toUpperCase()}`, 15, currentY);
      currentY += lineHeight + 2;
      doc.setFontSize(9);
    };

    const addField = (label, value) => {
      doc.setFont("helvetica", "normal");
      doc.text(`${label}: `, 15, currentY);
      doc.setFont("helvetica", "bold");
      doc.text(value || "N/A", 60, currentY);
      currentY += lineHeight;
    };

    // A. Entity Details
    addSectionHeading("A", "Entity Details");

    const entityName =
      entityData?.find(
        (e) => e.entity_id.toString() === formData.entity?.toString()
      )?.entity_name || "N/A";
    addField("1. Type", entityName);
    addField("2. Entity Name", formData.entity_name);
    addField("3. Proposed Date", formData.proposed_date);
    addField("4. Proposed By", formData.proposed_by);
    addField("5. Proposer Name", formData.proposer_name);
    addField("6. Email", formData.proposer_email);
    addField("7. Emp Code/UID", formData.emp_code);
    addField("8. Mobile", formData.mobile);

    const responsibleDeptName =
      departments?.find(
        (d) => d.dept_id.toString() === formData.department?.toString()
      )?.dept_name || "N/A";
    addField("9. Responsible Department", responsibleDeptName);

    const selectedSDGNames = selectedSDGs
      .map((id) => {
        const sdg = sdgData?.find((s) => s.sdg_id === id);
        return sdg ? `SDG ${id}: ${sdg.sdg_name}` : `SDG ${id}`;
      })
      .join(", ");

    const wrappedSDGs = doc.splitTextToSize(selectedSDGNames, 130);
    doc.setFont("helvetica", "normal");
    doc.text("10. Selected SDGs:", 15, currentY);
    doc.setFont("helvetica", "bold");
    doc.text(wrappedSDGs, 60, currentY);
    currentY += lineHeight * wrappedSDGs.length;

    currentY += 3;

    // C. Student Advisory Details
    addSectionHeading("C", "Student Advisory Details");

    const leftColX = 15;
    const rightColX = 120;
    let leftColY = currentY;
    let rightColY = currentY;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Student Secretary", leftColX, leftColY);
    doc.text("Student Joint Secretary", rightColX, rightColY);
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

    // Secretary details
    addLeft("Name:", formData.student_sec_1_name);
    addLeft("Email:", formData.student_sec_1_email);
    addLeft("UID:", formData.student_sec_1_uid);
    addLeft("Phone:", formData.student_sec_1_mobile);
    const studentDeptName =
      departments?.find(
        (d) => d.dept_id.toString() === formData.student_sec_1_dept?.toString()
      )?.dept_name || "N/A";
    addLeft("Department:", studentDeptName);

    // Joint Secretary details
    addRight("Name:", formData.student_advsec_1_name || "N/A");
    addRight("Email:", formData.student_advsec_1_email || "N/A");
    addRight("UID:", formData.student_advsec_1_uid || "N/A");
    addRight("Phone:", formData.student_advsec_1_mobile || "N/A");
    const jointDeptName =
      departments?.find(
        (d) =>
          d.dept_id.toString() === formData.student_advsec_1_dept?.toString()
      )?.dept_name || "N/A";
    addRight("Department:", jointDeptName);

    currentY = Math.max(leftColY, rightColY) + 5;

    // D. Faculty Advisory Details
    addSectionHeading("D", "Faculty Advisory Details");

    leftColY = currentY;
    rightColY = currentY;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Faculty Advisor", leftColX, leftColY);
    doc.text("Faculty Co-Advisor", rightColX, rightColY);
    leftColY += lineHeight;
    rightColY += lineHeight;
    doc.setFontSize(8);

    // Advisor details
    addLeft("Name:", formData.faculty_adv_1_name);
    addLeft("Email:", formData.faculty_adv_1_email);
    addLeft("Emp Code:", formData.faculty_adv_1_empcode);
    addLeft("Phone:", formData.faculty_adv_1_mobile);
    addLeft(
      "Co-Curricular Coordinator:",
      isCoCurricularCoordinator === "active" ? "Yes" : "No"
    );
    const facultyDeptName =
      departments?.find(
        (d) => d.dept_id.toString() === formData.faculty_adv_1_dept?.toString()
      )?.dept_name || "N/A";
    addLeft("Department:", facultyDeptName);

    // Co-Advisor details
    addRight("Name:", formData.faculty_coadv_1_name || "N/A");
    addRight("Email:", formData.faculty_coadv_1_email || "N/A");
    addRight("Emp Code:", formData.faculty_coadv_1_empcode || "N/A");
    addRight("Phone:", formData.faculty_coadv_1_mobile || "N/A");
    const coAdvisorDeptName =
      departments?.find(
        (d) =>
          d.dept_id.toString() === formData.faculty_coadv_1_dept?.toString()
      )?.dept_name || "N/A";
    addRight("Department:", coAdvisorDeptName);

    currentY = Math.max(leftColY, rightColY) + 10;

    // Office use paragraph
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("For Office of Academic Affairs Use Only:", 15, currentY);
    currentY += 15;

    // Signature section
    const pageHeight = doc.internal.pageSize.height;
    const signatureStartY = Math.max(currentY, pageHeight - 60);

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Signatures:", 15, signatureStartY);

    const signatureRoles = [
      "Faculty Advisor",
      "Department Coordinator",
      "HOD",
      "Director/ED",
      "Assistant Dean",
      "PVC-AA",
    ];

    const signatureWidth = 35;
    const signaturesPerRow = 3;
    const signatureMargin = 30;
    const rowGap = 20;

    for (let i = 0; i < signatureRoles.length; i++) {
      const row = Math.floor(i / signaturesPerRow);
      const col = i % signaturesPerRow;

      const x = 15 + col * (signatureWidth + signatureMargin);
      const y = signatureStartY + 8 + row * rowGap;

      doc.line(x, y, x + signatureWidth, y);
      doc.setFontSize(7);
      doc.text(signatureRoles[i], x, y + 5);
    }

    // Final approval section
    currentY = signatureStartY + 50;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Final Approval:", 15, currentY);
    doc.line(80, currentY, 150, currentY);
    doc.setFontSize(8);
    doc.text("(Signature and Stamp)", 80, currentY + 5);

    const filename = `entity-registration-${referenceNumber}.pdf`;

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
      console.log("✅ PDF generated and downloaded:", filename);
      return filename;
    } catch (err) {
      console.error("❌ Error downloading PDF:", err);
      doc.save(filename);
      return filename;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🚀 Form submission started...");
    console.log("📝 Current form data:", formData);
    console.log("✅ Acknowledgement:", acknowledgement);
    console.log("🎯 Selected SDGs:", selectedSDGs);
    console.log("📋 Objectives:", objectivePoints);

    // Reset any previous loading state
    setIsLoading(false);

    // Validate form
    const isFormValid = validateForm();
    console.log("🔍 Form validation result:", isFormValid);

    if (!isFormValid) {
      console.log("❌ Form validation failed, showing error popup");

      // Find first error field and scroll to it
      const firstErrorField = Object.keys(errors).find((key) => errors[key]);
      console.log(
        "🎯 First error field:",
        firstErrorField,
        errors[firstErrorField]
      );

      if (firstErrorField && formRef.current) {
        const errorElement = formRef.current.querySelector(
          `[name="${firstErrorField}"]`
        );
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          console.log("📍 Scrolled to error field:", firstErrorField);
        }
      }

      setAlertPopup({
        isOpen: true,
        type: "error",
        message:
          "Please fill in all required fields correctly before submitting.",
        countdownTime: 10,
        downloadInfo: null,
      });
      return;
    }

    try {
      console.log("✅ Form is valid, starting API call...");
      setIsLoading(true);

      // Prepare payload - send department as primary key (the selected department ID)
      // Optional fields can be empty but department must never be empty
      const modifiedPayload = {
        ...formData,
        sdg: formData.selected_sdgs,
        objective: formData.objectives.join(", "),
        department: formData.department, // This is the primary key - always send the selected department ID
        // Optional fields - send as empty strings if not filled
        student_advsec_1_name: formData.student_advsec_1_name,
        student_advsec_1_email: formData.student_advsec_1_email,
        student_advsec_1_uid: formData.student_advsec_1_uid,
        student_advsec_1_mobile: formData.student_advsec_1_mobile,
        student_advsec_1_dept: formData.student_advsec_1_dept,
        faculty_coadv_1_name: formData.faculty_coadv_1_name,
        faculty_coadv_1_email: formData.faculty_coadv_1_email,
        faculty_coadv_1_empcode: formData.faculty_coadv_1_empcode,
        faculty_coadv_1_mobile: formData.faculty_coadv_1_mobile,
        faculty_coadv_1_dept: formData.faculty_coadv_1_dept,
        is_cordinator: isCoCurricularCoordinator, // Send as "active" or "inactive"
      };

      // Remove fields that are transformed
      delete modifiedPayload.selected_sdgs;
      delete modifiedPayload.objectives;

      console.log("📤 Sending payload:", modifiedPayload);
      setSubmittedData(JSON.stringify(modifiedPayload, null, 2));

      const response = await apiClient.post(
        "entity-requests/",
        modifiedPayload
      );
      console.log("📥 API Response:", response);

      if (response.status !== 201 && response.status !== 200) {
        throw new Error(`API returned status ${response.status}`);
      }

      // Extract entcr_id from API response
      const entcrId = response.data?.entcr_id;
      console.log("🆔 Received entcr_id from API:", entcrId);

      console.log("✅ API call successful, generating PDF...");
      // Pass entcr_id to PDF generation function
      const filename = generatePDF(entcrId);

      setAlertPopup({
        isOpen: true,
        type: "success",
        message: "Your form has been successfully submitted and downloaded.",
        countdownTime: 30,
        downloadInfo: filename,
      });

      console.log("��� Form submission completed successfully!");
    } catch (error) {
      console.error("❌ Form submission error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });

      let errorMessage =
        "There was an error submitting your form. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }

      setAlertPopup({
        isOpen: true,
        type: "error",
        message: errorMessage,
        countdownTime: 10,
        downloadInfo: null,
      });
    } finally {
      setIsLoading(false);
      console.log("🏁 Form submission process completed");
    }
  };

  const copyPayload = () => {
    if (submittedData) {
      navigator.clipboard.writeText(submittedData);
      setAlertPopup({
        isOpen: true,
        type: "success",
        message: "Payload copied to clipboard!",
        countdownTime: 3,
        downloadInfo: null,
      });
    }
  };

  useEffect(() => {
    const fetchEntityData = async () => {
      try {
        console.log("📡 Fetching entity data...");
        const response = await apiClient.get("entity-types/");
        setEntityData(response.data);
        console.log("✅ Entity data loaded:", response.data);
      } catch (error) {
        console.error("❌ Error fetching entity data:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        console.log("📡 Fetching departments...");
        const response = await apiClient.get("departments/");
        setDepartments(response.data);
        console.log("✅ Departments loaded:", response.data);
      } catch (error) {
        console.error("❌ Error fetching departments:", error);
      }
    };

    const getCurrentSession = async () => {
      try {
        console.log("📡 Fetching current session...");
        const response = await apiClient.get("current_session/");
        setCurrentSession(response.data.session_code);
        console.log("✅ Current session loaded:", response.data.session_code);
      } catch (error) {
        console.error("❌ Error fetching current session:", error);
      }
    };

    const getAllSdgs = async () => {
      try {
        console.log("📡 Fetching SDGs...");
        const response = await apiClient.get("/get/all/sdg");
        setSdgData(response?.data);
        console.log("✅ SDGs loaded:", response?.data);
      } catch (error) {
        console.error("❌ Error fetching SDGs:", error);
      }
    };

    fetchEntityData();
    fetchDepartments();
    getCurrentSession();
    getAllSdgs();

    const timer = setTimeout(() => {
      setIsInstructionModalOpen(true);
    }, 5000);

    return () => clearTimeout(timer);
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
        <div className={styles.headerSection}>
          <h1 className={styles.registrationTitle}>Register Entity</h1>
          <div className={styles.actionButtons}>
           
          </div>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className={styles.registrationForm}
        >
          {/* Entity Details Section */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Entity Details</h2>
              <div className={styles.sectionProgress}>Step 1 of 5</div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Select Entity Type<span className={styles.requiredStar}>*</span>
                </label>
                <select
                  className={`${styles.formSelect} ${
                    errors.entity && touched.entity ? styles.inputError : ""
                  }`}
                  name="entity"
                  value={formData.entity}
                  onChange={handleInputChange}
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
                <label className={styles.formLabel} htmlFor="entity_name">
                  Entity Name <span className={styles.requiredStar}>*</span>
                </label>
                <div className={styles.inputWithButton}>
                  <input
                    className={`${styles.formInput} ${
                      errors.entity_name && touched.entity_name
                        ? styles.inputError
                        : ""
                    }`}
                    type="text"
                    id="entity_name"
                    name="entity_name"
                    value={formData.entity_name}
                    onChange={handleEntityNameChange}
                    onBlur={handleEntityNameBlur}
                    placeholder="Enter one word only (e.g., BLOCKCHAIN, FILMMAKING)"
                    style={{ textTransform: "uppercase" }}
                  />
                  {formData.entity_name && (
                    <button
                      type="button"
                      className={styles.clearButton}
                      onClick={clearEntityName}
                      title="Clear entity name"
                    >
                      ×
                    </button>
                  )}
                  {showEntityNamePopover && (
                    <div className={styles.popover}>
                      <AlertTriangle size={16} />
                      <span>Please enter only one word for entity name</span>
                    </div>
                  )}
                </div>
                {errors.entity_name && touched.entity_name && (
                  <div className={styles.errorMessage}>
                    {errors.entity_name}
                  </div>
                )}
              </div>

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
                  min={getTodayDate()}
                />
                {errors.proposed_date && touched.proposed_date && (
                  <div className={styles.errorMessage}>
                    {errors.proposed_date}
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

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="department">
                  Responsible Department{" "}
                  <span className={styles.requiredStar}>*</span>
                  <div className={styles.helperText}>
                    (Department that will oversee this entity)
                  </div>
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
                  <option value="">Select Responsible Department</option>
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
              <div className={styles.proposerDetails}>
                <h3 className={styles.subSectionTitle}>Proposer Details</h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="proposer_name">
                      {formData.proposed_by === "STUDENT"
                        ? "Student"
                        : "Faculty"}{" "}
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
                      style={{ textTransform: "uppercase" }}
                    />
                    {errors.proposer_name && touched.proposer_name && (
                      <div className={styles.errorMessage}>
                        {errors.proposer_name}
                      </div>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label
                      className={styles.formLabel}
                      htmlFor="proposer_email"
                    >
                      {formData.proposed_by === "STUDENT"
                        ? "Student"
                        : "Faculty"}{" "}
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
                      style={{ textTransform: "uppercase" }}
                    />
                    {errors.proposer_email && touched.proposer_email && (
                      <div className={styles.errorMessage}>
                        {errors.proposer_email}
                      </div>
                    )}
                  </div>
                  {formData.proposed_by === "STUDENT" ? (
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="emp_code">
                        Student UID{" "}
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
                        placeholder="Enter student UID"
                        style={{ textTransform: "uppercase" }}
                      />
                      {errors.emp_code && touched.emp_code && (
                        <div className={styles.errorMessage}>
                          {errors.emp_code}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="emp_code">
                        Employee Code{" "}
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
                        placeholder="Enter employee code"
                        style={{ textTransform: "uppercase" }}
                      />
                      {errors.emp_code && touched.emp_code && (
                        <div className={styles.errorMessage}>
                          {errors.emp_code}
                        </div>
                      )}
                    </div>
                  )}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="mobile">
                      {formData.proposed_by === "STUDENT"
                        ? "Student"
                        : "Faculty"}{" "}
                      Mobile Number{" "}
                      <span className={styles.requiredStar}>*</span>
                    </label>
                    <div className={styles.phoneInput}>
                      <span className={styles.phonePrefix}>+91</span>
                      <input
                        className={`${styles.formInput} ${
                          errors.mobile && touched.mobile
                            ? styles.inputError
                            : ""
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
                </div>
              </div>
            )}

            {/* SDGs Section */}
            <div className={styles.sdgSection}>
              <h3 className={styles.subSectionTitle}>
                Select SDGs <span className={styles.requiredStar}>*</span>
                <span className={styles.helperText}>
                  (Minimum 1, Maximum 4. Quality Education SDG 4 is
                  pre-selected)
                </span>
              </h3>
              <div className={styles.sdgGrid}>
                {sdgData &&
                  sdgData.map((sdg) => (
                    <div
                      key={sdg.sdg_id}
                      className={`${styles.sdgCard} ${
                        selectedSDGs.includes(sdg.sdg_id)
                          ? styles.sdgSelected
                          : ""
                      }`}
                      onClick={() => handleSDGSelect(sdg.sdg_id)}
                    >
                      <div className={styles.sdgHeader}>
                        <div className={styles.sdgNumber}>SDG{sdg.sdg_id}</div>
                        {selectedSDGs.includes(sdg.sdg_id) && (
                          // <Check className={styles.sdgCheckIcon} size={20} />
                          <FaCheck className={styles.sdgCheckIcon} size={20} />
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
              {errors.selected_sdgs && touched.selected_sdgs && (
                <div className={styles.errorMessage}>
                  {errors.selected_sdgs}
                </div>
              )}
            </div>
          </div>

          {/* Mission & Vision Section */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Mission, Vision & Objectives
              </h2>
              <div className={styles.sectionProgress}>Step 2 of 5</div>
            </div>

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

          {/* Student Advisory Section */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Student Advisory Details</h2>
              <div className={styles.sectionProgress}>Step 3 of 5</div>
            </div>

            <div className={styles.formCard}>
              <h3 className={styles.cardTitle}>Student Secretary</h3>
              <div className={styles.formGrid}>
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
                    style={{ textTransform: "uppercase" }}
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
                    style={{ textTransform: "uppercase" }}
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
                    style={{ textTransform: "uppercase" }}
                  />
                  {errors.student_sec_1_uid && touched.student_sec_1_uid && (
                    <div className={styles.errorMessage}>
                      {errors.student_sec_1_uid}
                    </div>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="student_sec_1_mobile"
                  >
                    Phone <span className={styles.requiredStar}>*</span>
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
              <h3 className={styles.cardTitle}>Student Joint Secretary</h3>
              <div className={styles.formGrid}>
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
                    style={{ textTransform: "uppercase" }}
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
                    style={{ textTransform: "uppercase" }}
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
                    style={{ textTransform: "uppercase" }}
                  />
                  {errors.student_advsec_1_uid &&
                    touched.student_advsec_1_uid && (
                      <div className={styles.errorMessage}>
                        {errors.student_advsec_1_uid}
                      </div>
                    )}
                </div>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="student_advsec_1_mobile"
                  >
                    Phone
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

          {/* Faculty Advisory Section */}
          <div className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Faculty Advisory Details</h2>
              <div className={styles.sectionProgress}>Step 4 of 5</div>
            </div>

            <div className={styles.formCard}>
              <h3 className={styles.cardTitle}>Faculty Advisor</h3>

              {/* Co-Curricular Coordinator Toggle */}
              <div className={styles.formGroup}>
                <div className={styles.switchContainer}>
                  <label className={styles.switchLabel}>
                    <span className={styles.makeIthigh}>
                      ARE YOU CO-CURRICULAR/COMPETITION COORDINATOR FOR NEXT
                      SEMESTER
                    </span>
                    <div className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={isCoCurricularCoordinator === "active"}
                        onChange={handleCoCurricularToggle}
                        className={styles.switchInput}
                      />
                      <span className={styles.switchSlider}></span>
                    </div>
                    <span
                      className={`${styles.switchStatus} ${
                        isCoCurricularCoordinator === "active"
                          ? styles.greenText
                          : styles.notGreen
                      }`}
                    >
                      {isCoCurricularCoordinator === "active"
                        ? `Active 😊 `
                        : "Inactive 😐"}
                    </span>
                  </label>
                </div>
              </div>

              <div className={styles.formGrid}>
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
                    style={{ textTransform: "uppercase" }}
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
                    style={{ textTransform: "uppercase" }}
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
                    style={{ textTransform: "uppercase" }}
                  />
                  {errors.faculty_adv_1_empcode &&
                    touched.faculty_adv_1_empcode && (
                      <div className={styles.errorMessage}>
                        {errors.faculty_adv_1_empcode}
                      </div>
                    )}
                </div>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="faculty_adv_1_mobile"
                  >
                    Phone <span className={styles.requiredStar}>*</span>
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
              <h3 className={styles.cardTitle}>Faculty Co-Advisor</h3>
              <div className={styles.formGrid}>
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
                    style={{ textTransform: "uppercase" }}
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
                    style={{ textTransform: "uppercase" }}
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
                    style={{ textTransform: "uppercase" }}
                  />
                  {errors.faculty_coadv_1_empcode &&
                    touched.faculty_coadv_1_empcode && (
                      <div className={styles.errorMessage}>
                        {errors.faculty_coadv_1_empcode}
                      </div>
                    )}
                </div>
                <div className={styles.formGroup}>
                  <label
                    className={styles.formLabel}
                    htmlFor="faculty_coadv_1_mobile"
                  >
                    Phone
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
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>✅ Acknowledgement</h2>
              <div className={styles.sectionProgress}>Step 5 of 5</div>
            </div>

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
        </form>

        {/* Fixed Form Actions - moved outside form to prevent overlap issues */}
        <div className={styles.formActionsFixed}>
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
            onClick={handleSubmit}
          >
            {isLoading ? "Processing..." : "Submit & Download"}
          </button>
        </div>
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

      {/* Payload Modal */}
      <ModalGuide
        isOpen={isPayloadModalOpen}
        onClose={() => setIsPayloadModalOpen(false)}
      >
        <div className={styles.payloadModal}>
          <div className={styles.payloadHeader}>
            <h2>📋 Form Payload</h2>
            <button
              className={styles.copyButton}
              onClick={copyPayload}
              title="Copy to clipboard"
            >
              <Copy size={16} />
              Copy
            </button>
          </div>
          <div className={styles.payloadContent}>
            <pre className={styles.payloadCode}>
              {submittedData || "No data submitted yet"}
            </pre>
          </div>
        </div>
      </ModalGuide>

      {/* Instruction Modal */}
      <ModalGuide
        isOpen={isInstructionModalOpen}
        onClose={() => setIsInstructionModalOpen(false)}
      >
        <GuidelinesContent />
      </ModalGuide>

      <button
        className={styles.helpButton}
        onClick={() => setIsHelpModalOpen(true)}
      >
        📚 Need Help?
      </button>

      <ModalGuide
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      >
        <GuidelinesContent />
      </ModalGuide>
    </div>
  );
};

export default RegisterNewEntity;



