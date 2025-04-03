import styles from "./InfoCard.module.css";
import ActivityBarGraph from "./ActivityBarGraph";
import { Popover } from "antd";

const InfoCard = () => {
  return (
    <div className={styles.infoCardsContainer}>
      <div className={styles.infoCard}>
        <div className={styles.cardHeader}>
          <div className={styles.iconContainer}>
            <i className={`${styles.icon} ${styles.activityIcon}`}></i>
          </div>
          <h2>Activity</h2>
        </div>
        <div className={styles.cardDivider}></div>
        <div className={styles.cardContent}>
          <ul className={styles.activityList}>
            <li>Flagship Events: <span className={styles.highlight}>0</span></li>
            <li>Monthly Events: <span className={styles.count}>0</span></li>
            <li>Regular Events: <span className={styles.count}>0</span></li>
           
          </ul>
        </div>
        <div className={styles.cardFooter}>
          <button className={styles.moreInfoBtn}>
            More info <span className={styles.arrowIcon}>→</span>
          </button>
        </div>
      </div>

      <div className={styles.infoCard}>
        <div className={styles.cardHeader}>
          <div className={styles.iconContainer}>
            <i className={`${styles.icon} ${styles.notificationIcon}`}></i>
          </div>
          <h2>Notification</h2>
        </div>
        <div className={styles.cardDivider}></div>
        <div className={styles.cardContent}>
          <ul className={styles.notificationList}>
            {/* <li><span className={styles.arrow}>▸</span> Calendar Activity: 2024-25</li>
            <li><span className={styles.arrow}>▸</span> The list of innovations eligible for CAB</li>
            <li><span className={styles.arrow}>▸</span> Finalist of Hackathon Challenge 2025</li>
            <li><span className={styles.arrow}>▸</span> List of the Mentor Institute for Mentor - Mentee</li>
            <li><span className={styles.arrow}>▸</span> Selected Institutes for the Impact League</li> */}
         
          </ul>
        </div>
        <div className={styles.cardFooter}>
          <button className={styles.moreInfoBtn}>
            More info <span className={styles.arrowIcon}>→</span>
          </button>
        </div>
      </div>

      <div className={styles.infoCard}>
        <div className={styles.cardHeader}>
          <div className={styles.iconContainer}>
            <i className={`${styles.icon} ${styles.newsIcon}`}></i>
          </div>
          <h2>News Corner</h2>
        </div>
        <div className={styles.cardDivider}></div>
        <div className={styles.cardContent}>
          <ul className={styles.newsList}>
            <li className={styles.newsItem}>
              {/* <span className={styles.arrow}>▸</span> CAUSE 2025 - Design Thinking Day
              <span className={styles.newsBadge}>New</span> */}
            </li>
            <li className={styles.emptySpace}></li>
            <li className={styles.emptySpace}></li>
            <li className={styles.emptySpace}></li>
            <li className={styles.emptySpace}></li>
          </ul>
        </div>
        <div className={styles.cardFooter}>
          <button className={styles.moreInfoBtn}>
            More info <span className={styles.arrowIcon}>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
