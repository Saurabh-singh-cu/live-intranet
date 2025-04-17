import styles from "./StatCard.module.css"

const StatCard = ({ title, value, icon, color }) => {
  const cardClass = `${styles.statCard} ${styles[color]}`

  return (
    <div className={cardClass}>
      <div className={styles.iconContainer}>
        <span className={styles.icon}>{getIcon(icon)}</span>
      </div>
      <div className={styles.statInfo}>
        <h3 className={styles.statTitle}>{title}</h3>
        <p className={styles.statValue}>{value.toLocaleString()}</p>
      </div>
    </div>
  )
}

// Simple function to render icons as text for this example
function getIcon(name) {
  const icons = {
    users: "👥",
    "user-check": "✓",
    "dollar-sign": "💲",
    bell: "🔔",
    book: "📚",
    clipboard: "📋",
    "file-text": "📄",
  }

  return icons[name] || "•"
}

export default StatCard
