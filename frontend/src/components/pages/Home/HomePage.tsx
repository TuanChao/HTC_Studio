import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import React, { useEffect } from "react";
import { HomeContextProvider } from "./context/HomeContext";
import "./HomePage.css";
import HomeTemplate from "./HomeTemplate";
import { useHandleScroll } from "./hooks/useHandleScroll";
import { useHandleKols } from "./hooks/useHandleKols";
gsap.registerPlugin(ScrollTrigger);

const HomePage: React.FC = () => {
  const { scrollPosition } = useHandleScroll();
  const { listKol } = useHandleKols();

  useEffect(() => {
    const elements = document.querySelectorAll(".animate-me");
    elements.forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 200, scale: 1.3 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "top 0%",
            scrub: true,
            onUpdate: (self) => {
              const shake = gsap.utils.mapRange(0, 1, -20, 20, self.progress);
              gsap.to(element, { y: shake, duration: 0.5 });
            },
          },
        }
      );
    });
  }, []);

  return (
    <HomeContextProvider value={{ listKol, scrollPosition }}>
      <div className="home-container .animate-me">
        <HomeTemplate />
      </div>
    </HomeContextProvider>
  );
};

export default HomePage;
