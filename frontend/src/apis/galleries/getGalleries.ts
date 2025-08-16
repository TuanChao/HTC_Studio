import { endpoint } from "src/const/endpoint";
import { convertStringValueObject } from "src/utilities/commons/utils";
import httpRequest from "src/utilities/services/httpRequest";

export type GalleryDto = {
  id: string;
  artistId: string;
  picture: string;
  showOnTop: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ListGalleriesType = {
  currentPage: number;
  datas: GalleryDto[];
  totalPages: number;
  totalRecords: number;
};

export type ListGalleriesAPIParams = {
  page: number;
  per_page?: number;
  artist_id?: string;
  show_on_top?: boolean;
};

export type CreateGalleryParams = {
  artistId: string;
  showOnTop?: boolean;
};

export function getListGalleries(params: ListGalleriesAPIParams) {
  const stringParams = convertStringValueObject(params);
  const searchParams = new URLSearchParams(stringParams).toString();

  return httpRequest.get<ListGalleriesType>(`${endpoint.gallery}?${searchParams}`);
}

export function createGallery(formData: FormData) {
  return httpRequest.post<GalleryDto>(`${endpoint.gallery}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function updateGallery(id: string, formData: FormData) {
  return httpRequest.put<GalleryDto>(`${endpoint.gallery}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function deleteGallery(id: string) {
  return httpRequest.delete(`${endpoint.gallery}/${id}`);
}

export function getGallery(id: string) {
  return httpRequest.get<GalleryDto>(`${endpoint.gallery}/${id}`);
}