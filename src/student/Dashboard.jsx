"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import diljeet1 from "../assets/images/diljeet1.png";
import diljeet from "../assets/images/diljeet.png";
import c4 from "../assets/images/c4.png";

import Calendar from "../pages/Calendar";
import { useNavigate } from "react-router-dom";
import circle from "../assets/images/circle.svg";
import { PiFlagBanner } from "react-icons/pi";
import { FaHouseFlag, FaUnity } from "react-icons/fa6";
import { BiSolidBuildingHouse } from "react-icons/bi";

import Swal from "sweetalert2";

import cf from "../assets/images/cf.jpg";
import am from "../assets/images/am.jpg";
import news1 from "../assets/images/news1.jpg";
import { ChevronDown, ChevronUp } from "lucide-react";

import {
  Badge,
  Button,
  Drawer,
  Input,
  message,
  Upload as AntUpload,
  Modal,
  Select,
} from "antd";

import {
  InboxOutlined,
  NotificationOutlined,
  FileTextOutlined,
  FileImageOutlined,
  RadiusUprightOutlined,
} from "@ant-design/icons";
import Scroller from "../components/Scroller";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import expo from "../assets/images/expo.jpg";
import NewsViews from "../pages/NewsViews";

import not1 from "../assets/images/not1.png";
import not2 from "../assets/images/not2.png";
import apiClient from "../config/apiClient";
import EntitySelectorPopup from "./EntitySelectorPopup";
import "./Dashboard.css";
import ProfilePictureCards from "./ProfilePictureCard";
import CommitteeCardStudent from "./committeeCardStudent";
import UpdatedCarousel from "./drawerNotification/UpdatedCarousel";
import InfoCard from "./InfoCard";
import ActivityBarGraph from "./ActivityBarGraph";
import ActivityPieChart from "./ActivityPieChart";

const Dashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userName, setUserName] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [dashboardCount, setDashboardCount] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab1, setActiveTab1] = useState("Appointment Holder");
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerContent, setDrawerContent] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const [regId, setRegId] = useState(null);
  const [mediaData, setMediaData] = useState(null);

  const [commity, setCommity] = useState([]);

  // Entity selector popup state
  const [isEntitySelectorVisible, setIsEntitySelectorVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState(null); // 'banner' or 'logo'

  const [selectedEntity, setSelectedEntity] = useState("");

  const [availableEntities, setAvailableEntities] = useState([]);
  const [aboutText, setAboutText] = useState("");
  const [eligibilityText, setEligibilityText] = useState("");
  const [categoriesText, setCategoriesText] = useState("");
  const [categoriesOptions, setCategoriesOptions] = useState([]);

  const [filteredData, setFilteredData] = useState({
    club: 0,
    community: 0,
    professionalSociety: 0,
    departmentSociety: 0,
    all: 0,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [bannerPreview, setBannerPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Ref for the scrollable content
  const contentRef = useRef(null);
  // State to track scroll position
  const [scrollPosition, setScrollPosition] = useState(0);

  const navigate = useNavigate();

  // Handle scroll event to animate secretary info container
  const handleScroll = useCallback(() => {
    if (contentRef.current) {
      const position = contentRef.current.scrollTop;
      setScrollPosition(position);
    }
  }, []);

  // Add scroll event listener
  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll);
      return () => contentElement.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const carouselImages = [
    {
      src: expo,
      alt: "Major Event 1",
      type: "Showcase of Innovation and Excellence",
      title: "CU Projects Expo 2025 ",
    },
    {
      src: not1,
      alt: "University Event 1",
      type: "UPCOMING DEPT. SOCIETY EVENT",
      title: "Faculty Engagement",
    },
    {
      src: not2,
      alt: "University Event 2",
      type: "UPCOMING PROF. SOCIETY EVENT",
      title: "Meet The Shark",
    },
    {
      src: diljeet,
      alt: "University Event 1",
      type: "UPCOMING DEPT. SOCIETY EVENT",
      title: "Freshers' Welcome Party",
    },
    {
      src: diljeet1,
      alt: "University Event 2",
      type: "UPCOMING PROF. SOCIETY EVENT",
      title: "Annual Sports Meet",
    },
    {
      src: cf,
      alt: "University Event 3",
      type: "UPCOMING CO-CURRICULAR EVENT",
      title: "Career Fair 2024",
    },
    {
      src: am,
      alt: "University Event 4",
      type: "UPCOMING UNIVERSITY EVENT",
      title: "Alumni Reunion",
    },
  ];

  const tabData1 = {
    "Appointment Holder": [
      {
        from: "Faculty Advisor : Spectrum",
        content: "Club going to organize the workshop. Apply for Volunteer",
        messageTime: "2hr ago",
      },
      {
        from: "Student Secretary : CAC",
        content:
          "Group Project Discussion going to be held today at 4PM near C3 Block.",
        messageTime: "2hr ago",
      },
    ],
    "Section Management": [
      {
        from: "Co-Curricular Cord : CSE.",
        content: "Registration open for all department society till 10th Dec.",
        messageTime: "2hr ago",
      },
      {
        from: "HOD : CSE 3rd Year",
        content:
          "Mandatory DCPD workshop going to be organized by Career Department.",
        messageTime: "2hr ago",
      },
    ],
  };

  const discussions = [
    {
      title: "Club",
      participants: ["G", "D", "T"],
      additionalCount: 5,
      content: "Discussion about various club activities and events.",
    },
    {
      title: "Community",
      participants: ["A", "Q", "S"],
      additionalCount: 3,
      content:
        "Discussion forum for all Chandigarh University Student Tech Community & Community.",
    },
    {
      title: "Department Society",
      participants: ["C", "D", "P", "J"],
      additionalCount: 2,
      content:
        "Discussion forum for all Chandigarh University Student Department Society.",
    },
    {
      title: "Professional Society (Student Chapters)",
      participants: ["C", "S"],
      additionalCount: 2,
      content:
        "Discussion forum for all Chandigarh University Student Chapters. ",
    },
  ];

  const slides = [
    {
      title: (
        <span>
          Live <span style={{ color: "red" }} className="live-icon"></span>
        </span>
      ),
      image: news1,
    },
    { title: "Campus Life", image: diljeet1 },
    { title: "Student Activities", image: diljeet },
    { title: "Academic Excellence", image: c4 },
  ];

  // Update cards data
  const updateCards = [
    {
      title: "Update About & Eligibility & Category",
      icon: <FileTextOutlined />,
      type: "about_eligibility",
      description: "Update entity about and eligibility section",
      color: "#4CAF50",
    },
  ];

  const activityData = {
    iic: {
      members: 2,
      active: 1,
      inactive: 1,
    },
    mic: {
      announced: 4,
      active: 1,
      inactive: 0,
    },
    self: {
      members: 1,
      active: 1,
      inactive: 0,
    },
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const redirectClubs = () => {
    navigate("/clubs");
  };

  const redirectSociety = () => {
    navigate("/department-society");
  };
  const redirectComm = () => {
    navigate("/communities");
  };
  const redirectPro = () => {
    navigate("/professional-society");
  };

  useEffect(() => {
    const getuser = JSON.parse(localStorage.getItem("user"));
    setUserName(getuser);
    console.log(getuser, "USER NAME");
    dashboardCardCount();

    // Check if the user is a Student Secretary
    if (getuser && getuser.role_name === "Student Secretary") {
      setUserDetails(getuser);

      // If user is a Student Secretary, prepare available entities for selection
      if (getuser.secretary_details && getuser.secretary_details.length > 0) {
        const entities = getuser.secretary_details.map((entity) => ({
          value: entity.reg_id,
          label: entity.entity_name || entity.registration_name,
        }));
        setAvailableEntities(entities);
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 12000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  useEffect(() => {
    if (regId && regId.length > 0) {
      approvedMedia(regId);
      grtCommitiData(regId);
    }
  }, [regId]);

  useEffect(() => {
    dashboardCardCount();
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("user"); // Replace with actual key
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log("Parsed LocalStorage Data:", parsedData);

      // Extract reg_id array from secretary_details
      const regIds =
        parsedData?.secretary_details?.map((item) => item.reg_id) || [];

      console.log("Extracted regIds:", regIds); // Debugging

      if (regIds.length > 0) {
        setRegId(regIds); // Set the state with extracted reg_id array
      }
    }
  }, []);

  const grtCommitiData = useCallback(
    async (regIds) => {
      try {
        if (!regIds || regIds.length === 0) return; // Prevent empty calls

        const allCommityMember = [];
        for (const regId of regIds) {
          console.log(`Fetching data for reg_id: ${regId}`);

          const response = await apiClient.get(
            `entity-registration-detailed-page/?reg_id=${regId}`
          );

          if (response?.data) {
            allCommityMember.push(response.data);
          }
        }

        if (JSON.stringify(allCommityMember) !== JSON.stringify(commity)) {
          setCommity(allCommityMember); // Only update if data is different
        }

        console.log(allCommityMember, "[commityMember]");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [commity]
  );

  const dashboardCardCount = async () => {
    try {
      const response = await apiClient.get("entity_count/");
      setDashboardCount(response.data);
      filterData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filterData = (data) => {
    const filtered = {
      club: data.find((item) => item.entity_name === "CLUB")?.entity_count || 0,
      community:
        data.find((item) => item.entity_name === "COMMUNITY")?.entity_count ||
        0,
      professionalSociety:
        data.find((item) => item.entity_name === "PROFESSIONAL SOCIETY")
          ?.entity_count || 0,
      departmentSociety:
        data.find((item) => item.entity_name === "DEPARTMENT SOCIETY")
          ?.entity_count || 0,
      all: data.reduce((sum, item) => sum + item.entity_count, 0),
    };
    setFilteredData(filtered);
  };

  const handleSendClick = () => {
    Swal.fire({
      title: "You are not loggedIn",
      icon: "warning",
    });
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const redirectToLogin = () => {
    alert("Redirecting you to login page.");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  const showDrawer = (content) => {
    setDrawerContent(content);
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
    setDrawerContent(null);
  };

  const handleEditContent = () => {
    // Here you would typically send the editContent to your backend
    message.success("Content updated successfully");
    onCloseDrawer();
  };

  // Function to show the entity selector popup
  const showEntitySelector = (action) => {
    setCurrentAction(action);
    setIsEntitySelectorVisible(true);
  };

  // Function to handle entity selection from popup
  const handleEntitySelect = (selectedRegId) => {
    console.log(`Selected entity with reg_id: ${selectedRegId}`);

    if (currentAction === "banner" && bannerFile) {
      handleBannerUpload(selectedRegId);
    } else if (currentAction === "logo" && logoFile) {
      handleLogoUpload(selectedRegId);
    } else {
      message.error("No file selected or action undefined");
    }
  };

  // New function to handle opening update modal
  const openUpdateModal = (type) => {
    if (type === "about_eligibility") {
      setIsModalVisible(true);
      setSelectedEntity("");
      setAboutText("");
      setEligibilityText("");
      setCategoriesText(""); // Clear categories text as well
    } else {
      // For other card types, you would implement different modals
      Swal.fire({
        title: "Feature Coming Soon",
        text: "This feature is under development",
        icon: "info",
      });
    }
  };

  // New function to handle update submission
  const handleUpdateSubmit = async () => {
    if (!selectedEntity) {
      message.error("Please select an entity");
      return;
    }

    if (
      !aboutText.trim() &&
      !eligibilityText.trim() &&
      !categoriesText.trim()
    ) {
      message.error("Please enter at least one field to update");
      return;
    }

    try {
      // Create payload for the API
      const payload = {
        about: aboutText,
        eligibilty: eligibilityText, // Note: This matches the API field name you specified
        categories: categoriesText, // Add categories to the payload
      };

      // Make API call to update about and eligibility
      const response = await apiClient.put(
        `update_entity_registration_about_eligiblity/${selectedEntity}/`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Update Successful",
          text: "About, eligibility, and categories information has been updated",
          icon: "success",
        });

        setIsModalVisible(false);
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error(
        "Error updating about, eligibility, and categories:",
        error
      );
      Swal.fire({
        title: "Update Failed",
        text: error.message || "Please try again later",
        icon: "error",
      });
    }
  };

  const approvedMedia = useCallback(async (regIds) => {
    try {
      const allMedia = [];
      for (const regId of regIds) {
        const response = await apiClient.get(`entity_media_approved/${regId}/`);
        if (response?.data) {
          allMedia.push(response?.data);
        }
      }

      if (allMedia?.length > 0) {
        setMediaData((prevData) =>
          Array.isArray(prevData) ? [...prevData, allMedia] : [allMedia]
        );
        console.log(allMedia, "[]");
      }
    } catch (error) {
      console.log(error, "ENTITY MEDIA ERROR");
    }
  });

  // Updated to accept regId parameter
  const handleBannerUpload = async (selectedRegId) => {
    if (!selectedRegId) {
      message.error("No entity selected");
      return;
    }

    const formData = new FormData();
    formData.append("reg_id", selectedRegId);

    if (bannerFile) {
      formData.append("banner", bannerFile);
    } else {
      message.error("No banner file selected");
      return;
    }

    try {
      const response = await apiClient.post(
        "update_entity_media_banner/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        title: "Banner updated successfully",
        icon: "success",
      });

      // Refresh media data for the selected entity
      approvedMedia(selectedRegId);
      onCloseDrawer();
    } catch (error) {
      console.error("Error updating Banner:", error);
      Swal.fire({
        title: "An error occurred while updating Banner",
        icon: "error",
      });
    }
  };

  // Updated to accept regId parameter
  const handleLogoUpload = async (selectedRegId) => {
    if (!selectedRegId) {
      message.error("No entity selected");
      return;
    }

    const formData = new FormData();
    formData.append("reg_id", selectedRegId);

    if (logoFile) {
      formData.append("logo", logoFile);
    } else {
      message.error("No logo file selected");
      return;
    }

    try {
      const response = await apiClient.post(
        "update_entity_media_logo/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        title: "Logo updated successfully",
        icon: "success",
      });

      // Refresh media data for the selected entity
      approvedMedia(selectedRegId);
      onCloseDrawer();
    } catch (error) {
      console.error("Error updating Logo:", error);
      Swal.fire({
        title: "An error occurred while updating Logo",
        icon: "error",
      });
    }
  };

  const renderDrawerContent = () => {
    if (drawerContent === "media") {
      return (
        <>
          <form>
            <h3>Update Banner</h3>
            <AntUpload.Dragger
              name="banner"
              className="banner-box"
              multiple={false}
              accept="image/jpeg,image/png,image/gif,image/webp"
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("You can only upload image files!");
                  return AntUpload.LIST_IGNORE;
                }

                // Create preview
                const reader = new FileReader();
                reader.onload = () => {
                  setBannerPreview(reader.result);
                };
                reader.readAsDataURL(file);

                setBannerFile(file);
                return false;
              }}
              onChange={(info) => {
                const { status } = info.file;
                if (status !== "uploading") {
                  console.log(info.file, info.fileList);
                }
                if (status === "done") {
                  message.success(
                    `${info.file.name} banner file ready for upload.`
                  );
                } else if (status === "error") {
                  message.error(
                    `${info.file.name} banner file failed to prepare.`
                  );
                }
              }}
              action="/api/upload"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to upload banner
              </p>
              <p className="ant-upload-hint">
                Only JPG, PNG, GIF, and WebP images are allowed
              </p>
            </AntUpload.Dragger>

            {bannerPreview && (
              <div className="image-preview">
                <h4>Preview:</h4>
                <img
                  src={bannerPreview || "/placeholder.svg"}
                  alt="Banner preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    marginTop: "10px",
                  }}
                />
              </div>
            )}

            <Button
              style={{ marginTop: 16 }}
              onClick={() => showEntitySelector("banner")}
            >
              Update Media
            </Button>
          </form>
        </>
      );
    }
    switch (drawerContent) {
      case "banner":
        return (
          <>
            <AntUpload.Dragger
              name="bannerImage"
              className="banner-box"
              multiple={false}
              accept="image/jpeg,image/png,image/gif,image/webp"
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("You can only upload image files!");
                  return AntUpload.LIST_IGNORE;
                }

                // Create preview
                const reader = new FileReader();
                reader.onload = () => {
                  setBannerPreview(reader.result);
                };
                reader.readAsDataURL(file);

                setBannerFile(file);
                return false;
              }}
              onChange={(info) => {
                const { status } = info.file;
                if (status === "done") {
                  message.success(
                    `${info.file.name} file uploaded successfully.`
                  );
                } else if (status === "error") {
                  message.error(`${info.file.name} file upload failed.`);
                }
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Only JPG, PNG, GIF, and WebP images are allowed
              </p>
            </AntUpload.Dragger>
            {bannerPreview && (
              <div className="image-preview">
                <h4>Preview:</h4>
                <img
                  src={bannerPreview || "/placeholder.svg"}
                  alt="Banner preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    marginTop: "10px",
                  }}
                />
              </div>
            )}
            <Button
              style={{ marginTop: 16 }}
              onClick={() => showEntitySelector("banner")}
            >
              Update Banner
            </Button>
          </>
        );
      case "logo":
        return (
          <>
            <h3 style={{ marginTop: "20px" }}>Update Logo</h3>
            <AntUpload.Dragger
              name="logo"
              multiple={false}
              accept="image/jpeg,image/png,image/gif,image/webp"
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("You can only upload image files!");
                  return AntUpload.LIST_IGNORE;
                }

                // Create preview
                const reader = new FileReader();
                reader.onload = () => {
                  setLogoPreview(reader.result);
                };
                reader.readAsDataURL(file);

                setLogoFile(file);
                return false;
              }}
              onChange={(info) => {
                const { status } = info.file;
                if (status !== "uploading") {
                  console.log(info.file, info.fileList);
                }
                if (status === "done") {
                  message.success(
                    `${info.file.name} logo file ready for upload.`
                  );
                } else if (status === "error") {
                  message.error(
                    `${info.file.name} logo file failed to prepare.`
                  );
                }
              }}
              action="/api/upload"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to upload logo
              </p>
              <p className="ant-upload-hint">
                Only JPG, PNG, GIF, and WebP images are allowed
              </p>
            </AntUpload.Dragger>
            {logoPreview && (
              <div className="image-preview">
                <h4>Preview:</h4>
                <img
                  src={logoPreview || "/placeholder.svg"}
                  alt="Logo preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    marginTop: "10px",
                  }}
                />
              </div>
            )}
            <Button
              style={{ marginTop: 16 }}
              onClick={() => showEntitySelector("logo")}
            >
              Update Logo
            </Button>
          </>
        );
      case "description":
        return (
          <>
            <ReactQuill
              theme="snow"
              value={editContent}
              onChange={setEditContent}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
            />
            <Button style={{ marginTop: 16 }} onClick={handleEditContent}>
              Update Description
            </Button>
          </>
        );
      case "categories":
        return (
          <>
            <Input.TextArea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Enter categories, separated by commas"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
            <Button style={{ marginTop: 16 }} onClick={handleEditContent}>
              Update Categories
            </Button>
          </>
        );
      case "eligibility":
        return (
          <>
            <ReactQuill
              theme="snow"
              value={editContent}
              onChange={setEditContent}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ["link"],
                  ["clean"],
                ],
              }}
            />
            <Button style={{ marginTop: 16 }} onClick={handleEditContent}>
              Update Eligibility
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  // carousel button
  const nextSlide1 = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide1 = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change interval as needed
    return () => clearInterval(interval);
  }, [nextSlide]);

  const fetchEntityDetails = async (regId) => {
    try {
      const response = await apiClient.get(
        `entity-registration-detailed-page/?reg_id=${regId}`
      );
      if (response.data) {
        setAboutText(response.data.about || "");
        setEligibilityText(response.data.eligibility || "");
        const fetchedCategories = response.data.categories
          ? response.data.categories.split(",").map((cat) => ({
              value: cat.trim(),
              label: cat.trim(),
            }))
          : [];

        setCategoriesText(response.data.categories || "");
        setCategoriesOptions(fetchedCategories);
      }
    } catch (error) {
      console.error("Error fetching entity details:", error);
      message.error("Failed to fetch entity details");
    }
  };

  return (
    <>
      <div className="dashboard-home">
        <div className="dashboard-content" ref={contentRef}>
          {userDetails && (
            <div
              className={`secretary-info-container ${
                scrollPosition > 50 ? "scrolled" : ""
              } ${scrollPosition > 200 ? "hidden" : ""}`}
            >
              <div className="secretary-info">
                <div className="secretary-header">
                  <h2>Welcome, {userDetails.user_name}!</h2>
                  <span className="role-badge1">{userName?.role_name}</span>
                </div>
                {userDetails?.secretary_details &&
                  userDetails?.secretary_details.map((item, key) => (
                    <div
                      style={{ marginTop: "10px" }}
                      className="secretary-details"
                      key={key}
                    >
                      <div className="detail-item">
                        <span className="detail-label">Entity:</span>
                        <span className="detail-value">
                          {item?.entity_name}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Registration Name:</span>
                        <span className="detail-value">
                          {item?.registration_name}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Registration Code:</span>
                        <span className="detail-value">
                          {item?.registration_code}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Owner:</span>
                        <span className="detail-value">{item?.department}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {isLoggedIn === true &&
          userName?.role_name === "Student Secretary" ? (
            <>
              <InfoCard />
              <div className="charts-container">
                <div className="chart-row">
                  <ActivityPieChart />
                  <ActivityBarGraph />
                </div>
              </div>
              <div className="club-details-page-1">
                <div className="update-cards-container">
                  <h3>Media Update || Entity Management</h3>
                  <div className="update-cards-grid">
                    <div
                      onClick={() => showDrawer("media")}
                      className="update-card"
                      style={{
                        borderTop: `4px solid #2196F3`,
                        cursor: "pointer",
                      }}
                    >
                      <div
                        className="update-card-icon"
                        style={{ color: "#2196F3" }}
                      >
                        <FileImageOutlined />
                      </div>
                      <h4>Update Banner</h4>
                      <p>Update your entity's banner image</p>
                    </div>
                    <div
                      onClick={() => showDrawer("logo")}
                      className="update-card"
                      style={{
                        borderTop: `4px solid #E91E63`,
                        cursor: "pointer",
                      }}
                    >
                      <div
                        className="update-card-icon"
                        style={{ color: "#E91E63" }}
                      >
                        <RadiusUprightOutlined />
                      </div>
                      <h4>Update Logo</h4>
                      <p>Update your entity's logo image</p>
                    </div>
                    {updateCards.map((card, index) => (
                      <div
                        key={index}
                        className="update-card"
                        onClick={() => openUpdateModal(card.type)}
                        style={{
                          borderTop: `4px solid ${card.color}`,
                          cursor: "pointer",
                        }}
                      >
                        <div
                          className="update-card-icon"
                          style={{ color: card.color }}
                        >
                          {card.icon}
                        </div>
                        <h4>{card.title}</h4>
                        <p>{card.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <ProfilePictureCards />

                {/* {userDetails && userDetails?.secretary_details ? null : <EventCardsDash commity={commity} />} */}
                <CommitteeCardStudent />
              </div>
            </>
          ) : (
            <>
              <div className="metric-cards-home">
                <div
                  onClick={redirectClubs}
                  className="metric-card-home card1h"
                >
                  <img src={circle || "/placeholder.svg"} />
                  <h2 className="cardCount">{filteredData?.club}</h2>

                  <div style={{ fontSize: "16px", margin: "10px 0px" }}>
                    Co-Curricular
                  </div>
                  <p style={{ fontSize: "23px", fontWeight: "bold" }}>Club</p>

                  <span className="icon-home">
                    <PiFlagBanner size={50} />
                  </span>
                </div>

                <div onClick={redirectComm} className="metric-card-home card4h">
                  <img src={circle || "/placeholder.svg"} />
                  <h2 className="cardCount">{filteredData?.community}</h2>

                  <div style={{ fontSize: "16px", margin: "10px 0px" }}>
                    Co-Curricular
                  </div>
                  <p style={{ fontSize: "23px", fontWeight: "bold" }}>
                    Community
                  </p>

                  <span className="icon-home">
                    {" "}
                    <FaUnity size={50} />
                  </span>
                </div>

                <div
                  onClick={redirectSociety}
                  className="metric-card-home card2h"
                >
                  <img src={circle || "/placeholder.svg"} />
                  <h2 className="cardCount">
                    {filteredData?.departmentSociety}
                  </h2>

                  <div style={{ fontSize: "16px", margin: "10px 0px" }}>
                    Co-Curricular
                  </div>
                  <p style={{ fontSize: "23px", fontWeight: "bold" }}>
                    Department Society
                  </p>

                  <span className="icon-home">
                    {" "}
                    <FaHouseFlag size={50} />
                  </span>
                </div>
                <div onClick={redirectPro} className="metric-card-home card3h">
                  <img src={circle || "/placeholder.svg"} />
                  <h2 className="cardCount">
                    {filteredData?.professionalSociety}
                  </h2>

                  <div style={{ fontSize: "16px", margin: "10px 0px" }}>
                    Professional Society
                  </div>
                  <p style={{ fontSize: "23px", fontWeight: "bold" }}>
                    Student Chapters
                  </p>

                  <span className="icon-home">
                    {" "}
                    <BiSolidBuildingHouse size={50} />
                  </span>
                </div>
              </div>
              <div className="content-columns-home">
                <div className="left-column-home">
                  <UpdatedCarousel images={carouselImages} />
                </div>

                <div className="right-column-home">
                  <div className="calendar-card-home">
                    <Calendar />
                  </div>
                </div>
              </div>
              <div className="bottom-cards-home">
                <div className="notification-card-home">
                  <div className="card-header-home">
                    <h4>Announcement</h4>
                  </div>
                  <div className="notification-list">
                    <div
                      style={{ display: "flex", padding: "0px" }}
                      className="notification-item"
                    >
                      {Object.keys(tabData1)?.map((tab) => (
                        <button
                          key={tab}
                          className={`tab ${
                            activeTab1 === tab ? "activee" : ""
                          }`}
                          onClick={() => setActiveTab1(tab)}
                        >
                          <div style={{ fontSize: "15px" }}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}{" "}
                          </div>
                          <div>
                            {" "}
                            <Badge style={{ marginBottom: "5px" }} count={2}>
                              <NotificationOutlined
                                className={`${
                                  activeTab1 === tab
                                    ? "anno-ico-white"
                                    : "anno-ico"
                                }`}
                                style={{
                                  fontSize: 16,
                                  color: "white",
                                }}
                              />
                            </Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                    {tabData1[activeTab1]?.map((message, index) => (
                      <div key={index} className="message">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            overflow: "hidden",
                          }}
                          className="message-header"
                        >
                          <p className="announcement-message ">
                            {message.content}
                          </p>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <p className="author-name">From: {message.from}</p>
                          <p className="author-name">{message?.messageTime}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="card-footer-home">
                    <button className="view-more-btn-home">View More</button>
                  </div>
                </div>

                <div className="notification-card-home">
                  <div className="card-header-home">
                    <h4>Discussion Forum</h4>
                  </div>
                  <div className="discussion-wrapper">
                    {discussions.map((discussion, index) => (
                      <div key={index} className="accordion-item">
                        <button
                          className={`accordion-title ${
                            activeAccordion === index ? "active" : ""
                          }`}
                          onClick={() => toggleAccordion(index)}
                        >
                          <span>{discussion.title}</span>
                          <div className="accordion-right">
                            <div className="participants">
                              <div className="avatar-stack">
                                {discussion.participants.map((letter, i) => (
                                  <div
                                    key={i}
                                    className="participant-avatar"
                                    style={{
                                      cursor: "pointer",
                                      backgroundColor: getRandomColor(),
                                    }}
                                  >
                                    {letter}
                                  </div>
                                ))}
                              </div>
                              {discussion.additionalCount > 0 && (
                                <span className="additional-count">
                                  +{discussion.additionalCount}
                                </span>
                              )}
                            </div>
                            <span className="accordion-icon">
                              {activeAccordion === index ? (
                                <ChevronUp />
                              ) : (
                                <ChevronDown />
                              )}
                            </span>
                          </div>
                        </button>
                        {activeAccordion === index && (
                          <div className="accordion-content">
                            <p
                              onClick={() => redirectToLogin()}
                              style={{ cursor: "pointer" }}
                            >
                              {discussion.content}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="card-footer-home">
                    <button className="view-more-btn-home">View More</button>
                  </div>
                </div>

                <div className="carousel-card-home">
                  <NewsViews />
                </div>
              </div>
            </>
          )}

          <footer
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="dashboard-footer"
          >
            <div>@Curriculum Portal</div>
          </footer>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
              <h2>Reply to Discussion</h2>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
              />
              <button onClick={handleSendClick}>Send</button>
            </div>
          </div>
        )}
      </div>
      <div className="scroller-i">
        <Scroller />
      </div>

      <Drawer
        title="Edit Content"
        placement="right"
        onClose={onCloseDrawer}
        visible={drawerVisible}
        width={400}
      >
        {renderDrawerContent()}
      </Drawer>

      {/* Entity Selector Popup */}
      <EntitySelectorPopup
        visible={isEntitySelectorVisible}
        onClose={() => setIsEntitySelectorVisible(false)}
        onSelectEntity={handleEntitySelect}
      />

      <Modal
        title="Update About & Eligibility & Category"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdateSubmit}>
            Update
          </Button>,
        ]}
        width={800}
      >
        <div className="update-modal-content">
          <div className="entity-selector">
            <label htmlFor="entity-select">Select Entity:</label>
            <Select
              id="entity-select"
              style={{ width: "100%" }}
              placeholder="Select an entity"
              value={selectedEntity}
              onChange={(value) => {
                setSelectedEntity(value);
                fetchEntityDetails(value);
              }}
              options={availableEntities}
            />
          </div>

          <div className="update-content" style={{ marginTop: "20px" }}>
            <label htmlFor="about-editor">About:</label>
            <ReactQuill
              id="about-editor"
              theme="snow"
              value={aboutText}
              onChange={setAboutText}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ color: [] }, { background: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],

                  ["clean"],
                ],
              }}
              style={{ height: "200px", marginBottom: "40px" }}
            />
          </div>

          <div className="update-content" style={{ marginTop: "40px" }}>
            <label htmlFor="eligibility-editor">Eligibility:</label>
            <ReactQuill
              id="eligibility-editor"
              theme="snow"
              value={eligibilityText}
              onChange={setEligibilityText}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ color: [] }, { background: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],

                  ["clean"],
                ],
              }}
              style={{ height: "200px", marginBottom: "40px" }}
            />
          </div>

          <div className="update-content" style={{ marginTop: "40px" }}>
            <label htmlFor="categories-select">Categories:</label>
            <Select
              id="categories-select"
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select or add categories"
              value={
                categoriesText
                  ? categoriesText.split(",").map((item) => item.trim())
                  : []
              }
              onChange={(values) => setCategoriesText(values.join(","))}
              onSearch={(inputValue) => {
                if (
                  inputValue &&
                  !categoriesOptions.some(
                    (option) =>
                      option.value.toLowerCase() === inputValue.toLowerCase()
                  )
                ) {
                  setCategoriesOptions((prevOptions) => [
                    ...prevOptions,
                    { value: inputValue, label: inputValue },
                  ]);
                }
              }}
              options={categoriesOptions}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Dashboard;
