"use client";

import { useEffect, useRef, useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import logonew from "../assets/images/intralogonew.jpeg";
import { SettingOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { Link, useNavigate } from "react-router-dom";
import CreditModal from "../CreditScore/CreditModal";
import TokenExpireTime from "../tokenExpire/TokenExpireTime";
import styles from "./NavBar.module.css";

import {
  FaHome,
  FaUsers,
  FaChevronDown,
  FaWpforms,
  FaSearch,
  FaRegCompass,
  FaRegLightbulb,
  FaRegBell,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import {
  MdEmail,
  MdEmojiEvents,
  MdEventNote,
  MdOutlineDashboardCustomize,
  MdOutlinePermMedia,
  MdSpaceDashboard,
} from "react-icons/md";
import { AiTwotoneFileExclamation } from "react-icons/ai";
import {
  BsCurrencyRupee,
  BsFillCCircleFill,
  BsFillExplicitFill,
} from "react-icons/bs";
import ProfilePage from "../profile/ProfilePage";

const NavBar = ({ isLoggedIn, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expirationTime, setExpirationTime] = useState(null);
  const [user, setUser] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileMenuItems, setMobileMenuItems] = useState([]);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState({});
  const [activeTab, setActiveTab] = useState("home");
  const [animate, setAnimate] = useState(false);

  // Animation effect for the button
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate((prev) => !prev);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleRateClubClick = () => {
    window.location.href = "/club-rating";
  };

  const searchRef = useRef(null);
  const navigate = useNavigate();

  const [userName, setUserName] = useState([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Generate mobile menu items based on user role
  useEffect(() => {
    if (isMenuOpen && isMobile) {
      generateMobileMenuItems();
    }
  }, [isMenuOpen, isMobile]);

  const generateMobileMenuItems = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user?.role_name || "";
    const isCoordinatorActive = user?.is_cordinator === "active";

    const routes = [
      {
        path: "/admin-dashboard",
        name: "Dashboard",
        icon: <MdOutlineDashboardCustomize />,
        allowedRoles: ["Admin"],
      },
      {
        path: "/home",
        name: "Home",
        icon: <FaHome />,
        allowedRoles: [
          "Admin",
          "Student Secretary",
          "Faculty Advisory",
          "Co Curricular Coordinator",
        ],
      },
      {
        path: "/COORD",
        name: "COORD",
        icon: <BsFillCCircleFill />,
        allowedRoles: ["Co Curricular Coordinator"],
        subRoutes: [
          {
            path: "/Co-Curricular-Coordinator-dashboard",
            name: "COORD Dashboard",
            icon: <MdSpaceDashboard />,
          },
          {
            path: "/add-budget",
            name: "Add Budget / Requests",
            icon: <BsCurrencyRupee />,
          },
          {
            path: "/registered-entities-coord",
            name: "Registered Entities",
            icon: <MdEventNote />,
          },
          {
            path: "/proposed-calendar-coord",
            name: "Proposed Calendars",
            icon: <MdEventNote />,
          },
        ],
      },
      {
        path: "/Executive",
        name: "EDM",
        icon: <BsFillExplicitFill />,
        allowedRoles: ["Event Data Manager"],
        subRoutes: [
          {
            path: "/event-data-manager-dashboard",
            name: "Dashboard",
            icon: <MdEventNote />,
          },
          {
            path: "/event-data-manager-add-event",
            name: "Add Event",
            icon: <MdEventNote />,
          },
        ],
      },
      {
        path: "/email/email-service",
        name: "Email",
        icon: <MdEmail />,
        allowedRoles: ["Admin"],
      },
      {
        path: "/student-secretary-dashboard",
        name: "Dashboard",
        icon: <MdOutlineDashboardCustomize />,
        allowedRoles: ["Student Secretary"],
      },
      {
        path: "/faculty-advisory-dashboard",
        name: "Dashboard",
        icon: <MdOutlineDashboardCustomize />,
        allowedRoles: ["Faculty Advisory"],
      },
      {
        path: "/configuration",
        name: "Configuration",
        icon: <FaWpforms />,
        allowedRoles: ["Admin"],
      },
      {
        path: "/media-request",
        name: "Media Request",
        icon: <FaWpforms />,
        allowedRoles: ["Faculty Advisory"],
      },
      {
        path: "/publishEvent",
        name: "Publish Your Event",
        icon: <MdEmojiEvents />,
        allowedRoles: ["Faculty Advisory"],
      },
      {
        path: "/media-update-request",
        name: "Media Update",
        icon: <MdOutlinePermMedia />,
        allowedRoles: ["Student Secretary"],
      },
      {
        path: "/registered-members-list",
        name: "Registered Members",
        icon: <FaUsers />,
        allowedRoles: ["Student Secretary"],
      },
      {
        path: "/EntityRegistrationForm",
        name: "Entity Registration Form",
        icon: <FaWpforms />,
        allowedRoles: ["Admin"],
      },
      {
        path: "/entityTable",
        name: "Entity Request",
        icon: <FaWpforms />,
        allowedRoles: ["Admin"],
      },
      {
        path: "/registered-entities",
        name: "Registered Entities",
        icon: <FaWpforms />,
        allowedRoles: ["Admin"],
      },
      {
        path: "/file-manager",
        name: "Documents",
        icon: <AiTwotoneFileExclamation />,
        allowedRoles: ["Admin"],
        subRoutes: [
          {
            path: "/event-published-request",
            name: "Event Published Request",
            icon: <MdEventNote />,
          },
        ],
      },
    ];

    // Update routes based on coordinator status
    const updatedRoutes = routes.map((route) => {
      if (route.path === "/COORD") {
        if (userRole === "Faculty Advisory" && isCoordinatorActive) {
          return {
            ...route,
            allowedRoles: [...route.allowedRoles, "Faculty Advisory"],
            subRoutes: route.subRoutes.map((subRoute) => ({
              ...subRoute,
              allowedRoles: [
                ...(subRoute.allowedRoles || []),
                "Faculty Advisory",
              ],
            })),
          };
        }
      }
      return route;
    });

    // Filter routes based on user role
    const filteredRoutes = updatedRoutes.filter((route) =>
      route.allowedRoles?.includes(userRole)
    );

    setMobileMenuItems(filteredRoutes);
  };

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      onLogout();
    } else {
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    const getuser = JSON.parse(localStorage.getItem("user"));
    setUserName(getuser);
  }, []);

  const navigatetohome = () => {
    if (userName?.role_name === "Admin") {
      window.location.href = "/admin-dashboard";
    } else if (userName?.role_name === "Student Secretary") {
      window.location.href = "/student-secretary-dashboard";
    } else {
      window.location.href = "/";
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSubmenu = (index) => {
    setIsSubmenuOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const items = [
    {
      key: "1",
      label: "My Account",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: <Link to="/my-profile">Profile</Link>,
      extra: "⌘P",
    },
    {
      key: "3",
      label: <TokenExpireTime />,
      extra: "⌘L",
    },
    {
      key: "4",
      label: `${userName?.role_name || "Guest"}`,
      icon: <SettingOutlined />,
      extra: "⌘S",
    },
  ];

  const pages = [
    { title: "Dashboard", path: "/" },
    { title: "Clubs", path: "/clubs" },
    { title: "Departments", path: "/department-society" },
    { title: "Communities", path: "/communities" },
    { title: "Professional Society", path: "/professional-society" },
    { title: "Join Now", path: "/join-now" },
    { title: "Settings", path: "/settings" },
    { title: "Profile", path: "/profile" },
  ];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const overlay = document.querySelector(`.${styles.mobileMenuOverlay}`);
      if (overlay && !overlay.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen && isMobile) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen, isMobile]);

  const handleLogout = () => {
    onLogout();
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const results = pages.filter((page) =>
        page.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleResultClick = (path) => {
    navigate(path);
    setSearchQuery("");
    setShowResults(false);
  };

  const handleCreditScoreCheck = () => {
    setIsModalOpen(true);
  };

  // Render submenu items
  const renderSubMenu = (subRoutes, parentIndex) => {
    return (
      <div
        className={`${styles.mobileSubmenu} ${
          isSubmenuOpen[parentIndex] ? styles.submenuOpen : ""
        }`}
      >
        {subRoutes.map((subRoute, index) => (
          <div
            key={index}
            className={styles.mobileSubmenuItem}
            onClick={() => {
              navigate(subRoute.path);
              setIsMenuOpen(false);
            }}
          >
            <span className={styles.mobileSubmenuIcon}>{subRoute.icon}</span>
            <span className={styles.mobileSubmenuText}>{subRoute.name}</span>
          </div>
        ))}
      </div>
    );
  };

  const mainNavItems = [
    { id: "home", label: "Home", icon: <FaHome />, path: "/" },
    {
      id: "clubs",
      label: "Clubs",
      icon: <FaUsers />,
      path: "/clubs",
      colorClass: styles.clubNavItem,
      activeColorClass: styles.activeClubItem,
      indicatorClass: styles.clubIndicator,
    },
    {
      id: "departments",
      label: "Departments",
      icon: <MdOutlineDashboardCustomize />,
      path: "/department-society",
      colorClass: styles.departmentNavItem,
      activeColorClass: styles.activeDepartmentItem,
      indicatorClass: styles.departmentIndicator,
    },
    {
      id: "communities",
      label: "Communities",
      icon: <FaRegCompass />,
      path: "/communities",
      colorClass: styles.communityNavItem,
      activeColorClass: styles.activeCommunityItem,
      indicatorClass: styles.communityIndicator,
    },
    {
      id: "professional",
      label: "Professional",
      icon: <FaRegLightbulb />,
      path: "/professional-society",
      colorClass: styles.professionalNavItem,
      activeColorClass: styles.activeProfessionalItem,
      indicatorClass: styles.professionalIndicator,
    },
  ];

  return (
    <>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarTop}>
          <div className={styles.navbarTopInner}>
            <div className={styles.logoSection} onClick={navigatetohome}>
              <img
                src={logonew || "/placeholder.svg"}
                alt="Logo"
                className={styles.logo}
              />
            </div>

            <div className={styles.searchSection} ref={searchRef}>
              <div className={styles.searchInputContainer}>
                <FaSearch className={styles.searchIconTop} />
                <input
                  type="text"
                  placeholder="Search pages, events, clubs..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className={styles.searchInput}
                  onFocus={() => searchQuery.trim() && setShowResults(true)}
                />
              </div>

              {showResults && (
                <div className={styles.searchResultsDropdown}>
                  <div className={styles.searchResultsHeader}>
                    <span>Search Results</span>
                    <button onClick={() => setShowResults(false)}>
                      <FaTimes />
                    </button>
                  </div>
                  <div className={styles.searchResultsList}>
                    {filteredResults.length > 0 ? (
                      filteredResults.map((result, index) => (
                        <div
                          key={index}
                          className={styles.searchResultItem}
                          onClick={() => handleResultClick(result.path)}
                        >
                          {result.title}
                        </div>
                      ))
                    ) : (
                      <div className={styles.noResultsFound}>
                        No results found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.userSection}>
              {isLoggedIn ? (
                <>
                  <div className={styles.notificationIcon}>
                    <FaRegBell />
                    <span className={styles.notificationBadge}>2</span>
                  </div>

                  <div className={styles.userProfileSection}>
                    <Dropdown menu={{ items }} trigger={["click"]}>
                      <div className={styles.userProfileTrigger}>
                        <div className={styles.userAvatarCircle}>
                          {userName?.user_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.userNameDisplay}>
                          <span>{userName?.user_name}</span>
                          <FaChevronDown className={styles.dropdownArrow} />
                        </div>
                      </div>
                    </Dropdown>
                  </div>

                  <button
                    onClick={handleLoginLogout}
                    className={styles.logoutButton}
                  >
                    <IoIosLogOut />
                    <span className={styles.logoutText}>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLoginLogout}
                  className={styles.loginButton}
                >
                  Login
                </button>
              )}

              <button className={styles.mobileMenuToggle} onClick={toggleMenu}>
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>

        {!isLoggedIn && (
          <div className={styles.navbarBottom}>
            <div className={styles.navbarBottomInner}>
              <div className={styles.mainNavigation}>
                {mainNavItems.map((item) => (
                  <button
                    key={item.id}
                    className={`${styles.mainNavItem} ${
                      activeTab === item.id
                        ? `${styles.activeNavItem} ${
                            item.activeColorClass || ""
                          }`
                        : ""
                    } ${item.colorClass || ""}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      navigate(item.path);
                    }}
                  >
                    <div className={styles.mainNavIcon}>{item.icon}</div>
                    <span className={styles.mainNavLabel}>{item.label}</span>
                    {activeTab === item.id && (
                      <div
                        className={`${styles.activeIndicator} ${
                          item.indicatorClass || ""
                        }`}
                      ></div>
                    )}
                  </button>
                ))}
              </div>

              <div className={styles.actionButtons}>
                {![
                  "Admin",
                  "Faculty Advisory",
                  "Student Secretary",
                  "Co Curricular Coordinator",
                ].includes(userName?.role_name) && (
                  <>
                    <button
                      className={`${styles.rateButton} ${
                        animate ? styles.pulse : ""
                      }`}
                      onClick={handleRateClubClick}
                    >
                      <span className={styles.rateText}>Rate Clubs</span>
                      <span className={styles.rateIcon}>★</span>
                    </button>
                    <button
                      onClick={() => navigate("/join-now")}
                      className={styles.joinButton}
                    >
                      Join as Member
                    </button>
                    <button
                      onClick={() => navigate("/Register-New-Entity")}
                      className={styles.registerButton}
                    >
                      Register Entity
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenuOverlay}>
          <div className={styles.mobileMenuContent}>
            <div className={styles.mobileMenuHeader}>
              <button
                className={styles.mobileMenuCloseButton}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            {isLoggedIn ? (
              <div className={styles.mobileUserProfile}>
                <div className={styles.mobileUserAvatar}>
                  {userName?.user_name?.charAt(0).toUpperCase()}
                </div>
                <div className={styles.mobileUserInfo}>
                  <div className={styles.mobileUserName}>
                    {userName?.user_name}
                  </div>
                  <div className={styles.mobileUserRole}>
                    {userName?.role_name}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleLoginLogout}
                className={styles.mobileLoginButton}
              >
                Login to Your Account
              </button>
            )}

            <div className={styles.mobileSearch}>
              <div className={styles.mobileSearchInputWrapper}>
                <FaSearch className={styles.mobileSearchIcon} />
                <input
                  type="text"
                  placeholder="Search..."
                  className={styles.mobileSearchInput}
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>

            <div className={styles.mobileMainNav}>
              {mainNavItems.map((item) => (
                <button
                  key={item.id}
                  className={styles.mobileMainNavItem}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                >
                  <div className={styles.mobileNavIcon}>{item.icon}</div>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {![
              "Admin",
              "Faculty Advisory",
              "Student Secretary",
              "Co Curricular Coordinator",
            ].includes(userName?.role_name) && (
              <div className={styles.mobileActionButtons}>
                <button
                  className={`${styles.rateButton} ${
                    animate ? styles.pulse : ""
                  }`}
                  onClick={handleRateClubClick}
                >
                  <span className={styles.rateText}>Rate Clubs</span>
                  <span className={styles.rateIcon}>★</span>
                </button>
                <button
                  onClick={() => navigate("/join-now")}
                  className={styles.mobileJoinButton}
                >
                  Join as Member
                </button>
                <button
                  onClick={() => navigate("/Register-New-Entity")}
                  className={styles.mobileRegisterButton}
                >
                  Register Entity
                </button>
              </div>
            )}

            {isLoggedIn && mobileMenuItems.length > 0 && (
              <div className={styles.mobileMenuItems}>
                <div className={styles.mobileMenuTitle}>Navigation</div>
                {mobileMenuItems.map((route, index) => (
                  <div key={index} className={styles.mobileMenuItem}>
                    {route.subRoutes ? (
                      <div className={styles.mobileMenuWithSubmenu}>
                        <div
                          className={styles.mobileMenuParent}
                          onClick={() => toggleSubmenu(index)}
                        >
                          <span className={styles.mobileMenuIcon}>
                            {route.icon}
                          </span>
                          <span className={styles.mobileMenuText}>
                            {route.name}
                          </span>
                          <FaChevronDown
                            className={`${styles.submenuArrow} ${
                              isSubmenuOpen[index] ? styles.rotated : ""
                            }`}
                          />
                        </div>
                        {renderSubMenu(route.subRoutes, index)}
                      </div>
                    ) : (
                      <div
                        className={styles.mobileMenuLink}
                        onClick={() => {
                          navigate(route.path);
                          setIsMenuOpen(false);
                        }}
                      >
                        <span className={styles.mobileMenuIcon}>
                          {route.icon}
                        </span>
                        <span className={styles.mobileMenuText}>
                          {route.name}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {isLoggedIn && (
              <div className={styles.mobileLogoutSection}>
                <button
                  onClick={handleLogout}
                  className={styles.mobileLogoutButton}
                >
                  <IoIosLogOut className={styles.mobileLogoutIcon} />
                  <span>Logout</span>
                </button>
                <div className={styles.sessionInfo}>
                  <TokenExpireTime onLogout={handleLogout} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <CreditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default NavBar;
