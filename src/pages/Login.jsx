"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import styles from "./Login.module.css";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiHome,
  FiUser,
  FiX,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import apiClient from "../config/apiClient";
import logoCu from "../assets/images/intralogonew.jpeg";

// Custom Notification Component
const Notification = ({ type, message, description, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheck />;
      case "error":
        return <FiAlertCircle />;
      default:
        return <FiAlertCircle />;
    }
  };

  return (
    <div className={`${styles.notification} ${styles[`notification-${type}`]}`}>
      <div className={styles.notificationIcon}>{getIcon()}</div>
      <div className={styles.notificationContent}>
        <h4 className={styles.notificationTitle}>{message}</h4>
        <p className={styles.notificationDescription}>{description}</p>
      </div>
      <button className={styles.notificationClose} onClick={onClose}>
        <FiX />
      </button>
    </div>
  );
};

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [resetStep, setResetStep] = useState(1);

  // Custom notification state
  const [notifications, setNotifications] = useState([]);

  // Handle notification display and removal
  const openNotification = (type, message, description) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, message, description }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      openNotification(
        "error",
        "Validation Error",
        "Please fill in all fields"
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post("login/", {
        user_email: email.toLowerCase(),
        password: password,
      });

      const data = response?.data;

      localStorage.setItem("user", JSON.stringify(data));

      // Show success notification
      openNotification(
        "success",
        "Login Successful",
        "Redirecting to dashboard..."
      );

      // Delay redirect to ensure notification is visible
      setTimeout(() => {
        onLogin();

        if (!data || !data.role_name) {
          console.error("Role name is missing or undefined");
          window.location.href = "/";
        } else {
          const role = data?.role_name;

          if (role.includes("Faculty Advisory")) {
            window.location.href = "/faculty-advisory-dashboard";
          } else if (role.includes("Co Curricular Coordinator")) {
            window.location.href = "/Co-Curricular-Coordinator-dashboard";
          } else if (
            role.includes("Faculty Advisory" && "Co Curricular Coordinator")
          ) {
            window.location.href = "/faculty-advisory-dashboard";
          } else {
            switch (role) {
              case "Admin":
                window.location.href = "/admin-dashboard";
                break;
              case "Student Secretary":
                window.location.href = "/student-secretary-dashboard";
                break;
              case "Event Data Manager":
                window.location.href = "/event-data-manager-dashboard";
                break;
              default:
                console.warn(`Unexpected role: ${role}`);
                window.location.href = "/";
                break;
            }
          }
        }
      }, 1000); // 1 second delay to show notification
    } catch (err) {
      console.error("Login error:", err);
      // Show error notification
      openNotification(
        "error",
        "Login Failed",
        err.response?.data?.message ||
          `Error ${err.response?.status || "unknown"}: Invalid credentials`
      );
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    setIsModalOpen(true);
    setResetStep(1);
    setResetEmail("");
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      openNotification("error", "Validation Error", "Please enter your email");
      return;
    }

    setIsResetting(true);
    try {
      const response = await apiClient.put(
        `password_reset/${resetEmail.toLowerCase()}/`
      );

      if (response.status === 200) {
        openNotification(
          "success",
          "Password Reset Email Sent",
          "Check your email for the auto-generated password and log in."
        );
        setTimeout(() => {
          setIsModalOpen(false);
        }, 1000); // Delay closing modal to ensure notification is visible
      } else {
        throw new Error("Failed to reset password");
      }
    } catch (error) {
      console.error("Reset error:", error);
      openNotification(
        "error",
        "Reset Failed",
        error.response?.data?.message ||
          error.message ||
          "Failed to reset password"
      );
    } finally {
      setIsResetting(false);
    }
  };

  const renderModalContent = () => {
    return (
      <div className={styles.forgotPasswordForm}>
        <h3 className={styles.modalTitle}>Reset Your Password</h3>
        <p className={styles.modalDescription}>
          Enter your email address and we'll send you instructions to reset your
          password.
        </p>
        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <FiMail className={styles.inputIcon} />
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className={styles.formInput}
            />
          </div>
        </div>
        <button
          onClick={handleResetPassword}
          disabled={isResetting}
          className={styles.resetButton}
        >
          {isResetting ? (
            <span className={styles.loadingSpinner}></span>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </div>
    );
  };

  return (
    <div className={styles.loginContainer}>
      {/* Custom Notifications Container */}
      <div className={styles.notificationsContainer}>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            type={notification.type}
            message={notification.message}
            description={notification.description}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

      <div className={styles.loginFormContainer}>
        <div className={styles.loginFormWrapper}>
          <div className={styles.logoContainer}>
            <img
              src={logoCu || "/placeholder.svg"}
              alt="Logo"
              className={styles.logo}
            />
          </div>

          <div className={styles.formHeader}>
            <h2 className={styles.loginTitle}>Welcome Back</h2>
            <p className={styles.loginSubtitle}>
              Sign in to continue to your account
            </p>
          </div>

          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Email address
              </label>
              <div className={styles.inputWrapper}>
                <FiMail className={styles.inputIcon} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={styles.formInput}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.passwordHeader}>
                <label htmlFor="password" className={styles.formLabel}>
                  Password
                </label>
                <button
                  type="button"
                  className={styles.forgotPasswordLink}
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>
              <div className={styles.inputWrapper}>
                <FiLock className={styles.inputIcon} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={styles.formInput}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.loadingSpinner}></span>
              ) : (
                <>
                  Sign in
                  <FiArrowRight className={styles.buttonIcon} />
                </>
              )}
            </button>
          </form>

          <div className={styles.formFooter}>
            <a href="/" className={styles.homeLink}>
              <FiHome className={styles.homeLinkIcon} />
              Back to home page
            </a>
          </div>
        </div>
      </div>

      <div className={styles.loginImageContainer}>
        <div className={styles.loginImageOverlay}>
          <div className={styles.imageContent}>
            <h1 className={styles.imageTitle}>Welcome to Cu-Intranet</h1>
            <p className={styles.imageSubtitle}>
              Discover amazing features and boost your productivity
            </p>
            <div className={styles.features}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <FiUser />
                </div>
                <div className={styles.featureText}>
                  <h3>Personalized Dashboard</h3>
                  <p>Access all your tools in one place</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <FiMail />
                </div>
                <div className={styles.featureText}>
                  <h3>Seamless Communication</h3>
                  <p>Connect with your team instantly</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        className={styles.forgotPasswordModal}
        width={400}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default Login;
