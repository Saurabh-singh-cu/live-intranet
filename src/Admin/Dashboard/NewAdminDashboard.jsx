"use client"

import { useState, useEffect } from "react"
import styles from "./NewAdminDashboard.module.css"
import apiClient from "../../config/apiClient"

// Event Detail Drawer Component
const EventDetailDrawer = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0)
  }

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawerContainer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>Event Details</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.drawerContent}>
          {/* Event Basic Information */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Event Information</h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>Event Name</label>
                <div className={styles.detailValue}>{event.event_name || "N/A"}</div>
              </div>
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>Activity Type</label>
                <div className={styles.detailValue}>
                  <span
                    className={`${styles.activityBadge} ${styles[`activity${event.activity_type?.toLowerCase()}`]}`}
                  >
                    {event.activity_type || "N/A"}
                  </span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>Status</label>
                <div className={styles.detailValue}>
                  <span
                    className={`${styles.statusBadge} ${styles[`status${(event.status || "pending").toLowerCase()}`]}`}
                  >
                    {event.status || "Pending"}
                  </span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>Proposed Budget</label>
                <div className={styles.detailValue}>{formatCurrency(event.proposed_budget)}</div>
              </div>
            </div>
          </div>

          {/* Event Description */}
          {event.description && (
            <div className={styles.detailSection}>
              <h3 className={styles.sectionTitle}>Description</h3>
              <div className={styles.descriptionBox}>{event.description}</div>
            </div>
          )}

          {/* Event Dates */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Event Schedule</h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>Start Date</label>
                <div className={styles.detailValue}>{formatDate(event.start_date)}</div>
              </div>
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>End Date</label>
                <div className={styles.detailValue}>{formatDate(event.end_date)}</div>
              </div>
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>Duration</label>
                <div className={styles.detailValue}>
                  {Math.ceil((new Date(event.end_date) - new Date(event.start_date)) / (1000 * 60 * 60 * 24)) + 1} days
                </div>
              </div>
            </div>
          </div>

          {/* Entity Information */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Entity & Department</h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>Entity Name</label>
                <div className={styles.detailValue}>{event.entity_name || "N/A"}</div>
              </div>
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>Registration Name</label>
                <div className={styles.detailValue}>{event.registeration_name || "N/A"}</div>
              </div>
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>Department</label>
                <div className={styles.detailValue}>{event.department_name || "N/A"}</div>
              </div>
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>Cluster</label>
                <div className={styles.detailValue}>{event.cluster_name || "N/A"}</div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Contact Information</h3>
            <div className={styles.contactGrid}>
              <div className={styles.contactCard}>
                <h4 className={styles.contactTitle}>Secretary</h4>
                <div className={styles.contactDetails}>
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>👤</span>
                    <span>{event.Secretary_Name || "N/A"}</span>
                  </div>
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>📧</span>
                    <span>{event.Secretary_Email || "N/A"}</span>
                  </div>
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>📱</span>
                    <span>{event.Secretary_Mobile || "N/A"}</span>
                  </div>
                </div>
              </div>
              <div className={styles.contactCard}>
                <h4 className={styles.contactTitle}>Faculty Advisory</h4>
                <div className={styles.contactDetails}>
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>👤</span>
                    <span>{event.Faculty_Advisory_Name || "N/A"}</span>
                  </div>
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>📧</span>
                    <span>{event.Faculty_Advisory_Email || "N/A"}</span>
                  </div>
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}>📱</span>
                    <span>{event.Faculty_Advisory_Mobile || "N/A"}</span>
                  </div>
                  {event.Faculty_Advisory_Empcode && (
                    <div className={styles.contactItem}>
                      <span className={styles.contactIcon}>🆔</span>
                      <span>Emp: {event.Faculty_Advisory_Empcode}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SDG Information */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>SDG & Classification</h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>SDG</label>
                <div className={styles.detailValue}>{event.sdg_name || "N/A"}</div>
              </div>
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>ACTED</label>
                <div className={styles.detailValue}>
                  {event.acted_name ? `${event.acted_name} - ${event.acted_fullform}` : "N/A"}
                </div>
              </div>
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>NSQF</label>
                <div className={styles.detailValue}>{event.nsqf_name || "N/A"}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.drawerActions}>
            <button className={styles.approveButton}>✓ Approve Event</button>
            <button className={styles.rejectButton}>✗ Reject Event</button>
            <button className={styles.editButton}>✏️ Edit Event</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Department Event Chart Component
const DepartmentEventChart = ({ data, filter }) => {
  const filteredData = data

  return (
    <div className={styles.departmentChart}>
      <div className={styles.chartLegend}>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: "#4361ee" }}></div>
          <span>Total Proposed</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: "#06d6a0" }}></div>
          <span>Total Completed</span>
        </div>
      </div>

      <div className={styles.barChartContainer}>
        {filteredData.map((dept, index) => (
          <div key={index} className={styles.barGroup}>
            <div className={styles.barPair}>
              <div className={styles.barWrapper}>
                <div
                  className={styles.bar}
                  style={{
                    height: `${(dept.proposed / 30) * 250}px`,
                    backgroundColor: "#4361ee",
                  }}
                >
                  <span className={styles.barValue}>{dept.proposed}</span>
                </div>
                <span className={styles.barTitle}>Proposed</span>
              </div>
              <div className={styles.barWrapper}>
                <div
                  className={styles.bar}
                  style={{
                    height: `${(dept.completed / 30) * 250}px`,
                    backgroundColor: "#06d6a0",
                  }}
                >
                  <span className={styles.barValue}>{dept.completed}</span>
                </div>
                <span className={styles.barTitle}>Completed</span>
              </div>
            </div>
            <div className={styles.barLabel}>{dept.department}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Flagship Chart Component
const FlagshipChart = ({ data, filter }) => {
  const filteredData = data.slice(0, 6)

  return (
    <div className={styles.flagshipChart}>
      <div className={styles.chartLegend}>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: "#ff9f1c" }}></div>
          <span>Flagship Events</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: "#118ab2" }}></div>
          <span>Regular Events</span>
        </div>
      </div>

      <div className={styles.barChartContainer}>
        {filteredData.map((month, index) => (
          <div key={index} className={styles.barGroup}>
            <div className={styles.barPair}>
              <div className={styles.barWrapper}>
                <div
                  className={styles.bar}
                  style={{
                    height: `${(month.flagships / 5) * 250}px`,
                    backgroundColor: "#ff9f1c",
                  }}
                >
                  <span className={styles.barValue}>{month.flagships}</span>
                </div>
                <span className={styles.barTitle}>Flagship</span>
              </div>
              <div className={styles.barWrapper}>
                <div
                  className={styles.bar}
                  style={{
                    height: `${(month.regular / 20) * 250}px`,
                    backgroundColor: "#118ab2",
                  }}
                >
                  <span className={styles.barValue}>{month.regular}</span>
                </div>
                <span className={styles.barTitle}>Regular</span>
              </div>
            </div>
            <div className={styles.barLabel}>{month.month.substring(0, 3)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Notification Panel Component
const NotificationPanel = ({ notifications }) => {
  return (
    <div className={styles.notificationPanel}>
      {notifications.map((notification) => (
        <div key={notification.id} className={styles.notificationItem}>
          <div className={styles.notificationHeader}>
            <h4 className={styles.notificationTitle}>{notification.title}</h4>
            <span className={styles.notificationTime}>{notification.time}</span>
          </div>
          <p className={styles.notificationMessage}>{notification.message}</p>
        </div>
      ))}
    </div>
  )
}

// Enhanced Calendar Component
const EnhancedCalendar = ({ events }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const formatDate = (date) => {
    const options = { weekday: "short", day: "numeric", month: "short" }
    return new Date(date).toLocaleDateString("en-US", options)
  }

  const getMonthName = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date)
    return eventDate.getMonth() === currentMonth.getMonth() && eventDate.getFullYear() === currentMonth.getFullYear()
  })

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days = []
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i)
      days.push({
        date: dayDate,
        dayOfWeek: dayDate.toLocaleDateString("en-US", { weekday: "short" }),
        dayOfMonth: i,
        hasEvent: filteredEvents.some((event) => {
          const eventDate = new Date(event.date)
          return eventDate.getDate() === i
        }),
      })
    }

    return days
  }

  const days = getDaysInMonth(currentMonth)
  const dayHeaders = ["S", "M", "T", "W", "T", "F", "S"]

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <button className={styles.calendarNavButton} onClick={prevMonth}>
          ←
        </button>
        <h3 className={styles.calendarTitle}>{getMonthName(currentMonth)}</h3>
        <button className={styles.calendarNavButton} onClick={nextMonth}>
          →
        </button>
      </div>

      <div className={styles.calendarDayHeaders}>
        {dayHeaders.map((day, index) => (
          <div key={index} className={styles.dayHeader}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.calendarDays}>
        {days.map((day, index) => (
          <div key={index} className={`${styles.calendarDay} ${day.hasEvent ? styles.hasEvent : ""}`}>
            <div className={styles.dayInfo}>
              <span className={styles.dayOfMonth}>{day.dayOfMonth}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.calendarEvents}>
        <h4 className={styles.eventsTitle}>Events This Month</h4>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <div key={index} className={styles.calendarEvent}>
              <div className={styles.eventDate}>{formatDate(event.date)}</div>
              <div className={styles.eventTitle}>{Array.isArray(event.title) ? event.title[0] : event.title}</div>
              <span
                className={`${styles.eventType} ${
                  styles[`eventType${event.type.charAt(0).toUpperCase() + event.type.slice(1)}`]
                }`}
              >
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </span>
            </div>
          ))
        ) : (
          <p className={styles.noEvents}>No events this month</p>
        )}
      </div>
    </div>
  )
}

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
  const getIconComponent = (iconName) => {
    return (
      <div className={`${styles.statIcon} ${styles[`statIcon${color.charAt(0).toUpperCase() + color.slice(1)}`]}`}>
        {iconName}
      </div>
    )
  }

  return (
    <div className={`${styles.statCard} ${styles[`statCard${color.charAt(0).toUpperCase() + color.slice(1)}`]}`}>
      <div className={styles.statContent}>
        <h3 className={styles.statTitle}>{title}</h3>
        <div className={styles.statValue}>{value}</div>
      </div>
      {getIconComponent(icon)}
    </div>
  )
}

