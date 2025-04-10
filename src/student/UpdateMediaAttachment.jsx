// "use client"

// import { useState, useEffect, useRef } from "react"
// import apiClient from "../config/apiClient"
// import styles from "./UpdateMediaAttachment.module.css"

// const UpdateMediaAttachment = ({ regId, userDetails, approvedMedia }) => {
//     const [drawerVisible, setDrawerVisible] = useState(false)
//     const [drawerContent, setDrawerContent] = useState(null)
//     const [bannerFile, setBannerFile] = useState(null)
//     const [logoFile, setLogoFile] = useState(null)
//     const [bannerPreview, setBannerPreview] = useState(null)
//     const [logoPreview, setLogoPreview] = useState(null)
//     const [selectedEntity, setSelectedEntity] = useState("")
//     const [availableEntities, setAvailableEntities] = useState([])
    
//     // Image adjustment states
//     const [logoScale, setLogoScale] = useState(1)
//     const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 })
//     const [bannerScale, setBannerScale] = useState(1)
//     const [bannerPosition, setBannerPosition] = useState({ x: 0, y: 0 })
    
//     // Refs for image containers
//     const logoContainerRef = useRef(null)
//     const bannerContainerRef = useRef(null)

//     const updateCards = [
//       {
//         title: "Update About & Eligibility & Category",
//         icon: "📝",
//         type: "about_eligibility",
//         description: "Update entity about and eligibility section",
//         color: "#4CAF50",
//         gradient: "linear-gradient(135deg, #43a047, #2e7d32)",
//       },
//       {
//         title: "Update Description",
//         icon: "📄",
//         type: "description",
//         description: "Update entity description",
//         color: "#9C27B0",
//         gradient: "linear-gradient(135deg, #9c27b0, #7b1fa2)",
//       },
//       {
//         title: "Update Categories",
//         icon: "🏷️",
//         type: "categories",
//         description: "Update entity categories",
//         color: "#FF5722",
//         gradient: "linear-gradient(135deg, #ff5722, #e64a19)",
//       },
//     ]
  
//     useEffect(() => {
//       // If user is a Student Secretary, prepare available entities for selection
//       if (userDetails && userDetails.secretary_details && userDetails.secretary_details.length > 0) {
//         const entities = userDetails.secretary_details.map((entity) => ({
//           value: entity.reg_id,
//           label: entity.entity_name || entity.registration_name,
//         }))
//         setAvailableEntities(entities)
//       }
//     }, [userDetails])
  
//     const showDrawer = (content) => {
//       setDrawerContent(content)
//       setDrawerVisible(true)
//       // Reset adjustment values when opening drawer
//       setLogoScale(1)
//       setLogoPosition({ x: 0, y: 0 })
//       setBannerScale(1)
//       setBannerPosition({ x: 0, y: 0 })
//     }
  
//     const onCloseDrawer = () => {
//       setDrawerVisible(false)
//       setDrawerContent(null)
//       setBannerPreview(null)
//       setLogoPreview(null)
//       setBannerFile(null)
//       setLogoFile(null)
//     }
  
//     // Function to handle entity selection
//     const handleEntitySelect = (e) => {
//       setSelectedEntity(e.target.value)
//     }
  
//     // Handle banner file selection
//     const handleBannerFileChange = (e) => {
//       const file = e.target.files[0]
//       if (file) {
//         const isImage = file.type.startsWith("image/")
//         if (!isImage) {
//           alert("Please select an image file!")
//           return
//         }
  
//         setBannerFile(file)
  
//         // Create preview
//         const reader = new FileReader()
//         reader.onload = () => {
//           setBannerPreview(reader.result)
//         }
//         reader.readAsDataURL(file)
//       }
//     }
  
//     // Handle logo file selection
//     const handleLogoFileChange = (e) => {
//       const file = e.target.files[0]
//       if (file) {
//         const isImage = file.type.startsWith("image/")
//         if (!isImage) {
//           alert("Please select an image file!")
//           return
//         }
  
//         setLogoFile(file)
  
