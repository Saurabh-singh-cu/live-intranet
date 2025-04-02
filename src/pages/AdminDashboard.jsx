"use client"

import { useState } from "react"
import styles from "./AdminDashboardNew.module.css"

// Icons
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
)

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// Mock data
const inactiveMonthUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", lastLogin: "2023-02-15", status: "Inactive" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", lastLogin: "2023-02-20", status: "Inactive" },
  { id: 3, name: "Robert Johnson", email: "robert@example.com", lastLogin: "2023-02-18", status: "Inactive" },
  { id: 4, name: "Emily Davis", email: "emily@example.com", lastLogin: "2023-02-10", status: "Inactive" },
]

const neverLoggedInUsers = [
  {
    id: 5,
    name: "Michael Brown",
    email: "michael@example.com",
    registeredDate: "2023-01-15",
    status: "Never Logged In",
  },
  { id: 6, name: "Sarah Wilson", email: "sarah@example.com", registeredDate: "2023-02-05", status: "Never Logged In" },
  { id: 7, name: "David Taylor", email: "david@example.com", registeredDate: "2023-02-28", status: "Never Logged In" },
]

const pendingApprovalUsers = [
  { id: 8, name: "Jennifer Lee", email: "jennifer@example.com", requestDate: "2023-03-10", role: "Editor" },
  { id: 9, name: "Thomas Anderson", email: "thomas@example.com", requestDate: "2023-03-12", role: "Admin" },
  { id: 10, name: "Lisa Martinez", email: "lisa@example.com", requestDate: "2023-03-15", role: "Viewer" },
]

const pendingTaskUsers = [
  { id: 11, name: "Kevin Clark", email: "kevin@example.com", taskName: "Update Profile", dueDate: "2023-03-25" },
  { id: 12, name: "Amanda White", email: "amanda@example.com", taskName: "Complete Training", dueDate: "2023-03-20" },
  { id: 13, name: "Daniel Lewis", email: "daniel@example.com", taskName: "Submit Report", dueDate: "2023-03-18" },
  {
    id: 14,
    name: "Michelle Scott",
    email: "michelle@example.com",
    taskName: "Review Documents",
    dueDate: "2023-03-22",
  },
]

const userMessages = [
  {
    id: 15,
    name: "Christopher Green",
    email: "chris@example.com",
    message: "Having trouble accessing the reporting module.",
    date: "2023-03-16",
    priority: "High",
  },
  {
    id: 16,
    name: "Jessica Adams",
    email: "jessica@example.com",
    message: "Need help with password reset process.",
    date: "2023-03-15",
    priority: "Medium",
  },
  {
    id: 17,
    name: "Ryan Mitchell",
    email: "ryan@example.com",
    message: "Requesting additional user permissions.",
    date: "2023-03-14",
    priority: "Low",
  },
]

// Modal component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button className={styles.modalCloseButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  )
}

