"use client"

import { useRef, useState } from "react"
import styles from "./FileUploadArea.module.css"

const FileUploadArea = ({ onFileChange, file }) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (validateFile(droppedFile)) {
        onFileChange(droppedFile)
      }
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (validateFile(selectedFile)) {
        onFileChange(selectedFile)
      }
    }
  }

  const validateFile = (file) => {
    // Check if file is a PDF
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file")
      return false
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB")
      return false
    }

    return true
  }

  const handleBrowseClick = () => {
    fileInputRef.current.click()
  }

  return (
    <div className={styles.uploadContainer}>
      <div
        className={`${styles.dropArea} ${isDragging ? styles.dragging : ""} ${file ? styles.hasFile : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        {file ? (
          <div className={styles.fileInfo}>
            <div className={styles.fileName}>{file.name}</div>
            <div className={styles.fileSize}>{(file.size / 1024).toFixed(2)} KB</div>
          </div>
        ) : (
          <div className={styles.uploadPrompt}>
            <div className={styles.uploadIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <p>
              Drag & drop your PDF here or <span className={styles.browse}>browse</span>
            </p>
            <p className={styles.fileLimit}>Max file size: 5MB</p>
          </div>
        )}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf" className={styles.fileInput} />

      {file && (
        <button
          type="button"
          className={styles.removeButton}
          onClick={(e) => {
            e.stopPropagation()
            onFileChange(null)
          }}
        >
          Remove file
        </button>
      )}
    </div>
  )
}

export default FileUploadArea
