"use client"

import { useState, useEffect } from "react"
import styles from "./ProposedCalendar.module.css"
import apiClient from "../config/apiClient"
import Swal from "sweetalert2"
import ProposedCalendarTable from "./ProposedCalendarTable"

const FixedInfoBox = ({ activityCount, remainingBudget, budgetList }) => (
  <div className={styles.fixedInfoBox}>
    <h3>Summary</h3>
    <div className={styles.infoItem}>
      <span>Total Events:</span>
      <span>{activityCount}</span>
    </div>
    <div className={styles.infoItem}>
      <span>Your Current Sum:</span>
      <span className={remainingBudget < 0 ? styles.redClass : ""}>₹{budgetList[0]?.total_proposed}</span>
    </div>
  </div>
)

const ProposedCalendar = () => {
  const [activities, setActivities] = useState([
    {
      activity_type: "",
      event_name: "",
      start_date: "",
      end_date: "",
      proposed_budget: "",
      description: "",
      remarks: "",
      atd_id: "",
      nsf_id: "",
      sdg: "", // Single SDG ID instead of array
      part_count: "",
    },
  ])

  const [categories, setCategories] = useState([])
  const [budgetList, setBudgetList] = useState([])
  const [depId, setDepId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activityTypes, setActivityTypes] = useState([])
  const [regId, setRegId] = useState("")
  const [cart, setCart] = useState([])
  const [nsqfData, setNsqfData] = useState([])
  const [actedData, setActedData] = useState([])
  const [sdgData, setSdgData] = useState([])
  // Store user's previously selected SDGs
  // const [userSdgIds, setUserSdgIds] = useState([])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const userData = JSON.parse(localStorage.getItem("user"))
        if (userData?.department_id) {
          setDepId(userData.department_id)
          await Promise.all([fetchBudget(userData.department_id), fetchCategories()])
          const userRegId = userData?.faculty_advisory_details[0]?.reg_id || userData?.reg_id
          setRegId(userRegId)
          if (userRegId) {
            await fetchSDGs(userRegId)
          }
        }
      } catch (error) {
        console.error("Error loading data", error)
      } finally {
        setLoading(false)
      }
    }
    getNsqf()
    getActed()
    loadData()
  }, [])

  const getNsqf = async () => {
    try {
      const response = await apiClient.get("all-nsqf/")
      setNsqfData(response.data || [])
      console.log("NSQF data:", response.data)
    } catch (error) {
      console.log("Error fetching NSQF data:", error)
    }
  }

  const getActed = async () => {
    try {
      const response = await apiClient.get("all-acted/")
      setActedData(response.data || [])
      console.log("ACTED data:", response.data)
    } catch (error) {
      console.log("Error fetching ACTED data:", error)
    }
  }

  const fetchSDGs = async (regId) => {
    try {
      setLoading(true)
      const response = await apiClient.get(`/get-entity-sdg/?reg_id=${regId}`)
      setSdgData(response.data?.sdgs || [])

      // Extract just the SDG IDs from the response and store them
      // const sdgIds = (response.data?.sdgs || []).map((sdg) => sdg.sdg_id.toString())
      // setUserSdgIds(sdgIds)

      console.log("SDG data:", response.data)
    } catch (error) {
      console.error("Error fetching SDG data:", error)
      Swal.fire("Error", "Failed to load SDG data.", "error")
    } finally {
      setLoading(false)
    }
  }

  const fetchBudget = async (departmentId) => {
    try {
      setLoading(true)
      const response = await apiClient.get(`get-budget-by-department/${departmentId}/`)

      setBudgetList(Array.isArray(response.data) ? response.data : [response.data])
    } catch (error) {
      console.log(error?.response?.data?.error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get(`entity-activities/`)
      setCategories(response.data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (index, event) => {
    const { name, value } = event.target
    const newActivities = [...activities]

    if (name === "category") {
      newActivities[index].act_id = value
    } else if (name === "description") {
      const wordCount = value.trim().split(/\s+/).length
      if (wordCount <= 200) {
        newActivities[index][name] = value
      } else {
        Swal.fire("Warning", "Description cannot exceed 200 words.", "warning")
      }
    } else if (name === "sdg_id") {
      newActivities[index][name] = value
    } else {
      newActivities[index][name] = value
    }

    setActivities(newActivities)
  }

  const fetchActivityTypes = async () => {
    try {
      const response = await apiClient.get("entity-activities/")
      setActivityTypes(response.data)
    } catch (error) {
      console.error("Error fetching activity types:", error)
      Swal.fire("Error", "Failed to load activity types.", "error")
    }
  }

  useEffect(() => {
    fetchActivityTypes()
  }, [])

  const addActivity = () => {
    setActivities([
      ...activities,
      {
        type: "",
        category: "",
        name: "",
        startDate: "",
        endDate: "",
        description: "",
        proposedBudget: "",
        act_id: "",
        atd_id: "",
        nsf_id: "",
        part_count: "",
        sdg: "",
      },
    ])
  }

  const removeActivity = (index) => {
    setActivities(activities.filter((_, i) => i !== index))
  }

  const calculateRemainingBudget = () => {
    const totalBudget = budgetList[0]?.total_budget || 0
    const totalProposed = cart.reduce((sum, activity) => sum + (Number.parseFloat(activity.proposedBudget) || 0), 0)
    return totalBudget - totalProposed
  }

  const handleAddToCart = () => {
    const lastActivity = activities[activities.length - 1]
    if (isActivityValid(lastActivity)) {
      setCart([...cart, lastActivity])
      setActivities([
        ...activities.slice(0, -1),
        {
          reg_id: regId,
          type: "",
          category: "",
          name: "",
          startDate: "",
          endDate: "",
          description: "",
          proposedBudget: "",
          act_id: "",
          atd_id: "",
          nsf_id: "",
          part_count: "",
          sdg: "",
        },
      ])
    } else {
      Swal.fire("Error", "Please fill all required fields before adding to cart.", "error")
    }
  }

  const isActivityValid = (activity) => {
    return (
      activity.type &&
      activity.act_id &&
      activity.name &&
      activity.startDate &&
      activity.endDate &&
      activity.proposedBudget &&
      activity.description &&
      activity.part_count // Changed from partCount
    )
  }

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (cart.length === 0) {
      Swal.fire("Error", "Your cart is empty. Please add activities before submitting.", "error")
      return
    }

    const validatedActivities = cart.map((activity) => ({
      reg_id: regId,
      activity_type: activity.type,
      act_id: activity.act_id,
      event_name: activity.name,
      start_date: activity.startDate,
      end_date: activity.endDate,
      proposed_budget: Number.parseFloat(activity.proposedBudget),
      description: activity.description,
      department: depId,
      atd_id: activity.acted_id || null,
      nsf_id: activity.nsqf_id || null,
      sdg: activity.sdg_id || null,
      part_count: activity.part_count || null, // Changed from activities.partCount
    }))

    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    const correctAnswer = num1 + num2

    const { value: userAnswer } = await Swal.fire({
      title: "Confirmation",
      text: `To confirm, solve this: ${num1} + ${num2} = ?`,
      input: "text",
      inputPlaceholder: "Enter your answer",
      showCancelButton: true,
      confirmButtonText: "Submit",
      preConfirm: (value) => {
        if (Number.parseInt(value) !== correctAnswer) {
          Swal.showValidationMessage("Incorrect answer. Try again!")
        }
      },
    })

    if (!userAnswer) return

    try {
      const response = await apiClient.post(`create-proposed-calendar/?reg_id=${regId}`, validatedActivities)

      if (response.status === 201) {
        Swal.fire("Success", "Proposed calendar submitted successfully!", "success")
        setActivities([
          {
            regId: regId,
            type: "",
            name: "",
            startDate: "",
            endDate: "",
            proposedBudget: "",
            description: "",
            remarks: "",
            category: "",
            act_id: null,
            atd_id: "",
            nsf_id: "",
            sdg: "",
            part_count: "",
          },
        ])
        setCart([])
        fetchBudget(depId)
      } else {
        throw new Error("Failed to submit.")
      }
    } catch (error) {
      Swal.fire("Error", error?.response?.data?.errors[0]?.error)
      console.log(error, "EEEEEEEEEEEEEEEEEEEEEEE")
    }
  }

  const getSDGName = (sdgId) => {
    if (!sdgId) return ""
    const sdg = sdgData.find((s) => s.sdg_id === Number.parseInt(sdgId))
    return sdg ? sdg.name : ""
  }

  const getActedName = (actedId) => {
    const acted = actedData.find((a) => a.atd_id === Number.parseInt(actedId))
    return acted ? acted.atd_fullform : ""
  }

  const getNsqfName = (nsqfId) => {
    const nsqf = nsqfData.find((n) => n.nsf_id === Number.parseInt(nsqfId))
    return nsqf ? nsqf.nsf_name : ""
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>Proposed Calendar</h1>

        <div className={styles.budgetInfo}>
          <div className={styles.budgetItem}>
            <span>Total Budget:</span>
            <span className={styles.budgetValue}>₹{budgetList[0]?.total_budget || "Not Found"}</span>
          </div>
          <div className={styles.budgetItem}>
            <span>Remaining Budget:</span>
            <span className={styles.budgetValue}>
              ₹{budgetList[0]?.total_budget - budgetList[0]?.total_proposed || "Not Found"}
            </span>
          </div>
        </div>

        <div className={styles.warningMessage}>
          Warning: After making a final submit, you will not be allowed to add more activities.
        </div>
        <h2 className={styles.activityTitle}>New Events</h2>
        <form className={styles.formScroller} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.activityForm}>
            <div className={styles.formGroup}>
              <label>Type of Activity:</label>
              <select
                name="type"
                value={activities[activities.length - 1].type}
                onChange={(e) => handleInputChange(activities.length - 1, e)}
                required
                className={styles.selectField}
              >
                <option value="">Select Type</option>
                <option value="Flagship">Flagship</option>
                <option value="Monthly">Monthly</option>
                <option value="Regular">Regular</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Activity Category:</label>
              <select
                name="category"
                value={activities[activities.length - 1].act_id || ""}
                onChange={(e) => handleInputChange(activities.length - 1, e)}
                required
                className={styles.selectField}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.act_id} value={category.act_id}>
                    {category.activity_name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>ACTED:</label>
              <select
                name="acted_id"
                value={activities[activities.length - 1].acted_id || ""}
                onChange={(e) => handleInputChange(activities.length - 1, e)}
                className={styles.selectField}
              >
                <option value="">Select ACTED</option>
                {actedData.map((acted) => (
                  <option key={acted.atd_id} value={acted.atd_id}>
                    {acted.atd_fullform}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>NSQF:</label>
              <select
                name="nsqf_id"
                value={activities[activities.length - 1].nsqf_id || ""}
                onChange={(e) => handleInputChange(activities.length - 1, e)}
                className={styles.selectField}
              >
                <option value="">Select NSQF</option>
                {nsqfData.map((nsqf) => (
                  <option key={nsqf.nsf_id} value={nsqf.nsf_id}>
                    {nsqf.nsf_name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>SDG:</label>
              <select
                name="sdg_id"
                value={activities[activities.length - 1].sdg_id || ""}
                onChange={(e) => handleInputChange(activities.length - 1, e)}
                className={styles.selectField}
              >
                <option value="">Select SDG</option>
                {sdgData.map((sdg) => (
                  <option key={sdg.sdg_id} value={sdg.sdg_id}>
                    {sdg.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Proposed Budget:</label>
              <input
                type="number"
                name="proposedBudget"
                placeholder="Enter Budget"
                value={activities[activities.length - 1].proposedBudget}
                onChange={(e) => handleInputChange(activities.length - 1, e)}
                min="0"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Participent Count:</label>
              <input
                type="number"
                name="part_count"
                placeholder="Enter Participant count"
                value={activities[activities.length - 1].part_count}
                onChange={(e) => handleInputChange(activities.length - 1, e)}
                min="0"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Event Name:</label>
              <input
                placeholder="Enter event name"
                type="text"
                name="name"
                value={activities[activities.length - 1].name}
                onChange={(e) => handleInputChange(activities.length - 1, e)}
                required
              />
            </div>

            <div className={styles.dateGroup}>
              <div className={styles.formGroup}>
                <label>Start Date:</label>
                <input
                  type="date"
                  name="startDate"
                  min={new Date().toISOString().split("T")[0]}
                  value={activities[activities.length - 1].startDate}
                  onChange={(e) => handleInputChange(activities.length - 1, e)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>End Date:</label>
                <input
                  type="date"
                  name="endDate"
                  min={activities[activities.length - 1].startDate || new Date().toISOString().split("T")[0]}
                  value={activities[activities.length - 1].endDate}
                  onChange={(e) => handleInputChange(activities.length - 1, e)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Description:</label>
              <textarea
                placeholder="Give a brief description. (Max 200 words)"
                name="description"
                value={activities[activities.length - 1].description}
                onChange={(e) => handleInputChange(activities.length - 1, e)}
                required
              />
              <p style={{ fontSize: "12px", color: "grey", float: "right" }}>
                {activities[activities.length - 1].description.trim().split(/\s+/).length} / 200
              </p>
            </div>

            <div className={styles.buttonGroup}>
              <button type="button" className={styles.addToCartButton} onClick={handleAddToCart}>
                Add to List
              </button>
            </div>
          </div>
        </form>

        <div className={styles.tableContainer}>
          <h3>Activities Overview</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.activitiesTable}>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Type</th>
                  <th>Budget</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>SDGs</th>
                  <th>ACTED</th>
                  <th>NSQF</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((activity, index) => (
                  <tr key={index}>
                    <td data-label="Event Name">{activity.name}</td>
                    <td data-label="Type">{activity.type}</td>
                    <td data-label="Budget">₹{activity.proposedBudget}</td>
                    <td data-label="Start Date">{activity.startDate}</td>
                    <td data-label="End Date">{activity.endDate}</td>
                    <td data-label="SDGs">{getSDGName(activity.sdg_id)}</td>
                    <td data-label="ACTED">{getActedName(activity.acted_id)}</td>
                    <td data-label="NSQF">{getNsqfName(activity.nsqf_id)}</td>
                    <td data-label="Actions">
                      <button onClick={() => removeFromCart(index)} className={styles.removeButton}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {cart.length === 0 && (
              <div className={styles.emptyTable}>No activities added yet. Add some activities to see them here.</div>
            )}
          </div>
        </div>

        <div className={styles.calendetTable}>
          <ProposedCalendarTable />
        </div>
      </div>

      <div className={styles.infoBox}>
        <FixedInfoBox
          activityCount={cart.length}
          remainingBudget={calculateRemainingBudget()}
          budgetList={budgetList}
        />
        <div className={styles.cartContainer}>
          <h3>Events Added</h3>
          {cart.map((activity, index) => (
            <div key={index} className={styles.cartItem}>
              <div className={styles.cartItemDetails}>
                <span className={styles.cartItemName}>{activity.name}</span>
                <div className={styles.cartItemTags}>
                  {activity.acted_id && (
                    <span className={styles.tagItem}>ACTED: {getActedName(activity.acted_id)}</span>
                  )}
                  {activity.nsqf_id && <span className={styles.tagItem}>NSQF: {getNsqfName(activity.nsqf_id)}</span>}
                  {activity.sdg_id && <span className={styles.tagItem}>SDG: {getSDGName(activity.sdg_id)}</span>}
                </div>
              </div>
              <div className={styles.cartItemActions}>
                <span className={styles.cartItemBudget}>₹{activity.proposedBudget}</span>
                <button onClick={() => removeFromCart(index)} className={styles.removeFromCartButton}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button type="button" className={styles.submitButton} onClick={handleSubmit} disabled={cart.length === 0}>
            Submit All Events
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProposedCalendar
