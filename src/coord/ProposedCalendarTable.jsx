import React, { useState, useEffect } from "react";
import styles from "./ProposedCalendarTable.module.css";
import apiClient from "../config/apiClient";
import LoadingComponent from "../loader/LoadingComponent";

const ProposedCalendarTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regId, setRegId] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const id = userData?.secretary_details?.reg_id || null;
    console.log(id, "TTTTT");
    setRegId(id);
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const id = userData?.secretary_details?.reg_id || null;
    console.log(id, "TTTTT");
    setRegId(id);
  }, []);

  useEffect(() => {
    if (!regId) {
      console.log("Skipping API call because regId is null");
      return;
    }

    const fetchData = async () => {
      try {
        console.log("Making API call with regId:", regId);
        const response = await apiClient.get(`proposed_calendar/${regId}/`);

        // Use response.data directly since apiClient is an Axios instance
        setData(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError("No Data");
        console.log(error, "VVV");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [regId]);

  if (loading) return <LoadingComponent />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.tableTitle}>Proposed Calendar Data</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Activity Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Proposed Budget</th>
              <th>Status</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr key={item.pc_id}>
                <td>{item.event_name}</td>
                <td>{item.activity_type}</td>
                <td>{new Date(item.start_date).toLocaleDateString()}</td>
                <td>{new Date(item.end_date).toLocaleDateString()}</td>
                <td>₹{item.proposed_budget.toLocaleString()}</td>
                <td>
                  <span
                    className={`${styles.status} ${
                      styles[item.status.toLowerCase()]
                    }`}
                  >
                    {item.status && item?.status === "Cancelled" ? (
                      <p style={{ color: "red" }}>CANCELLED</p>
                    ) : (
                      item?.status
                    )}
                  </span>
                </td>
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProposedCalendarTable;
