import { endpoint } from 'src/const/endpoint';
import httpRequest from 'src/utilities/services/httpRequest';

export interface KolDto {
  id: string;
  name: string;
  linkX?: string;
  avatar?: string;
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKolDto {
  name: string;
  linkX?: string;
  disabled?: boolean;
}

export interface UpdateKolDto {
  name?: string;
  linkX?: string;
  disabled?: boolean;
}

export interface PaginatedKolResult {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  datas: KolDto[];
}

export function getKols(page: number = 1, per_page: number = 10) {
  return httpRequest.get<PaginatedKolResult>(`${endpoint.kol}?page=${page}&per_page=${per_page}`);
}

export function getKol(id: string) {
  return httpRequest.get<KolDto>(`${endpoint.kol}/${id}`);
}

export function createKol(formData: FormData) {
  return httpRequest.post<KolDto>(endpoint.kol, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function updateKol(id: string, formData: FormData) {
  return httpRequest.put<KolDto>(`${endpoint.kol}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function deleteKol(id: string) {
  return httpRequest.delete<{ message: string }>(`${endpoint.kol}/${id}`);
}