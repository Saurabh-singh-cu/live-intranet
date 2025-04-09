"use client"

import { useEffect, useRef, useState } from "react"
import { IoIosLogOut } from "react-icons/io"
import logonew from "../assets/images/intralogonew.jpeg"
import { SettingOutlined } from "@ant-design/icons"
import { Dropdown, Popover, Space } from "antd"
import { useNavigate } from "react-router-dom"
import CreditModal from "../CreditScore/CreditModal"
import TokenExpireTime from "../tokenExpire/TokenExpireTime"
import styles from "./NavBar.module.css"
import { FaBars, FaTimes, FaHome, FaUsers, FaChevronDown, FaWpforms, FaSearch } from "react-icons/fa"

import {
  MdEmail,
  MdEmojiEvents,
  MdEventNote,
  MdOutlineDashboardCustomize,
  MdOutlinePermMedia,
  MdSpaceDashboard,
} from "react-icons/md"
import { AiTwotoneFileExclamation } from "react-icons/ai"
import { BsCurrencyRupee, BsFillCCircleFill, BsFillExplicitFill } from "react-icons/bs"

const NavBar = ({ isLoggedIn, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [filteredResults, setFilteredResults] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [expirationTime, setExpirationTime] = useState(null)
  const [user, setUser] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mobileMenuItems, setMobileMenuItems] = useState([])
  const [isSubmenuOpen, setIsSubmenuOpen] = useState({})

  const searchRef = useRef(null)
  const navigate = useNavigate()

  const [userName, setUserName] = useState([])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Generate mobile menu items based on user role
  useEffect(() => {
    if (isMenuOpen && isMobile) {
      generateMobileMenuItems()
    }
  }, [isMenuOpen, isMobile])

  const generateMobileMenuItems = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const userRole = user?.role_name || ""
    const isCoordinatorActive = user?.is_cordinator === "active"

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
        allowedRoles: ["Admin", "Student Secretary", "Faculty Advisory", "Co Curricular Coordinator"],
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
    ]

    // Update routes based on coordinator status
    const updatedRoutes = routes.map((route) => {
      if (route.path === "/COORD") {
        if (userRole === "Faculty Advisory" && isCoordinatorActive) {
          return {
            ...route,
            allowedRoles: [...route.allowedRoles, "Faculty Advisory"],
            subRoutes: route.subRoutes.map((subRoute) => ({
              ...subRoute,
              allowedRoles: [...(subRoute.allowedRoles || []), "Faculty Advisory"],
            })),
          }
        }
      }
      return route
    })

    // Filter routes based on user role
    const filteredRoutes = updatedRoutes.filter((route) => route.allowedRoles?.includes(userRole))

    setMobileMenuItems(filteredRoutes)
  }

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      onLogout()
    } else {
      window.location.href = "/login"
    }
  }

  useEffect(() => {
    const getuser = JSON.parse(localStorage.getItem("user"))
    setUserName(getuser)
  }, [])

  const navigatetohome = () => {
    if (userName?.role_name === "Admin") {
      window.location.href = "/admin-dashboard"
    } else if (userName?.role_name === "Student Secretary") {
      window.location.href = "/student-secretary-dashboard"
    } else {
      window.location.href = "/"
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleSubmenu = (index) => {
    setIsSubmenuOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

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
      label: "Profile",
      extra: "⌘P",
    },
    {
      key: "3",
      label: <TokenExpireTime />,
      extra: `⌘L`,
    },
    {
      key: "4",
      label: `${userName?.role_name}`,
      icon: <SettingOutlined />,
      extra: "⌘S",
    },
  ]

  const pages = [
    { title: "Dashboard", path: "/" },
    { title: "Clubs", path: "/clubs" },
    { title: "Departments", path: "/department-society" },
    { title: "Communities", path: "/communities" },
    { title: "Professional Society", path: "/professional-society" },
    { title: "Join Now", path: "/join-now" },
    { title: "Settings", path: "/settings" },
    { title: "Profile", path: "/profile" },
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    onLogout()
  }

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim()) {
      const results = pages.filter((page) => page.title.toLowerCase().includes(query.toLowerCase()))
      setFilteredResults(results)
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }

  const handleResultClick = (path) => {
    navigate(path)
    setSearchQuery("")
    setShowResults(false)
  }

  const handleCreditScoreCheck = () => {
    setIsModalOpen(true)
  }

  // Render submenu items
  const renderSubMenu = (subRoutes, parentIndex) => {
    return (
      <div className={`${styles.mobileSubmenu} ${isSubmenuOpen[parentIndex] ? styles.submenuOpen : ""}`}>
        {subRoutes.map((subRoute, index) => (
          <div
            key={index}
            className={styles.mobileSubmenuItem}
            onClick={() => {
              navigate(subRoute.path)
              setIsMenuOpen(false)
            }}
          >
            <span className={styles.mobileSubmenuIcon}>{subRoute.icon}</span>
            <span className={styles.mobileSubmenuText}>{subRoute.name}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <div className={styles.logoContainer} onClick={navigatetohome}>
          <img src={logonew || "/placeholder.svg"} alt="Logo" className={styles.logo} />
        </div>
      </div>

      <div className={styles.searchWrapper} ref={searchRef}>
        <div className={styles.searchContainerNav}>
          <div className={styles.searchInputWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search & Bookmark your page"
              value={searchQuery}
              onChange={handleSearch}
              className={styles.searchInputNav}
              onFocus={() => searchQuery.trim() && setShowResults(true)}
            />
          </div>
        </div>
        {showResults && (
          <div className={styles.searchResults}>
            {filteredResults.length > 0 ? (
              filteredResults.map((result, index) => (
                <div key={index} className={styles.searchResultItem} onClick={() => handleResultClick(result.path)}>
                  {result.title}
                </div>
              ))
            ) : (
              <div className={`${styles.searchResultItem} ${styles.noResults}`}>No results found</div>
            )}
          </div>
        )}
      </div>

      <div className={styles.navbarRight}>
        {isLoggedIn ? (
          <>
            {["Admin", "Faculty Advisory", "Student Secretary", "Co Curricular Coordinator"].includes(
              userName?.role_name,
            ) ? null : (
              <>
                <button onClick={() => navigate("/join-now")} className={styles.navButton}>
                  Join as New Member
                </button>
                <button onClick={() => navigate("/Register-New-Entity")} className={styles.navButton}>
                  Register New Entity
                </button>
              </>
            )}

            {/* Dropdown for logged-in user */}
            {userName && (
              <button className={`${styles.iconButton} ${styles.desktopOnly}`}>
                <span className={styles.greenDot}></span>
                <Dropdown menu={{ items }}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <span className={styles.userOnNav}>{userName?.user_name} </span>
                      <FaChevronDown className={styles.dropdownIcon} />
                    </Space>
                  </a>
                </Dropdown>
              </button>
            )}
          </>
        ) : (
          <>
            <Popover title="Join as New Member">
              <button onClick={() => navigate("/join-now")} className={styles.navButton}>
                Join as New Member
              </button>
            </Popover>
            <Popover title="Register New Entity">
              <button onClick={() => navigate("/Register-New-Entity")} className={styles.navButton}>
                Register New Entity
              </button>
            </Popover>
          </>
        )}

        {/* Login/Logout Button */}
        <div className={`${styles.userProfile} ${styles.desktopOnly}`}>
          <button onClick={handleLoginLogout} className={styles.loginButton}>
            {isLoggedIn ? (
              <div className={styles.logout}>
                Log out
                <IoIosLogOut className={styles.logoutIcon} />
              </div>
            ) : (
              <div className={styles.logout}>Login</div>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <button className={styles.menuButton} onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileSearchContainer}>
            <div className={styles.searchInputWrapper}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search & Bookmark your page"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInputNav}
              />
            </div>
          </div>

          {isLoggedIn === true && userName ? (
            <div className={styles.mobileUserInfo}>
              <span className={styles.greenDot}></span>
              <span className={styles.userOnNav}>Welcome {userName?.user_name}</span>
            </div>
          ) : null}

          {/* Sidebar Navigation Items - Only shown on mobile */}
          {isLoggedIn && isMobile && (
            <div className={styles.mobileSidebarMenu}>
              <h3 className={styles.mobileMenuHeading}>Navigation</h3>
              {mobileMenuItems.map((route, index) => (
                <div key={index} className={styles.mobileMenuItem}>
                  {route.subRoutes ? (
                    <div className={styles.mobileMenuWithSubmenu}>
                      <div className={styles.mobileMenuParent} onClick={() => toggleSubmenu(index)}>
                        <span className={styles.mobileMenuIcon}>{route.icon}</span>
                        <span className={styles.mobileMenuText}>{route.name}</span>
                        <FaChevronDown
                          className={`${styles.submenuArrow} ${isSubmenuOpen[index] ? styles.rotated : ""}`}
                        />
                      </div>
                      {renderSubMenu(route.subRoutes, index)}
                    </div>
                  ) : (
                    <div
                      className={styles.mobileMenuLink}
                      onClick={() => {
                        navigate(route.path)
                        setIsMenuOpen(false)
                      }}
                    >
                      <span className={styles.mobileMenuIcon}>{route.icon}</span>
                      <span className={styles.mobileMenuText}>{route.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <button className={styles.mobileLogoutButton} onClick={handleLoginLogout}>
            <IoIosLogOut className={styles.mobileLogoutIcon} />
            <div className={styles.mobileLogoutText}>
              <div>{isLoggedIn ? "Log out" : "Login"}</div>
              <div>
                <TokenExpireTime onLogout={handleLogout} />
              </div>
            </div>
          </button>
        </div>
      )}
      <CreditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </nav>
  )
}

export default NavBar

