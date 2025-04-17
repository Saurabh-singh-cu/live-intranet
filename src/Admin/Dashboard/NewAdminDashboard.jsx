"use client"

import { useState, useEffect } from "react"
import styles from "./NewAdminDashboard.module.css"


import { LineChart, PieChart, BarChart } from "./Charts"
import apiClient from "../../config/apiClient"
import StatCard from "./StatCard"
import ActivityFeed from "./ActivityFeed"
import Calendar from "./Calendar" 
import EntityTable from "./EntityTable"
import ConfigPanel from "./ConfigPanel"


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

  // Fetch entity counts
  const fetchEntityCounts = async () => {
    try {
      const response = await apiClient.get("entity_count/")
      const data = response.data

      // Map the API response to our state structure
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
      // Using the apiUrls object to fetch configuration data
      const apiUrls = {
        "entity-types": "entity-types/",
        roles_permissions: "roles_permissions/",
        roles: "roles/",
        departments: "departments/",
        sessions: "sessions/",
        genders: "genders/",
        title: "title/",
        designation: "designation/",
      }

      // For demonstration, we'll use mock data
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
    // Mock user data
    setUserData({
      totalUsers: 1250,
      totalRegisteredMembers: 980,
      totalPayments: 456,
      totalAnnouncements: 78,
      totalNews: 42,
      totalSecretary: 15,
      totalFaculty: 65,
    })

    // Mock activity data
    setActivityData({
      entityRequests: 24,
      registeredEntities: 156,
      eventPublishRequests: 38,
    })

    // Mock calendar events
    setCalendarEvents([
      { id: 1, title:  ["Annual Meeting"], date: "2025-04-20", type: "important" },
      { id: 2, title: "Tech Workshop", date: "2025-04-25", type: "workshop" },
      { id: 3, title: "Club Registration", date: "2025-05-01", type: "registration" },
      { id: 4, title: "Faculty Meeting", date: "2025-05-05", type: "meeting" },
      { id: 5, title: "Sports Event", date: "2025-05-10", type: "event" },
    ])
  }

  useEffect(() => {
    fetchEntityCounts()
    fetchConfigData()
    fetchMockData()
    // In a real app, you would fetch all the other data here using apiClient
  }, [])

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

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className={styles.tabContent}>
          <div className={styles.statsGrid}>
            <StatCard title="Total Users" value={userData.totalUsers} icon="users" color="blue" />
            <StatCard
              title="Registered Members"
              value={userData.totalRegisteredMembers}
              icon="user-check"
              color="green"
            />
            <StatCard title="Total Payments" value={userData.totalPayments} icon="dollar-sign" color="purple" />
            <StatCard title="Announcements" value={userData.totalAnnouncements} icon="bell" color="orange" />
          </div>

          <div className={styles.chartSection}>
            <div className={styles.chartCard}>
              <h3>User Growth</h3>
              <LineChart />
            </div>
          </div>

          <div className={styles.twoColumnSection}>
            <div className={styles.columnCard}>
              <h3>Entity Distribution</h3>
              <div className={styles.entityStats}>
                <div className={styles.entityStat}>
                  <span className={styles.entityLabel}>Clubs</span>
                  <span className={styles.entityValue}>{entityCounts.club}</span>
                </div>
                <div className={styles.entityStat}>
                  <span className={styles.entityLabel}>Department Societies</span>
                  <span className={styles.entityValue}>{entityCounts.departmentSociety}</span>
                </div>
                <div className={styles.entityStat}>
                  <span className={styles.entityLabel}>Professional Societies</span>
                  <span className={styles.entityValue}>{entityCounts.professionalSociety}</span>
                </div>
                <div className={styles.entityStat}>
                  <span className={styles.entityLabel}>Communities</span>
                  <span className={styles.entityValue}>{entityCounts.community}</span>
                </div>
              </div>
              <PieChart
                data={[
                  { name: "Clubs", value: entityCounts.club },
                  { name: "Department Society", value: entityCounts.departmentSociety },
                  { name: "Professional Society", value: entityCounts.professionalSociety },
                  { name: "Community", value: entityCounts.community },
                ]}
              />
            </div>
            <div className={styles.columnCard}>
              <h3>Recent Activity</h3>
              <ActivityFeed data={activityData} />
            </div>
          </div>

          <div className={styles.calendarSection}>
            <h3>Upcoming Events</h3>
            <Calendar events={calendarEvents} />
          </div>
        </div>
      )}

      {/* Entities Tab */}
      {activeTab === "entities" && (
        <div className={styles.tabContent}>
          <div className={styles.sectionHeader}>
            <h2>Entity Management</h2>
            <button className={styles.actionButton}>+ Add Entity</button>
          </div>

          <div className={styles.statsGrid}>
            <StatCard title="Clubs" value={entityCounts.club} icon="users" color="blue" />
            <StatCard title="Department Societies" value={entityCounts.departmentSociety} icon="book" color="green" />
            <StatCard
              title="Professional Societies"
              value={entityCounts.professionalSociety}
              icon="clipboard"
              color="purple"
            />
            <StatCard title="Communities" value={entityCounts.community} icon="users" color="orange" />
          </div>

          <div className={styles.chartSection}>
            <div className={styles.chartCard}>
              <h3>Entity Distribution</h3>
              <BarChart
                data={[
                  { name: "Clubs", value: entityCounts.club },
                  { name: "Department Society", value: entityCounts.departmentSociety },
                  { name: "Professional Society", value: entityCounts.professionalSociety },
                  { name: "Community", value: entityCounts.community },
                ]}
              />
            </div>
          </div>

          <div className={styles.tableSection}>
            <h3>Entity Requests</h3>
            <EntityTable />
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className={styles.tabContent}>
          <div className={styles.sectionHeader}>
            <h2>User Management</h2>
            <button className={styles.actionButton}>+ Add User</button>
          </div>

          <div className={styles.statsGrid}>
            <StatCard title="Total Users" value={userData.totalUsers} icon="users" color="blue" />
            <StatCard title="Faculty" value={userData.totalFaculty} icon="book" color="red" />
            <StatCard title="Secretary" value={userData.totalSecretary} icon="clipboard" color="green" />
            <StatCard title="News" value={userData.totalNews} icon="file-text" color="purple" />
          </div>

          <div className={styles.chartSection}>
            <div className={styles.chartCard}>
              <h3>User Distribution</h3>
              <PieChart
                data={[
                  { name: "Faculty", value: userData.totalFaculty },
                  { name: "Secretary", value: userData.totalSecretary },
                  { name: "Students", value: userData.totalUsers - userData.totalFaculty - userData.totalSecretary },
                ]}
              />
            </div>
          </div>

          <div className={styles.tableSection}>
            <h3>User List</h3>
            <div className={styles.tableFilters}>
              <input type="text" placeholder="Search users..." className={styles.searchInput} />
              <select className={styles.filterSelect}>
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="faculty">Faculty</option>
                <option value="student">Student</option>
                <option value="secretary">Secretary</option>
              </select>
              <button className={styles.filterButton}>Filter</button>
            </div>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Doe</td>
                  <td>john.doe@example.com</td>
                  <td>Faculty</td>
                  <td>Computer Science</td>
                  <td>
                    <span className={styles.statusActive}>Active</span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={styles.editButton}>Edit</button>
                      <button className={styles.deleteButton}>Delete</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Jane Smith</td>
                  <td>jane.smith@example.com</td>
                  <td>Student</td>
                  <td>Electrical Engineering</td>
                  <td>
                    <span className={styles.statusActive}>Active</span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={styles.editButton}>Edit</button>
                      <button className={styles.deleteButton}>Delete</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Robert Johnson</td>
                  <td>robert.j@example.com</td>
                  <td>Secretary</td>
                  <td>Mechanical Engineering</td>
                  <td>
                    <span className={styles.statusInactive}>Inactive</span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={styles.editButton}>Edit</button>
                      <button className={styles.deleteButton}>Delete</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Emily Davis</td>
                  <td>emily.d@example.com</td>
                  <td>Admin</td>
                  <td>Administration</td>
                  <td>
                    <span className={styles.statusActive}>Active</span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={styles.editButton}>Edit</button>
                      <button className={styles.deleteButton}>Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className={styles.tablePagination}>
              <button className={styles.paginationButton}>Previous</button>
              <div className={styles.paginationNumbers}>
                <button className={`${styles.pageNumber} ${styles.activePage}`}>1</button>
                <button className={styles.pageNumber}>2</button>
                <button className={styles.pageNumber}>3</button>
              </div>
              <button className={styles.paginationButton}>Next</button>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Tab */}
      {activeTab === "config" && (
        <div className={styles.tabContent}>
          <div className={styles.sectionHeader}>
            <h2>System Configuration</h2>
          </div>

          <div className={styles.configGrid}>
            <ConfigPanel title="Entity Types" items={configData.entityTypes} />
            <ConfigPanel title="Roles" items={configData.roles} />
            <ConfigPanel title="Departments" items={configData.departments} />
            <ConfigPanel title="Sessions" items={configData.sessions} />
            <ConfigPanel title="Titles" items={configData.titles} />
            <ConfigPanel title="Designations" items={configData.designations} />
          </div>

          <div className={styles.tableSection}>
            <h3>Role Permissions</h3>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Role</th>
                  {configData.permissions.map((perm, index) => (
                    <th key={index}>{perm}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {configData.roles.map((role, index) => (
                  <tr key={index}>
                    <td>{role}</td>
                    {configData.permissions.map((perm, permIndex) => (
                      <td key={permIndex}>
                        <input type="checkbox" defaultChecked={permIndex < 3 || role === "Admin"} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewAdminDashboard
