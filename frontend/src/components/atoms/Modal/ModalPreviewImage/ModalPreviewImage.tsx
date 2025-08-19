import React, { useState, useRef, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { ImageList } from "src/components/pages/Gallery/Gallery.type";
import "./ModalPreviewImage.css";
import { isVideo } from "src/utilities/commons/utils";

type Props = { images: ImageList[]; initialIndex: number };

const ModalPreviewImage: React.FC<Props> = ({ images, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [listLoaded, setListLoaded] = useState<number[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const getImageUrl = (picture: string) => {
    if (!picture) return '/placeholder-image.jpg';
    if (picture.startsWith('http')) return picture;
    return `http://localhost:5000${picture}`;
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      if (videoRef.current && listLoaded.includes(currentIndex)) {
        videoRef.current.play();
      }
    });
  }, [currentIndex, listLoaded]);

  const handleSelect = (selectedIndex: number) => {
    requestAnimationFrame(() => {
      if (isVideo(images[currentIndex].picture) && videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    });
    setCurrentIndex(selectedIndex);
  };

  const getDotsToShow = () => {
    const totalDots = images.length;
    const dotsToShow = 5;
    const half = Math.floor(dotsToShow / 2);

    if (totalDots <= dotsToShow) {
      return Array.from({ length: totalDots }, (_, i) => i);
    }

    if (currentIndex <= half) {
      return Array.from({ length: dotsToShow }, (_, i) => i);
    }

    if (currentIndex >= totalDots - half - 1) {
      return Array.from({ length: dotsToShow }, (_, i) => totalDots - dotsToShow + i);
    }

    return Array.from({ length: dotsToShow }, (_, i) => currentIndex - half + i);
  };

  const canGoNext = currentIndex < images.length - 1;
  const canGoPrev = currentIndex > 0;

  return (
    <div className="modal-preview-container">
      <Carousel
        activeIndex={currentIndex}
        onSelect={handleSelect}
        indicators={false}
        controls={false}
        fade={false}
        interval={null}
      >
        {images.map((image, index) => (
          <Carousel.Item key={index}>
            {isVideo(image.picture) ? (
              <video
                ref={(el) => {
                  if (index === currentIndex) videoRef.current = el;
                }}
                src={getImageUrl(image.picture)}
                className="video-preview"
                controls
                onLoadedData={() =>
                  setListLoaded((prev) => {
                    return prev.includes(index) ? prev : [...prev, index];
                  })
                }
              />
            ) : (
              <img 
                className="d-block w-100 image-preview" 
                src={getImageUrl(image.picture)} 
                alt={`img ${image.id}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-image.jpg';
                }}
              />
            )}
          </Carousel.Item>
        ))}
      </Carousel>

      <div className={`carousel-controls  ${!canGoPrev ? "first-item" : ""}`}>
        {canGoPrev && (
          <button className="carousel-btn prev-btn" onClick={() => handleSelect(currentIndex - 1)}>
            ❮
          </button>
        )}

        {canGoNext && (
          <button className="carousel-btn next-btn" onClick={() => handleSelect(currentIndex + 1)}>
            ❯
          </button>
        )}
      </div>

      <div className="carousel-index">
        <span>
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      <div className="carousel-dots">
        {getDotsToShow().map((index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index ? "active-dot" : ""}`}
            onClick={() => handleSelect(index)}
            style={currentIndex === index ? { animation: "scale-up 0.3s ease-in-out" } : undefined}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ModalPreviewImage;
