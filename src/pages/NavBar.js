import React, { useEffect, useRef, useState } from "react";

import { IoIosLogOut } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import logonew from "../assets/images/intralogonew.jpeg";
import {  SettingOutlined } from "@ant-design/icons";
import { Dropdown, Popover, Space } from "antd";
import "./NavBar.css";
import { useNavigate } from "react-router-dom";
import CreditModal from "../CreditScore/CreditModal";
import TokenExpireTime from "../tokenExpire/TokenExpireTime";






const NavBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expirationTime, setExpirationTime] = useState(null);
  const [user, setUser] = useState([]);


  const searchRef = useRef(null);
  const navigate = useNavigate();


  const [userName, setUserName] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      localStorage.clear();
      setIsLoggedIn(false);
      window.location.href = "/login";
    } else {
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    const getuser = JSON.parse(localStorage.getItem("user"));
    setUserName(getuser);
    console.log(getuser, "USER NAME");
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
      label: <TokenExpireTime  />,
      extra: `⌘L`,
    },
    {
      key: "4",
      label: `${userName?.role_name}`,
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
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setExpirationTime(null);
    localStorage.removeItem("user");
    localStorage.clear("user");
    window.location.href = "/login";
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



  const convertUTCToIST = (utcTimestamp) => {
    const utcDate = new Date(utcTimestamp);
    // console.log(utcDate, "FFFFFF")
    return utcDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
  };




  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div
          style={{ cursor: "pointer" }}
          onClick={navigatetohome}
          className="logoooo"
        >
          <img style={{ width: "136px", height: "34px" }} src={logonew} />
        </div>
      </div>
     
      <div className="search-wrapper" ref={searchRef}>
        <div className="search-container-nav">
          <input
            type="text"
            placeholder="Search & Bookmark your page"
            value={searchQuery}
            onChange={handleSearch}
            className="search-input-nav"
            onFocus={() => searchQuery.trim() && setShowResults(true)}
          />
        </div>
        {showResults && (
          <div className="search-results">
            {filteredResults.length > 0 ? (
              filteredResults.map((result, index) => (
                <div
                  key={index}
                  className="search-result-item"
                  onClick={() => handleResultClick(result.path)}
                >
                  {result.title}
                </div>
              ))
            ) : (
              <div className="search-result-item no-results">
                No results found
              </div>
            )}
          </div>
        )}
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            {["Admin", "Faculty Advisory", "Student Secretary", "Co Curricular Coordinator"].includes(
              userName?.role_name
            ) ? null : (
              <>
                <button
                  onClick={() => navigate("/join-now")}
                  className="nav-button"
                >
                  Join as New Member
                </button>
                <button
                  onClick={() => navigate("/Register-New-Entity")}
                  className="nav-button"
                >
                  Register New Entity
                </button>
              
              </>
            )}

            {/* Dropdown for logged-in user */}
            {userName && (
              <button className="icon-button desktop-only">
                <span className="greenDot"></span>
                <Dropdown menu={{ items }}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <span className="userOnNav">{userName?.user_name} </span>
                    </Space>
                  </a>
                </Dropdown>
              </button>
            )}
          </>
        ) : (
          // If not logged in, show buttons
          <>
            {/* <button onClick={handleCreditScoreCheck} className="nav-button">
              Check Credit Score
            </button> */}
           <Popover title="Join as New Member">
           <button
              onClick={() => navigate("/join-now")}
              className="nav-button"
            >
              Join as New Member
            </button>
           </Popover>
           <Popover title="Register New Entity">
           <button
              onClick={() => navigate("/Register-New-Entity")}
              className="nav-button"
            >
              Register New Entity
            </button>
           </Popover>
          </>
        )}

        {/* Login/Logout Button */}
        <div className="user-profile desktop-only">
          <span
            style={{ cursor: "pointer" }}
            onClick={handleLoginLogout}
            className="user-name"
          >
            {isLoggedIn ? (
              <div className="logout1">
                Log out{" "}
                <span style={{ marginLeft: "10px" }}>
                  <IoIosLogOut />
                </span>
              </div>
            ) : (
              <div className="logout1">Login</div>
            )}
          </span>
        </div>

        {/* Mobile Menu */}
        <button className="menu-button mobile-only" onClick={toggleMenu}>
          <FaBars />
        </button>
      </div>

    

      {isMenuOpen && (
        <div className="mobile-menu">
          <input
            type="text"
            placeholder="Search & Bookmark your page"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input-nav"
          />

          {isLoggedIn === true && userName ? (
            <button className="icon-button">
              <span className="greenDot"></span>
              <span className="userOnNav">Welcome {userName?.user_name}</span>
             
            </button>
          ) : null}
          <button className="icon-button" onClick={handleLoginLogout}>
            <span className="menu-show-">
              <IoIosLogOut />
            </span>
            <span style={{display:"flex", justifyContent:"center", flexDirection:"column"}} className="menu-show-">
              <div>
              {isLoggedIn ? "Log out" : "Login"}
            
              </div>
              <div>
              <TokenExpireTime onLogout={handleLogout} />
              </div>
             
            </span>
           
          </button>
        </div>
      )}
      <CreditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </nav>
  );
};

export default NavBar;
