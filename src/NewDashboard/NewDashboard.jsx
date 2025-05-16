"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  X,
  Calendar,
  MessageCircle,
  Flag,
  Info,
} from "lucide-react";
import styles from "./NewDashboard.module.css";
import cf from "../assets/images/cf.jpg";
import am from "../assets/images/am.jpg";
import not1 from "../assets/images/not1.png";

import apiClient from "../config/apiClient";
import shark from "./images/shark.png";
import ai from "./images/ai.png";
import ali from "./images/ali.png";
import sat from "./images/sat.png";
import fest from "./images/fest.png";
import alertI from "./images/alert.png";

const NewDashboard = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [currentMonth, setCurrentMonth] = useState("April");
  const [currentYear, setCurrentYear] = useState(2025);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("announcement");
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const [entityCounts, setEntityCounts] = useState({
    club: 0,
    departmentSociety: 0,
    professionalSociety: 0,
    community: 0,
  });
  const [publicNotifications, setPublicNotifications] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [newsAndViews, setNewsAndViews] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const announcementTimerRef = useRef(null);
  const newsTimerRef = useRef(null);
  const [availableCategories, setAvailableCategories] = useState([]);

  // Fetch entity counts from API
  useEffect(() => {
    const fetchEntityCounts = async () => {
      try {
        const response = await fetch(
          "http://172.17.2.247:8080/intranetapp/entity_count/"
        );
        const data = await response.json();

        // Map the API response to our state structure
        const counts = {
          club: 0,
          departmentSociety: 0,
          professionalSociety: 0,
          community: 0,
        };

        data.forEach((item) => {
          if (item.entity_name === "CLUB") {
            counts.club = item.entity_count;
          } else if (item.entity_name === "DEPARTMENT SOCIETY") {
            counts.departmentSociety = item.entity_count;
          } else if (item.entity_name === "PROFESSIONAL SOCIETY") {
            counts.professionalSociety = item.entity_count;
          } else if (item.entity_name === "COMMUNITY") {
            counts.community = item.entity_count;
          }
        });

        setEntityCounts(counts);
      } catch (error) {
        console.error("Error fetching entity counts:", error);
      }
    };

    fetchEntityCounts();
    getPublicNotifications();
    getNewsAndViews();
  }, []);

  const announcements = [
    {
      id: 6,
      title: "Stay Alert, Stay Safe",
      content:
        "At #ChandigarhUniversity, the safety and well-being of our students, staff, and community remain our top priority.",
      from: "Alert System",
      messageTime: "1Hr ago",
      priority: "high",
      image: alertI, // Replace with actual image import
      description:
        "An evening of innovation and ideas! Watch aspiring entrepreneurs pitch their startups to real investors. Networking session and refreshments to follow.",
      date: "30th January, 2025",
      time: "5:00 PM ONWARD",
      location: "Seminar Hall A",
      registerLink: "#",
    },
    {
      id: 1,
      title: "Meet The Shark",
      content:
        "Join us for an exclusive session with Anupam Mittal, Founder & CEO of Shaadi.com",
      from: "Professional Society: E-Cell",
      messageTime: "2hr ago",
      priority: "high",
      image: shark, // Replace with actual image import
      description:
        "Don't miss this opportunity to meet Anupam Mittal, Founder & CEO of Shaadi.com and a prominent Shark Tank India judge. Learn about entrepreneurship, business strategies, and get insights from his journey to success. The event will be held on 16th January, 2025 at 10:00 AM in the University Incubator.",
      date: "16th January, 2025",
      time: "10:00 AM ONWARD",
      location: "University Incubator",
      registerLink: "#",
    },
    {
      id: 2,
      title: "AI in Healthcare: The Future is Now",
      content:
        "Explore how AI is transforming the healthcare industry with Dr. Ritu Raj, Data Scientist at IBM.",
      from: "Department of Computer Science",
      messageTime: "5hr ago",
      priority: "medium",
      image: ai, // Replace with actual image import
      description:
        "This seminar will dive deep into the impact of Artificial Intelligence in revolutionizing diagnosis, treatment, and patient care. Don't miss the chance to interact with an expert from IBM and understand what the future holds.",
      date: "20th January, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Auditorium Hall B",
      registerLink: "#",
    },
    {
      id: 3,
      title: "Alumni Homecoming: 10-Year Reunion Alumni Meet",
      content:
        "After a decade of growth and success, our alumni have come together to celebrate their journey, reconnect with old friends, and relive the unforgettable memories of their time at Chandigarh University.",
      from: "Student Affairs Committee",
      messageTime: "1 day ago",
      priority: "high",
      image: ali, // Replace with actual image import
      description:
        "Join us for 'Sanskriti'—a cultural extravaganza featuring music bands, dance groups, drama performances, and food stalls. Fun competitions and celebrity guest appearances await!",
      date: "25th January, 2025",
      time: "All Day Event",
      location: "Main Ground",
      registerLink: "#",
    },
    {
      id: 4,
      title: " #CapitalSummit2025 ",
      content:
        "The North India's biggest Incubator and #CapitalSummit2025 commenced with an inspiring welcome address by Rajya Sabha MP and Hon’ble Chancellor of Chandigarh University, Shri Satnam Singh Sandhu ( @satnamsandhuchd ).",
      from: "Chandigarh University",
      messageTime: "3 days ago",
      priority: "low",
      image: sat, // Replace with actual image import
      description:
        "Get guidance from TCS professionals on writing impactful resumes, common mistakes to avoid, and tips for standing out. Please bring your laptops.",
      date: "18th January, 2025",
      time: "11:00 AM - 1:00 PM",
      location: "T&P Lab, 2nd Floor",
      registerLink: "#",
    },
    {
      id: 5,
      title: "CU Fest 2025",
      content:
        "CU Fest 2025 is about to hit all the right notes as the sensational Jubin Nautiyal takes the stage!",
      from: "CU FEST 2025",
      messageTime: "4 days ago",
      priority: "medium",
      image: fest, // Replace with actual image import
      description:
        "Explore the cutting-edge projects by our graduating batch, ranging from AI, IoT, to sustainable solutions. Open for all students and faculty.",
      date: "22nd January, 2025",
      time: "10:00 AM - 3:00 PM",
      location: "Exhibition Hall, Block C",
      registerLink: "#",
    },
  ];

  const discussions = [
    {
      title: "Club",
      participants: ["G", "D", "T"],
      additionalCount: 5,
      content: "Discussion about various club activities and events.",
    },
    {
      title: "Community",
      participants: ["A", "Q", "S"],
      additionalCount: 3,
      content:
        "Discussion forum for all Chandigarh University Student Tech Community & Community.",
    },
    {
      title: "Department Society",
      participants: ["C", "D", "P", "J"],
      additionalCount: 2,
      content:
        "Discussion forum for all Chandigarh University Student Department Society.",
    },
    {
      title: "Professional Society (Student Chapters)",
      participants: ["C", "S"],
      additionalCount: 2,
      content:
        "Discussion forum for all Chandigarh University Student Chapters.",
    },
  ];

  const events = [
    {
      id: 1,
      date: "2025-04-15",
      title: "Tech Symposium",
      time: "09:00 - 05:00 PM",
      price: "Free",
      ticketsLeft: 45,
      attendees: ["user1", "user2", "user3"],
      color: "#4285F4",
    },
    {
      id: 2,
      date: "2025-04-16",
      title: "Career Fair",
      time: "10:00 - 04:00 PM",
      price: "Free",
      ticketsLeft: 120,
      attendees: ["user4"],
      color: "#EA4335",
    },
    {
      id: 3,
      date: "2025-04-23",
      title: "Hackathon",
      time: "08:00 AM - 08:00 PM",
      price: "Free",
      ticketsLeft: 30,
      attendees: ["user1", "user5", "user6"],
      color: "#FBBC05",
    },
    {
      id: 4,
      date: "2025-04-23",
      title: "Workshop on AI",
      time: "02:00 - 05:00 PM",
      price: "₹200",
      ticketsLeft: 25,
      attendees: ["user2", "user3", "user7"],
      color: "#34A853",
    },
    {
      id: 5,
      date: "2025-04-27",
      title: "Cultural Fest",
      time: "05:00 - 10:00 PM",
      price: "₹150",
      ticketsLeft: 200,
      attendees: ["user8", "user9"],
      color: "#4285F4",
    },
    {
      id: 6,
      date: "2025-04-27",
      title: "Alumni Meet",
      time: "11:00 AM - 02:00 PM",
      price: "₹500",
      ticketsLeft: 80,
      attendees: ["user10"],
      color: "#EA4335",
    },
    {
      id: 7,
      date: "2025-04-27",
      title: "Research Presentation",
      time: "03:00 - 06:00 PM",
      price: "Free",
      ticketsLeft: 40,
      attendees: ["user11", "user12"],
      color: "#34A853",
    },
  ];

  const newsItems = [
    {
      id: 1,
      title:
        "Chandigarh University becomes India's First ABET Accredited Private University",
      content:
        "CU has earned the Accreditation Board for Engineering and Technology (ABET) recognition for its nine engineering programmes, highest in India.",
      image: cf,
      date: "April 10, 2025",
      category: "Achievement",
    },
    {
      id: 2,
      title: "University Ranks #1 in Placement Records",
      content:
        "Our university has achieved the highest placement record this year with over 95% students placed in top companies with excellent packages.",
      image: am,
      date: "April 5, 2025",
      category: "Placement",
    },
    {
      id: 3,
      title: "International Conference on Emerging Technologies",
      content:
        "The university is hosting an international conference on emerging technologies next month with speakers from MIT, Stanford, and Google.",
      image: not1,
      date: "April 2, 2025",
      category: "Event",
    },
  ];

  // Calendar data generation
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentYear;
    const month = new Date(`${currentMonth} 1, ${currentYear}`).getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const calendarDays = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      calendarDays.push({
        day: daysInPrevMonth - i,
        month:
          month === 0
            ? "December"
            : new Date(year, month - 1, 1).toLocaleString("default", {
                month: "long",
              }),
        current: false,
        events: [],
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split("T")[0];

      calendarDays.push({
        day: i,
        month: currentMonth,
        current: true,
        events: events.filter((event) => event.date === dateString),
      });
    }

    // Next month days
    const remainingDays = 42 - calendarDays.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push({
        day: i,
        month:
          month === 11
            ? "January"
            : new Date(year, month + 1, 1).toLocaleString("default", {
                month: "long",
              }),
        current: false,
        events: [],
      });
    }

    return calendarDays;
  };

  const calendarDays = generateCalendarDays();

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handlePrevMonth = () => {
    const date = new Date(`${currentMonth} 1, ${currentYear}`);
    date.setMonth(date.getMonth() - 1);
    setCurrentMonth(date.toLocaleString("default", { month: "long" }));
    setCurrentYear(date.getFullYear());
  };

  const handleNextMonth = () => {
    const date = new Date(`${currentMonth} 1, ${currentYear}`);
    date.setMonth(date.getMonth() + 1);
    setCurrentMonth(date.toLocaleString("default", { month: "long" }));
    setCurrentYear(date.getFullYear());
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setShowCalendarModal(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowAnnouncementModal(true);
  };

  const closeModal = () => {
    setShowCalendarModal(false);
    setShowAnnouncementModal(false);
    setSelectedEvent(null);
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Redirect functions
  const redirectToClubs = () => {
    window.location.href = "/clubs";
  };

  const redirectToCommunities = () => {
    window.location.href = "/communities";
  };

  const redirectToDepartmentSociety = () => {
    window.location.href = "/department-society";
  };

  const redirectToProfessionalSociety = () => {
    window.location.href = "/professional-society";
  };

  const userData = () => {
    const getUser = JSON.parse(localStorage.getItem("user"));
    if (getUser?.user_name) {
      setLoggedInUser(true);
    } else {
      setLoggedInUser(false);
    }
  };

  useEffect(() => {
    userData();
  }, []);

  // Get time difference from now
  const getTimeDifference = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMins < 60) {
      return `${diffMins}min ago`;
    } else if (diffHrs < 24) {
      return `${diffHrs}hr ago`;
    } else {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    }
  };

  useEffect(() => {
    if (availableCategories.length > 0 && !activeCategory) {
      setActiveCategory(availableCategories[0]);
    }
  }, [availableCategories]);

  const getPublicNotifications = async () => {
    try {
      const payload = {
        role_id: [8],
      };
      const response = await apiClient.post("get-push-notifications/", payload);
      const data = response.data;
      console.log(data, "YESSSSS");

      // Filter notifications with category "public"
      const publicNotifs = data.filter(
        (notification) => notification.roles[0] === 8
      );
      console.log(publicNotifs, "NOOOOOO");
      setPublicNotifications(publicNotifs);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(publicNotifs.map((n) => n.category)),
      ];
      setAvailableCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const getNewsAndViews = async () => {
    try {
      const response = await apiClient.get("news-and-views/active/");
      const data = response.data;
      console.log("News and Views data:", data);
      setNewsAndViews(data);
    } catch (error) {
      console.error("Error fetching news and views:", error);
    }
  };

  // Update the auto-scrolling logic for the announcement carousel
  useEffect(() => {
    if (!isHovering) {
      announcementTimerRef.current = setInterval(() => {
        const totalItems = announcements.length;
        if (totalItems > 0) {
          setCurrentAnnouncementIndex(
            (prevIndex) => (prevIndex + 1) % totalItems
          );
        }
      }, 5000);
    }

    return () => {
      if (announcementTimerRef.current) {
        clearInterval(announcementTimerRef.current);
      }
    };
  }, [isHovering, announcements.length]);

  // Update the auto-scrolling logic for the news carousel
  useEffect(() => {
    if (!isHovering) {
      newsTimerRef.current = setInterval(() => {
        const totalItems =
          newsAndViews.length > 0 ? newsAndViews.length : newsItems.length;
        if (totalItems > 0) {
          setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % totalItems);
        }
      }, 5000);
    }

    return () => {
      if (newsTimerRef.current) {
        clearInterval(newsTimerRef.current);
      }
    };
  }, [isHovering, newsAndViews.length, newsItems.length]);

  return (
    <div
      className={
        loggedInUser
          ? styles.dashboardContainerLoggedIn
          : styles.dashboardContainerLoggedOut
      }
    >
      <div className={styles.contentGrid}>
        <div className={styles.announcementSection}>
          <div className={styles.sectionHeader}>
            <h2>Feature Events</h2>
            <div className={styles.carouselControls}>
              {/* <button onClick={prevAnnouncement} className={styles.carouselButton}>
                <ChevronLeft size={20} />
              </button> */}
              <div className={styles.carouselIndicators}>
                {announcements.map((_, index) => (
                  <span
                    key={index}
                    className={`${styles.indicator} ${
                      currentAnnouncementIndex === index
                        ? styles.activeIndicator
                        : ""
                    }`}
                    onClick={() => setCurrentAnnouncementIndex(index)}
                  ></span>
                ))}
              </div>
              {/* <button onClick={nextAnnouncement} className={styles.carouselButton}>
                <ChevronRight size={20} />
              </button> */}
            </div>
          </div>

          <div
            className={styles.announcementCarousel}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div
              className={styles.announcementSlides}
              style={{
                transform: `translateX(-${currentAnnouncementIndex * 100}%)`,
              }}
            >
              {announcements.map((announcement, index) => (
                <div
                  key={index}
                  className={`${styles.announcementCard} ${
                    styles[`priority${announcement.priority}`]
                  }`}
                  onClick={() => handleAnnouncementClick(announcement)}
                >
                  <div className={styles.announcementImageContainer}>
                    <img
                      src={announcement.image || "/placeholder.svg"}
                      alt={announcement.title}
                      className={styles.announcementImage}
                    />
                    {announcement.priority === "high" && (
                      <div className={styles.announcementBadge}>Important</div>
                    )}
                  </div>
                  <div className={styles.announcementCardContent}>
                    {announcement.title && (
                      <h3 className={styles.announcementTitle}>
                        {announcement.title}
                      </h3>
                    )}
                    <p className={styles.announcementContent}>
                      {announcement.content}
                    </p>
                    <div className={styles.announcementFooter}>
                      <span className={styles.announcementFrom}>
                        {announcement.from}
                      </span>
                      <span className={styles.announcementTime}>
                        {announcement.messageTime}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.metricsSection}>
          <div className={styles.metricCardsGrid}>
            <div
              onClick={redirectToClubs}
              className={`${styles.metricCard} ${styles.card1}`}
            >
              <div className={styles.cardContent}>
                <div className={styles.cardInfo}>
                  <h2 className={styles.cardCount}>{entityCounts.club}</h2>
                  <div className={styles.cardCategory}>CO-CURRICULAR</div>
                  <p className={styles.cardTitle}>Club</p>
                </div>
                <div className={styles.cardIconContainer}>
                  <div className={styles.iconCircle}>
                    <Flag className={styles.cardIcon} />
                  </div>
                </div>
              </div>
              <div className={styles.cardShine}></div>
            </div>

            <div
              onClick={redirectToCommunities}
              className={`${styles.metricCard} ${styles.card2}`}
            >
              <div className={styles.cardContent}>
                <div className={styles.cardInfo}>
                  <h2 className={styles.cardCount}>{entityCounts.community}</h2>
                  <div className={styles.cardCategory}>CO-CURRICULAR</div>
                  <p className={styles.cardTitle}>Community</p>
                </div>
                <div className={styles.cardIconContainer}>
                  <div className={styles.iconCircle}>
                    <Users className={styles.cardIcon} />
                  </div>
                </div>
              </div>
              <div className={styles.cardShine}></div>
            </div>

            <div
              onClick={redirectToDepartmentSociety}
              className={`${styles.metricCard} ${styles.card3}`}
            >
              <div className={styles.cardContent}>
                <div className={styles.cardInfo}>
                  <h2 className={styles.cardCount}>
                    {entityCounts.departmentSociety}
                  </h2>
                  <div className={styles.cardCategory}>CO-CURRICULAR</div>
                  <p className={styles.cardTitle}>Department Society</p>
                </div>
                <div className={styles.cardIconContainer}>
                  <div className={styles.iconCircle}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.cardIcon}
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
              <div className={styles.cardShine}></div>
            </div>

            <div
              onClick={redirectToProfessionalSociety}
              className={`${styles.metricCard} ${styles.card4}`}
            >
              <div className={styles.cardContent}>
                <div className={styles.cardInfo}>
                  <h2 className={styles.cardCount}>
                    {entityCounts.professionalSociety}
                  </h2>
                  <div className={styles.cardCategory}>
                    PROFESSIONAL SOCIETY
                  </div>
                  <p className={styles.cardTitle}>Student Chapters</p>
                </div>
                <div className={styles.cardIconContainer}>
                  <div className={styles.iconCircle}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.cardIcon}
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className={styles.cardShine}></div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.contentGridSecond}>
        <div className={styles.calendarSection}>
          <div
            className={styles.calendarHeader}
            onClick={() => setShowCalendarModal(true)}
          >
            <div className={styles.monthSelector}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevMonth();
                }}
                className={styles.monthButton}
              >
                <ChevronLeft size={20} />
              </button>
              <h2>
                {currentMonth} {currentYear}
              </h2>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextMonth();
                }}
                className={styles.monthButton}
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div className={styles.calendarIcon}>
              <Calendar size={18} />
            </div>
          </div>

          <div className={styles.calendarGrid}>
            {daysOfWeek.map((day) => (
              <div key={day} className={styles.dayHeader}>
                {day}
              </div>
            ))}

            {calendarDays.slice(0, 35).map((day, index) => (
              <div
                key={index}
                className={`${styles.calendarDay} ${
                  !day.current ? styles.otherMonth : ""
                } ${day.events.length > 0 ? styles.hasEvents : ""}`}
                onClick={() => day.events.length > 0 && handleDateClick(day)}
              >
                <span className={styles.dayNumber}>{day.day}</span>
                {day.events.length > 0 && (
                  <div className={styles.eventIndicators}>
                    {day.events.slice(0, 3).map((event, i) => (
                      <span
                        key={i}
                        className={styles.eventDot}
                        style={{ backgroundColor: event.color }}
                      ></span>
                    ))}
                    {day.events.length > 3 && (
                      <span className={styles.moreEvents}>
                        +{day.events.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.tabsSection}>
          <div className={styles.tabsHeader}>
            <div
              className={`${styles.tab} ${
                activeTab === "announcement" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("announcement")}
            >
              <MessageCircle size={16} />
              <span>Announcements</span>
            </div>
          </div>

          <div className={styles.tabContent}>
            <div className={styles.categoryFilters}>
              <div
                className={`${styles.categoryButton} ${
                  activeCategory === "all" ? styles.activeCategory : ""
                }`}
                onClick={() => setActiveCategory("all")}
              >
                All ({publicNotifications.length})
                {publicNotifications.filter((n) => !n.is_read).length > 0 && (
                  <span className={styles.unreadBadge}>
                    {publicNotifications.filter((n) => !n.is_read).length}
                  </span>
                )}
              </div>

              {availableCategories.map((category) => (
                <div
                  key={category}
                  className={`${styles.categoryButton} ${
                    activeCategory === category ? styles.activeCategory : ""
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category} (
                  {
                    publicNotifications.filter((n) => n.category === category)
                      .length
                  }
                  )
                  {publicNotifications.filter(
                    (n) => n.category === category && !n.is_read
                  ).length > 0 && (
                    <span className={styles.unreadBadge}>
                      {
                        publicNotifications.filter(
                          (n) => n.category === category && !n.is_read
                        ).length
                      }
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.announcementTabContent}>
              {activeCategory === "all" ? (
                publicNotifications.length > 0 ? (
                  publicNotifications.map((notification, index) => (
                    <div
                      key={index}
                      className={`${styles.announcementTabItem} ${
                        !notification.is_read ? styles.unreadItem : ""
                      }`}
                    >
                      <div className={styles.announcementTabHeader}>
                        <h3>
                          {!notification.is_read && (
                            <span className={styles.newIndicator}>NEW</span>
                          )}
                          {/* {notification.message?.slice(0, 20)} */}
                        </h3>
                        <span className={styles.publicNotificationBadge}>
                          {notification?.category}
                        </span>
                      </div>

                      <div
                        style={{ fontFamily: "sans-serif" }}
                        className={styles.announcementTabDescription}
                        dangerouslySetInnerHTML={{
                          __html: notification.message,
                        }}
                      />

                      <div className={styles.announcementTabFooter}>
                        <span>
                          {" "}
                          {getTimeDifference(notification.created_at)}
                        </span>
                        <button className={styles.viewDetailsButton}>
                          End Date: {notification?.end_date}
                        </button>{" "}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.announcementTabItem}>
                    <div className={styles.announcementTabHeader}>
                      <h3>No announcements</h3>
                    </div>
                    <p className={styles.announcementTabDescription}>
                      There are no announcements at this time.
                    </p>
                  </div>
                )
              ) : publicNotifications.filter(
                  (n) => n.category === activeCategory
                ).length > 0 ? (
                publicNotifications
                  .filter(
                    (notification) => notification.category === activeCategory
                  )
                  .map((notification, index) => (
                    <div
                      key={index}
                      className={`${styles.announcementTabItem} ${
                        !notification.is_read ? styles.unreadItem : ""
                      }`}
                    >
                      <div className={styles.announcementTabHeader}>
                        <h3>
                          {!notification.is_read && (
                            <span className={styles.newIndicator}>NEW</span>
                          )}
                          {/* {notification.message?.slice(0, 20)} */}
                        </h3>
                        <span className={styles.publicNotificationBadge}>
                          {notification?.category}
                        </span>
                      </div>

                      <div
                        style={{ fontFamily: "sans-serif" }}
                        className={styles.announcementTabDescription}
                        dangerouslySetInnerHTML={{
                          __html: notification.message,
                        }}
                      />

                      <div className={styles.announcementTabFooter}>
                        <span>
                          {" "}
                          {getTimeDifference(notification.created_at)}
                        </span>
                        <button className={styles.viewDetailsButton}>
                          End Date: {notification?.end_date}
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className={styles.announcementTabItem}>
                  <div className={styles.announcementTabHeader}>
                    <h3>No announcements in this category</h3>
                  </div>
                  <p className={styles.announcementTabDescription}>
                    There are no announcements at this time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.discussionSection}>
          <div className={styles.sectionHeader}>
            <h2>Discussion Forum</h2>
          </div>

          <div className={styles.discussionList}>
            {discussions.map((discussion, index) => (
              <div key={index} className={styles.discussionItem}>
                <button
                  className={`${styles.discussionButton} ${
                    activeAccordion === index ? styles.active : ""
                  }`}
                  onClick={() => toggleAccordion(index)}
                >
                  <span className={styles.discussionTitle}>
                    {discussion.title}
                  </span>
                  <div className={styles.discussionMeta}>
                    <div className={styles.participantAvatars}>
                      {discussion.participants.map((letter, i) => (
                        <div
                          key={i}
                          className={styles.avatar}
                          style={{ backgroundColor: getRandomColor() }}
                        >
                          {letter}
                        </div>
                      ))}
                      {discussion.additionalCount > 0 && (
                        <span className={styles.additionalCount}>
                          +{discussion.additionalCount}
                        </span>
                      )}
                    </div>
                    <span className={styles.accordionIcon}>
                      {activeAccordion === index ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </span>
                  </div>
                </button>
                {activeAccordion === index && (
                  <div className={styles.discussionContent}>
                    <p>{discussion.content}</p>
                    <button className={styles.joinButton}>
                      Join Discussion
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.newsSection}>
          <div className={styles.sectionHeader}>
            <h2>News & Views</h2>
            <div className={styles.carouselControls}>
              {/* <button onClick={prevNews} className={styles.carouselButton}>
                <ChevronLeft size={20} />
              </button> */}
              <div className={styles.carouselIndicators}>
                {(newsAndViews.length > 0 ? newsAndViews : newsItems).map(
                  (_, index) => (
                    <span
                      key={index}
                      className={`${styles.indicator} ${
                        currentNewsIndex === index ? styles.activeIndicator : ""
                      }`}
                      onClick={() => setCurrentNewsIndex(index)}
                    ></span>
                  )
                )}
              </div>
              {/* <button onClick={nextNews} className={styles.carouselButton}>
                <ChevronRight size={20} />
              </button> */}
            </div>
          </div>

          <div
            className={styles.newsCarousel}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div
              className={styles.newsSlides}
              style={{ transform: `translateX(-${currentNewsIndex * 100}%)` }}
            >
              {newsAndViews.length > 0
                ? newsAndViews.map((news, index) => (
                    <div key={index} className={styles.newsCard}>
                      <div className={styles.newsImageContainer}>
                        {news.image ? (
                          <img
                            src={news.image_url || "/placeholder.svg"}
                            alt={news.title}
                            className={styles.newsImage}
                          />
                        ) : (
                          <img
                            src={news?.image_url || "/placeholder.svg"}
                            alt="Placeholder"
                            className={styles.newsImage}
                          />
                        )}
                        <div className={styles.newsCategory}>
                          {news.category}
                        </div>
                      </div>
                      <div className={styles.newsCardContent}>
                        <h3 className={styles.newsTitle}>{news.title}</h3>
                        <p className={styles.newsContent}>{news.content}</p>
                        <div className={styles.newsFooter}>
                          <span className={styles.newsDate}>
                            {new Date(news.start_date).toLocaleDateString()}
                          </span>
                          <button className={styles.readMoreButton}>
                            Read More
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                : // Use the mock news items as fallback if no data from API
                  newsItems.map((news, index) => (
                    <div key={index} className={styles.newsCard}>
                      <div className={styles.newsImageContainer}>
                        <img
                          src={
                            news.image ||
                            "/placeholder.svg?height=300&width=400"
                          }
                          alt={news.title}
                          className={styles.newsImage}
                        />
                        <div className={styles.newsCategory}>
                          {news.category}
                        </div>
                      </div>
                      <div className={styles.newsCardContent}>
                        <h3 className={styles.newsTitle}>{news.title}</h3>
                        <p className={styles.newsContent}>{news.content}</p>
                        <div className={styles.newsFooter}>
                          <span className={styles.newsDate}>{news.date}</span>
                          <button className={styles.readMoreButton}>
                            Read More
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>

      {showCalendarModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.calendarModal}>
            <div className={styles.modalHeader}>
              <h2>
                {selectedDate
                  ? `Events for ${selectedDate.month} ${selectedDate.day}`
                  : `${currentMonth} ${currentYear} Calendar`}
              </h2>
              <button className={styles.closeButton} onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.calendarModalGrid}>
                <div className={styles.calendarModalDays}>
                  {daysOfWeek.map((day) => (
                    <div key={day} className={styles.modalDayHeader}>
                      {day}
                    </div>
                  ))}

                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`${styles.modalCalendarDay} ${
                        !day.current ? styles.modalOtherMonth : ""
                      } 
                        ${day.events.length > 0 ? styles.modalHasEvents : ""} 
                        ${
                          selectedDate &&
                          selectedDate.day === day.day &&
                          selectedDate.month === day.month
                            ? styles.modalSelectedDay
                            : ""
                        }`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <span className={styles.modalDayNumber}>{day.day}</span>
                      {day.events.length > 0 && (
                        <div className={styles.modalEventIndicators}>
                          {day.events.slice(0, 3).map((event, i) => (
                            <span
                              key={i}
                              className={styles.modalEventDot}
                              style={{ backgroundColor: event.color }}
                            ></span>
                          ))}
                          {day.events.length > 3 && (
                            <span className={styles.modalMoreEvents}>
                              +{day.events.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className={styles.eventsList}>
                  <h3 className={styles.eventsListTitle}>
                    {selectedDate
                      ? `Events on ${selectedDate.month} ${selectedDate.day}`
                      : "Select a date to view events"}
                  </h3>

                  {selectedDate && selectedDate.events.length > 0 ? (
                    selectedDate.events.map((event) => (
                      <div
                        key={event.id}
                        className={`${styles.eventItem} ${
                          selectedEvent?.id === event.id
                            ? styles.selectedEvent
                            : ""
                        }`}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className={styles.eventHeader}>
                          <h3 className={styles.eventTitle}>{event.title}</h3>
                          <div className={styles.eventTime}>
                            <Clock size={14} />
                            <span>{event.time}</span>
                          </div>
                        </div>
                        <div className={styles.eventDetails}>
                          <div className={styles.eventAttendees}>
                            <div className={styles.attendeeAvatars}>
                              {event.attendees
                                .slice(0, 3)
                                .map((attendee, i) => (
                                  <div
                                    key={i}
                                    className={styles.attendeeAvatar}
                                    style={{
                                      backgroundColor: getRandomColor(),
                                    }}
                                  >
                                    {attendee.charAt(0).toUpperCase()}
                                  </div>
                                ))}
                              {event.attendees.length > 3 && (
                                <span className={styles.moreAttendees}>
                                  +{event.attendees.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={styles.eventPrice}>{event.price}</div>
                        </div>
                        {selectedEvent?.id === event.id && (
                          <div className={styles.eventExpandedDetails}>
                            <div className={styles.ticketsInfo}>
                              <span className={styles.ticketsLabel}>
                                Tickets left:
                              </span>
                              <span className={styles.ticketsCount}>
                                {event.ticketsLeft}
                              </span>
                            </div>
                            <div className={styles.progressBar}>
                              <div
                                className={styles.progressFill}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (event.ticketsLeft / 30) * 100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <button className={styles.registerButton}>
                              Register Now
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : selectedDate ? (
                    <div className={styles.noEvents}>
                      <p>No events scheduled for this day.</p>
                    </div>
                  ) : (
                    <div className={styles.noDateSelected}>
                      <Calendar
                        size={48}
                        className={styles.calendarPlaceholderIcon}
                      />
                      <p>Select a date from the calendar to view events</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAnnouncementModal && selectedAnnouncement && (
        <div className={styles.modalOverlay}>
          <div className={styles.announcementModal}>
            <div className={styles.modalHeader}>
              <h2>{selectedAnnouncement.title}</h2>
              <button className={styles.closeButton} onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.announcementModalContent}>
              <div className={styles.announcementModalImageContainer}>
                <img
                  src={selectedAnnouncement.image || "/placeholder.svg"}
                  alt={selectedAnnouncement.title}
                  className={styles.announcementModalImage}
                />
              </div>

              <div className={styles.announcementModalDetails}>
                <div className={styles.announcementModalInfo}>
                  {selectedAnnouncement.date && (
                    <div className={styles.announcementModalInfoItem}>
                      <Calendar size={18} />
                      <span>{selectedAnnouncement.date}</span>
                    </div>
                  )}
                  {selectedAnnouncement.time && (
                    <div className={styles.announcementModalInfoItem}>
                      <Clock size={18} />
                      <span>{selectedAnnouncement.time}</span>
                    </div>
                  )}
                  {selectedAnnouncement.location && (
                    <div className={styles.announcementModalInfoItem}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={styles.infoIcon}
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{selectedAnnouncement.location}</span>
                    </div>
                  )}
                </div>

                <div className={styles.announcementModalDescription}>
                  <h3>Description</h3>
                  <p>{selectedAnnouncement.description}</p>
                </div>

                <div className={styles.announcementModalFrom}>
                  <Info size={18} />
                  <span>{selectedAnnouncement.from}</span>
                </div>

                {selectedAnnouncement.registerLink && (
                  <button className={styles.registerButton}>
                    Register Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewDashboard;
