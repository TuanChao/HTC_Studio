import React from "react";
import banner from "src/assets/images/Banner_2.jpg";
import "./RoadMapBanner.css";

type Props = {
  img?: string;
  scrollPosition?: number;
  verticalSubText?: string | React.ReactNode;
  verticalMainText?: string | React.ReactNode;
  horizontalSubText?: string | React.ReactNode;
  isShowVerticalText?: boolean;
  horizontalMainText?: string | React.ReactNode;
  isShowHorizontalText?: boolean;
};

const RoadMapBanner: React.FC<Props> = ({
  img,
  scrollPosition = 0,
  verticalSubText,
  verticalMainText,
  horizontalSubText,
  horizontalMainText,
  isShowVerticalText,
  isShowHorizontalText,
}) => {
  return (
    <div className="banner-container animate-me">
      <img src={img ?? banner} alt="banner" className="home-banner" />

      {isShowHorizontalText && (
        <div
          className="banner-modal"
          style={{
            transform: `translateY(${scrollPosition * 0.2}px)`,
            opacity: Math.max(1 - scrollPosition / 300, 0),
          }}
        >
          <div className="content-left-top">{horizontalMainText}</div>
          <p className="content-description">{horizontalSubText}</p>
        </div>
      )}

      {isShowVerticalText && (
        <div
          className="vertical-text-container"
          style={{
            transform: `translateY(${scrollPosition * 0.2}px) rotate(180deg)`,
            opacity: Math.max(1 - scrollPosition / 300, 0),
          }}
        >
          <h1 className="vertical-title">{verticalMainText}</h1>
          <p className="vertical-description">{verticalSubText}</p>
        </div>
      )}

      <div className="fade-overlay" style={{ height: `${scrollPosition}px` }} />
    </div>
  );
};

export default RoadMapBanner;
