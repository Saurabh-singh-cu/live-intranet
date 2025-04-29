import React from 'react';
import styles from './NewAdminDashboard.module.css';

const EventList = ({ events }) => {
  // Function to format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Function to get random time for demo purposes
  const getRandomTime = () => {
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutes = Math.floor(Math.random() * 60);
    const ampm = Math.random() > 0.5 ? 'AM' : 'PM';
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  };

  // Function to get class name based on event type
  const getEventTypeClass = (type) => {
    switch (type) {
      case 'important':
        return styles.eventTypeImportant;
      case 'workshop':
        return styles.eventTypeWorkshop;
      case 'registration':
        return styles.eventTypeRegistration;
      case 'meeting':
        return styles.eventTypeMeeting;
      case 'event':
        return styles.eventTypeEvent;
      default:
        return '';
    }
  };

  return (
    <div className={styles.eventListSidebar}>
      <h3 className={styles.eventListHeader}>Upcoming Events</h3>
      <div className={styles.eventListContent}>
        {events.map((event) => (
          <div key={event.id} className={styles.eventItem}>
            <div className={styles.eventDate}>{formatDate(event.date)}</div>
            <div className={styles.eventTime}>{getRandomTime()}</div>
            <div className={styles.eventTitle}>{Array.isArray(event.title) ? event.title[0] : event.title}</div>
            <span className={`${styles.eventType} ${getEventTypeClass(event.type)}`}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
          </div>
        ))}
        
        {/* Adding more events for demonstration */}
        <div className={styles.eventItem}>
          <div className={styles.eventDate}>{formatDate('2025-05-15')}</div>
          <div className={styles.eventTime}>2:30 PM</div>
          <div className={styles.eventTitle}>Student Orientation</div>
          <span className={`${styles.eventType} ${styles.eventTypeEvent}`}>Event</span>
        </div>
        
        <div className={styles.eventItem}>
          <div className={styles.eventDate}>{formatDate('2025-05-18')}</div>
          <div className={styles.eventTime}>10:00 AM</div>
          <div className={styles.eventTitle}>Board Meeting</div>
          <span className={`${styles.eventType} ${styles.eventTypeMeeting}`}>Meeting</span>
        </div>
        
        <div className={styles.eventItem}>
          <div className={styles.eventDate}>{formatDate('2025-05-20')}</div>
          <div className={styles.eventTime}>3:45 PM</div>
          <div className={styles.eventTitle}>Web Development Workshop</div>
          <span className={`${styles.eventType} ${styles.eventTypeWorkshop}`}>Workshop</span>
        </div>
        
        <div className={styles.eventItem}>
          <div className={styles.eventDate}>{formatDate('2025-05-22')}</div>
          <div className={styles.eventTime}>9:15 AM</div>
          <div className={styles.eventTitle}>Club Registration Deadline</div>
          <span className={`${styles.eventType} ${styles.eventTypeRegistration}`}>Registration</span>
        </div>
        
        <div className={styles.eventItem}>
          <div className={styles.eventDate}>{formatDate('2025-05-25')}</div>
          <div className={styles.eventTime}>1:00 PM</div>
          <div className={styles.eventTitle}>Annual Conference</div>
          <span className={`${styles.eventType} ${styles.eventTypeImportant}`}>Important</span>
        </div>
        
        <div className={styles.eventItem}>
          <div className={styles.eventDate}>{formatDate('2025-05-28')}</div>
          <div className={styles.eventTime}>4:30 PM</div>
          <div className={styles.eventTitle}>Faculty Training</div>
          <span className={`${styles.eventType} ${styles.eventTypeWorkshop}`}>Workshop</span>
        </div>
        
        <div className={styles.eventItem}>
          <div className={styles.eventDate}>{formatDate('2025-06-01')}</div>
          <div className={styles.eventTime}>11:30 AM</div>
          <div className={styles.eventTitle}>Summer Program Launch</div>
          <span className={`${styles.eventType} ${styles.eventTypeEvent}`}>Event</span>
        </div>
      </div>
    </div>
  );
};

export default EventList;
