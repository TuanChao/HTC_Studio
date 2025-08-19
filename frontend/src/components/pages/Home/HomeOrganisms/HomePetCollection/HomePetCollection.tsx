import React, { useContext } from "react";
import Marquee from "react-fast-marquee";
import { HomeContext } from "../../context";
import "./HomePetCollection.css";

const HomePetCollection: React.FC = () => {
  const { listPet } = useContext(HomeContext);

  if (!listPet || !listPet.length) return null;

  return (
    <div className="home-pet-container animate-me">
      <div className="home-pet-title">Pet collection</div>
      <div className="hall">
        {listPet.map((row, rowIndex) => (
          <Marquee
            autoFill={false}
            key={rowIndex}
            gradient={false}
            speed={30}
            direction={rowIndex % 2 === 0 ? "left" : "right"}
            pauseOnHover={false}
            pauseOnClick={false}
          >
            {row.map((item, index) => (
              <div className="card-pet" key={index} onClick={() => window.open(item.link_x, "_blank")}>
                <div className="image-pet-wrapper">
                  <img src={item.avatar} alt={item.name} className="image-pet" />
                </div>
                <p className="pet-name">{item.name}</p>
              </div>
            ))}
          </Marquee>
        ))}
      </div>

      {/* <div className="logo-under-ground" />

      <div className="logo-under-ground1" /> */}
    </div>
  );
};

export default HomePetCollection;
