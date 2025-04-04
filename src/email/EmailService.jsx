"use client"

import { useState, useRef, useEffect } from "react"
import { read, utils } from "xlsx"
import styles from "./EmailService.module.css"
import { Tooltip } from "antd"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Link, Image, List, ListOrdered, Type, Palette, Paperclip } from 'lucide-react'

const EmailService = () => {
  // State for form data
  const [formData, setFormData] = useState({
    emails: [],
    subject: "",
    message: ""
  })
  
  // State for email input
  const [inputValue, setInputValue] = useState("")
  
  // State for loading status
  const [isLoading, setIsLoading] = useState(false)
  
  // State for validation results
  const [validationResults, setValidationResults] = useState({
    duplicates: [],
    invalid: []
  })
  
  // State for file upload
  const [fileUploading, setFileUploading] = useState(false)
  const [uploadStats, setUploadStats] = useState(null)
  
  // State for rich text editor
  const [editorState, setEditorState] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: "left",
    color: "#000000",
    fontSize: "16px",
    fontFamily: "Arial"
  })
  
  // Refs
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  const editorRef = useRef(null)
  
  // Email validation function
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(email).toLowerCase())
  }
  
  // Process email function
  const processEmail = (email) => {
    email = email.trim()
    if (!email) return null
    if (!email.includes("@")) {
      email = `${email}@cuchd.in`
    }
    return email
  }
  
  // Add emails function
  const addEmails = (text) => {
    const emailsArray = text
      .split(/[\n,;]+/)
      .map(processEmail)
      .filter(Boolean)
    
    // Check for duplicates and invalid emails
    const newDuplicates = []
    const newInvalid = []
    const validEmails = []
    
    emailsArray.forEach(email => {
      if (formData.emails.includes(email)) {
        newDuplicates.push(email)
      } else if (!isValidEmail(email)) {
        newInvalid.push(email)
      } else {
        validEmails.push(email)
      }
    })
    
    // Update validation results
    setValidationResults(prev => ({
      duplicates: [...new Set([...prev.duplicates, ...newDuplicates])],
      invalid: [...new Set([...prev.invalid, ...newInvalid])]
    }))
    
    // Update form data with valid emails
    setFormData(prevState => ({
      ...prevState,
      emails: [...new Set([...prevState.emails, ...validEmails])]
    }))
    
    setInputValue("")
  }
  
  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }
  
  // Handle key down
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addEmails(inputValue)
    }
  }
  
  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text")
    addEmails(pastedText)
  }
  
  // Remove email
  const removeEmail = (emailToRemove) => {
    setFormData(prevState => ({
      ...prevState,
      emails: prevState.emails.filter(email => email !== emailToRemove)
    }))
  }
  
  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
  
  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    setFileUploading(true)
    
    try {
      const data = await file.arrayBuffer()
      const workbook = read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 })
      
      // Extract emails from the Excel data
      const extractedEmails = []
      jsonData.forEach(row => {
        row.forEach(cell => {
          if (typeof cell === "string") {
            // Extract anything that looks like an email
            const emailMatches = cell.match(/[^\s@]+@[^\s@]+\.[^\s@]+/g)
            if (emailMatches) {
              extractedEmails.push(...emailMatches)
            } else if (cell.trim() && !cell.includes("@")) {
              // If it doesn't have @ but looks like it could be a username
              extractedEmails.push(`${cell.trim()}@cuchd.in`)
            }
          }
        })
      })
      
      // Process the extracted emails
      const newDuplicates = []
      const newInvalid = []
      const validEmails = []
      
      extractedEmails.forEach(email => {
        if (formData.emails.includes(email)) {
          newDuplicates.push(email)
        } else if (!isValidEmail(email)) {
          newInvalid.push(email)
        } else {
          validEmails.push(email)
        }
      })
      
      // Update validation results
      setValidationResults(prev => ({
        duplicates: [...new Set([...prev.duplicates, ...newDuplicates])],
        invalid: [...new Set([...prev.invalid, ...newInvalid])]
      }))
      
      // Update form data with valid emails
      setFormData(prevState => ({
        ...prevState,
        emails: [...new Set([...prevState.emails, ...validEmails])]
      }))
      
      // Set upload stats
      setUploadStats({
        total: extractedEmails.length,
        valid: validEmails.length,
        duplicates: newDuplicates.length,
        invalid: newInvalid.length
      })
      
    } catch (error) {
      console.error("Error processing Excel file:", error)
    } finally {
      setFileUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log("Email sent:", formData)
      
      // Reset form
      setFormData({ emails: [], subject: "", message: "" })
      setInputValue("")
      setValidationResults({ duplicates: [], invalid: [] })
      setUploadStats(null)
      
      // Show success message
      alert("Email sent successfully!")
    } catch (error) {
      alert("Failed to send email")
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle editor formatting
  const applyFormat = (format, value) => {
    setEditorState(prev => ({
      ...prev,
      [format]: value !== undefined ? value : !prev[format]
    }))
    
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }
  
  // Apply current formatting to editor
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.fontWeight = editorState.bold ? "bold" : "normal"
      editorRef.current.style.fontStyle = editorState.italic ? "italic" : "normal"
      editorRef.current.style.textDecoration = editorState.underline ? "underline" : "none"
      editorRef.current.style.textAlign = editorState.align
      editorRef.current.style.color = editorState.color
      editorRef.current.style.fontSize = editorState.fontSize
      editorRef.current.style.fontFamily = editorState.fontFamily
    }
  }, [editorState])
  
  // Handle editor content change
  const handleEditorChange = (e) => {
    setFormData(prev => ({
      ...prev,
      message: e.target.innerHTML
    }))
  }
  
  // Insert link
  const insertLink = () => {
    const url = prompt("Enter URL:")
    if (url) {
      const linkText = prompt("Enter link text:", url)
      const link = `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText || url}</a>`
      document.execCommand("insertHTML", false, link)
    }
  }
  
  // Insert image
  const insertImage = () => {
    const url = prompt("Enter image URL:")
    if (url) {
      const image = `<img src="${url}" alt="Image" style="max-width: 100%;" />`
      document.execCommand("insertHTML", false, image)
    }
  }
  
  // Clear validation results
  const clearValidationResults = (type) => {
    setValidationResults(prev => ({
      ...prev,
      [type]: []
    }))
  }
  
  // Add emails from validation results
  const addFromValidation = (email) => {
    if (isValidEmail(email)) {
      setFormData(prev => ({
        ...prev,
        emails: [...new Set([...prev.emails, email])]
      }))
      
      // Remove from validation results
      setValidationResults(prev => ({
        ...prev,
        invalid: prev.invalid.filter(e => e !== email),
        duplicates: prev.duplicates.filter(e => e !== email)
      }))
    }
  }

  return (
    <div className={styles.emailServiceContainer}>
      <div className={styles.emailServiceContent}>
        <div className={styles.emailFormColumn}>
          <div className={styles.emailServiceCard}>
            <h1 className={styles.emailServiceTitle}>Email Service</h1>
            
            <form onSubmit={handleSubmit} className={styles.emailForm}>
              {/* Email Input Section */}
              <div className={styles.formGroup}>
                <label htmlFor="emails" className={styles.formLabel}>
                  Email Addresses
                </label>
                <div 
                  className={styles.emailInputContainer} 
                  onClick={() => inputRef.current.focus()}
                >
                  {formData.emails.map((email, index) => (
                    <span key={index} className={styles.emailTag}>
                      {email}
                      <button 
                        type="button" 
                        onClick={() => removeEmail(email)} 
                        className={styles.removeEmail}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  <input
                    ref={inputRef}
                    type="text"
                    id="emails"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    placeholder="Enter or paste email addresses, press Enter to add"
                    className={styles.emailInput}
                  />
                </div>
                
                <div className={styles.emailCount}>
                  <span>Total Valid Emails: {formData.emails.length}</span>
                  
                  <div className={styles.bulkUploadContainer}>
                    <button 
                      type="button" 
                      className={styles.bulkUploadButton}
                      onClick={() => fileInputRef.current.click()}
                      disabled={fileUploading}
                    >
                      {fileUploading ? "Uploading..." : "Bulk Upload"}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".xlsx,.xls,.csv"
                      className={styles.fileInput}
                    />
                  </div>
                </div>
                
                {uploadStats && (
                  <div className={styles.uploadStats}>
                    <p className={styles.uploadP}>Upload Results:</p>
                    <ul>
                      <li>Total processed: {uploadStats.total}</li>
                      <li>Valid emails added: {uploadStats.valid}</li>
                      <li>Duplicates found: {uploadStats.duplicates}</li>
                      <li>Invalid emails: {uploadStats.invalid}</li>
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Subject Input */}
              <div className={styles.formGroup}>
                <label htmlFor="subject" className={styles.formLabel}>
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter email subject"
                  required
                  className={styles.textInput}
                />
              </div>
              
              {/* Rich Text Editor */}
              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.formLabel}>
                  Message
                </label>
                
                <div className={styles.richTextEditor}>
                  {/* Formatting Toolbar */}
                  <div className={styles.editorToolbar}>
                    <div className={styles.toolbarGroup}>
                      <Tooltip title="Bold">
                        <button 
                          type="button" 
                          className={`${styles.toolbarButton} ${editorState.bold ? styles.active : ""}`}
                          onClick={() => applyFormat("bold")}
                        >
                          <Bold size={16} />
                        </button>
                      </Tooltip>
                      
                      <Tooltip title="Italic">
                        <button 
                          type="button" 
                          className={`${styles.toolbarButton} ${editorState.italic ? styles.active : ""}`}
                          onClick={() => applyFormat("italic")}
                        >
                          <Italic size={16} />
                        </button>
                      </Tooltip>
                      
                      <Tooltip title="Underline">
                        <button 
                          type="button" 
                          className={`${styles.toolbarButton} ${editorState.underline ? styles.active : ""}`}
                          onClick={() => applyFormat("underline")}
                        >
                          <Underline size={16} />
                        </button>
                      </Tooltip>
                    </div>
                    
                    <div className={styles.toolbarGroup}>
                      <Tooltip title="Align Left">
                        <button 
                          type="button" 
                          className={`${styles.toolbarButton} ${editorState.align === "left" ? styles.active : ""}`}
                          onClick={() => applyFormat("align", "left")}
                        >
                          <AlignLeft size={16} />
                        </button>
                      </Tooltip>
                      
                      <Tooltip title="Align Center">
                        <button 
                          type="button" 
                          className={`${styles.toolbarButton} ${editorState.align === "center" ? styles.active : ""}`}
                          onClick={() => applyFormat("align", "center")}
                        >
                          <AlignCenter size={16} />
                        </button>
                      </Tooltip>
                      
                      <Tooltip title="Align Right">
                        <button 
                          type="button" 
                          className={`${styles.toolbarButton} ${editorState.align === "right" ? styles.active : ""}`}
                          onClick={() => applyFormat("align", "right")}
                        >
                          <AlignRight size={16} />
                        </button>
                      </Tooltip>
                    </div>
                    
                    <div className={styles.toolbarGroup}>
                      <Tooltip title="Insert Link">
                        <button 
                          type="button" 
                          className={styles.toolbarButton}
                          onClick={insertLink}
                        >
                          <Link size={16} />
                        </button>
                      </Tooltip>
                      
                      <Tooltip title="Insert Image">
                        <button 
                          type="button" 
                          className={styles.toolbarButton}
                          onClick={insertImage}
                        >
                          <Image size={16} />
                        </button>
                      </Tooltip>
                      
                      <Tooltip title="Attach File">
                        <button 
                          type="button" 
                          className={styles.toolbarButton}
                        >
                          <Paperclip size={16} />
                        </button>
                      </Tooltip>
                    </div>
                    
                    <div className={styles.toolbarGroup}>
                      <Tooltip title="Font Family">
                        <select 
                          className={styles.fontSelect}
                          value={editorState.fontFamily}
                          onChange={(e) => applyFormat("fontFamily", e.target.value)}
                        >
                          <option value="Arial">Arial</option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Courier New">Courier New</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Verdana">Verdana</option>
                          <option value="Tahoma">Tahoma</option>
                        </select>
                      </Tooltip>
                      
                      <Tooltip title="Font Size">
                        <select 
                          className={styles.fontSelect}
                          value={editorState.fontSize}
                          onChange={(e) => applyFormat("fontSize", e.target.value)}
                        >
                          <option value="12px">12px</option>
                          <option value="14px">14px</option>
                          <option value="16px">16px</option>
                          <option value="18px">18px</option>
                          <option value="20px">20px</option>
                          <option value="24px">24px</option>
                          <option value="28px">28px</option>
                        </select>
                      </Tooltip>
                      
                      <Tooltip title="Text Color">
                        <div className={styles.colorPickerContainer}>
                          <input 
                            type="color" 
                            value={editorState.color}
                            onChange={(e) => applyFormat("color", e.target.value)}
                            className={styles.colorPicker}
                          />
                          <Palette size={16} className={styles.colorIcon} />
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                  
                  {/* Editor Content Area */}
                  <div
                    ref={editorRef}
                    className={styles.editorContent}
                    contentEditable
                    onInput={handleEditorChange}
                    dangerouslySetInnerHTML={{ __html: formData.message }}
                  />
                </div>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isLoading || formData.emails.length === 0}
              >
                {isLoading ? (
                  <div className={styles.loader}></div>
                ) : (
                  "Send Email"
                )}
              </button>
            </form>
          </div>
        </div>
        
        {/* Validation Results Column */}
        <div className={styles.validationColumn}>
          <div className={styles.validationCard}>
            <h2 className={styles.validationTitle}>Email Validation</h2>
            
            {/* Invalid Emails */}
            <div className={styles.validationSection}>
              <div className={styles.validationHeader}>
                <h3 className={styles.validationSubtitle}>
                  Invalid Emails ({validationResults.invalid.length})
                </h3>
                {validationResults.invalid.length > 0 && (
                  <button 
                    type="button" 
                    className={styles.clearButton}
                    onClick={() => clearValidationResults("invalid")}
                  >
                    Clear
                  </button>
                )}
              </div>
              
              {validationResults.invalid.length > 0 ? (
                <ul className={styles.validationList}>
                  {validationResults.invalid.map((email, index) => (
                    <li key={index} className={styles.validationItem}>
                      <span className={styles.invalidEmail}>{email}</span>
                      <button 
                        type="button" 
                        className={styles.fixButton}
                        onClick={() => addFromValidation(email)}
                      >
                        Fix & Add
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyMessage}>No invalid emails</p>
              )}
            </div>
            
            {/* Duplicate Emails */}
            <div className={styles.validationSection}>
              <div className={styles.validationHeader}>
                <h3 className={styles.validationSubtitle}>
                  Duplicate Emails ({validationResults.duplicates.length})
                </h3>
                {validationResults.duplicates.length > 0 && (
                  <button 
                    type="button" 
                    className={styles.clearButton}
                    onClick={() => clearValidationResults("duplicates")}
                  >
                    Clear
                  </button>
                )}
              </div>
              
              {validationResults.duplicates.length > 0 ? (
                <ul className={styles.validationList}>
                  {validationResults.duplicates.map((email, index) => (
                    <li key={index} className={styles.validationItem}>
                      <span className={styles.duplicateEmail}>{email}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyMessage}>No duplicate emails</p>
              )}
            </div>
            
            {/* Email Guidelines */}
            <div className={styles.guidelinesSection}>
              <h3 className={styles.validationSubtitle}>Email Guidelines</h3>
              <ul className={styles.guidelinesList}>
                <li>Enter emails separated by commas, spaces, or new lines</li>
                <li>Upload Excel files with emails in any column</li>
                <li>Usernames without @ will get @cuchd.in appended</li>
                <li>Check the validation panel for any issues</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailService
