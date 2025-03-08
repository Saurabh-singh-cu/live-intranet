import React, { useEffect, useState, useCallback } from "react";

import "./FacultyDashboard.css";

import apiClient from "../config/apiClient";
import CommitteeCards from "./CommitteeCards";

const FacultyDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [regId, setRegId] = useState(null);
  const [mediaData, setMediaData] = useState(null);
  const [commity, setCommity] = useState([]);
  const [userName, setUserName] = useState([]);
  const [availableEntities, setAvailableEntities] = useState([]);



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
              <span className="role-badge1">{userName?.role_name}</span>
            </div>

            {userDetails?.faculty_advisory_details?.map((detail, index) => (
              <div key={index} className="secretary-details">
                <div className="detail-item">
                  <span className="detail-label">Entity:</span>
                  <span className="detail-value">{detail.entity_name}</span>
                </div>
                <div className="detail-item">
                      <span className="detail-label">Registration Code:</span>
                      <span className="detail-value">{detail?.registration_code}</span>
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
                {/* <div className="detail-item">
                  <span className="detail-label">Members:</span>
                  <span className="detail-value">{detail.membership_count}</span>
                </div> */}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "-27px" }} className="club-details-page-1">
      


          <div className="faculty-committee-container">
          <CommitteeCards />
          </div>
        </div>
      </div>
    </>
  );
};

export default FacultyDashboard;
