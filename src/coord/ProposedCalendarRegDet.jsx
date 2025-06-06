import React, { useState, useEffect, useMemo } from "react";
import apiClient from "../config/apiClient";
import styles from "./ProposedCalendarRegDet.module.css";
import LoadingComponent from "../loader/LoadingComponent";

const ProposedCalendarRegDet = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const user = JSON.parse(localStorage.getItem("user"));
        const departmentId = user?.department_id;
        const response = await apiClient.get(`proposed_all_calendar_by_department/${departmentId}/`);
        setData(response.data);
        if (response.data.length > 0) {
          setSelectedCard(response.data[0]);
        }
        setLoading(false);
      } catch (error) {
        // setError("An error occurred while fetching the data, or Session expired");
        setLoading(false);
      }
    };

    fetchData();

  }, []);



  const filteredData = useMemo(() => {
    if (activeFilter === 'all') return data;
    return data.filter(item => 
      item.proposed_calendar.some(event => event.activity_type.toLowerCase() === activeFilter.toLowerCase())
    );
  }, [data, activeFilter]);

  // Update selected card when filter changes
  useEffect(() => {
    if (filteredData.length > 0) {
      setSelectedCard(filteredData[0]);
    } else {
      setSelectedCard(null);
    }
  }, [filteredData]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!data || data.length === 0) return <div className={styles.noData}>No data available</div>;

  const handleCardClick = (item) => {
    setSelectedCard(item);
  };
  if (loading) return <LoadingComponent />;
  return (
    <div className={styles.mainContainer}>
     
     <h2 className={styles.title}>Proposed Calendar</h2>
      <div  className={styles.filterSection}>
        <div className={styles.filterTabs}>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'all' ? styles.active : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'flagship' ? styles.active : ''}`}
            onClick={() => setActiveFilter('flagship')}
          >
            Flagship
          </button>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'monthly' ? styles.active : ''}`}
            onClick={() => setActiveFilter('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'regularly' ? styles.active : ''}`}
            onClick={() => setActiveFilter('regularly')}
          >
            Regularly
          </button>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'all' ? styles.active : ''}`}
            onClick={() => setActiveFilter('regularly')}
          >
             Total: {filteredData.length}
          </button>
        </div>
       
      </div>
      {/* <div style={{marginBottom:"0px"}} className={styles.detailsTitle}>Proposed Calendar</div> */}

      <div className={styles.contentContainer}>
        <div className={styles.cardsList}>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div 
                key={item.registeration_details.reg_id}
                className={`${styles.card} ${selectedCard?.registeration_details.reg_id === item.registeration_details.reg_id ? styles.selectedCard : ''}`}
                onClick={() => handleCardClick(item)}
              >
                <h3 className={styles.cardTitle}>{item.registeration_details.registeration_name}</h3>
                <p className={styles.cardEntity}>{item.registeration_details.entity_name}</p>
              </div>
            ))
          ) : (
            <div className={styles.noDataMessage}>
              No data available for selected filter
            </div>
          )}
        </div>

        {selectedCard && filteredData.length > 0 && (
          <div className={styles.detailsSection}>
            <div className={styles.detailsCard}>
             
             

              <h3 className={styles.detailsTitle}>Proposed Calendar</h3>
              <div className={styles.tableResponsive}>
                <table className={styles.calendarTable}>
                  <thead>
                    <tr>
                      <th>Event Name</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Budget</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCard.proposed_calendar.map((event) => (
                      <tr key={event.pc_id}>
                        <td>{event.event_name}</td>
                        <td>{event.activity_type}</td>
                        <td>{`${event.start_date} - ${event.end_date}`}</td>
                        <td>₹{event.proposed_budget}</td>
                        <td>
                          <span className={`${styles.status} ${styles[event.status.toLowerCase()]}`}>
                            {event.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposedCalendarRegDet;