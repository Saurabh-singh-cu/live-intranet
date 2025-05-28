import React, { useEffect, useState } from "react";
import "./App.css";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Dashboard from "./student/Dashboard";
import Users from "./pages/Users";
import FileManager from "./pages/FileManager";
import Order from "./pages/Order";
import Saved from "./pages/Saved";
import Setting from "./pages/Setting";
import AcademicAffairsForm from "./components/form/AcademicAffairsForm";
import NavBar from "./pages/NavBar";
import Login from "./pages/Login";
import EntityTable from "./components/form/EntityTable";
import ClubList from "./pages/ClubList";
import SpecificCard from "./pages/SpecificCard";
import EntityRegistrationForm from "./components/form/EntityRegistrationForm";
import RegisteredEntities from "./components/form/RegisteredEntities";
import JoinNow from "./components/form/JoinNow";
import Payment from "./components/form/Payment";
import DeptList from "./pages/DeptList";
import CommList from "./pages/CommList";
import AdminDashboard from "./pages/AdminDashboard";
import StudentSecretary from "./pages/StudentSecretary";
import StudentUpdatedPage from "./pages/secretary/StudentUpdatedPage";
import ProfessionalSociety from "./pages/ProfessionalSocietyList";
import JoinNowDetail from "./pages/JoinNowDetail";
import RegisterNewEntity from "./components/form/RegisterNewEntity";
import FacultyDashboard from "./faculty/FacultyDashboard";
import MediaRequest from "./faculty/MediaRequest";
import Home from "./pages/Home";
import AdminEventApproval from "./components/form/AdminEventApproval";
import ProtectedRoute from "./components/ProtectedRoutes";
import PageNotFound from "./PageNotFound";
import EventPublishedRequest from "./components/form/EventPublishedRequest";
import EventPublished from "./components/form/EventPublished";
// import RegisteredMemberList from "./components/form/RegisteredMemberList";
import Swal from "sweetalert2";
import MarkAttendance from "./pages/MarkAttendance";
import SessionCountdown from "./handleSession/SessionCountdown";
import EmailService from "./email/EmailService";
import TableVirtual from "./TableVirtual";
import ProposedCalendar from "./coord/ProposedCalendar";
import CoCurricularCoordinator from "./pages/CoCurricularCoordinator";
import AddBudget from "./coord/AddBudget";
import ProposedCalenderCoord from "./coord/ProposedCalenderCoord";
import ProposedCalendarRegDet from "./coord/ProposedCalendarRegDet";
import ExecutiveDashboard from "./officeExecutive/ExecutiveDashboard";
import AddEvent from "./officeExecutive/AddEvent";
import PublishYourEvent from "./faculty/PublishYourEvent";
import RegisteredMemberList from "./student/RegisteredMemberList";
import ProfilePictureCards from "./student/ProfilePictureCard";
import SideBar from "./components/Sidebar/SideBar";

import NewDashboard from "./NewDashboard/NewDashboard";
import PushNotification from "./pages/PushNotiAndNews/PushNotification";
import PushNewsAndViews from "./pages/PushNotiAndNews/PushNewsAndViews";
import NewAdminDashboard from "./Admin/Dashboard/NewAdminDashboard";
import MembershipAll from "./Admin/Dashboard/MembersPage/MembershipAll";
import GrpEvententity from "./student/PDFUploadEvent/GrpEvententity";
import CeremonyPdf from "./Admin/Dashboard/Ceremony/CeremonyPdf";
import ClubRatingPage from "./clubrate/ClubRatingPage";
import Calendar from "./pages/Calendar";
import CalenderPush from "./Admin/Dashboard/CalenderPush";
import ProfilePage from "./profile/ProfilePage";
import PushFeatureEvent from "./pages/PushNotiAndNews/PushFeatureEvent";
import AllThreeInOne from "./pages/PushNotiAndNews/AllThreeInOne";

