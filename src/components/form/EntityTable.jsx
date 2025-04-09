
// "use client"

// import { AgGridReact } from "ag-grid-react"
// import "ag-grid-community/styles/ag-grid.css"
// import "ag-grid-community/styles/ag-theme-alpine.css"
// import { Drawer, Form, Input, DatePicker, Select, Button, Modal, message, Tag } from "antd"
// import ReactQuill from "react-quill"
// import "react-quill/dist/quill.snow.css"
// import moment from "moment"
// import { useNavigate } from "react-router-dom"
// import mail from "../../assets/images/mail.png"
// import "./EntityTable.css"
// import { useCallback, useEffect, useState } from "react"

// import apiClient from "../../config/apiClient"

// const { TextArea } = Input

// function EntityTable() {
//   const [entities, setEntities] = useState([])
//   const [gridApi, setGridApi] = useState(null)
//   const [drawerVisible, setDrawerVisible] = useState(false)
//   const [mailDrawerVisible, setMailDrawerVisible] = useState(false)
//   const [editingEntity, setEditingEntity] = useState(null)
//   const [viewModalVisible, setViewModalVisible] = useState(false)
//   const [form] = Form.useForm()
//   const [mailForm] = Form.useForm()
//   const [user, setUser] = useState(null)
//   const [emails, setEmails] = useState([])
//   const navigate = useNavigate()
//   const [viewMoreDrawerVisible, setViewMoreDrawerVisible] = useState(false)
//   const [selectedEntityDetails, setSelectedEntityDetails] = useState(null)
//   const [statusModalVisible, setStatusModalVisible] = useState(false)
//   const [selectedStatus, setSelectedStatus] = useState("")
//   const [remark, setRemark] = useState("")
//   const [selectedEntityId, setSelectedEntityId] = useState(null)
//   const [userData, setUserData] = useState(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [textAreaValue, setTextAreaValue] = useState("")
//   const [isValid, setIsValid] = useState(false)
//   const [loadingEdit, setLoadingEdit] = useState(false)

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user")
//     if (storedUser) {
//       const parsedUser = JSON.parse(storedUser)
//       setUser(parsedUser)
//       if (parsedUser.access) {
//         fetchEntities(parsedUser.access)
//       } else {
//         console.error("Access token not found in user data")
//         navigate("/login")
//       }
//     } else {
//       navigate("/login")
//     }
//   }, [navigate])

//   const fetchEntities = async () => {
//     try {
//       const response = await apiClient.get("entity-requests/")
//       setEntities(response.data)
//     } catch (error) {
//       console.error("Error fetching entities:", error)
//     }
//   }

//   // Fetch full entity data for editing
//   const fetchEntityForEdit = async (entcrId) => {
//     setLoadingEdit(true)
//     try {
//       const response = await apiClient.put(`update-entity-request-all/${entcrId}/`)
//       return response.data
//     } catch (error) {
//       console.error("Error fetching entity details:", error)
//       message.error("Failed to fetch entity details")
//       return null
//     } finally {
//       setLoadingEdit(false)
//     }
//   }

//   const handleEdit = useCallback(
//     async (params) => {
//       const entcrId = params.data.entcr_id

//       // Fetch complete entity data
//       const fullEntityData = await fetchEntityForEdit(entcrId)

//       if (fullEntityData) {
//         setEditingEntity(fullEntityData)

//         // Format the date properly
//         const formattedData = {
//           ...fullEntityData,
//           proposed_date: fullEntityData.proposed_date ? moment(fullEntityData.proposed_date) : null,
//         }

//         form.setFieldsValue(formattedData)
//         setDrawerVisible(true)
//       }
//     },
//     [form],
//   )

//   const handleDelete = useCallback((params) => {
//     console.log("Delete clicked for entity with ID:", params.data.entcr_id)
//     setEntities((prevEntities) => prevEntities.filter((entity) => entity.entcr_id !== params.data.entcr_id))
//   }, [])

//   const handleSendMail = useCallback(
//     (params) => {
//       setEditingEntity(params.data)
//       mailForm.setFieldsValue({
//         entity_request_id: params.data.entcr_id,
//       })
//       setMailDrawerVisible(true)
//     },
//     [mailForm],
//   )

//   const onDrawerClose = () => {
//     setDrawerVisible(false)
//     setEditingEntity(null)
//     form.resetFields()
//   }

//   const onMailDrawerClose = () => {
//     setMailDrawerVisible(false)
//     mailForm.resetFields()
//     setEmails([])
//   }

//   const onFinish = async (values) => {
//     setIsLoading(true);
//     try {
//       // Ensure the date is in 'YYYY-MM-DD' format before sending
//       if (values.proposed_date) {
//         values.proposed_date = values.proposed_date.format("YYYY-MM-DD");
//       }
  
//       // Send the request
//       const response = await apiClient.put(`update-entity-request-all/${editingEntity.entcr_id}/`, values);
  
//       if (response.status === 200) {
//         message.success("Entity updated successfully");
  
//         setEntities((prevEntities) =>
//           prevEntities.map((entity) =>
//             entity.entcr_id === editingEntity.entcr_id ? { ...entity, ...values } : entity
//           )
//         );
  
//         onDrawerClose();
//         fetchEntities();
//       } else {
//         message.error("Failed to update entity");
//       }
//     } catch (error) {
//       console.error("Error updating entity:", error);
//       message.error("An error occurred while updating entity");
//     } finally {
//       setIsLoading(false);
//     }
//   };
  

//   const onMailFinish = (values) => {
//     Modal.confirm({
//       title: "Are you sure you want to send emails?",
//       onOk() {
//         const payload = {
//           ...values,
//           receiver_emails: emails,
//           user_id: user?.user_id || null,
//         }
//         apiClient
//           .post("send-email/", payload)

