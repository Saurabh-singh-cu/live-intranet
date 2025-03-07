import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../config/apiClient";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import "./RegisteredMemberList.css";
import { IoCopyOutline } from "react-icons/io5";
const RegisteredMemberApproval = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regIds, setRegIds] = useState([]);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const ids =
        parsedData?.secretary_details?.map((item) => item.reg_id) || [];
      if (ids.length > 0) {
        setRegIds(ids);
      }
    }
  }, []);

  useEffect(() => {
    if (regIds.length > 0) {
      fetchRegisteredMembers(regIds);
    }
  }, [regIds]);

  const fetchRegisteredMembers = useCallback(async (regIds) => {
    try {
      if (!regIds || regIds.length === 0) return;

      setLoading(true);
      setMembers(() => []);

      for (const regId of regIds) {
        console.log(`Fetching members for reg_id: ${regId}`);

        try {
          const response = await apiClient.post(`memberships/`, {
            reg_id: regId,
          });

          if (response?.data) {
            const dataArray = Array.isArray(response.data)
              ? response.data
              : [response.data];

            setMembers((prevMembers) => [...prevMembers, ...dataArray]);
          }
        } catch (error) {
          console.error(`Error fetching members for reg_id ${regId}:`, error);
        }
      }
    } catch (error) {
      console.error("Error fetching registered members:", error);
      setError("Failed to fetch registered members");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApprove = async (id, regId) => {
    try {
      await apiClient.put(`memberships/${id}/update-status/?reg_id=${regId}`, {
        status: "Approved",
      });
      Swal.fire("Approved!", "The member has been approved.", "success");
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.id !== id)
      );
    } catch (error) {
      console.error("Approval failed:", error);
      Swal.fire("Error", "Failed to approve member", "error");
    }
  };

  const groupedMembers = members.reduce((acc, member) => {
    const regId = member.reg_id;
    if (!acc[regId]) {
      acc[regId] = [];
    }
    acc[regId].push(member);
    return acc;
  }, {});

  const handleSearch = (e) => setSearchText(e.target.value);

  const filteredMembers = members.filter((member) =>
    Object.values(member).some((value) =>
      value?.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => alert("Copied!"));
  };

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      members.map(({ member_id, ...rest }) => rest)
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Members");
    XLSX.writeFile(wb, "registered_members.xlsx");
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-event-approval">
      <h2 className="page-title">Registered Members</h2>
      <div className="search-download-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search members"
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <button className="download-button" onClick={handleDownloadExcel}>
          Download Excel
        </button>
      </div>
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>UID</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Department</th>
              <th>Entity</th>
              <th>Reg. Name</th>
              <th>Membership Code</th>
              <th>Session</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="loading-cell">
                  Loading...
                </td>
              </tr>
            ) : filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={8} className="no-data-cell">
                  No members found
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => (
                <tr key={member.member_id}>
                  <td>{member.member_name}</td>
                  <td>{member.member_uid}</td>
                  <td>
                    <span
                      className="copyable"
                      onClick={() => copyToClipboard(member.member_email)}
                    >
                      {member.member_email}{" "}
                      <IoCopyOutline className="copy-icon" />
                    </span>
                  </td>
                  <td>
                    <span
                      className="copyable"
                      onClick={() => copyToClipboard(member.member_mobile)}
                    >
                      {member.member_mobile}{" "}
                      <IoCopyOutline className="copy-icon" />
                    </span>
                  </td>
                  <td>{member.dept_name}</td>
                  <td>{member.entity_name}</td>
                  <td>{member.registration_name}</td>
                  <td>{member.membership_code || "N/A"}</td>
                  <td>{member.session_code}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        member.status === "active" ? "active" : "inactive"
                      }`}
                    >
                      {member.status.charAt(0).toUpperCase() +
                        member.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisteredMemberApproval;
