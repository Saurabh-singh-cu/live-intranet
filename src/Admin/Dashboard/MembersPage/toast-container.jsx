"use client"

import { useEffect } from "react"
import styles from "./MembershipAll.module.css"

export const ToastContainer = ({ toast, setToast }) => {
  useEffect(() => {
    // This effect will run when toast.show changes
    // It's here to ensure the component re-renders when toast state changes
  }, [toast.show])

  if (!toast.show) return null

  return (
    <div className={styles.toastContainer}>
      <div className={toast.type === "success" ? styles.toastSuccess : styles.toastError}>
        <span className={styles.toastMessage}>{toast.message}</span>
        <button className={styles.toastCloseButton} onClick={() => setToast((prev) => ({ ...prev, show: false }))}>
          ×
        </button>
      </div>
    </div>
  )
}
