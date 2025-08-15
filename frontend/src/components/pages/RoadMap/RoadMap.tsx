import React from "react";
import "./RoadMap.css"
import { RoadMapContextProvider } from "./context";
import RoadmapTemplate from "./RoadMapTemplate";

const RoadMapPage: React.FC = () => {
  return (
    <RoadMapContextProvider value={{ loading: false, scrollPosition: 0 }}>
      <div className="roadmap-page">
        <RoadmapTemplate />
      </div>
    </RoadMapContextProvider>
  );
};

export default RoadMapPage;
