import React, { useEffect, useState } from "react";

import styles from "./CeremonyPdf.module.css";
import PdfViewer from "./PdfViewer";
import apiClient from "../../../config/apiClient";

const CeremonyPdf = () => {
  const [eventsData, setEventsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCluster, setFilterCluster] = useState("");
  const [filterEntity, setFilterEntity] = useState("");
  const [pdfFilter, setPdfFilter] = useState("all"); // all | uploaded | not_uploaded

  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });

  useEffect(() => {
    fetchCeremonyEvents();
  }, []);

  const fetchCeremonyEvents = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/ceremony_events_with_pdf");
      setEventsData(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching ceremony events:", error);
      setError("Failed to load ceremony events data");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdfView = (pdfUrl, eventName) => {
    if (pdfUrl === "Not Uploaded") {
      alert("PDF not uploaded for this event");
      return;
    }

    setSelectedPdf({
      url: pdfUrl,
      name: eventName,
    });
  };

  const closePdfViewer = () => {
    setSelectedPdf(null);
  };

  const handleDownload = (pdfUrl, eventName) => {
    if (pdfUrl === "Not Uploaded") {
      alert("PDF not uploaded for this event");
      return;
    }

    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${eventName.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getUniqueValues = (key) => {
    return [...new Set(eventsData.map((item) => item[key]))].filter(Boolean);
  };

  const sortedData = React.useMemo(() => {
    let sortableItems = [...eventsData];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [eventsData, sortConfig]);

  // const filteredData = React.useMemo(() => {
  //   return sortedData.filter((item) => {
  //     const matchesSearch = Object.values(item).some(
  //       (value) =>
  //         value &&
  //         value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  //     );

  //     const matchesCluster = !filterCluster || item.clusters === filterCluster;
  //     const matchesEntity = !filterEntity || item.entity_names === filterEntity;

  //     return matchesSearch && matchesCluster && matchesEntity;
  //   });
  // }, [sortedData, searchTerm, filterCluster, filterEntity]);

  const filteredData = React.useMemo(() => {
    return sortedData.filter((item) => {
      const matchesSearch = Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesCluster = !filterCluster || item.clusters === filterCluster;
      const matchesEntity = !filterEntity || item.entity_names === filterEntity;
      const matchesPdfFilter =
        pdfFilter === "all" ||
        (pdfFilter === "uploaded" && item.pdf_url !== "Not Uploaded") ||
        (pdfFilter === "not_uploaded" && item.pdf_url === "Not Uploaded");

      return (
        matchesSearch && matchesCluster && matchesEntity && matchesPdfFilter
      );
    });
  }, [sortedData, searchTerm, filterCluster, filterEntity, pdfFilter]);

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? " ▲" : " ▼";
    }
    return "";
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>Loading ceremony events data...</div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const totalCount = filteredData.length;
  const uploadedCount = filteredData.filter(
    (event) => event.pdf_url !== "Not Uploaded"
  ).length;
  const notUploadedCount = totalCount - uploadedCount;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ceremony Events PDF Management</h1>

      <div className={styles.controls}>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Cluster:</label>
            <select
              value={filterCluster}
              onChange={(e) => setFilterCluster(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Clusters</option>
              {getUniqueValues("clusters").map((cluster) => (
                <option key={cluster} value={cluster}>
                  {cluster}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Entity:</label>
            <select
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Entities</option>
              {getUniqueValues("entity_names").map((entity) => (
                <option key={entity} value={entity}>
                  {entity}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.countSummary}>
        <button
          onClick={() => setPdfFilter("all")}
          className={pdfFilter === "all" ? styles.activeFilter : ""}
        >
          Total Events: <strong>{totalCount}</strong>
        </button>
        <button
          onClick={() => setPdfFilter("uploaded")}
          className={pdfFilter === "uploaded" ? styles.activeFilter : ""}
        >
          Uploaded PDFs: <strong>{uploadedCount}</strong>
        </button>
        <button
          onClick={() => setPdfFilter("not_uploaded")}
          className={pdfFilter === "not_uploaded" ? styles.activeFilter : ""}
        >
          Not Uploaded PDFs: <strong>{notUploadedCount}</strong>
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort("rec_cer_id")}>
                S.No. {getSortIndicator("index")}
              </th>
              <th onClick={() => handleSort("clusters")}>
                Cluster {getSortIndicator("clusters")}
              </th>
              <th onClick={() => handleSort("departments")}>
                Department {getSortIndicator("departments")}
              </th>
              <th onClick={() => handleSort("entity_names")}>
                Entity {getSortIndicator("entity_names")}
              </th>
              <th onClick={() => handleSort("activity_event_names")}>
                Event Name {getSortIndicator("activity_event_names")}
              </th>
              {/* <th onClick={() => handleSort("created_at")}>
                Created At {getSortIndicator("created_at")}
              </th> */}
              <th>PDF Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((event, index) => (
                <tr key={event.rec_cer_id}>
                  <td>{index + 1}</td>
                  <td>{event.clusters}</td>
                  <td>{event.departments}</td>
                  <td>{event.entity_names}</td>
                  <td>{event.activity_event_names}</td>
                  {/* <td>{new Date(event.created_at).toLocaleString()}</td> */}
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.actionButton} ${
                          styles.viewButton
                        } ${
                          event.pdf_url === "Not Uploaded"
                            ? styles.disabled
                            : ""
                        }`}
                        onClick={() =>
                          handlePdfView(
                            event.pdf_url,
                            event.activity_event_names
                          )
                        }
                        disabled={event.pdf_url === "Not Uploaded"}
                      >
                        View
                      </button>
                      <button
                        className={`${styles.actionButton} ${
                          styles.downloadButton
                        } ${
                          event.pdf_url === "Not Uploaded"
                            ? styles.disabled
                            : ""
                        }`}
                        onClick={() =>
                          handleDownload(
                            event.pdf_url,
                            event.activity_event_names
                          )
                        }
                        disabled={event.pdf_url === "Not Uploaded"}
                      >
                        Download
                      </button>
                      <span className={styles.pdfStatus}>
                        {event.pdf_url === "Not Uploaded" ? (
                          <span className={styles.notUploaded}>
                            Not Uploaded
                          </span>
                        ) : (
                          <span className={styles.uploaded}>Uploaded</span>
                        )}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className={styles.noData}>
                  No events found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedPdf && (
        <PdfViewer
          pdfUrl={selectedPdf.url}
          eventName={selectedPdf.name}
          onClose={closePdfViewer}
        />
      )}
    </div>
  );
};

export default CeremonyPdf;
