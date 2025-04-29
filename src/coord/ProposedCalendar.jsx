import React, { useState, useEffect } from "react";
import styles from "./ProposedCalendar.module.css";
import apiClient from "../config/apiClient";
import Swal from "sweetalert2";
import ProposedCalendarTable from "./ProposedCalendarTable";

const FixedInfoBox = ({ activityCount, remainingBudget, budgetList }) => (
  <div className={styles.fixedInfoBox}>
    <h3>Summary</h3>
    <div className={styles.infoItem}>
      <span>Total Events:</span>
      <span>{activityCount}</span>
    </div>
    <div className={styles.infoItem}>
      <span>Your Current Sum:</span>
      <span className={remainingBudget < 0 ? styles.redClass : ""}>
        ₹{budgetList[0]?.total_proposed}
      </span>
    </div>
  </div>
);

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
    },
  ]);

  const [categories, setCategories] = useState([]);
  const [budgetList, setBudgetList] = useState([]);
  const [depId, setDepId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activityTypes, setActivityTypes] = useState([]);
  const [regId, setRegId] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true); // Start loading
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData?.department_id) {
          setDepId(userData.department_id);
          await Promise.all([
            fetchBudget(userData.department_id),
            fetchCategories(),
          ]);
          setRegId(userData?.secretary_details?.reg_id);
        }
      } catch (error) {
        console.error("Error loading data", error);
      } finally {
        setLoading(false); // End loading
      }
    };
  
    loadData();
  }, []);
  

  const fetchBudget = async (departmentId) => {
    try {
      setLoading(true); // <-- set loading to true when fetch starts
      const response = await apiClient.get(
        `get-budget-by-department/${departmentId}/`
      );
  
      setBudgetList(
        Array.isArray(response.data) ? response.data : [response.data]
      );
    } catch (error) {
      console.log(error?.response?.data?.error);
    } finally {
      setLoading(false); // <-- set loading to false when fetch ends (whether success or fail)
    }
  };
  
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`entity-activities/`);
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newActivities = [...activities];

    if (name === "category") {
      newActivities[index].act_id = value;
    } else if (name === "description") {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount <= 200) {
        newActivities[index][name] = value;
      } else {
        Swal.fire("Warning", "Description cannot exceed 200 words.", "warning");
      }
    } else {
      newActivities[index][name] = value;
    }

    setActivities(newActivities);
  };

  const fetchActivityTypes = async () => {
    try {
      const response = await apiClient.get("entity-activities/");
      setActivityTypes(response.data);
    } catch (error) {
      console.error("Error fetching activity types:", error);
      Swal.fire("Error", "Failed to load activity types.", "error");
    }
  };

  useEffect(() => {
    fetchActivityTypes();
  }, []);

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
      },
    ]);
  };

  const removeActivity = (index) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const calculateRemainingBudget = () => {
    const totalBudget = budgetList[0]?.total_budget || 0;
    const totalProposed = cart.reduce(
      (sum, activity) =>
        sum + (Number.parseFloat(activity.proposedBudget) || 0),
      0
    );
    return totalBudget - totalProposed;
  };

  const handleAddToCart = () => {
    const lastActivity = activities[activities.length - 1];
    if (isActivityValid(lastActivity)) {
      setCart([...cart, lastActivity]);
      setActivities([
        ...activities.slice(0, -1),
        {
          type: "",
          category: "",
          name: "",
          startDate: "",
          endDate: "",
          description: "",
          proposedBudget: "",
          act_id: "",
        },
      ]);
    } else {
      Swal.fire(
        "Error",
        "Please fill all required fields before adding to cart.",
        "error"
      );
    }
  };

  const isActivityValid = (activity) => {
    return (
      activity.type &&
      activity.act_id &&
      activity.name &&
      activity.startDate &&
      activity.endDate &&
      activity.proposedBudget &&
      activity.description
    );
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      Swal.fire(
        "Error",
        "Your cart is empty. Please add activities before submitting.",
        "error"
      );
      return;
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
    }));

    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const correctAnswer = num1 + num2;

    const { value: userAnswer } = await Swal.fire({
      title: "Confirmation",
      text: `To confirm, solve this: ${num1} + ${num2} = ?`,
      input: "text",
      inputPlaceholder: "Enter your answer",
      showCancelButton: true,
      confirmButtonText: "Submit",
      preConfirm: (value) => {
        if (Number.parseInt(value) !== correctAnswer) {
          Swal.showValidationMessage("Incorrect answer. Try again!");
        }
      },
    });

    if (!userAnswer) return;

    try {
      const response = await apiClient.post(
        "create-proposed-calendar/",
        validatedActivities
      );

      if (response.status === 201) {
        Swal.fire(
          "Success",
          "Proposed calendar submitted successfully!",
          "success"
        );
        setActivities([
          {
            type: "",
            name: "",
            startDate: "",
            endDate: "",
            proposedBudget: "",
            description: "",
            remarks: "",
            category: "",
            act_id: null,
          },
        ]);
        setCart([]);
        fetchBudget(depId);
      } else {
        throw new Error("Failed to submit.");
      }
    } catch (error) {
      Swal.fire("Error", error?.response?.data?.errors[0]?.error);
      console.log(error, "EEEEEEEEEEEEEEEEEEEEEEE");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>Proposed Calendar</h1>

        <div className={styles.budgetInfo}>
          <div className={styles.budgetItem}>
            <span>Total Budget:</span>
            <span className={styles.budgetValue}>
              ₹{budgetList[0]?.total_budget || "Not Found"}
            </span>
          </div>
          <div className={styles.budgetItem}>
            <span>Remaining Budget:</span>
            <span className={styles.budgetValue}>
              ₹
              {budgetList[0]?.total_budget - budgetList[0]?.total_proposed ||
                "Not Found"}
            </span>
          </div>
        </div>

        <div className={styles.warningMessage}>
          Warning: After making a final submit, you will not be allowed to add
          more activities.
        </div>
        <h2 className={styles.activityTitle}>New Events</h2>
        <form
          className={styles.formScroller}
          onSubmit={(e) => e.preventDefault()}
        >
          <div className={styles.activityForm}>
            <div className={styles.formGroup}>
              <label>Type of Activity:</label>
              <select
                name="type"
                value={activities[activities.length - 1].type}
                onChange={(e) => handleInputChange(activities.length - 1, e)}
                required
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
                  min={
                    activities[activities.length - 1].startDate ||
                    new Date().toISOString().split("T")[0]
                  }
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
                {" "}
                {
                  activities[activities.length - 1].description
                    .trim()
                    .split(/\s+/).length
                }{" "}
                / 200
              </p>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.addToCartButton}
                onClick={handleAddToCart}
              >
                Add to List
              </button>
            </div>
          </div>
        </form>
        <div className={styles.calendetTable}>
          {" "}
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
              <div>
                {" "}
                <span>{activity.name}</span>
              </div>
              <div>
                <span style={{ display: "flex", justifyContent: "center" }}>
                  ₹{activity.proposedBudget}
                </span>
                <button
                  onClick={() => removeFromCart(index)}
                  className={styles.removeFromCartButton}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={cart.length === 0}
          >
            Submit All Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposedCalendar;
