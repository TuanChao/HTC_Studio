import React, { useContext } from "react";
import galleryBanner from "src/assets/images/Banner_2_2.jpg";
import artistBanner from "src/assets/images/Banner_1.jpg";
import { GalleryContext } from "../../context";
import { TAB_BANNER_SUB_TEXT, TAB_BANNER_TEXT } from "../../Gallery.type";
import "./GalleryBanner.css";
import HomeBanner from "src/components/pages/Home/HomeOrganisms/HomeBanner";

const GalleryBanner: React.FC = () => {
  const { tab, scrollPosition } = useContext(GalleryContext);

  return (
    <HomeBanner
      img={tab === "Gallery" ? galleryBanner : artistBanner}
      scrollPosition={scrollPosition}
      isShowVerticalText={true}
      isShowHorizontalText={true}
      horizontalMainText={"Choose and fit"}
      horizontalSubText={"Choose the product you like and that fits with your style."}
      verticalMainText={TAB_BANNER_TEXT[tab as keyof typeof TAB_BANNER_TEXT]}
      verticalSubText={TAB_BANNER_SUB_TEXT[tab as keyof typeof TAB_BANNER_SUB_TEXT]}
    />
  );
};

export default GalleryBanner;
