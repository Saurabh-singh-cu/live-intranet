"use client";

import { useState } from "react";
import styles from "./AllThreeInOne.module.css";
import PushNotification from "./PushNotification";
import PushNewsAndViews from "./PushNewsAndViews";
import PushFeatureEvent from "./PushFeatureEvent";

export default function AllThreeInOne() {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState("notification");

  // Function to handle tab click
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className={styles.container}>
      {/* Tab Navigation */}
      <div className={styles.tabsContainer}>
        <div
          className={`${styles.tab} ${
            activeTab === "notification" ? styles.activeTab : ""
          }`}
          onClick={() => handleTabClick("notification")}
        >
          Push Notification
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "news" ? styles.activeTab : ""
          }`}
          onClick={() => handleTabClick("news")}
        >
          Push News and Views
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "feature" ? styles.activeTab : ""
          }`}
          onClick={() => handleTabClick("feature")}
        >
          Create Feature Event
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === "notification" && <PushNotification />}
        {activeTab === "news" && <PushNewsAndViews />}
        {activeTab === "feature" && <PushFeatureEvent />}
      </div>
    </div>
  );
}
