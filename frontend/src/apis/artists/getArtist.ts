import { DetailArtist } from "src/components/atoms/Artist/Artist.type";
import { ImageList } from "src/components/pages/Gallery/Gallery.type";
import { endpoint } from "src/const/endpoint";
import { convertStringValueObject } from "src/utilities/commons/utils";
import httpRequest from "src/utilities/services/httpRequest";

export type ListArtistType = {
  current_page: number;
  datas: DetailArtist[];
  total_pages: number;
  total_records: number;
};

export type ArtistImageRes = { artist: DetailArtist; pictures: ImageList[] };

export type ListArtistAPIParams = {
  page: number;
};

export type ListArtistImageParams = {
  id: string;
};

export function getListArtist(params: ListArtistAPIParams) {
  const stringParams = convertStringValueObject(params);
  const searchParams = new URLSearchParams(stringParams).toString();

  return httpRequest.get<ListArtistType>(`${endpoint.artist}?${searchParams}`);
}

export function getListArtistImage(params: ListArtistImageParams) {
  return httpRequest.get<ArtistImageRes>(`${endpoint.artist}/${params.id}/images`);
}
