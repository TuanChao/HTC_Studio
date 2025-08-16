import { DetailArtist } from "src/components/atoms/Artist/Artist.type";
import { ImageList } from "src/components/pages/Gallery/Gallery.type";
import { endpoint } from "src/const/endpoint";
import { convertStringValueObject } from "src/utilities/commons/utils";
import httpRequest from "src/utilities/services/httpRequest";

export type ListArtistType = {
  currentPage: number;
  datas: DetailArtist[];
  totalPages: number;
  totalRecords: number;
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

export type CreateArtistParams = {
  name: string;
  style: string;
  linkX?: string;
  xTag?: string;
  disabled?: boolean;
  totalImage?: number;
};

export function createArtist(formData: FormData) {
  return httpRequest.post<DetailArtist>(`${endpoint.artist}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function updateArtist(id: string, formData: FormData) {
  return httpRequest.put<DetailArtist>(`${endpoint.artist}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function deleteArtist(id: string) {
  return httpRequest.delete(`${endpoint.artist}/${id}`);
}
