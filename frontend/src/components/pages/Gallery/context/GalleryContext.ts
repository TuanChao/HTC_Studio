import React from "react";
import { DetailArtist } from "src/components/atoms/Artist/Artist.type";
import { ImageList, ModalPreviewState } from "../Gallery.type";

export interface GalleryContextProps {
  tab: string;
  images: ImageList[];
  loading: boolean;
  listArtist: DetailArtist[];
  totalArtist: number;
  modalPreview: ModalPreviewState;
  totalGallery: number;
  observerRef: React.MutableRefObject<HTMLDivElement | null>;
  selectedIndex: number;
  scrollPosition: number;
  onCloseModal: () => void;
  onSelectArtist: (id: string) => void;
  onSelectGallery: (id: string) => void;
  handleChangeTab: (tab: string) => void;
}

export const GalleryContext = React.createContext<GalleryContextProps>({} as GalleryContextProps);
export const GalleryContextProvider = GalleryContext.Provider;
