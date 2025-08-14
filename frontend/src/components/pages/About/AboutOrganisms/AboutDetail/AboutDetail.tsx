import React from "react";
import banner from "src/assets/images/Pet_1_2.jpg";

const AboutDetail: React.FC = () => {
  return (
    <div className="about-detail-container">
      <div className="about-detail-top">
        <div className="about-detail-top-description">
          <div className="des-top">WHAT IS HTCSTUDIO.COM?</div>
          <div className="des-bottom">
            HTC studio is a collective of talented artists specializing in creating and supporting visual art for web3
            projects. With a team experienced in creating high-quality 2d and 3d art, the studio focuses on providing
            customized creative solutions to meet the unique needs of blockchain-based initiatives.
          </div>
        </div>

        {/* <div className="about-detail-top-action">
          <a href="/gallery" className="detail-top-button">
            Browse Collection
          </a>
        </div> */}
      </div>

      <div className="about-detail-bottom">
        <div className="about-detail-bottom-left">
          <div className="bottom-left-text">
            <div className="des-top" style={{ lineHeight: "unset" }}>
              WHO'S BEHIND HTCSTUDIO.COM?
            </div>
            {/* <div className="des-bottom" style={{ margin: 0 }}>
              Every NFT within this collection is procedurally crafted using 18 distinct animated assets as its
              foundation
            </div> */}
          </div>

          <div className="bottom-left-text">
            <div className="des-top">MISSION</div>
            {/* <div className="des-bottom" style={{ margin: 0 }}>
              Benefits
            </div> */}

            <ul className="des-bottom-list">
              <li>
                <span>
                  The studio's mission is to enhance the visual identity of Web3 projects through exceptional art,
                  connecting the community and increasing the value of digital assets. HTC Studio creates impressive
                  designs and collaborates with clients to ensure the project aligns with their goals and target
                  audience.
                </span>
              </li>
              {/* <li>
                <span>Gain Sharing from the Ecosystem</span>
              </li>
              <li>
                <span>In-Game Reward Booster</span>
              </li>
              <li>
                <span>Priority Access to the Game Test</span>
              </li>
              <li>
                <span>IRL Events</span>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="about-detail-bottom-right" style={{ padding: 0 }}>
          <img src={banner} alt="banner" />
        </div>
      </div>
    </div>
  );
};

export default AboutDetail;
