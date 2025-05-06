"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGift, FaTimes, FaFireAlt, FaStar } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import styles from "./PopupMessage.module.css";

const PopupMessage = ({
  isOpen,
  onClose,
  title = "Amazing!",
  message = "Keep up the great work!",
  type = "achievement",
}) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        color: ["#EB6C28", "#FFD700", "#FF4500", "#FF8C00", "#FFA500"][
          Math.floor(Math.random() * 5)
        ],
      }));
      setParticles(newParticles);
    }
  }, [isOpen]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaStar className={styles.icon} />;
      case "achievement":
        return <GiPartyPopper className={styles.icon} />;
      case "promotion":
        return <FaGift className={styles.icon} />;
      case "announcement":
        return <FaFireAlt className={styles.icon} />;
      default:
        return <GiPartyPopper className={styles.icon} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.popupOverlay}>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className={styles.confetti}
              initial={{
                top: "-10%",
                left: `${50 + (Math.random() * 40 - 20)}%`,
                opacity: 1,
              }}
              animate={{
                top: `${particle.y}%`,
                left: `${particle.x}%`,
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                ease: "easeOut",
              }}
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
              }}
            />
          ))}

          <motion.div
            className={styles.popupContainer}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <button className={styles.closeButton} onClick={onClose}>
              <FaTimes />
            </button>

            <div className={styles.popupContent}>
              <motion.div
                className={styles.iconContainer}
                initial={{ rotate: -30, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", damping: 10, delay: 0.2 }}
              >
                {getIcon()}
              </motion.div>

              <motion.div
                className={styles.glowCircle}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              <motion.h2
                className={styles.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {title}
              </motion.h2>

              <motion.p
                className={styles.message}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {message}
              </motion.p>

              <motion.button
                className={styles.actionButton}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: 0.7 }}
                onClick={onClose}
              >
                Awesome!
              </motion.button>
            </div>

            <div className={styles.decorationCorner1} />
            <div className={styles.decorationCorner2} />
            <div className={styles.decorationCorner3} />
            <div className={styles.decorationCorner4} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupMessage;
