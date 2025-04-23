import styles from "./ConfigPanel.module.css"

const ConfigPanel = ({ title, items }) => {
  return (
    <div className={styles.configPanel}>
      <h3 className={styles.panelTitle}>{title}</h3>
      <div className={styles.configItems}>
        {items.map((item, index) => (
          <div key={index} className={styles.configItem}>
            <span>{item}</span>
            <button className={styles.editButton}>Edit</button>
          </div>
        ))}
      </div>
      <button className={styles.addButton}>+ Add {title.slice(0, -1)}</button>
    </div>
  )
}

export default ConfigPanel
