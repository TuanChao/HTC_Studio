import { ImageList } from "src/components/pages/Gallery/Gallery.type";
import { endpoint } from "src/const/endpoint";
import httpRequest from "src/utilities/services/httpRequest";
import { ArtistImageRes, ListArtistImageParams } from "../artists/getArtist";

export type ListArtistType = {
  current_page: number;
  datas: ImageList[];
  total_pages: number;
  total_records: number;
};

export type ListGalleryAPIParams = {
  page: number;
};

export function getListGallery(params: ListGalleryAPIParams) {
  const stringParams = Object.fromEntries(Object.entries(params).map(([key, value]) => [key, String(value)]));
  const searchParams = new URLSearchParams(stringParams).toString();

  return httpRequest.get<ListArtistType>(`${endpoint.gallery}?${searchParams}`);
}

export function getListGalleryImage(params: ListArtistImageParams) {
  return httpRequest.get<ArtistImageRes>(`${endpoint.gallery}/${params.id}/images`);
}
