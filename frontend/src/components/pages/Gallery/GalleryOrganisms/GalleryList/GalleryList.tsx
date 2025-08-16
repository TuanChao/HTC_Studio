import React, { useContext } from "react";
import { isVideo } from "src/utilities/commons/utils";
import { GalleryContext } from "../../context";
import "./GalleryList.css";

const GalleryList: React.FC = () => {
  const { images, onSelectGallery } = useContext(GalleryContext);

  const getImageUrl = (picture: string) => {
    if (!picture) return '/placeholder-image.jpg';
    if (picture.startsWith('http')) return picture;
    return `http://localhost:5000${picture}`;
  };

  return (
    <div className="gallery-container">
      <div className="gallery-flex">
        {images.map((image) => (
          <div key={image.id} className="gallery-item" onClick={() => onSelectGallery(image.id.toString())}>
            {isVideo(image.picture) ? (
              <video src={getImageUrl(image.picture)} className="video-thumbnail" muted />
            ) : (
              <img 
                src={getImageUrl(image.picture)} 
                alt={`img ${image.id}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-image.jpg';
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryList;
