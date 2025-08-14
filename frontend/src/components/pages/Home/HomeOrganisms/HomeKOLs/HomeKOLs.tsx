import React, { useContext } from "react";
import Marquee from "react-fast-marquee";
import { HomeContext } from "../../context";
import "./HomeKOLs.css";

const HomeKOLs: React.FC = () => {
  const { listKol } = useContext(HomeContext);

  if (!listKol || !listKol.length) return null;

  return (
    <div className="home-kol-container animate-me">
      <div className="home-kol-title">KOLs</div>
      <div className="hall">
        {listKol.map((row, rowIndex) => (
          <Marquee
            autoFill
            key={rowIndex}
            gradient={false}
            speed={30}
            direction={rowIndex % 2 === 0 ? "left" : "right"}
            pauseOnHover={false}
            pauseOnClick={false}
          >
            {row.map((item, index) => (
              <div className="card-kol" key={index} onClick={() => window.open(item.link_x, "_blank")}>
                <div className="image-kol-wrapper">
                  <img src={item.avatar} alt={item.name} className="image-kol" />
                </div>
                <p className="kol-name">{item.name}</p>
              </div>
            ))}
          </Marquee>
        ))}
      </div>

      <div className="logo-under-ground" />

      <div className="logo-under-ground1" />
    </div>
  );
};

export default HomeKOLs;
