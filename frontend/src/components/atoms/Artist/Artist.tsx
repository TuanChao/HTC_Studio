import React from "react";
import "./Artist.css";
import { DetailArtist, DetailMember } from "./Artist.type";

type Props = {
  detailArtist?: DetailArtist;
  detailMember?: DetailMember;
  onSelectArtist: (id: string) => void;
  type: "artist" | "team";
};

const Artist: React.FC<Props> = ({ type, detailMember, detailArtist, onSelectArtist }) => {
  const isArtist = type === "artist";
  const id = isArtist ? detailArtist?.id : detailMember?.id;
  const avatarUrl = isArtist ? detailArtist?.avatar : detailMember?.avatar;
  const name = isArtist ? detailArtist?.name : detailMember?.name;
  const linkProfile = isArtist
    ? `@${detailArtist?.link_x.split("x.com/")?.[1]?.split("?")[0]}`
    : detailMember?.position;
  const description = isArtist ? detailArtist?.style : detailMember?.description;
  const totalImage = detailArtist?.total_image;
  const link = isArtist ? detailArtist?.link_x : undefined;

  const clickXLink = (x: string) => {
    window.open(x, "_blank", "noopener,noreferrer");
  };

  return (
    <div onClick={() => id && onSelectArtist(id)} className="artist-container">
      <div className="avatar-artist-container">
        <img src={avatarUrl} alt={name} />
      </div>
      <div className="artist-detail-container">
        <div className="artist-name">{name}</div>
        <div
          className={`artist-link ${isArtist ? "artist" : ""}`}
          onClick={
            link
              ? (e) => {
                  e.stopPropagation();
                  clickXLink(link);
                }
              : undefined
          }
        >
          {linkProfile}
        </div>

        {isArtist && (
          <div className="total-image-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-images"
              viewBox="0 0 16 16"
            >
              <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
              <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1z" />
            </svg>
            <p>
              {totalImage} {totalImage !== undefined && totalImage > 1 ? "Images" : "Image"} on Fan Art
            </p>
          </div>
        )}

        <p className="artist-style">{description}</p>
      </div>
    </div>
  );
};

export default Artist;

export const ArtistContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="artist-list-container">{children}</div>;
};
