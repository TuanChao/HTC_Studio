import React, { useContext } from "react";
import { isVideo } from "src/utilities/commons/utils";
import { GalleryContext } from "../../context";
import "./GalleryList.css";

const GalleryList: React.FC = () => {
  const { images, onSelectGallery } = useContext(GalleryContext);

  return (
    <div className="gallery-container">
      <div className="gallery-flex">
        {images.map((image) => (
          <div key={image.id} className="gallery-item" onClick={() => onSelectGallery(image.id.toString())}>
            {isVideo(image.picture) ? (
              <video src={image.picture} className="video-thumbnail" muted />
            ) : (
              <img src={image.picture} alt={`img ${image.id}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryList;