//           .then((response) => {
//             message.success("Email sent successfully")
//             onMailDrawerClose()
//           })
//           .catch((error) => {
//             console.error("Error sending email:", error)
//             message.error("Failed to send email")
//           })
//       },
//     })
//   }

//   const handleView = (params) => {
//     setEditingEntity(params.data)
//     setViewModalVisible(true)
//   }

//   const handleViewMore = (params) => {
//     setSelectedEntityDetails(params.data)
//     setViewMoreDrawerVisible(true)
//   }

//   const onViewMoreDrawerClose = () => {
//     setViewMoreDrawerVisible(false)
//     setSelectedEntityDetails(null)
//   }

//   const handleStatusChange = useCallback((params) => {
//     setSelectedEntityId(params.data.entcr_id)
//     setSelectedStatus(params.value)
//     setStatusModalVisible(true)
//   }, [])

//   const handleStatusConfirm = useCallback(async () => {
//     try {
//       const payload = {
//         status: selectedStatus,
//         remark: remark,
//       }

//       const response = await apiClient.put(`entity-request/${selectedEntityId}/`, payload)

//       if (response.status === 200) {
//         message.success("Status updated successfully")

//         setEntities((prevEntities) =>
//           prevEntities.map((entity) =>
//             entity.entcr_id === selectedEntityId ? { ...entity, status: selectedStatus } : entity,
//           ),
//         )
//       } else {
//         message.error("Failed to update status")
//       }
//     } catch (error) {
//       console.error("Error updating status:", error)
//       message.error("An error occurred while updating status")
//     }

//     setStatusModalVisible(false)
//     setRemark("")
//   }, [selectedStatus, remark, selectedEntityId])

//   const StatusCellRenderer = (props) => {
//     const statusOptions = ["Pending", "Approved", "Interview Scheduled", "Rejected", "Request Hold"]

//     return (
//       <Select
//         value={props.value}
//         onChange={(value) => handleStatusChange({ data: props.data, value })}
//         style={{ width: "100%" }}
//       >
//         {statusOptions.map((status) => (
//           <Select.Option key={status} value={status}>
//             {status}
//           </Select.Option>
//         ))}
//       </Select>
//     )
//   }

//   const columnDefs = [
//     {
//       headerName: "Proposed Name",
//       field: "proposed_name",
//       sortable: true,
//       filter: true,
//     },
//     {
//       headerName: "Proposed Date",
//       field: "proposed_date",
//       sortable: true,
//       filter: true,
//     },
//     {
//       headerName: "Proposed By",
//       field: "proposed_by",
//       sortable: true,
//       filter: true,
//     },
//     {
//       headerName: "Proposer Name",
//       field: "proposer_name",
//       sortable: true,
//       filter: true,
//     },
//     {
//       headerName: "Entity Nature",
//       field: "entity_nature",
//       sortable: true,
//       filter: true,
//     },
//     {
//       headerName: "Status",
//       field: "status",
//       sortable: true,
//       filter: true,
//       cellRenderer: StatusCellRenderer,
//     },
//     {
//       headerName: "Entity Name",
//       field: "entity_name",
//       sortable: true,
//       filter: true,
//     },
//     {
//       headerName: "Department",
//       field: "department_name",
//       sortable: true,
//       filter: true,
//     },

//     { headerName: "Session", field: "session", sortable: true, filter: true },
//     {
//       headerName: "Proposed By Email",
//       field: "proposer_email",
//       sortable: true,
//       filter: true,
//     },
//     {
//       headerName: "Proposer Contact",
//       field: "mobile",
//       sortable: true,
//       filter: true,
//     },
//     {
//       headerName: "Send Mail",
//       field: "actions",
//       cellRenderer: (params) => (
//         <button className="clear-button" onClick={() => handleSendMail(params)} title="Send Mail">
//           <img style={{ width: "20px" }} src={mail || "/placeholder.svg"} alt="mail" />
//           Send Mail
//         </button>
//       ),
//     },
//     {
//       headerName: "View Referal",
//       field: "actions",
//       cellRenderer: (params) => (
//         <button className="clear-button" onClick={() => handleView(params)} title="View">
//           View Referal
//         </button>
//       ),
//     },
//     {
//       headerName: "Actions",
//       field: "actions",
//       cellRenderer: (params) => (
//         <div className="action-buttons">
//           <button className="clear-button" onClick={() => handleEdit(params)} title="Edit">
//             Edit
//           </button>
//           <button className="clear-button" onClick={() => handleDelete(params)} title="Delete">
//             Delete
//           </button>
//         </div>
//       ),
//     },
//     {
//       headerName: "Full Result",
//       field: "actions",
//       cellRenderer: (params) => (
//         <button className="clear-button" onClick={() => handleViewMore(params)} title="View More">
//           View Full Result
//         </button>
//       ),
//     },
//   ]

//   const onGridReady = (params) => {
//     setGridApi(params.api)
//   }

//   const downloadCSV = () => {
//     gridApi.exportDataAsCsv()
//   }

//   const renderSection = (title, fields) => (
//     <>
//       <tr className="section-header">
//         <td colSpan="2">{title}</td>
//       </tr>
//       {fields.map(([label, key]) => (
//         <tr key={key}>
//           <td>{label}</td>
//           <td>{selectedEntityDetails?.[key] || "N/A"}</td>
//         </tr>
//       ))}
//     </>
//   )

//   const isValidEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     return re.test(String(email).toLowerCase())
//   }

//   const processEmails = (text) => {
//     const emailList = text.split(/[\n,\s]+/).filter(Boolean)

//     const processedEmails = emailList.map((email) => {
//       email = email.trim()
//       if (!email.includes("@")) {
//         email = `${email}@cuchd.in`
//       }
//       return email
//     })

//     const uniqueEmails = [...new Set(processedEmails)]
//     const validEmails = uniqueEmails.filter((email) => isValidEmail(email))

