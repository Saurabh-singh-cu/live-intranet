import styles from "./Charts.module.css"

// Simple Bar Chart Component
export const BarChart = ({ data }) => {
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div className={styles.barChart}>
      {data.map((item, index) => (
        <div key={index} className={styles.barItem}>
          <div className={styles.barLabel}>{item.name}</div>
          <div className={styles.barContainer}>
            <div
              className={styles.bar}
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: getBarColor(index),
              }}
            ></div>
            <span className={styles.barValue}>{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Simple Line Chart Component
export const LineChart = () => {
  // Mock data for demonstration
  const data = [
    { month: "Jan", value: 65 },
    { month: "Feb", value: 59 },
    { month: "Mar", value: 80 },
    { month: "Apr", value: 81 },
    { month: "May", value: 56 },
    { month: "Jun", value: 55 },
    { month: "Jul", value: 40 },
    { month: "Aug", value: 70 },
    { month: "Sep", value: 90 },
    { month: "Oct", value: 110 },
    { month: "Nov", value: 130 },
    { month: "Dec", value: 150 },
  ]

  const maxValue = Math.max(...data.map((item) => item.value))
  const chartHeight = 200

  return (
    <div className={styles.lineChart}>
      <div className={styles.lineChartContainer}>
        {data.map((item, index) => {
          const height = (item.value / maxValue) * chartHeight

          return (
            <div key={index} className={styles.lineChartColumn}>
              <div className={styles.lineChartBar} style={{ height: `${height}px` }}></div>
              <div className={styles.lineChartLabel}>{item.month}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Simple Pie Chart Component
export const PieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let startAngle = 0

  return (
    <div className={styles.pieChart}>
      <div className={styles.pieContainer}>
        <svg viewBox="0 0 100 100">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100
            const angle = (percentage / 100) * 360
            const endAngle = startAngle + angle

            // Calculate the SVG arc path
            const x1 = 50 + 40 * Math.cos((Math.PI * startAngle) / 180)
            const y1 = 50 + 40 * Math.sin((Math.PI * startAngle) / 180)
            const x2 = 50 + 40 * Math.cos((Math.PI * endAngle) / 180)
            const y2 = 50 + 40 * Math.sin((Math.PI * endAngle) / 180)

            const largeArcFlag = angle > 180 ? 1 : 0

            const pathData = [`M 50 50`, `L ${x1} ${y1}`, `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(" ")

            const result = <path key={index} d={pathData} fill={getBarColor(index)} />

            startAngle += angle
            return result
          })}
        </svg>
      </div>

      <div className={styles.pieLegend}>
        {data.map((item, index) => (
          <div key={index} className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: getBarColor(index) }}></div>
            <div className={styles.legendLabel}>{item.name}</div>
            <div className={styles.legendValue}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper function to get colors for charts
function getBarColor(index) {
  const colors = [
    "#3498db", // blue
    "#2ecc71", // green
    "#9b59b6", // purple
    "#e67e22", // orange
    "#e74c3c", // red
    "#1abc9c", // teal
    "#f1c40f", // yellow
  ]

  return colors[index % colors.length]
}