//         // Create preview
//         const reader = new FileReader()
//         reader.onload = () => {
//           setLogoPreview(reader.result)
//         }
//         reader.readAsDataURL(file)
//       }
//     }
    
//     // Handle logo scale change
//     const handleLogoScaleChange = (e) => {
//       setLogoScale(parseFloat(e.target.value))
//     }
    
//     // Handle banner scale change
//     const handleBannerScaleChange = (e) => {
//       setBannerScale(parseFloat(e.target.value))
//     }
    
//     // Handle logo position change
//     const handleLogoPositionChange = (axis, value) => {
//       setLogoPosition(prev => ({
//         ...prev,
//         [axis]: parseInt(value)
//       }))
//     }
    
//     // Handle banner position change
//     const handleBannerPositionChange = (axis, value) => {
//       setBannerPosition(prev => ({
//         ...prev,
//         [axis]: parseInt(value)
//       }))
//     }
  
//     // Handle banner upload
//     const handleBannerUpload = async () => {
//       if (!selectedEntity) {
//         alert("Please select an entity first")
//         return
//       }
  
//       if (!bannerFile) {
//         alert("Please select a banner image to upload")
//         return
//       }
      
//       // Here you would typically process the image with the adjustments
//       // before sending to the server
  
//       const formData = new FormData()
//       formData.append("reg_id", selectedEntity)
//       formData.append("banner", bannerFile)
//       // You could also send adjustment data to be processed server-side
//       formData.append("scale", bannerScale)
//       formData.append("position_x", bannerPosition.x)
//       formData.append("position_y", bannerPosition.y)
  
//       try {
//         const response = await apiClient.post("update_entity_media_banner/", formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         })
  
//         alert("Your banner update request has been submitted successfully")
  
//         // Refresh media data for the selected entity
//         if (regId) {
//           approvedMedia([selectedEntity])
//         }
//         onCloseDrawer()
//       } catch (error) {
//         console.error("Error updating Banner:", error)
//         alert("An error occurred while updating the banner. Please try again.")
//       }
//     }
  
//     // Handle logo upload
//     const handleLogoUpload = async () => {
//       if (!selectedEntity) {
//         alert("Please select an entity first")
//         return
//       }
  
//       if (!logoFile) {
//         alert("Please select a logo image to upload")
//         return
//       }
      
//       // Here you would typically process the image with the adjustments
//       // before sending to the server
  
//       const formData = new FormData()
//       formData.append("reg_id", selectedEntity)
//       formData.append("logo", logoFile)
//       // You could also send adjustment data to be processed server-side
//       formData.append("scale", logoScale)
//       formData.append("position_x", logoPosition.x)
//       formData.append("position_y", logoPosition.y)
  
//       try {
//         const response = await apiClient.post("update_entity_media_logo/", formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         })
  
//         alert("Your logo update request has been submitted successfully")
  
//         // Refresh media data for the selected entity
//         if (regId) {
//           approvedMedia([selectedEntity])
//         }
//         onCloseDrawer()
//       } catch (error) {
//         console.error("Error updating Logo:", error)
//         alert("An error occurred while updating the logo. Please try again.")
//       }
//     }
  
//     const renderDrawerContent = () => {
//       if (drawerContent === "banner") {
//         return (
//           <div className={styles.drawerContent}>
//             <h2 className={styles.drawerTitle}>Update Banner</h2>
  
//             <div className={styles.entitySelector}>
//               <label htmlFor="entity-select">Select Entity:</label>
//               <select
//                 id="entity-select"
//                 value={selectedEntity}
//                 onChange={handleEntitySelect}
//                 className={styles.entitySelect}
//               >
//                 <option value="">Select an entity</option>
//                 {availableEntities.map((entity) => (
//                   <option key={entity.value} value={entity.value}>
//                     {entity.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
  
//             <div className={styles.uploadContainer}>
//               <div className={styles.uploadArea}>
//                 <div className={styles.uploadIcon}>
//                   <span className={styles.uploadCloudIcon}></span>
//                 </div>
//                 <h3>Drag & Drop</h3>
//                 <p>or click to browse files</p>
//                 <input
//                   type="file"
//                   id="banner-upload"
//                   className={styles.fileInput}
//                   accept="image/jpeg,image/png,image/gif,image/webp"
//                   onChange={handleBannerFileChange}
//                 />
//                 <label htmlFor="banner-upload" className={styles.uploadButton}>
//                   Select Banner
//                 </label>
//                 <p className={styles.uploadHint}>Only JPG, PNG, GIF, and WebP images are allowed</p>
//               </div>
  
