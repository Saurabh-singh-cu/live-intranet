"use client"

import { useState, useEffect } from "react"
import styles from "./ProposedCalendarTable.module.css"
import apiClient from "../config/apiClient"
import LoadingComponent from "../loader/LoadingComponent"

const ProposedCalendarTable = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [regId, setRegId] = useState(null)
  const [categories, setCategories] = useState([])
  const [nsqfData, setNsqfData] = useState([])
  const [actedData, setActedData] = useState([])
  const [sdgData, setSdgData] = useState([])

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"))
    const id =
      userData?.secretary_details?.reg_id || userData?.faculty_advisory_details?.[0]?.reg_id || userData?.reg_id || null
    console.log(id, "TTTTT")
    setRegId(id)
  }, [])

  // Fetch reference data for displaying names instead of IDs
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [categoriesRes, nsqfRes, actedRes] = await Promise.all([
          apiClient.get("entity-activities/"),
          apiClient.get("all-nsqf/"),
          apiClient.get("all-acted/"),
        ])

        setCategories(categoriesRes.data || [])
        setNsqfData(nsqfRes.data || [])
        setActedData(actedRes.data || [])

        // Fetch SDG data if regId is available
        if (regId) {
          const sdgRes = await apiClient.get(`/get-entity-sdg/?reg_id=${regId}`)
          setSdgData(sdgRes.data?.sdgs || [])
        }
      } catch (error) {
        console.error("Error fetching reference data:", error)
      }
    }

    fetchReferenceData()
  }, [regId])

  useEffect(() => {
    if (!regId) {
      console.log("Skipping API call because regId is null")
      return
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        console.log("Making API call with regId:", regId)
        const response = await apiClient.get(`proposed_calendar/${regId}/`)
        setData(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        setError("No Data")
        console.log(error, "VVV")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [regId])

  // Helper functions to get names from IDs
  const getCategoryName = (actId) => {
    if (!actId) return "N/A"
    const category = categories.find((cat) => cat.act_id === actId)
    return category ? category.activity_name : "Unknown"
  }

  const getActedName = (atdId) => {
    if (!atdId) return "N/A"
    const acted = actedData.find((a) => a.atd_id === atdId)
    return acted ? acted.atd_fullform : "Unknown"
  }

  const getNsqfName = (nsfId) => {
    if (!nsfId) return "N/A"
    const nsqf = nsqfData.find((n) => n.nsf_id === nsfId)
    return nsqf ? nsqf.nsf_name : "Unknown"
  }



  if (loading) return <LoadingComponent />
  if (error) return <div className={styles.error}>{error}</div>

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.tableTitle}>Proposed Calendar Data</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Activity Type</th>
              <th>Category</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Proposed Budget</th>
              <th>Participant Count</th>
              <th>ACTED</th>
              <th>NSQF</th>
              <th>SDG</th>
              <th>Status</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 ? (
              data.map((item) => (
                <tr key={item.pc_id || item.id}>
                  <td data-label="Event Name">{item.event_name || "N/A"}</td>
                  <td data-label="Activity Type">{item.activity_type || "N/A"}</td>
                  <td data-label="Category">{getCategoryName(item.act_id)}</td>
                  <td data-label="Start Date">
                    {item.start_date ? new Date(item.start_date).toLocaleDateString() : "N/A"}
                  </td>
                  <td data-label="End Date">{item.end_date ? new Date(item.end_date).toLocaleDateString() : "N/A"}</td>
                  <td data-label="Proposed Budget">
                    ₹{item.proposed_budget ? Number(item.proposed_budget).toLocaleString() : "0"}
                  </td>
                  <td data-label="Participant Count">{item.part_count || "N/A"}</td>
                  <td data-label="ACTED">{getActedName(item.atd_id)}</td>
                  <td data-label="NSQF">{getNsqfName(item.nsf_id)}</td>
                  <td data-label="SDG">{item.sdg}</td>
                  <td data-label="Status">
                    <span className={`${styles.status} ${item.status ? styles[item.status.toLowerCase()] : ""}`}>
                      {item.status === "Cancelled" ? (
                        <span style={{ color: "red" }}>CANCELLED</span>
                      ) : (
                        item.status || "Pending"
                      )}
                    </span>
                  </td>
                  <td data-label="Description" className={styles.descriptionCell}>
                    <div className={styles.descriptionText}>{item.description || "N/A"}</div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className={styles.noData}>
                  No proposed calendar data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProposedCalendarTable
