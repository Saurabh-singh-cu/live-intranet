import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import { notification, Drawer } from "antd";
import Swal from "sweetalert2";
import logo from "../assets/images/logo.png";
import circle from "../assets/images/intralogonew.jpeg";
import "./Login.css";
import apiClient from "../config/apiClient";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();
  const recaptchaRef = useRef();

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      duration: 3,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await apiClient.post("login/", {
        user_email: email.toLowerCase(),
        password: password,
      });

      const data = response?.data;
      console.log(data, "USER GET");

      // if (!response.ok) {
      //   throw new Error(data.message || "An error occurred during login");
      // }

      localStorage.setItem("user", JSON.stringify(data));

      openNotification(
        "success",
        "Login Successful",
        "Redirecting to dashboard..."
      );
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

        } else if (role.includes("Faculty Advisory" && "Co Curricular Coordinator")) {
          window.location.href = "/faculty-advisory-dashboard"
        }
         else {
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
      

      console.log("Login successful", data);
    } catch (err) {
      console.log(err, "ERRRRR")
      openNotification("error", "Login Failed", err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  const handleForgotPassword = () => {
    setIsDrawerOpen(true);
  };

  const handleResetPassword = async () => {
    setIsResetting(true);
    try {
      const response = await apiClient.put(
        `password_reset/${resetEmail.toLowerCase()}/`,
      );

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      Swal.fire({
        icon: "success",
        title: "Password Reset",
        text: "Check your email for the auto-generated password and log in.",
      });

      setIsDrawerOpen(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-form-wrapper">
          <div className="logo-container">
            <img style={{ width: "230px" }} src={circle} alt="Logo" />
          </div>
          <h2 className="login-title">Welcome back</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div style={{ marginBottom: "0px" }} className="form-group">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: "0px" }} className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="form-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="forgot-password-link">
              <a href="#" onClick={handleForgotPassword}>
                Forgot Password?
              </a>
            </p>
            {/* <div className="recaptcha-container">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LeComoqAAAAAM7fMSrGeagGkmaDdtqdt12MzRjE"
                onChange={handleRecaptchaChange}
              />
            </div> */}
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="sign-in-link">
            Back to home page{" "}
            <a href="/" className="sign-in-anchor">
              Home
            </a>
          </p>
        </div>
      </div>
      <div className="login-image-container">
        <div className="login-image-overlay">
          <h1 className="image-title">Welcome to Cu-Intranet</h1>
          <p className="typewriter">
            Discover amazing features and boost your productivity
          </p>
        </div>
      </div>
      <Drawer
        title="Forgot Password"
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={400}
      >
        <div className="forgot-password-form">
          <p>Enter your email address to reset your password.</p>
          <div className="form-group">
            <label htmlFor="reset-email">Email address</label>
            <input
              id="reset-email"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="form-input"
            />
          </div>
          <button
            onClick={handleResetPassword}
            disabled={isResetting}
            className="submit-button"
          >
            {isResetting ? "Sending..." : "Send OTP"}
          </button>
        </div>
      </Drawer>
    </div>
  );
};

export default Login;
