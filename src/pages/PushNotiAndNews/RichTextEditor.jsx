"use client"

import { useState, useRef, useEffect } from "react"
import styles from "./RichTextEditor.module.css"
import { Bold, Italic, Underline, Link, Type, AlignLeft, AlignCenter, AlignRight } from "lucide-react"

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [selection, setSelection] = useState(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [currentColor, setCurrentColor] = useState("#000000")

  // Colors for the color picker
  const colors = [
    "#000000",
    "#5E5E5E",
    "#1A73E8",
    "#D93025",
    "#188038",
    "#F9AB00",
    "#9C27B0",
    "#EA4335",
    "#34A853",
    "#FBBC04",
  ]

  useEffect(() => {
    // Initialize editor content
    if (editorRef.current) {
      editorRef.current.innerHTML = value
    }
  }, [])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const saveSelection = () => {
    if (window.getSelection) {
      const sel = window.getSelection()
      if (sel.getRangeAt && sel.rangeCount) {
        setSelection(sel.getRangeAt(0))
      }
    }
  }

  const restoreSelection = () => {
    if (selection && window.getSelection) {
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(selection)
    }
  }

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    handleInput()
    editorRef.current.focus()
  }

  const handleBold = () => {
    execCommand("bold")
  }

  const handleItalic = () => {
    execCommand("italic")
  }

  const handleUnderline = () => {
    execCommand("underline")
  }

  const handleAlignment = (align) => {
    execCommand("justify" + align)
  }

  const handleLinkClick = () => {
    saveSelection()

    // Get selected text
    if (window.getSelection) {
      const sel = window.getSelection()
      if (sel.toString().length > 0) {
        setLinkText(sel.toString())
      } else {
        setLinkText("")
      }
    }

    setShowLinkInput(true)
  }

  const insertLink = () => {
    if (linkUrl) {
      restoreSelection()

      // If there's selected text, use it as link text
      if (linkText) {
        // Create a link with the selected text
        execCommand("insertHTML", `<a href="${linkUrl}" target="_blank">${linkText}</a>`)
      } else {
        // Just insert the URL as a link
        execCommand("createLink", linkUrl)
      }

      setShowLinkInput(false)
      setLinkUrl("")
      setLinkText("")
    }
  }

  const handleColorClick = () => {
    saveSelection()
    setShowColorPicker(!showColorPicker)
  }

  const applyColor = (color) => {
    setCurrentColor(color)
    restoreSelection()
    execCommand("foreColor", color)
    setShowColorPicker(false)
  }

  return (
    <div className={styles.editorContainer}>
      <div className={styles.toolbar}>
        <button type="button" onClick={handleBold} className={styles.toolbarButton} title="Bold">
          <Bold size={16} />
        </button>
        <button type="button" onClick={handleItalic} className={styles.toolbarButton} title="Italic">
          <Italic size={16} />
        </button>
        <button type="button" onClick={handleUnderline} className={styles.toolbarButton} title="Underline">
          <Underline size={16} />
        </button>
        <div className={styles.divider}></div>
        <button
          type="button"
          onClick={() => handleAlignment("Left")}
          className={styles.toolbarButton}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleAlignment("Center")}
          className={styles.toolbarButton}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleAlignment("Right")}
          className={styles.toolbarButton}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
        <div className={styles.divider}></div>
        <div className={styles.colorPickerContainer}>
          <button type="button" onClick={handleColorClick} className={styles.toolbarButton} title="Text Color">
            <Type size={16} />
            <span className={styles.colorIndicator} style={{ backgroundColor: currentColor }}></span>
          </button>
          {showColorPicker && (
            <div className={styles.colorPicker}>
              {colors.map((color) => (
                <div
                  key={color}
                  className={styles.colorOption}
                  style={{ backgroundColor: color }}
                  onClick={() => applyColor(color)}
                ></div>
              ))}
            </div>
          )}
        </div>
        <button type="button" onClick={handleLinkClick} className={styles.toolbarButton} title="Insert Link">
          <Link size={16} />
        </button>
      </div>

      {showLinkInput && (
        <div className={styles.linkInputContainer}>
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Enter URL (https://...)"
            className={styles.linkInput}
          />
          <button onClick={insertLink} className={styles.linkButton}>
            Insert
          </button>
          <button onClick={() => setShowLinkInput(false)} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      )}

      <div
        ref={editorRef}
        className={styles.editor}
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
      ></div>
    </div>
  )
}

export default RichTextEditor
