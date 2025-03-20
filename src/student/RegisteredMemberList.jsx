// import React, { useState, useEffect, useCallback } from "react";
// import apiClient from "../config/apiClient";
// import Swal from "sweetalert2";
// import * as XLSX from "xlsx";
// import "./RegisteredMemberList.css";
// import { IoCopyOutline } from "react-icons/io5";
// const RegisteredMemberApproval = () => {
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [regIds, setRegIds] = useState([]);
//   const [searchText, setSearchText] = useState("");

//   useEffect(() => {
//     const storedData = localStorage.getItem("user");
//     if (storedData) {
//       const parsedData = JSON.parse(storedData);
//       const ids =
//         parsedData?.secretary_details?.map((item) => item.reg_id) || [];
//       if (ids.length > 0) {
//         setRegIds(ids);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (regIds.length > 0) {
//       fetchRegisteredMembers(regIds);
//     }
//   }, [regIds]);

//   const fetchRegisteredMembers = useCallback(async (regIds) => {
//     try {
//       if (!regIds || regIds.length === 0) return;

//       setLoading(true);
//       setMembers(() => []);

//       for (const regId of regIds) {
//         console.log(`Fetching members for reg_id: ${regId}`);

//         try {
//           const response = await apiClient.post(`memberships/`, {
//             reg_id: regId,
//           });

//           console.log("Response MMMMMMM :", response);

//           if (response?.data) {
//             const dataArray = Array.isArray(response.data)
//               ? response.data
//               : [response.data];

//             setMembers((prevMembers) => [...prevMembers, ...dataArray]);
//           }
//         } catch (error) {
//           console.error(`Error fetching members for reg_id ${regId}:`, error);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching registered members:", error);
//       setError("Failed to fetch registered members");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const handleStatusChange = async (memberId, regId, newStatus) => {
//     try {
//       await apiClient.put(
//         `update-membership-status/${memberId}/?reg_id=${regId}`,
//         {
//           status: newStatus,
//         }
//       );
//       Swal.fire("Success!", "The member status has been updated.", "success");
//       setMembers((prevMembers) =>
//         prevMembers.map((member) =>
//           member.member_id === memberId
//             ? { ...member, status: newStatus }
//             : member
//         )
//       );
//     } catch (error) {
//       console.error("Status update failed:", error);
//       Swal.fire("Error", "Failed to update member status", "error");
//     }
//   };

//   const handleSearch = (e) => setSearchText(e.target.value);

//   const filteredMembers = members.filter((member) =>
//     Object.values(member).some((value) =>
//       value?.toString().toLowerCase().includes(searchText.toLowerCase())
//     )
//   );

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text).then(() => alert("Copied!"));
//   };

//   const handleDownloadExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(
//       members.map(({ member_id, ...rest }) => rest)
//     );
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Members");
//     XLSX.writeFile(wb, "registered_members.xlsx");
//   };

//   if (loading) return <div className="loading-container">Loading...</div>;
//   if (error) return <div className="error-message">{error}</div>;

//   return (
//     <div className="admin-event-approval">
//       <h2 className="page-title">Registered Members</h2>
//       <div className="search-download-container">
//         <div className="search-container">
//           <input
//             type="text"
//             placeholder="Search members"
//             onChange={handleSearch}
//             className="search-input"
//           />
//         </div>
//         <button className="download-button" onClick={handleDownloadExcel}>
//           Download Excel
//         </button>
//       </div>
//       <div className="table-container">
//         <table className="custom-table">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>UID</th>
//               <th>Email</th>
//               <th>Mobile</th>
//               <th>Department</th>
//               <th>Entity</th>
//               <th>Reg. Name</th>
//               <th>Membership Code</th>
//               <th>Session</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={8} className="loading-cell">
//                   Loading...
//                 </td>
//               </tr>
//             ) : filteredMembers.length === 0 ? (
//               <tr>
//                 <td colSpan={8} className="no-data-cell">
//                   No members found
//                 </td>
//               </tr>
//             ) : (
//               filteredMembers.map((member) => (
//                 <tr key={member.member_id}>
//                   <td>{member.member_name}</td>
//                   <td>{member.member_uid}</td>
//                   <td>
//                     <span
//                       className="copyable"
//                       onClick={() => copyToClipboard(member.member_email)}
//                     >
//                       {member.member_email}{" "}
//                       <IoCopyOutline className="copy-icon" />
//                     </span>
//                   </td>
//                   <td>
//                     <span
//                       className="copyable"
//                       onClick={() => copyToClipboard(member.member_mobile)}
//                     >
//                       {member.member_mobile}{" "}
//                       <IoCopyOutline className="copy-icon" />
//                     </span>
//                   </td>
//                   <td>{member.dept_name}</td>
//                   <td>{member.entity_name}</td>
//                   <td>{member.registration_name}</td>
//                   <td>{member.membership_code || "N/A"}</td>
//                   <td>{member.session_code}</td>

