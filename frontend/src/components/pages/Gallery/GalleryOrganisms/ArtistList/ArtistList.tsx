import React, { useContext } from "react";
import Artist, { ArtistContainer } from "src/components/atoms/Artist/Artist";
import { GalleryContext } from "../../context";

const ArtistList: React.FC = () => {
  const { listArtist, onSelectArtist } = useContext(GalleryContext);

  return (
    <div className="artist-gallery-container">
      <ArtistContainer>
        {listArtist.map((team) => (
          <Artist key={team.id} detailArtist={team} type="artist" onSelectArtist={onSelectArtist} />
        ))}
      </ArtistContainer>
    </div>
  );
};

export default ArtistList;
