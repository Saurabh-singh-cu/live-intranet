import React, { useEffect, useState, useCallback } from "react";

import "./FacultyDashboard.css";
import axios from "axios";
import { Tag } from "antd";
import { Heart, Share2, Users } from "lucide-react";
import EventCardsDash from "../pages/EventCardsDash";
import cc1 from "../assets/images/c3.png";
import bannerclub from "../assets/images/bannerclub.jpg";
import apiClient from "../config/apiClient";
import CommitteeCards from "./CommitteeCards";

const FacultyDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [regId, setRegId] = useState(null);
  const [mediaData, setMediaData] = useState(null);
  const [commity, setCommity] = useState([]);
  const [userName, setUserName] = useState([]);
  const [availableEntities, setAvailableEntities] = useState([]);

  const categories = [
    { name: "Debate ", color: "#3498db" },
    { name: "Public Speaking", color: "#e74c3c" },
    { name: "Writing and Editing", color: "#2ecc71" },
    { name: "Leadership", color: "#f39c12" },
    { name: "Creative Expression", color: "#9b59b6" },
  ];

  useEffect(() => {
    if (regId) {
      approvedMedia(regId);
    }
  }, [regId]);

  const approvedMedia = async (regId) => {
    try {
      const fetch = await apiClient.get(`entity_media_approved/${regId}/`);
      const media = fetch?.data?.length > 0 ? fetch.data[0] : {}; // Ensure it doesn't break if empty
      setMediaData(media);
      console.log(media, "FETCH MEDIA");
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  useEffect(() => {
    if (regId && regId.length > 0) {
      grtCommitiData(regId);
    }
  }, [regId]);

  useEffect(() => {
    const getuser = JSON.parse(localStorage.getItem("user"));
    setUserName(getuser);
    console.log(getuser, "USER NAME");
    // Check if the user is a Student Secretary
    if (getuser && getuser.role_name === "Faculty Advisory") {
      setUserDetails(getuser);

      // If user is a Student Secretary, prepare available entities for selection
      if (
        getuser.faculty_advisory_details &&
        getuser.faculty_advisory_details.length > 0
      ) {
        const entities = getuser.faculty_advisory_details.map((entity) => ({
          value: entity.reg_id,
          label: entity.entity_name || entity.registration_name,
        }));
        setAvailableEntities(entities);
      }
    }
  }, []);

  const grtCommitiData = useCallback(
    async (regIds) => {
      try {
        if (!regIds || regIds.length === 0) return; // Prevent empty calls

        const allCommityMember = [];
        for (const regId of regIds) {
          console.log(`Fetching data for reg_id: ${regId}`);

          const response = await apiClient.get(
            `entity-registration-detailed-page/?reg_id=${regId}`
          );

          if (response?.data) {
            allCommityMember.push(response.data);
          }
        }

        if (JSON.stringify(allCommityMember) !== JSON.stringify(commity)) {
          setCommity(allCommityMember); // Only update if data is different
        }

        console.log(allCommityMember, "[commityMember]");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [commity]
  ); // Dependency added to avoid unnecessary re-fetches

  useEffect(() => {
    const storedData = localStorage.getItem("user"); // Replace with actual key
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log("Parsed LocalStorage Data:", parsedData);

      // Extract reg_id array from secretary_details
      const regIds =
        parsedData?.faculty_advisory_details?.map((item) => item.reg_id) || [];

      console.log("Extracted regIds:", regIds); // Debugging

      if (regIds.length > 0) {
        setRegId(regIds); // Set the state with extracted reg_id array
      }
    }
  }, []);

  return (
    <>
      <div style={{ height: "100vh", overflow: "scroll" }}>
        <div
          style={{ paddingRight: "2rem", paddingTop: "5rem" }}
          className="secretary-info-container"
        >
          <div className="secretary-info">
            <div className="secretary-header">
              <h2>Welcome, {userDetails?.user_name}!</h2>
              <span className="role-badge">{userDetails?.role_name}</span>
            </div>

            {userDetails?.faculty_advisory_details?.map((detail, index) => (
              <div key={index} className="secretary-details">
                <div className="detail-item">
                  <span className="detail-label">Entity:</span>
                  <span className="detail-value">{detail.entity_name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Registration Name:</span>
                  <span className="detail-value">
                    {detail.registration_name}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Department:</span>
                  <span className="detail-value">{detail.department}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Members:</span>
                  <span className="detail-value">230</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "-27px" }} className="club-details-page">
          <div
            className="hero-section"
            style={{
              backgroundImage: `url(${mediaData?.banner_url})`,
              height: "250px",
              justifyContent: "space-between",
              display: "flex",
            }}
          >
            <div className="hero-content">
              <h1 className="hero-title">
                {userDetails?.faculty_advisory_details?.registration_name}
              </h1>
              <div className="hero-tagline"></div>
              <p className="hero-subtitle"> </p>
            </div>
            <div> </div>
            <div className="hero-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>

          {/* Details Section */}
          <div className="details-container">
            <div className="details-content">
              <div className="program-header">
                <img
                  src={mediaData?.logo_url}
                  alt="Program Logo"
                  className="program-logo"
                />

                <div className="program-info">
                  <h2>
                    {userDetails?.faculty_advisory_details?.registration_name}
                  </h2>
                  <div className="program-meta">
                    <span className="online-badge">
                      {" "}
                      Registered: {new Date().toLocaleDateString()}
                    </span>
                    <span className="tag">
                      Code :{" "}
                      {userDetails?.faculty_advisory_details?.registration_code}
                    </span>
                  </div>
                </div>
              </div>

              <div className="prize-section">
                <div className="prize-details">
                  <div style={{ display: "flex" }} className="prize-label">
                    Connecting All Circles is a vibrant community dedicated to
                    igniting creativity and encouraging exploration among
                    students.
                  </div>
                </div>
              </div>

              <div className="category-tags-container">
                <h3 className="category-tags-title">
                  <Tag className="category-icon" />
                  Categories{" "}
                </h3>

                <div className="category-tags">
                  {categories.map((category, index) => (
                    <span
                      key={index}
                      className="category"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="details-sidebar">
              <div className="price-section">
                <span style={{ cursor: "no-drop" }} className="price-1">
                  ₹ 100/-
                </span>

                <div className="action-buttons">
                  <button className="like-button">
                    <Heart />
                  </button>
                  <button className="share-button">
                    <Share2 />
                  </button>
                </div>
              </div>

              <button style={{ display: "none" }} className="register-button">
                Join as a New Member
              </button>

              <div className="stats-list">
                <div className="stat-item">
                  <Users className="stat-icon" />
                  <div className="stat-details">
                    <span className="stat-label">Member Registered</span>
                    <span className="stat-value">230</span>
                  </div>
                </div>
              </div>

              <div className="eligibility-section">
                <h3>Eligibility</h3>
                <p>Open for any Disciplane Students.</p>
              </div>
            </div>
          </div>

          <CommitteeCards />
        </div>
      </div>
    </>
  );
};

export default FacultyDashboard;
