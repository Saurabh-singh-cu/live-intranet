import React, { useEffect } from 'react';
import styles from './Toast.module.css';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ show, type, message, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.toastIcon}>
        {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      </div>
      <div className={styles.toastMessage}>{message}</div>
      <button className={styles.closeToast} onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;