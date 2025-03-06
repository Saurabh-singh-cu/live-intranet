import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../config/apiClient"; // Adjust the path as needed
import Swal from "sweetalert2";
import "./MediaRequest.css"; // Import the CSS file

const MediaApprove = () => {
  const [requests, setRequests] = useState([]); // Initialize as an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regIds, setRegIds] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const ids =
        parsedData?.faculty_advisory_details?.map((item) => item.reg_id) || [];
      if (ids.length > 0) {
        setRegIds(ids);
      }
    }
  }, []);

  useEffect(() => {
    if (regIds.length > 0) {
      fetchEntityMedia(regIds);
    }
  }, [regIds]);

  const fetchEntityMedia = useCallback(async (regIds) => {
    try {
      if (!regIds || regIds.length === 0) return; // Prevent empty calls

      setLoading(true);
      // Reset requests when fetching new data
      setRequests([]);

      for (const regId of regIds) {
        console.log(`Fetching data for reg_id: ${regId}`);

        try {
          const response = await apiClient.get(
            `entity_media_pending/?reg_id=${regId}`
          );

          if (response?.data) {
            const dataArray = Array.isArray(response.data)
              ? response.data
              : [response.data];

            // Correctly append data to the array
            setRequests(prevRequests => [...prevRequests, ...dataArray]);
          }
        } catch (error) {
          console.error(
            `Error fetching entity media for reg_id ${regId}:`,
            error
          );
        }
      }
    } catch (error) {
      console.error("Error fetching entity media:", error);
      setError("Failed to fetch media requests");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApprove = async (id, regId) => {
    try {
      await apiClient.put(`entity-media/${id}/update-status/?reg_id=${regId}`, {
        status: "Approved",
      });
      Swal.fire("Approved!", "The media has been approved.", "success");
      
      // Update the local state to reflect the change
      setRequests(prevRequests => 
        prevRequests.filter(request => request.id !== id)
      );
    } catch (error) {
      console.error("Approval failed:", error);
      Swal.fire("Error", "Failed to approve media", "error");
    }
  };

  // Group requests by reg_id for display
  const groupedRequests = requests.reduce((acc, request) => {
    const regId = request.reg_id;
    if (!acc[regId]) {
      acc[regId] = [];
    }
    acc[regId].push(request);
    return acc;
  }, {});

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="media-approve-container">
      <h2>Media Approval</h2>
      {Object.keys(groupedRequests).length === 0 ? (
        <p className="empty-message">No media requests found.</p>
      ) : (
        Object.entries(groupedRequests).map(([regId, requestsForRegId]) => (
          <div key={regId} className="reg-id-section">
            <h3>Requests for reg_id: {regId}</h3>
            <div className="table-responsive">
              <table className="media-approve-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Banner</th>
                    <th>Logo</th>
                    <th>Secretary</th>
                    <th>Join Secretary</th>
                    <th>Faculty Advisory</th>
                    <th>Co-Advisor</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requestsForRegId.map((request) => (
                    <tr key={request.id}>
                      <td className="id-cell">{request.id}</td>
                      <td className="image-cell">
                        {request.temp_banner_url ? (
                          <div className="image-container">
                            <img
                              src={request.temp_banner_url || "/placeholder.svg"}
                              alt="Banner"
                              className="preview-image"
                            />
                          </div>
                        ) : (
                          <span className="no-image">No Banner</span>
                        )}
                      </td>
                      <td className="image-cell">
                        {request.temp_logo_url ? (
                          <div className="image-container">
                            <img
                              src={request.temp_logo_url || "/placeholder.svg"}
                              alt="Logo"
                              className="preview-image"
                            />
                          </div>
                        ) : (
                          <span className="no-image">No Logo</span>
                        )}
                      </td>
                      <td className="image-cell">
                        {request.temp_secretary_profile_pic_url ? (
                          <div className="image-container">
                            <img
                              src={request.temp_secretary_profile_pic_url || "/placeholder.svg"}
                              alt="Secretary"
                              className="preview-image"
                            />
                          </div>
                        ) : (
                          <span className="no-image">No Image</span>
                        )}
                      </td>
                      <td className="image-cell">
                        {request.temp_join_secretary_profile_pic_url ? (
                          <div className="image-container">
                            <img
                              src={request.temp_join_secretary_profile_pic_url || "/placeholder.svg"}
                              alt="Join Secretary"
                              className="preview-image"
                            />
                          </div>
                        ) : (
                          <span className="no-image">No Image</span>
                        )}
                      </td>
                      <td className="image-cell">
                        {request.temp_faculty_advisory_profile_pic_url ? (
                          <div className="image-container">
                            <img
                              src={request.temp_faculty_advisory_profile_pic_url || "/placeholder.svg"}
                              alt="Faculty Advisory"
                              className="preview-image"
                            />
                          </div>
                        ) : (
                          <span className="no-image">No Image</span>
                        )}
                      </td>
                      <td className="image-cell">
                        {request.temp_co_advisor_profile_pic_url ? (
                          <div className="image-container">
                            <img
                              src={request.temp_co_advisor_profile_pic_url || "/placeholder.svg"}
                              alt="Co-Advisor"
                              className="preview-image"
                            />
                          </div>
                        ) : (
                          <span className="no-image">No Image</span>
                        )}
                      </td>
                      <td className="status-cell">{request.status}</td>
                      <td className="action-cell">
                        {request.status === "Pending" && (
                          <button
                            className="approve-button"
                            onClick={() => handleApprove(request.id, regId)}
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MediaApprove;