import React from "react";
import backLogo from "src/assets/images/htc studio.png";
import banner from "src/assets/images/Pet_banner_png.png";
import "./BackdropSection.css";

const BackdropSection: React.FC = () => {
  return (
    <div className="backdrop-section-container animate-me">
      <img src={backLogo} alt="backdrop-logo" className="backdrop-logo" />

      <img src={banner} alt="backdrop-banner" className="backdrop-banner" />

      <div className="logo-under-ground" />

      <div className="logo-under-ground1" />
    </div>
  );
};

export default BackdropSection;
