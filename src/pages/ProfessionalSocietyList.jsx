import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MdGroup, MdOutlineArrowBack } from "react-icons/md";
import Scroller from "../components/Scroller";
import Footer from "../components/Footer";
import styles from "./ClubList.module.css";

const ProfessionalSociety = () => {
  const [societies, setSocieties] = useState([]);
  const [filteredSocieties, setFilteredSocieties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSocieties();
  }, []);

  const fetchSocieties = async () => {
    try {
      const response = await fetch(
        "http://172.17.2.247:8080/intranetapp/entity-registration-summary/?entity_id=3"
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
      state: { society: clubSociety, entity_id: 3 },
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
  return (
    <div className={styles.container}>
      <aside
        className={`${styles.sidebar} ${
          isLoggedIn === true ? styles.noSideBar : styles.chapterTheme
        }`}
      >
        <div className={styles.sidebarContent}>
          <h2 className={styles.entityTitle}>Student Chapters</h2>
          <p className={styles.entityDescription}>
            Join our most active Student Chapters and participate in exciting
            events and activities.
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
              placeholder="Search student chapters..."
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>
        </div>

        <button
          onClick={handleBack}
          className={`${styles.backButton} ${styles.chapterThemeButton}`}
        >
          <MdOutlineArrowBack />
          <span>Back</span>
        </button>

        <div className={styles.cardsGrid}>
          {filteredSocieties?.length > 0 &&
            filteredSocieties.map((clubSociety) => (
              <div
                key={clubSociety.registration_code}
                className={`${styles.card} ${styles.chapterThemeCard}`}
                onClick={() => handleCardClick(clubSociety)}
              >
                <div className={styles.cardHeader}>
                  <div
                    className={`${styles.cardAvatar} ${styles.chapterThemeAvatar}`}
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
                  className={`${styles.cardAction} ${styles.chapterThemeAction}`}
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

      <Footer theme="chapTheme" />
    </div>
  );
};

export default ProfessionalSociety;
