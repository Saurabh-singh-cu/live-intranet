import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "antd";

import {
  FaBars,
  FaTimes,
  FaHome,
  FaUsers,
  FaChevronDown,
  FaRegListAlt,
  FaWpforms,
  FaDatabase,
  FaFileUpload,
  FaTrophy,
  FaCalendarAlt,
} from "react-icons/fa";

import {
  MdChecklist,
  MdCloudUpload,
  MdEmail,
  MdEmojiEvents,
  MdEventNote,
  MdOutlineDashboardCustomize,
  MdOutlinePermMedia,
  MdOutlineSettings,
  MdPriceChange,
  MdQrCodeScanner,
  MdSpaceDashboard,
} from "react-icons/md";
import { AiFillNotification, AiTwotoneFileExclamation } from "react-icons/ai";
import {
  BsCurrencyRupee,
  BsExplicitFill,
  BsFillCCircleFill,
  BsFillExplicitFill,
  BsRCircleFill,
} from "react-icons/bs";
import { GiNewspaper } from "react-icons/gi";
import styles from "./Sidebar.module.css";
import { FaRupeeSign, FaTable } from "react-icons/fa6";

const routes = [
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
    path: "/admin-dashboard",
    name: "Dashboard",
    icon: <MdOutlineDashboardCustomize />,
    allowedRoles: ["Admin"],
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
    path: "membership-and-cluster",
    name: "Membership & Cluster",
    icon: <FaTable />,
    allowedRoles: ["Admin"],
  },
  {
    path: "ceremony-even-view",
    name: "Ceremony Event View",
    icon: <MdEmojiEvents />,
    allowedRoles: ["Admin"],
  },
  {
    path: "/email/email-service",
    name: "Email",
    icon: <MdEmail />,
    allowedRoles: ["Admin"],
  },
  {
    path: "/push-feature-events",
    name: "Feature Event",
    icon: <AiFillNotification />,
    allowedRoles: ["Admin"],
  },
  {
    path: "/push-notification",
    name: "Push Notification",
    icon: <AiFillNotification />,
    allowedRoles: ["Admin"],
  },
  {
    path: "/push-news-views",
    name: "Push News & Views",
    icon: <GiNewspaper />,
    allowedRoles: ["Admin"],
  },
  {
    path: "/push-calender",
    name: "Calender",
    icon: <GiNewspaper />,
    allowedRoles: ["Admin"],
  },
  {
    path: "/student-secretary-dashboard",
    name: "Dashboard",
    icon: <MdOutlineDashboardCustomize />,
    allowedRoles: ["Student Secretary"],
  },
  {
    path: "/grouped-events-by-entity-form",
    name: "Club Nomination Form",
    icon: <FaTrophy />,
    allowedRoles: ["Student Secretary"],
  },
  {
    path: "/proposed-calendarby-secretary",
    name: "Proposed Calendar",
    icon: <FaCalendarAlt />,
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
    icon: <MdOutlineSettings />,
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
    icon: <BsExplicitFill />,
    allowedRoles: ["Admin"],
  },
  {
    path: "/registered-entities",
    name: "Registered Entities",
    icon: <BsRCircleFill />,
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

const SidebarMenu = ({ route, isOpen, setIsOpen, isMobile = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMobile) {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (!isOpen && !isMobile) {
      setIsMenuOpen(false);
    }
  }, [isOpen, isMobile]);

  return (
    <div className={isMobile ? styles.mobileMenuWrapper : styles.menuWrapper}>
      <div
        className={`${isMobile ? styles.mobileMenuItem : styles.menuItem} ${
          isMenuOpen ? styles.active : ""
        }`}
        onClick={toggleMenu}
      >
        <div className={styles.menuItemContent}>
          <div className={styles.iconWrapper}>{route.icon}</div>
          <AnimatePresence>
            {(isOpen || isMobile) && (
              <motion.div
                className={styles.linkText}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                {route.name}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {(isOpen || isMobile) && (
            <motion.div
              className={`${styles.arrowIcon} ${isMenuOpen ? styles.open : ""}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaChevronDown />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className={isMobile ? styles.mobileSubMenu : styles.subMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {route.subRoutes.map((subRoute, i) => (
              <NavLink
                key={i}
                to={subRoute.path}
                className={({ isActive }) =>
                  `${
                    isMobile ? styles.mobileSubMenuItem : styles.subMenuItem
                  } ${isActive ? styles.activeSubItem : ""}`
                }
              >
                <div className={styles.subMenuIcon}>{subRoute.icon}</div>
                <div className={styles.subMenuText}>{subRoute.name}</div>
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// This function returns the sidebar menu items for use in the mobile menu
export const getSidebarItems = () => {
  const [userRole, setUserRole] = useState("");
  const [isCoordinatorActive, setIsCoordinatorActive] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserRole(user?.role_name || "");
    setIsCoordinatorActive(user?.is_cordinator === "active");
  }, []);

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

  const filteredRoutes = updatedRoutes.filter((route) =>
    route.allowedRoles?.includes(userRole)
  );

  return filteredRoutes.map((route, index) => {
    if (route.subRoutes) {
      return (
        <SidebarMenu
          key={index}
          setIsOpen={setIsOpen}
          route={route}
          isOpen={true}
          isMobile={true}
        />
      );
    }

    return (
      <NavLink
        to={route.path}
        key={index}
        className={({ isActive }) =>
          `${styles.mobileNavLink} ${isActive ? styles.activeLink : ""}`
        }
      >
        <div className={styles.iconWrapper}>{route.icon}</div>
        <div className={styles.linkText}>{route.name}</div>
      </NavLink>
    );
  });
};

const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [isCoordinatorActive, setIsCoordinatorActive] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserRole(user?.role_name || "");
    setIsCoordinatorActive(user?.is_cordinator === "active");

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const filteredRoutes = updatedRoutes.filter((route) =>
    route.allowedRoles?.includes(userRole)
  );

  const toggle = () => setIsOpen(!isOpen);

  // If on mobile, don't render the sidebar
  if (isMobile) {
    return null;
  }

  return (
    <div className={styles.mainContainer}>
      <motion.div
        className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}
        animate={{
          width: isOpen ? 260 : 70,
          boxShadow: isOpen
            ? "10px 0 25px rgba(0,0,0,0.05)"
            : "5px 0 15px rgba(0,0,0,0.03)",
        }}
        transition={{
          duration: 0.3,
          type: "spring",
          damping: 18,
          stiffness: 120,
        }}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.logoContainer}>
            {isOpen && (
              <motion.div
                className={styles.logoText}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              ></motion.div>
            )}
          </div>
          <motion.div
            className={styles.toggleButton}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggle}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </motion.div>
        </div>

        <div className={styles.routesContainer}>
          {filteredRoutes.map((route, index) => {
            if (route.subRoutes) {
              return (
                <SidebarMenu
                  key={index}
                  setIsOpen={setIsOpen}
                  route={route}
                  isOpen={isOpen}
                />
              );
            }

            return (
              <Tooltip
                title={!isOpen ? route.name : ""}
                placement="right"
                key={index}
              >
                <NavLink
                  to={route.path}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.activeLink : ""}`
                  }
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className={styles.iconWrapper}>
                    {route.icon}
                    {!isOpen && hoveredItem === index && (
                      <motion.div
                        className={styles.iconPing}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "easeOut",
                        }}
                      />
                    )}
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        className={styles.linkText}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {route.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              </Tooltip>
            );
          })}
        </div>

        <div className={styles.sidebarFooter}>
          {isOpen && (
            <motion.div
              className={styles.userInfo}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.userRole}>{userRole}</div>
            </motion.div>
          )}
        </div>
      </motion.div>
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default SideBar;