//     setEmails(validEmails)
//     return validEmails
//   }

//   const handlePaste = (e) => {
//     const pastedText = e.clipboardData.getData("text")
//     const newValue = textAreaValue + pastedText
//     setTextAreaValue(newValue)
//     processEmails(newValue)
//   }

//   const handleEmailInputChange = (e) => {
//     const inputValue = e.target.value
//     setTextAreaValue(inputValue)
//     const validEmails = processEmails(inputValue)
//     setIsValid(validEmails.length > 0 && validEmails.length === inputValue.split(/[\n,\s]+/).filter(Boolean).length)
//   }

//   const removeEmail = (emailToRemove) => {
//     const updatedEmails = emails.filter((email) => email !== emailToRemove)
//     setEmails(updatedEmails)
//     setTextAreaValue(updatedEmails.join("\n"))
//   }

//   return (
//     <div className="entity-table-container">
//       <div className="table-header-entity">
//         <div>
//           <h2>Entities Status</h2>
//         </div>
//         <div className="header-buttons">
//           <button className="clear-button" onClick={downloadCSV}>
//             Download CSV
//           </button>
//           <button className="clear-button">Add Entity</button>
//         </div>
//       </div>
//       <div className="ag-theme-alpine" style={{ height: 400, width: "100%", overflow: "auto" }}>
//         <AgGridReact
//           columnDefs={columnDefs}
//           rowData={entities}
//           onGridReady={onGridReady}
//           pagination={true}
//           paginationPageSize={10}
//           domLayout="normal"
//           suppressHorizontalScroll={false}
//           enableBrowserTooltips={true}
//           getRowStyle={(params) => {
//             if (!params.data.session || params.data.session.trim() === null) {
//               return { background: "red", color: "white" }
//             }
//             return null
//           }}
//         />
//       </div>
//       <Drawer
//         title="Edit Entity"
//         placement="right"
//         onClose={onDrawerClose}
//         visible={drawerVisible}
//         width={600}
//         destroyOnClose={true}
//       >
//         {loadingEdit ? (
//           <div style={{ textAlign: "center", padding: "20px" }}>Loading entity data...</div>
//         ) : (
//           <Form form={form} layout="vertical" onFinish={onFinish}>
//             <Form.Item name="entcr_id" hidden>
//               <Input />
//             </Form.Item>

//             <div style={{ display: "flex", gap: "16px" }}>
//               <Form.Item
//                 name="proposed_name"
//                 label="Proposed Name"
//                 style={{ flex: 1 }}
//                 rules={[{ required: true, message: "Please enter proposed name" }]}
//               >
//                 <Input />
//               </Form.Item>

//               <Form.Item
//                 name="proposed_date"
//                 label="Proposed Date"
//                 style={{ flex: 1 }}
//                 rules={[{ required: true, message: "Please select date" }]}
//               >
//                 <DatePicker style={{ width: "100%" }} />
//               </Form.Item>
//             </div>

//             <div style={{ display: "flex", gap: "16px" }}>
//               <Form.Item name="proposed_by" label="Proposed By" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>

//               <Form.Item name="proposer_name" label="Proposer Name" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>
//             </div>

//             <div style={{ display: "flex", gap: "16px" }}>
//               <Form.Item name="emp_code" label="Employee Code" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>

             
//             </div>

//             <div style={{ display: "flex", gap: "16px" }}>
//               <Form.Item name="mobile" label="Mobile" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>

//               <Form.Item name="entity_nature" label="Entity Nature" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>
//             </div>

//             <div style={{ display: "flex", gap: "16px" }}>
//               <Form.Item name="status" label="Status" style={{ flex: 1 }}>
//                 <Select>
//                   <Select.Option value="Pending">Pending</Select.Option>
//                   <Select.Option value="Approved">Approved</Select.Option>
//                   <Select.Option value="Interview Scheduled">Interview Scheduled</Select.Option>
//                   <Select.Option value="Rejected">Rejected</Select.Option>
//                   <Select.Option value="Request Hold">Request Hold</Select.Option>
//                 </Select>
//               </Form.Item>

//               <Form.Item name="session" label="Session" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>
//             </div>

//             <div style={{ display: "flex", gap: "16px" }}>
//               <Form.Item name="entity_name" label="Entity Name" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>

//               <Form.Item name="department_name" label="Department Name" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>
//             </div>

//             <h3>Student Section 1</h3>
//             <div style={{ display: "flex", gap: "16px" }}>
//               <Form.Item name="student_sec_1_name" label="Name" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>

//               <Form.Item name="student_sec_1_email" label="Email" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>
//             </div>

//             <div style={{ display: "flex", gap: "16px" }}>
//               <Form.Item name="student_sec_1_uid" label="UID" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>

//               <Form.Item name="student_sec_1_mobile" label="Mobile" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>
//             </div>

//             <h3>Student Section 2</h3>
//             <div style={{ display: "flex", gap: "16px" }}>
//               <Form.Item name="student_sec_2_name" label="Name" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>

//               <Form.Item name="student_sec_2_email" label="Email" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>
//             </div>

//             <div style={{ display: "flex", gap: "16px" }}>
//               <Form.Item name="student_sec_2_uid" label="UID" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>

//               <Form.Item name="student_sec_2_mobile" label="Mobile" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>
//             </div>

//             <h3>Faculty Advisor 1</h3>
//             <div style={{ display: "flex", gap: "16px" }}>
//               <Form.Item name="faculty_adv_1_name" label="Name" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>

//               <Form.Item name="faculty_adv_1_email" label="Email" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>
//             </div>

//             <div style={{ display: "flex", gap: "16px" }}>
//               <Form.Item name="faculty_adv_1_empcode" label="Emp Code" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>

//               <Form.Item name="faculty_adv_1_mobile" label="Mobile" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>
//             </div>

