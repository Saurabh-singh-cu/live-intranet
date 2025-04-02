// "use client"

// import { useState, useEffect } from "react"
// import styles from "./ActivityBarGraph.module.css"

// const ActivityBarGraph = ({ data }) => {
//   const [animated, setAnimated] = useState(false)

//   // Find the maximum value for scaling
//   const maxValue = Math.max(
//     data.iic.announced,
//     data.iic.submitted,
//     data.iic.approved,
//     data.mic.announced,
//     data.mic.submitted,
//     data.mic.approved,
//     data.self.announced,
//     data.self.submitted,
//     data.self.approved,
//     1, // Ensure we have at least a value of 1 to avoid division by zero
//   )

//   // Animation effect
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setAnimated(true)
//     }, 300)

//     return () => clearTimeout(timer)
//   }, [])

//   // Calculate height percentage based on value
//   const getHeight = (value) => {
//     return `${(value / maxValue) * 100}%`
//   }

//   return (
//     <div className={styles.graphContainer}>
//       <div className={styles.graphTitle}>Activities Overview</div>

//       <div className={styles.barGroups}>
//         <div className={styles.barGroup}>
//           <div className={styles.barLabel}>IIC</div>
//           <div className={styles.bars}>
//             <div className={styles.barWrapper}>
//               <div
//                 className={`${styles.bar} ${styles.announced} ${animated ? styles.animate : ""}`}
//                 style={{ height: animated ? getHeight(data.iic.announced) : "0%" }}
//               >
//                 <span className={styles.barValue}>{data.iic.announced}</span>
//               </div>
//               <div className={styles.barType}>Announced</div>
//             </div>

//             <div className={styles.barWrapper}>
//               <div
//                 className={`${styles.bar} ${styles.submitted} ${animated ? styles.animate : ""}`}
//                 style={{ height: animated ? getHeight(data.iic.submitted) : "0%" }}
//               >
//                 <span className={styles.barValue}>{data.iic.submitted}</span>
//               </div>
//               <div className={styles.barType}>Submitted</div>
//             </div>

//             <div className={styles.barWrapper}>
//               <div
//                 className={`${styles.bar} ${styles.approved} ${animated ? styles.animate : ""}`}
//                 style={{ height: animated ? getHeight(data.iic.approved) : "0%" }}
//               >
//                 <span className={styles.barValue}>{data.iic.approved}</span>
//               </div>
//               <div className={styles.barType}>Approved</div>
//             </div>
//           </div>
//         </div>

//         <div className={styles.barGroup}>
//           <div className={styles.barLabel}>MIC</div>
//           <div className={styles.bars}>
//             <div className={styles.barWrapper}>
//               <div
//                 className={`${styles.bar} ${styles.announced} ${animated ? styles.animate : ""}`}
//                 style={{ height: animated ? getHeight(data.mic.announced) : "0%" }}
//               >
//                 <span className={styles.barValue}>{data.mic.announced}</span>
//               </div>
//               <div className={styles.barType}>Announced</div>
//             </div>

//             <div className={styles.barWrapper}>
//               <div
//                 className={`${styles.bar} ${styles.submitted} ${animated ? styles.animate : ""}`}
//                 style={{ height: animated ? getHeight(data.mic.submitted) : "0%" }}
//               >
//                 <span className={styles.barValue}>{data.mic.submitted}</span>
//               </div>
//               <div className={styles.barType}>Submitted</div>
//             </div>

//             <div className={styles.barWrapper}>
//               <div
//                 className={`${styles.bar} ${styles.approved} ${animated ? styles.animate : ""}`}
//                 style={{ height: animated ? getHeight(data.mic.approved) : "0%" }}
//               >
//                 <span className={styles.barValue}>{data.mic.approved}</span>
//               </div>
//               <div className={styles.barType}>Approved</div>
//             </div>
//           </div>
//         </div>

//         <div className={styles.barGroup}>
//           <div className={styles.barLabel}>Self</div>
//           <div className={styles.bars}>
//             <div className={styles.barWrapper}>
//               <div
//                 className={`${styles.bar} ${styles.announced} ${animated ? styles.animate : ""}`}
//                 style={{ height: animated ? getHeight(data.self.announced) : "0%" }}
//               >
//                 <span className={styles.barValue}>{data.self.announced}</span>
//               </div>
//               <div className={styles.barType}>Announced</div>
//             </div>

//             <div className={styles.barWrapper}>
//               <div
//                 className={`${styles.bar} ${styles.submitted} ${animated ? styles.animate : ""}`}
//                 style={{ height: animated ? getHeight(data.self.submitted) : "0%" }}
//               >
//                 <span className={styles.barValue}>{data.self.submitted}</span>
//               </div>
//               <div className={styles.barType}>Submitted</div>
//             </div>

//             <div className={styles.barWrapper}>
//               <div
//                 className={`${styles.bar} ${styles.approved} ${animated ? styles.animate : ""}`}
//                 style={{ height: animated ? getHeight(data.self.approved) : "0%" }}
//               >
//                 <span className={styles.barValue}>{data.self.approved}</span>
//               </div>
//               <div className={styles.barType}>Approved</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ActivityBarGraph

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./ActivityBarGraph.module.css"; // Import CSS module
import { Popover } from "antd";

const ActivityBarGraph = ({ data }) => {
  const membersData = [
    { name: "Department", Members: data.iic.members },
    { name: "Active", Members: data.mic.members },
    { name: "Inactive", Members: data.self.members },
  ];

  const announcementsData = [
    { name: "Global", Announced: data.iic.announced },
    { name: "Department", Announced: data.mic.announced },
    { name: "Self", Announced: data.self.announced },
  ];

  const tasksData = [
    { name: "Approve", Completed: data.iic.tasksCompleted },
    { name: "Pending", Completed: data.mic.tasksCompleted },
    { name: "Reject", Completed: data.self.tasksCompleted },
  ];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Activities Overview</h3>

      <div className={styles.graphWrapper}>
        {/* Members Graph */}
        <div className={styles.chartContainer}>
          <h4 className={styles.title}>
            Members Participation
            <Popover title="This is dummy data, work is in progress">
              <p className={styles.inprogress}>In Progress</p>
            </Popover>
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={membersData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" className={styles.xAxisLabel} />
              <YAxis className={styles.yAxisLabel} />
              <Tooltip className={styles.tooltip} />
              <Legend className={styles.legend} />
              <Bar dataKey="Members" fill="#ff9900" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Announcements Graph */}
        <div className={styles.chartContainer}>
          <h4 className={styles.title}>
            Announcements
            <Popover title="This is dummy data, work is in progress">
              <p className={styles.inprogress}>In Progress</p>
            </Popover>
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={announcementsData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" className={styles.xAxisLabel} />
              <YAxis className={styles.yAxisLabel} />
              <Tooltip className={styles.tooltip} />
              <Legend className={styles.legend} />
              <Bar dataKey="Announced" fill="#8b0000" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tasks Completed Graph */}
        <div className={styles.chartContainer}>
          <h4 className={styles.title}>
            Tasks Completed
            <Popover title="This is dummy data, work is in progress">
              <p className={styles.inprogress}>In Progress</p>
            </Popover>
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={tasksData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" className={styles.xAxisLabel} />
              <YAxis className={styles.yAxisLabel} />
              <Tooltip className={styles.tooltip} />
              <Legend className={styles.legend} />
              <Bar dataKey="Completed" fill="#009933" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ActivityBarGraph;
