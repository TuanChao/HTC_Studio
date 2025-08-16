import { DetailArtist } from "src/components/atoms/Artist/Artist.type";

export type ImageList = {
  id: number;
  picture: string;
  alt: string;
  artist_id: number;
  created_at: string;
  show_on_top: boolean;
  updated_at: string;
};

export const TAB_BANNER_TEXT = {
  Gallery: "Gallery",
  Artist: "Artist",
};

export const TAB_BANNER_SUB_TEXT = {
  Gallery: "Collect the works of the artist.",
  Artist: "Gather the best artists in web3",
};

export type ModalPreviewState = {
  isShow: boolean;
  imageList: ImageList[];
  detailArtist: DetailArtist;
};