//                   <td>
//                     <select
//                       className="status-dropdown beautiful-dropdown"
//                       value={member.status}
//                       onChange={(e) =>
//                         handleStatusChange(
//                           member.member_id,
//                           member.reg_id,
//                           e.target.value
//                         )
//                       }
//                     >
//                       <option value="active">Active</option>
//                       <option value="inactive">Inactive</option>
//                     </select>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default RegisteredMemberApproval;
"use client"

import { useState, useEffect, useCallback } from "react"
import apiClient from "../config/apiClient"
import Swal from "sweetalert2"
import * as XLSX from "xlsx"
import "./RegisteredMemberList.css"
import { IoCopyOutline } from "react-icons/io5"

const RegisteredMemberApproval = () => {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [regIds, setRegIds] = useState([])
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    const storedData = localStorage.getItem("user")
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      const ids = parsedData?.secretary_details?.map((item) => item.reg_id) || []
      if (ids.length > 0) {
        setRegIds(ids)
      }
    }
  }, [])

  useEffect(() => {
    if (regIds.length > 0) {
      fetchRegisteredMembers(regIds)
    }
  }, [regIds])

  const fetchRegisteredMembers = useCallback(async (regIds) => {
    try {
      if (!regIds || regIds.length === 0) return

      setLoading(true)
      setMembers(() => [])

      for (const regId of regIds) {
        console.log(`Fetching members for reg_id: ${regId}`)

        try {
          const response = await apiClient.post(`memberships/`, {
            reg_id: regId,
          })

          console.log("Response MMMMMMM :", response)

          if (response?.data) {
            const dataArray = Array.isArray(response.data) ? response.data : [response.data]

            setMembers((prevMembers) => [...prevMembers, ...dataArray])
          }
        } catch (error) {
          console.error(`Error fetching members for reg_id ${regId}:`, error)
        }
      }
    } catch (error) {
      console.error("Error fetching registered members:", error)
      setError("Failed to fetch registered members")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleStatusChange = async (memberId, regId, newStatus) => {
    try {
      await apiClient.put(`update-membership-status/${memberId}/?reg_id=${regId}`, {
        status: newStatus,
      })
      Swal.fire("Success!", "The member status has been updated.", "success")
      setMembers((prevMembers) =>
        prevMembers.map((member) => (member.member_id === memberId ? { ...member, status: newStatus } : member)),
      )
    } catch (error) {
      console.error("Status update failed:", error)
      Swal.fire("Error", "Failed to update member status", "error")
    }
  }

  const handleSearch = (e) => setSearchText(e.target.value)

  const filteredMembers = members.filter((member) =>
    Object.values(member).some((value) => value?.toString().toLowerCase().includes(searchText.toLowerCase())),
  )

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => alert("Copied!"))
  }

  const handleDownloadExcel = () => {
    // Create a new array with the filtered data (removing reg_id, id, sessioncode)
    const filteredData = members.map(({ reg_id, id, dept_id, session_code, member_id, ...rest }) => rest)

    const ws = XLSX.utils.json_to_sheet(filteredData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Members")
    XLSX.writeFile(wb, "registered_members.xlsx")
  }

  if (loading) return <div className="loading-container">Loading...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="admin-event-approval">
      <h2 className="page-title">Registered Members</h2>
      <div className="search-download-container">
        <div className="search-container">
          <input type="text" placeholder="Search members" onChange={handleSearch} className="search-input" />
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
                    <span className="copyable" onClick={() => copyToClipboard(member.member_email)}>
                      {member.member_email} <IoCopyOutline className="copy-icon" />
                    </span>
                  </td>
                  <td>
                    <span className="copyable" onClick={() => copyToClipboard(member.member_mobile)}>
                      {member.member_mobile} <IoCopyOutline className="copy-icon" />
                    </span>
                  </td>
                  <td>{member.dept_name}</td>
                  <td>{member.entity_name}</td>
                  <td>{member.registration_name}</td>
                
                

                  <td>
                    <select
                      className={`status-dropdown ${member.status}`}
                      value={member.status}
                      onChange={(e) => handleStatusChange(member.member_id, member.reg_id, e.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RegisteredMemberApproval

