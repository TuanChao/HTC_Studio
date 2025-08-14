import React from "react";
import banner from "src/assets/images/Char_male.png";

const AboutBanner: React.FC = () => {
  return (
    <div className="about-banner-container">
      <div className="under-logo">HTC STUDIO</div>

      <div className="about-name">
        HTC <br />
        STUDIO
      </div>

      <img className="image-banner-about" src={banner} alt="banner" />
    </div>
  );
};

export default AboutBanner;
