"use client"

import { useState, useEffect, useRef } from "react"
import apiClient from "../config/apiClient"
import styles from "./UpdateMediaAttachment.module.css"

const UpdateMediaAttachment = ({ regId, userDetails, approvedMedia }) => {
    const [drawerVisible, setDrawerVisible] = useState(false)
    const [drawerContent, setDrawerContent] = useState(null)
    const [bannerFile, setBannerFile] = useState(null)
    const [logoFile, setLogoFile] = useState(null)
    const [bannerPreview, setBannerPreview] = useState(null)
    const [logoPreview, setLogoPreview] = useState(null)
    const [selectedEntity, setSelectedEntity] = useState("")
    const [availableEntities, setAvailableEntities] = useState([])
    
    // Image adjustment states
    const [logoScale, setLogoScale] = useState(1)
    const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 })
    const [bannerScale, setBannerScale] = useState(1)
    const [bannerPosition, setBannerPosition] = useState({ x: 0, y: 0 })
    
    // Refs for image containers
    const logoContainerRef = useRef(null)
    const bannerContainerRef = useRef(null)
  
    useEffect(() => {
      // If user is a Student Secretary, prepare available entities for selection
      if (userDetails && userDetails.secretary_details && userDetails.secretary_details.length > 0) {
        const entities = userDetails.secretary_details.map((entity) => ({
          value: entity.reg_id,
          label: entity.entity_name || entity.registration_name,
        }))
        setAvailableEntities(entities)
      }
    }, [userDetails])
  
    const showDrawer = (content) => {
      setDrawerContent(content)
      setDrawerVisible(true)
      // Reset adjustment values when opening drawer
      setLogoScale(1)
      setLogoPosition({ x: 0, y: 0 })
      setBannerScale(1)
      setBannerPosition({ x: 0, y: 0 })
    }
  
    const onCloseDrawer = () => {
      setDrawerVisible(false)
      setDrawerContent(null)
      setBannerPreview(null)
      setLogoPreview(null)
      setBannerFile(null)
      setLogoFile(null)
    }
  
    // Function to handle entity selection
    const handleEntitySelect = (e) => {
      setSelectedEntity(e.target.value)
    }
  
    // Handle banner file selection
    const handleBannerFileChange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const isImage = file.type.startsWith("image/")
        if (!isImage) {
          alert("Please select an image file!")
          return
        }
  
        setBannerFile(file)
  
        // Create preview
        const reader = new FileReader()
        reader.onload = () => {
          setBannerPreview(reader.result)
        }
        reader.readAsDataURL(file)
      }
    }
  
    // Handle logo file selection
    const handleLogoFileChange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const isImage = file.type.startsWith("image/")
        if (!isImage) {
          alert("Please select an image file!")
          return
        }
  
        setLogoFile(file)
  
        // Create preview
        const reader = new FileReader()
        reader.onload = () => {
          setLogoPreview(reader.result)
        }
        reader.readAsDataURL(file)
      }
    }
    
    // Handle logo scale change
    const handleLogoScaleChange = (e) => {
      setLogoScale(parseFloat(e.target.value))
    }
    
    // Handle banner scale change
    const handleBannerScaleChange = (e) => {
      setBannerScale(parseFloat(e.target.value))
    }
    
    // Handle logo position change
    const handleLogoPositionChange = (axis, value) => {
      setLogoPosition(prev => ({
        ...prev,
        [axis]: parseInt(value)
      }))
    }
    
    // Handle banner position change
    const handleBannerPositionChange = (axis, value) => {
      setBannerPosition(prev => ({
        ...prev,
        [axis]: parseInt(value)
      }))
    }
  
    // Handle banner upload
    const handleBannerUpload = async () => {
      if (!selectedEntity) {
        alert("Please select an entity first")
        return
      }
  
      if (!bannerFile) {
        alert("Please select a banner image to upload")
        return
      }
      
      // Here you would typically process the image with the adjustments
      // before sending to the server
  
      const formData = new FormData()
      formData.append("reg_id", selectedEntity)
      formData.append("banner", bannerFile)
      // You could also send adjustment data to be processed server-side
      formData.append("scale", bannerScale)
      formData.append("position_x", bannerPosition.x)
      formData.append("position_y", bannerPosition.y)
  
      try {
        const response = await apiClient.post("update_entity_media_banner/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
  
        alert("Your banner update request has been submitted successfully")
  
        // Refresh media data for the selected entity
        if (regId) {
          approvedMedia([selectedEntity])
        }
        onCloseDrawer()
      } catch (error) {
        console.error("Error updating Banner:", error)
        alert("An error occurred while updating the banner. Please try again.")
      }
    }
  
    // Handle logo upload
    const handleLogoUpload = async () => {
      if (!selectedEntity) {
        alert("Please select an entity first")
        return
      }
  
      if (!logoFile) {
        alert("Please select a logo image to upload")
        return
      }
      
      // Here you would typically process the image with the adjustments
      // before sending to the server
  
      const formData = new FormData()
      formData.append("reg_id", selectedEntity)
      formData.append("logo", logoFile)
      // You could also send adjustment data to be processed server-side
      formData.append("scale", logoScale)
      formData.append("position_x", logoPosition.x)
      formData.append("position_y", logoPosition.y)
  
      try {
        const response = await apiClient.post("update_entity_media_logo/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
  
        alert("Your logo update request has been submitted successfully")
  
        // Refresh media data for the selected entity
        if (regId) {
          approvedMedia([selectedEntity])
        }
        onCloseDrawer()
      } catch (error) {
        console.error("Error updating Logo:", error)
        alert("An error occurred while updating the logo. Please try again.")
      }
    }
  
    const renderDrawerContent = () => {
      if (drawerContent === "banner") {
        return (
          <div className={styles.drawerContent}>
            <h2 className={styles.drawerTitle}>Update Banner</h2>
  
            <div className={styles.entitySelector}>
              <label htmlFor="entity-select">Select Entity:</label>
              <select
                id="entity-select"
                value={selectedEntity}
                onChange={handleEntitySelect}
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
  
            <div className={styles.uploadContainer}>
              <div className={styles.uploadArea}>
                <div className={styles.uploadIcon}>
                  <span className={styles.uploadCloudIcon}></span>
                </div>
                <h3>Drag & Drop</h3>
                <p>or click to browse files</p>
                <input
                  type="file"
                  id="banner-upload"
                  className={styles.fileInput}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleBannerFileChange}
                />
                <label htmlFor="banner-upload" className={styles.uploadButton}>
                  Select Banner
                </label>
                <p className={styles.uploadHint}>Only JPG, PNG, GIF, and WebP images are allowed</p>
              </div>
  
              {bannerPreview && (
                <div className={styles.previewSection}>
                  <h3>Preview</h3>
                  <div className={styles.bannerPreviewContainer}>
                    <div 
                      className={styles.bannerPreview} 
                      ref={bannerContainerRef}
                    >
                      <div 
                        className={styles.bannerImageWrapper}
                        style={{
                          transform: `scale(${bannerScale}) translate(${bannerPosition.x}px, ${bannerPosition.y}px)`
                        }}
                      >
                        <img 
                          src={bannerPreview || "/placeholder.svg"} 
                          alt="Banner preview" 
                          className={styles.previewImage} 
                        />
                      </div>
                    </div>
                    
                    <div className={styles.imageAdjustments}>
                      <div className={styles.adjustmentControl}>
                        <label>Zoom:</label>
                        <input 
                          type="range" 
                          min="0.5" 
                          max="2" 
                          step="0.1" 
                          value={bannerScale} 
                          onChange={handleBannerScaleChange}
                          className={styles.rangeSlider}
                        />
                        <span>{Math.round(bannerScale * 100)}%</span>
                      </div>
                      
                      <div className={styles.adjustmentControl}>
                        <label>Horizontal Position:</label>
                        <input 
                          type="range" 
                          min="-50" 
                          max="50" 
                          value={bannerPosition.x} 
                          onChange={(e) => handleBannerPositionChange('x', e.target.value)}
                          className={styles.rangeSlider}
                        />
                      </div>
                      
                      <div className={styles.adjustmentControl}>
                        <label>Vertical Position:</label>
                        <input 
                          type="range" 
                          min="-50" 
                          max="50" 
                          value={bannerPosition.y} 
                          onChange={(e) => handleBannerPositionChange('y', e.target.value)}
                          className={styles.rangeSlider}
                        />
                      </div>
                      
                      <button 
                        className={styles.resetButton}
                        onClick={() => {
                          setBannerScale(1);
                          setBannerPosition({ x: 0, y: 0 });
                        }}
                      >
                        Reset Adjustments
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
  
            <div className={styles.drawerActions}>
              <button className={styles.cancelButton} onClick={onCloseDrawer}>
                Cancel
              </button>
              <button
                className={styles.submitButton}
                onClick={handleBannerUpload}
                disabled={!bannerFile || !selectedEntity}
              >
                Update Banner
              </button>
            </div>
          </div>
        )
      } else if (drawerContent === "logo") {
        return (
          <div className={styles.drawerContent}>
            <h2 className={styles.drawerTitle}>Update Logo</h2>
  
            <div className={styles.entitySelector}>
              <label htmlFor="entity-select-logo">Select Entity:</label>
              <select
                id="entity-select-logo"
                value={selectedEntity}
                onChange={handleEntitySelect}
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
  
            <div className={styles.uploadContainer}>
              <div className={styles.uploadArea}>
                <div className={styles.uploadIcon}>
                  <span className={styles.uploadLogoIcon}></span>
                </div>
                <h3>Drag & Drop</h3>
                <p>or click to browse files</p>
                <input
                  type="file"
                  id="logo-upload"
                  className={styles.fileInput}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleLogoFileChange}
                />
                <label htmlFor="logo-upload" className={styles.uploadButton}>
                  Select Logo
                </label>
                <p className={styles.uploadHint}>Only JPG, PNG, GIF, and WebP images are allowed</p>
              </div>
  
              {logoPreview && (
                <div className={styles.previewSection}>
                  <h3>Preview</h3>
                  <div className={styles.logoPreviewContainer}>
                    <div 
                      className={styles.logoPreview} 
                      ref={logoContainerRef}
                    >
                      <div 
                        className={styles.logoImageWrapper}
                        style={{
                          transform: `scale(${logoScale}) translate(${logoPosition.x}px, ${logoPosition.y}px)`
                        }}
                      >
                        <img
                          src={logoPreview || "/placeholder.svg"}
                          alt="Logo preview"
                          className={`${styles.previewImage} ${styles.logoImage}`}
                        />
                      </div>
                    </div>
                    
                    <div className={styles.imageAdjustments}>
                      <div className={styles.adjustmentControl}>
                        <label>Zoom:</label>
                        <input 
                          type="range" 
                          min="0.5" 
                          max="2" 
                          step="0.1" 
                          value={logoScale} 
                          onChange={handleLogoScaleChange}
                          className={styles.rangeSlider}
                        />
                        <span>{Math.round(logoScale * 100)}%</span>
                      </div>
                      
                      <div className={styles.adjustmentControl}>
                        <label>Horizontal Position:</label>
                        <input 
                          type="range" 
                          min="-50" 
                          max="50" 
                          value={logoPosition.x} 
                          onChange={(e) => handleLogoPositionChange('x', e.target.value)}
                          className={styles.rangeSlider}
                        />
                      </div>
                      
                      <div className={styles.adjustmentControl}>
                        <label>Vertical Position:</label>
                        <input 
                          type="range" 
                          min="-50" 
                          max="50" 
                          value={logoPosition.y} 
                          onChange={(e) => handleLogoPositionChange('y', e.target.value)}
                          className={styles.rangeSlider}
                        />
                      </div>
                      
                      <button 
                        className={styles.resetButton}
                        onClick={() => {
                          setLogoScale(1);
                          setLogoPosition({ x: 0, y: 0 });
                        }}
                      >
                        Reset Adjustments
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
  
            <div className={styles.drawerActions}>
              <button className={styles.cancelButton} onClick={onCloseDrawer}>
                Cancel
              </button>
              <button 
                className={styles.submitButton} 
                onClick={handleLogoUpload} 
                disabled={!logoFile || !selectedEntity}
              >
                Update Logo
              </button>
            </div>
          </div>
        )
      }
      return null
    }
  
    return (
      <div className={styles.mediaUpdateContainer}>
        <h2 className={styles.sectionTitle}>Media Update</h2>
        <p className={styles.sectionDescription}>Update your entity's media assets to enhance your online presence</p>
  
        <div className={styles.mediaCards}>
          <div className={`${styles.mediaCard} ${styles.bannerCard}`} onClick={() => showDrawer("banner")}>
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIconWrapper}>
                  <div className={styles.bannerIconCircle}>
                    <span className={styles.bannerIcon}></span>
                  </div>
                </div>
                <h3>Update Banner</h3>
              </div>
              <div className={styles.cardPreview}>
                <div className={styles.bannerCardPreview}>
                  <div className={styles.previewPlaceholder}></div>
                </div>
                <p>Change your entity's banner image</p>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.cardButton}>Adjust Banner</span>
                <span className={styles.arrowIcon}></span>
              </div>
            </div>
          </div>
  
          <div className={`${styles.mediaCard} ${styles.logoCard}`} onClick={() => showDrawer("logo")}>
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIconWrapper}>
                  <div className={styles.logoIconCircle}>
                    <span className={styles.logoIcon}></span>
                  </div>
                </div>
                <h3>Update Logo</h3>
              </div>
              <div className={styles.cardPreview}>
                <div className={styles.logoCardPreview}>
                  <div className={styles.logoPreviewPlaceholder}></div>
                </div>
                <p>Change your entity's logo image</p>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.cardButton}>Adjust Logo</span>
                <span className={styles.arrowIcon}></span>
              </div>
            </div>
          </div>
        </div>
  
        {drawerVisible && (
          <div className={styles.drawerOverlay} onClick={onCloseDrawer}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
              <button className={styles.drawerClose} onClick={onCloseDrawer}>
                &times;
              </button>
              {renderDrawerContent()}
            </div>
          </div>
        )}
      </div>
    )
  }

export default UpdateMediaAttachment