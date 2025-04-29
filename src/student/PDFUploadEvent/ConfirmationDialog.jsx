"use client"
import styles from "./ConfirmationDialog.module.css"

const ConfirmationDialog = ({ club, event, fileName, onConfirm, onCancel, isLoading }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h3 className={styles.title}>Confirm Upload</h3>

        <div className={styles.content}>
          <p>Please confirm the following details:</p>

          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Club:</span>
              <span className={styles.value}>{club}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>Event:</span>
              <span className={styles.value}>{event}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>File:</span>
              <span className={styles.value}>{fileName}</span>
            </div>
          </div>

          <p className={styles.warning}>Are you sure this is the correct club and event for your certificate?</p>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>

          <button className={styles.confirmButton} onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Uploading..." : "Confirm & Upload"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationDialog
