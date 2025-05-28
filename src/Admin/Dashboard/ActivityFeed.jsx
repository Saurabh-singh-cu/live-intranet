import styles from "./ActivityFeed.module.css"

const ActivityFeed = ({ data }) => {
  // Mock activity data for demonstration
  const activities = [
    { id: 1, type: "entity_request", user: "John Doe", entity: "Tech Club", time: "2 hours ago" },
    { id: 2, type: "event_publish", user: "Jane Smith", entity: "Annual Tech Fest", time: "5 hours ago" },
    { id: 3, type: "user_register", user: "Mike Johnson", entity: null, time: "1 day ago" },
    { id: 4, type: "entity_approved", user: "Admin", entity: "CS Department Society", time: "2 days ago" },
    { id: 5, type: "announcement", user: "Sarah Williams", entity: "Campus Update", time: "3 days ago" },
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case "entity_request":
        return "🏢"
      case "event_publish":
        return "📅"
      case "user_register":
        return "👤"
      case "entity_approved":
        return "✅"
      case "announcement":
        return "📢"
      default:
        return "📝"
    }
  }

  const getActivityText = (activity) => {
    switch (activity.type) {
      case "entity_request":
        return `${activity.user} requested to create ${activity.entity}`
      case "event_publish":
        return `${activity.user} published event ${activity.entity}`
      case "user_register":
        return `${activity.user} registered as a new user`
      case "entity_approved":
        return `${activity.user} approved ${activity.entity}`
      case "announcement":
        return `${activity.user} posted announcement: ${activity.entity}`
      default:
        return `${activity.user} performed an action`
    }
  }

  return (
    <div className={styles.activityFeed}>
      <div className={styles.activityStats}>
        <div className={styles.activityStat}>
          <span className={styles.statValue}>{data.entityRequests}</span>
          <span className={styles.statLabel}>Entity Requests</span>
        </div>
        <div className={styles.activityStat}>
          <span className={styles.statValue}>{data.registeredEntities}</span>
          <span className={styles.statLabel}>Registered Entities</span>
        </div>
        <div className={styles.activityStat}>
          <span className={styles.statValue}>{data.eventPublishRequests}</span>
          <span className={styles.statLabel}>Event Requests</span>
        </div>
      </div>

      <div className={styles.activityList}>
        {activities.map((activity) => (
          <div key={activity.id} className={styles.activityItem}>
            <div className={styles.activityIcon}>{getActivityIcon(activity.type)}</div>
            <div className={styles.activityContent}>
              <p className={styles.activityText}>{getActivityText(activity)}</p>
              <span className={styles.activityTime}>{activity.time}</span>
            </div>
          </div>
        ))}
      </div>

      <button className={styles.viewAllButton}>View All Activities</button>
    </div>
  )
}

export default ActivityFeed
