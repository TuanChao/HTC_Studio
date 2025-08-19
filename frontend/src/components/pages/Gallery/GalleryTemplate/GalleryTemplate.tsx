import React, { useContext } from "react";
import ModalBase from "src/components/atoms/Modal";
import ModalPreviewImage from "src/components/atoms/Modal/ModalPreviewImage";
import { GalleryContext } from "../context";
import GalleryAction from "../GalleryOrganisms/GalleryAction";
import GalleryBanner from "../GalleryOrganisms/GalleryBanner";
import "./GalleryTemplate.css";

const GalleryTemplate: React.FC = () => {
  const { modalPreview, selectedIndex, onCloseModal } = useContext(GalleryContext);
  
  console.log('GalleryTemplate render - modalPreview:', modalPreview);

  const getImageUrl = (picture: string) => {
    if (!picture) return '/placeholder-image.jpg';
    if (picture.startsWith('http')) return picture;
    return `http://localhost:5000${picture}`;
  };

  const renderTitle = () => {
    const onClickArtist = () => window.open(modalPreview.detailArtist.linkX, "_blank", "noopener,noreferrer");

    return (
      <div className="artist-preview-container">
        <img 
          src={getImageUrl(modalPreview.detailArtist.avatar)} 
          alt={modalPreview.detailArtist.name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-image.jpg';
          }}
        />
        <div className="artist-preview-name">{modalPreview.detailArtist.name}</div>
        <div className="artist-dot">·</div>
        <div className="artist-view-tweet" onClick={() => onClickArtist()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-twitter-x"
            viewBox="0 0 16 16"
          >
            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="gallery-template">
      <GalleryBanner />

      <GalleryAction />

      <ModalBase
        isShow={modalPreview.isShow}
        size="xl"
        onClose={() => onCloseModal()}
        onBackdropClick={() => onCloseModal()}
        titleModal={renderTitle()}
      >
        <ModalPreviewImage images={modalPreview.imageList} initialIndex={selectedIndex} />
      </ModalBase>
    </div>
  );
};

export default GalleryTemplate;
