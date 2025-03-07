
"use client"

import React, { useEffect, useState } from "react"
import c3 from "../assets/images/c3.png"
import c4 from "../assets/images/c4.png"
import clg from "../assets/images/clg.jpg"

import "./EventCardsDash.css"
import { CgMail } from "react-icons/cg"
import EventCardEdit from "./EventCardEdit"
import { Button } from "antd"
import Swal from "sweetalert2"
import axios from "axios"
import RegisterModal from "./RegisterModal"
import apiClient from "../config/apiClient"
import user from "../assets/images/user.png"
import "./EventCardsDash.css";

const EventCardsDash = ({ commity }) => {
  const [editMember, setEditMember] = useState(null)
  const [userDetail, setUserDetail] = useState(null)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [currentEvent, setCurrentEvent] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [committeeMembers, setCommitteeMembers] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch registration data
  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        setLoading(true)

        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem("user") || "{}")

        // Check if faculty_advisory_details exists and has reg_id
        if (!userData.faculty_advisory_details || !userData.faculty_advisory_details.reg_id) {
          setError("No registration ID found in user data")
          setLoading(false)
          return
        }

        // Get the registration ID
        const regId = userData.faculty_advisory_details.reg_id

        // Fetch registration details using the API
        const response = await axios.get(`/entity-registration-detailed-page/?reg_id=${regId}`)

        if (response.data) {
          setRegistrations([response.data])
        } else {
          setError("No data returned from API")
        }
      } catch (error) {
        console.error("Error fetching registration data:", error)
        setError("Failed to fetch registration data")
      } finally {
        setLoading(false)
      }
    }

    fetchRegistrationData()
  }, [])

  // Fallback image for when profile pictures are not available
  const defaultProfileImage = user

  const selectedSociety = commity

  const previousEvents = [
    {
      title: "Brain Battle Season 2",
      image: clg,
    },
    {
      title: "Reverse CodingX",
      image: c3,
    },
    {
      title: "Tech Summit 2023",
      image: c4,
    },
  ]

  useEffect(() => {
    if (selectedSociety) {
      const members = [
        {
          name: selectedSociety.Secretary_name,
          position: "Secretary",
          image: user,
          email: selectedSociety.Secretary_email,
        },
        {
          name: selectedSociety.Joint_Secretary_name,
          position: "Joint Secretary",
          image: user,
          email: selectedSociety.Joint_Secretary_email,
        },
        {
          name: selectedSociety.faculty_advisory_name,
          position: "Faculty Advisor",
          image: user,
          email: selectedSociety.faculty_advisory_email,
        },
        {
          name: selectedSociety.faculty_co_advisory_name,
          position: "Faculty Co-Advisor",
          image: user,
          email: selectedSociety.faculty_co_advisory_email,
        },
      ]
      setCommitteeMembers(members)
    }
  }, [selectedSociety])

  const handleEdit = (member) => {
    setEditMember(member)
  }

  const handleCloseDrawer = () => {
    setEditMember(null)
  }

  const getRegId = () => {
    const userData = JSON.parse(localStorage.getItem("user"))
    return userData?.faculty_advisory_details?.reg_id || userData?.secretary_details?.reg_id
  }

  const getEvents = async () => {
    try {
      const reg_id = getRegId()
      const response = await apiClient.get(`published-events/${reg_id}/`)
      setCurrentEvent(response?.data)
      console.log(response, "RRRRR")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getEvents()
  }, [])

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post("api")
      if (response.ok) {
        setCommitteeMembers((prevMembers) =>
          prevMembers.map((member) => (member?.name === formData.name ? { ...member, ...formData } : member)),
        )
        Swal.fire({
          title: "Profile Updated!",
          icon: "success",
        })
        setEditMember(null)
      } else {
        Swal.fire({
          title: "Something Went Wrong",
          icon: "error",
        })
        console.log("error")
      }
    } catch (error) {
      console.log(error)
      Swal.fire({
        title: "Something Went Wrong",
        icon: "error",
      })
    }
  }

  useEffect(() => {
    const getuser = JSON.parse(localStorage.getItem("user"))
    console.log(getuser, "USER NAME")
    if (getuser && getuser.role_name === "Faculty Advisory") {
      setUserDetail(getuser)
    }
  }, [])

  const handleRegisterClick = (event) => {
    setSelectedEvent(event)
    setIsRegisterModalOpen(true)
  }

  return (
    <div className="events-container">
      <section className="events-section">
        <div className="section-header-detail">
          <h2>Ongoing Events</h2>
        </div>
        <div className="cards-grid">
          {currentEvent.map((event, index) => {
            const startDate = new Date(event.start_date)
            const endDate = new Date(event.end_date)
            const options = {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
            const formattedStartDate = startDate.toLocaleDateString(undefined, options)
            const formattedEndDate = endDate.toLocaleDateString(undefined, options)
            const daysLeft = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24))

            return (
              <div key={index} className="event-card">
                <img src={event.poster_url || "/placeholder.svg"} alt={event.event_name} className="event-image" />
                <div className="event-content">
                  <h3 className="event-title">{event.event_name}</h3>
                  <div className="event-dates">
                    <span>
                      {formattedStartDate} - {formattedEndDate}
                    </span>
                  </div>
                  <div className="event-stats">
                    <div className="stat">
                      <span className="stat-value">{event.limit === "0" ? "No Limit" : event.limit}</span>
                      <span className="stat-label">Spots Left</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{daysLeft}</span>
                      <span className="stat-label">Days Left</span>
                    </div>
                  </div>
                  <div className="event-duration">
                    <span>Duration: {event.duration} hours</span>
                  </div>
                  <button className="register-button-e" onClick={() => handleRegisterClick(event)}>
                    Register Now
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="events-section">
        <div className="section-header-detail">
          <h2>Previous Events</h2>
        </div>
        <div className="cards-grid">
          {previousEvents.map((event, index) => (
            <div key={index} className="event-card previous">
              <div className="event-image-container">
                <img src={event.image} alt={event.title} className="event-image" />
                <div className="event-title-overlay">
                  <h3>{event.title}</h3>
                  <p>Closed</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="events-section">
        <div className="section-header-detail">
          <h2>Core Committee</h2>
        </div>

        {loading ? (
          <div className="loading-container">Loading committee data...</div>
        ) : error ? (
          <div className="error-container">{error}</div>
        ) : (
          <div className="committee-cards-grid">
            {registrations.map((registration) => (
              <React.Fragment key={registration.reg_id}>
                {/* Secretary Card */}
                <div className="committee-card">
                  <div className="card-header">
                    <img
                      src={registration.media_details?.secretary_profile_pic_url || defaultProfileImage}
                      alt={`${registration.Secretary_name} profile`}
                      className="profile-image"
                    />
                  </div>
                  <div className="card-body">
                    <h3 className="member-name">{registration.Secretary_name}</h3>
                    <p className="member-position">Secretary</p>
                    <p className="member-department">{registration.dept_name}</p>
                    <p className="registration-name">{registration.registration_name}</p>
                    <div className="contact-info">
                      <a href={`mailto:${registration.Secretary_email}`} className="email-link">
                        <CgMail className="email-icon" />
                        <span className="email-text">{registration.Secretary_email}</span>
                      </a>
                    </div>
                    {userDetail && (
                      <Button
                        onClick={() =>
                          handleEdit({
                            name: registration.Secretary_name,
                            position: "Secretary",
                            email: registration.Secretary_email,
                          })
                        }
                        type="primary"
                        className="edit-button"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>

                {/* Joint Secretary Card */}
                <div className="committee-card">
                  <div className="card-header">
                    <img
                      src={registration.media_details?.join_secretary_profile_pic_url || defaultProfileImage}
                      alt={`${registration.Joint_Secretary_name} profile`}
                      className="profile-image"
                    />
                  </div>
                  <div className="card-body">
                    <h3 className="member-name">{registration.Joint_Secretary_name}</h3>
                    <p className="member-position">Joint Secretary</p>
                    <p className="member-department">{registration.dept_name}</p>
                    <p className="registration-name">{registration.registration_name}</p>
                    <div className="contact-info">
                      <a href={`mailto:${registration.Joint_Secretary_email}`} className="email-link">
                        <CgMail className="email-icon" />
                        <span className="email-text">{registration.Joint_Secretary_email}</span>
                      </a>
                    </div>
                    {userDetail && (
                      <Button
                        onClick={() =>
                          handleEdit({
                            name: registration.Joint_Secretary_name,
                            position: "Joint Secretary",
                            email: registration.Joint_Secretary_email,
                          })
                        }
                        type="primary"
                        className="edit-button"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>

                {/* Faculty Advisory Card */}
                <div className="committee-card">
                  <div className="card-header">
                    <img
                      src={registration.media_details?.faculty_advisory_profile_pic_url || defaultProfileImage}
                      alt={`${registration.faculty_advisory_name} profile`}
                      className="profile-image"
                    />
                  </div>
                  <div className="card-body">
                    <h3 className="member-name">{registration.faculty_advisory_name}</h3>
                    <p className="member-position">Faculty Advisor</p>
                    <p className="member-department">{registration.dept_name}</p>
                    <p className="registration-name">{registration.registration_name}</p>
                    <div className="contact-info">
                      <a href={`mailto:${registration.faculty_advisory_email}`} className="email-link">
                        <CgMail className="email-icon" />
                        <span className="email-text">{registration.faculty_advisory_email}</span>
                      </a>
                    </div>
                    {userDetail && (
                      <Button
                        onClick={() =>
                          handleEdit({
                            name: registration.faculty_advisory_name,
                            position: "Faculty Advisor",
                            email: registration.faculty_advisory_email,
                          })
                        }
                        type="primary"
                        className="edit-button"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>

                {/* Faculty Co-Advisory Card */}
                <div className="committee-card">
                  <div className="card-header">
                    <img
                      src={registration.media_details?.co_advisor_profile_pic_url || defaultProfileImage}
                      alt={`${registration.faculty_co_advisory_name} profile`}
                      className="profile-image"
                    />
                  </div>
                  <div className="card-body">
                    <h3 className="member-name">{registration.faculty_co_advisory_name}</h3>
                    <p className="member-position">Faculty Co-Advisor</p>
                    <p className="member-department">{registration.dept_name}</p>
                    <p className="registration-name">{registration.registration_name}</p>
                    <div className="contact-info">
                      <a href={`mailto:${registration.faculty_co_advisory_email}`} className="email-link">
                        <CgMail className="email-icon" />
                        <span className="email-text">{registration.faculty_co_advisory_email}</span>
                      </a>
                    </div>
                    {userDetail && (
                      <Button
                        onClick={() =>
                          handleEdit({
                            name: registration.faculty_co_advisory_name,
                            position: "Faculty Co-Advisor",
                            email: registration.faculty_co_advisory_email,
                          })
                        }
                        type="primary"
                        className="edit-button"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </section>

      {editMember && (
        <EventCardEdit visible={!!editMember} onClose={handleCloseDrawer} member={editMember} onSubmit={handleSubmit} />
      )}

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => {
          setIsRegisterModalOpen(false)
          setSelectedEvent(null)
        }}
        eventId={selectedEvent?.er_id}
        eventName={selectedEvent?.event_name}
        posterUrl={selectedEvent?.poster_url}
      />
    </div>
  )
}

export default EventCardsDash

