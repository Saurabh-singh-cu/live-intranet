import React, { useState, useEffect } from "react";
import styles from "./CoCurricularCoordinator.module.css";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CoCurricularCoordinator = () => {
  const [userData, setUserData] = useState({});
  const [permission, setPermission] = useState([]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Event Request",
      message: "New Event Request Received!",
    },
    {
      id: 2,
      title: "Budget Approval",
      message: "Annual budget for session 2025 is live!",
    },
    {
      id: 3,
      title: "Meeting Reminder",
      message: "Staff meeting tomorrow at 10 AM",
    },
  ]);

  const [studentData, setStudentData] = useState([
    { id: 1, name: "Alice Johnson", activity: "Chess Club", hours: 20 },
    { id: 2, name: "Bob Smith", activity: "Debate Team", hours: 15 },
    { id: 3, name: "Charlie Brown", activity: "Soccer Team", hours: 25 },
    { id: 4, name: "Diana Ross", activity: "Art Club", hours: 18 },
    { id: 5, name: "Ethan Hunt", activity: "Drama Club", hours: 22 },
  ]);

  const barChartData = {
    labels: ["Club", "Department", "Professional", "Community", "Extra"],
    datasets: [
      {
        label: "Student Participation",
        data: [312, 402, 203, 180, 12],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Event Attendance",
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const activityCards = [
    {
      id: 1,
      title: "Flagship",
      description: "Major institutional events and programs",
      count: 15,
      color: "#4f46e5", // Indigo
      icon: "🏆",
    },
    {
      id: 2,
      title: "Monthly",
      description: "Regular monthly activities and events",
      count: 28,
      color: "#0891b2", // Cyan
      icon: "📅",
    },
    {
      id: 3,
      title: "Regularly",
      description: "Ongoing activities and programs",
      count: 42,
      color: "#059669", // Emerald
      icon: "🔄",
    },
  ];

  useEffect(() => {
    const getUserInfo = JSON.parse(localStorage.getItem("user"));
    setUserData(getUserInfo);
    console.log(getUserInfo);
    setPermission(getUserInfo?.permissions);
  }, []);

  const downloadExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Name,Activity,Hours\n";
    studentData.forEach((row) => {
      csvContent += `${row.id},${row.name},${row.activity},${row.hours}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Co-Curricular Coordinator</h1>
        <div className={styles.userInfo}>
          <p>
            <strong>{userData.user_name}</strong>
          </p>
          <p>{userData.role_name}</p>
          <p>{userData.department}</p>
          <p>
            <ul>
              {permission?.map((perm, index) => (
                <li key={index}>
                  {perm.permission_name} - {perm.entity_name}
                </li>
              ))}
            </ul>
          </p>

          {/* <p>{userData}</p> */}
        </div>
      </header>

      <section className={styles.activitySection}>
       
        <div className={styles.activityCards}>
          {activityCards.map((card) => (
            <div
              key={card.id}
              className={styles.activityCard}
              style={{ borderTop: `4px solid ${card.color}` }}
            >
              <span style={{display:"flex", justifyContent:"space-between"}}>
                <h3 className={styles.activityTitle}>{card.title}</h3>
                <div className={styles.activityIcon}>{card.icon}</div>
              </span>
              <p className={styles.activityDescription}>{card.description}</p>
              <div className={styles.activityCount}>
                <span >{card.count}</span>
                <span className={styles.activityLabel}>Activities</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.notificationSection}>
        <h2>Notifications🔔</h2>
        <div className={styles.notificationCards}>
          {notifications.map((notification) => (
            <div key={notification.id} className={styles.notificationCard}>
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.graphSection}>
        <div className={styles.graph}>
          <h3>Student Participation by Club</h3>
          <Bar data={barChartData} />
        </div>
        <div className={styles.graph}>
          <h3>Event Attendance Trend</h3>
          <Line data={lineChartData} />
        </div>
      </section>

      <section className={styles.tableSection}>
        <h2>Student Activity Data</h2>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Activity</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            {studentData.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.activity}</td>
                <td>{student.hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className={styles.downloadButton} onClick={downloadExcel}>
          Download Excel
        </button>
      </section>
    </div>
  );
};

export default CoCurricularCoordinator;
