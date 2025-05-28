import React, { useState, useEffect } from 'react';
import styles from './FilePreview.module.css';

const FilePreview = ({ file }) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      return;
    }

    // Create object URL for the file
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setLoading(false);

    // Clean up the URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.previewContainer}>
      <div className={styles.fileDetails}>
        <div className={styles.fileIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <div className={styles.fileInfo}>
          <h4 className={styles.fileName}>{file.name}</h4>
          <div className={styles.fileMetadata}>
            <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
            <span className={styles.fileDivider}>•</span>
            <span className={styles.fileDate}>Added {formatDate(new Date())}</span>
          </div>
        </div>
      </div>

      <div className={styles.pdfPreview}>
        {loading ? (
          <div className={styles.previewLoading}>
            <div className={styles.previewSpinner}></div>
            <p>Loading preview...</p>
          </div>
        ) : error ? (
          <div className={styles.previewError}>
            <p>Could not load PDF preview</p>
            <small>{error}</small>
          </div>
        ) : (
          <div className={styles.embedContainer}>
            <object
              data={previewUrl}
              type="application/pdf"
              width="100%"
              height="100%"
              className={styles.pdfObject}
            >
              <p>
                Your browser does not support PDF previews.
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadLink}>
                  Download the PDF
                </a>
              </p>
            </object>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePreview;