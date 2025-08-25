import React, { useContext } from "react";
import RoadMapSection from "../RoadMapOrganisms/RoadMapSection/RoadMapSection";
import { RoadMapContext } from "src/components/pages/RoadMap/context";
import homeBanner from "src/assets/images/Banner_1.jpg";
import RoadMapBanner from "../RoadMapOrganisms/RoadMapBanner/RoadMapBanner";
import RoadMapSlide from "../RoadMapSlide/RoadMapSlide";

const RoadMapTemplate: React.FC = () => {
  const { scrollPosition } = useContext(RoadMapContext);
  return (
    <>
      <RoadMapBanner
        img={homeBanner}
        scrollPosition={scrollPosition}
        isShowVerticalText={true}
        isShowHorizontalText={true}
        horizontalMainText={"Choose and fit"}
        horizontalSubText={"Choose the product you like and that fits with your style."}
        verticalMainText={"Welcome to HTC studio"}
        verticalSubText={
          <>
            Not satisfied with the old product? <br /> Why not search for a new one?
          </>
        }
      />

      <div className="RoadMap-content-container">
        <RoadMapSection />
        <RoadMapSlide/>
      </div>
     
    </>
  );
};

export default RoadMapTemplate;