//             <h3>Faculty Co-Advisor 1</h3>
//             <div style={{ display: "flex", gap: "16px" }}>
//               <Form.Item name="faculty_coadv_1_name" label="Name" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>

//               <Form.Item name="faculty_coadv_1_email" label="Email" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>
//             </div>

//             <div style={{ display: "flex", gap: "16px" }}>
//               <Form.Item name="faculty_coadv_1_empcode" label="Emp Code" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>

//               <Form.Item name="faculty_coadv_1_mobile" label="Mobile" style={{ flex: 1 }}>
//                 <Input />
//               </Form.Item>
//             </div>

//             <Form.Item>
//               <Button type="primary" htmlType="submit" loading={isLoading}>
//                 Update Entity
//               </Button>
//               <Button style={{ marginLeft: 8 }} onClick={onDrawerClose}>
//                 Cancel
//               </Button>
//             </Form.Item>
//           </Form>
//         )}
//       </Drawer>
//       <Drawer title="Send Mail" placement="right" onClose={onMailDrawerClose} visible={mailDrawerVisible} width={600}>
//         <Form form={mailForm} layout="vertical" onFinish={onMailFinish}>
//           <Form.Item label="Email Addresses">
//             <TextArea
//               value={textAreaValue}
//               placeholder="Paste email addresses from Excel or type (domain @cuchd.in will be added automatically if missing)"
//               onChange={handleEmailInputChange}
//               onPaste={handlePaste}
//               style={{
//                 background: "white",
//                 border: `1px solid ${isValid ? "#52c41a" : "#d9d9d9"}`,
//                 borderRadius: "2px",
//                 padding: "4px 11px",
//                 minHeight: "100px",
//               }}
//             />
//           </Form.Item>
//           <div
//             style={{
//               marginBottom: "10px",
//               maxHeight: "150px",
//               overflowY: "auto",
//             }}
//           >
//             {emails.map((email, index) => (
//               <Tag
//                 key={index}
//                 closable
//                 onClose={() => removeEmail(email)}
//                 style={{
//                   background: "#f0f0f0",
//                   borderRadius: "16px",
//                   padding: "4px 8px",
//                   margin: "4px",
//                   display: "inline-flex",
//                   alignItems: "center",
//                 }}
//               >
//                 <span style={{ color: "#389e0d" }}>{email}</span>
//               </Tag>
//             ))}
//           </div>
//           <div>Total emails: {emails.length}</div>

//           <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="body" label="Body" rules={[{ required: true }]}>
//             <ReactQuill theme="snow" />
//           </Form.Item>
//           <Form.Item
//             style={{ display: "none" }}
//             name="entity_request_id"
//             label="Entity Request ID"
//             rules={[{ required: true }]}
//           >
//             <Input disabled />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit" loading={isLoading}>
//               Send Mail
//             </Button>
//           </Form.Item>
//         </Form>
//       </Drawer>
//       <Modal
//         title="Referral"
//         visible={viewModalVisible}
//         onCancel={() => setViewModalVisible(false)}
//         footer={null}
//         width={600}
//       >
//         <div dangerouslySetInnerHTML={{ __html: editingEntity?.referal || "" }} />
//       </Modal>
//       <Drawer
//         title="Entity Details"
//         placement="right"
//         onClose={onViewMoreDrawerClose}
//         visible={viewMoreDrawerVisible}
//         width={600}
//       >
//         {viewMoreDrawerVisible && (
//           <div className="drawer-overlay" onClick={onViewMoreDrawerClose}>
//             <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
//               <h2>Entity Details</h2>
//               <table className="entity-details-table">
//                 <tbody>
//                   {renderSection("Entity Information", [
//                     ["Proposed Name", "proposed_name"],
//                     ["Proposed Date", "proposed_date"],
//                     ["Proposed By", "proposed_by"],
//                     ["Proposer Name", "proposer_name"],
//                     ["Entity Nature", "entity_nature"],
//                     ["Status", "status"],
//                     ["Entity Name", "entity_name"],
//                     ["Department", "department_name"],
//                   ])}

//                   {renderSection("Student Section 1", [
//                     ["Name", "student_sec_1_name"],
//                     ["Email", "student_sec_1_email"],
//                     ["UID", "student_sec_1_uid"],
//                     ["Mobile", "student_sec_1_mobile"],
//                   ])}

//                   {renderSection("Student Section 2", [
//                     ["Name", "student_sec_2_name"],
//                     ["Email", "student_sec_2_email"],
//                     ["UID", "student_sec_2_uid"],
//                     ["Mobile", "student_sec_2_mobile"],
//                   ])}

//                   {renderSection("Student Advisor Section 1", [
//                     ["Name", "student_advsec_1_name"],
//                     ["Email", "student_advsec_1_email"],
//                     ["UID", "student_advsec_1_uid"],
//                     ["Mobile", "student_advsec_1_mobile"],
//                   ])}

//                   {renderSection("Student Advisor Section 2", [
//                     ["Name", "student_advsec_2_name"],
//                     ["Email", "student_advsec_2_email"],
//                     ["UID", "student_advsec_2_uid"],
//                     ["Mobile", "student_advsec_2_mobile"],
//                   ])}

//                   {renderSection("Faculty Advisor 1", [
//                     ["Name", "faculty_adv_1_name"],
//                     ["Email", "faculty_adv_1_email"],
//                     ["Emp Code", "faculty_adv_1_empcode"],
//                     ["Mobile", "faculty_adv_1_mobile"],
//                   ])}

//                   {renderSection("Faculty Advisor 2", [
//                     ["Name", "faculty_adv_2_name"],
//                     ["Email", "faculty_adv_2_email"],
//                     ["Emp Code", "faculty_adv_2_empcode"],
//                     ["Mobile", "faculty_adv_2_mobile"],
//                   ])}

