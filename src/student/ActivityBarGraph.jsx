import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import styles from "./ActivityBarGraph.module.css"

const ActivityBarGraph = () => {
  const data = [
    {
      name: "Total User",
      student: 0,
      faculty: 0,
    },
    {
      name: "Active User",
      student: 0,
      faculty: 0,
    },
    {
      name: "Inactive User",
      student: 0,
      faculty: 0,
    },
    // {
    //   name: "Successful Awards",
    //   student: 580,
    //   faculty: 40,
    // },
    // {
    //   name: "Research Articles",
    //   student: 90,
    //   faculty: 120,
    // },
  ]

  return (
    <div className={styles.graphContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.icon}>📊</span> Overall Impact
        </h2>
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Total Students</span>
          <span className={styles.statValue}>0</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Total Faculty</span>
          <span className={styles.statValue}>0</span>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
              formatter={(value, name) => [`${value}`, name === "student" ? "Students" : "Faculty"]}
            />
            <Legend
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value) => (value === "student" ? "Students" : "Faculty")}
            />
            <Bar dataKey="student" fill="#4a6da7" radius={[4, 4, 0, 0]} />
            <Bar dataKey="faculty" fill="#8abbee" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: "#4a6da7" }}></div>
          <span>Students</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: "#8abbee" }}></div>
          <span>Faculty</span>
        </div>
      </div> */}
    </div>
  )
}

export default ActivityBarGraph

