import styles from "./InfoCard.module.css";
import { Modal, Tabs, Badge, Empty, Timeline } from "antd";
import { useCallback, useEffect, useState } from "react";
import apiClient from "../config/apiClient";
import DOMPurify from "dompurify";

const InfoCard = () => {
  const [loading, setLoading] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [pieData, setPie] = useState([]);
  const [barData, setBarData] = useState([]);
  const [commity, setCommity] = useState([]);
  const [filteredData, setFilteredData] = useState({
    club: 0,
    community: 0,
    professionalSociety: 0,
    departmentSociety: 0,
    all: 0,
  });

  const getNotification = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));

      // Extract role_id and entity_type_id from localStorage structure
      const userRoleId = userData.user_role_id;
      const entId =
        userData.secretary_details[0].entity_id ||
        userData.faculty_advisory_details[0].entity_id;
      const regId =
        userData.secretary_details[0].reg_id ||
        userData.faculty_advisory_details[0].reg_id;
      console.log(regId, "EEEEEEEEEEEEEEEEEEEEE");

      if (!userRoleId || !entId) {
        console.warn("Missing user role or entity ID");
        return;
      }

      // Send as a POST request in the body
      const response = await apiClient.post("/get-push-notifications/", {
        role_id: [userRoleId],
        entity_type_id: [entId],
      });

      console.log(response?.data, "NOTIFICATION DATA");
      setNotificationData(response?.data);

      // Extract unique categories
      const allCategories = response?.data.reduce((acc, item) => {
        if (item.category) {
          const cats = item.category.split(",");
          cats.forEach((cat) => {
            const trimmed = cat.trim();
            if (!acc.includes(trimmed)) {
              acc.push(trimmed);
            }
          });
        }
        return acc;
      }, []);

      setCategories(allCategories);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    getNotification();
    pieChartData();
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Group notifications by date
  const groupByDate = (notifications) => {
    const grouped = {};

    notifications.forEach((notification) => {
      const date = new Date(notification.created_at).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(notification);
    });

    return grouped;
  };

  // Filter notifications by category
  const getFilteredNotifications = (category) => {
    if (category === "all") {
      return notificationData;
    }

    return notificationData.filter(
      (notification) =>
        notification.category &&
        notification.category
          .split(",")
          .map((cat) => cat.trim())
          .includes(category)
    );
  };

  // Get count of notifications by category
  const getNotificationCount = (category) => {
    return getFilteredNotifications(category).length;
  };

  // Get notifications for display in the card
  const getDisplayNotifications = () => {
    const filtered = getFilteredNotifications(activeCategory);
    return filtered.slice(0, 5); // Show only 5 notifications in the card
  };

  const getFirstNWordsFromHTML = (htmlString) => {
    // First, strip all tags to count words safely
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlString;
    const textContent = tempElement.textContent || tempElement.innerText || "";

    const words = textContent.split(/\s+/).slice(0, 60).join(" ");
    return words + (textContent.split(/\s+/).length > 60 ? "..." : "");
  };

  const pieChartData = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const regId = userData?.secretary_details[0]?.reg_id;
      const response = await apiClient.get(`/event_analytics?reg_id=${regId}`);
      setPie(response?.data);
      console.log(response?.data, "TTTTTTTTTTTTTTTTTTTTTTTTTT");
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const grtCommitiData = useCallback(
    async (regIds) => {
      try {
        if (!regIds || regIds.length === 0) return; // Prevent empty calls

        const allCommityMember = [];
        for (const regId of regIds) {
          console.log(`Fetching data for reg_id: ${regId}`);

          const response = await apiClient.get(
            `entity-registration-detailed-page/?reg_id=${regId}`
          );

          if (response?.data) {
            allCommityMember.push(response.data);
          }
        }

        if (JSON.stringify(allCommityMember) !== JSON.stringify(commity)) {
          setCommity(allCommityMember); // Only update if data is different
        }

        console.log(allCommityMember, "[commityMember]");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [commity]
  );

  const dashboardCardCount = async () => {
    try {
      const response = await apiClient.get("entity_count/");
      setDashboardCount(response.data);
      filterData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filterData = (data) => {
    const filtered = {
      club: data.find((item) => item.entity_name === "CLUB")?.entity_count || 0,
      community:
        data.find((item) => item.entity_name === "COMMUNITY")?.entity_count ||
        0,
      professionalSociety:
        data.find((item) => item.entity_name === "PROFESSIONAL SOCIETY")
          ?.entity_count || 0,
      departmentSociety:
        data.find((item) => item.entity_name === "DEPARTMENT SOCIETY")
          ?.entity_count || 0,
      all: data.reduce((sum, item) => sum + item.entity_count, 0),
    };
    setFilteredData(filtered);
  };

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
            <li>
              Flagship Events:{" "}
              <span className={styles.highlight}>{pieData?.Flagship}</span>
            </li>
            <li>
              Monthly Events:{" "}
              <span className={styles.highlight}>{pieData?.Monthly}</span>
            </li>
            <li>
              Regular Events:{" "}
              <span className={styles.highlight}>{pieData?.Regular}</span>
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
        <div className={styles.cardDivider}></div>
        <div className={styles.categoryTabs}>
          <span
            className={`${styles.categoryTab} ${
              activeCategory === "all" ? styles.activeTab : ""
            }`}
            onClick={() => handleCategoryClick("all")}
          >
            All ({notificationData.length})
          </span>
          {categories.map((category) => (
            <span
              key={category}
              className={`${styles.categoryTab} ${
                activeCategory === category ? styles.activeTab : ""
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)} (
              {getNotificationCount(category)})
            </span>
          ))}
        </div>

        <div className={styles.cardContent}>
          <ul className={styles.notificationList}>
            {getDisplayNotifications().length > 0 ? (
              getDisplayNotifications().map((item) => (
                <li key={item.id} className={styles.notificationItem}>
                  <span className={styles.arrow}>▸</span>
                  <div className={styles.notificationMessage}>
                    {getFirstNWordsFromHTML(
                      DOMPurify.sanitize(item.message),
                      60
                    )}
                  </div>
                  {!item.is_read && <span className={styles.unreadDot}></span>}
                </li>
              ))
            ) : (
              <li className={styles.emptyNotification}>
                No notifications found
              </li>
            )}
          </ul>
        </div>

        <div className={styles.cardFooter}>
          <button className={styles.moreInfoBtn} onClick={showModal}>
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

      {/* Notification Modal */}
      <Modal
        title={
          <div className={styles.modalHeader}>
            <div className={styles.modalIconContainer}>
              <i className={`${styles.icon} ${styles.notificationIcon}`}></i>
            </div>
            <h2>Notifications</h2>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={700}
        className={styles.notificationModal}
      >
        <Tabs
          defaultActiveKey="all"
          items={[
            {
              key: "all",
              label: `All (${notificationData.length})`,
              children: (
                <NotificationTimeline notifications={notificationData} />
              ),
            },
            ...categories.map((category) => ({
              key: category,
              label: `${
                category.charAt(0).toUpperCase() + category.slice(1)
              } (${getNotificationCount(category)})`,
              children: (
                <NotificationTimeline
                  notifications={getFilteredNotifications(category)}
                />
              ),
            })),
          ]}
        />
      </Modal>
    </div>
  );
};

// Component to display notifications in a timeline
const NotificationTimeline = ({ notifications }) => {
  const groupedNotifications = {};

  // Group by date
  notifications.forEach((notification) => {
    const date = new Date(notification.created_at).toLocaleDateString();
    if (!groupedNotifications[date]) {
      groupedNotifications[date] = [];
    }
    groupedNotifications[date].push(notification);
  });

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedNotifications).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  if (notifications.length === 0) {
    return <Empty description="No notifications found" />;
  }

  return (
    <div className="notification-timeline">
      {sortedDates.map((date) => (
        <div key={date} className="date-group">
          <h3 className="date-header">{date}</h3>
          <Timeline>
            {groupedNotifications[date].map((notification) => {
              // Determine color based on category
              let color = "blue";
              if (notification.category) {
                if (notification.category.includes("urgent")) color = "red";
                else if (notification.category.includes("deadline"))
                  color = "orange";
              }

              return (
                <Timeline.Item key={notification.id} color={color}>
                  <div className="notification-item">
                    <div className="notification-content">
                      {/* <p className="notification-message">
                        {notification.message}
                      </p> */}
                      <div
                        className="notification-message"
                        dangerouslySetInnerHTML={{
                          __html: notification.message,
                        }}
                      />
                      <div className="notification-meta">
                        <span className="notification-time">
                          {new Date(notification.created_at).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </span>
                        {notification.category && (
                          <div className="notification-categories">
                            {notification.category.split(",").map((cat) => (
                              <Badge
                                key={cat}
                                status={
                                  cat.trim() === "urgent"
                                    ? "error"
                                    : cat.trim() === "deadline"
                                    ? "warning"
                                    : "processing"
                                }
                                text={cat.trim()}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Timeline.Item>
              );
            })}
          </Timeline>
        </div>
      ))}
    </div>
  );
};

export default InfoCard;
