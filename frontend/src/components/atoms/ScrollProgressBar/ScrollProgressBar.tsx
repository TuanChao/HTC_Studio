import React, { useEffect, useState } from "react";
import "./ScrollProgressBar.css";
import logoBlack from "src/assets/images/HTC_logo_Black_1.png";

const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    setProgress(scrollPercentage);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div id="progress-container">
      <img src={logoBlack} alt="logo" className="logo-black" width={70} />

      <div id="progress-bar" style={{ height: `${progress}%` }}></div>
    </div>
  );
};

export default ScrollProgressBar;
