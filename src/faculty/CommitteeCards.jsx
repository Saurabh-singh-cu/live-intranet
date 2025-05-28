"use client"

import { useCallback, useEffect, useState } from "react"
import { CgMail } from "react-icons/cg"
import styles from "./CommitteeCards.module.css"
import apiClient from "../config/apiClient"

const MemberCard = ({ member, role, department, registrationName, profilePic, email }) => {
  const defaultProfileImage = "/placeholder.svg?height=100&width=100"

  const getBadgeClass = () => {
    switch (role.toLowerCase()) {
      case "faculty advisor":
        return styles.badgeBlue
      case "faculty co-advisor":
        return styles.badgePurple
      case "secretary":
        return styles.badgeGreen
      case "joint secretary":
        return styles.badgeOrange
      default:
        return styles.badgeGray
    }
  }

  return (
    <div className={styles.committeeCard}>
      <div className={styles.cardInner}>
        <div className={styles.cardTop}>
          <div className={styles.profileImageContainer}>
            <img src={profilePic || defaultProfileImage} alt={member} className={styles.profileImage} />
          </div>
          <div className={`${styles.roleBadge} ${getBadgeClass()}`}>{role}</div>
        </div>
        <div className={styles.cardContent}>
          <h3 className={styles.memberName}>{member}</h3>
          <p className={styles.memberDepartment}>{department}</p>
          <p className={styles.registrationName}>{registrationName}</p>

          {email && (
            <a href={`mailto:${email}`} className={styles.emailLink}>
              <CgMail className={styles.emailIcon} />
              <span className={styles.emailText}>{email}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

const CommitteeCards = () => {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [commity, setCommity] = useState([])
  const [regId, setRegId] = useState(null)

  const grtCommitiData = useCallback(
    async (regIds) => {
      try {
        if (!regIds || regIds.length === 0) return

        const allCommityMember = []
        for (const regId of regIds) {
          console.log(`Fetching data for reg_id: ${regId}`)

          const response = await apiClient.get(`entity-registration-detailed-page/?reg_id=${regId}`)

          if (response?.data) {
            allCommityMember.push(response.data)
          }
        }

        if (JSON.stringify(allCommityMember) !== JSON.stringify(commity)) {
          setCommity(allCommityMember)
        }

        console.log(allCommityMember, "[commityMember]")
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to fetch committee data")
      } finally {
        setLoading(false)
      }
    },
    [commity],
  )

  useEffect(() => {
    const storedData = localStorage.getItem("user")
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      console.log("Parsed LocalStorage Data:", parsedData)

      const regIds = parsedData?.faculty_advisory_details?.map((item) => item.reg_id) || []

      console.log("Extracted regIds:", regIds)

      if (regIds.length > 0) {
        setRegId(regIds)
      }
    }
  }, [])

  useEffect(() => {
    if (regId && regId.length > 0) {
      setLoading(true)
      grtCommitiData(regId)
    }
  }, [regId, grtCommitiData])

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading committee data...</p>
      </div>
    )
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.committeeContainer}>
        <div className={styles.headerSection}>
          <h2 className={styles.committeeHeading}>Core Committee Members</h2>
          <p className={styles.committeeSubheading}>Meet the team behind our success</p>
        </div>

        {commity &&
          commity.map((registration) => (
            <div key={registration.reg_id} className={styles.departmentSection}>
              <h3 className={styles.departmentHeading}>{registration.dept_name}</h3>

              <div className={styles.cardsContainer}>
                <MemberCard
                  member={registration.faculty_advisory_name}
                  role="Faculty Advisor"
                  department={registration.dept_name}
                  registrationName={registration.registration_name}
                  profilePic={registration.media_details?.faculty_advisory_profile_pic_url}
                  email={registration.faculty_advisory_email}
                />

                <MemberCard
                  member={registration.faculty_co_advisory_name}
                  role="Faculty Co-Advisor"
                  department={registration.dept_name}
                  registrationName={registration.registration_name}
                  profilePic={registration.media_details?.co_advisor_profile_pic_url}
                  email={registration.faculty_co_advisory_email}
                />

                <MemberCard
                  member={registration.Secretary_name}
                  role="Secretary"
                  department={registration.dept_name}
                  registrationName={registration.registration_name}
                  profilePic={registration.media_details?.secretary_profile_pic_url}
                  email={registration.Secretary_email}
                />

                <MemberCard
                  member={registration.Joint_Secretary_name}
                  role="Joint Secretary"
                  department={registration.dept_name}
                  registrationName={registration.registration_name}
                  profilePic={registration.media_details?.join_secretary_profile_pic_url}
                  email={registration.Joint_Secretary_email}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default CommitteeCards

