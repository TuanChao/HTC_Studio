import React from "react";
import { MENU_ARRAY } from "./Menubar.type";
import { SOCIAL_LIST } from "../Footer/Footer.type";

type Props = { isShow?: boolean; handleNavigate: (url: string) => void; handleToggleMenu: () => void };

const MenuMobile: React.FC<Props> = ({ isShow = false, handleNavigate, handleToggleMenu }) => {
  return (
    <>
      {/* Backdrop */}
      <div className={`menu-mobile-backdrop ${isShow ? "show" : ""}`} onClick={handleToggleMenu} />
      
      <div className={`menu-mobile-container ${isShow ? "show" : ""}`}>
        {/* Header with Logo and Close Button */}
        <div className="menu-mobile-header">
          <div className="menu-mobile-logo">
            <img 
              src="/HTC_logo_White_1.png" 
              alt="HTC Studio Logo" 
              width="120" 
              height="40"
              style={{ objectFit: 'contain' }}
            />
          </div>
          <button className="menu-close-btn" onClick={handleToggleMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="nav-mobile">
          <ul className="nav-list-mobile">
            {MENU_ARRAY.map((m, index) => {
              return (
                <li 
                  key={m.title} 
                  className="nav-item-mobile" 
                  onClick={() => {
                    handleNavigate(m.url);
                    handleToggleMenu();
                  }}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="nav-item-text">{m.title}</span>
                  <div className="nav-item-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Social Section */}
        <div className="menu-mobile-social">
          <div className="social-title">
            <span>CONNECT WITH US</span>
            <div className="social-title-line"></div>
          </div>
          <div className="social-grid">
            {SOCIAL_LIST.map((item, index) => {
              return (
                <div
                  key={item.title}
                  className="social-item"
                  onClick={() =>
                    item.title.includes("gmail.com")
                      ? (window.location = item.url as unknown as Location)
                      : window.open(item.url, "_blank", "noopener,noreferrer")
                  }
                  style={{ animationDelay: `${(MENU_ARRAY.length + index) * 0.1}s` }}
                >
                  <div className="social-icon-wrapper">
                    {item.icon}
                  </div>
                  <span className="social-text">{item.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="menu-mobile-footer">
          <div className="footer-decoration"></div>
          <span className="footer-text">HTC Studio © 2024</span>
        </div>
      </div>
    </>
  );
};

export default MenuMobile;
