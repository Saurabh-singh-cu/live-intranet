"use client";

import React, { useCallback, useEffect, useState } from "react";
import { CgMail } from "react-icons/cg";
import styles from "../faculty/CommitteeCards.module.css";
import apiClient from "../config/apiClient";

// Member Card Component for better organization
const MemberCard = ({
  member,
  role,
  department,
  registrationName,
  profilePic,
}) => {
  const defaultProfileImage = "/placeholder.svg?height=100&width=100";

  // Determine badge color based on role
  const getBadgeClass = () => {
    switch (role.toLowerCase()) {
      case "faculty advisor":
        return styles.badgeBlue;
      case "faculty co-advisor":
        return styles.badgePurple;
      case "secretary":
        return styles.badgeGreen;
      case "joint secretary":
        return styles.badgeOrange;
      default:
        return styles.badgeGray;
    }
  };

  return (
    <div className={styles.committeeCard}>
      <div className={styles.cardHeader}>
        <div className={styles.profileImageWrapper}>
          <img
            src={profilePic || defaultProfileImage}
            alt={`${member} profile`}
            className={styles.profileImage}
          />
        </div>
        <span className={`${styles.roleBadge} ${getBadgeClass()}`}>{role}</span>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.memberName}>{member}</h3>
        <div className={styles.divider}></div>
        <p className={styles.memberDepartment}>{department}</p>
        <p className={styles.registrationName}>{registrationName}</p>

        <div className={styles.contactInfo}>
          <a
            href={`mailto:${member
              .toLowerCase()
              .replace(/\s/g, ".")}@example.com`}
            className={styles.emailLink}
          >
            <CgMail className={styles.emailIcon} />
            <span className={styles.emailText}>
              {member.toLowerCase().replace(/\s/g, ".")}@example.com
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

const CommitteeCardStudent = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commity, setCommity] = useState([]);
  const [regId, setRegId] = useState(null);

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
        console.error("Error fetching data:", error);
        setError("Failed to fetch committee data");
      } finally {
        setLoading(false);
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
        parsedData?.secretary_details?.map((item) => item.reg_id) || [];

      console.log("Extracted regIds:", regIds);

      if (regIds.length > 0) {
        setRegId(regIds);
      }
    }
  }, []);

  useEffect(() => {
    if (regId && regId.length > 0) {
      setLoading(true);
      grtCommitiData(regId);
    }
  }, [regId, grtCommitiData]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading committee data...</p>
      </div>
    );
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  return (
    <div className={styles.committeeContainer}>
      <div className={styles.headerSection}>
        <h2 className={styles.committeeHeading}>Core Committee Members</h2>
        <div className={styles.headerUnderline}></div>
        <p className={styles.committeeSubheading}>
          Meet the team behind our success
        </p>
      </div>

      <div className={styles.committeeContainer}>
        {commity &&
          commity.map((registration) => (
            <div key={registration.reg_id} className={styles.departmentSection}>
              {/* Department Name - Display once per department */}
              <h3 className={styles.departmentHeading}>
                {registration.dept_name}
              </h3>

              {/* Cards Container - Display all members horizontally */}
              <div className={styles.committeeCardsRow}>
                {/* Faculty Advisor Card */}
                <MemberCard
                  member={registration.faculty_advisory_name}
                  role="Faculty Advisor"
                  department={registration.dept_name}
                  registrationName={registration.registration_name}
                  profilePic={
                    registration.media_details?.faculty_advisory_profile_pic_url
                  }
                />

                {/* Faculty Co-Advisor Card */}
                <MemberCard
                  member={registration.faculty_co_advisory_name}
                  role="Faculty Co-Advisor"
                  department={registration.dept_name}
                  registrationName={registration.registration_name}
                  profilePic={
                    registration.media_details?.co_advisor_profile_pic_url
                  }
                />

                {/* Secretary Card */}
                <MemberCard
                  member={registration.Secretary_name}
                  role="Secretary"
                  department={registration.dept_name}
                  registrationName={registration.registration_name}
                  profilePic={
                    registration.media_details?.secretary_profile_pic_url
                  }
                />

                {/* Joint Secretary Card */}
                <MemberCard
                  member={registration.Joint_Secretary_name}
                  role="Joint Secretary"
                  department={registration.dept_name}
                  registrationName={registration.registration_name}
                  profilePic={
                    registration.media_details?.join_secretary_profile_pic_url
                  }
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CommitteeCardStudent;