//                   {renderSection("Faculty Co-Advisor 1", [
//                     ["Name", "faculty_coadv_1_name"],
//                     ["Email", "faculty_coadv_1_email"],
//                     ["Emp Code", "faculty_coadv_1_empcode"],
//                     ["Mobile", "faculty_coadv_1_mobile"],
//                   ])}

//                   {renderSection("Faculty Co-Advisor 2", [
//                     ["Name", "faculty_coadv_2_name"],
//                     ["Email", "faculty_coadv_2_email"],
//                     ["Emp Code", "faculty_coadv_2_empcode"],
//                     ["Mobile", "faculty_coadv_2_mobile"],
//                   ])}
//                 </tbody>
//               </table>
//               <button className="close-button" onClick={onViewMoreDrawerClose}>
//                 Close
//               </button>
//             </div>
//           </div>
//         )}
//       </Drawer>

//       <Modal
//         title="Confirm Status Change"
//         visible={statusModalVisible}
//         onOk={handleStatusConfirm}
//         onCancel={() => setStatusModalVisible(false)}
//       >
//         <p>Are you sure you want to change the status to {selectedStatus}?</p>
//         <Form.Item label="Remark">
//           <TextArea
//             rows={4}
//             value={remark}
//             onChange={(e) => setRemark(e.target.value)}
//             placeholder="Enter your remark here"
//           />
//         </Form.Item>
//       </Modal>
//     </div>
//   )
// }

// export default EntityTable

"use client"

import { AgGridReact } from "ag-grid-react"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import { Drawer, Form, Input, DatePicker, Select, Button, Modal, message, Tag } from "antd"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import moment from "moment"
import { useNavigate } from "react-router-dom"
import mail from "../../assets/images/mail.png"
import "./EntityTable.css"
import { useCallback, useEffect, useState } from "react"

import apiClient from "../../config/apiClient"

const { TextArea } = Input

