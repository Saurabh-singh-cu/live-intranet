import React, { useState, useEffect } from "react";
import apiClient from "../config/apiClient"; // Adjust the path as needed
import Swal from "sweetalert2";
import "./MediaRequest.css"; // Import the CSS file

const MediaApprove = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regId, setRegId] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const id =
        parsedData?.faculty_advisory_details?.map((item) => item.reg_id) || [];
      if (id.length > 0) {
        setRegId(id);
      }
    }
  }, []);

  useEffect(() => {
    if (regId) {
      fetchEntityMedia(regId);
    }
  }, [regId]);

  const fetchEntityMedia = async (regId) => {
    try {
      const response = await apiClient.get(
        `entity_media_pending/?reg_id=${regId}`
      );
      console.log("API Response:", response.data);

      setRequests(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error("Error fetching entity media:", error);
      setError(`Error fetching entity media: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!regId) {
      Swal.fire("Error", "Registration ID is missing", "error");
      return;
    }
    try {
      await apiClient.put(`entity-media/${id}/update-status/?reg_id=${regId}`, {
        status: "Approved",
      });
      Swal.fire("Approved!", "The media has been approved.", "success");
      fetchEntityMedia(regId);
    } catch (error) {
      console.error("Approval failed:", error);
      Swal.fire("Error", "Failed to approve media", "error");
    }
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="media-approve-container">
      <h2>Media Approval</h2>
      {requests.length === 0 ? (
        <p className="empty-message">No media requests found.</p>
      ) : (
        <table className="media-approve-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Banner</th>
              <th>Logo</th>
              <th>Secretary Profile</th>
              <th>Join Secretary Profile</th>
              <th>Faculty Advisory</th>
              <th>Co-Advisor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={index}>
                <td>{request.id}</td>
                <td>
                  {request.temp_banner ? (
                    <img
                      src={request.temp_banner}
                      alt="Banner"
                      width="100"
                      height="100"
                    />
                  ) : (
                    "No Banner Available"
                  )}
                </td>
                <td>
                  {request.temp_logo ? (
                    <img
                      src={request.temp_logo}
                      alt="Logo"
                      width="100"
                      height="100"
                    />
                  ) : (
                    "No Logo Available"
                  )}
                </td>
                <td>
                  {request.temp_secretary_profile_pic_url ? (
                    <img
                      src={request.temp_secretary_profile_pic_url}
                      alt="Secretary"
                      width="100"
                      height="100"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  {request.temp_join_secretary_profile_pic_url ? (
                    <img
                      src={request.temp_join_secretary_profile_pic_url}
                      alt="Join Secretary"
                      width="100"
                      height="100"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  {request.temp_faculty_advisory_profile_pic_url ? (
                    <img
                      src={request.temp_faculty_advisory_profile_pic_url}
                      alt="Faculty Advisory"
                      width="100"
                      height="100"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  {request.temp_co_advisor_profile_pic_url ? (
                    <img
                      src={request.temp_co_advisor_profile_pic_url}
                      alt="Co-Advisor"
                      width="100"
                      height="100"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  <button
                    className="approve-button"
                    onClick={() => handleApprove(request.id)}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MediaApprove;
