import React from "react"
import styles from "./ProposedCalendar.module.css"

const ProposedCalenderCart = ({ cart, onRemove }) => {
  return (
    <div className={styles.cartContainer}>
      <h3>Activities in Cart</h3>
      {cart.map((activity, index) => (
        <div key={index} className={styles.cartItem}>
          <span>{activity.name}</span>
          <span>₹{activity.proposedBudget}</span>
          <button onClick={() => onRemove(index)} className={styles.removeFromCartButton}>
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}

export default ProposedCalenderCart