//               {bannerPreview && (
//                 <div className={styles.previewSection}>
//                   <h3>Preview</h3>
//                   <div className={styles.bannerPreviewContainer}>
//                     <div 
//                       className={styles.bannerPreview} 
//                       ref={bannerContainerRef}
//                     >
//                       <div 
//                         className={styles.bannerImageWrapper}
//                         style={{
//                           transform: `scale(${bannerScale}) translate(${bannerPosition.x}px, ${bannerPosition.y}px)`
//                         }}
//                       >
//                         <img 
//                           src={bannerPreview || "/placeholder.svg"} 
//                           alt="Banner preview" 
//                           className={styles.previewImage} 
//                         />
//                       </div>
//                     </div>
                    
//                     <div className={styles.imageAdjustments}>
//                       <div className={styles.adjustmentControl}>
//                         <label>Zoom:</label>
//                         <input 
//                           type="range" 
//                           min="0.5" 
//                           max="2" 
//                           step="0.1" 
//                           value={bannerScale} 
//                           onChange={handleBannerScaleChange}
//                           className={styles.rangeSlider}
//                         />
//                         <span>{Math.round(bannerScale * 100)}%</span>
//                       </div>
                      
//                       <div className={styles.adjustmentControl}>
//                         <label>Horizontal Position:</label>
//                         <input 
//                           type="range" 
//                           min="-50" 
//                           max="50" 
//                           value={bannerPosition.x} 
//                           onChange={(e) => handleBannerPositionChange('x', e.target.value)}
//                           className={styles.rangeSlider}
//                         />
//                       </div>
                      
//                       <div className={styles.adjustmentControl}>
//                         <label>Vertical Position:</label>
//                         <input 
//                           type="range" 
//                           min="-50" 
//                           max="50" 
//                           value={bannerPosition.y} 
//                           onChange={(e) => handleBannerPositionChange('y', e.target.value)}
//                           className={styles.rangeSlider}
//                         />
//                       </div>
                      
//                       <button 
//                         className={styles.resetButton}
//                         onClick={() => {
//                           setBannerScale(1);
//                           setBannerPosition({ x: 0, y: 0 });
//                         }}
//                       >
//                         Reset Adjustments
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
  
//             <div className={styles.drawerActions}>
//               <button className={styles.cancelButton} onClick={onCloseDrawer}>
//                 Cancel
//               </button>
//               <button
//                 className={styles.submitButton}
//                 onClick={handleBannerUpload}
//                 disabled={!bannerFile || !selectedEntity}
//               >
//                 Update Banner
//               </button>
//             </div>
//           </div>
//         )
//       } else if (drawerContent === "logo") {
//         return (
//           <div className={styles.drawerContent}>
//             <h2 className={styles.drawerTitle}>Update Logo</h2>
  
//             <div className={styles.entitySelector}>
//               <label htmlFor="entity-select-logo">Select Entity:</label>
//               <select
//                 id="entity-select-logo"
//                 value={selectedEntity}
//                 onChange={handleEntitySelect}
//                 className={styles.entitySelect}
//               >
//                 <option value="">Select an entity</option>
//                 {availableEntities.map((entity) => (
//                   <option key={entity.value} value={entity.value}>
//                     {entity.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
  
//             <div className={styles.uploadContainer}>
//               <div className={styles.uploadArea}>
//                 <div className={styles.uploadIcon}>
//                   <span className={styles.uploadLogoIcon}></span>
//                 </div>
//                 <h3>Drag & Drop</h3>
//                 <p>or click to browse files</p>
//                 <input
//                   type="file"
//                   id="logo-upload"
//                   className={styles.fileInput}
//                   accept="image/jpeg,image/png,image/gif,image/webp"
//                   onChange={handleLogoFileChange}
//                 />
//                 <label htmlFor="logo-upload" className={styles.uploadButton}>
//                   Select Logo
//                 </label>
//                 <p className={styles.uploadHint}>Only JPG, PNG, GIF, and WebP images are allowed</p>
//               </div>
  
