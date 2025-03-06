"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Share2, Users, Clock, Tag } from 'lucide-react'
import { MdOutlineArrowBack } from "react-icons/md"
import { FaLinkedinIn } from "react-icons/fa6"
import { CgMail } from "react-icons/cg"
import { Button } from "antd"
import Swal from "sweetalert2"
import axios from "axios"
import Scroller from "../components/Scroller"
import EventCardEdit from "./EventCardEdit"
import RegisterModal from "./RegisterModal"
import apiClient from "../config/apiClient"
import "./JoinNowDetail.css"

const JoinNowDetail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [mediaData, setMediaData] = useState(null)
  const [societies, setSocieties] = useState([])
  const [editMember, setEditMember] = useState(null)
  const [userDetail, setUserDetail] = useState(null)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [currentEvent, setCurrentEvent] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)

  // Add state for event navigation
  const [currentEventPage, setCurrentEventPage] = useState(0)
  const [previousEventPage, setPreviousEventPage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const entity_id = location.state || []
  const selectedSociety = location.state.society
  const reg_id1 = selectedSociety?.reg_id

  const [isFacultyAdvisory, setIsFacultyAdvisory] = useState(false);

  useEffect(() => {
    const getuser = JSON.parse(localStorage.getItem("user"));
    setIsFacultyAdvisory(getuser && getuser.role_name === "Faculty Advisory");
  }, []);

  const approvedMedia = async () => {
    if (!selectedSociety || !selectedSociety.reg_id) {
      console.error("No reg_id available")
      return
    }

    try {
      const response = await apiClient.get(`entity_media_approved/${selectedSociety.reg_id}/`)
      setMediaData(response.data[0])
      console.log(response.data[0], "FETCH MEDIA")
    } catch (error) {
      console.error("Error fetching approved media:", error)
    }
  }

  const fetchSocieties = async () => {
    try {
      const response = await apiClient.get(`entity-registration-summary/?entity_id=${entity_id?.entity_id}`)
      setSocieties(response.data)
      console.log(response.data, "Fetched Societies")
    } catch (error) {
      console.error("Error fetching societies:", error)
    }
  }

  useEffect(() => {
    if (selectedSociety && selectedSociety.reg_id) {
      approvedMedia()
      console.log(selectedSociety.reg_id, "Society Reg ID")
    }
    fetchSocieties()
  }, [selectedSociety, selectedSociety.reg_id])

  useEffect(() => {
    fetchSocieties()
  }, [entity_id?.entity_id])

  if (!selectedSociety) {
    return <div>No society data available</div>
  }

  const handleBack = () => {
    navigate(-1)
  }

  const categories = [
    { name: "Debate", color: "#6b7280" },
    { name: "Public Speaking", color: "#4b6bdd" },
    { name: "Writing and Editing", color: "#3e9d78" },
    { name: "Leadership", color: "#e09c4b" },
    { name: "Creative Expression", color: "#8667d0" },
  ]

  const previousEvents = [
    {
      title: "Brain Battle Season 2",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Reverse CodingX",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Tech Summit 2023",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const [committeeMembers, setCommitteeMembers] = useState([])

  useEffect(() => {
    if (selectedSociety) {
      const members = [
        {
          name: selectedSociety.Secretary_name,
          position: "Secretary",
          image: selectedSociety.media_details?.secretary_profile_pic_url || "/placeholder.svg?height=100&width=100",
          email: selectedSociety.Secretary_email,
        },
        {
          name: selectedSociety.Joint_Secretary_name,
          position: "Joint Secretary",
          image:
            selectedSociety.media_details?.join_secretary_profile_pic_url || "/placeholder.svg?height=100&width=100",
          email: selectedSociety.Joint_Secretary_email,
        },
        {
          name: selectedSociety.faculty_advisory_name,
          position: "Faculty Advisor",
          image:
            selectedSociety.media_details?.faculty_advisory_profile_pic_url || "/placeholder.svg?height=100&width=100",
          email: selectedSociety.faculty_advisory_email,
        },
        {
          name: selectedSociety.faculty_co_advisory_name,
          position: "Faculty Co-Advisor",
          image: selectedSociety.media_details?.co_advisor_profile_pic_url || "/placeholder.svg?height=100&width=100",
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

  // helper function
  const getEffectiveRegId = (reg_id1) => {
    const userData = JSON.parse(localStorage?.getItem("user"))
    if (userData) {
      return userData?.faculty_advisory_details?.reg_id || userData?.secretary_details?.reg_id
    }
    return reg_id1
  }

  const getEvents = async () => {
    try {
      const reg_id = getEffectiveRegId(reg_id1)
      const response = await apiClient.get(`published-events/${reg_id}/`)
      setCurrentEvent(response?.data)
      console.log(response, "RRRRR")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getEvents()
  }, [reg_id1, selectedSociety?.reg_id])

  useEffect(() => {
    if (selectedSociety && selectedSociety.reg_id) {
      approvedMedia()
    }
  }, [selectedSociety?.reg_id, selectedSociety])

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

  const handleRegisterClick = (event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  // Add event navigation handlers
  const nextCurrentEvents = () => {
    if ((currentEventPage + 1) * 3 < currentEvent.length) {
      setCurrentEventPage(currentEventPage + 1)
    }
  }

  const prevCurrentEvents = () => {
    if (currentEventPage > 0) {
      setCurrentEventPage(currentEventPage - 1)
    }
  }

  const nextPreviousEvents = () => {
    if ((previousEventPage + 1) * 3 < previousEvents.length) {
      setPreviousEventPage(previousEventPage + 1)
    }
  }

  const prevPreviousEvents = () => {
    if (previousEventPage > 0) {
      setPreviousEventPage(previousEventPage - 1)
    }
  }

  return (
    <div className="club-details-page">
      <div className="hero-section" style={{ backgroundImage: `url(${mediaData?.banner_url})` }}>
        <div className="hero-content">
          <h1 className="hero-title">{selectedSociety.registration_name}</h1>
          <div className="hero-tagline">
            <span>Nurturing</span> Excellence,
            <br />
            Strengthening <span>Talent.</span>
          </div>
          <p className="hero-subtitle">Owner : {selectedSociety.dept_name}</p>
        </div>
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Details Section */}
      <div className="back-button-joinnow">
        <button onClick={handleBack}>
          <MdOutlineArrowBack />
          Back
        </button>
      </div>
      <div className="details-container">
        <div className="details-content">
          <div className="program-header">
            <img src={mediaData?.logo_url || "/placeholder.svg"} alt="Program Logo" className="program-logo" />
            <div className="program-info">
              <h2>{selectedSociety.registration_name}</h2>
              <div className="program-meta">
                <span className="online-badge"> Registered: {new Date().toLocaleDateString()}</span>
                <span className="tag">Code : {selectedSociety.registration_code}</span>
              </div>
            </div>
          </div>

          <div className="prize-section">
            <div className="prize-details">
              <div className="prize-label">
                {selectedSociety.about ? selectedSociety.about.replace(/<\/?[^>]+(>|$)/g, "") : "No description available."}
              </div>
            </div>
          </div>

          <div className="category-tags-container">
            <h3 className="category-tags-title">
              <Tag className="category-icon" />
              Categories
            </h3>
            <div className="category-tags">
              {selectedSociety.categories && selectedSociety.categories.split(',').map((category, index) => {
                const colors = ["#6b7280", "#4b6bdd", "#3e9d78", "#e09c4b", "#8667d0"];
                return (
                  <span
                    key={index}
                    className="category"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  >
                    {category.trim()}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="details-sidebar">
          <div className="price-section">
            <span className="price-1">₹ {selectedSociety?.fee}</span>
            <div className="action-buttons">
              <button className="share-button">
                <Share2 />
              </button>
            </div>
          </div>

          <button
            onClick={() =>
              navigate("/join-now", {
                state: { society: location?.state?.society },
              })
            }
            className="register-button"
          >
            Join as a New Member
          </button>

          <div className="stats-list">
            <div className="stat-item">
              <Users className="stat-icon" />
              <div className="stat-details">
                <span className="stat-label">Members Registered</span>
                <span className="stat-value">{selectedSociety.membership_count || 0}</span>
              </div>
            </div>
          </div>

          <div className="eligibility-section">
            <h3>Eligibility</h3>
            <p>{selectedSociety.eligibility ? selectedSociety.eligibility.replace(/<\/?[^>]+(>|$)/g, "") : "Open for any Discipline Students."}</p>
          </div>
        </div>
      </div>

      <div className="events-container">
        <section className="events-section">
  <div className="section-header">
    <h2>Ongoing Events</h2>
    <div className="section-underline"></div>
  </div>
  <div className="events-container-with-nav">
    {currentEvent.length > 3 && (
      <button 
        className={`event-nav-button prev ${currentEventPage === 0 ? 'disabled' : ''}`} 
        onClick={prevCurrentEvents}
        disabled={currentEventPage === 0}
      >
        &lt;
      </button>
    )}
    <div className="events-grid">
      {currentEvent.slice(currentEventPage * 3, (currentEventPage * 3) + 3).map((event, index) => {
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        const options = {
          year: "numeric",
          month: "short",
          day: "numeric",
        };
        const formattedStartDate = startDate.toLocaleDateString(
          undefined,
          options
        );
        const formattedEndDate = endDate.toLocaleDateString(
          undefined,
          options
        );
        const daysLeft = Math.ceil(
          (endDate - new Date()) / (1000 * 60 * 60 * 24)
        );

        return (
          <div key={index} className="event-card">
            <div className="event-image-container">
              <img
                src={event.poster_url || "/placeholder.svg"}
                alt={event.event_name}
                className="event-image"
              />
            </div>
            <div className="event-content">
              <h3 className="event-title">{event.event_name}</h3>
              <div className="event-dates">
                <Clock className="event-icon" />
                <span>
                  {formattedStartDate} - {formattedEndDate}
                </span>
              </div>
              <div className="event-stats">
                <div className="event-stat">
                  <span className="stat-value">
                    {event.limit === "0" ? "No Limit" : event.limit}
                  </span>
                  <span className="stat-label">
                    {event?.limit === "No Limit" ? "Open" : "Spots Left"}
                  </span>
                </div>
                <div className="event-stat">
                  <span className="stat-value">{daysLeft}</span>
                  <span className="stat-label">Days Left</span>
                </div>
              </div>
              <div className="event-duration">
                <span>Duration: {event.duration} hours</span>
              </div>
              <button
                className="event-register-button"
                onClick={() => handleRegisterClick(event)}
              >
                Register Now
              </button>
            </div>
          </div>
        );
      })}
    </div>
    {currentEvent.length > 3 && (
      <button 
        className={`event-nav-button next ${(currentEventPage + 1) * 3 >= currentEvent.length ? 'disabled' : ''}`} 
        onClick={nextCurrentEvents}
        disabled={(currentEventPage + 1) * 3 >= currentEvent.length}
      >
        &gt;
      </button>
    )}
  </div>
</section>

        <section className="events-section">
  <div className="section-header">
    <h2>Previous Events</h2>
    <div className="section-underline"></div>
  </div>
  <div className="events-container-with-nav">
    {previousEvents.length > 3 && (
      <button 
        className={`event-nav-button prev ${previousEventPage === 0 ? 'disabled' : ''}`} 
        onClick={prevPreviousEvents}
        disabled={previousEventPage === 0}
      >
        &lt;
      </button>
    )}
    <div className="events-grid">
      {previousEvents.slice(previousEventPage * 3, (previousEventPage * 3) + 3).map((event, index) => (
        <div key={index} className="event-card previous-event">
          <div className="event-image-container">
            <img
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              className="event-image"
            />
            <div className="event-overlay">
              <div className="event-status">Closed</div>
            </div>
          </div>
          <div className="event-content">
            <h3 className="event-title">{event.title}</h3>
            <div className="event-dates">
              <Clock className="event-icon" />
              <span>Completed</span>
            </div>
          </div>
        </div>
      ))}
    </div>
    {previousEvents.length > 3 && (
      <button 
        className={`event-nav-button next ${(previousEventPage + 1) * 3 >= previousEvents.length ? 'disabled' : ''}`} 
        onClick={nextPreviousEvents}
        disabled={(previousEventPage + 1) * 3 >= previousEvents.length}
      >
        &gt;
      </button>
    )}
  </div>
</section>

        <section className="committee-section">
          <div className="section-header">
            <h2>Core Committee</h2>
            <div className="section-underline"></div>
          </div>
          <div className="committee-grid">
            {committeeMembers.map((member, index) => (
              <div key={index} className="committee-card">
                <div className="committee-header">
                  <div className="profile-image-wrapper">
                    <img src={member.image || "/placeholder.svg"} alt={member.name} className="profile-image" />
                  </div>
                  <span className={`role-badge role-${member.position.toLowerCase().replace(/\s+/g, "-")}`}>
                    {member.position}
                  </span>
                </div>
                <div className="committee-body">
                  <h3 className="member-name">{member.name}</h3>
                  <div className="member-divider"></div>
                  <p className="member-email">{member.email}</p>
                  <div className="member-social">
                    <a href="#" className="social-link">
                      <FaLinkedinIn />
                    </a>
                    <a href={`mailto:${member.email}`} className="social-link">
                      <CgMail />
                    </a>
                  </div>
                  {isFacultyAdvisory && (
                    <Button onClick={() => handleEdit(member)} type="primary" className="edit-button">
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {editMember && (
          <EventCardEdit
            visible={!!editMember}
            onClose={handleCloseDrawer}
            member={editMember}
            onSubmit={handleSubmit}
          />
        )}

        <RegisterModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedEvent(null)
          }}
          eventId={selectedEvent?.er_id}
          eventName={selectedEvent?.event_name}
          posterUrl={selectedEvent?.poster_url}
          erId={selectedEvent?.er_id}
        />
      </div>

      <div className="scroller-i">
        <Scroller />
      </div>

      <footer className="dashboard-footer">
        <div>@Curriculum Portal</div>
      </footer>
    </div>
  )
}

export default JoinNowDetail
