"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./DPRConfiguration.module.css";
import * as XLSX from "xlsx";

const DPRConfiguration = () => {
  const [teams, setTeams] = useState([
    {
      id: 1,
      department: "",
      teamName: "",
      isConfigComplete: false,
      tableData: [],
      errors: {},
      showVerificationButton: false,
      verificationLevels: [],
      showPreviewTable: false
    }
  ]);
  const [activeTeamId, setActiveTeamId] = useState(1);
  const [currentVerifier, setCurrentVerifier] = useState({
    name: "",
    email: "",
    eCode: "",
    designation: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const fileInputRef = useRef(null);

  // Department options
  const departments = ["HR", "Finance", "IT", "Marketing", "Operations", "Academic"];

  // Get active team - with fallback to prevent undefined
  const getActiveTeam = () => {
    const team = teams.find(team => team.id === activeTeamId);
    // If no team is found, return the first team or a default team object
    if (!team) {
      return teams[0] || {
        id: activeTeamId,
        department: "",
        teamName: "",
        isConfigComplete: false,
        tableData: [],
        errors: {},
        showVerificationButton: false,
        verificationLevels: [],
        showPreviewTable: false
      };
    }
    return team;
  };

  // Update active team without causing infinite loops
  const updateActiveTeam = (updatedTeam) => {
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === activeTeamId ? { ...team, ...updatedTeam } : team
      )
    );
  };

  // This useEffect was causing the infinite loop - we'll fix it
  useEffect(() => {
    const activeTeam = getActiveTeam();
    const shouldShowVerificationButton = 
      activeTeam.tableData && 
      activeTeam.tableData.length > 0 && 
      Object.keys(activeTeam.errors || {}).length === 0;
    
    // Only update if the value is actually different to prevent loops
    if (activeTeam.showVerificationButton !== shouldShowVerificationButton) {
      updateActiveTeam({ showVerificationButton: shouldShowVerificationButton });
    }
  }, [activeTeamId]); // Only run when activeTeamId changes, not on every render

  const handleDepartmentChange = (e) => {
    updateActiveTeam({ department: e.target.value });
  };

  const handleTeamNameChange = (e) => {
    updateActiveTeam({ teamName: e.target.value });
  };

  const handleConfigDone = () => {
    const activeTeam = getActiveTeam();
    if (activeTeam.department && activeTeam.teamName) {
      updateActiveTeam({ isConfigComplete: true });
      showToast("Configuration saved successfully!", "success");
    } else {
      showToast("Please select a department and enter a team name", "error");
    }
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        const formattedData = jsonData.map((row, index) => ({
          id: index + 1,
          name: row["Employee Name"] || "",
          email: row["Employee Email"] || "",
          eCode: row["Employee Code"] || "",
          designation: row["Designation"] || "",
          verificationLevels: [],
        }));

        const newErrors = {};
        formattedData.forEach((row, index) => {
          if (!validateEmail(row.email)) {
            newErrors[index] = { email: "Invalid email format" };
          }
        });

        updateActiveTeam({ 
          tableData: formattedData,
          errors: newErrors,
          // Set this directly here instead of relying on the useEffect
          showVerificationButton: formattedData.length > 0 && Object.keys(newErrors).length === 0
        });
        showToast("File uploaded successfully!", "success");
      } catch (error) {
        showToast("Error processing file. Please check the format.", "error");
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleCellEdit = (rowIndex, field, value) => {
    const activeTeam = getActiveTeam();
    const updatedData = [...(activeTeam.tableData || [])];
    updatedData[rowIndex][field] = value;

    // Validate email if the edited field is an email
    if (field === "email") {
      const newErrors = { ...(activeTeam.errors || {}) };
      if (!validateEmail(value)) {
        newErrors[rowIndex] = {
          ...newErrors[rowIndex],
          email: "Invalid email format",
        };
      } else {
        if (newErrors[rowIndex]) {
          delete newErrors[rowIndex].email;
          if (Object.keys(newErrors[rowIndex]).length === 0) {
            delete newErrors[rowIndex];
          }
        }
      }
      
      // Update with showVerificationButton calculated here
      updateActiveTeam({ 
        tableData: updatedData,
        errors: newErrors,
        showVerificationButton: updatedData.length > 0 && Object.keys(newErrors).length === 0
      });
    } else {
      updateActiveTeam({ tableData: updatedData });
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleAddVerificationLevel = () => {
    if (!currentVerifier.name || !currentVerifier.email || !currentVerifier.eCode) {
      showToast("Please fill all required verifier details", "error");
      return;
    }

    if (!validateEmail(currentVerifier.email)) {
      showToast("Please enter a valid email for verifier", "error");
      return;
    }

    const activeTeam = getActiveTeam();
    const newVerificationLevels = [...(activeTeam.verificationLevels || []), currentVerifier];

    // Add this verification level to all employees
    const updatedTableData = (activeTeam.tableData || []).map((employee) => ({
      ...employee,
      verificationLevels: [
        ...(employee.verificationLevels || []),
        {
          level: newVerificationLevels.length,
          name: currentVerifier.name,
          email: currentVerifier.email,
          eCode: currentVerifier.eCode,
          designation: currentVerifier.designation,
        },
      ],
    }));

    updateActiveTeam({
      verificationLevels: newVerificationLevels,
      tableData: updatedTableData
    });
    
    setCurrentVerifier({ name: "", email: "", eCode: "", designation: "" });
    setShowModal(false);
    showToast("Verification level added successfully!", "success");
  };

  const handleRemoveVerificationLevel = (index) => {
    const activeTeam = getActiveTeam();
    const newLevels = [...(activeTeam.verificationLevels || [])];
    newLevels.splice(index, 1);

    // Remove this verification level from all employees
    const updatedTableData = (activeTeam.tableData || []).map((employee) => {
      const newVerificationLevels = [...(employee.verificationLevels || [])];
      newVerificationLevels.splice(index, 1);

      // Update the level numbers
      const updatedVerificationLevels = newVerificationLevels.map((vl, idx) => ({
        ...vl,
        level: idx + 1,
      }));

      return {
        ...employee,
        verificationLevels: updatedVerificationLevels,
      };
    });

    updateActiveTeam({
      verificationLevels: newLevels,
      tableData: updatedTableData
    });
    
    showToast("Verification level removed", "info");
  };

  const handlePreviewTable = () => {
    const activeTeam = getActiveTeam();
    
    if (!activeTeam.tableData || activeTeam.tableData.length === 0) {
      showToast("No data to preview", "error");
      return;
    }

    if (activeTeam.errors && Object.keys(activeTeam.errors).length > 0) {
      showToast("Please fix all errors before previewing", "error");
      return;
    }

    updateActiveTeam({ showPreviewTable: !activeTeam.showPreviewTable });
    
    if (!activeTeam.showPreviewTable) {
      showToast("Preview table generated", "success");
    }
  };

  const handleAddTeam = () => {
    const newTeamId = teams.length > 0 ? Math.max(...teams.map(team => team.id)) + 1 : 1;
    const newTeam = {
      id: newTeamId,
      department: "",
      teamName: "",
      isConfigComplete: false,
      tableData: [],
      errors: {},
      showVerificationButton: false,
      verificationLevels: [],
      showPreviewTable: false
    };
    
    setTeams(prevTeams => [...prevTeams, newTeam]);
    setActiveTeamId(newTeamId);
    showToast("New team added", "success");
  };

  const handleDownloadSample = () => {
    // Create a sample workbook
    const workbook = XLSX.utils.book_new();
    const data = [
      ["Employee Name", "Employee Email", "Employee Code", "Designation"],
      ["Alice Johnson", "alice.johnson@example.com", "EMP001", "Manager"],
      ["Bob Smith", "bob.smith@example.com", "EMP002", "Developer"],
      ["Charlie Brown", "charlie.brown@example.com", "EMP003", "Analyst"]
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sample");
    
    // Generate and download the file
    XLSX.writeFile(workbook, "employee_template.xlsx");
  };

  // Toast component
  const Toast = ({ message, type }) => {
    const getToastClass = () => {
      switch (type) {
        case "success":
          return styles.toastSuccess;
        case "error":
          return styles.toastError;
        case "info":
          return styles.toastInfo;
        default:
          return "";
      }
    };

    return (
      <div className={`${styles.toast} ${getToastClass()}`}>
        <div className={styles.toastIcon}>
          {type === "success" && <span>✓</span>}
          {type === "error" && <span>✕</span>}
          {type === "info" && <span>ℹ</span>}
        </div>
        <div className={styles.toastMessage}>{message}</div>
      </div>
    );
  };

  // Get team stats for sidebar
  const getTeamStats = () => {
    return teams.map(team => ({
      id: team.id,
      department: team.department || "Unconfigured",
      teamName: team.teamName || `Team ${team.id}`,
      userCount: team.tableData ? team.tableData.length : 0,
      verifierCount: team.verificationLevels ? team.verificationLevels.length : 0
    }));
  };

  // Get active team once for the render
  const activeTeam = getActiveTeam();

  return (
    <div className={styles.appContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>DPR Configuration</h2>
        </div>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarSection}>
            <h3>Teams</h3>
            <ul className={styles.teamList}>
              {getTeamStats().map(team => (
                <li 
                  key={team.id} 
                  className={`${styles.teamItem} ${activeTeamId === team.id ? styles.activeTeam : ''}`}
                  onClick={() => setActiveTeamId(team.id)}
                >
                  <div className={styles.teamItemHeader}>
                    <span className={styles.teamItemName}>{team.teamName}</span>
                    <span className={styles.teamItemDept}>{team.department}</span>
                  </div>
                  <div className={styles.teamItemStats}>
                    <span>{team.userCount} users</span>
                    <span>{team.verifierCount} verifiers</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.sidebarFooter}>
          <button className={styles.addTeamSidebarBtn} onClick={handleAddTeam}>
            Add New Team
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.dprContainer}>
        <h1 className={styles.title}>
          {activeTeam && activeTeam.isConfigComplete 
            ? `${activeTeam.department} - ${activeTeam.teamName}` 
            : "DPR Configuration"}
        </h1>

        {/* Toast notification */}
        {toast.show && <Toast message={toast.message} type={toast.type} />}

        {/* Initial Configuration */}
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Basic Configuration</h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>Select Department</label>
            <select
              className={styles.select}
              value={activeTeam ? activeTeam.department || "" : ""}
              onChange={handleDepartmentChange}
              disabled={activeTeam && activeTeam.isConfigComplete}
            >
              <option value="">Select a department</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Team Name</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter team name"
              value={activeTeam ? activeTeam.teamName || "" : ""}
              onChange={handleTeamNameChange}
              disabled={activeTeam && activeTeam.isConfigComplete}
            />
          </div>

          {activeTeam && !activeTeam.isConfigComplete && (
            <button 
              className={styles.primaryButton} 
              onClick={handleConfigDone} 
              disabled={!activeTeam.department || !activeTeam.teamName}
            >
              Done
            </button>
          )}
        </div>

        {/* Bulk Upload Section */}
        {activeTeam && activeTeam.isConfigComplete && (
          <div className={styles.sectionContainer}>
            <h2 className={styles.sectionTitle}>Bulk Upload Users</h2>
            <p className={styles.instructions}>
              Upload an Excel file containing user data. The file should have columns for Employee Name, Employee Email,
              Employee Code, and Designation.
            </p>

            <div className={styles.uploadContainer}>
              <button className={styles.secondaryButton} onClick={handleDownloadSample}>
                <span className={styles.buttonIcon}>📥</span>
                Download Sample Template
              </button>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx, .xls"
                className={styles.fileInput}
              />
              <button className={styles.uploadButton} onClick={triggerFileInput}>
                <span className={styles.buttonIcon}>📤</span>
                Choose Excel File
              </button>
              <span className={styles.fileName}>
                {fileInputRef.current?.files?.[0]?.name || "No file chosen"}
              </span>
            </div>
          </div>
        )}

        {/* Data Table */}
        {activeTeam && activeTeam.tableData && activeTeam.tableData.length > 0 && (
          <div className={styles.sectionContainer}>
            <h2 className={styles.sectionTitle}>User Data</h2>
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Employee Email</th>
                    <th>E-Code</th>
                    <th>Designation</th>
                    {activeTeam.verificationLevels && activeTeam.verificationLevels.map((level, idx) => (
                      <th key={idx}>Verification Level {idx + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeTeam.tableData.map((row, rowIndex) => (
                    <tr key={row.id} className={activeTeam.errors && activeTeam.errors[rowIndex] ? styles.errorRow : styles.employeeRow}>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={row.name || ""}
                          onChange={(e) => handleCellEdit(rowIndex, "name", e.target.value)}
                        />
                      </td>
                      <td className={activeTeam.errors && activeTeam.errors[rowIndex]?.email ? styles.errorCell : ""}>
                        <input
                          type="text"
                          className={`${styles.tableInput} ${activeTeam.errors && activeTeam.errors[rowIndex]?.email ? styles.errorInput : ""}`}
                          value={row.email || ""}
                          onChange={(e) => handleCellEdit(rowIndex, "email", e.target.value)}
                        />
                        {activeTeam.errors && activeTeam.errors[rowIndex]?.email && (
                          <div className={styles.errorMessage}>{activeTeam.errors[rowIndex].email}</div>
                        )}
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={row.eCode || ""}
                          onChange={(e) => handleCellEdit(rowIndex, "eCode", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className={styles.tableInput}
                          value={row.designation || ""}
                          onChange={(e) => handleCellEdit(rowIndex, "designation", e.target.value)}
                        />
                      </td>
                      {activeTeam.verificationLevels && activeTeam.verificationLevels.map((verifier, idx) => (
                        <td key={idx} className={styles.verifierCell}>
                          <div className={styles.verifierInfo}>
                            <span>{verifier.name}</span>
                            <span className={styles.verifierECode}>{verifier.eCode}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {activeTeam.errors && Object.keys(activeTeam.errors).length > 0 && (
              <div className={styles.errorSummary}>
                <span className={styles.errorIcon}>⚠️</span>
                Please correct the invalid email addresses highlighted in red.
              </div>
            )}
          </div>
        )}

        {/* Verification Level Button */}
        {activeTeam && activeTeam.showVerificationButton && (
          <div className={styles.verificationButtonContainer}>
            <button className={styles.addButton} onClick={() => setShowModal(true)}>
              <span className={styles.buttonIcon}>+</span>
              Add Verification Level {(activeTeam.verificationLevels || []).length + 1}
            </button>
          </div>
        )}

        {/* Verification Levels List */}
        {activeTeam && activeTeam.verificationLevels && activeTeam.verificationLevels.length > 0 && (
          <div className={styles.sectionContainer}>
            <h2 className={styles.sectionTitle}>Verification Levels</h2>
            <div className={styles.verificationLevelsList}>
              {activeTeam.verificationLevels.map((level, index) => (
                <div key={index} className={styles.verificationLevelItem}>
                  <div className={styles.verificationLevelInfo}>
                    <span className={styles.verificationLevelNumber}>Level {index + 1}</span>
                    <span className={styles.verificationLevelName}>{level.name}</span>
                    <span className={styles.verificationLevelEmail}>{level.email}</span>
                    {level.designation && (
                      <span className={styles.verificationLevelDesignation}>{level.designation}</span>
                    )}
                  </div>
                  <button className={styles.deleteButton} onClick={() => handleRemoveVerificationLevel(index)}>
                    <span>🗑️</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview Table Button */}
        {activeTeam && activeTeam.tableData && activeTeam.tableData.length > 0 && 
         activeTeam.verificationLevels && activeTeam.verificationLevels.length > 0 && (
          <div className={styles.previewButtonContainer}>
            <button className={styles.previewButton} onClick={handlePreviewTable}>
              <span className={styles.buttonIcon}>{activeTeam.showPreviewTable ? "🔼" : "🔽"}</span>
              {activeTeam.showPreviewTable ? "Hide Preview Table" : "Preview Table"}
            </button>
            <button className={styles.addTeamBtn} onClick={handleAddTeam}>
              <span className={styles.buttonIcon}>➕</span>
              Add Another Team
            </button>
          </div>
        )}

        {/* Preview Table */}
        {activeTeam && activeTeam.showPreviewTable && (
          <div className={styles.sectionContainer}>
            <h2 className={styles.sectionTitle}>Preview Table</h2>
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Employee Email</th>
                    <th>E-Code</th>
                    <th>Designation</th>
                    {activeTeam.verificationLevels && activeTeam.verificationLevels.map((level, idx) => (
                      <th key={idx}>Verification Level {idx + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeTeam.tableData && activeTeam.tableData.map((row, rowIndex) => (
                    <tr key={row.id} className={styles.previewRow}>
                      <td>{row.name}</td>
                      <td>{row.email}</td>
                      <td>{row.eCode}</td>
                      <td>{row.designation}</td>
                      {activeTeam.verificationLevels && activeTeam.verificationLevels.map((verifier, idx) => (
                        <td key={idx} className={styles.previewVerifierCell}>
                          <div className={styles.previewVerifierInfo}>
                            <div className={styles.previewVerifierName}>{verifier.name}</div>
                            <div className={styles.previewVerifierECode}>{verifier.eCode}</div>
                            {verifier.designation && (
                              <div className={styles.previewVerifierDesignation}>{verifier.designation}</div>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.submitButtonContainer}>
              <button
                className={styles.submitButton}
                onClick={() => showToast("Data submitted successfully!", "success")}
              >
                <span className={styles.buttonIcon}>💾</span>
                Submit Data
              </button>
            </div>
          </div>
        )}

        {/* Verification Level Modal */}
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3 className={styles.modalTitle}>
                Add Verification Level {activeTeam && (activeTeam.verificationLevels || []).length + 1}
              </h3>

              <div className={styles.formGroup}>
                <label className={styles.label}>Verifier Name</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter verifier name"
                  value={currentVerifier.name}
                  onChange={(e) => setCurrentVerifier({ ...currentVerifier, name: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Verifier Email</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter verifier email"
                  value={currentVerifier.email}
                  onChange={(e) =>
                    setCurrentVerifier({
                      ...currentVerifier,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Verifier E-Code</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter verifier E-Code"
                  value={currentVerifier.eCode}
                  onChange={(e) =>
                    setCurrentVerifier({
                      ...currentVerifier,
                      eCode: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Verifier Designation</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter verifier designation"
                  value={currentVerifier.designation}
                  onChange={(e) =>
                    setCurrentVerifier({
                      ...currentVerifier,
                      designation: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.modalActions}>
                <button className={styles.primaryButton} onClick={handleAddVerificationLevel}>
                  <span className={styles.buttonIcon}>+</span>
                  Add Level
                </button>
                <button className={styles.secondaryButton} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DPRConfiguration;
