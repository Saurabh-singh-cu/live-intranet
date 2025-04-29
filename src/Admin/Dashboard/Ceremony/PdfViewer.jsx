"use client"
import styles from "./PdfViewer.module.css"

const PdfViewer = ({ pdfUrl, eventName, onClose }) => {
  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = `${eventName.replace(/\s+/g, "_")}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.viewer}>
        <div className={styles.header}>
          <h2>{eventName}</h2>
          <div className={styles.actions}>
            <button className={styles.downloadButton} onClick={handleDownload}>
              Download
            </button>
            <button className={styles.closeButton} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
        <div className={styles.pdfContainer}>
          <iframe src={`${pdfUrl}#toolbar=0`} title={`PDF Viewer - ${eventName}`} className={styles.pdfFrame} />
        </div>
      </div>
    </div>
  )
}

export default PdfViewer