//               {logoPreview && (
//                 <div className={styles.previewSection}>
//                   <h3>Preview</h3>
//                   <div className={styles.logoPreviewContainer}>
//                     <div 
//                       className={styles.logoPreview} 
//                       ref={logoContainerRef}
//                     >
//                       <div 
//                         className={styles.logoImageWrapper}
//                         style={{
//                           transform: `scale(${logoScale}) translate(${logoPosition.x}px, ${logoPosition.y}px)`
//                         }}
//                       >
//                         <img
//                           src={logoPreview || "/placeholder.svg"}
//                           alt="Logo preview"
//                           className={`${styles.previewImage} ${styles.logoImage}`}
//                         />
//                       </div>
//                     </div>
                    
//                     <div className={styles.imageAdjustments}>
//                       <div className={styles.adjustmentControl}>
//                         <label>Zoom:</label>
//                         <input 
//                           type="range" 
//                           min="0.5" 
//                           max="2" 
//                           step="0.1" 
//                           value={logoScale} 
//                           onChange={handleLogoScaleChange}
//                           className={styles.rangeSlider}
//                         />
//                         <span>{Math.round(logoScale * 100)}%</span>
//                       </div>
                      
//                       <div className={styles.adjustmentControl}>
//                         <label>Horizontal Position:</label>
//                         <input 
//                           type="range" 
//                           min="-50" 
//                           max="50" 
//                           value={logoPosition.x} 
//                           onChange={(e) => handleLogoPositionChange('x', e.target.value)}
//                           className={styles.rangeSlider}
//                         />
//                       </div>
                      
//                       <div className={styles.adjustmentControl}>
//                         <label>Vertical Position:</label>
//                         <input 
//                           type="range" 
//                           min="-50" 
//                           max="50" 
//                           value={logoPosition.y} 
//                           onChange={(e) => handleLogoPositionChange('y', e.target.value)}
//                           className={styles.rangeSlider}
//                         />
//                       </div>
                      
//                       <button 
//                         className={styles.resetButton}
//                         onClick={() => {
//                           setLogoScale(1);
//                           setLogoPosition({ x: 0, y: 0 });
//                         }}
//                       >
//                         Reset Adjustments
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
  
//             <div className={styles.drawerActions}>
//               <button className={styles.cancelButton} onClick={onCloseDrawer}>
//                 Cancel
//               </button>
//               <button 
//                 className={styles.submitButton} 
//                 onClick={handleLogoUpload} 
//                 disabled={!logoFile || !selectedEntity}
//               >
//                 Update Logo
//               </button>
//             </div>
//           </div>
//         )
//       }
//       return null
//     }
  
//     return (
//       <div className={styles.mediaUpdateContainer}>
//         <h2 className={styles.sectionTitle}>Media Update</h2>
//         <p className={styles.sectionDescription}>Update your entity's media assets to enhance your online presence</p>
  
//         <div className={styles.mediaCards}>
//           <div className={`${styles.mediaCard} ${styles.bannerCard}`} onClick={() => showDrawer("banner")}>
//             <div className={styles.cardContent}>
//               <div className={styles.cardHeader}>
//                 <div className={styles.cardIconWrapper}>
//                   <div className={styles.bannerIconCircle}>
//                     <span className={styles.bannerIcon}></span>
//                   </div>
//                 </div>
//                 <h3>Update Banner</h3>
//               </div>
//               <div className={styles.cardPreview}>
//                 <div className={styles.bannerCardPreview}>
//                   <div className={styles.previewPlaceholder}></div>
//                 </div>
//                 <p>Change your entity's banner image</p>
//               </div>
//               <div className={styles.cardFooter}>
//                 <span className={styles.cardButton}>Adjust Banner</span>
//                 <span className={styles.arrowIcon}></span>
//               </div>
//             </div>
//           </div>
  
