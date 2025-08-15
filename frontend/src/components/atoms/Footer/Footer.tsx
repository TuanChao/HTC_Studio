import React from "react";
import "./Footer.css";
import logo from "src/assets/images/HTC_logo_White_1.png";
import { MENU_ARRAY } from "../MenuBar/Menubar.type";
import { useNavigate } from "react-router-dom";
import { SOCIAL_LIST } from "./Footer.type";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="logo-detail-container">
          <div className="logo-footer-container">
            <img src={logo} alt="logo-footer" className="logo-footer" />
          </div>

          <div className="detail-content">
            HTC ALWAYS STRIVES TO CREATE THE BEST ARTISTIC PRODUCTS, CONTRIBUTING TO THE GROWTH OF WEB3 ART, CREATING
            JOBS AND PASSION FOR ARTISTS. WE ALWAYS LISTEN TO THE COMMUNITY'S FEEDBACK AND GROW TOGETHER.
          </div>
        </div>

        <div className="contact-container">
          <div className="quote-team-container">
            <div className="quote-content">COLLABORATION - DEVELOPMENT</div>
            <div className="copyright-content">© 2024 HTC, All Rights Reserved</div>
          </div>

          <div className="contact-social">
            <div className="navigate-container">
              <div className="contact-title">NAVIGATION</div>
              {MENU_ARRAY.map((item) => {
                return (
                  <div className="contact-content-item" key={item.title} onClick={() => navigate(item.url)}>
                    {item.title}
                  </div>
                );
              })}
            </div>

            <div className="navigate-container">
              <div className="contact-title">CONTACT AND SOCIAL</div>
              {SOCIAL_LIST.map((item) => {
                return (
                  <div
                    key={item.title}
                    className="contact-content-item"
                    onClick={() =>
                      item.title.includes("gmail.com")
                        ? (window.location = item.url as unknown as Location)
                        : window.open(item.url, "_blank", "noopener,noreferrer")
                    }
                  >
                    <div className="icon-contact">{item.icon}</div> {item.title}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
