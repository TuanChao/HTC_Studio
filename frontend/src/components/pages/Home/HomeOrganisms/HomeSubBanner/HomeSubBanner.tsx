import React from "react";
import logoContent from "src/assets/images/HTC_logo_White_1.png";
import subBigBanner from "src/assets/images/Dragon_motor_11.jpg";
import subBanner from "src/assets/images/Poster_final_2.jpg";
import "./HomeSubBanner.css";

const HomeSubBanner: React.FC = () => {
  const tagIcon = (
    <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.21268 0.0467155C5.14111 -0.0155718 5.03374 -0.0155718 4.96217 0.0467155L1.7413 1.91534L1.59814 2.03991L0.059289 4.12654C-0.0122858 4.15768 -0.012277 4.25111 0.0235104 4.3134L4.99795 14.9023C5.06952 15.0268 5.24847 15.0268 5.32004 14.9334L11.9765 6.11974C12.0123 6.05745 12.0123 5.96402 11.9407 5.93287L5.21268 0.0467155Z"
        fill="#0A2DE9"
        data-darkreader-inline-fill=""
      ></path>
    </svg>
  );

  const textContent = (
    <>
      HTC GROUP is a community of over 100 artists and art enthusiasts, where we create a space for artists and art lovers to connect and learn from each other. Our goal is to strengthen the art community, as fan art plays an important role in Web3.
      <br />
      <br />
       We are here as a bridge to help artists more easily access Web3 ecosystems available within HTC, so they can build NFT projects on the ecosystems that HTC provides.
    </>
  );

  return (
    <div className="sub-banner-container">
      <div className="sub-banner row  animate-me">
        <div className="sub-banner-image-container col-lg-6 col-sm-12">
          <img src={subBanner} alt="sub-banner" className="sub-banner-image" />
        </div>
        <div className="sub-banner-content col-lg-6 col-sm-12">
          <img src={logoContent} alt="logo-content" width={200} className="logo-content" />

          <div className="vision-content">
            {tagIcon}

            <span className="vision-content-text">HTC GROUP</span>
          </div>

          <p className="sub-banner-team-description">{textContent}</p>
        </div>
      </div>

      <div className="sub-banner row  animate-me" style={{ maxWidth: "100%" }}>
        <img src={subBigBanner} alt="logo-content" className="sub-big-banner" />
      </div>
    </div>
  );
};

export default HomeSubBanner;