//           <div className={`${styles.mediaCard} ${styles.logoCard}`} onClick={() => showDrawer("logo")}>
//             <div className={styles.cardContent}>
//               <div className={styles.cardHeader}>
//                 <div className={styles.cardIconWrapper}>
//                   <div className={styles.logoIconCircle}>
//                     <span className={styles.logoIcon}></span>
//                   </div>
//                 </div>
//                 <h3>Update Logo</h3>
//               </div>
//               <div className={styles.cardPreview}>
//                 <div className={styles.logoCardPreview}>
//                   <div className={styles.logoPreviewPlaceholder}></div>
//                 </div>
//                 <p>Change your entity's logo image</p>
//               </div>
//               <div className={styles.cardFooter}>
//                 <span className={styles.cardButton}>Adjust Logo</span>
//                 <span className={styles.arrowIcon}></span>
//               </div>
//             </div>
//           </div>
//         </div>
  
//         {drawerVisible && (
//           <div className={styles.drawerOverlay} onClick={onCloseDrawer}>
//             <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
//               <button className={styles.drawerClose} onClick={onCloseDrawer}>
//                 &times;
//               </button>
//               {renderDrawerContent()}
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

// export default UpdateMediaAttachment

"use client"

import { useState, useEffect } from "react"
import apiClient from "../config/apiClient"
import Swal from "sweetalert2"
import styles from "./UpdateMediaAttachment.module.css"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