function AppContent() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStudentSecretary, setIsStudentSecretary] = useState(false);
  const [isFaculty, setIsFaculty] = useState(false);
  const [isCo, setIsCo] = useState(false);
  const [isExecutive, setIsExecutive] = useState(false);
  const [user, setUser] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    console.log("Login success");
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    setShowLogin(false);
  };

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    const getUser = JSON.parse(localStorage?.getItem("user"));
    const isCordinatorActive = getUser?.is_cordinator === "active";

    console.log(isCordinatorActive, "ACTIVE");
    setUser(getUser);
    setIsAdmin(getUser?.role_name === "Admin");
    setIsStudentSecretary(getUser?.role_name === "Student Secretary");
    setIsFaculty(getUser?.role_name === "Faculty Advisory");
    setIsExecutive(getUser?.role_name === "Event Data Manager");
    setIsCo(
      (getUser?.role_name === "Co Curricular Coordinator" ||
        getUser?.role_name === "Faculty Advisory") &&
        isCordinatorActive
    );
  }, []);

  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    // Check if there is no internet connection
    if (!navigator.onLine) {
      // Display a Swal notification if offline
      Swal.fire({
        title: "No Internet Connection",
        text: "You are not connected to the internet.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }

    // Optional: Listen for changes in the network status
    window.addEventListener("offline", () => {
      Swal.fire({
        title: "No Internet Connection",
        text: "You are now offline.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    });

    window.addEventListener("online", () => {
      Swal.fire({
        title: "Back Online",
        text: "You are now connected to the internet.",
        icon: "success",
        confirmButtonText: "OK",
      });
    });

    // Cleanup event listeners when component is unmounted
    return () => {
      window.removeEventListener("offline", () => {});
      window.removeEventListener("online", () => {});
    };
  }, []);

  //token expire function

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);

    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div>
      {!isLoginPage && (
        <NavBar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}

      <div style={{ display: "flex" }}>
        {isLoggedIn &&
          (isAdmin ||
            isStudentSecretary ||
            isFaculty ||
            isCo ||
            isExecutive) && (
            <SideBar
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
          )}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route
              path="/"
              // element={<Dashboard onShowLogin={handleShowLogin} />}
              element={<NewDashboard onShowLogin={handleShowLogin} />}
            />
            <Route
              path="/dummy"
              element={<StudentUpdatedPage onShowLogin={handleShowLogin} />}
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  <NewAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/membership-and-cluster"
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  <MembershipAll />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ceremony-even-view"
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  <CeremonyPdf />
                </ProtectedRoute>
              }
            />

            {/* <Route
              path="/grouped-events-by-entity-form"
              element={
                <ProtectedRoute
                  allowedRoles={["Student Secretary"]}
                  user={user}
                >
                  <GrpEvententity onShowLogin={handleShowLogin} />
                </ProtectedRoute>
              }
            /> */}

            {isCo && (
              <>
                <Route
                  path="/Co-Curricular-Coordinator-dashboard"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        "Co Curricular Coordinator",
                        "Faculty Advisory",
                      ]}
                      user={user}
                    >
                      <CoCurricularCoordinator />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-budget"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        "Co Curricular Coordinator",
                        "Faculty Advisory",
                      ]}
                      user={user}
                    >
                      <AddBudget />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/registered-entities-coord"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        "Co Curricular Coordinator",
                        "Faculty Advisory",
                      ]}
                      user={user}
                    >
                      <ProposedCalenderCoord />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/proposed-calendar-coord"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        "Co Curricular Coordinator",
                        "Faculty Advisory",
                      ]}
                      user={user}
                    >
                      <ProposedCalendarRegDet />
                    </ProtectedRoute>
                  }
                />
              </>
            )}

            <Route
              path="/email/email-service"
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  <EmailService />
                </ProtectedRoute>
              }
            />
            <Route
              path="/push-notification"
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  <PushNotification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/push-news-views"
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  <PushNewsAndViews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event-approval-request"
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  <AdminEventApproval onShowLogin={handleShowLogin} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/push-calender"
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  <CalenderPush onShowLogin={handleShowLogin} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event-published-request"
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  <EventPublishedRequest onShowLogin={handleShowLogin} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/push-feature-events"
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  <PushFeatureEvent onShowLogin={handleShowLogin} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event-published"
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  <EventPublished onShowLogin={handleShowLogin} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notification-create-feature-news-admin"
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  <AllThreeInOne onShowLogin={handleShowLogin} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/registered-members-list"
              element={
                <ProtectedRoute
                  allowedRoles={["Student Secretary"]}
                  user={user}
                >
                  <RegisteredMemberList onShowLogin={handleShowLogin} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/proposed-calendarby-secretary"
              element={
                <ProtectedRoute
                  allowedRoles={["Student Secretary"]}
                  user={user}
                >
                  <ProposedCalendar onShowLogin={handleShowLogin} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/event-data-manager-dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={["Event Data Manager"]}
                  user={user}
                >
                  <ExecutiveDashboard onShowLogin={handleShowLogin} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/event-data-manager-add-event"
              element={
                <ProtectedRoute
                  allowedRoles={["Event Data Manager"]}
                  user={user}
                >
                  <AddEvent onShowLogin={handleShowLogin} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/home"
              // element={<Home onShowLogin={handleShowLogin} />}
              element={<NewDashboard onShowLogin={handleShowLogin} />}
            />
            <Route
              path="/home-new-dashboard-testing"
              element={<NewDashboard />}
            />
            <Route
              path="/student-secretary-dashboard"
              // element={<Dashboard onShowLogin={handleShowLogin} />}
              element={<Dashboard onShowLogin={handleShowLogin} />}
            />
            <Route
              path="/media-update-request"
              element={<ProfilePictureCards onShowLogin={handleShowLogin} />}
            />
            <Route
              path="/my-profile"
              element={<ProfilePage onShowLogin={handleShowLogin} />}
            />
            <Route
              path="/faculty-advisory-dashboard"
              element={<FacultyDashboard onShowLogin={handleShowLogin} />}
            />
            <Route
              path="/publishEvent"
              element={<PublishYourEvent onShowLogin={handleShowLogin} />}
            />
            {/* <Route
              path="/join-now"
              element={<JoinNow onShowLogin={handleShowLogin} />}
            /> */}
            <Route
              path="/media-request"
              element={<MediaRequest onShowLogin={handleShowLogin} />}
            />
            <Route
              path="/Register-New-Entity"
              element={<RegisterNewEntity onShowLogin={handleShowLogin} />}
            />
            <Route
              path="/paynow"
              element={<Payment onShowLogin={handleShowLogin} />}
            />
            <Route
              path="/configuration"
              // element={
              //   isLoggedIn ? (
              //     <Users />
              //   ) : (
              //     <Dashboard onShowLogin={handleShowLogin} />
              //   )
              // }
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  {isLoggedIn ? (
                    <Users />
                  ) : (
                    // <Dashboard onShowLogin={handleShowLogin} />
                    <NewDashboard onShowLogin={handleShowLogin} />
                  )}
                </ProtectedRoute>
              }
            />

            <Route
              path="/entityTable"
              // element={
              //   isLoggedIn ? (
              //     <EntityTable />
              //   ) : (
              //     <Dashboard onShowLogin={handleShowLogin} />
              //   )
              // }
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  {isLoggedIn ? (
                    <EntityTable />
                  ) : (
                    // <Dashboard onShowLogin={handleShowLogin} />
                    <NewDashboard onShowLogin={handleShowLogin} />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/file-manager"
              element={
                isLoggedIn ? (
                  <FileManager />
                ) : (
                  <Dashboard onShowLogin={handleShowLogin} />
                )
              }
            />
            {/* <Route path="/club-rating" element={<ClubRatingPage />} /> */}
            <Route
              path="/order"
              element={
                isLoggedIn ? (
                  <Order />
                ) : (
                  <Dashboard onShowLogin={handleShowLogin} />
                )
              }
            />
            <Route
              path="/saved"
              element={
                isLoggedIn ? (
                  <Saved />
                ) : (
                  <Dashboard onShowLogin={handleShowLogin} />
                )
              }
            />
            <Route
              path="/settings"
              element={
                isLoggedIn ? (
                  <Setting />
                ) : (
                  <Dashboard onShowLogin={handleShowLogin} />
                )
              }
            />
            <Route path="/clubs" element={<ClubList />} />
            {/* <Route path="/dummy-react-window" element={<TableVirtual />}  */}
            <Route path="/mark-event-attendance" element={<MarkAttendance />} />
            <Route path="/department-society" element={<DeptList />} />
            <Route
              path="/professional-society"
              element={<ProfessionalSociety />}
            />
            <Route path="/communities" element={<CommList />} />
            <Route path="/communities" element={<CommList />} />
            <Route
              path="/join-now-detailed-page/"
              element={<JoinNowDetail />}
            />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />

            <Route
              path="/af"
              element={
                isLoggedIn ? (
                  <AcademicAffairsForm />
                ) : (
                  <Dashboard onShowLogin={handleShowLogin} />
                )
              }
            />
            <Route
              path="/EntityRegistrationForm"
              element={
                isLoggedIn ? (
                  <EntityRegistrationForm />
                ) : (
                  <Dashboard onShowLogin={handleShowLogin} />
                )
              }
            />
            <Route
              path="/registered-entities"
              // element={
              //   isLoggedIn ? (
              //     <RegisteredEntities />
              //   ) : (
              //     <Dashboard onShowLogin={handleShowLogin} />
              //   )
              // }
              element={
                <ProtectedRoute allowedRoles={["Admin"]} user={user}>
                  {isLoggedIn ? (
                    <RegisteredEntities />
                  ) : (
                    <Dashboard onShowLogin={handleShowLogin} />
                  )}
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
      {showLogin && (
        <Login onLogin={handleLogin} onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
