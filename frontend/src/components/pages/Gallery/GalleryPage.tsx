import React, { useRef } from "react";
import { useAppSelector } from "src/app/appHooks";
import { useHandleScroll } from "../Home/hooks/useHandleScroll";
import GalleryTemplate from "./GalleryTemplate";
import { GalleryContextProvider } from "./context";
import { useArtistList } from "./hooks/useArtistList";
import { useGallery } from "./hooks/useGallery";
import { useGalleryAction } from "./hooks/useGalleryAction";

const GalleryPage: React.FC = () => {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { loading } = useAppSelector((state) => state.app);

  const isFirstMount = useRef<{ gallery: boolean; artist: boolean }>({ gallery: true, artist: true });

  const { scrollPosition } = useHandleScroll();
  const {
    tab,
    page,
    totalPage,
    modalPreview,
    selectedIndex,
    onCloseModal,
    onSelectArtist,
    onSelectGallery,
    handleChangeTab,
    handleChangePage,
    handleChangeTotal,
  } = useGalleryAction();
  const { listArtist, totalArtist } = useArtistList({
    tab,
    page,
    totalPage,
    isFirstMount,
    handleChangePage,
    handleChangeTotal,
  });
  const { images, totalGallery } = useGallery({
    tab,
    page,
    loading,
    totalPage,
    observerRef,
    isFirstMount,
    handleChangePage,
    handleChangeTotal,
  });

  return (
    <GalleryContextProvider
      value={{
        tab: tab,
        images,
        loading,
        listArtist,
        observerRef,
        totalArtist,
        modalPreview,
        totalGallery,
        selectedIndex,
        scrollPosition,
        onCloseModal,
        onSelectArtist,
        handleChangeTab,
        onSelectGallery,
      }}
    >
      <GalleryTemplate />
    </GalleryContextProvider>
  );
};

export default GalleryPage;
