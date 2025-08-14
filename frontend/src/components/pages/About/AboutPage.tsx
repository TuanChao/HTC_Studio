import React from "react";
import "./AboutPage.css";
import AboutTemplate from "./AboutTemplate";
import { AboutContextProvider } from "./context";

const AboutPage: React.FC = () => {
  return (
    <AboutContextProvider value={{}}>
      <div className="about-page">
        <AboutTemplate />
      </div>
    </AboutContextProvider>
  );
};

export default AboutPage;
