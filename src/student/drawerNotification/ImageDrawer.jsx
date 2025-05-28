"use client";
import { Modal } from "antd";
import styles from "./ImageDrawer.module.css";

const ImageDrawer = ({ visible, onClose, image, content }) => {
  return (
    <Modal
      title={null}
      open={visible}
    //   onCancel={onClose}
      footer={null}
      centered
      width="92%"
      className={styles["image-modal"]}
      bodyStyle={{ padding: 0 }}
      closable={false} 
    >
      <div className={styles["modal-content"]}>
        <button className={styles["close-button"]} onClick={onClose}>
          ×
        </button>
        <div className={styles["image-container"]}>
          <img
            src={image?.src || "/placeholder.svg"}
            alt={image?.alt || "Event Image"}
            className={styles["full-image"]}
          />
          <div className={styles["image-overlay"]}>
            <span className={styles["image-type"]}>{image?.type}</span>
            <h2 className={styles["image-title"]}>{image?.title}</h2>
          </div>
        </div>
        <div className={styles["content-container"]}>
          <div className={styles["content-header"]}>
            <h3>{image?.title}</h3>
            <span className={styles["event-type"]}>{image?.type}</span>
          </div>
          <div className={styles["content-body"]}>
            {content || (
              <div>
                <p>
                  Join us for this exciting event! This is a great opportunity to connect with peers and learn
                  something new.
                </p>
                <div className={styles["event-details"]}>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Date:</span>
                    <span className={styles["detail-value"]}>May 15, 2025</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Time:</span>
                    <span className={styles["detail-value"]}>2:00 PM - 5:00 PM</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Location:</span>
                    <span className={styles["detail-value"]}>Main Auditorium</span>
                  </div>
                  <div className={styles["detail-item"]}>
                    <span className={styles["detail-label"]}>Organizer:</span>
                    <span className={styles["detail-value"]}>{image?.type}</span>
                  </div>
                </div>
                <div className={styles["event-actions"]}>
                  <button className={`${styles["action-button"]} ${styles["register"]}`}>Register Now</button>
                  <button className={`${styles["action-button"]} ${styles["share"]}`}>Share Event</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ImageDrawer;
