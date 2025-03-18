import React, { useState, useEffect } from "react"
import { Drawer } from "antd"
import styles from "./CoordTable.module.css"
import apiClient from "../config/apiClient"
import Swal from "sweetalert2"

const CoordTable = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deptId, setDeptId] = useState(null)
  const [selectedData, setSelectedData] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"))
    const id = userData?.department_id || null
    console.log(id, "TTTTT")
    setDeptId(id)
  }, [])

  useEffect(() => {
    if (!deptId) {
      console.log("Skipping API call because deptId is null")
      return
    }
    const fetchData = async () => {
      try {
        console.log("Making API call with deptId:", deptId)
        const response = await apiClient.get(`proposed_calendar_by_department/${deptId}/`)
        setData(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        setError("Failed to fetch data")
        console.log(error, "VVV")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [deptId])

  const handleViewMore = (item) => {
    setSelectedData(item)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedData(null)
  }

  const handleStatusChange = async (item, newStatus) => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const correctAnswer = a + b;
  
    const { value: formValues } = await Swal.fire({
      title: 'Confirm Status Change',
      html: `
        <label>What is ${a} + ${b}?</label>
        <input id="swal-input1" type="number" class="swal2-input">
        <label>Enter Remarks:</label>
        <input id="swal-input2" type="text" class="swal2-input">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const userAnswer = document.getElementById('swal-input1').value;
        const remarks = document.getElementById('swal-input2').value;
        if (!userAnswer) {
          return Swal.showValidationMessage('You need to answer the question!');
        }
        return { userAnswer, remarks };
      }
    });
  
    if (!formValues) return;
  
    const { userAnswer, remarks } = formValues;
    
    if (parseInt(userAnswer) === correctAnswer) {
      try {
        const response = await apiClient.put(`/update-proposed-calendar-status/${item.pc_id}/`, {
          status: newStatus,
          remarks
        });
        if (response.status === 200) {
          Swal.fire('Success', 'Status updated successfully', 'success');
          setData(data.map(d => d.pc_id === item.pc_id ? {...d, status: newStatus} : d));
        }
        window.location.reload();
      } catch (error) {
        Swal.fire('Error', 'Failed to update status', 'error');
        console.log(error);
      }
    } else {
      Swal.fire('Incorrect', 'The answer was wrong. Status not changed.', 'error');
    }
  };
  
  if (loading) return <div className={styles.loading}>Loading...</div>
  // if (error) return <div className={styles.error}>{error}</div>

  return (
    <div style={{width:"100%"}} className={styles.tableContainer}>
      <h2 className={styles.tableTitle}>Proposed Calendar Data Request</h2>
      <div className={styles.tableWrapper}>
      {data && data?.length > 0 ? <>  <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Event</th>
              <th>Activity Type</th>
              <th>Reg. Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Entity</th>
              <th>Cluster</th>
              <th>Institute</th>
              <th>Proposed Budget</th>
              <th>Status</th>
             
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr key={item.pc_id}>
                <td>{item.event_name}</td>
                <td>{item.activity_type}</td>
                <td>{item.registeration_name}</td>
                <td>{new Date(item.start_date).toLocaleDateString()}</td>
                <td>{new Date(item.end_date).toLocaleDateString()}</td>
                <td>{item?.entity_name}</td>
                <td>{item?.cluster_name}</td>
                <td>{item?.institute_name}</td>
                <td>₹{item.proposed_budget.toLocaleString()}</td>
                <td>
                  <select 
                    className={styles.statusDropdown}
                    value={item.status}
                    onChange={(e) => handleStatusChange(item, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                  
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                
               
                <td>
                  <button onClick={() => handleViewMore(item)} className={styles.viewMoreButton}>
                    View More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></> : ""}
      </div>

      <Drawer
        title="Event Details"
        placement="right"
        onClose={handleCloseDrawer}
        open={isDrawerOpen}
        width={400}
        className={styles.customDrawer}
      >
        {selectedData && (
          <div className={styles.drawerContent}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Entity Name:</span>
              <span className={styles.detailValue}>{selectedData.entity_name}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Cluster Name:</span>
              <span className={styles.detailValue}>{selectedData.cluster_name}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Institute Name:</span>
              <span className={styles.detailValue}>{selectedData.institute_name}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Secretary Name:</span>
              <span className={styles.detailValue}>{selectedData.Secretary_Name}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Secretary Email:</span>
              <span className={styles.detailValue}>{selectedData.Secretary_Email}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Secretary Mobile:</span>
              <span className={styles.detailValue}>{selectedData.Secretary_Mobile}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>FA Name:</span>
              <span className={styles.detailValue}>{selectedData.Faculty_Advisory_Name}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>FA Email:</span>
              <span className={styles.detailValue}>{selectedData.Faculty_Advisory_Email}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>FA Mobile:</span>
              <span className={styles.detailValue}>{selectedData.Faculty_Advisory_Mobile}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>FA E-Code:</span>
              <span className={styles.detailValue}>{selectedData.Faculty_Advisory_Empcode}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Description</span>
              <span className={styles.detailValue}>{selectedData.description}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Status</span>
              <span className={styles.detailValue}> <span className={`${styles.status} ${styles[selectedData.status.toLowerCase()]}`}>{selectedData.status}</span></span>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default CoordTable

