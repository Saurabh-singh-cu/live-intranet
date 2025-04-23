import styles from "./EntityTable.module.css"

const EntityTable = () => {
  // Mock data for demonstration
  const entities = [
    {
      id: 1,
      name: "Tech Club",
      type: "CLUB",
      requestedBy: "John Doe",
      date: "2025-04-10",
      status: "pending",
    },
    {
      id: 2,
      name: "CS Department Society",
      type: "DEPARTMENT SOCIETY",
      requestedBy: "Jane Smith",
      date: "2025-04-12",
      status: "pending",
    },
    {
      id: 3,
      name: "IEEE Chapter",
      type: "PROFESSIONAL SOCIETY",
      requestedBy: "Mike Johnson",
      date: "2025-04-15",
      status: "approved",
    },
    {
      id: 4,
      name: "Photography Club",
      type: "CLUB",
      requestedBy: "Sarah Williams",
      date: "2025-04-18",
      status: "rejected",
    },
    {
      id: 5,
      name: "AI Community",
      type: "COMMUNITY",
      requestedBy: "David Brown",
      date: "2025-04-20",
      status: "pending",
    },
  ]

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return styles.statusApproved
      case "rejected":
        return styles.statusRejected
      case "pending":
      default:
        return styles.statusPending
    }
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableFilters}>
        <input type="text" placeholder="Search entities..." className={styles.searchInput} />
        <select className={styles.filterSelect}>
          <option value="">All Types</option>
          <option value="CLUB">Club</option>
          <option value="DEPARTMENT SOCIETY">Department Society</option>
          <option value="PROFESSIONAL SOCIETY">Professional Society</option>
          <option value="COMMUNITY">Community</option>
        </select>
        <select className={styles.filterSelect}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button className={styles.filterButton}>Filter</button>
      </div>

      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Requested By</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entities.map((entity) => (
            <tr key={entity.id}>
              <td>{entity.name}</td>
              <td>{entity.type}</td>
              <td>{entity.requestedBy}</td>
              <td>{entity.date}</td>
              <td>
                <span className={getStatusClass(entity.status)}>
                  {entity.status.charAt(0).toUpperCase() + entity.status.slice(1)}
                </span>
              </td>
              <td>
                <div className={styles.actionButtons}>
                  {entity.status === "pending" ? (
                    <>
                      <button className={styles.approveButton}>Approve</button>
                      <button className={styles.rejectButton}>Reject</button>
                    </>
                  ) : (
                    <button className={styles.viewButton}>View</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.tablePagination}>
        <button className={styles.paginationButton}>Previous</button>
        <div className={styles.paginationNumbers}>
          <button className={`${styles.pageNumber} ${styles.activePage}`}>1</button>
          <button className={styles.pageNumber}>2</button>
          <button className={styles.pageNumber}>3</button>
        </div>
        <button className={styles.paginationButton}>Next</button>
      </div>
    </div>
  )
}

export default EntityTable
