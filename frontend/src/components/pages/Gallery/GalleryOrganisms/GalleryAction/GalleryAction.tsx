import React, { useContext } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { GalleryContext } from "../../context";
import ArtistList from "../ArtistList";
import GalleryList from "../GalleryList";
import "./GalleryAction.css";

const GalleryAction: React.FC = () => {
  const { tab, loading, totalArtist, observerRef, totalGallery, handleChangeTab } = useContext(GalleryContext);
  return (
    <div className="gallery-action-container">
      <Tabs activeKey={tab} onSelect={(tab) => tab && handleChangeTab(tab)}>
        <Tab
          eventKey="Gallery"
          title={
            <>
              Fan Art <span style={{ fontSize: "15px" }}>({totalGallery})</span>
            </>
          }
        >
          <GalleryList />
        </Tab>
        <Tab
          eventKey="Artist"
          title={
            <>
              Artist <span style={{ fontSize: "15px" }}>({totalArtist})</span>
            </>
          }
        >
          <div className="artist-title-container">
            <svg width="21" height="26" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5.21268 0.0467155C5.14111 -0.0155718 5.03374 -0.0155718 4.96217 0.0467155L1.7413 1.91534L1.59814 2.03991L0.059289 4.12654C-0.0122858 4.15768 -0.012277 4.25111 0.0235104 4.3134L4.99795 14.9023C5.06952 15.0268 5.24847 15.0268 5.32004 14.9334L11.9765 6.11974C12.0123 6.05745 12.0123 5.96402 11.9407 5.93287L5.21268 0.0467155Z"
                fill="#0A2DE9"
              ></path>
            </svg>

            <div className="artist-title">Top Artist</div>
          </div>

          <ArtistList />

          <div className="artist-title-container">
            <svg width="21" height="26" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5.21268 0.0467155C5.14111 -0.0155718 5.03374 -0.0155718 4.96217 0.0467155L1.7413 1.91534L1.59814 2.03991L0.059289 4.12654C-0.0122858 4.15768 -0.012277 4.25111 0.0235104 4.3134L4.99795 14.9023C5.06952 15.0268 5.24847 15.0268 5.32004 14.9334L11.9765 6.11974C12.0123 6.05745 12.0123 5.96402 11.9407 5.93287L5.21268 0.0467155Z"
                fill="#0A2DE9"
              ></path>
            </svg>

            <div className="artist-title">Other Artist</div>
          </div>
        </Tab>
      </Tabs>

      {loading && <div className="loading">Loading...</div>}
      <div ref={observerRef} className="observer-trigger"></div>
    </div>
  );
};

export default GalleryAction;
