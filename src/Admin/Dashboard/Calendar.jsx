"use client"

import { useState } from "react"
import styles from "./Calendar.module.css"

const Calendar = ({ events }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getMonthName = (date) => {
    return date.toLocaleString("default", { month: "long" })
  }

  const getYear = (date) => {
    return date.getFullYear()
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className={styles.calendarDay}></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const dateString = date.toISOString().split("T")[0]

      // Check if there are events on this day
      const dayEvents = events.filter((event) => event.date === dateString)
      const hasEvents = dayEvents.length > 0

      days.push(
        <div key={day} className={`${styles.calendarDay} ${hasEvents ? styles.hasEvents : ""}`}>
          <span className={styles.dayNumber}>{day}</span>
          {hasEvents && (
            <div className={styles.eventIndicator}>
              {dayEvents.length > 1 ? `${dayEvents.length} events` : dayEvents[0].title}
            </div>
          )}
        </div>,
      )
    }

    return days
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        <button onClick={prevMonth} className={styles.monthNav}>
          ←
        </button>
        <h4>
          {getMonthName(currentMonth)} {getYear(currentMonth)}
        </h4>
        <button onClick={nextMonth} className={styles.monthNav}>
          →
        </button>
      </div>

      <div className={styles.weekdays}>
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div className={styles.calendarGrid}>{renderCalendarDays()}</div>

      <div className={styles.upcomingEvents}>
        <h4>Upcoming Events</h4>
        <div className={styles.eventsList}>
          {events.map((event) => (
            <div key={event.id} className={styles.eventItem}>
              <div className={`${styles.eventType} ${styles[event.type]}`}></div>
              <div className={styles.eventInfo}>
                <p className={styles.eventTitle}>{event.title}</p>
                <p className={styles.eventDate}>{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Calendar
