
"use client"

import { useState, useRef, useEffect } from "react"
import apiClient from "../config/apiClient"
import styles from "./ProfilePictureCard.module.css"
import Swal from "sweetalert2"

import CommitteeCardStudent from "./committeeCardStudent"
import UpdateMediaAttachment from "./UpdateMediaAttachment"

const ProfilePictureCards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedEntity, setSelectedEntity] = useState("")
  const [availableEntities, setAvailableEntities] = useState([])
  const [userDetails, setUserDetails] = useState(null)
  const [regId, setRegId] = useState(null)
  const imageRef = useRef(null)

  // Role configurations
  const roles = [
    {
      id: "secretary",
      title: "Secretary",
      api: "/update_secretary_profile_pic/",
      payload: "temp_secretary_profile_pic",
      color: "#4CAF50",
      icon: "👤",
      gradient: "linear-gradient(135deg, #43a047, #2e7d32)",
    },
    {
      id: "joint_secretary",
      title: "Joint Secretary",
      api: "/update_joint_secretary_profile_pic/",
      payload: "temp_join_secretary_profile_pic",
      color: "#2196F3",
      icon: "👥",
      gradient: "linear-gradient(135deg, #1e88e5, #1565c0)",
    },
    {
      id: "faculty_advisor",
      title: "Faculty Advisor",
      api: "/update_faculty_advisor_profile_pic/",
      payload: "temp_faculty_advisory_profile_pic",
      color: "#FF9800",
      icon: "👨‍🏫",
      gradient: "linear-gradient(135deg, #ff9800, #ef6c00)",
    },
    {
      id: "co_advisor",
      title: "Co-Advisor",
      api: "/update_co_advisor_profile_pic/",
      payload: "temp_co_advisor_profile_pic",
      color: "#E91E63",
      icon: "👩‍🏫",
      gradient: "linear-gradient(135deg, #e91e63, #c2185b)",
    },
  ]

  useEffect(() => {
    // Fetch available entities from localStorage or API
    const getuser = JSON.parse(localStorage.getItem("user"))
    if (getuser && getuser.secretary_details && getuser.secretary_details.length > 0) {
      const entities = getuser.secretary_details.map((entity) => ({
        value: entity.reg_id,
        label: entity.entity_name || entity.registration_name,
      }))
      setAvailableEntities(entities)
      setUserDetails(getuser)

      // Extract reg_id array from secretary_details
      const regIds = getuser.secretary_details.map((item) => item.reg_id) || []
      if (regIds.length > 0) {
        setRegId(regIds)
      }
    }
  }, [])

  const openModal = (role) => {
    setSelectedRole(role)
    setIsModalOpen(true)
    setSelectedImage(null)
    setPreviewUrl(null)
    setPosition({ x: 0, y: 0 })
    setScale(1)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedRole(null)
    setSelectedImage(null)
    setPreviewUrl(null)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          icon: "error",
          title: "Invalid File",
          text: "Please select an image file!",
        })

        return
      }

      setSelectedImage(file)

      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMouseDown = (e) => {
    if (!previewUrl) return

    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e) => {
    if (isDragging && previewUrl) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5))
  }

  const handleSubmit = async () => {
    if (!selectedImage || !selectedRole || !selectedEntity) {
      alert("Please select an image, role, and entity")
      return
    }

    try {
      const formData = new FormData()
      formData.append(selectedRole.payload, selectedImage)
      formData.append("reg_id", selectedEntity) // Include reg_id in the payload

      // Make API call without reg_id in query parameters
      const response = await apiClient.post(selectedRole.api, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `${selectedRole.title} profile picture request sent`,
        })

        closeModal()
      } else {
        throw new Error("Update failed")
      }
    } catch (error) {
      console.error(`Error updating ${selectedRole.title} profile picture:`, error)
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: `Failed to update ${selectedRole.title} profile picture. Please try again.`,
      })
    }
  }

  // Function to handle media updates
  const approvedMedia = async (regIds) => {
    try {
      const allMedia = []
      for (const regId of regIds) {
        const response = await apiClient.get(`entity_media_approved/${regId}/`)
        if (response?.data) {
          allMedia.push(response?.data)
        }
      }

      console.log(allMedia, "Media data updated")
    } catch (error) {
      console.log(error, "ENTITY MEDIA ERROR")
    }
  }

  return (
    <div className={styles.profileCardsContainer}>
    <h2 className={styles.profileCardsTitle}>Update Profile Pictures</h2>
    <div className={styles.profileCardsGrid}>
      {roles.map((role) => (
        <div
          key={role.id}
          className={styles.profileCard}
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), ${role.gradient}`,
            borderTop: `4px solid ${role.color}`,
          }}
          onClick={() => openModal(role)}
        >
          <div
            className={styles.profileCardIcon}
            style={{
              background: role.gradient,
            }}
          >
            <span className={styles.roleIcon}>{role.icon}</span>
          </div>
          <h3 className={styles.cardTitle}>{role.title}</h3>
          <p className={styles.cardDescription}>Update profile picture for {role.title}</p>
          <div className={styles.cardOverlay}>
            <span className={styles.updateText}>Update</span>
          </div>
        </div>
      ))}
    </div>

    {isModalOpen && selectedRole && (
      <div className={styles.profileModalOverlay}>
        <div className={styles.profileModal}>
          <div className={styles.profileModalHeader} style={{ background: selectedRole.gradient }}>
            <h2 className={styles.modalTitle}>Update {selectedRole.title} Profile Picture</h2>
            <button className={styles.closeButton} onClick={closeModal}>
              ×
            </button>
          </div>

          <div className={styles.profileModalContent}>
            <div className={styles.entitySelector}>
              <label htmlFor="entity-select">Select Entity:</label>
              <select
                id="entity-select"
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className={styles.entitySelect}
              >
                <option value="">Select an entity</option>
                {availableEntities.map((entity) => (
                  <option key={entity.value} value={entity.value}>
                    {entity.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.uploadSection}>
              <label htmlFor="profile-image" className={styles.uploadLabel}>
                <div className={styles.uploadIcon}>
                  <span>📷</span>
                </div>
                <span className={styles.uploadText}>Select Image</span>
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                />
              </label>
              <p className={styles.uploadHint}>Only JPG, PNG, GIF, and WebP images are allowed</p>
            </div>

            {previewUrl && (
              <div className={styles.previewContainer}>
                <div className={styles.previewControls}>
                  <button onClick={handleZoomIn} className={styles.zoomButton}>
                    +
                  </button>
                  <button onClick={handleZoomOut} className={styles.zoomButton}>
                    -
                  </button>
                </div>

                <div
                  className={styles.previewFrame}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <div className={styles.previewCircle}>
                    <img
                      ref={imageRef}
                      src={previewUrl || "/placeholder.svg"}
                      alt="Preview"
                      className={styles.previewImage}
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        cursor: isDragging ? "grabbing" : "grab",
                      }}
                    />
                  </div>
                </div>
                <p className={styles.previewHint}>Drag to position and use + / - to zoom</p>
              </div>
            )}
          </div>

          <div className={styles.profileModalFooter}>
            <button onClick={closeModal} className={styles.cancelButton}>
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={styles.submitButton}
              style={{ background: selectedRole.gradient }}
              disabled={!selectedImage || !selectedEntity}
            >
              Update Profile Picture
            </button>
          </div>
        </div>
      </div>
    )}

    <div className={styles.clubDetailsPage}>
      {/* Render the UpdateMediaAttachment component */}
      <UpdateMediaAttachment regId={regId} userDetails={userDetails} approvedMedia={approvedMedia} />
    </div>
    <CommitteeCardStudent />
  </div>
  )
}

export default ProfilePictureCards

