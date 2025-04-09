"use client"

import { useState, useEffect } from "react"
import ImageDrawer from "./ImageDrawer"
import "./UpdatedCarousel.css"

const UpdatedCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const openDrawer = (image) => {
    setSelectedImage(image)
    setDrawerVisible(true)
  }

  const closeDrawer = () => {
    setDrawerVisible(false)
  }

  return (
    <div className="carousel-container-drawer">
      <div className="carousel-header-drawer">
        <h4>{images[currentIndex].title}</h4>
      </div>
      <div className="carousel-drawer">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-item-drawer ${index === currentIndex ? "active" : ""}`}
            onClick={() => openDrawer(image)}
          >
            <div className="image-wrapper-drawer">
              <img src={image.src || "/placeholder.svg"} alt={image.alt} />
              <div className="carousel-overlay-drawer">
                <span className="image-type-drawer">{image.type}</span>
                <h2 className="image-title-drawer">{image.title}</h2>
                <div className="view-details-drawer">Click to view details</div>
              </div>
            </div>
          </div>
        ))}
        <button onClick={prevSlide} className="carousel-button-drawer prev-drawer">
          ❮
        </button>
        <button onClick={nextSlide} className="carousel-button-drawer next-drawer">
          ❯
        </button>
        <div className="carousel-indicators-drawer">
          {images.map((_, index) => (
            <span
              key={index}
              className={`indicator-drawer ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>

      <ImageDrawer visible={drawerVisible} onClose={closeDrawer} image={selectedImage || {}} content={null} />
    </div>
  )
}

export default UpdatedCarousel

