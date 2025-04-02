import styles from "./InfoCard.module.css";
import ActivityBarGraph from "./ActivityBarGraph";
import { Popover } from "antd";

const InfoCard = () => {
  // Activity data for the bar graph

  return (
    <div className={styles.infoCardsContainer}>
      <div className={styles.infoCard}>
        <div className={styles.cardHeader}>
          <div className={styles.iconContainer}>
            <i className={`${styles.icon} ${styles.activityIcon}`}></i>
          </div>
          <p></p>
          <h2>Activity</h2>
        </div>
        <Popover title="This is dummy data, work is in progress"><p className={styles.inprogress}>In Progress</p></Popover>
        <div className={styles.cardDivider}></div>
        <div className={styles.cardContent}>
          <ul className={styles.activityList}>
            <li>
              Registered Members: <span className={styles.highlight}>1</span>
            </li>
            <li>
              Active Members: <span className={styles.count}>1</span>
            </li>
            <li>
              Inactive Members: <span className={styles.count}>0</span>
            </li>
            <li className={styles.dividerLine}></li>
            <li>
              Activities Announced: <span className={styles.highlight}>9</span>
            </li>
            <li>
              Activities Submitted: <span className={styles.count}>11</span>
            </li>
            <li>
              Activities Approved: <span className={styles.count}>8</span>
            </li>
            <li className={styles.dividerLine}></li>
            <li>
              Self Activities Announced: <span className={styles.count}>0</span>
            </li>
            <li>
              Self Activities Submitted:{" "}
              <span className={styles.count}>21</span>
            </li>
            <li>
              Self Activities Approved: <span className={styles.count}>0</span>
            </li>
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
        <Popover title="This is dummy data, work is in progress"><p className={styles.inprogress}>In Progress</p></Popover>
        <div className={styles.cardDivider}></div>
        <div className={styles.cardContent}>
          <ul className={styles.notificationList}>
            <li>
              <span className={styles.arrow}>▸</span> Calendar Activity: 2024-25
            </li>
            <li>
              <span className={styles.arrow}>▸</span> The list of innovations
              eligible for CAB
            </li>
            <li>
              <span className={styles.arrow}>▸</span> Finalist of Hackthon
              Challenge 2025
            </li>
            <li>
              <span className={styles.arrow}>▸</span> List of the Mentor
              Institute for Mentor - Mentee
            </li>
            <li>
              <span className={styles.arrow}>▸</span> List of the Selected
              Institutes for the Impact League
            </li>
            <li>
              <span className={styles.arrow}>▸</span> Calendar Activity: 2023-24
            </li>
            <li>
              <span className={styles.arrow}>▸</span>Celebration Activities
            </li>
            <li>
              <span className={styles.arrow}>▸</span> Schedule of CAB Project
              Training
            </li>
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
        <Popover title="This is dummy data, work is in progress"><p className={styles.inprogress}>In Progress</p></Popover>
        <div className={styles.cardDivider}></div>
        <div className={styles.cardContent}>
          <ul className={styles.newsList}>
            <li className={styles.newsItem}>
              <span className={styles.arrow}>▸</span> CAUSE 2025 - Design
              Thinking Day
              <span className={styles.newsBadge}>New</span>
            </li>
            <li className={styles.emptySpace}></li>
            <li className={styles.emptySpace}></li>
            <li className={styles.emptySpace}></li>
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