// Sweet Alert component
const SweetAlert = ({ isOpen, type, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className={styles.sweetAlertOverlay}>
      <div className={styles.sweetAlertContent}>
        <div className={`${styles.sweetAlertIcon} ${styles[`sweetAlert${type}`]}`}>
          {type === "Success" && <CheckIcon />}
          {type === "Error" && <CloseIcon />}
        </div>
        <h2 className={styles.sweetAlertTitle}>{title}</h2>
        <p className={styles.sweetAlertMessage}>{message}</p>
        <div className={styles.sweetAlertButtons}>
          {onCancel && (
            <button className={styles.sweetAlertCancelButton} onClick={onCancel}>
              Cancel
            </button>
          )}
          <button className={styles.sweetAlertConfirmButton} onClick={onConfirm}>
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

const AdminDashboard = () => {
  // State for modals
  const [emailModal, setEmailModal] = useState({ isOpen: false, user: null })
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: "", user: null })
  const [sweetAlert, setSweetAlert] = useState({ isOpen: false, type: "", title: "", message: "" })

  // Handle email button click
  const handleEmailClick = (user) => {
    setEmailModal({ isOpen: true, user })
  }

  // Handle email send
  const handleSendEmail = (e) => {
    e.preventDefault()
    setEmailModal({ isOpen: false, user: null })
    setSweetAlert({
      isOpen: true,
      type: "Success",
      title: "Email Sent!",
      message: "Your email has been sent successfully.",
    })
  }

  // Handle approve/reject button click
  const handleActionClick = (action, user) => {
    setConfirmModal({ isOpen: true, action, user })
  }

  // Handle action confirmation
  const handleConfirmAction = () => {
    const action = confirmModal.action
    setConfirmModal({ isOpen: false, action: "", user: null })

    setSweetAlert({
      isOpen: true,
      type: "Success",
      title: `${action === "approve" ? "Approved" : "Rejected"}!`,
      message: `User has been ${action === "approve" ? "approved" : "rejected"} successfully.`,
    })
  }

  // Close sweet alert
  const closeSweetAlert = () => {
    setSweetAlert({ isOpen: false, type: "", title: "", message: "" })
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Main Content */}
      <div className={styles.mainContent}>
     

        <div className={styles.dashboardContent}>
          <div className={styles.dashboardSummary}>
            <div className={styles.summaryCard}>
              <h3>Total Users</h3>
              <p className={styles.summaryNumber}>1,254</p>
              <div className={styles.cardDetails}>
                <div className={styles.detailItem}>
                  <span>Active:</span>
                  <span>1,180</span>
                </div>
                <div className={styles.detailItem}>
                  <span>Inactive:</span>
                  <span>74</span>
                </div>
                <div className={styles.detailItem}>
                  <span>New this month:</span>
                  <span>45</span>
                </div>
              </div>
            </div>
            <div className={styles.summaryCard}>
              <h3>Active Users</h3>
              <p className={styles.summaryNumber}>1,180</p>
              <div className={styles.cardDetails}>
                <div className={styles.detailItem}>
                  <span>Daily active:</span>
                  <span>780</span>
                </div>
                <div className={styles.detailItem}>
                  <span>Weekly active:</span>
                  <span>950</span>
                </div>
                <div className={styles.detailItem}>
                  <span>Monthly active:</span>
                  <span>1,180</span>
                </div>
              </div>
            </div>
            <div className={styles.summaryCard}>
              <h3>Pending Approvals</h3>
              <p className={styles.summaryNumber}>24</p>
              <div className={styles.cardDetails}>
                <div className={styles.detailItem}>
                  <span>Admin role:</span>
                  <span>5</span>
                </div>
                <div className={styles.detailItem}>
                  <span>Editor role:</span>
                  <span>12</span>
                </div>
                <div className={styles.detailItem}>
                  <span>Viewer role:</span>
                  <span>7</span>
                </div>
              </div>
            </div>
            <div className={styles.summaryCard}>
              <h3>New Messages</h3>
              <p className={styles.summaryNumber}>18</p>
              <div className={styles.cardDetails}>
                <div className={styles.detailItem}>
                  <span>High priority:</span>
                  <span>4</span>
                </div>
                <div className={styles.detailItem}>
                  <span>Medium priority:</span>
                  <span>9</span>
                </div>
                <div className={styles.detailItem}>
                  <span>Low priority:</span>
                  <span>5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tables Section */}
          <div className={styles.tablesSection}>
            {/* Users not logged in for a month */}
            <div className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <h2>Users Not Logged In For A Month</h2>
                <button className={styles.viewAllButton}>View All</button>
              </div>
              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Last Login</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inactiveMonthUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.lastLogin}</td>
                        <td>
                          <span className={styles.statusBadge}>{user.status}</span>
                        </td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button className={styles.actionButton} onClick={() => handleEmailClick(user)}>
                              Email
                            </button>
                            <button className={styles.actionButton}>Details</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Users who have never logged in */}
            <div className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <h2>Users Who Have Never Logged In</h2>
                <button className={styles.viewAllButton}>View All</button>
              </div>
              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Registered Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {neverLoggedInUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.registeredDate}</td>
                        <td>
                          <span className={styles.statusBadge}>{user.status}</span>
                        </td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button className={styles.actionButton} onClick={() => handleEmailClick(user)}>
                              Email
                            </button>
                            <button className={styles.actionButton}>Details</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Users with pending approval */}
            <div className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <h2>Users With Pending Approval</h2>
                <button className={styles.viewAllButton}>View All</button>
              </div>
              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Request Date</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingApprovalUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.requestDate}</td>
                        <td>{user.role}</td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              className={`${styles.actionButton} ${styles.approveButton}`}
                              onClick={() => handleActionClick("approve", user)}
                            >
                              Approve
                            </button>
                            <button
                              className={`${styles.actionButton} ${styles.rejectButton}`}
                              onClick={() => handleActionClick("reject", user)}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Users with pending tasks */}
            <div className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <h2>Users With Pending Tasks</h2>
                <button className={styles.viewAllButton}>View All</button>
              </div>
              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Task</th>
                      <th>Due Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingTaskUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.taskName}</td>
                        <td>{user.dueDate}</td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button className={styles.actionButton} onClick={() => handleEmailClick(user)}>
                              Remind
                            </button>
                            <button className={styles.actionButton}>Details</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Users with messages for admin */}
            <div className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <h2>User Messages</h2>
                <button className={styles.viewAllButton}>View All</button>
              </div>
              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Priority</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userMessages.map((message) => (
                      <tr key={message.id}>
                        <td>{message.name}</td>
                        <td>{message.email}</td>
                        <td className={styles.messageCell}>{message.message}</td>
                        <td>{message.date}</td>
                        <td>
                          <span className={`${styles.priorityBadge} ${styles[`priority${message.priority}`]}`}>
                            {message.priority}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              className={styles.actionButton}
                              onClick={() => handleEmailClick({ name: message.name, email: message.email })}
                            >
                              Reply
                            </button>
                            <button className={styles.actionButton}>Resolve</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      <Modal
        isOpen={emailModal.isOpen}
        onClose={() => setEmailModal({ isOpen: false, user: null })}
        title={`Send Email to ${emailModal.user ? emailModal.user.name : ""}`}
      >
        <form onSubmit={handleSendEmail} className={styles.emailForm}>
          <div className={styles.formGroup}>
            <label htmlFor="to">To:</label>
            <input
              type="email"
              id="to"
              value={emailModal.user ? emailModal.user.email : ""}
              readOnly
              className={styles.formControl}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="subject">Subject:</label>
            <input type="text" id="subject" placeholder="Enter subject" className={styles.formControl} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              rows="5"
              placeholder="Enter your message"
              className={styles.formControl}
              required
            ></textarea>
          </div>
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setEmailModal({ isOpen: false, user: null })}
            >
              Cancel
            </button>
            <button type="submit" className={styles.sendButton}>
              Send Email
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: "", user: null })}
        title="Confirmation"
      >
        <div className={styles.confirmationContent}>
          <p>
            Are you sure you want to {confirmModal.action} user {confirmModal.user ? confirmModal.user.name : ""}?
          </p>
          <div className={styles.confirmationActions}>
            <button
              className={styles.cancelButton}
              onClick={() => setConfirmModal({ isOpen: false, action: "", user: null })}
            >
              Cancel
            </button>
            <button
              className={`${styles.confirmButton} ${confirmModal.action === "approve" ? styles.approveButton : styles.rejectButton}`}
              onClick={handleConfirmAction}
            >
              {confirmModal.action === "approve" ? "Approve" : "Reject"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Sweet Alert */}
      <SweetAlert
        isOpen={sweetAlert.isOpen}
        type={sweetAlert.type}
        title={sweetAlert.title}
        message={sweetAlert.message}
        onConfirm={closeSweetAlert}
      />
    </div>
  )
}

export default AdminDashboard

