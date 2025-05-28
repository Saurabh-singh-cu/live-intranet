import React, { useEffect, useState } from "react";
import styles from "./AddBudget.module.css";
import Swal from "sweetalert2";
import apiClient from "../config/apiClient";
import CoordTable from "./CoordTable";
import LoadingComponent from "../loader/LoadingComponent";

const AddBudget = () => {
  const [depId, setDepId] = useState(null);
  const [budget, setBudget] = useState("");
  const [budgetInWords, setBudgetInWords] = useState("");
  const [loading, setLoading] = useState(false);
  const [budgetList, setBudgetList] = useState([]);
  const [depName, setDepName] = useState("");

  useEffect(() => {
    const getDepId = JSON.parse(localStorage?.getItem("user"));
    if (getDepId?.department_id) {
      setDepId(getDepId.department_id);
      getBudget(getDepId.department_id);
      setDepName(getDepId?.department);
    }
  }, []);

  const getBudget = async (departmentId) => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `get-budget-by-department/${departmentId}/`
      );
      console.log(response?.data, "TABLE");

      // Ensure budgetList is always an array
      const data = response.data;
      setBudgetList(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error fetching budget:", error);
      // Swal.fire("Error", "Failed to load budget data", "error");
    } finally {
      setLoading(false);
    }
  };

  const convertToWords = (num) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const convertLessThanOneThousand = (n) => {
      if (n >= 100) {
        return (
          ones[Math.floor(n / 100)] +
          " Hundred " +
          convertLessThanOneThousand(n % 100)
        );
      }
      if (n >= 20) {
        return (
          tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "")
        );
      }
      if (n >= 10) {
        return teens[n - 10];
      }
      return ones[n];
    };

    if (num === 0) return "Zero";

    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const remainder = num % 1000;

    let result = "";

    if (crore > 0) {
      result += convertLessThanOneThousand(crore) + " Crore ";
    }
    if (lakh > 0) {
      result += convertLessThanOneThousand(lakh) + " Lakh ";
    }
    if (thousand > 0) {
      result += convertLessThanOneThousand(thousand) + " Thousand ";
    }
    if (remainder > 0) {
      result += convertLessThanOneThousand(remainder);
    }

    return result.trim();
  };

  const handleBudgetChange = (e) => {
    const value = e.target.value;
    setBudget(value);
    if (value && !isNaN(value)) {
      setBudgetInWords(convertToWords(Number.parseInt(value)) + " Rupees");
    } else {
      setBudgetInWords("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!budget || isNaN(budget)) {
      Swal.fire("Error", "Please enter a valid budget amount", "error");
      return;
    }

    // Generate random numbers for math validation
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const correctAnswer = num1 + num2;

    const { value: userAnswer } = await Swal.fire({
      title: "Budget Confirmation",
      text: `To confirm, solve this: ${num1} + ${num2} = ?`,
      input: "number",
      inputPlaceholder: "Enter sum",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value || isNaN(value)) {
          return "Please enter a number";
        }
      },
    });

    if (parseInt(userAnswer) !== correctAnswer) {
      Swal.fire("Error", "Incorrect answer. Please try again.", "error");
      return;
    }

    try {
      const response = await apiClient.post("create-budget/", {
        department_id: depId,
        total_budget: Number.parseInt(budget),
      });

      if (response?.status === 201) {
        Swal.fire("Success", "Budget added successfully", "success");
        setBudget("");
        setBudgetInWords("");
        getBudget(depId);
      } else {
        throw new Error("Failed to add budget");
      }
    } catch (error) {
      console.error("Error adding budget:", error);
      Swal.fire(
        "Error",
        error?.response?.data?.error || "Failed to add budget"
      );
    }
  };

  return (
   <>
   {loading ? (<LoadingComponent />) : <> <div className={styles.fixeHeight}>
      <div className={styles.container}>
        <h2 className={styles.title}>Budget Management for {depName}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="number"
              value={budget}
              onChange={handleBudgetChange}
              required
              className={styles.input}
              placeholder="Enter budget amount e.g. 45000/-"
            />
            <button type="submit" className={styles.submitButton}>
              Add Budget
            </button>
          </div>
          {budgetInWords && (
            <div className={styles.budgetInWords}>{budgetInWords}</div>
          )}
        </form>
        {loading ? (
         <LoadingComponent />
        ) : budgetList.length > 0 ? (
          <div className={styles.cardContainer}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Department Info</h3>
              </div>
              <div className={styles.cardBody}>
                <p>
                  <strong>Department:</strong> {depName}
                </p>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Total Budget</h3>
              </div>
              <div className={styles.cardBody}>
                <p>
                  <strong>Amount:</strong> ₹
                  {budgetList[0].total_budget.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Proposed Budget</h3>
              </div>
              <div className={styles.cardBody}>
                <p>
                  <strong>Amount:</strong>{" "}
                  {budgetList[0].total_proposed
                    ? `₹${budgetList[0].total_proposed.toLocaleString("en-IN")}`
                    : "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {budgetList[0].total_proposed ? "Proposed" : "Not Proposed"}
                </p>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Actual Budget</h3>
              </div>
              <div className={styles.cardBody}>
                <p>
                  <strong>Amount:</strong>{" "}
                  {budgetList[0].actual_budget
                    ? `₹${budgetList[0].actual_budget.toLocaleString("en-IN")}`
                    : "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {budgetList[0].actual_budget
                    ? "Approved"
                    : "Pending Approval"}
                </p>
              </div>
            </div>
            <div>
              <CoordTable />
            </div>
          </div>
        ) : null}
        <p className={styles.warningMessage}>
          <strong>⚠ Important Message:</strong> Once the budget is submitted, it{" "}
          <u>cannot be reverted or modified</u>. Please ensure that the entered
          amount is accurate before proceeding. For security purposes, you will
          be required to solve a simple mathematical question to confirm your
          submission. This extra step ensures that the submission is intentional
          and avoids accidental entries.
        </p>
      </div>
    </div></>}
   </> 
  );
};

export default AddBudget;
