"use client";

import { useState, useEffect } from "react";
import styles from "./profile-page.module.css";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    roleName: "",
    joinDate: "",
    bio: "",
    address: "",
    skills: "",
    socialLinks: {
      linkedin: "",
      twitter: "",
      github: "",
    },
  });

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
      setFormData({
        name: userData.user_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        roleName: userData.role_name || "",
        department: userData.department || "",
        designation: userData.designation || "",
        joinDate: userData.join_date || "",
        bio:
          userData.bio ||
          "I am a passionate professional with expertise in my field.",
        address: userData.address || "",
        skills: userData.skills || "Leadership, Communication, Problem Solving",
        socialLinks: userData.socialLinks || {
          linkedin: "https://linkedin.com/in/username",
          twitter: "https://twitter.com/username",
          github: "https://github.com/username",
        },
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update user data in localStorage
    const updatedUser = { ...user, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.coverPhoto}>
          <div className={styles.editCoverButton}>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className={styles.editButton}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
        <div className={styles.profilePhotoContainer}>
          <div className={styles.profilePhoto}>
            {formData.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.profileCard}>
          {isEditing ? (
            <form onSubmit={handleSubmit} className={styles.editForm}>
              <h2 className={styles.editTitle}>Edit Profile</h2>

              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="department">Department</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="designation">Designation</label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="designation">Role</label>
                  <input
                    type="text"
                    id="roleName"
                    name="roleName"
                    value={formData.role_name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="joinDate">Join Date</label>
                <input
                  type="date"
                  id="joinDate"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="skills">Skills</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                />
              </div>

              <h3 className={styles.socialTitle}>Social Links</h3>

              <div className={styles.formGroup}>
                <label htmlFor="linkedin">LinkedIn</label>
                <input
                  type="url"
                  id="linkedin"
                  name="socialLinks.linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="twitter">Twitter</label>
                <input
                  type="url"
                  id="twitter"
                  name="socialLinks.twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="github">GitHub</label>
                <input
                  type="url"
                  id="github"
                  name="socialLinks.github"
                  value={formData.socialLinks.github}
                  onChange={handleInputChange}
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  Save Changes
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.profileInfo}>
              <div className={styles.profileName}>{formData.name}</div>
              <div className={styles.profileRole}>{formData.designation}</div>
              <div className={styles.profileDepartment}>
                {formData.department}
              </div>

              <div className={styles.profileSection}>
                <h3 className={styles.sectionTitle}>Contact Information</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Email:</span>
                    <span className={styles.infoValue}>{formData.email}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Phone:</span>
                    <span className={styles.infoValue}>{formData.phone}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Address:</span>
                    <span className={styles.infoValue}>{formData.address}</span>
                  </div>
                </div>
              </div>

              <div className={styles.profileSection}>
                <h3 className={styles.sectionTitle}>About Me</h3>
                <p className={styles.profileBio}>{formData.bio}</p>
              </div>

              <div className={styles.profileSection}>
                <h3 className={styles.sectionTitle}>Work Information</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Department:</span>
                    <span className={styles.infoValue}>
                      {formData.department}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Designation:</span>
                    <span className={styles.infoValue}>
                      {formData.designation}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Role:</span>
                    <span className={styles.infoValue}>
                      {formData.roleName}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Join Date:</span>
                    <span className={styles.infoValue}>
                      {formData.joinDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.profileSection}>
                <h3 className={styles.sectionTitle}>Skills</h3>
                <div className={styles.skillsContainer}>
                  {formData.skills.split(",").map((skill, index) => (
                    <span key={index} className={styles.skillBadge}>
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.profileSection}>
                <h3 className={styles.sectionTitle}>Social Links</h3>
                <div className={styles.socialLinks}>
                  <a
                    href={formData.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    LinkedIn
                  </a>
                  <a
                    href={formData.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    Twitter
                  </a>
                  <a
                    href={formData.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
