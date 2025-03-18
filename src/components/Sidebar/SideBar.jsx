import React, { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUsers,
  FaChevronDown,
  FaRegListAlt,
} from "react-icons/fa";
import {
  MdChecklist,
  MdCloudUpload,
  MdEmail,
  MdEmojiEvents,
  MdEventNote,
  MdOutlineDashboardCustomize,
  MdPriceChange,
  MdQrCodeScanner,
} from "react-icons/md";
import { AiTwotoneFileExclamation } from "react-icons/ai";
import { FaWpforms, FaCodePullRequest } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { BsCurrencyRupee, BsExplicitFill, BsFillCCircleFill, BsFillExplicitFill } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";
import "./Sidebar.css";
import { Tooltip } from "antd";

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
    path: "/registered-members-list",
    name: "Registered Members",
    icon: <FaUsers />,
    allowedRoles: ["Student Secretary"],
  },
  // {
  //   path: "/proposed-calendarby-secretary",
  //   name: "Proposed Calendar",
  //   icon: <MdPriceChange />,
  //   allowedRoles: ["Student Secretary"],
  // },
  {
    path: "/EntityRegistrationForm",
    name: "Entity Registration Form",
    icon: <FaWpforms />,
    allowedRoles: ["Admin"],
  },
  {
    path: "/entityTable",
    name: "Entity Request",
    icon: <FaCodePullRequest />,
    allowedRoles: ["Admin"],
  },
  {
    path: "/registered-entities",
    name: "Registered Entities",
    icon: <FaCodePullRequest />,
    allowedRoles: ["Admin"],
  },
  {
    path: "/file-manager",
    name: "Documents",
    icon: <AiTwotoneFileExclamation />,
    allowedRoles: ["Admin"],
    subRoutes: [
      // {
      //   path: "/event-approval-request",
      //   name: "Event Approval Request",
      //   icon: <MdEventNote />,
      // },
      {
        path: "/event-published-request",
        name: "Event Published Request",
        icon: <MdEventNote />,
      },
    ],
  },
];

const SidebarMenu = ({ route, isOpen, setIsOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsOpen(true);
  };



  useEffect(() => {
    if (!isOpen) {
      setIsMenuOpen(false);
    }
  }, [isOpen]);

  return (
    <>
      <div className="menu" onClick={toggleMenu}>
        <div className="icon">{route.icon}</div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="link_text"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
            >
              {route.name}
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={`arrow-icon ${isMenuOpen ? "open" : ""}`}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
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
            className="menu_container"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {route.subRoutes.map((subRoute, i) => (
              <NavLink key={i} to={subRoute.path} className="link sub_item">
                <div className="icon">{subRoute.icon}</div>
                <div className="link_text">{subRoute.name}</div>
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [isCoordinatorActive, setIsCoordinatorActive] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user?.role_name) {
      setUserRole(user.role_name);
    }

    // Check if is_cordinator is "active"
    if (user?.is_cordinator === "active") {
      setIsCoordinatorActive(true);
    }
  }, []);



  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserRole(user?.role_name || "");
    setIsCoordinatorActive(user?.is_cordinator === "active");
  }, []);



  const updatedRoutes = routes.map((route) => {
    if (route.path === "/COORD") {
      // If the user is a Faculty Advisory with is_cordinator active, modify allowedRoles
      if (userRole === "Faculty Advisory" && isCoordinatorActive) {
        return {
          ...route,
          allowedRoles: [...route.allowedRoles, "Faculty Advisory"], // Add Faculty Advisory
          subRoutes: route.subRoutes.map((subRoute) => ({
            ...subRoute,
            allowedRoles: [...(subRoute.allowedRoles || []), "Faculty Advisory"], // Ensure subRoutes also get access
          })),
        };
      }
    }
    return route;
  });
  
  // Now, filter the routes as usual
  const filteredRoutes = updatedRoutes.filter((route) => route.allowedRoles?.includes(userRole));
  



  const toggle = () => setIsOpen(!isOpen);
  return (

    <div className="main-container">
      <motion.div
        className={`sidebar ${isOpen ? "open" : ""}`}
        animate={{ width: isOpen ? 240 : 43 }}
        transition={{ duration: 0.3, type: "spring", damping: 10 }}
      >
        <div className="top_section_sidebar">
          <motion.div
            className="bars"
            initial={false}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <FaTimes onClick={toggle} /> : <FaBars onClick={toggle} />}
          </motion.div>
        </div>
        <div className="routes">
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
              <Tooltip title={!isOpen ? route.name : ""} placement="right" key={index}>
                <NavLink to={route.path} className="link" activeClassName="active">
                  <div className="icon">{route.icon}</div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        className="link_text"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
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
      </motion.div>
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;
