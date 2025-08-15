import React from "react";
import "./RoadMapSection.css";

const RoadMapSection: React.FC = () => {
  return (
    <div className="roadmap-section">
      <h1 className="main-title">
        Road
        <br />
        Map
      </h1>
      <p className="sub-title">
        Connect with us, and we will help you choose an artist that matches your style at a reasonable price
        <br />
        We will not provide warranties or take responsibility for products you purchase directly from the artist
        <br />
        Committed to meeting deadlines and taking responsibility for the product you purchase
      </p>
    </div>
  );
};

export default RoadMapSection;
