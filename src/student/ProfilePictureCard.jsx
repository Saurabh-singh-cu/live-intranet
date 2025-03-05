import React, { useState, useRef, useEffect } from "react";
import apiClient from "../config/apiClient";
import "./ProfilePictureCard.css";

const ProfilePictureCards = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedEntity, setSelectedEntity] = useState("");
  const [availableEntities, setAvailableEntities] = useState([]);
  const imageRef = useRef(null);

  // Role configurations
  const roles = [
    {
      id: "secretary",
      title: "Secretary",
      api: "/update_secretary_profile_pic/",
      payload: "temp_secretary_profile_pic",
      color: "#4CAF50"
    },
    {
      id: "joint_secretary",
      title: "Joint Secretary",
      api: "/update_joint_secretary_profile_pic/",
      payload: "temp_join_secretary_profile_pic",
      color: "#2196F3"
    },
    {
      id: "faculty_advisor",
      title: "Faculty Advisor",
      api: "/update_faculty_advisor_profile_pic/",
      payload: "temp_faculty_advisory_profile_pic",
      color: "#FF9800"
    },
    {
      id: "co_advisor",
      title: "Co-Advisor",
      api: "/update_co_advisor_profile_pic/",
      payload: "temp_co_advisor_profile_pic",
      color: "#E91E63"
    }
  ];

  useEffect(() => {
    // Fetch available entities from localStorage or API
    const getuser = JSON.parse(localStorage.getItem("user"));
    if (getuser && getuser.secretary_details && getuser.secretary_details.length > 0) {
      const entities = getuser.secretary_details.map((entity) => ({
        value: entity.reg_id,
        label: entity.entity_name || entity.registration_name,
      }));
      setAvailableEntities(entities);
    }
  }, []);

  const openModal = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
    setSelectedImage(null);
    setPreviewUrl(null);
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e) => {
    if (!previewUrl) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging && previewUrl) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleSubmit = async () => {
    if (!selectedImage || !selectedRole || !selectedEntity) {
      alert("Please select an image, role, and entity");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append(selectedRole.payload, selectedImage);
      formData.append("reg_id", selectedEntity); // Include reg_id in the payload
  
      // Make API call without reg_id in query parameters
      const response = await apiClient.post(
        selectedRole.api,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 200 || response.status === 201) {
        alert(`${selectedRole.title} profile picture updated successfully!`);
        closeModal();
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error(`Error updating ${selectedRole.title} profile picture:`, error);
      alert(`Failed to update ${selectedRole.title} profile picture. Please try again.`);
    }
  };

  return (
    <div className="profile-cards-container">
      <h2 className="profile-cards-title">Update Profile Pictures</h2>
      <div className="profile-cards-grid">
        {roles.map((role) => (
          <div 
            key={role.id} 
            className="profile-card"
            style={{ borderTop: `4px solid ${role.color}` }}
            onClick={() => openModal(role)}
          >
            <div className="profile-card-icon" style={{ color: role.color }}>
              <i className="profile-icon"></i>
            </div>
            <h3>{role.title}</h3>
            <p>Update profile picture for {role.title}</p>
          </div>
        ))}
      </div>

      {isModalOpen && selectedRole && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <div className="profile-modal-header">
              <h2>Update {selectedRole.title} Profile Picture</h2>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>
            
            <div className="profile-modal-content">
              <div className="entity-selector">
                <label htmlFor="entity-select">Select Entity:</label>
                <select
                  id="entity-select"
                  value={selectedEntity}
                  onChange={(e) => setSelectedEntity(e.target.value)}
                  className="entity-select"
                >
                  <option value="">Select an entity</option>
                  {availableEntities.map((entity) => (
                    <option key={entity.value} value={entity.value}>
                      {entity.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="upload-section">
                <label htmlFor="profile-image" className="upload-label">
                  Select Image
                  <input
                    type="file"
                    id="profile-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                </label>
                <p className="upload-hint">Only JPG, PNG, GIF, and WebP images are allowed</p>
              </div>

              {previewUrl && (
                <div className="preview-container">
                  <div className="preview-controls">
                    <button onClick={handleZoomIn} className="zoom-button">+</button>
                    <button onClick={handleZoomOut} className="zoom-button">-</button>
                  </div>
                  
                  <div 
                    className="preview-frame"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <div className="preview-circle">
                      <img
                        ref={imageRef}
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="preview-image"
                        style={{
                          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                          cursor: isDragging ? 'grabbing' : 'grab'
                        }}
                      />
                    </div>
                  </div>
                  <p className="preview-hint">Drag to position and use + / - to zoom</p>
                </div>
              )}
            </div>
            
            <div className="profile-modal-footer">
              <button onClick={closeModal} className="cancel-button">Cancel</button>
              <button 
                onClick={handleSubmit} 
                className="submit-button"
                disabled={!selectedImage || !selectedEntity}
              >
                Update Profile Picture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureCards;
