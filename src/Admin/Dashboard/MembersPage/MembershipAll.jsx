"use client";

import { useState, useEffect } from "react";
import styles from "./MembershipAll.module.css";
import apiClient from "../../../config/apiClient";
import { Spinner } from "./spinner";
import { ToastContainer } from "./toast-container";
import Swal from "sweetalert2";

const MembershipManagement = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState("members");

  // Members tab states
  const [entityTypes, setEntityTypes] = useState([]);
  const [entityCategories, setEntityCategories] = useState([]);
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [selectedRegId, setSelectedRegId] = useState("");
  const [tableData, setTableData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editFormData, setEditFormData] = useState({
    member_name: "",
    member_mobile: "",
    transaction_id: "",
    status: "",
  });
  const [currentItemId, setCurrentItemId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Clusters tab states
  const [clusters, setClusters] = useState([]);
  const [clustersLoading, setClustersLoading] = useState(false);
  const [showClusterDrawer, setShowClusterDrawer] = useState(false);
  const [isCreatingCluster, setIsCreatingCluster] = useState(false);
  const [editClusterFormData, setEditClusterFormData] = useState({
    cluster_name: "",
    department_id: "",
    department_name: "",
    institute: "",
    status: "active",
  });
  const [currentClusterId, setCurrentClusterId] = useState(null);
  const [showClusterDeleteModal, setShowClusterDeleteModal] = useState(false);
  const [deleteClusterId, setDeleteClusterId] = useState(null);

  // Fetch entity types on component mount
  useEffect(() => {
    fetchEntityTypes();
  }, []);

  // Fetch clusters when clusters tab is active
  useEffect(() => {
    if (activeTab === "clusters") {
      fetchClusters();
    }
  }, [activeTab]);

  // Fetch entity types
  const fetchEntityTypes = async () => {
    try {
      const response = await fetch(
        "https://api.cuintranet.in/intranetapp/entity-types/"
      );
      const data = await response.json();
      setEntityTypes(data);
    } catch (error) {
      console.error("Error fetching entity types:", error);
      showToast("Failed to fetch entity types", "error");
    }
  };

  // Fetch clusters
  const fetchClusters = async () => {
    try {
      setClustersLoading(true);
      const response = await apiClient.get("/clusters/");
      setClusters(response?.data || []);
      setClustersLoading(false);
    } catch (error) {
      console.error("Error fetching clusters:", error);
      showToast("Failed to fetch clusters", "error");
      setClustersLoading(false);
    }
  };

  // Fetch entity categories based on selected entity type
  const fetchEntityCategories = async (entityId) => {
    if (!entityId) return;

    try {
      setLoading(true);
      const response = await apiClient.get(
        `/entity-registration-name/?entity_id=${entityId}`
      );

      setEntityCategories(response?.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching entity categories:", error);
      showToast("Failed to fetch entity categories", "error");
      setLoading(false);
    }
  };

  // Fetch table data
  const fetchTableData = async () => {
    if (!selectedEntityId || !selectedRegId) return;

    try {
      setLoading(true);
      const payload = {
        entity_id: Number.parseInt(selectedEntityId),
        reg_id: Number.parseInt(selectedRegId),
      };
      const response = await apiClient.post("/memberships/all/", payload);

      setTableData(response?.data);
      setTotalCount(response?.data.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching table data:", error);
      showToast("Failed to fetch membership data", "error");
      setLoading(false);
    }
  };

  // Auto-fetch data when both selections are made
  useEffect(() => {
    if (selectedEntityId && selectedRegId) {
      fetchTableData();
    }
  }, [selectedEntityId, selectedRegId]);

  // Handle entity type change
  const handleEntityTypeChange = (e) => {
    const entityId = e.target.value;
    setSelectedEntityId(entityId);
    setSelectedRegId("");
    setTableData([]);

    if (entityId) {
      fetchEntityCategories(entityId);
    } else {
      setEntityCategories([]);
    }
  };

  // Handle entity category change
  const handleEntityCategoryChange = (e) => {
    setSelectedRegId(e.target.value);
  };

  // Show toast message
  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });

    // Auto hide toast after 3 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // Handle edit button click
  const handleEditClick = (item) => {
    setCurrentItemId(item.member_id);
    setEditFormData({
      member_name: item.member_name,
      member_mobile: item.member_mobile,
      transaction_id: item.transaction_id,
      status: item.status,
    });
    setShowDrawer(true);
  };

  // Handle edit form input change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Handle edit form submit
  const handleEditFormSubmit = async () => {
    try {
      const response = await apiClient.put(
        `/membership/${currentItemId}/update/`,
        editFormData
      );

      if (response.status === 200) {
        // Update the table data
        const updatedData = tableData.map((item) =>
          item.member_id === currentItemId ? { ...item, ...editFormData } : item
        );
        setTableData(updatedData);
        setShowDrawer(false);

        Swal.fire({
          title: "Success!",
          text: "Membership updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error updating membership:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update membership",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Handle close drawer
  const handleCloseDrawer = () => {
    setShowDrawer(false);
  };

  // Handle delete button click
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    try {
      const response = await apiClient.delete(
        `/membership/${deleteId}/delete/`
      );

      if (response.status === 200) {
        // Remove the deleted item from the table data
        const updatedData = tableData.filter(
          (item) => item.member_id !== deleteId
        );
        setTableData(updatedData);
        setTotalCount(updatedData.length);
        setShowDeleteModal(false);

        Swal.fire({
          title: "Success!",
          text: "Membership deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error deleting membership:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to delete membership",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  // Handle create cluster button click
  const handleCreateClusterClick = () => {
    setIsCreatingCluster(true);
    setCurrentClusterId(null);
    setEditClusterFormData({
      cluster_name: "",
      department_id: "",
      department_name: "",
      institute: "",
      status: "active",
    });
    setShowClusterDrawer(true);
  };

  // Handle cluster edit button click
  const handleClusterEditClick = (cluster) => {
    setIsCreatingCluster(false);
    setCurrentClusterId(cluster.cluster_id);
    setEditClusterFormData({
      cluster_name: cluster.cluster_name,
      department_id: cluster.department_id.toString(),
      department_name: cluster.department_name,
      institute: cluster.institute,
      status: cluster.status,
    });
    setShowClusterDrawer(true);
  };

  // Handle cluster edit form input change
  const handleClusterEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditClusterFormData({
      ...editClusterFormData,
      [name]: value,
    });
  };

  // Handle cluster form submit (create or update)
  const handleClusterFormSubmit = async () => {
    try {
      let response;
      const formData = {
        ...editClusterFormData,
        department_id: parseInt(editClusterFormData.department_id),
      };

      if (isCreatingCluster) {
        // Create new cluster
        response = await apiClient.post("/clusters/", formData);

        if (response.status === 201 || response.status === 200) {
          // Add the new cluster to the list
          setClusters([...clusters, response.data]);
          setShowClusterDrawer(false);

          Swal.fire({
            title: "Success!",
            text: "Cluster created successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }
      } else {
        // Update existing cluster
        response = await apiClient.put(
          `/clusters/${currentClusterId}/detail/`,
          formData
        );

        if (response.status === 200) {
          // Update the clusters data
          const updatedClusters = clusters.map((cluster) =>
            cluster.cluster_id === currentClusterId
              ? { ...cluster, ...formData }
              : cluster
          );
          setClusters(updatedClusters);
          setShowClusterDrawer(false);

          Swal.fire({
            title: "Success!",
            text: "Cluster updated successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }
      }
    } catch (error) {
      console.error("Error saving cluster:", error);
      Swal.fire({
        title: "Error",
        text: `Failed to ${isCreatingCluster ? "create" : "update"} cluster`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Handle close cluster drawer
  const handleCloseClusterDrawer = () => {
    setShowClusterDrawer(false);
  };

  // Handle cluster delete button click
  const handleClusterDeleteClick = (id) => {
    setDeleteClusterId(id);
    setShowClusterDeleteModal(true);
  };

  // Handle confirm cluster delete
  const handleConfirmClusterDelete = async () => {
    try {
      const response = await apiClient.delete(
        `/clusters/${deleteClusterId}/detail/`
      );

      if (response.status === 204 || response.status === 200) {
        // Remove the deleted cluster from the clusters data
        const updatedClusters = clusters.filter(
          (cluster) => cluster.cluster_id !== deleteClusterId
        );
        setClusters(updatedClusters);
        setShowClusterDeleteModal(false);

        Swal.fire({
          title: "Success!",
          text: "Cluster deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error deleting cluster:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to delete cluster",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Handle cancel cluster delete
  const handleCancelClusterDelete = () => {
    setShowClusterDeleteModal(false);
    setDeleteClusterId(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Management Dashboard</h1>

      <ToastContainer toast={toast} setToast={setToast} />

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "members" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("members")}
        >
          Members
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "clusters" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("clusters")}
        >
          Clusters
        </button>
      </div>

      {/* Members Tab Content */}
      {activeTab === "members" && (
        <>
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label htmlFor="entityType">Entity Type</label>
              <select
                id="entityType"
                value={selectedEntityId}
                onChange={handleEntityTypeChange}
                className={styles.select}
              >
                <option value="">Select Entity Type</option>
                {entityTypes.map((type) => (
                  <option key={type.entity_id} value={type.entity_id}>
                    {type.entity_name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="entityCategory">Entity Category</label>
              <select
                id="entityCategory"
                value={selectedRegId}
                onChange={handleEntityCategoryChange}
                className={styles.select}
                disabled={!selectedEntityId}
              >
                <option value="">Select Entity Category</option>
                {entityCategories.map((category) => (
                  <option key={category.reg_id} value={category.reg_id}>
                    {category.registration_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Members Table */}
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <h2>Membership List</h2>
              {tableData.length > 0 && (
                <span className={styles.totalCount}>Total: {totalCount}</span>
              )}
            </div>

            {loading ? (
              <div className={styles.loadingContainer}>
                <Spinner />
              </div>
            ) : tableData.length > 0 ? (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Member Name</th>
                      <th>Member UID</th>
                      <th>Member Email</th>
                      <th>Mobile</th>
                      <th>Department Name</th>
                      <th>Membership Code</th>
                      <th>Transaction ID</th>
                      <th>OTP</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item) => (
                      <tr key={item.member_id || item.id}>
                        <td>{item.member_id || item.id}</td>
                        <td>{item.member_name}</td>
                        <td>{item.member_uid}</td>
                        <td>{item.member_email}</td>
                        <td>{item.member_mobile}</td>
                        <td>{item.dept_name}</td>
                        <td>{item.membership_code}</td>
                        <td>{item.transaction_id}</td>
                        <td>{item.otp}</td>
                        <td>
                          <span
                            className={
                              item.status === "Active"
                                ? styles.statusActive
                                : styles.statusInactive
                            }
                          >
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              className={styles.editButton}
                              onClick={() => handleEditClick(item)}
                            >
                              Edit
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() => handleDeleteClick(item.member_id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : selectedEntityId && selectedRegId ? (
              <div className={styles.noData}>No data found</div>
            ) : (
              <div className={styles.noData}>
                Select both entity type and category to view data
              </div>
            )}
          </div>

          {/* Edit Drawer */}
          {showDrawer && (
            <div className={styles.drawerOverlay}>
              <div className={styles.drawer}>
                <div className={styles.drawerHeader}>
                  <h3>Edit Membership</h3>
                  <button
                    className={styles.closeButton}
                    onClick={handleCloseDrawer}
                  >
                    ×
                  </button>
                </div>
                <div className={styles.drawerContent}>
                  <div className={styles.formGroup}>
                    <label htmlFor="member_name">Member Name</label>
                    <input
                      type="text"
                      id="member_name"
                      name="member_name"
                      value={editFormData.member_name}
                      onChange={handleEditFormChange}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="member_mobile">Mobile Number</label>
                    <input
                      type="text"
                      id="member_mobile"
                      name="member_mobile"
                      value={editFormData.member_mobile}
                      onChange={handleEditFormChange}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="transaction_id">Transaction ID</label>
                    <input
                      type="text"
                      id="transaction_id"
                      name="transaction_id"
                      value={editFormData.transaction_id}
                      onChange={handleEditFormChange}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditFormChange}
                      className={styles.formSelect}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className={styles.drawerFooter}>
                  <button
                    className={styles.cancelButton}
                    onClick={handleCloseDrawer}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.saveButton}
                    onClick={handleEditFormSubmit}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete this membership?</p>
                <div className={styles.modalButtons}>
                  <button
                    className={styles.cancelButton}
                    onClick={handleCancelDelete}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={handleConfirmDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Clusters Tab Content */}
      {activeTab === "clusters" && (
        <>
          {/* Create Cluster Button */}
          <div className={styles.actionBar}>
            <button
              className={styles.createButton}
              onClick={handleCreateClusterClick}
            >
              Create New Cluster
            </button>
          </div>

          {/* Clusters Table */}
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <h2>Clusters List</h2>
              {clusters.length > 0 && (
                <span className={styles.totalCount}>
                  Total: {clusters.length}
                </span>
              )}
            </div>

            {clustersLoading ? (
              <div className={styles.loadingContainer}>
                <Spinner />
              </div>
            ) : clusters.length > 0 ? (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cluster Name</th>
                      <th>Department ID</th>
                      <th>Department Name</th>
                      <th>Institute</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clusters.map((cluster) => (
                      <tr key={cluster.cluster_id}>
                        <td>{cluster.cluster_id}</td>
                        <td>{cluster.cluster_name}</td>
                        <td>{cluster.department_id}</td>
                        <td>{cluster.department_name}</td>
                        <td>{cluster.institute}</td>
                        <td>
                          <span
                            className={
                              cluster.status === "active"
                                ? styles.statusActive
                                : styles.statusInactive
                            }
                          >
                            {cluster.status}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button
                              className={styles.editButton}
                              onClick={() => handleClusterEditClick(cluster)}
                            >
                              Edit
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() =>
                                handleClusterDeleteClick(cluster.cluster_id)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.noData}>No clusters found</div>
            )}
          </div>

          {/* Cluster Create/Edit Drawer */}
          {showClusterDrawer && (
            <div className={styles.drawerOverlay}>
              <div className={styles.drawer}>
                <div className={styles.drawerHeader}>
                  <h3>
                    {isCreatingCluster ? "Create Cluster" : "Edit Cluster"}
                  </h3>
                  <button
                    className={styles.closeButton}
                    onClick={handleCloseClusterDrawer}
                  >
                    ×
                  </button>
                </div>
                <div className={styles.drawerContent}>
                  <div className={styles.formGroup}>
                    <label htmlFor="cluster_name">Cluster Name</label>
                    <input
                      type="text"
                      id="cluster_name"
                      name="cluster_name"
                      value={editClusterFormData.cluster_name}
                      onChange={handleClusterEditFormChange}
                      className={styles.formInput}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="department_id">Department ID</label>
                    <input
                      type="number"
                      id="department_id"
                      name="department_id"
                      value={editClusterFormData.department_id}
                      onChange={handleClusterEditFormChange}
                      className={styles.formInput}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="department_name">Department Name</label>
                    <input
                      type="text"
                      id="department_name"
                      name="department_name"
                      value={editClusterFormData.department_name}
                      onChange={handleClusterEditFormChange}
                      className={styles.formInput}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="institute">Institute</label>
                    <input
                      type="text"
                      id="institute"
                      name="institute"
                      value={editClusterFormData.institute}
                      onChange={handleClusterEditFormChange}
                      className={styles.formInput}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={editClusterFormData.status}
                      onChange={handleClusterEditFormChange}
                      className={styles.formSelect}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className={styles.drawerFooter}>
                  <button
                    className={styles.cancelButton}
                    onClick={handleCloseClusterDrawer}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.saveButton}
                    onClick={handleClusterFormSubmit}
                  >
                    {isCreatingCluster ? "Create Cluster" : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cluster Delete Confirmation Modal */}
          {showClusterDeleteModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete this cluster?</p>
                <div className={styles.modalButtons}>
                  <button
                    className={styles.cancelButton}
                    onClick={handleCancelClusterDelete}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={handleConfirmClusterDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MembershipManagement;
