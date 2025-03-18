import React, { useState, useEffect } from "react";
import styles from "./ExecutiveDashboard.module.css";

const ExecutiveDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = localStorage.getItem("user");
        if (userDataString) {
          setUserData(JSON.parse(userDataString));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const upcomingEvents = [
    { id: 1, name: "Faculty Research Symposium", date: "2023-09-15", location: "Main Auditorium", attendees: 150 },
    { id: 2, name: "International Conference on Academic Affairs", date: "2023-10-01", location: "Conference Center", attendees: 300 },
    { id: 3, name: "Student-Faculty Networking Event", date: "2023-10-15", location: "University Quad", attendees: 200 },
  ];

  const tasks = [
    { id: 1, title: "Update event database for Fall semester", deadline: "2023-08-30", priority: "High", status: "In Progress" },
    { id: 2, title: "Coordinate with department heads for upcoming events", deadline: "2023-09-10", priority: "Medium", status: "Not Started" },
    { id: 3, title: "Prepare report on last month's events", deadline: "2023-09-05", priority: "Low", status: "Completed" },
  ];

  const stats = [
    { label: "Total Events", value: 15 },
    { label: "Upcoming Events", value: 8 },
    { label: "Completed Events", value: 7 },
    { label: "Open Tasks", value: 12 },
  ];

  if (isLoading) {
    return <div className={styles.loading}>Loading user data...</div>;
  }

  if (!userData) {
    return <div className={styles.error}>Error loading user data. Please try again.</div>;
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Event Data Manager</h1>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{userData.user_name}</span>
            <span className={styles.userDepartment}>{userData.department}</span>
          </div>
        </div>
      </header>

      <nav className={styles.nav}>
        <button
          className={`${styles.navButton} ${activeTab === "overview" ? styles.active : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`${styles.navButton} ${activeTab === "events" ? styles.active : ""}`}
          onClick={() => setActiveTab("events")}
        >
          Events
        </button>
        <button
          className={`${styles.navButton} ${activeTab === "tasks" ? styles.active : ""}`}
          onClick={() => setActiveTab("tasks")}
        >
          Tasks
        </button>
      </nav>

      <main className={styles.main}>
        {activeTab === "overview" && (
          <section className={styles.overview}>
            <h2>Dashboard Overview</h2>
            <div className={styles.statsGrid}>
              {stats.map((stat, index) => (
                <div key={index} className={styles.statCard}>
                  <h3>{stat.label}</h3>
                  <p>{stat.value}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "events" && (
          <section className={styles.events}>
            <h2>Upcoming Events</h2>
            <ul className={styles.eventList}>
              {upcomingEvents.map((event) => (
                <li key={event.id} className={styles.eventItem}>
                  <h3>{event.name}</h3>
                  <p>Date: {event.date}</p>
                  <p>Location: {event.location}</p>
                  <p>Expected Attendees: {event.attendees}</p>
                  <button className={styles.actionButton}>Manage Event</button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {activeTab === "tasks" && (
          <section className={styles.tasks}>
            <h2>Tasks</h2>
            <ul className={styles.taskList}>
              {tasks.map((task) => (
                <li key={task.id} className={styles.taskItem}>
                  <h3>{task.title}</h3>
                  <p>Deadline: {task.deadline}</p>
                  <p className={styles[task.priority.toLowerCase()]}>Priority: {task.priority}</p>
                  <p>Status: {task.status}</p>
                  <button className={styles.actionButton}>Update Status</button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Role: {userData.role_name} </p>
        <p>Session Expires: {new Date(userData.token_expiration_time).toLocaleString()}</p>
      </footer>
    </div>
  );
};

export default ExecutiveDashboard;