// PieChart Component
const PieChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  let gradientString = ""
  let currentPercentage = 0

  data.forEach((item) => {
    const percentage = (item.value / total) * 100
    gradientString += `${item.color} ${currentPercentage}% ${currentPercentage + percentage}%, `
    currentPercentage += percentage
  })

  gradientString = gradientString.slice(0, -2)

  return (
    <div className={styles.pieChartContainer}>
      <h3 className={styles.pieChartTitle}>{title}</h3>
      <div
        className={styles.pieChart}
        style={{
          background: `conic-gradient(${gradientString})`,
        }}
      ></div>
      <div className={styles.pieChartLegend}>
        {data.map((item) => (
          <div key={item.label} className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: item.color }}></div>
            <span>
              {item.label} ({Math.round((item.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Line and Bar Chart Component
const LineBarChart = ({ data, title }) => {
  const maxBarValue = Math.max(...data.map((item) => item.barValue))
  const maxLineValue = Math.max(...data.map((item) => item.lineValue))

  return (
    <div className={styles.lineBarChartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.lineBarChart}>
        <div className={styles.yAxisLabels}>
          <div>25%</div>
          <div>20%</div>
          <div>15%</div>
          <div>10%</div>
          <div>5%</div>
          <div>0%</div>
        </div>
        <div className={styles.chartContent}>
          {data.map((item, index) => (
            <div key={index} className={styles.chartColumn}>
              <div className={styles.linePoint} style={{ bottom: `${(item.lineValue / 25) * 100}%` }}>
                <div className={styles.linePointDot}></div>
                <div className={styles.lineValue}>{item.lineValue}%</div>
              </div>
              <div className={styles.barColumn} style={{ height: `${(item.barValue / maxBarValue) * 80}%` }}>
                <div className={styles.barValue}>{item.barValue}</div>
              </div>
              <div className={styles.columnLabel}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.chartLegend}>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: "#4361ee" }}></div>
          <span>Quantity</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendLine}></div>
          <span>% Reduction</span>
        </div>
      </div>
    </div>
  )
}

// Stacked Bar Chart Component
const StackedBarChart = ({ data, title }) => {
  const maxTotal = Math.max(...data.map((item) => item.values.reduce((sum, val) => sum + val, 0)))

  return (
    <div className={styles.stackedBarChartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.stackedBarChart}>
        <div className={styles.yAxisLabels}>
          <div>12000</div>
          <div>10000</div>
          <div>8000</div>
          <div>6000</div>
          <div>4000</div>
          <div>2000</div>
          <div>0</div>
        </div>
        <div className={styles.chartContent}>
          {data.map((item, index) => (
            <div key={index} className={styles.stackedBarColumn}>
              {item.values.map((value, valueIndex) => (
                <div
                  key={valueIndex}
                  className={styles.stackedBarSegment}
                  style={{
                    height: `${(value / 12000) * 100}%`,
                    backgroundColor: item.colors[valueIndex],
                  }}
                >
                  <div className={styles.segmentValue}>{value}</div>
                </div>
              ))}
              <div className={styles.columnLabel}>{item.month}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.chartLegend}>
        {data[0].labels.map((label, index) => (
          <div key={index} className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: data[0].colors[index] }}></div>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Progress Bar Component
const ProgressBar = ({ value, max, label, color }) => {
  const percentage = (value / max) * 100

  return (
    <div className={styles.progressBarContainer}>
      <div className={styles.progressBarLabel}>
        <span>{label}</span>
        <span>
          {value}/{max} ({Math.round(percentage)}%)
        </span>
      </div>
      <div className={styles.progressBarTrack}>
        <div
          className={styles.progressBarFill}
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>
    </div>
  )
}

// Data Table Component
const DataTable = ({ data, columns }) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>{column.render ? column.render(row) : row[column.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Main Dashboard Component
const NewAdminDashboard = () => {
  const [userData, setUserData] = useState({
    totalUsers: 0,
    totalRegisteredMembers: 0,
    totalPayments: 0,
    totalAnnouncements: 0,
    totalNews: 0,
    totalSecretary: 0,
    totalFaculty: 0,
  })

  const [entityCounts, setEntityCounts] = useState({
    club: 0,
    departmentSociety: 0,
    professionalSociety: 0,
    community: 0,
  })

  const [configData, setConfigData] = useState({
    entityTypes: [],
    roles: [],
    permissions: [],
    departments: [],
    sessions: [],
    genders: [],
    titles: [],
    designations: [],
  })

  const [activityData, setActivityData] = useState({
    entityRequests: 0,
    registeredEntities: 0,
    eventPublishRequests: 0,
  })

  const [calendarEvents, setCalendarEvents] = useState([])
  const [activeTab, setActiveTab] = useState("overview")
  const [departmentFilter, setDepartmentFilter] = useState("monthly")
  const [flagshipFilter, setFlagshipFilter] = useState("monthly")
  const [proposedCalender, setProposedCalendar] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(null);
  const [userCount1, setUserCount1] = useState([]);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  // Fetch entity counts
  const fetchEntityCounts = async () => {
    try {
      const response = await apiClient.get("entity_count/")
      const data = response.data

      const counts = {
        club: 0,
        departmentSociety: 0,
        professionalSociety: 0,
        community: 0,
      }

      data.forEach((item) => {
        if (item.entity_name === "CLUB") {
          counts.club = item.entity_count
        } else if (item.entity_name === "DEPARTMENT SOCIETY") {
          counts.departmentSociety = item.entity_count
        } else if (item.entity_name === "PROFESSIONAL SOCIETY") {
          counts.professionalSociety = item.entity_count
        } else if (item.entity_name === "COMMUNITY") {
          counts.community = item.entity_count
        }
      })

      setEntityCounts(counts)
    } catch (error) {
      console.error("Error fetching entity counts:", error)
    }
  }

  // Fetch configuration data
  const fetchConfigData = async () => {
    try {
      setConfigData({
        entityTypes: ["CLUB", "DEPARTMENT SOCIETY", "PROFESSIONAL SOCIETY", "COMMUNITY"],
        roles: ["Admin", "User", "Faculty", "Student", "Secretary"],
        permissions: ["Create", "Read", "Update", "Delete", "Approve"],
        departments: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"],
        sessions: ["2024-2025", "2023-2024", "2022-2023"],
        genders: ["Male", "Female", "Other"],
        titles: ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."],
        designations: ["Professor", "Assistant Professor", "Student", "Staff"],
      })
    } catch (error) {
      console.error("Error fetching config data:", error)
    }
  }

  // Fetch mock data for demonstration
  const fetchMockData = () => {
    setUserData({
      totalUsers: 1250,
      totalRegisteredMembers: 980,
      totalPayments: 456,
      totalAnnouncements: 78,
      totalNews: 42,
      totalSecretary: 15,
      totalFaculty: 65,
    })

    setActivityData({
      entityRequests: 24,
      registeredEntities: 156,
      eventPublishRequests: 38,
    })

    setCalendarEvents([
      {
        id: 1,
        title: ["Annual Meeting"],
        date: "2025-04-20",
        type: "important",
      },
      { id: 2, title: "Tech Workshop", date: "2025-04-25", type: "workshop" },
      {
        id: 3,
        title: "Club Registration",
        date: "2025-05-01",
        type: "registration",
      },
      { id: 4, title: "Faculty Meeting", date: "2025-05-05", type: "meeting" },
      { id: 5, title: "Sports Event", date: "2025-05-10", type: "event" },
    ])
  }

  const userCount = async() => {
    try{
      const response = await apiClient.get("/user_create");
      console.log(response, "USERS");
      setUserCount1(response?.data);
    }catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    userCount();
  }, []);

  const fetchAdminCalendar = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get("/all-proposed-calendar/")
      console.log(response, "ADMIN CALENDAR RESPONSE")
      setProposedCalendar(response?.data || [])
    } catch (error) {
      console.log("Error fetching calendar:", error)
      setProposedCalendar([])
    } finally {
      setLoading(false)
    }
  }

  const deleteProposedCalendar = async (pcId) => {
    if (!window.confirm("Are you sure you want to delete this calendar item?")) {
      return
    }

    try {
      setDeleting(pcId)
      const response = await apiClient.delete(`/delete-proposed-calendar/${pcId}/`)

      if (response.data.success) {
        setProposedCalendar((prev) => prev.filter((item) => item.pc_id !== pcId))
        alert("Calendar item deleted successfully!")
      }
    } catch (error) {
      console.error("Error deleting calendar:", error)
      alert("Failed to delete calendar item. Please try again.")
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Handle view event
  const handleViewEvent = (event) => {
    setSelectedEvent(event)
    setDrawerOpen(true)
  }

  // Handle close drawer
  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setSelectedEvent(null)
  }

  useEffect(() => {
    fetchEntityCounts()
    fetchConfigData()
    fetchMockData()
    fetchAdminCalendar()
  }, [])

  // Mock department event data
  const departmentEventData = [
    { department: "CSE", proposed: 25, completed: 20 },
    { department: "ECE", proposed: 18, completed: 15 },
    { department: "ME", proposed: 22, completed: 17 },
    { department: "CE", proposed: 15, completed: 12 },
    { department: "IT", proposed: 20, completed: 16 },
  ]

  // Mock flagship event data
  const flagshipEventData = [
    { month: "January", flagships: 2, regular: 8 },
    { month: "February", flagships: 3, regular: 12 },
    { month: "March", flagships: 1, regular: 10 },
    { month: "April", flagships: 4, regular: 15 },
    { month: "May", flagships: 2, regular: 9 },
    { month: "June", flagships: 3, regular: 11 },
  ]

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "New Event Request",
      message: "CSE department requested approval for Tech Symposium",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Event Approved",
      message: "Annual Cultural Fest has been approved",
      time: "5 hours ago",
    },
    {
      id: 3,
      title: "New Member Registration",
      message: "10 new members registered for Robotics Club",
      time: "1 day ago",
    },
    {
      id: 4,
      title: "Upcoming Deadline",
      message: "Registration for Hackathon closes tomorrow",
      time: "1 day ago",
    },
    {
      id: 5,
      title: "System Update",
      message: "Dashboard will be under maintenance on Sunday",
      time: "2 days ago",
    },
  ]

  // Mock data for pie chart
  const entityTypePieData = [
    { label: "Clubs", value: 45, color: "#4361ee" },
    { label: "Department Societies", value: 30, color: "#06d6a0" },
    { label: "Professional Societies", value: 15, color: "#7209b7" },
    { label: "Communities", value: 10, color: "#ff9f1c" },
  ]

  // Mock data for line and bar chart
  const defectReductionData = [
    { label: "Code", barValue: 720, lineValue: 10 },
    { label: "Torn pouch", barValue: 620, lineValue: 20 },
    { label: "Weak seal", barValue: 400, lineValue: 5 },
    { label: "Pests", barValue: 380, lineValue: 12 },
    { label: "Fold", barValue: 200, lineValue: 13 },
    { label: "Leaks", barValue: 180, lineValue: 5 },
    { label: "Underweight", barValue: 150, lineValue: 7 },
    { label: "Overweight", barValue: 80, lineValue: 8 },
  ]

  // Mock data for stacked bar chart
  const monthlySalesData = [
    {
      month: "January",
      values: [1500, 1600, 1400, 3200],
      colors: ["#f8e16c", "#4cc9f0", "#4361ee", "#b5179e"],
      labels: ["Shade 1", "Shade 2", "Shade 3", "Shade 4"],
    },
    {
      month: "February",
      values: [2500, 2800, 2200, 5800],
      colors: ["#f8e16c", "#4cc9f0", "#4361ee", "#b5179e"],
      labels: ["Shade 1", "Shade 2", "Shade 3", "Shade 4"],
    },
    {
      month: "March",
      values: [3800, 4200, 3600, 7800],
      colors: ["#f8e16c", "#4cc9f0", "#4361ee", "#b5179e"],
      labels: ["Shade 1", "Shade 2", "Shade 3", "Shade 4"],
    },
    {
      month: "April",
      values: [3500, 4000, 3800, 9000],
      colors: ["#f8e16c", "#4cc9f0", "#4361ee", "#b5179e"],
      labels: ["Shade 1", "Shade 2", "Shade 3", "Shade 4"],
    },
    {
      month: "May",
      values: [3200, 3800, 3400, 8000],
      colors: ["#f8e16c", "#4cc9f0", "#4361ee", "#b5179e"],
      labels: ["Shade 1", "Shade 2", "Shade 3", "Shade 4"],
    },
    {
      month: "June",
      values: [3500, 4200, 3000, 6500],
      colors: ["#f8e16c", "#4cc9f0", "#4361ee", "#b5179e"],
      labels: ["Shade 1", "Shade 2", "Shade 3", "Shade 4"],
    },
  ]

  // Mock data for user status
  const userStatusData = [
    { label: "Active", value: 850, color: "#06d6a0" },
    { label: "Inactive", value: 320, color: "#ff9f1c" },
    { label: "Suspended", value: 80, color: "#e63946" },
  ]

  // Mock data for user roles
  const userRolesData = [
    { label: "Students", value: 980, color: "#4361ee" },
    { label: "Faculty", value: 65, color: "#7209b7" },
    { label: "Secretaries", value: 15, color: "#06d6a0" },
    { label: "Admins", value: 5, color: "#e63946" },
  ]

  // Mock data for user activity
  const userActivityData = [
    { date: "2025-04-01", logins: 120, registrations: 15 },
    { date: "2025-04-02", logins: 135, registrations: 12 },
    { date: "2025-04-03", logins: 110, registrations: 8 },
    { date: "2025-04-04", logins: 95, registrations: 10 },
    { date: "2025-04-05", logins: 80, registrations: 5 },
    { date: "2025-04-06", logins: 70, registrations: 3 },
    { date: "2025-04-07", logins: 140, registrations: 18 },
  ]

  // Mock data for entity table
  const entityTableData = [
    {
      id: 1,
      name: "Robotics Club",
      type: "Club",
      department: "Computer Science",
      members: 45,
      events: 12,
      status: "Active",
    },
    {
      id: 2,
      name: "IEEE Student Branch",
      type: "Professional Society",
      department: "Electrical Engineering",
      members: 78,
      events: 15,
      status: "Active",
    },
    {
      id: 3,
      name: "Drama Club",
      type: "Club",
      department: "Arts",
      members: 32,
      events: 8,
      status: "Active",
    },
    {
      id: 4,
      name: "Mechanical Society",
      type: "Department Society",
      department: "Mechanical Engineering",
      members: 56,
      events: 10,
      status: "Inactive",
    },
    {
      id: 5,
      name: "AI Research Group",
      type: "Community",
      department: "Computer Science",
      members: 28,
      events: 6,
      status: "Active",
    },
  ]

  // Mock data for configuration progress
  const configProgressData = [
    { label: "Entity Types", value: 4, max: 5, color: "#4361ee" },
    { label: "Roles", value: 5, max: 8, color: "#06d6a0" },
    { label: "Permissions", value: 5, max: 5, color: "#7209b7" },
    { label: "Departments", value: 8, max: 10, color: "#ff9f1c" },
  ]

  // Mock data for system health
  const systemHealthData = [
    { label: "Server Uptime", value: 99.8, color: "#06d6a0" },
    { label: "Database Performance", value: 92.5, color: "#4361ee" },
    { label: "API Response Time", value: 85.3, color: "#ff9f1c" },
    { label: "Storage Usage", value: 68.7, color: "#e63946" },
  ]

  // Render tab content with the new layout
  const renderTabContent = () => {
    if (activeTab === "overview") {
      return (
        <>
          <div className={styles.overviewLayout}>
            <div className={styles.mainContentArea}>
              <div className={styles.statsGrid}>
                <StatCard title="USERS" value={userCount1?.length} icon="👥" color="blue" />
                <StatCard title="EVENTS" value={"1"} icon="📅" color="green" />
                <StatCard
                  title="ENTITIES"
                  value={
                    entityCounts.club +
                    entityCounts.departmentSociety +
                    entityCounts.professionalSociety +
                    entityCounts.community
                  }
                  icon="🏢"
                  color="purple"
                />
              </div>

              <div className={styles.chartSection}>
                <div className={styles.chartCard}>
                  <div className={styles.chartHeader}>
                    <h3>Department-wise Events</h3>
                    <div className={styles.chartFilters}>
                      <select
                        className={styles.filterSelect}
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
                  </div>
                  <DepartmentEventChart data={departmentEventData} filter={departmentFilter} />
                </div>
              </div>
            </div>

            <div className={styles.sidebarArea}>
              <div className={styles.calendarCard}>
                <h3>Calendar</h3>
                <EnhancedCalendar events={calendarEvents} />
              </div>
            </div>
          </div>

          <div>
            <div className={styles.twoColumnSection}>
              <div className={styles.columnCard}>
                <div className={styles.chartHeader}>
                  <h3>Flagship Events</h3>
                  <div className={styles.chartFilters}>
                    <select
                      className={styles.filterSelect}
                      value={flagshipFilter}
                      onChange={(e) => setFlagshipFilter(e.target.value)}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>
                <FlagshipChart data={flagshipEventData} filter={flagshipFilter} />
              </div>
              <div className={styles.columnCard}>
                <h3>Notifications</h3>
                <NotificationPanel notifications={notifications} />
              </div>
            </div>
          </div>
        </>
      )
    } else if (activeTab === "proposedcalender") {
      return (
        <>
          <div >
            <div className={styles.twoColumnSectionPro}>
              <div className={styles.columnCard}>
                <div className={styles.chartHeader}>
                  <h3>Proposed Calendar</h3>
                </div>
                <div>
                  <div className={styles.tableContainer}>
                    <table className={styles.calendarDataTable}>
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Event Name</th>
                          <th>Activity Type</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Budget</th>
                          <th>Status</th>
                          <th>Entity</th>
                          <th>Department</th>
                          <th>Secretary</th>
                          <th>Faculty Advisory</th>
                          <th>SDG</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {proposedCalender &&
                          proposedCalender.map((event, index) => (
                            <tr key={event.pc_id || index}>
                              <td className={styles.idCell}>{index + 1}</td>
                              <td className={styles.eventTitleCell}>
                                <div className={styles.eventTitle}>{event.event_name || "Untitled Event"}</div>
                                {event.description && (
                                  <div className={styles.eventDescription}>
                                    {event.description.length > 80
                                      ? `${event.description.substring(0, 80)}...`
                                      : event.description}
                                  </div>
                                )}
                              </td>
                              <td className={styles.activityTypeCell}>
                                <span
                                  className={`${styles.activityBadge} ${
                                    styles[`activity${event.activity_type?.toLowerCase()}`]
                                  }`}
                                >
                                  {event.activity_type || "N/A"}
                                </span>
                              </td>
                              <td className={styles.dateCell}>{formatDate(event.start_date)}</td>
                              <td className={styles.dateCell}>{formatDate(event.end_date)}</td>
                              <td className={styles.budgetCell}>{event.proposed_budget}</td>
                              <td className={styles.statusCell}>
                                <span
                                  className={`${styles.statusBadge} ${
                                    styles[`status${(event.status || "pending").toLowerCase()}`]
                                  }`}
                                >
                                  {event.status || "Pending"}
                                </span>
                              </td>
                              <td className={styles.entityCell}>
                                <div className={styles.entityInfo}>
                                  <div className={styles.entityName}>{event.entity_name || "N/A"}</div>
                                  <div className={styles.registrationName}>{event.registeration_name || ""}</div>
                                </div>
                              </td>
                              <td className={styles.departmentCell}>
                                <div className={styles.departmentInfo}>
                                  <div className={styles.departmentName}>{event.department_name || "N/A"}</div>
                                  <div className={styles.clusterName}>{event.cluster_name || ""}</div>
                                </div>
                              </td>
                              <td className={styles.contactCell}>
                                <div className={styles.contactInfo}>
                                  <div className={styles.contactName}>{event.Secretary_Name || "N/A"}</div>
                                  <div className={styles.contactEmail}>{event.Secretary_Email || ""}</div>
                                  <div className={styles.contactMobile}>{event.Secretary_Mobile || ""}</div>
                                </div>
                              </td>
                              <td className={styles.contactCell}>
                                <div className={styles.contactInfo}>
                                  <div className={styles.contactName}>{event.Faculty_Advisory_Name || "N/A"}</div>
                                  <div className={styles.contactEmail}>{event.Faculty_Advisory_Email || ""}</div>
                                  <div className={styles.contactMobile}>{event.Faculty_Advisory_Mobile || ""}</div>
                                  {event.Faculty_Advisory_Empcode && (
                                    <div className={styles.empCode}>Emp: {event.Faculty_Advisory_Empcode}</div>
                                  )}
                                </div>
                              </td>
                              <td className={styles.sdgCell}>
                                <div className={styles.sdgInfo}>
                                  <div className={styles.sdgName}>{event.sdg_name || "N/A"}</div>
                                  <div className={styles.actedName}>
                                    {event.acted_name ? `${event.acted_name} - ${event.acted_fullform}` : ""}
                                  </div>
                                  <div className={styles.nsqfName}>{event.nsqf_name || ""}</div>
                                </div>
                              </td>
                              <td className={styles.actionsCell}>
                                <div className={styles.tableActions}>
                                  <button
                                    className={styles.viewButton}
                                    onClick={() => handleViewEvent(event)}
                                    title="View Event Details"
                                  >
                                    👁️ View
                                  </button>
                                  <button
                                    className={styles.deleteButton}
                                    onClick={() => deleteProposedCalendar(event.pc_id)}
                                    disabled={deleting === event.pc_id}
                                    title="Delete Event"
                                  >
                                    {deleting === event.pc_id ? "..." : "🗑️ Delete"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )
    } else if (activeTab === "entities") {
      return (
        <div className={styles.regularTabContent}>
          <div className={styles.sectionHeader}>
            <h2>Entity Management</h2>
            <button className={styles.actionButton}>+ Add Entity</button>
          </div>

          <div className={styles.statsGrid}>
            <StatCard title="Clubs" value={entityCounts.club} icon="👥" color="blue" />
            <StatCard title="Department Societies" value={entityCounts.departmentSociety} icon="📚" color="green" />
            <StatCard
              title="Professional Societies"
              value={entityCounts.professionalSociety}
              icon="📋"
              color="purple"
            />
            <StatCard title="Communities" value={entityCounts.community} icon="👥" color="orange" />
          </div>

          <div className={styles.twoColumnSection}>
            <div className={styles.columnCard}>
              <h3>Entity Distribution</h3>
              <PieChart data={entityTypePieData} title="Entity Types" />
            </div>
            <div className={styles.columnCard}>
              <h3>Entity Growth</h3>
              <LineBarChart data={defectReductionData} title="Entity Growth & Reduction" />
            </div>
          </div>

          <div className={styles.chartSection}>
            <div className={styles.chartCard}>
              <h3>Monthly Entity Activity</h3>
              <StackedBarChart data={monthlySalesData} title="Monthly Entity Activity" />
            </div>
          </div>

          <div className={styles.chartSection}>
            <div className={styles.chartCard}>
              <h3>Registered Entities</h3>
              <DataTable
                data={entityTableData}
                columns={[
                  { header: "ID", accessor: "id" },
                  { header: "Name", accessor: "name" },
                  { header: "Type", accessor: "type" },
                  { header: "Department", accessor: "department" },
                  { header: "Members", accessor: "members" },
                  { header: "Events", accessor: "events" },
                  {
                    header: "Status",
                    accessor: "status",
                    render: (row) => (
                      <span className={`${styles.statusBadge} ${styles[`status${row.status}`]}`}>{row.status}</span>
                    ),
                  },
                  {
                    header: "Actions",
                    accessor: "",
                    render: (row) => (
                      <div className={styles.tableActions}>
                        <button className={styles.actionButtonSmall}>View</button>
                        <button className={styles.actionButtonSmall}>Edit</button>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      )
    } else if (activeTab === "users") {
      return (
        <div className={styles.regularTabContent}>
          <div className={styles.sectionHeader}>
            <h2>User Management</h2>
            <button className={styles.actionButton}>+ Add User</button>
          </div>

          <div className={styles.statsGrid}>
            <StatCard title="Total Users" value={userData.totalUsers} icon="👥" color="blue" />
            <StatCard title="Faculty" value={userData.totalFaculty} icon="📚" color="red" />
            <StatCard title="Secretary" value={userData.totalSecretary} icon="📋" color="green" />
            <StatCard title="News" value={userData.totalNews} icon="📰" color="purple" />
          </div>

          <div className={styles.twoColumnSection}>
            <div className={styles.columnCard}>
              <h3>User Status</h3>
              <PieChart data={userStatusData} title="User Status" />
            </div>
            <div className={styles.columnCard}>
              <h3>User Roles</h3>
              <PieChart data={userRolesData} title="User Roles" />
            </div>
          </div>

          <div className={styles.chartSection}>
            <div className={styles.chartCard}>
              <h3>User Activity (Last 7 Days)</h3>
              <div className={styles.lineBarChartContainer}>
                <div className={styles.lineBarChart}>
                  <div className={styles.chartContent}>
                    {userActivityData.map((item, index) => (
                      <div key={index} className={styles.chartColumn}>
                        <div
                          className={styles.barColumn}
                          style={{
                            height: `${(item.logins / 150) * 80}%`,
                            backgroundColor: "#4361ee",
                          }}
                        >
                          <div className={styles.barValue}>{item.logins}</div>
                        </div>
                        <div
                          className={styles.barColumnOverlay}
                          style={{
                            height: `${(item.registrations / 150) * 80}%`,
                            backgroundColor: "#06d6a0",
                          }}
                        >
                          <div className={styles.barValue}>{item.registrations}</div>
                        </div>
                        <div className={styles.columnLabel}>
                          {new Date(item.date).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.chartLegend}>
                  <div className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: "#4361ee" }}></div>
                    <span>Logins</span>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={styles.legendColor} style={{ backgroundColor: "#06d6a0" }}></div>
                    <span>New Registrations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.chartSection}>
            <div className={styles.chartCard}>
              <h3>Recent User Activity</h3>
              <DataTable
                data={[
                  {
                    id: 1,
                    name: "John Doe",
                    email: "john.doe@example.com",
                    role: "Student",
                    lastLogin: "2025-04-26 09:45 AM",
                    status: "Active",
                  },
                  {
                    id: 2,
                    name: "Jane Smith",
                    email: "jane.smith@example.com",
                    role: "Faculty",
                    lastLogin: "2025-04-26 08:30 AM",
                    status: "Active",
                  },
                  {
                    id: 3,
                    name: "Robert Johnson",
                    email: "robert.j@example.com",
                    role: "Secretary",
                    lastLogin: "2025-04-25 04:15 PM",
                    status: "Active",
                  },
                  {
                    id: 4,
                    name: "Emily Davis",
                    email: "emily.d@example.com",
                    role: "Student",
                    lastLogin: "2025-04-25 02:20 PM",
                    status: "Inactive",
                  },
                  {
                    id: 5,
                    name: "Michael Wilson",
                    email: "michael.w@example.com",
                    role: "Student",
                    lastLogin: "2025-04-24 11:10 AM",
                    status: "Suspended",
                  },
                ]}
                columns={[
                  { header: "ID", accessor: "id" },
                  { header: "Name", accessor: "name" },
                  { header: "Email", accessor: "email" },
                  { header: "Role", accessor: "role" },
                  { header: "Last Login", accessor: "lastLogin" },
                  {
                    header: "Status",
                    accessor: "status",
                    render: (row) => (
                      <span className={`${styles.statusBadge} ${styles[`status${row.status}`]}`}>{row.status}</span>
                    ),
                  },
                  {
                    header: "Actions",
                    accessor: "",
                    render: (row) => (
                      <div className={styles.tableActions}>
                        <button className={styles.actionButtonSmall}>View</button>
                        <button className={styles.actionButtonSmall}>Edit</button>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      )
    } else if (activeTab === "config") {
      return (
        <div className={styles.regularTabContent}>
          <div className={styles.sectionHeader}>
            <h2>System Configuration</h2>
          </div>

          <div className={styles.statsGrid}>
            <StatCard title="Entity Types" value={configData.entityTypes.length} icon="🏢" color="blue" />
            <StatCard title="Roles" value={configData.roles.length} icon="👤" color="green" />
            <StatCard title="Departments" value={configData.departments.length} icon="🏫" color="purple" />
            <StatCard title="Sessions" value={configData.sessions.length} icon="📅" color="orange" />
          </div>

          <div className={styles.twoColumnSection}>
            <div className={styles.columnCard}>
              <h3>Configuration Progress</h3>
              <div className={styles.progressSection}>
                {configProgressData.map((item, index) => (
                  <ProgressBar key={index} value={item.value} max={item.max} label={item.label} color={item.color} />
                ))}
              </div>
            </div>
            <div className={styles.columnCard}>
              <h3>System Health</h3>
              <div className={styles.progressSection}>
                {systemHealthData.map((item, index) => (
                  <ProgressBar key={index} value={item.value} max={100} label={item.label} color={item.color} />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.configGrid}>
            <div className={styles.configPanel}>
              <h3 className={styles.configTitle}>Entity Types</h3>
              <div className={styles.configItems}>
                {configData.entityTypes.map((item, index) => (
                  <div key={index} className={styles.configItem}>
                    <span>{item}</span>
                    <button className={styles.configEditButton}>Edit</button>
                  </div>
                ))}
              </div>
              <button className={styles.configAddButton}>+ Add Entity Type</button>
            </div>
            <div className={styles.configPanel}>
              <h3 className={styles.configTitle}>Roles</h3>
              <div className={styles.configItems}>
                {configData.roles.map((item, index) => (
                  <div key={index} className={styles.configItem}>
                    <span>{item}</span>
                    <button className={styles.configEditButton}>Edit</button>
                  </div>
                ))}
              </div>
              <button className={styles.configAddButton}>+ Add Role</button>
            </div>
            <div className={styles.configPanel}>
              <h3 className={styles.configTitle}>Departments</h3>
              <div className={styles.configItems}>
                {configData.departments.map((item, index) => (
                  <div key={index} className={styles.configItem}>
                    <span>{item}</span>
                    <button className={styles.configEditButton}>Edit</button>
                  </div>
                ))}
              </div>
              <button className={styles.configAddButton}>+ Add Department</button>
            </div>
            <div className={styles.configPanel}>
              <h3 className={styles.configTitle}>Sessions</h3>
              <div className={styles.configItems}>
                {configData.sessions.map((item, index) => (
                  <div key={index} className={styles.configItem}>
                    <span>{item}</span>
                    <button className={styles.configEditButton}>Edit</button>
                  </div>
                ))}
              </div>
              <button className={styles.configAddButton}>+ Add Session</button>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tabButton} ${activeTab === "overview" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "proposedcalender" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("proposedcalender")}
          >
            Proposed Calendar
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "entities" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("entities")}
          >
            Entities
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "users" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "config" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("config")}
          >
            Configuration
          </button>
        </div>
      </div>

      <div className={styles.tabContent}>{renderTabContent()}</div>

      {/* Event Detail Drawer */}
      <EventDetailDrawer isOpen={drawerOpen} onClose={handleCloseDrawer} event={selectedEvent} />
    </div>
  )
}

export default NewAdminDashboard
