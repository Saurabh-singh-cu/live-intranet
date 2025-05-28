import React, { useState } from 'react';
import styles from "./Calender.module.css";

const CalenderPush = () => {
  const [calendarData, setCalendarData] = useState({
    title: "Team Meeting",
    date: "2025-05-10",
    time: "10:00",
    location: "Conference Room A",
    description: "Quarterly planning session with department heads.",
  });

  const handlePush = () => {
    console.log("Payload to backend:", JSON.stringify(calendarData, null, 2));
    // This is where the API call would be made
    // fetch('/api/calendar', { method: 'POST', headers: ..., body: JSON.stringify(calendarData) })
  };

  const handleChange = (e) => {
    setCalendarData({
      ...calendarData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Calendar Push</h2>

      <div className={styles.formGroup}>
        <label>Title</label>
        <input type="text" name="title" value={calendarData.title} onChange={handleChange} />
      </div>

      <div className={styles.formGroup}>
        <label>Date</label>
        <input type="date" name="date" value={calendarData.date} onChange={handleChange} />
      </div>

      <div className={styles.formGroup}>
        <label>Time</label>
        <input type="time" name="time" value={calendarData.time} onChange={handleChange} />
      </div>

      <div className={styles.formGroup}>
        <label>Location</label>
        <input type="text" name="location" value={calendarData.location} onChange={handleChange} />
      </div>

      <div className={styles.formGroup}>
        <label>Description</label>
        <textarea name="description" value={calendarData.description} onChange={handleChange} />
      </div>

      <button className={styles.button} onClick={handlePush}>Push to Backend</button>
    </div>
  );
};

export default CalenderPush;
