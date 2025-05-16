import React, { useEffect } from "react";
import styles from "./AlertPopup.module.css";
import { Check, X, AlertTriangle, Download, Clock } from "lucide-react";

const AlertPopup = ({
  type,
  message,
  isOpen,
  onClose,
  countdownTime,
  downloadInfo,
}) => {
  useEffect(() => {
    let timer;
    if (isOpen && countdownTime > 0) {
      timer = setTimeout(() => {
        onClose();
      }, countdownTime * 1000);
    }
    return () => clearTimeout(timer);
  }, [isOpen, countdownTime, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={`${styles.popupHeader} ${styles[type]}`}>
          <h3 className={styles.popupTitle}>
            {type === "success" ? (
              <Check className={styles.popupIcon} size={24} />
            ) : (
              <AlertTriangle className={styles.popupIcon} size={24} />
            )}
            {type === "success" ? "Success" : "Error"}
          </h3>
          <button className={styles.popupCloseBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.popupContent}>
          <div className={styles.popupMessage}>
            <p>{message}</p>
            {downloadInfo && (
              <div className={styles.downloadInfo}>
                <Download size={20} />
                <span>{downloadInfo}</span>
              </div>
            )}
          </div>
          {countdownTime > 0 && (
            <div className={styles.popupCountdown}>
              <div className={styles.countdownCircle}>
                <Clock size={16} />
                <span>{countdownTime}</span>
              </div>
              <div className={styles.countdownText}>
                This popup will close automatically in {countdownTime} seconds
              </div>
            </div>
          )}
        </div>
        <div className={styles.popupFooter}>
          <button className={styles.popupBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertPopup;
