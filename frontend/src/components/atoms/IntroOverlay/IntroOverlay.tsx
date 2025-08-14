import React, { useState, useEffect } from "react";
import "./IntroOverlay.css";
import logo from "src/assets/images/HTC_logo_White_1.png";

const IntroOverlay: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 3500);

    return () => clearTimeout(timeout);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div className="logo-mask">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="logo-overlay"></div>
      <div className="logo-overlay1"></div>
    </>
  );
};

export default IntroOverlay;
