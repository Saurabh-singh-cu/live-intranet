// ProposedCalendarCoord.jsx
import React, { useState, useEffect } from "react";
import styles from "./ProposedCalendarCoord.module.css";
import apiClient from "../config/apiClient";
import LoadingComponent from "../loader/LoadingComponent";



const Card = ({ data, isActive, onClick }) => (
  <div
    className={`${styles.card} ${isActive ? styles.active : ""}`}
    onClick={onClick}
  >
    <h3 className={styles.cardTitle}>{data.registeration_name}</h3>
  </div>
);

const Details = ({ data }) => (
  <div className={styles.detailsContainer}>
    <h2 className={styles.detailsTitle}>{data?.registeration_name || "N/A"}</h2>
    
    <div className={styles.detailsOneLine}>
      <div className={styles.detailsSection}>
        <p><strong>Entity:</strong> {data?.entity || "N/A"}</p>
        <p><strong>Department:</strong> {data?.department || "N/A"}</p>
      </div>
      <div className={styles.detailsSection}>
        <h4>Remark</h4>
        <p>{data?.remark || "No Remark Found!"}</p>
      </div>
    </div>

    <div className={styles.detailsOneLine}>
      <div className={styles.detailsSection}>
        <h4>Faculty Advisory</h4>
        <p>{data?.faculty_advisory_name || "N/A"}</p>
        <p>{data?.faculty_advisory_email || ""}</p>
        <p>{data?.faculty_advisory_empcode || ""}</p>
        <p>{data?.faculty_advisory_mobile || ""}</p>
      </div>
      <div className={styles.detailsSection}>
        <h4>Faculty Co-Advisory</h4>
        <p>{data?.faculty_co_advisory_name || "N/A"}</p>
        <p>{data?.faculty_co_advisory_email || ""}</p>
        <p>{data?.faculty_co_advisory_empcode || ""}</p>
        <p>{data?.faculty_co_advisory_mobile || ""}</p>
      </div>
    </div>

    <div className={styles.detailsOneLine}>
      <div className={styles.detailsSection}>
        <h4>Secretary</h4>
        <p>{data?.Secretary_name || "N/A"}</p>
        <p>{data?.Secretary_email || ""}</p>
        <p>{data?.Secretary_mobile || ""}</p>
      </div>
      <div className={styles.detailsSection}>
        <h4>Joint Secretary</h4>
        <p>{data?.Joint_Secretary_name || "N/A"}</p>
        <p>{data?.Joint_Secretary_email || ""}</p>
        <p>{data?.Joint_Secretary_mobile || ""}</p>
      </div>
    </div>
  </div>
);


const ProposedCalendarCoord = () => {
  const [registrationDetails, setRegistrationDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentId = localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user")).department_id
          : "";
        const response = await apiClient.get(
          `entity-proposed-details/${departmentId}/`
        );
        setRegistrationDetails(response?.data?.registration_details);
        setActiveCard(response?.data?.registration_details[0]?.reg_id);
        setLoading(false);
      } catch (error) {
        setError("Error fetching data or Session Expired. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterEntities = [
    "ALL",
    "CLUB",
    "DEPARTMENT",
    "PROFESSIONAL SOCIETY",
    "COMMUNITY",
  ];

  const filteredDetails =
    activeFilter === "ALL"
      ? registrationDetails
      : registrationDetails.filter((detail) => detail.entity === activeFilter);

  if (loading) return <LoadingComponent />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <h1 className={styles.title}>Proposed Calendar Coordination</h1>
        <div className={styles.filterContainer}>
          {filterEntities.map((entity) => (
            <button
              key={entity}
              className={`${styles.filterButton} ${
                activeFilter === entity ? styles.active : ""
              }`}
              onClick={() => setActiveFilter(entity)}
            >
              {entity}
            </button>
          ))}
          <button className={styles.filterButton}>
            TOTAL : {registrationDetails?.length}
          </button>
        </div>
        {filteredDetails.map((detail) => (
          <Card
            key={detail.reg_id}
            data={detail}
            isActive={activeCard === detail.reg_id}
            onClick={() => setActiveCard(detail.reg_id)}
          />
        ))}
      </div>
      <div className={styles.rightColumn}>
        {activeCard && (
          <Details
            data={registrationDetails.find((detail) => detail.reg_id === activeCard)}
          />
        )}
      </div>
    </div>
  );
};

export default ProposedCalendarCoord;
