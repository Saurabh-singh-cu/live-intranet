// "use client";

// import { useState, useEffect } from "react";
// import styles from "./profile-page.module.css";
// import html2pdf from "html2pdf.js";
// import apiClient from "../config/apiClient";

// const ProfilePage = () => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [ratingsData, setRatingsData] = useState(null);
//   const [starCount, setStarCount] = useState(0);
//   const [currentDate] = useState(
//     new Date().toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     })
//   );
//   const [academicYear] = useState("2025-26");

//   useEffect(() => {
//     // Get user data from localStorage
//     const storedUserData = localStorage.getItem("user");
//     if (storedUserData) {
//       setUserData(JSON.parse(storedUserData));
//       getResultStarCount();
//     }
//     setLoading(false);
//   }, []);

//   const getResultStarCount = async () => {
//     try {
//       const response = await apiClient.get("get-all-entity-ratings/");
//       console.log(response.data);

//       // Store the ratings data
//       if (response.data && Array.isArray(response.data)) {
//         setRatingsData(response.data);

//         // Calculate star count if user data is available
//         const userData = JSON.parse(localStorage.getItem("user"));
//         if (
//           userData &&
//           userData.secretary_details &&
//           userData.secretary_details.length > 0
//         ) {
//           calculateStarCount(response.data, userData.secretary_details);
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const calculateStarCount = (ratingsData, secretaryDetails) => {
//     // Find matching entity in ratings data
//     const matchingRating = ratingsData.find((rating) => {
//       return secretaryDetails.some(
//         (detail) =>
//           detail.entity_name.toLowerCase() === rating.entity_name.toLowerCase()
//       );
//     });

//     // Default to 1 star (for no entity found or low marks)
//     let stars = 1;

//     if (matchingRating && matchingRating.ratings_data) {
//       // Sum up all ratings
//       const totalRating = matchingRating.ratings_data.reduce((sum, item) => {
//         return sum + (item.rating || 0);
//       }, 0);

//       console.log("Total Rating:", totalRating);

//       // Determine star count based on total rating
//       // If total rating is less than 30, keep it at 1 star (default)
//       if (totalRating >= 61) {
//         stars = 5;
//       } else if (totalRating >= 51) {
//         stars = 4;
//       } else if (totalRating >= 41) {
//         stars = 3;
//       } else if (totalRating >= 31) {
//         stars = 2;
//       }
//     }

//     // Always set star count, even if no matching entity found
//     setStarCount(stars);
//   };

//   const canDownloadCertificates = () => {
//     if (!userData) return false;

//     // Check if secretary_details exists and has data
//     if (
//       Array.isArray(userData.secretary_details) &&
//       userData.secretary_details.length > 0
//     ) {
//       return true;
//     }
//     return false;
//   };

//   const downloadEstablishmentCertificate = () => {
//     const userData = JSON.parse(localStorage.getItem("user"));
//     if (!userData) {
//       console.error("User data not found");
//       return;
//     }

//     const currentDate = new Date().toLocaleDateString();
//     const { user_name, department, secretary_details } = userData;
//     const { registration_name, registration_code, entity_name } =
//       secretary_details[0];

//     const certificate = document.createElement("div");
//     certificate.style.width = "1123px"; // A4 landscape
//     certificate.style.height = "794px";
//     certificate.style.position = "relative";
//     certificate.style.fontFamily = "serif";
//     certificate.style.overflow = "hidden";
//     certificate.style.boxSizing = "border-box";

//     certificate.innerHTML = `
//     <div style="width: 100%; height: 100%; position: relative;">
//       <!-- Background -->
//       <img src="/certificates/establishment.jpeg" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; object-fit: cover; z-index: 0;" />

//       <!-- Date top-right -->

//       <!-- Centered Content -->
//       <div style="position: absolute; top: 320px; left: 50%; transform: translateX(-50%); text-align: center; width: 80%; font-size: 18px; line-height: 30px; font-style: italic; z-index: 1;">
//         This is to certify that<br>
//         <strong style="text-decoration: underline;">${registration_name}</strong><br>
//         under the <strong style="text-decoration: underline;">${department}</strong><br>
//         Department, has successfully established a <strong style="text-decoration: underline;">${entity_name}</strong><br>
//         (Reference No. <strong style="text-decoration: underline;">${registration_code}</strong>) within the campus, in accordance with the norms and guidelines of<br>
//         Chandigarh University, during the academic year <strong>2025–26</strong>.
//       </div>
//     </div>
//   `;

//     const opt = {
//       margin: 0,
//       filename: "Establishment_Certificate.pdf",
//       image: { type: "jpeg", quality: 1 },
//       html2canvas: { scale: 2, useCORS: true },
//       jsPDF: { unit: "px", format: [1123, 794], orientation: "landscape" },
//     };

//     html2pdf().set(opt).from(certificate).save();
//   };

//   const downloadExcellenceCertificate = () => {
//     const userData = JSON.parse(localStorage.getItem("user"));
//     if (!userData) {
//       console.error("User data not found");
//       return;
//     }

//     const currentDate = new Date().toLocaleDateString();
//     const { user_name, department, secretary_details } = userData;
//     const { registration_name, registration_code } = secretary_details[0];

//     // Generate stars HTML based on star count
//     let starsHTML = "";
//     for (let i = 1; i <= 5; i++) {
//       if (i <= starCount) {
//         starsHTML += `<li style="color: gold;">★</li>`;
//       } else {
//         starsHTML += `<li style="color: #cccccc;">★</li>`;
//       }
//     }

//     const certificate = document.createElement("div");
//     certificate.style.width = "1123px"; // A4 landscape
//     certificate.style.height = "794px";
//     certificate.style.position = "relative";
//     certificate.style.fontFamily = "serif";
//     certificate.style.overflow = "hidden";
//     certificate.style.boxSizing = "border-box";

//     certificate.innerHTML = `
//     <div style="width: 100%; height: 100%; position: relative;">
//       <!-- Background -->
//       <img src="/certificates/excellence.jpeg" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; object-fit: cover; z-index: 0;" />

//       <!-- Stars -->
//       <div style="position: absolute; top: 250px; left: 50%; transform: translateX(-50%); z-index: 1; text-align: center;">
//         <ul style="list-style: none; padding: 0; margin: 0; display: flex; justify-content: center; gap: 10px; font-size: 49px;">
//           ${starsHTML}
//         </ul>
//       </div>

//       <!-- Centered Content -->
//       <div style="position: absolute; top: 320px; left: 50%; transform: translateX(-50%); text-align: center; width: 80%; font-size: 18px; line-height: 30px; font-style: italic; z-index: 1;">
//         This is to certify that<br>
//         <strong style="text-decoration: underline;">${registration_name}</strong><br>
//         has been recognized as the <strong style="text-decoration: underline;">${department}</strong><br>
//         of Chandigarh University for its outstanding performance, exceptional contributions, and active<br>
//         engagement in co-curricular activities during the academic year <strong>2024–2025</strong>.<br>
//         The club has demonstrated exemplary leadership, teamwork, and commitment towards <br>
//         enriching the student experience and upholding the values of the university. <br>
//         <strong>Congratulations on this well-deserved achievement.</strong>
//       </div>
//     </div>
//   `;

//     const opt = {
//       margin: 0,
//       filename: "Excellence_Certificate.pdf",
//       image: { type: "jpeg", quality: 1 },
//       html2canvas: { scale: 2, useCORS: true },
//       jsPDF: { unit: "px", format: [1123, 794], orientation: "landscape" },
//     };

//     html2pdf().set(opt).from(certificate).save();
//   };

//   if (loading) {
//     return (
//       <div className={styles.loadingContainer}>
//         <div className={styles.loadingSpinner}></div>
//         <p>Loading profile...</p>
//       </div>
//     );
//   }

//   if (!userData) {
//     return (
//       <div className={styles.errorContainer}>
//         <h2>User data not found</h2>
//         <p>Please log in to view your profile.</p>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.pageWrapper}>
//       <div className={styles.profileContainer}>
//         <div className={styles.mainContent}>
//           <div className={styles.headerBanner}>
//             <div className={styles.bannerContent}>
//               <h1>Welcome, {userData.user_name}!</h1>
//               <p>Chandigarh University Student Portal</p>
//             </div>
//             <div>
//               {canDownloadCertificates() && (
//                 <div className={styles.certificateButtonsContainer}>
//                   {/* <button
//                     className={`${styles.certificateButton} ${styles.establishmentButton}`}
//                     onClick={downloadEstablishmentCertificate}
//                   >
//                     <span className={styles.buttonIcon}>📜</span>
//                     Download Establishment Certificate
//                   </button> */}
//                   <button
//                     className={`${styles.certificateButton} ${styles.excellenceButton}`}
//                     onClick={downloadExcellenceCertificate}
//                   >
//                     <span className={styles.buttonIcon}>🏅</span>
//                     Download Excellence Certificate
//                     {starCount > 0 && (
//                       <span className={styles.starRating}>
//                         {Array(starCount)
//                           .fill(0)
//                           .map((_, i) => (
//                             <span key={i} className={styles.goldStar}></span>
//                           ))}
//                         {Array(5 - starCount)
//                           .fill(0)
//                           .map((_, i) => (
//                             <span key={i} className={styles.grayStar}></span>
//                           ))}
//                       </span>
//                     )}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className={styles.infoCards}>
//             <div className={styles.card}>
//               <div className={styles.cardHeader}>
//                 <h3>Personal Information</h3>
//               </div>
//               <div className={styles.cardContent}>
//                 <div className={styles.infoRow}>
//                   <div className={styles.infoLabel}>Name:</div>
//                   <div className={styles.infoValue}>{userData.user_name}</div>
//                 </div>

//                 <div className={styles.infoRow}>
//                   <div className={styles.infoLabel}>Department:</div>
//                   <div className={styles.infoValue}>{userData.department}</div>
//                 </div>
//                 <div className={styles.infoRow}>
//                   <div className={styles.infoLabel}>Role:</div>
//                   <div className={styles.infoValue}>{userData.role_name}</div>
//                 </div>
//                 <div className={styles.infoRow}>
//                   <div className={styles.infoLabel}>Coordinator Status:</div>
//                   <div className={styles.infoValue}>
//                     {userData.is_cordinator}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {Array.isArray(userData.secretary_details) &&
//               userData.secretary_details.length > 0 && (
//                 <div className={styles.card}>
//                   <div className={styles.cardHeader}>
//                     <h3>Club Information</h3>
//                   </div>
//                   <div className={styles.cardContent}>
//                     {userData.secretary_details.map((detail, index) => (
//                       <div key={index} className={styles.clubInfo}>
//                         <div className={styles.clubLogo}>
//                           {detail.registration_name.charAt(0)}
//                         </div>
//                         <div className={styles.clubDetails}>
//                           <h4>{detail.registration_name}</h4>
//                           <div className={styles.infoRow}>
//                             <div className={styles.infoLabel}>
//                               Registration Code:
//                             </div>
//                             <div className={styles.infoValue}>
//                               {detail.registration_code}
//                             </div>
//                           </div>
//                           <div className={styles.infoRow}>
//                             <div className={styles.infoLabel}>Entity:</div>
//                             <div className={styles.infoValue}>
//                               {detail.entity_name}
//                             </div>
//                           </div>
//                           <div className={styles.infoRow}>
//                             {ratingsData && starCount > 0 && (
//                               <div className={styles.starRatingContainer}></div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//             <div className={styles.card}>
//               <div className={styles.cardHeader}>
//                 <h3>Permissions</h3>
//               </div>
//               <div className={styles.cardContent}>
//                 <div className={styles.permissionsContainer}>
//                   {userData.permissions &&
//                     userData.permissions.map((permission, index) => (
//                       <div key={index} className={styles.permissionBadge}>
//                         {permission.permission_name}
//                         <span className={styles.entityBadge}>
//                           {permission.entity_name}
//                         </span>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             </div>

//             <div className={styles.card}>
//               <div className={styles.cardHeader}>
//                 <h3>Account Information</h3>
//               </div>
//               <div className={styles.cardContent}>
//                 <div className={styles.infoRow}>
//                   <div className={styles.infoLabel}>Access Status:</div>
//                   <div className={styles.infoValue}>
//                     <span className={styles.activeStatus}>Active</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
"use client";

import { useState, useEffect } from "react";
import styles from "./profile-page.module.css";
import html2pdf from "html2pdf.js";
import apiClient from "../config/apiClient";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratingsData, setRatingsData] = useState(null);
  const [starCount, setStarCount] = useState(1); // Default to 1 star
  const [totalRating, setTotalRating] = useState(0);
  const [currentDate] = useState(
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );
  const [academicYear] = useState("2025-26");

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      getResultStarCount();
    }
    setLoading(false);
  }, []);

  const getResultStarCount = async () => {
    try {
      const response = await apiClient.get("get-all-entity-ratings/");
      console.log("API Response:", response.data);

      // Store the ratings data
      if (response.data && Array.isArray(response.data)) {
        setRatingsData(response.data);

        // Calculate star count if user data is available
        const userData = JSON.parse(localStorage.getItem("user"));
        if (
          userData &&
          userData.secretary_details &&
          userData.secretary_details.length > 0
        ) {
          calculateStarCount(response.data, userData.secretary_details);
        }
      }
    } catch (error) {
      console.log("API Error:", error);
    }
  };

  const calculateStarCount = (ratingsData, secretaryDetails) => {
    console.log("Calculating star count...");
    console.log("Ratings Data:", ratingsData);
    console.log("Secretary Details:", secretaryDetails);

    // Find matching entity in ratings data by comparing entity names
    const matchingRating = ratingsData.find((rating) => {
      return secretaryDetails.some((detail) => {
        const apiEntityName = rating.entity_name.toLowerCase().trim();
        const localEntityName = detail.registration_name.toLowerCase().trim();
        console.log(`Comparing: "${apiEntityName}" with "${localEntityName}"`);
        return apiEntityName === localEntityName;
      });
    });

    console.log("Matching Rating Found:", matchingRating);

    // Default to 1 star
    let stars = 1;
    let calculatedTotal = 0;

    if (
      matchingRating &&
      matchingRating.ratings_data &&
      Array.isArray(matchingRating.ratings_data)
    ) {
      // Sum up all ratings from all questions
      calculatedTotal = matchingRating.ratings_data.reduce((sum, item) => {
        const rating = parseInt(item.rating) || 0;
        console.log(`Question: "${item.question}", Rating: ${rating}`);
        return sum + rating;
      }, 0);

      console.log("Total Rating Sum:", calculatedTotal);
      setTotalRating(calculatedTotal);

      // Determine star count based on total rating
      if (calculatedTotal >= 61) {
        stars = 5;
      } else if (calculatedTotal >= 51 && calculatedTotal <= 60) {
        stars = 4;
      } else if (calculatedTotal >= 41 && calculatedTotal <= 50) {
        stars = 3;
      } else if (calculatedTotal >= 31 && calculatedTotal <= 40) {
        stars = 2;
      } else {
        stars = 1; // Less than 30 or any other case
      }
    } else {
      console.log("No matching entity found or no ratings data available");
    }

    console.log("Final Star Count:", stars);
    setStarCount(stars);
  };

  const canDownloadCertificates = () => {
    if (!userData) return false;

    // Check if secretary_details exists and has data
    if (
      Array.isArray(userData.secretary_details) &&
      userData.secretary_details.length > 0
    ) {
      return true;
    }
    return false;
  };

  const downloadEstablishmentCertificate = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      console.error("User data not found");
      return;
    }

    const currentDate = new Date().toLocaleDateString();
    const { user_name, department, secretary_details } = userData;
    const { registration_name, registration_code, entity_name } =
      secretary_details[0];

    const certificate = document.createElement("div");
    certificate.style.width = "1123px"; // A4 landscape
    certificate.style.height = "794px";
    certificate.style.position = "relative";
    certificate.style.fontFamily = "serif";
    certificate.style.overflow = "hidden";
    certificate.style.boxSizing = "border-box";

    certificate.innerHTML = `
    <div style="width: 100%; height: 100%; position: relative;">
      <!-- Background -->
      <img src="/certificates/establishment.jpeg" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; object-fit: cover; z-index: 0;" />

      <!-- Centered Content -->
      <div style="position: absolute; top: 320px; left: 50%; transform: translateX(-50%); text-align: center; width: 80%; font-size: 18px; line-height: 30px; font-style: italic; z-index: 1;">
        This is to certify that<br>
        <strong style="text-decoration: underline;">${registration_name}</strong><br>
        under the <strong style="text-decoration: underline;">${department}</strong><br>
        Department, has successfully established a <strong style="text-decoration: underline;">${entity_name}</strong><br>
        (Reference No. <strong style="text-decoration: underline;">${registration_code}</strong>) within the campus, in accordance with the norms and guidelines of<br>
        Chandigarh University, during the academic year <strong>2025–26</strong>.
      </div>
    </div>
  `;

    const opt = {
      margin: 0,
      filename: "Establishment_Certificate.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "px", format: [1123, 794], orientation: "landscape" },
    };

    html2pdf().set(opt).from(certificate).save();
  };

  const downloadExcellenceCertificate = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      console.error("User data not found");
      return;
    }

    const currentDate = new Date().toLocaleDateString();
    const { user_name, department, secretary_details } = userData;
    const { registration_name, registration_code } = secretary_details[0];

    // Generate stars HTML based on star count
    let starsHTML = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= starCount) {
        starsHTML += `<li style="color: gold;">★</li>`;
      } else {
        starsHTML += `<li style="color: #cccccc;">★</li>`;
      }
    }

    const certificate = document.createElement("div");
    certificate.style.width = "1123px"; // A4 landscape
    certificate.style.height = "794px";
    certificate.style.position = "relative";
    certificate.style.fontFamily = "serif";
    certificate.style.overflow = "hidden";
    certificate.style.boxSizing = "border-box";

    certificate.innerHTML = `
    <div style="width: 100%; height: 100%; position: relative;">
      <!-- Background -->
      <img src="/certificates/excellence.jpeg" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; object-fit: cover; z-index: 0;" />
      
      <!-- Stars -->
      <div style="position: absolute; top: 250px; left: 50%; transform: translateX(-50%); z-index: 1; text-align: center;">
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; justify-content: center; gap: 10px; font-size: 49px;">
          ${starsHTML}
        </ul>
      </div>
      
      <!-- Centered Content -->
      <div style="position: absolute; top: 320px; left: 50%; transform: translateX(-50%); text-align: center; width: 80%; font-size: 18px; line-height: 30px; font-style: italic; z-index: 1;">
        This is to certify that<br>
        <strong style="text-decoration: underline;">${registration_name}</strong><br>
        has been recognized as the <strong style="text-decoration: underline;">${department}</strong><br>
        of Chandigarh University for its outstanding performance, exceptional contributions, and active<br>
        engagement in co-curricular activities during the academic year <strong>2024–2025</strong>.<br>
        The club has demonstrated exemplary leadership, teamwork, and commitment towards <br>
        enriching the student experience and upholding the values of the university. <br>
        <strong>Congratulations on this well-deserved achievement.</strong>
      </div>
    </div>
  `;

    const opt = {
      margin: 0,
      filename: "Excellence_Certificate.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "px", format: [1123, 794], orientation: "landscape" },
    };

    html2pdf().set(opt).from(certificate).save();
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={styles.errorContainer}>
        <h2>User data not found</h2>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.profileContainer}>
        <div className={styles.mainContent}>
          <div className={styles.headerBanner}>
            <div className={styles.bannerContent}>
              <h1>Welcome, {userData.user_name}!</h1>
              <p>Chandigarh University Student Portal</p>
            </div>
            <div>
              {canDownloadCertificates() && (
                <div className={styles.certificateButtonsContainer}>
                  {/* <button
                    className={`${styles.certificateButton} ${styles.establishmentButton}`}
                    onClick={downloadEstablishmentCertificate}
                  >
                    <span className={styles.buttonIcon}>📜</span>
                    Download Establishment Certificate
                  </button> */}
                  <button
                    className={`${styles.certificateButton} ${styles.excellenceButton}`}
                    onClick={downloadExcellenceCertificate}
                  >
                    <span className={styles.buttonIcon}>🏅</span>
                    Download Excellence Certificate
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.infoCards}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Personal Information</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Name:</div>
                  <div className={styles.infoValue}>{userData.user_name}</div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Department:</div>
                  <div className={styles.infoValue}>{userData.department}</div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Role:</div>
                  <div className={styles.infoValue}>{userData.role_name}</div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Coordinator Status:</div>
                  <div className={styles.infoValue}>
                    {userData.is_cordinator}
                  </div>
                </div>
              </div>
            </div>

            {Array.isArray(userData.secretary_details) &&
              userData.secretary_details.length > 0 && (
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>Club Information</h3>
                  </div>
                  <div className={styles.cardContent}>
                    {userData.secretary_details.map((detail, index) => (
                      <div key={index} className={styles.clubInfo}>
                        <div className={styles.clubLogo}>
                          {detail.registration_name.charAt(0)}
                        </div>
                        <div className={styles.clubDetails}>
                          <h4>{detail.registration_name}</h4>
                          <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>
                              Registration Code:
                            </div>
                            <div className={styles.infoValue}>
                              {detail.registration_code}
                            </div>
                          </div>
                          <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>Entity:</div>
                            <div className={styles.infoValue}>
                              {detail.entity_name}
                            </div>
                          </div>
                          {ratingsData && (
                            <div className={styles.infoRow}></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Permissions</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.permissionsContainer}>
                  {userData.permissions &&
                    userData.permissions.map((permission, index) => (
                      <div key={index} className={styles.permissionBadge}>
                        {permission.permission_name}
                        <span className={styles.entityBadge}>
                          {permission.entity_name}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Account Information</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Access Status:</div>
                  <div className={styles.infoValue}>
                    <span className={styles.activeStatus}>Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
