import React, { useEffect, useState, useCallback } from "react";
import styles from "./FacultyDashboard.module.css";
import apiClient from "../config/apiClient";
import CommitteeCards from "./CommitteeCards";
import ActivityPieChartFac from "./ActivityPieChartFac";
import ActivityBarGraphFac from "./ActivityBarGraphFac";

const FacultyDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [regId, setRegId] = useState(null);
  const [mediaData, setMediaData] = useState(null);
  const [commity, setCommity] = useState([]);
  const [userName, setUserName] = useState([]);
  const [availableEntities, setAvailableEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mediaLoading, setMediaLoading] = useState(false);



  useEffect(() => {
    if (regId && regId.length > 0) {
      grtCommitiData(regId);
    }
  }, [regId]);

  useEffect(() => {
    const initializeUser = () => {
      try {
        const getuser = JSON.parse(localStorage.getItem("user"));
        setUserName(getuser);
        console.log(getuser, "USER NAME");
        
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
      } catch (error) {
        console.error("Error parsing user data:", error);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  const grtCommitiData = useCallback(
    async (regIds) => {
      try {
        if (!regIds || regIds.length === 0) return;

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
          setCommity(allCommityMember);
        }

        console.log(allCommityMember, "[commityMember]");
      } catch (error) {
        console.error("Error fetching committee data:", error);
        setError("Failed to fetch committee data");
      }
    },
    [commity]
  );

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log("Parsed LocalStorage Data:", parsedData);

      const regIds =
        parsedData?.faculty_advisory_details?.map((item) => item.reg_id) || [];

      console.log("Extracted regIds:", regIds);

      if (regIds.length > 0) {
        setRegId(regIds);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.dashboardContainer}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.welcomeCard}>
            <div className={styles.welcomeHeader}>
              <div className={styles.welcomeContent}>
                <h1 className={styles.welcomeTitle}>
                  Welcome back, {userDetails?.user_name}!
                </h1>
                <span className={styles.roleBadge}>
                  {userName?.role_name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Faculty Details Section */}
        <div className={styles.detailsSection}>
         
          <div className={styles.entitiesGrid}>
            {userDetails?.faculty_advisory_details?.map((detail, index) => (
              <div key={index} className={styles.entityCard}>
                <div className={styles.entityHeader}>
                  <h3 className={styles.entityName}>{detail.entity_name}</h3>
                  <div className={styles.entityBadge}>Entity {index + 1}</div>
                </div>
                
                <div className={styles.entityDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Registration Code</span>
                    <span className={styles.detailValue}>
                      {detail?.registration_code || 'N/A'}
                    </span>
                  </div>
                  
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Registration Name</span>
                    <span className={styles.detailValue} title={detail.registration_name}>
                      {detail.registration_name}
                    </span>
                  </div>
                  
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Department</span>
                    <span className={styles.detailValue} title={detail.department}>
                      {detail.department}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

         <div className={styles.chartsContainer}>
                <div className={styles.chartRow}>
                  <ActivityPieChartFac />
                  <ActivityBarGraphFac />
                </div>
              
          </div>

        {/* Committee Section */}
        <div className={styles.committeeSection}>
          <div className={styles.committeeSectionHeader}>
            <h2 className={styles.sectionTitle}>Committee Overview</h2>
            {mediaLoading && (
              <div className={styles.mediaLoadingIndicator}>
                <div className={styles.smallSpinner}></div>
                <span>Loading media...</span>
              </div>
            )}
          </div>

          
            
          
          <div className={styles.committeeContainer}>
            <CommitteeCards />

          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
