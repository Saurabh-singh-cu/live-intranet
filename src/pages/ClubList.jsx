// import React, { useState, useEffect } from "react";
// import { Search } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// import "./ClubList.css";
// import {
//   MdGroup,
//   MdOutlineArrowBack,

// } from "react-icons/md";

// import Scroller from "../components/Scroller";
// import Footer from "../components/Footer";

// const ClubList = () => {
//   const [societies, setSocieties] = useState([]);
//   const [filteredSocieties, setFilteredSocieties] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [regId, setRegId] = useState(null);
//   const [mediaData, setMediaData] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchSocieties();
//   }, []);

//   const fetchSocieties = async () => {
//     try {
//       const response = await fetch(
//         "https://api.cuintranet.in/intranetapp/entity-registration-summary/?entity_id=1"
//       );
//       const data = await response.json();
//       setSocieties(data);
//       setFilteredSocieties(data);
//     } catch (error) {
//       console.error("Error fetching societies:", error);
//     }
//   };

//   const handleSearch = (e) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//     const filtered = societies.filter((society) =>
//       society.registration_name.toLowerCase().includes(term.toLowerCase())
//     );
//     setFilteredSocieties(filtered);
//   };

//   const handleCardClick = (clubSociety) => {
//     console.log(clubSociety, "DEKH");
//     navigate("/join-now-detailed-page", { state: { society: clubSociety, entity_id: 1 } });
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   useEffect(() => {
//     const getUserData = () => {
//       try {
//         const userData = localStorage.getItem("user");
//         if (userData) {
//           const parsedUserData = JSON.parse(userData);
//           if (
//             parsedUserData &&
//             parsedUserData.secretary_details &&
//             parsedUserData.secretary_details.reg_id
//           ) {
//             setRegId(parsedUserData.secretary_details.reg_id);
//           } else {
//             throw new Error("reg_id not found in user data");
//           }
//         } else {
//           throw new Error("User data not found in localStorage");
//         }
//       } catch (err) {
//         console.log(`Failed to get user data: ${err.message}`);
//       }
//     };

//     getUserData();
//   }, []);

//   useEffect(() => {
//     if (regId) {
//       approvedMedia(regId);
//       console.log(regId, "RRRRRRRRRRRRRRRRRRRRRRRRR");
//     }
//   }, [regId]);

//   const approvedMedia = async (regId) => {
//     try {
//       const fetch = await axios.get(
//         `https://api.cuintranet.in/intranetapp/entity_media_approved/${regId}/`
//       );
//       setMediaData(fetch?.data[0]);
//       console.log(fetch?.data[0], "FETCH MEDIA");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="club-container">
//       {/* Fixed Sidebar */}
//       <aside className="sidebar-list">
//         <div className="club-details-list">
//           <h2 className="entity-name-head"> Club</h2>
//           <p className="club-description">
//             Join our most active clubs and participate in exciting events and
//             activities.
//           </p>
//           {/* <div className="club-stats-list">
//             <div className="stat-item-list">
//               <MdGroup style={{ color: "white" }} size={20} />
//               <span className="member-list-count">

//               </span>
//             </div>
//             <div className="stat-item-list">
//               <MdOutlineOutlinedFlag style={{ color: "white" }} size={20} />
//               <span>{societies.length} Clubs</span>
//             </div>
//             <div className="stat-item-list">
//               <BsActivity style={{ color: "white" }} size={20} />
//               <span>50 Activities</span>
//             </div>
//           </div> */}
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="main-content-list">
//         <div className="search-container-list">
//           <div className="search-wrapper-list">
//             <Search className="search-icon-list" />
//             <input
//               type="text"
//               placeholder="Search clubs..."
//               value={searchTerm}
//               onChange={handleSearch}
//               className="search-input"
//             />
//           </div>
//         </div>
//         <div className="back-button">
//           <button onClick={handleBack}>
//             <MdOutlineArrowBack />
//             Back
//           </button>
//         </div>

//         <div className="cards-grid-list">
//           {filteredSocieties?.length > 0 &&
//             filteredSocieties.map((clubSociety) => (
//               <div
//                 key={clubSociety.registration_code}
//                 className="club-card-list"
//                 onClick={() => handleCardClick(clubSociety)}
//               >
//                 <div className="club-numbers">
//                   <div className="club-card-image">
//                     <h1>{clubSociety.registration_name?.charAt(0)}</h1>
//                   </div>
//                   <div className="card-content-list">
//                     <h3>{clubSociety.registration_name}</h3>
//                     <p style={{ fontWeight: "bold" }} className="club-location">
//                       Owner : {clubSociety.dept_name}
//                     </p>
//                     <div className="card-stats-list">
//                       <div className="stat">
//                         <MdGroup size={16} />
//                         <span>{clubSociety?.membership_count} Registered Member</span>
//                       </div>
//                     </div>
//                     <div className="tags"></div>
//                   </div>
//                 </div>
//                 <div className="price">Know More</div>
//               </div>
//             ))}
//         </div>

//         <div className="scroller-i">
//           <Scroller />
//         </div>
//       </main>

//       <Footer theme="clubTheme" />
//     </div>
//   );
// };

// export default ClubList;
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MdGroup, MdOutlineArrowBack } from "react-icons/md";
import Scroller from "../components/Scroller";
import Footer from "../components/Footer";
import styles from "./ClubList.module.css";

const ClubList = () => {
  const [societies, setSocieties] = useState([]);
  const [filteredSocieties, setFilteredSocieties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [regId, setRegId] = useState(null);
  const [mediaData, setMediaData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSocieties();
  }, []);

  const fetchSocieties = async () => {
    try {
      const response = await fetch(
        "https://api.cuintranet.in/intranetapp/entity-registration-summary/?entity_id=1"
      );
      const data = await response.json();
      setSocieties(data);
      setFilteredSocieties(data);
    } catch (error) {
      console.error("Error fetching societies:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = societies.filter((society) =>
      society.registration_name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredSocieties(filtered);
  };

  const handleCardClick = (clubSociety) => {
    navigate("/join-now-detailed-page", {
      state: { society: clubSociety, entity_id: 1 },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const getUserData = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setIsLoggedIn(true);
          if (
            parsedUserData &&
            parsedUserData.secretary_details &&
            parsedUserData.secretary_details.reg_id
          ) {
            setRegId(parsedUserData.secretary_details.reg_id);
          } else {
            throw new Error("reg_id not found in user data");
          }
        } else {
          throw new Error("User data not found in localStorage");
        }
      } catch (err) {
        console.log(`Failed to get user data: ${err.message}`);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    if (regId) {
      approvedMedia(regId);
    }
  }, [regId]);

  const approvedMedia = async (regId) => {
    try {
      const fetch = await axios.get(
        `https://api.cuintranet.in/intranetapp/entity_media_approved/${regId}/`
      );
      setMediaData(fetch?.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <aside
        className={`${styles.sidebar} ${
          isLoggedIn === true ? styles.noSideBar : styles.clubTheme
        }`}
      >
        <div className={styles.sidebarContent}>
          <h2 className={styles.entityTitle}>Club</h2>
          <p className={styles.entityDescription}>
            Join our most active clubs and participate in exciting events and
            activities.
          </p>
        </div>
      </aside>

      <main
        className={
          isLoggedIn === true ? styles.noMainContent : styles.mainContent
        }
      >
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>
        </div>

        <button
          onClick={handleBack}
          className={`${styles.backButton} ${styles.clubThemeButton}`}
        >
          <MdOutlineArrowBack />
          <span>Back</span>
        </button>

        <div className={styles.cardsGrid}>
          {filteredSocieties?.length > 0 &&
            filteredSocieties.map((clubSociety) => (
              <div
                key={clubSociety.registration_code}
                className={`${styles.card} ${styles.clubThemeCard}`}
                onClick={() => handleCardClick(clubSociety)}
              >
                <div className={styles.cardHeader}>
                  <div
                    className={`${styles.cardAvatar} ${styles.clubThemeAvatar}`}
                  >
                    <h1>{clubSociety.registration_name?.charAt(0)}</h1>
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>
                      {clubSociety.registration_name}
                    </h3>
                    <p className={styles.cardOwner}>
                      Owner: {clubSociety.dept_name}
                    </p>
                    <div className={styles.cardStats}>
                      <div className={styles.stat}>
                        <MdGroup className={styles.statIcon} />
                        <span>
                          {clubSociety?.membership_count} Registered Member
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`${styles.cardAction} ${styles.clubThemeAction}`}
                >
                  Know More
                </div>
              </div>
            ))}
        </div>

        <div className={styles.scrollerWrapper}>
          <Scroller />
        </div>
      </main>

      <Footer theme="clubTheme" />
    </div>
  );
};

export default ClubList;
