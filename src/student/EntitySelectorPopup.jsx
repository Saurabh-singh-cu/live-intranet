"use client"

import { useState, useEffect } from "react"
import { Modal, Radio, Button, message } from "antd"
import styles from "./EntitySelectorPopup.module.css"

const EntitySelectorPopup = ({ visible, onClose, onSelectEntity }) => {
  const [entities, setEntities] = useState([])
  const [selectedRegId, setSelectedRegId] = useState(null)

  useEffect(() => {
    // Get user data from localStorage when the popup is opened
    if (visible) {
      const getUserData = () => {
        try {
          const userData = localStorage.getItem("user")
          if (userData) {
            const parsedUserData = JSON.parse(userData)
            if (parsedUserData && parsedUserData.secretary_details && Array.isArray(parsedUserData.secretary_details)) {
              setEntities(parsedUserData.secretary_details)
            } else {
              console.error("secretary_details not found or not an array in user data")
              message.error("Could not find entity details")
            }
          } else {
            console.error("User data not found in localStorage")
            message.error("User data not found")
          }
        } catch (err) {
          console.error(`Failed to get user data: ${err.message}`)
          message.error("Error loading entity data")
        }
      }

      getUserData()
    }
  }, [visible])

  const handleOk = () => {
    if (!selectedRegId) {
      message.warning("Please select an entity first")
      return
    }

    onSelectEntity(selectedRegId)
    onClose()
  }

  const handleCancel = () => {
    setSelectedRegId(null)
    onClose()
  }

  const handleRadioChange = (e) => {
    setSelectedRegId(e.target.value)
  }

  return (
    <Modal
      title="Select Entity"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      className={styles.entityselectormodal}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk} disabled={!selectedRegId}>
          Confirm Selection
        </Button>,
      ]}
    >
      <div className={styles.entitylist}>
        {entities.length === 0 ? (
          <div className={styles.noentities}>No entities found</div>
        ) : (
          <Radio.Group onChange={handleRadioChange} value={selectedRegId}>
            {entities.map((entity) => (
              <Radio key={entity.reg_id} value={entity.reg_id} className={styles.entityradio}>
                <div className={styles.entityinfo}>
                  <div className={styles.entityname}>{entity.entity_name}</div>
                  <div className={styles.entitydetails}>
                    
                    <span>Department: {entity.department}</span>
                  </div>
                </div>
              </Radio>
            ))}
          </Radio.Group>
        )}
      </div>
    </Modal>
  )
}

export default EntitySelectorPopup