function EntityTable() {
  const [entities, setEntities] = useState([])
  const [gridApi, setGridApi] = useState(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [mailDrawerVisible, setMailDrawerVisible] = useState(false)
  const [editingEntity, setEditingEntity] = useState(null)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [mailForm] = Form.useForm()
  const [user, setUser] = useState(null)
  const [emails, setEmails] = useState([])
  const navigate = useNavigate()
  const [viewMoreDrawerVisible, setViewMoreDrawerVisible] = useState(false)
  const [selectedEntityDetails, setSelectedEntityDetails] = useState(null)
  const [statusModalVisible, setStatusModalVisible] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [remark, setRemark] = useState("")
  const [selectedEntityId, setSelectedEntityId] = useState(null)
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [textAreaValue, setTextAreaValue] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [entityTypes, setEntityTypes] = useState([])
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      if (parsedUser.access) {
        fetchEntities(parsedUser.access)
        fetchEntityTypes()
        fetchDepartments()
      } else {
        console.error("Access token not found in user data")
        navigate("/login")
      }
    } else {
      navigate("/login")
    }
  }, [navigate])

  const fetchEntities = async () => {
    try {
      const response = await apiClient.get("entity-requests/")
      setEntities(response.data)
    } catch (error) {
      console.error("Error fetching entities:", error)
    }
  }

  const fetchEntityTypes = async () => {
    try {
      const response = await apiClient.get("entity-types/")
      setEntityTypes(response.data)
    } catch (error) {
      console.error("Error fetching entity types:", error)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await apiClient.get("departments/")
      setDepartments(response.data)
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  // Fetch full entity data for editing
  const fetchEntityForEdit = async (entcrId) => {
    setLoadingEdit(true)
    try {
      const response = await apiClient.put(`update-entity-request-all/${entcrId}/`)
      return response.data
    } catch (error) {
      console.error("Error fetching entity details:", error)
      message.error("Failed to fetch entity details")
      return null
    } finally {
      setLoadingEdit(false)
    }
  }

  const handleEdit = useCallback(
    async (params) => {
      const entcrId = params.data.entcr_id

      // Fetch complete entity data
      const fullEntityData = await fetchEntityForEdit(entcrId)

      if (fullEntityData) {
        setEditingEntity(fullEntityData)

        // Find the entity and department IDs based on names
        const entityType = entityTypes.find((entity) => entity.entity_name === fullEntityData.entity_name)
        const department = departments.find((dept) => dept.dept_name === fullEntityData.department_name)

        // Format the date properly and set the IDs
        const formattedData = {
          ...fullEntityData,
          proposed_date: fullEntityData.proposed_date ? moment(fullEntityData.proposed_date) : null,
          entity_id: entityType ? entityType.entity_id : undefined,
          department: department ? department.department : undefined,
        }

        form.setFieldsValue(formattedData)
        setDrawerVisible(true)
      }
    },
    [form, entityTypes, departments],
  )

  const handleDelete = useCallback((params) => {
    console.log("Delete clicked for entity with ID:", params.data.entcr_id)
    setEntities((prevEntities) => prevEntities.filter((entity) => entity.entcr_id !== params.data.entcr_id))
  }, [])

  const handleSendMail = useCallback(
    (params) => {
      setEditingEntity(params.data)
      mailForm.setFieldsValue({
        entity_request_id: params.data.entcr_id,
      })
      setMailDrawerVisible(true)
    },
    [mailForm],
  )

  const onDrawerClose = () => {
    setDrawerVisible(false)
    setEditingEntity(null)
    form.resetFields()
  }

  const onMailDrawerClose = () => {
    setMailDrawerVisible(false)
    mailForm.resetFields()
    setEmails([])
  }

  const onFinish = async (values) => {
    setIsLoading(true)
    try {
      // Ensure the date is in 'YYYY-MM-DD' format before sending
      if (values.proposed_date) {
        values.proposed_date = values.proposed_date.format("YYYY-MM-DD")
      }

      // Find the entity and department names for display
      const selectedEntity = entityTypes.find((entity) => entity.entity_id === values.entity_id)
      const selectedDepartment = departments.find((dept) => dept.department === values.department)

      // Store the names for display in the table
      values.entity_name = selectedEntity ? selectedEntity.entity_name : ""
      values.department_name = selectedDepartment ? selectedDepartment.dept_name : ""

      // Send the request
      const response = await apiClient.put(`update-entity-request-all/${editingEntity.entcr_id}/`, values)

      if (response.status === 200) {
        message.success("Entity updated successfully")

        setEntities((prevEntities) =>
          prevEntities.map((entity) =>
            entity.entcr_id === editingEntity.entcr_id ? { ...entity, ...values } : entity,
          ),
        )

        onDrawerClose()
        fetchEntities()
      } else {
        message.error("Failed to update entity")
      }
    } catch (error) {
      console.error("Error updating entity:", error)
      message.error("An error occurred while updating entity")
    } finally {
      setIsLoading(false)
    }
  }

  const onMailFinish = (values) => {
    Modal.confirm({
      title: "Are you sure you want to send emails?",
      onOk() {
        const payload = {
          ...values,
          receiver_emails: emails,
          user_id: user?.user_id || null,
        }
        apiClient
          .post("send-email/", payload)

          .then((response) => {
            message.success("Email sent successfully")
            onMailDrawerClose()
          })
          .catch((error) => {
            console.error("Error sending email:", error)
            message.error("Failed to send email")
          })
      },
    })
  }

  const handleView = (params) => {
    setEditingEntity(params.data)
    setViewModalVisible(true)
  }

  const handleViewMore = (params) => {
    setSelectedEntityDetails(params.data)
    setViewMoreDrawerVisible(true)
  }

  const onViewMoreDrawerClose = () => {
    setViewMoreDrawerVisible(false)
    setSelectedEntityDetails(null)
  }

  const handleStatusChange = useCallback((params) => {
    setSelectedEntityId(params.data.entcr_id)
    setSelectedStatus(params.value)
    setStatusModalVisible(true)
  }, [])

  const handleStatusConfirm = useCallback(async () => {
    try {
      const payload = {
        status: selectedStatus,
        remark: remark,
      }

      const response = await apiClient.put(`entity-request/${selectedEntityId}/`, payload)

      if (response.status === 200) {
        message.success("Status updated successfully")

        setEntities((prevEntities) =>
          prevEntities.map((entity) =>
            entity.entcr_id === selectedEntityId ? { ...entity, status: selectedStatus } : entity,
          ),
        )
      } else {
        message.error("Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      message.error("An error occurred while updating status")
    }

    setStatusModalVisible(false)
    setRemark("")
  }, [selectedStatus, remark, selectedEntityId])

  const StatusCellRenderer = (props) => {
    const statusOptions = ["Pending", "Approved", "Interview Scheduled", "Rejected", "Request Hold"]

    return (
      <Select
        value={props.value}
        onChange={(value) => handleStatusChange({ data: props.data, value })}
        style={{ width: "100%" }}
      >
        {statusOptions.map((status) => (
          <Select.Option key={status} value={status}>
            {status}
          </Select.Option>
        ))}
      </Select>
    )
  }

  const columnDefs = [
    {
      headerName: "Proposed Name",
      field: "proposed_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Proposed Date",
      field: "proposed_date",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Proposed By",
      field: "proposed_by",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Proposer Name",
      field: "proposer_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Entity Nature",
      field: "entity_nature",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      cellRenderer: StatusCellRenderer,
    },
    {
      headerName: "Entity Name",
      field: "entity_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Department",
      field: "department_name",
      sortable: true,
      filter: true,
    },

    { headerName: "Session", field: "session", sortable: true, filter: true },
    {
      headerName: "Proposed By Email",
      field: "proposer_email",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Proposer Contact",
      field: "mobile",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Send Mail",
      field: "actions",
      cellRenderer: (params) => (
        <button className="clear-button" onClick={() => handleSendMail(params)} title="Send Mail">
          <img style={{ width: "20px" }} src={mail || "/placeholder.svg"} alt="mail" />
          Send Mail
        </button>
      ),
    },
    {
      headerName: "View Referal",
      field: "actions",
      cellRenderer: (params) => (
        <button className="clear-button" onClick={() => handleView(params)} title="View">
          View Referal
        </button>
      ),
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div className="action-buttons">
          <button className="clear-button" onClick={() => handleEdit(params)} title="Edit">
            Edit
          </button>
          <button className="clear-button" onClick={() => handleDelete(params)} title="Delete">
            Delete
          </button>
        </div>
      ),
    },
    {
      headerName: "Full Result",
      field: "actions",
      cellRenderer: (params) => (
        <button className="clear-button" onClick={() => handleViewMore(params)} title="View More">
          View Full Result
        </button>
      ),
    },
  ]

  const onGridReady = (params) => {
    setGridApi(params.api)
  }

  const downloadCSV = () => {
    gridApi.exportDataAsCsv()
  }

  const renderSection = (title, fields) => (
    <>
      <tr className="section-header">
        <td colSpan="2">{title}</td>
      </tr>
      {fields.map(([label, key]) => (
        <tr key={key}>
          <td>{label}</td>
          <td>{selectedEntityDetails?.[key] || "N/A"}</td>
        </tr>
      ))}
    </>
  )

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(email).toLowerCase())
  }

  const processEmails = (text) => {
    const emailList = text.split(/[\n,\s]+/).filter(Boolean)

    const processedEmails = emailList.map((email) => {
      email = email.trim()
      if (!email.includes("@")) {
        email = `${email}@cuchd.in`
      }
      return email
    })

    const uniqueEmails = [...new Set(processedEmails)]
    const validEmails = uniqueEmails.filter((email) => isValidEmail(email))

    setEmails(validEmails)
    return validEmails
  }

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData("text")
    const newValue = textAreaValue + pastedText
    setTextAreaValue(newValue)
    processEmails(newValue)
  }

  const handleEmailInputChange = (e) => {
    const inputValue = e.target.value
    setTextAreaValue(inputValue)
    const validEmails = processEmails(inputValue)
    setIsValid(validEmails.length > 0 && validEmails.length === inputValue.split(/[\n,\s]+/).filter(Boolean).length)
  }

  const removeEmail = (emailToRemove) => {
    const updatedEmails = emails.filter((email) => email !== emailToRemove)
    setEmails(updatedEmails)
    setTextAreaValue(updatedEmails.join("\n"))
  }

  return (
    <div className="entity-table-container">
      <div className="table-header-entity">
        <div>
          <h2>Entities Status</h2>
        </div>
        <div className="header-buttons">
          <button className="clear-button" onClick={downloadCSV}>
            Download CSV
          </button>
          <button className="clear-button">Add Entity</button>
        </div>
      </div>
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%", overflow: "auto" }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={entities}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={10}
          domLayout="normal"
          suppressHorizontalScroll={false}
          enableBrowserTooltips={true}
          getRowStyle={(params) => {
            if (!params.data.session || params.data.session.trim() === null) {
              return { background: "red", color: "white" }
            }
            return null
          }}
        />
      </div>
      <Drawer
        title="Edit Entity"
        placement="right"
        onClose={onDrawerClose}
        visible={drawerVisible}
        width={600}
        destroyOnClose={true}
      >
        {loadingEdit ? (
          <div style={{ textAlign: "center", padding: "20px" }}>Loading entity data...</div>
        ) : (
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="entcr_id" hidden>
              <Input />
            </Form.Item>

            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item
                name="proposed_name"
                label="Proposed Name"
                style={{ flex: 1 }}
                rules={[{ required: true, message: "Please enter proposed name" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="proposed_date"
                label="Proposed Date"
                style={{ flex: 1 }}
                rules={[{ required: true, message: "Please select date" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item name="proposed_by" label="Proposed By" style={{ flex: 1 }}>
                <Select>
                  <Select.Option value="FACULTY">FACULTY</Select.Option>
                  <Select.Option value="STUDENT">STUDENT</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="proposer_name" label="Proposer Name" style={{ flex: 1 }}>
                <Input />
              </Form.Item>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item name="emp_code" label="Employee Code" style={{ flex: 1 }}>
                <Input />
              </Form.Item>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item name="mobile" label="Mobile" style={{ flex: 1 }}>
                <Input />
              </Form.Item>

              <Form.Item name="entity_nature" label="Entity Nature" style={{ flex: 1 }}>
                <Select>
                  <Select.Option value="Domain specific (field based)">Domain specific (field based)</Select.Option>
                  <Select.Option value="Hackathon & challenge">Hackathon & challenge</Select.Option>
                  <Select.Option value="Social value & outreach">Social value & outreach</Select.Option>
                  <Select.Option value="Innovation & incubation">Innovation & incubation</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item name="status" label="Status" style={{ flex: 1 }}>
                <Select>
                  <Select.Option value="Pending">Pending</Select.Option>
                  <Select.Option value="Approved">Approved</Select.Option>
                  <Select.Option value="Interview Scheduled">Interview Scheduled</Select.Option>
                  <Select.Option value="Rejected">Rejected</Select.Option>
                  <Select.Option value="Request Hold">Request Hold</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="session" label="Session" style={{ flex: 1 }}>
                <Input />
              </Form.Item>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item name="entity_id" label="Entity Name" style={{ flex: 1 }}>
                <Select>
                  {entityTypes.map((entity) => (
                    <Select.Option key={entity.entity_id} value={entity.entity_id}>
                      {entity.entity_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="department" label="Department Name" style={{ flex: 1 }}>
                <Select>
                  {departments.map((dept) => (
                    <Select.Option key={dept.department} value={dept.department}>
                      {dept.dept_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <h3>Student Section 1</h3>
            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item name="student_sec_1_name" label="Name" style={{ flex: 1 }}>
                <Input />
              </Form.Item>

              <Form.Item name="student_sec_1_email" label="Email" style={{ flex: 1 }}>
                <Input />
              </Form.Item>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item name="student_sec_1_uid" label="UID" style={{ flex: 1 }}>
                <Input />
              </Form.Item>

              <Form.Item name="student_sec_1_mobile" label="Mobile" style={{ flex: 1 }}>
                <Input />
              </Form.Item>
            </div>

            <h3>Student Section 2</h3>
            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item name="student_sec_2_name" label="Name" style={{ flex: 1 }}>
                <Input />
              </Form.Item>

              <Form.Item name="student_sec_2_email" label="Email" style={{ flex: 1 }}>
                <Input />
              </Form.Item>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item name="student_sec_2_uid" label="UID" style={{ flex: 1 }}>
                <Input />
              </Form.Item>

              <Form.Item name="student_sec_2_mobile" label="Mobile" style={{ flex: 1 }}>
                <Input />
              </Form.Item>
            </div>

            <h3>Faculty Advisor 1</h3>
            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item name="faculty_adv_1_name" label="Name" style={{ flex: 1 }}>
                <Input />
              </Form.Item>

              <Form.Item name="faculty_adv_1_email" label="Email" style={{ flex: 1 }}>
                <Input />
              </Form.Item>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item name="faculty_adv_1_empcode" label="Emp Code" style={{ flex: 1 }}>
                <Input />
              </Form.Item>

              <Form.Item name="faculty_adv_1_mobile" label="Mobile" style={{ flex: 1 }}>
                <Input />
              </Form.Item>
            </div>

            <h3>Faculty Co-Advisor 1</h3>
            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item name="faculty_coadv_1_name" label="Name" style={{ flex: 1 }}>
                <Input />
              </Form.Item>

              <Form.Item name="faculty_coadv_1_email" label="Email" style={{ flex: 1 }}>
                <Input />
              </Form.Item>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <Form.Item name="faculty_coadv_1_empcode" label="Emp Code" style={{ flex: 1 }}>
                <Input />
              </Form.Item>

              <Form.Item name="faculty_coadv_1_mobile" label="Mobile" style={{ flex: 1 }}>
                <Input />
              </Form.Item>
            </div>

            <Form.Item name="entity_name" hidden>
              <Input />
            </Form.Item>

            <Form.Item name="department_name" hidden>
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Update Entity
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={onDrawerClose}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        )}
      </Drawer>
      <Drawer title="Send Mail" placement="right" onClose={onMailDrawerClose} visible={mailDrawerVisible} width={600}>
        <Form form={mailForm} layout="vertical" onFinish={onMailFinish}>
          <Form.Item label="Email Addresses">
            <TextArea
              value={textAreaValue}
              placeholder="Paste email addresses from Excel or type (domain @cuchd.in will be added automatically if missing)"
              onChange={handleEmailInputChange}
              onPaste={handlePaste}
              style={{
                background: "white",
                border: `1px solid ${isValid ? "#52c41a" : "#d9d9d9"}`,
                borderRadius: "2px",
                padding: "4px 11px",
                minHeight: "100px",
              }}
            />
          </Form.Item>
          <div
            style={{
              marginBottom: "10px",
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            {emails.map((email, index) => (
              <Tag
                key={index}
                closable
                onClose={() => removeEmail(email)}
                style={{
                  background: "#f0f0f0",
                  borderRadius: "16px",
                  padding: "4px 8px",
                  margin: "4px",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#389e0d" }}>{email}</span>
              </Tag>
            ))}
          </div>
          <div>Total emails: {emails.length}</div>

          <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="body" label="Body" rules={[{ required: true }]}>
            <ReactQuill theme="snow" />
          </Form.Item>
          <Form.Item
            style={{ display: "none" }}
            name="entity_request_id"
            label="Entity Request ID"
            rules={[{ required: true }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Send Mail
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <Modal
        title="Referral"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={600}
      >
        <div dangerouslySetInnerHTML={{ __html: editingEntity?.referal || "" }} />
      </Modal>
      <Drawer
        title="Entity Details"
        placement="right"
        onClose={onViewMoreDrawerClose}
        visible={viewMoreDrawerVisible}
        width={600}
      >
        {viewMoreDrawerVisible && (
          <div className="drawer-overlay" onClick={onViewMoreDrawerClose}>
            <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
              <h2>Entity Details</h2>
              <table className="entity-details-table">
                <tbody>
                  {renderSection("Entity Information", [
                    ["Proposed Name", "proposed_name"],
                    ["Proposed Date", "proposed_date"],
                    ["Proposed By", "proposed_by"],
                    ["Proposer Name", "proposer_name"],
                    ["Entity Nature", "entity_nature"],
                    ["Status", "status"],
                    ["Entity Name", "entity_name"],
                    ["Department", "department_name"],
                  ])}

                  {renderSection("Student Section 1", [
                    ["Name", "student_sec_1_name"],
                    ["Email", "student_sec_1_email"],
                    ["UID", "student_sec_1_uid"],
                    ["Mobile", "student_sec_1_mobile"],
                  ])}

                  {renderSection("Student Section 2", [
                    ["Name", "student_sec_2_name"],
                    ["Email", "student_sec_2_email"],
                    ["UID", "student_sec_2_uid"],
                    ["Mobile", "student_sec_2_mobile"],
                  ])}

                  {renderSection("Student Advisor Section 1", [
                    ["Name", "student_advsec_1_name"],
                    ["Email", "student_advsec_1_email"],
                    ["UID", "student_advsec_1_uid"],
                    ["Mobile", "student_advsec_1_mobile"],
                  ])}

                  {renderSection("Student Advisor Section 2", [
                    ["Name", "student_advsec_2_name"],
                    ["Email", "student_advsec_2_email"],
                    ["UID", "student_advsec_2_uid"],
                    ["Mobile", "student_advsec_2_mobile"],
                  ])}

                  {renderSection("Faculty Advisor 1", [
                    ["Name", "faculty_adv_1_name"],
                    ["Email", "faculty_adv_1_email"],
                    ["Emp Code", "faculty_adv_1_empcode"],
                    ["Mobile", "faculty_adv_1_mobile"],
                  ])}

                  {renderSection("Faculty Advisor 2", [
                    ["Name", "faculty_adv_2_name"],
                    ["Email", "faculty_adv_2_email"],
                    ["Emp Code", "faculty_adv_2_empcode"],
                    ["Mobile", "faculty_adv_2_mobile"],
                  ])}

                  {renderSection("Faculty Co-Advisor 1", [
                    ["Name", "faculty_coadv_1_name"],
                    ["Email", "faculty_coadv_1_email"],
                    ["Emp Code", "faculty_coadv_1_empcode"],
                    ["Mobile", "faculty_coadv_1_mobile"],
                  ])}

                  {renderSection("Faculty Co-Advisor 2", [
                    ["Name", "faculty_coadv_2_name"],
                    ["Email", "faculty_coadv_2_email"],
                    ["Emp Code", "faculty_coadv_2_empcode"],
                    ["Mobile", "faculty_coadv_2_mobile"],
                  ])}
                </tbody>
              </table>
              <button className="close-button" onClick={onViewMoreDrawerClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        title="Confirm Status Change"
        visible={statusModalVisible}
        onOk={handleStatusConfirm}
        onCancel={() => setStatusModalVisible(false)}
      >
        <p>Are you sure you want to change the status to {selectedStatus}?</p>
        <Form.Item label="Remark">
          <TextArea
            rows={4}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter your remark here"
          />
        </Form.Item>
      </Modal>
    </div>
  )
}

export default EntityTable