const UpdateMediaAttachment = ({ regId, userDetails, approvedMedia }) => {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [drawerContent, setDrawerContent] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)
  const [logoFile, setLogoFile] = useState(null)
  const [bannerPreview, setBannerPreview] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [selectedEntity, setSelectedEntity] = useState("")
  const [availableEntities, setAvailableEntities] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [aboutText, setAboutText] = useState("")
  const [eligibilityText, setEligibilityText] = useState("")
  const [categoriesText, setCategoriesText] = useState("")
  const [categoriesOptions, setCategoriesOptions] = useState([])
  const [editContent, setEditContent] = useState("")

  // Update cards data
  const updateCards = [
    {
      title: "Update About & Eligibility & Category",
      icon: "📝",
      type: "about_eligibility",
      description: "Update entity about and eligibility section",
      color: "#4CAF50",
      gradient: "linear-gradient(135deg, #43a047, #2e7d32)",
    },
   
  ]

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
  }

  const onCloseDrawer = () => {
    setDrawerVisible(false)
    setDrawerContent(null)
    setBannerPreview(null)
    setLogoPreview(null)
    setBannerFile(null)
    setLogoFile(null)
    setEditContent("")
  }

  // Function to handle entity selection
  const handleEntitySelect = (e) => {
    const value = e.target.value
    setSelectedEntity(value)
    if (value && drawerContent === "description" || drawerContent === "categories" || drawerContent === "eligibility") {
      fetchEntityDetails(value)
    }
  }

  // Handle banner file selection
  const handleBannerFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const isImage = file.type.startsWith("image/")
      if (!isImage) {
        Swal.fire({
          icon: "error",
          title: "Invalid File",
          text: "Please select an image file!",
        })
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
        Swal.fire({
          icon: "error",
          title: "Invalid File",
          text: "Please select an image file!",
        })
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

  // Handle banner upload
  const handleBannerUpload = async () => {
    if (!selectedEntity) {
      Swal.fire({
        icon: "warning",
        title: "Selection Required",
        text: "Please select an entity first",
      })
      return
    }

    if (!bannerFile) {
      Swal.fire({
        icon: "warning",
        title: "File Required",
        text: "Please select a banner image to upload",
      })
      return
    }

    const formData = new FormData()
    formData.append("reg_id", selectedEntity)
    formData.append("banner", bannerFile)

    try {
      const response = await apiClient.post("update_entity_media_banner/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      Swal.fire({
        icon: "success",
        title: "Banner Update Request Sent",
        text: "Your banner update request has been submitted successfully",
      })

      // Refresh media data for the selected entity
      if (regId) {
        approvedMedia([selectedEntity])
      }
      onCloseDrawer()
    } catch (error) {
      console.error("Error updating Banner:", error)
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "An error occurred while updating the banner. Please try again.",
      })
    }
  }

  // Handle logo upload
  const handleLogoUpload = async () => {
    if (!selectedEntity) {
      Swal.fire({
        icon: "warning",
        title: "Selection Required",
        text: "Please select an entity first",
      })
      return
    }

    if (!logoFile) {
      Swal.fire({
        icon: "warning",
        title: "File Required",
        text: "Please select a logo image to upload",
      })
      return
    }

    const formData = new FormData()
    formData.append("reg_id", selectedEntity)
    formData.append("logo", logoFile)

    try {
      const response = await apiClient.post("update_entity_media_logo/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      Swal.fire({
        icon: "success",
        title: "Logo Update Request Sent",
        text: "Your logo update request has been submitted successfully",
      })

      // Refresh media data for the selected entity
      if (regId) {
        approvedMedia([selectedEntity])
      }
      onCloseDrawer()
    } catch (error) {
      console.error("Error updating Logo:", error)
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "An error occurred while updating the logo. Please try again.",
      })
    }
  }

  // Function to handle content editing
  const handleEditContent = async () => {
    if (!selectedEntity) {
      Swal.fire({
        icon: "warning",
        title: "Selection Required",
        text: "Please select an entity first",
      })
      return
    }

    if (!editContent.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Content Required",
        text: "Please enter some content to update",
      })
      return
    }

    try {
      let endpoint = ""
      let payload = {}

      switch (drawerContent) {
        case "description":
          endpoint = `update_entity_description/${selectedEntity}/`
          payload = { description: editContent }
          break
        case "categories":
          endpoint = `update_entity_categories/${selectedEntity}/`
          payload = { categories: editContent }
          break
        case "eligibility":
          endpoint = `update_entity_eligibility/${selectedEntity}/`
          payload = { eligibility: editContent }
          break
        default:
          throw new Error("Invalid content type")
      }

      const response = await apiClient.put(endpoint, payload)

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Update Successful",
          text: `${drawerContent.charAt(0).toUpperCase() + drawerContent.slice(1)} has been updated successfully`,
        })
        onCloseDrawer()
      } else {
        throw new Error("Update failed")
      }
    } catch (error) {
      console.error(`Error updating ${drawerContent}:`, error)
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: `Failed to update ${drawerContent}. Please try again.`,
      })
    }
  }

  // New function to handle opening update modal
  const openUpdateModal = (type) => {
    if (type === "about_eligibility") {
      setIsModalVisible(true)
      setSelectedEntity("")
      setAboutText("")
      setEligibilityText("")
      setCategoriesText("") // Clear categories text as well
    } else {
      showDrawer(type)
    }
  }

  // New function to handle update submission
  const handleUpdateSubmit = async () => {
    if (!selectedEntity) {
      Swal.fire({
        icon: "warning",
        title: "Selection Required",
        text: "Please select an entity first",
      })
      return
    }

    if (!aboutText.trim() && !eligibilityText.trim() && !categoriesText.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Content Required",
        text: "Please enter at least one field to update",
      })
      return
    }

    try {
      // Create payload for the API
      const payload = {
        about: aboutText,
        eligibilty: eligibilityText, // Note: This matches the API field name you specified
        categories: categoriesText, // Add categories to the payload
      }

      // Make API call to update about and eligibility
      const response = await apiClient.put(`update_entity_registration_about_eligiblity/${selectedEntity}/`, payload)

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Update Successful",
          text: "About, eligibility, and categories information has been updated",
        })

        setIsModalVisible(false)
      } else {
        throw new Error("Update failed")
      }
    } catch (error) {
      console.error("Error updating about, eligibility, and categories:", error)
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "Please try again later",
      })
    }
  }

  const fetchEntityDetails = async (regId) => {
    try {
      const response = await apiClient.get(`entity-registration-detailed-page/?reg_id=${regId}`)
      if (response.data) {
        setAboutText(response.data.about || "")
        setEligibilityText(response.data.eligibility || "")
        
        // Set edit content based on drawer content
        if (drawerContent === "description") {
          setEditContent(response.data.description || "")
        } else if (drawerContent === "eligibility") {
          setEditContent(response.data.eligibility || "")
        } else if (drawerContent === "categories") {
          setEditContent(response.data.categories || "")
        }
        
        const fetchedCategories = response.data.categories
          ? response.data.categories.split(",").map((cat) => ({
              value: cat.trim(),
              label: cat.trim(),
            }))
          : []

        setCategoriesText(response.data.categories || "")
        setCategoriesOptions(fetchedCategories)
      }
    } catch (error) {
      console.error("Error fetching entity details:", error)
      Swal.fire({
        icon: "error",
        title: "Fetch Failed",
        text: "Failed to fetch entity details",
      })
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
                <i className={styles.uploadCloudIcon}></i>
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
                <div className={styles.bannerPreview}>
                  <img src={bannerPreview || "/placeholder.svg"} alt="Banner preview" className={styles.previewImage} />
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
              <div className={`${styles.uploadIcon} ${styles.logoIcon}`}>
                <i className={styles.uploadLogoIcon}></i>
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
                <div className={styles.logoPreview}>
                  <img
                    src={logoPreview || "/placeholder.svg"}
                    alt="Logo preview"
                    className={`${styles.previewImage} ${styles.logoImage}`}
                  />
                </div>
              </div>
            )}
          </div>

          <div className={styles.drawerActions}>
            <button className={styles.cancelButton} onClick={onCloseDrawer}>
              Cancel
            </button>
            <button className={styles.submitButton} onClick={handleLogoUpload} disabled={!logoFile || !selectedEntity}>
              Update Logo
            </button>
          </div>
        </div>
      )
    } else if (drawerContent === "description") {
      return (
        <div className={styles.drawerContent}>
          <h2 className={styles.drawerTitle}>Update Description</h2>

          <div className={styles.entitySelector}>
            <label htmlFor="entity-select-desc">Select Entity:</label>
            <select
              id="entity-select-desc"
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

          <div className={styles.editorContainer}>
            <ReactQuill
              theme="snow"
              value={editContent}
              onChange={setEditContent}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
              className={styles.editor}
            />
          </div>

          <div className={styles.drawerActions}>
            <button className={styles.cancelButton} onClick={onCloseDrawer}>
              Cancel
            </button>
            <button
              className={styles.submitButton}
              onClick={handleEditContent}
              disabled={!editContent || !selectedEntity}
            >
              Update Description
            </button>
          </div>
        </div>
      )
    } else if (drawerContent === "categories") {
      return (
        <div className={styles.drawerContent}>
          <h2 className={styles.drawerTitle}>Update Categories</h2>

          <div className={styles.entitySelector}>
            <label htmlFor="entity-select-cat">Select Entity:</label>
            <select
              id="entity-select-cat"
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

          <div className={styles.textareaContainer}>
            <label htmlFor="categories-textarea">Categories (comma separated):</label>
            <textarea
              id="categories-textarea"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Enter categories, separated by commas"
              className={styles.textarea}
              rows={5}
            />
          </div>

          <div className={styles.drawerActions}>
            <button className={styles.cancelButton} onClick={onCloseDrawer}>
              Cancel
            </button>
            <button
              className={styles.submitButton}
              onClick={handleEditContent}
              disabled={!editContent || !selectedEntity}
            >
              Update Categories
            </button>
          </div>
        </div>
      )
    } else if (drawerContent === "eligibility") {
      return (
        <div className={styles.drawerContent}>
          <h2 className={styles.drawerTitle}>Update Eligibility</h2>

          <div className={styles.entitySelector}>
            <label htmlFor="entity-select-elig">Select Entity:</label>
            <select
              id="entity-select-elig"
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

          <div className={styles.editorContainer}>
            <ReactQuill
              theme="snow"
              value={editContent}
              onChange={setEditContent}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                  ["link"],
                  ["clean"],
                ],
              }}
              className={styles.editor}
            />
          </div>

          <div className={styles.drawerActions}>
            <button className={styles.cancelButton} onClick={onCloseDrawer}>
              Cancel
            </button>
            <button
              className={styles.submitButton}
              onClick={handleEditContent}
              disabled={!editContent || !selectedEntity}
            >
              Update Eligibility
            </button>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className={styles.mediaUpdateContainer}>
    <h2 className={styles.sectionTitle}>Media Update & Content</h2>
    <p className={styles.sectionDescription}>Update your entity's media assets to enhance your online presence</p>

    <div className={styles.mediaCards}>
      <div className={`${styles.mediaCard} ${styles.bannerCard}`} onClick={() => showDrawer("banner")}>
        <div className={styles.cardIcon}>
          <div className={styles.iconCircle}>
            <i className={styles.bannerIcon}></i>
          </div>
        </div>
        <div className={styles.cardContent}>
          <h3>Update Banner</h3>
          <p>Change your entity's banner image</p>
        </div>
        <div className={styles.cardOverlay}>
          <span className={styles.updateText}>Update</span>
        </div>
      </div>

      <div className={`${styles.mediaCard} ${styles.logoCard}`} onClick={() => showDrawer("logo")}>
        <div className={styles.cardIcon}>
          <div className={styles.iconCircle}>
            <i className={styles.logoIcon}></i>
          </div>
        </div>
        <div className={styles.cardContent}>
          <h3>Update Logo</h3>
          <p>Change your entity's logo image</p>
        </div>
        <div className={styles.cardOverlay}>
          <span className={styles.updateText}>Update</span>
        </div>
      </div>

      {/* Additional update cards */}
      {updateCards.map((card, index) => (
        <div
          key={index}
          className={`${styles.mediaCard} ${styles.updateCard}`}
          onClick={() => openUpdateModal(card.type)}
          style={{
            borderTop: `4px solid ${card.color}`,
          }}
        >
          <div className={styles.cardIcon}>
            <div
              className={styles.iconCircle}
              style={{
                background: card.gradient,
              }}
            >
              <span className={styles.cardIconText}>{card.icon}</span>
            </div>
          </div>
          <div className={styles.cardContent}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
          <div className={styles.cardOverlay}>
            <span className={styles.updateText}>Update</span>
          </div>
        </div>
      ))}
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

    {/* About & Eligibility & Category Modal */}
    {isModalVisible && (
      <div className={styles.modalOverlay} onClick={() => setIsModalVisible(false)}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Update About & Eligibility & Category</h2>
            <button className={styles.modalClose} onClick={() => setIsModalVisible(false)}>
              &times;
            </button>
          </div>

          <div className={styles.modalContent}>
            <div className={styles.entitySelector}>
              <label htmlFor="entity-select-modal">Select Entity:</label>
              <select
                id="entity-select-modal"
                value={selectedEntity}
                onChange={(e) => {
                  setSelectedEntity(e.target.value)
                  fetchEntityDetails(e.target.value)
                }}
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

            <div className={styles.editorSection}>
              <label htmlFor="about-editor">About:</label>
              <ReactQuill
                id="about-editor"
                theme="snow"
                value={aboutText}
                onChange={setAboutText}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ color: [] }, { background: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["clean"],
                  ],
                }}
                className={styles.editor}
              />
            </div>

            <div className={styles.editorSection}>
              <label htmlFor="eligibility-editor">Eligibility:</label>
              <ReactQuill
                id="eligibility-editor"
                theme="snow"
                value={eligibilityText}
                onChange={setEligibilityText}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ color: [] }, { background: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["clean"],
                  ],
                }}
                className={styles.editor}
              />
            </div>

            <div className={styles.categoriesSection}>
              <label htmlFor="categories-input">Categories (comma separated):</label>
              <textarea
                id="categories-input"
                value={categoriesText}
                onChange={(e) => setCategoriesText(e.target.value)}
                placeholder="Enter categories, separated by commas"
                className={styles.textarea}
                rows={4}
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button className={styles.cancelButton} onClick={() => setIsModalVisible(false)}>
              Cancel
            </button>
            <button
              className={styles.submitButton}
              onClick={handleUpdateSubmit}
              disabled={!selectedEntity || (!aboutText && !eligibilityText && !categoriesText)}
            >
              Update Information
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  )
}

export default UpdateMediaAttachment
